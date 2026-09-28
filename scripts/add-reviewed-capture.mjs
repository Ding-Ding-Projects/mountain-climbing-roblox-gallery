import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { copyFile, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'docs', 'evidence', 'gallery.json');
const imageDir = path.join(root, 'docs', 'evidence', 'images');
const args = process.argv.slice(2);

function usage() {
  console.error('Usage: node scripts/add-reviewed-capture.mjs --image <original-image> (--receipt <validated-receipt.json> | --construction-record <review-record.json>)');
  process.exit(2);
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index < 0 ? null : args[index + 1] || null;
}

const imageArg = valueAfter('--image');
const receiptArg = valueAfter('--receipt');
const constructionRecordArg = valueAfter('--construction-record');
if (!imageArg || Boolean(receiptArg) === Boolean(constructionRecordArg)) usage();

const imagePath = path.resolve(imageArg);
const receiptPath = path.resolve(receiptArg || constructionRecordArg);
const ext = path.extname(imagePath).toLowerCase();
if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) throw new Error('Image must be JPEG, PNG, or WebP.');

const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
const requiredStringFields = ['captureId', 'sourceRevision', 'state', 'title', 'caption', 'alt', 'method', 'imageSha256'];
for (const key of requiredStringFields) {
  if (typeof receipt[key] !== 'string' || !receipt[key].trim() || receipt[key].length > 1000) throw new Error(`Receipt field is missing or exceeds the 1,000 character limit: ${key}`);
}
if (receipt.schemaVersion !== 1) throw new Error('Unsupported record schemaVersion.');
if (!/^[a-z0-9][a-z0-9_-]{2,63}$/i.test(receipt.captureId)) throw new Error('captureId must be a short plain identifier.');
if (!/^[a-f0-9]{40,64}$/i.test(receipt.sourceRevision)) throw new Error('sourceRevision must be a full 40 to 64 character hexadecimal revision.');
if (!/^[a-f0-9]{64}$/i.test(receipt.imageSha256)) throw new Error('imageSha256 must be a SHA-256 hex digest.');
if (receipt.method !== 'Roblox Studio MCP') throw new Error('Capture method must identify Roblox Studio MCP.');
if (!receipt.viewport || !Number.isInteger(receipt.viewport.width) || !Number.isInteger(receipt.viewport.height) || receipt.viewport.width < 1 || receipt.viewport.height < 1) throw new Error('Receipt viewport must include positive integer width and height.');
if (!['light', 'dark', 'not-applicable'].includes(receipt.theme)) throw new Error('Receipt theme is not supported.');
if (!receipt.privacyReview || receipt.privacyReview.result !== 'passed' || receipt.privacyReview.pixelsReviewed !== true || receipt.privacyReview.metadataReviewed !== true || receipt.privacyReview.filenameReviewed !== true) throw new Error('Receipt must record passed pixel, metadata, and filename review.');
if (receipt.capturedAt !== null && (typeof receipt.capturedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(receipt.capturedAt) || Number.isNaN(Date.parse(receipt.capturedAt)))) throw new Error('capturedAt must be null or an ISO timestamp with an explicit timezone.');

const isConstructionRecord = constructionRecordArg !== null;
if (isConstructionRecord) {
  if (receipt.recordType !== 'gallery-review-record' || receipt.captureClass !== 'construction-progress' || receipt.captureMode !== 'Edit') throw new Error('A construction record must identify a reviewed Edit-mode construction-progress capture.');
  if (typeof receipt.sourcePath !== 'string' || !/^evidence\/world\/[A-Za-z0-9._/-]+$/.test(receipt.sourcePath) || receipt.sourcePath.split('/').includes('..')) throw new Error('Construction sourcePath must be a repository-relative evidence path.');
  if (receipt.scale !== null || receipt.theme !== 'not-applicable' || receipt.capturedAt !== null) throw new Error('Unavailable construction metadata must stay null or not-applicable.');
  if (!Array.isArray(receipt.limitations) || receipt.limitations.length < 2 || receipt.limitations.some(x => typeof x !== 'string' || !x.trim() || x.length > 512)) throw new Error('Construction records need bounded, explicit limitations.');
  if (!receipt.limitations.some(x => /not final realism evidence/i.test(x)) || !receipt.limitations.some(x => /not Play mode/i.test(x))) throw new Error('Construction records must disclaim final realism and Play-mode proof.');
  if (!receipt.rightsReview || receipt.rightsReview.result !== 'passed' || typeof receipt.rightsReview.basis !== 'string' || !receipt.rightsReview.basis.trim() || receipt.rightsReview.basis.length > 1000) throw new Error('Construction records need an explicit passing asset-rights review basis.');
  if (!receipt.metadataReview || receipt.metadataReview.result !== 'passed' || typeof receipt.metadataReview.summary !== 'string' || !receipt.metadataReview.summary.trim() || receipt.metadataReview.summary.length > 1000) throw new Error('Construction records need an explicit metadata review result.');
  if (typeof receipt.privacyReview.reviewer !== 'string' || !receipt.privacyReview.reviewer.trim() || receipt.privacyReview.reviewer.length > 120) throw new Error('Construction records need a bounded reviewer label.');
} else {
  if (receipt.recordType !== 'capture-receipt' || receipt.captureClass !== 'final-review') throw new Error('Only validated final-review capture receipts can use --receipt.');
  if (typeof receipt.scale !== 'number' || receipt.scale <= 0 || receipt.scale > 4) throw new Error('Final-review receipt scale must be a positive number no greater than 4.');
}

const imageBytes = await readFile(imagePath);
if (imageBytes.byteLength === 0 || imageBytes.byteLength > 25 * 1024 * 1024) throw new Error('Image size must be between 1 byte and 25 MiB.');
const signatureOk = ext === '.png'
  ? imageBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  : ext === '.webp'
    ? imageBytes.toString('ascii', 0, 4) === 'RIFF' && imageBytes.toString('ascii', 8, 12) === 'WEBP'
    : imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
if (!signatureOk) throw new Error('Image bytes do not match the file extension.');
const digest = createHash('sha256').update(imageBytes).digest('hex');
if (digest.toLowerCase() !== receipt.imageSha256.toLowerCase()) throw new Error('Image SHA-256 does not match the validated capture receipt.');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.images) || !Array.isArray(manifest.excluded)) throw new Error('Gallery manifest has an unsupported shape.');
if (manifest.images.some(item => item.captureId === receipt.captureId)) throw new Error('This captureId is already in the gallery manifest.');

const filename = `${receipt.captureId}${ext === '.jpeg' ? '.jpg' : ext}`;
const targetPath = path.join(imageDir, filename);
if (path.dirname(targetPath) !== imageDir) throw new Error('Resolved image target is outside the evidence directory.');
await mkdir(imageDir, { recursive: true });
await copyFile(imagePath, targetPath, constants.COPYFILE_EXCL);

manifest.images.push({
  captureClass: receipt.captureClass,
  captureId: receipt.captureId,
  path: `images/${filename}`,
  sha256: digest,
  sourceRevision: receipt.sourceRevision,
  state: receipt.state,
  title: receipt.title,
  caption: receipt.caption,
  alt: receipt.alt,
  location: receipt.location || '',
  activity: receipt.activity || '',
  stage: receipt.stage || '',
  viewport: receipt.viewport,
  scale: receipt.scale,
  theme: receipt.theme,
  method: receipt.method,
  captureMode: receipt.captureMode || '',
  capturedAt: receipt.capturedAt,
  receiptValidated: !isConstructionRecord,
  reviewRecordValidated: isConstructionRecord,
  limitations: isConstructionRecord ? receipt.limitations : [],
  rightsReview: isConstructionRecord ? receipt.rightsReview : null,
  metadataReview: isConstructionRecord ? receipt.metadataReview : null,
  privacyReviewer: isConstructionRecord ? receipt.privacyReview.reviewer : null,
  privacyReview: 'passed'
});

const temporaryManifestPath = `${manifestPath}.tmp`;
try {
  await writeFile(temporaryManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  await rename(temporaryManifestPath, manifestPath);
} catch (error) {
  await unlink(temporaryManifestPath).catch(() => {});
  await unlink(targetPath).catch(() => {});
  throw error;
}
console.log(`Added ${receipt.captureClass} capture ${receipt.captureId} with SHA-256 ${digest}`);
