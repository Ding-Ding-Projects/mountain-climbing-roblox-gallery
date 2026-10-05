import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verifyProgressively } from '../docs/evidence/progressive-verification.mjs';
let cases = 0;
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const items = Array.from({ length: 5 }, (_, id) => ({ id, _verified: true }));
const waits = items.map(deferred), batches = [], statuses = [];
let active = 0, maximum = 0, settled = false;
const run = verifyProgressively(items, async item => {
  active++; maximum = Math.max(maximum, active);
  try { return await waits[item.id].promise; } finally { active--; }
}, { concurrency: 3, batchDelay: 1000, onVerifiedBatch: batch => { assert(batch.every(x => x._verified)); batches.push(batch.map(x => x.id)); }, onProgress: state => statuses.push(state) }).then(x => { settled = true; return x; });
assert.equal(items.some(x => x._verified), false);cases++;
waits[0].resolve(true);await Promise.resolve();await Promise.resolve();await Promise.resolve();
assert.deepEqual(batches, [[0]], 'The first verified original must appear before a later request finishes');assert.equal(settled, false);assert.equal(items[4]._verified, false);cases++;
waits[1].resolve(false);await Promise.resolve();await Promise.resolve();await Promise.resolve();
assert.equal(items[1]._verified, false);assert.equal(batches.flat().includes(1), false);cases++;
waits[2].resolve(true);waits[3].resolve(true);waits[4].resolve(true);
const result = await run;
assert.deepEqual(result, { checked: 5, verified: 4, total: 5, failed: 1, complete: true });assert.equal(statuses.at(-1).checked, 5);assert.deepEqual(batches.flat(), [0,2,3,4]);assert.equal(batches.length, 2, 'Later successes should be batched, not repaint once per image');cases++;
assert.equal(maximum, 3);cases++;
for (const [checked, state] of statuses.entries()) { assert.equal(state.checked, checked);assert.equal(state.failed, state.checked-state.verified);assert(state.verified<=state.checked&&state.checked<=state.total); }cases++;
const failed=[];const rejected=await verifyProgressively([{id:0},{id:1}],async item=>{if(item.id===0)throw new Error('network unavailable');return true;},{onVerifiedBatch:b=>failed.push(...b.map(x=>x.id)),onProgress:()=>{}});
assert.deepEqual(failed,[1]);assert.deepEqual(rejected,{checked:2,verified:1,total:2,failed:1,complete:true});cases++;
const complete=await verifyProgressively([],async()=>true,{onVerifiedBatch:()=>assert.fail('Empty inventory has no image batch'),onProgress:state=>assert(state.complete)});assert.deepEqual(complete,{checked:0,verified:0,total:0,failed:0,complete:true});cases++;
await assert.rejects(verifyProgressively([],async()=>true,{concurrency:7,onVerifiedBatch:()=>{},onProgress:()=>{}}),/Invalid bounded/);cases++;
const source=readFileSync('docs/index.html','utf8');
assert(source.includes("import { verifyProgressively } from './evidence/progressive-verification.mjs';"));assert(source.includes('paint({incremental:true})'),'Progress must preserve existing card nodes');assert(source.includes('buildFacets({incremental:true})'),'Progress must preserve focused facet nodes');assert(source.includes('verificationProgress'),'The browser must render truthful verification progress');cases++;
class Element {
  constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.attributes={};this.className='';this.parent=null;}
  append(...nodes){for(const node of nodes){node.remove();node.parent=this;this.children.push(node);}}
  prepend(node){node.remove();node.parent=this;this.children.unshift(node);}
  after(node){const parent=this.parent;node.remove();node.parent=parent;parent.children.splice(parent.children.indexOf(this)+1,0,node);}
  remove(){if(this.parent){this.parent.children.splice(this.parent.children.indexOf(this),1);this.parent=null;}}
  replaceChildren(){this.children.forEach(node=>node.parent=null);this.children=[];}
  setAttribute(key,value){this.attributes[key]=value;}
  addEventListener(){}
  querySelectorAll(selector){const found=[];const matches=node=>selector==='.empty'?node.className==='empty':selector==='article[data-capture-id]'?node.tag==='article'&&node.dataset.captureId:node.tag===selector;for(const node of this.children){if(matches(node))found.push(node);found.push(...node.querySelectorAll(selector));}return found;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
const nodes=new Map(['#gallery-grid','#image-count','#stage-count','#result-count','#search-mode-status','#gallery-search','#facet-location'].map(id=>[id,new Element('div')]));
nodes.get('#gallery-search').value='';
const document={activeElement:null,createElement:tag=>new Element(tag)};
const $=id=>nodes.get(id);
const scene=id=>({captureId:id,title:id,location:'Mountain',stage:'Historical',captureClass:'historical-observation',captureMode:'Unknown',evidenceSubject:'Roblox scene',viewport:{width:10,height:10},limitations:[],_verified:false});
const scenes=[scene('first'),scene('second'),scene('third')];scenes[0]._verified=true;
const state={regex:false,filterLocation:'all'};
const filteredRows=()=>scenes.filter(x=>x._verified&&(state.filterLocation==='all'||x.location===state.filterLocation)&&x.title.includes($('#gallery-search').value));
const paintCode=source.slice(source.indexOf('  function paint('),source.indexOf('  function renderVerificationProgress'));
const paint=new Function('document','$','state','images','verificationProgress','compilePattern','filteredRows','activeFilters','textFor','emptyState','galleryImageUrl',paintCode+'\nreturn paint;')(document,$,state,scenes,{complete:false},()=>null,filteredRows,()=>true,key=>key==='resultCount'?n=>String(n):key,()=>{},x=>'image/'+x.captureId);
paint({incremental:true});const first=$('#gallery-grid').querySelectorAll('article[data-capture-id]')[0];const focused=first.querySelectorAll('a')[0];document.activeElement=focused;
scenes[1]._verified=true;paint({incremental:true});
assert.equal($('#gallery-grid').querySelectorAll('article[data-capture-id]')[0],first,'Progress must retain the existing card node');assert.equal(document.activeElement,focused);assert(first.querySelectorAll('a').includes(focused));assert.equal($('#gallery-grid').querySelectorAll('article[data-capture-id]').length,2);cases++;
$('#gallery-search').value='first';paint();const selected=$('#gallery-grid').querySelectorAll('article[data-capture-id]')[0];scenes[2]._verified=true;paint({incremental:true});assert.equal($('#gallery-search').value,'first');assert.deepEqual($('#gallery-grid').querySelectorAll('article[data-capture-id]').map(x=>x.dataset.captureId),['first']);assert.equal($('#gallery-grid').querySelectorAll('article[data-capture-id]')[0],selected);cases++;
const facetCode=source.slice(source.indexOf('  function buildFacets('),source.indexOf('  function searchableText'));
const build=new Function('document','$','facets','images','state','facetValueLabel','save','paint',facetCode+'\nreturn buildFacets;')(document,$,[{target:'#facet-location',key:'filterLocation',field:'location'}],scenes,state,(f,x)=>x,()=>{},()=>{});
build({incremental:true});const mountain=$('#facet-location').querySelectorAll('button').find(x=>x.dataset.facetValue==='Mountain');document.activeElement=mountain;scenes.push({...scene('fourth'),location:'Lake',_verified:true});build({incremental:true});assert.equal($('#facet-location').querySelectorAll('button').find(x=>x.dataset.facetValue==='Mountain'),mountain);assert.equal(document.activeElement,mountain);assert.equal(state.filterLocation,'all');cases++;
assert(source.includes("say(...textFor('verificationProgress')(verificationProgress))"),'Progress must localize in the selected language');cases++;
console.log(`PASS progressive verification: ${cases} cases; first verified image shown while later request pending, failed image hidden, bounded concurrency, batched later renders and exact completion counts`);
