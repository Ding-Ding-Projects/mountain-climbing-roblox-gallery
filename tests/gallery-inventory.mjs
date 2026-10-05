import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { acceptedObservationItem } from '../docs/evidence/observation-contract.mjs';
const manifest=JSON.parse(readFileSync('docs/evidence/gallery.json','utf8'));
const source=readFileSync('docs/index.html','utf8');
const start=source.indexOf('  function acceptedRecord(item){');
const end=source.indexOf('  function galleryImageUrl(item)',start);
assert(start>=0&&end>start,'Exact admission function boundary must exist');
const accept=new Function('acceptedObservationItem',source.slice(start,end)+'\nreturn acceptedRecord;')(acceptedObservationItem);
assert(source.includes("import { acceptedObservationItem } from './evidence/observation-contract.mjs';"),'Browser must use shared observation contract');
assert(source.includes('length:Math.min(6,images.length)'),'Manifest image verification must use bounded concurrency');
assert.equal(manifest.images.length,manifest.inventoryReview.approvedDistinctImages);
assert.equal(manifest.excluded.length,manifest.inventoryReview.excludedDistinctImages);
assert.equal(manifest.inventoryReview.distinctSourceImagesReviewed,manifest.images.length+manifest.excluded.length);
const hashes=new Set();const ids=new Set();let bytes=0;
for(const item of manifest.images){
  assert(accept(item),item.captureId+' must be admitted by the actual browser function');
  assert(/^images\/[A-Za-z0-9][A-Za-z0-9._-]{1,127}\.(?:jpg|png|webp)$/i.test(item.path));
  const original=readFileSync('docs/evidence/'+item.path);
  assert.equal(createHash('sha256').update(original).digest('hex'),item.sha256,item.captureId);
  assert(!hashes.has(item.sha256),'No duplicate original bytes');assert(!ids.has(item.captureId),'No duplicate capture identifiers');hashes.add(item.sha256);ids.add(item.captureId);bytes+=original.length;
  if(item.captureClass==='historical-observation'){
    const record=JSON.parse(readFileSync('docs/evidence/records/'+item.captureId+'.json','utf8'));
    assert.deepEqual(item.observationReview,record);
    assert.equal(original.length,record.imageBytes);
    const bad=structuredClone(item);bad.observationReview.privacyReview.originalInspected=false;assert.equal(accept(bad),false,'Missing original review must turn admission red');
    const invented=structuredClone(item);invented.capturedAt='2026-01-01T00:00:00Z';assert.equal(accept(invented),false,'Invented capture timestamp must turn admission red');
  }
}
for(const withheld of manifest.excluded){assert(!hashes.has(withheld.sha256),'Excluded original cannot appear in gallery');assert(typeof withheld.reason==='string'&&withheld.reason.length>0);}
console.log(`PASS gallery inventory: ${manifest.images.length} unique originals admitted, ${manifest.excluded.length} accounted exclusions, ${bytes} unchanged bytes; every observation has negative review and timestamp regression`);
