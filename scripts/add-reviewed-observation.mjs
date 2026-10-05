import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { copyFile, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { acceptedObservation } from '../docs/evidence/observation-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const value = flag => args[args.indexOf(flag) + 1];
if (!args.includes('--image') || !args.includes('--review-record')) throw new Error('Usage: node scripts/add-reviewed-observation.mjs --image <original-image> --review-record <review-record.json>');
const original = path.resolve(value('--image'));
const record = JSON.parse(await readFile(path.resolve(value('--review-record')), 'utf8'));
if (!acceptedObservation(record)) throw new Error('Historical observation review is incomplete or contains unsupported fields.');
const ext = path.extname(original).toLowerCase().replace('.jpeg','.jpg');
if (!['.jpg','.png','.webp'].includes(ext)) throw new Error('Only JPEG, PNG and WebP observations are supported.');
const bytes = await readFile(original);
if (bytes.length !== record.imageBytes || createHash('sha256').update(bytes).digest('hex') !== record.imageSha256) throw new Error('Original bytes differ from the reviewed image.');
function dimensions(data) {
  if (ext === '.png' && data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && data.length >= 24) return [data.readUInt32BE(16),data.readUInt32BE(20)];
  if (ext === '.jpg' && data[0] === 255 && data[1] === 216) {
    let i=2;
    while(i+3<data.length){if(data[i++]!==255)continue;let marker=data[i++];while(marker===255)marker=data[i++];if(marker===216||marker===217)continue;const length=data.readUInt16BE(i);if(length<2||i+length>data.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)&&length>=7)return [data.readUInt16BE(i+5),data.readUInt16BE(i+3)];i+=length;}
  }
  throw new Error('Image dimensions cannot be validated from supported original bytes.');
}
const [width,height]=dimensions(bytes);
if(width!==record.viewport.width||height!==record.viewport.height)throw new Error('Image dimensions differ from the reviewed original.');
const manifestPath=path.join(root,'docs/evidence/gallery.json');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
if(manifest.schemaVersion!==1||!Array.isArray(manifest.images)||!Array.isArray(manifest.excluded))throw new Error('Unsupported gallery manifest.');
if(manifest.images.some(x=>x.sha256===record.imageSha256||x.captureId===record.captureId))throw new Error('This original image or capture identifier is already published in the manifest.');
const filename=record.captureId+ext;
const target=path.join(root,'docs/evidence/images',filename);
const recordTarget=path.join(root,'docs/evidence/records',record.captureId+'.json');
await mkdir(path.dirname(target),{recursive:true});await mkdir(path.dirname(recordTarget),{recursive:true});
const temporary=manifestPath+'.tmp';let copied=false,saved=false;
try{
  await copyFile(original,target,constants.COPYFILE_EXCL);copied=true;
  await writeFile(recordTarget,JSON.stringify(record,null,2)+'\n',{flag:'wx'});saved=true;
  manifest.images.push({captureClass:record.captureClass,captureId:record.captureId,path:'images/'+filename,sha256:record.imageSha256,sourceRevision:record.sourceRevision,sourcePath:null,sourceScope:record.sourceScope,state:record.state,title:record.title,caption:record.caption,alt:record.alt,location:record.location,activity:record.activity,stage:record.stage,evidenceSubject:record.evidenceSubject,viewport:record.viewport,scale:null,theme:'not-applicable',method:record.method,captureMode:record.captureMode,captureContext:null,capturedAt:null,receiptValidated:false,reviewRecordValidated:true,limitations:record.limitations,rightsReview:record.rightsReview,metadataReview:record.metadataReview,privacyReviewer:record.privacyReview.reviewer,privacyReview:'passed',observationReview:record});
  await writeFile(temporary,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});await rename(temporary,manifestPath);
}catch(error){await unlink(temporary).catch(()=>{});if(copied)await unlink(target).catch(()=>{});if(saved)await unlink(recordTarget).catch(()=>{});throw error;}
console.log('Added reviewed observation '+record.captureId+' with original SHA-256 '+record.imageSha256);
