import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync,mkdirSync,readFileSync,writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { acceptedObservation,acceptedObservationItem } from '../docs/evidence/observation-contract.mjs';
const image=path.resolve('docs/evidence/images/forest-ascent-overview-001.jpg');
const bytes=readFileSync(image);
const record={schemaVersion:1,recordType:'observation-review-record',captureClass:'historical-observation',captureId:'history-test-001',imageSha256:createHash('sha256').update(bytes).digest('hex'),imageBytes:bytes.length,sourceRevision:null,sourceScope:'Source revision unavailable; historical appearance only.',state:'Historical scene observation',title:'Historical scene',caption:'Historical scene only.',alt:'An overhead forest scene.',location:'Forest',activity:'Historical observation',stage:'Historical',evidenceSubject:'Roblox scene',viewport:{width:1264,height:830},scale:null,theme:'not-applicable',method:'Historical project capture; acquisition route unavailable',captureMode:'Unknown',capturedAt:null,receiptValidated:false,reviewRecordValidated:true,limitations:['Historical observation, not final acceptance evidence.','Capture time is unavailable.','Source revision is unavailable.'],privacyReview:{result:'passed',pixelsReviewed:true,metadataReviewed:true,filenameReviewed:true,originalInspected:true,reviewer:'Image review'},rightsReview:{result:'passed',basis:'Owner authorized scene publication.'},metadataReview:{result:'passed',summary:'No private metadata observed.'}};
let count=0;
assert.equal(acceptedObservation(record),true);count++;
for(const [name,mutate] of [
  ['invented date',r=>r.capturedAt='2026-01-01T00:00:00Z'],
  ['partial source',r=>r.sourceRevision='123'],
  ['unchecked original',r=>r.privacyReview.originalInspected=false],
  ['private context',r=>r.privatePath='secret'],
  ['missing limitation',r=>r.limitations=r.limitations.filter(x=>!x.includes('acceptance'))],
  ['invented receipt',r=>r.receiptValidated=true],
  ['interface mislabeled play',r=>{r.evidenceSubject='Project interface';r.captureMode='Play'}],
  ['invented scale',r=>r.scale=1],
  ['bad size',r=>r.imageBytes=0]
]){const broken=structuredClone(record);mutate(broken);assert.equal(acceptedObservation(broken),false,name);count++;}
const root=mkdtempSync(path.join(tmpdir(),'observation-admission-'));
mkdirSync(path.join(root,'scripts'),{recursive:true});mkdirSync(path.join(root,'docs/evidence'),{recursive:true});
writeFileSync(path.join(root,'scripts/add-reviewed-observation.mjs'),readFileSync('scripts/add-reviewed-observation.mjs'));
writeFileSync(path.join(root,'docs/evidence/observation-contract.mjs'),readFileSync('docs/evidence/observation-contract.mjs'));
writeFileSync(path.join(root,'docs/evidence/gallery.json'),JSON.stringify({schemaVersion:1,images:[],excluded:[]}));
const recordPath=path.join(root,'review.json');
const run=r=>{writeFileSync(recordPath,JSON.stringify(r));return spawnSync(process.execPath,[path.join(root,'scripts/add-reviewed-observation.mjs'),'--image',image,'--review-record',recordPath],{encoding:'utf8'});};
const dimensions=structuredClone(record);dimensions.viewport.width++;assert.notEqual(run(dimensions).status,0);count++;
const wrongHash=structuredClone(record);wrongHash.imageSha256='0'.repeat(64);assert.notEqual(run(wrongHash).status,0);count++;
const valid=run(record);assert.equal(valid.status,0,valid.stderr);count++;
const manifest=JSON.parse(readFileSync(path.join(root,'docs/evidence/gallery.json'),'utf8'));const item=manifest.images[0];
assert.deepEqual(readFileSync(path.join(root,'docs/evidence',item.path)),bytes);count++;
assert.equal(acceptedObservationItem(item),true);count++;
for(const key of ['title','caption','sourceRevision','captureMode','sha256']){const bad=structuredClone(item);bad[key]='forged';assert.equal(acceptedObservationItem(bad),false,key);count++;}
assert.notEqual(run(record).status,0);count++;
console.log(`PASS observation admission: ${count} cases; original bytes preserved; unavailable provenance and non-acceptance enforced`);
