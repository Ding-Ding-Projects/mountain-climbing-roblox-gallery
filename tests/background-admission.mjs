import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const image = path.resolve(process.argv[2] || '');
const record = JSON.parse(readFileSync('docs/evidence/records/hotel-reception-edit205-001.json', 'utf8'));
const source = readFileSync('scripts/add-reviewed-capture.mjs');
const root = mkdtempSync(path.join(tmpdir(), 'gallery-admission-'));
let count = 0;
function run(name, change, accepted = false, final = false) {
  const target = path.join(root, name);
  mkdirSync(path.join(target, 'scripts'), { recursive: true });
  mkdirSync(path.join(target, 'docs/evidence'), { recursive: true });
  writeFileSync(path.join(target, 'scripts/add-reviewed-capture.mjs'), source);
  writeFileSync(path.join(target, 'docs/evidence/gallery.json'), JSON.stringify({ schemaVersion: 1, images: [], excluded: [] }));
  const value = structuredClone(record);
  change(value);
  const recordPath = path.join(target, 'record.json');
  writeFileSync(recordPath, JSON.stringify(value));
  const result = spawnSync(process.execPath, [path.join(target, 'scripts/add-reviewed-capture.mjs'), '--image', image, final ? '--receipt' : '--construction-record', recordPath], { encoding: 'utf8' });
  assert.equal(result.status === 0, accepted, `${name}: ${result.stderr}`);
  const manifest = JSON.parse(readFileSync(path.join(target, 'docs/evidence/gallery.json'), 'utf8'));
  assert.equal(manifest.images.length, accepted ? 1 : 0);
  if (accepted) {
    assert.deepEqual(readFileSync(path.join(target, 'docs/evidence', manifest.images[0].path)), readFileSync(image));
    assert.deepEqual(manifest.images[0].captureContext, record.captureContext);
    assert.equal(manifest.images[0].receiptValidated, false);
  }
  count++;
}
run('valid', () => {}, true);
run('unknown-route', r => { r.method = 'unverified image route'; });
run('extra-private-field', r => { r.captureContext.machinePath = 'private'; });
run('dimensions', r => { r.viewport.width++; });
run('reversed-clock', r => { r.captureContext.captureEndUTC = '2026-10-04T19:23:20Z'; });
run('unbounded-clock', r => { r.captureContext.captureEndUTC = '2026-10-04T20:23:22Z'; });
run('missing-context', r => { delete r.captureContext; });
run('missing-limit', r => { r.limitations = r.limitations.filter(x => !x.includes('formal headless')); });
run('play-mode', r => { r.captureMode = 'Play'; });
run('final-evidence', () => {}, false, true);
console.log(`PASS background construction admission: ${count} cases; original bytes preserved; formal acceptance remains false`);
