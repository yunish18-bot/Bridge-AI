const assert=require('node:assert/strict');
const E=require('../engine.js');
const {SKILLS,ROLES,KNOWLEDGE}=require('../data.js');
const found=E.detectSkills('We are looking for Java, Git, SQL, Spring Boot and REST APIs. Not JavaScript.',SKILLS);
assert(found.includes('java')&&found.includes('spring')&&found.includes('sql')&&found.includes('git')&&found.includes('rest'));
assert(!found.includes('python'));
const match=E.matchSkills(['java','sql','git'],['java']);
assert.equal(match.coverage,33);assert.deepEqual(match.missing,['sql','git']);
const path=E.learningRoadmap(['react','css'],[],SKILLS,2);
assert.deepEqual(path.steps.map(s=>s.id),['html','css','javascript','react']);
assert.equal(path.hours,76);
const own=E.learningRoadmap(['react','css'],['html','javascript'],SKILLS,2);
assert.deepEqual(own.steps.map(s=>s.id),['css','react']);
assert.equal(own.hours,44);
assert.equal(E.dateDifference('2026-11-03','2026-10-30'),4);
const hit=E.searchKnowledge('How can I improve my credit score?',KNOWLEDGE);
assert(hit && hit.item.title==='Credit cards and credit scores');
for (const r of ROLES){assert(r.skills.length>0);assert(r.skills.every(s=>SKILLS.some(item=>item.id===s)))}
console.log('All 8 Bridge AI engine checks passed.');
