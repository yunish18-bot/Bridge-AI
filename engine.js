/* Deterministic browser-side algorithms, independently testable in Node. */
(function(global){
 'use strict';
 const stop=new Set('a an and are as at be can could do for from how i in into is it me my of on or our should that the their there these this to us we what when where which why with you your want need about'.split(' '));
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9+#.\s/-]/g,' ').replace(/\s+/g,' ').trim();
 const tokens=s=>norm(s).split(/[\s/-]+/).filter(x=>x&&!stop.has(x)&&x.length>1);
 function detectSkills(text,skills){
   const plain=norm(text);
   return skills.filter(s=>[s.label,...(s.aliases||[])].some(alias=>{
     const needle=norm(alias).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
     const re=new RegExp(`(^|[^a-z0-9])(${needle})(?=$|[^a-z0-9])`,'gi');
     for(const found of plain.matchAll(re)){
       const start=found.index+found[1].length,end=start+found[2].length;
       const before=plain.slice(Math.max(0,start-22),start);
       const after=plain.slice(end,end+32);
       const negated=/(?:\bno|\bwithout|\bnot|\bdon't need|\bdo not need)\s+$/.test(before)||/^\s*(?:is\s+)?(?:not required|not needed|unnecessary)\b/.test(after);
       if(!negated)return true;
     }
     return false;
   })).map(s=>s.id);
 }
 function matchSkills(required,owned){
   const req=[...new Set(required)], have=new Set(owned),matched=req.filter(x=>have.has(x)),missing=req.filter(x=>!have.has(x));
   return {required:req,matched,missing,coverage:req.length?Math.round(100*matched.length/req.length):null};
 }
 // A* over learned-skill subsets: find a minimum-estimated-hours route to ANY 3 missing
 // job skills (or fewer when less than 3 are missing). Skill-hour estimates are illustrative.
 function learningRoadmap(missingIds,ownedIds,skillCatalog,goalCount=3){
   const byId=new Map(skillCatalog.map(s=>[s.id,s]));
   const owned=new Set(ownedIds);
   const targets=[...new Set(missingIds)].filter(id=>byId.has(id)&&!owned.has(id));
   const targetGoal=Math.min(Math.max(0,goalCount),targets.length);
   if(!targetGoal)return {steps:[],hours:0,goal:0,totalTargets:targets.length,remaining:targets};
   const relevant=new Set();
   function include(id){if(owned.has(id)||relevant.has(id)||!byId.has(id))return;relevant.add(id);byId.get(id).prereqs.forEach(include)}
   targets.forEach(include);
   // Keep the state small and predictable even if skill catalog grows.
   if(relevant.size>22)throw Error('Too many roadmap skills; select fewer target skills.');
   const ids=[...relevant],indices=new Map(ids.map((id,i)=>[id,i]));
   const isLearned=(mask,id)=>owned.has(id)||(indices.has(id)&&!!(mask&(1<<indices.get(id))));
   const countTargets=mask=>targets.reduce((n,id)=>n+(isLearned(mask,id)?1:0),0);
   const heuristic=mask=>{
     const left=targetGoal-countTargets(mask);if(left<=0)return 0;
     return targets.filter(id=>!isLearned(mask,id)).map(id=>byId.get(id).hours).sort((a,b)=>a-b).slice(0,left).reduce((a,b)=>a+b,0);
   };
   const open=[{mask:0,g:0,f:heuristic(0),path:[]}],best=new Map([[0,0]]);
   for(let n=0;n<150000&&open.length;n++){
     open.sort((a,b)=>a.f-b.f||a.g-b.g||a.path.join('|').localeCompare(b.path.join('|')));
     const current=open.shift();
     if(current.g!==best.get(current.mask))continue;
     if(countTargets(current.mask)>=targetGoal){
       return {steps:current.path.map(id=>byId.get(id)),hours:current.g,goal:targetGoal,totalTargets:targets.length,remaining:targets.filter(id=>!isLearned(current.mask,id))};
     }
     for(const id of ids){
       if(isLearned(current.mask,id))continue;
       const skill=byId.get(id);
       if(!skill.prereqs.every(pre=>isLearned(current.mask,pre)))continue;
       const next=current.mask|(1<<indices.get(id)),g=current.g+skill.hours;
       if(g>=(best.get(next)??Infinity))continue;
       best.set(next,g);open.push({mask:next,g,f:g+heuristic(next),path:[...current.path,id]});
     }
   }
   return {steps:[],hours:0,goal:targetGoal,totalTargets:targets.length,remaining:targets,error:'No learning path available'};
 }
 function fixedOrderRoadmap(missingIds,ownedIds,skillCatalog,goalCount=3){
   const byId=new Map(skillCatalog.map(s=>[s.id,s]));
   const owned=new Set(ownedIds),learned=new Set(owned),steps=[];
   const targets=[...new Set(missingIds)].filter(id=>byId.has(id)&&!owned.has(id))
     .sort((a,b)=>byId.get(a).label.localeCompare(byId.get(b).label)).slice(0,goalCount);
   function add(id,visiting=new Set()){
     if(learned.has(id))return;
     if(visiting.has(id)||!byId.has(id))throw Error('Invalid prerequisite graph');
     visiting.add(id);
     for(const pre of byId.get(id).prereqs)add(pre,visiting);
     visiting.delete(id);learned.add(id);steps.push(byId.get(id));
   }
   targets.forEach(id=>add(id));
   return {steps,hours:steps.reduce((n,s)=>n+s.hours,0),goal:targets.length};
 }
 function searchKnowledge(question,items){
   const normalizedQuestion=norm(question);
   // Prefer explicit intent to incidental keyword overlap.
   const explicit=[
     [/\b(visa|embassy|consulate|travel signature|reentry)\b/i,'Visa applications and travel'],
     [/\b(f-?1|cpt|opt|sevis|dso|immigration|work off campus|off campus work|work permit|work authorization|international student.*work|work.*hours.*semester)\b/i,'F-1, CPT and OPT questions'],
     [/\b(credit card|credit score|utilization|credit report|apr)\b/i,'Credit cards and credit scores'],
     [/\b(roommate|housing|lease|landlord|dorm)\b/i,'Housing and roommate concerns'],
     [/\b(resume|résumé|interview|cover letter)\b/i,'Résumé and interviewing basics']
   ];
   for(const [re,title] of explicit){
     if(re.test(normalizedQuestion)){const item=items.find(x=>x.title===title);if(item)return {item,score:1};}
   }
   const docs=items.map(k=>tokens([k.title,k.terms,...k.prompts].join(' ')));
   const query=[...new Set(tokens(question))];
   if(!query.length)return null;
   const docfreq=new Map();docs.forEach(d=>[...new Set(d)].forEach(t=>docfreq.set(t,(docfreq.get(t)||0)+1)));
   const idf=t=>Math.log(1+(items.length+1)/(1+(docfreq.get(t)||0)));
   const calc=d=>{
     const tf=new Map();d.forEach(t=>tf.set(t,(tf.get(t)||0)+1));
     const denom=Math.sqrt([...tf].reduce((sum,[t,c])=>sum+(c*idf(t))**2,0));
     return {tf,denom};
   };
   const q=calc(query);let choice=null;
   docs.forEach((d,i)=>{
     const v=calc(d);let dot=0;
     for(const [t,count] of q.tf)dot+=count*idf(t)*((v.tf.get(t)||0)*idf(t));
     const score=(q.denom&&v.denom)?dot/(q.denom*v.denom):0;
     if(!choice||score>choice.score)choice={item:items[i],score};
   });
   return choice&&choice.score>=0.12?choice:null;
 }
 function dateDifference(date,today){
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
   const a=Date.parse(date+'T12:00:00Z'),b=Date.parse(today+'T12:00:00Z');
   if(Number.isNaN(a)||Number.isNaN(b))return null;
   return Math.round((a-b)/86400000);
 }
 const api={norm,tokens,detectSkills,matchSkills,learningRoadmap,fixedOrderRoadmap,searchKnowledge,dateDifference};
 global.BridgeEngine=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
