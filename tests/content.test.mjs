import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const cases=JSON.parse(fs.readFileSync(new URL('../src/data/cases.json',import.meta.url)));
test('24 report cases retain contiguous printed/PDF page mappings and six source questions',()=>{
 assert.equal(cases.length,24);
 for(const [i,c] of cases.entries()){
  assert.equal(c.id,i+1); assert.ok(c.reportTitle.length>12);assert.equal(c.pdfStart,c.printedStart+1);assert.equal(c.pdfEnd,c.printedEnd+1);
  if(i<23)assert.equal(c.pdfEnd+1,cases[i+1].pdfStart);
  assert.deepEqual(c.qa.map(q=>q.number),[1,2,3,4,5,6]);
  for(const q of c.qa){assert.ok(q.pdfPage>c.pdfStart&&q.pdfPage<=c.pdfEnd);assert.ok(q.paragraphs.join('').length>100);assert.ok(!q.paragraphs.join('').match(/\d+\/245/));}
  for(const key of ['problem','outcome','boundary','lesson','question'])assert.ok(c[key].length>12,`${c.id} ${key}`);
 }
});
test('original report IDs are never confused with official website IDs',()=>{
 assert.equal(cases[0].official,9);assert.equal(cases[2].official,1);assert.equal(cases[10].official,null);
 const ids=cases.map(c=>c.official).filter(Boolean);assert.equal(new Set(ids).size,23);assert.ok(!ids.includes(4));
});
test('important evidence limitations remain explicit',()=>{
 assert.match(cases[5].status,/原型/);assert.match(cases[5].boundary,/预计/);
 assert.match(cases[6].boundary,/另一个制造业客户/);
 assert.match(cases[11].status,/试点/);assert.match(cases[19].boundary,/不能证明/);
 assert.match(cases[20].boundary,/初步生成/);assert.match(cases[21].boundary,/未取得/);
 assert.match(cases[23].boundary,/脱敏/);
});
test('local PDF and actual cover are packaged for offline source access',()=>{
 const pdf=fs.readFileSync(new URL('../public/report.pdf',import.meta.url));assert.equal(pdf.subarray(0,4).toString(),'%PDF');
 assert.ok(fs.statSync(new URL('../public/report-cover.jpg',import.meta.url)).size>1000);
});
