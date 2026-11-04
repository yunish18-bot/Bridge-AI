/* Bridge AI local-first single-page application. No network or API keys required. */
(()=>{
  'use strict';
  const E=window.BridgeEngine,D=window.BridgeData;
  if(!E||!D){document.body.textContent='Bridge AI could not load its local data or engine. Please unzip all files together.';return}
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=value=>{try{const u=new URL(String(value));return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
  const isoToday=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
  const STORE='bridge-ai-workspace-v1';
  const fresh=()=>({applications:[],deadlines:[],budget:null,skills:[],customSkills:''});
  function sanitize(raw){
    const out=fresh();if(!raw||typeof raw!=='object')return out;
    const strings=(o,k,max=200)=>String(o?.[k]??'').slice(0,max);
    const isDate=x=>/^\d{4}-\d{2}-\d{2}$/.test(x);
    if(Array.isArray(raw.applications))out.applications=raw.applications.slice(0,500).filter(x=>x&&typeof x==='object').map(x=>({id:strings(x,'id',80)||uid(),company:strings(x,'company',90),title:strings(x,'title',90),status:['Saved','Applied','Interview','Offer','Rejected'].includes(x.status)?x.status:'Saved',date:isDate(x.date)?x.date:isoToday(),followup:isDate(x.followup)?x.followup:'',url:safeUrl(x.url),notes:strings(x,'notes',450)})).filter(x=>x.company&&x.title);
    if(Array.isArray(raw.deadlines))out.deadlines=raw.deadlines.slice(0,500).filter(x=>x&&typeof x==='object').map(x=>({id:strings(x,'id',80)||uid(),title:strings(x,'title',90),date:isDate(x.date)?x.date:isoToday(),category:['Assignment','Exam','Career','Personal','Financial'].includes(x.category)?x.category:'Personal',done:!!x.done})).filter(x=>x.title);
    if(raw.budget&&typeof raw.budget==='object'){
      const b={};for(const k of ['income','rent','food','transport','tuition','other']){let v=Number(raw.budget[k]);b[k]=Number.isFinite(v)&&v>=0&&v<=1e7?v:0}out.budget=b;
    }
    if(Array.isArray(raw.skills))out.skills=[...new Set(raw.skills.filter(s=>typeof s==='string'&&D.SKILLS.some(k=>k.id===s)))];
    out.customSkills=strings(raw,'customSkills',500);
    return out;
  }
  function uid(){return `b-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`}
  let state=fresh();
  try{const raw=localStorage.getItem(STORE);if(raw)state=sanitize(JSON.parse(raw))}catch(err){console.warn('Could not read saved workspace:',err)}
  function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(err){notice('Browser storage is unavailable. Export your data to save a copy.',true)}}
  let noticeTimer;
  function notice(message,error=false){const n=$('#notice');n.textContent=message;n.className=`notice${error?' error':''}`;n.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.hidden=true,5500)}
  const bySkill=new Map(D.SKILLS.map(s=>[s.id,s]));
  function view(name){
    if(!$('#view-'+name))return;
    $$('.view').forEach(v=>v.classList.toggle('current',v.id==='view-'+name));
    $$('.nav').forEach(b=>{const yes=b.dataset.view===name;b.classList.toggle('active',yes);if(yes)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
    $('#crumb').textContent=name.replace(/-/g,' ').toUpperCase();
    if(location.hash!=='#'+name)history.replaceState(null,'','#'+name);
    window.scrollTo({top:0,behavior:'instant'});
  }
  $$('.nav').forEach(btn=>btn.addEventListener('click',()=>view(btn.dataset.view)));
  $$('[data-go]').forEach(btn=>btn.addEventListener('click',()=>view(btn.dataset.go)));
  window.addEventListener('hashchange',()=>view(location.hash.substring(1)||'overview'));
  function renderOverview(){
    $('#stat-apps').textContent=String(state.applications.length);
    const open=state.deadlines.filter(t=>!t.done);
    $('#stat-tasks').textContent=String(open.length);
    const today=isoToday();
    const urgent=open.filter(t=>{const d=E.dateDifference(t.date,today);return d!==null&&d<=7});
    $('#stat-urgent').textContent=urgent.length?`${urgent.length} due within 7 days or overdue`:'Nothing due soon';
    $('#stat-budget').textContent=state.budget?currency(state.budget.income-['rent','food','transport','tuition','other'].reduce((sum,k)=>sum+state.budget[k],0)):'—';
    const upcoming=[...open].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
    $('#overview-deadlines').innerHTML=upcoming.length?upcoming.map(t=>`<div class="task"><div class="task-info"><strong>${esc(t.title)}</strong><small>${esc(t.category)} · ${esc(t.date)}</small></div>${dateBadge(t.date)}</div>`).join(''):'<p class="empty">No upcoming deadlines yet. Add an assignment, interview, or important personal date to get started.</p>';
  }
  function dateBadge(date){const d=E.dateDifference(date,isoToday());if(d===null)return '';
    return d<0?'<span class="task-status overdue">Overdue</span>':d===0?'<span class="task-status soon">Today</span>':d<=7?`<span class="task-status soon">${d}d left</span>`:`<span class="task-status">${d}d left</span>`;
  }
  function initCareer(){
    $('#role-select').innerHTML='<option value="custom">Custom job description</option>'+D.ROLES.map(r=>`<option value="${esc(r.id)}">${esc(r.title)}</option>`).join('');
    $('#role-select').addEventListener('change',()=>{const role=D.ROLES.find(r=>r.id===$('#role-select').value);$('#role-preview').textContent=role?.description||'Paste an actual job description to analyze its recognized skills.'});
    $('#skill-pills').innerHTML=D.SKILLS.map(s=>`<button class="skill-pill${state.skills.includes(s.id)?' selected':''}" data-skill="${esc(s.id)}" type="button" aria-pressed="${state.skills.includes(s.id)}">${esc(s.label)}</button>`).join('');
    $('#skill-pills').addEventListener('click',evt=>{const btn=evt.target.closest('[data-skill]');if(!btn)return;const id=btn.dataset.skill;state.skills=state.skills.includes(id)?state.skills.filter(x=>x!==id):[...state.skills,id];btn.classList.toggle('selected',state.skills.includes(id));btn.setAttribute('aria-pressed',String(state.skills.includes(id)));save()});
    $('#custom-skills').value=state.customSkills;
    $('#custom-skills').addEventListener('change',()=>{state.customSkills=$('#custom-skills').value;save()});
    $('#clear-skills').addEventListener('click',()=>{state.skills=[];$('#custom-skills').value='';state.customSkills='';$$('.skill-pill').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});save();notice('Selected skills cleared.')});
    $('#demo-profile').addEventListener('click',()=>{
      state.skills=['java','git','sql','communication'];state.customSkills='';
      $('#custom-skills').value='';$('#job-description').value='';$('#role-select').value='swe';$('#role-preview').textContent=D.ROLES.find(r=>r.id==='swe').description;
      $$('.skill-pill').forEach(b=>{const yes=state.skills.includes(b.dataset.skill);b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes))});
      save();analyzeCareer();notice('Illustrative demo profile loaded. You can edit these skills.');
    });

    $('#career-form').addEventListener('submit',event=>{event.preventDefault();analyzeCareer()});
  }
  function tags(ids,missing=false){return ids.length?ids.map(id=>`<span class="result-tag${missing?' missing':''}">${esc(bySkill.get(id)?.label||id)}</span>`).join(''):'<span class="empty">None identified</span>'}
  function analyzeCareer(){
    const role=D.ROLES.find(r=>r.id===$('#role-select').value);
    const pasted=$('#job-description').value.trim();
    if(!pasted&&!role){notice('Choose an example role or paste a job description.',true);return}
    const required=pasted?E.detectSkills(pasted,D.SKILLS):role.skills;
    if(!required.length){$('#career-results').innerHTML='<div class="warning">No recognizable skills found. Try a more detailed description using terms such as Java, SQL, Git, or React. This prototype recognizes 25 predefined skills only.</div>';return}
    const custom=$('#custom-skills').value.trim();state.customSkills=custom;
    const owned=[...new Set([...state.skills,...E.detectSkills(custom,D.SKILLS)])];save();
    const match=E.matchSkills(required,owned);
    const title=pasted?'Your pasted job description':role.title;
    let roadmap,baseline;
    try{roadmap=E.learningRoadmap(match.missing,owned,D.SKILLS,3);baseline=E.fixedOrderRoadmap(match.missing,owned,D.SKILLS,3)}
    catch(error){roadmap={error:error.message,steps:[],hours:0,remaining:match.missing}}

    const steps=roadmap.steps||[];
    const html=`<div class="score-header"><div class="score-circle">${match.coverage}%</div><div><h3>${esc(title)}</h3><p>${match.matched.length} of ${required.length} recognized requirements matched. This score measures keyword coverage, not job readiness or probability of being hired.</p></div></div>
       <div class="progress-track" aria-label="Skill coverage ${match.coverage} percent"><div class="progress-fill" style="width:${match.coverage}%"></div></div>
       <div class="result-section"><h4>Skills you already have (${match.matched.length})</h4><div class="result-tags">${tags(match.matched)}</div></div>
       <div class="result-section"><h4>Missing skills (${match.missing.length})</h4><div class="result-tags">${tags(match.missing,true)}</div></div>
       <div class="result-section"><h4>Suggested next learning steps</h4>${roadmap.error?`<p class="warning">${esc(roadmap.error)}</p>`:steps.length?`<p>An A* search finds a lower-estimated-hours sequence to learn up to three missing target skills, including prerequisites.</p><div class="steps">${steps.map((s,i)=>`<div class="step"><span class="step-no">${i+1}</span><div><strong>${esc(s.label)}</strong><small>${match.missing.includes(s.id)?'Target requirement':'Prerequisite for a target skill'}</small></div><span class="estimate">~${s.hours} hrs</span></div>`).join('')}</div><p><strong>Estimated study time: ${roadmap.hours} hours.</strong> Estimates are illustrative, not personalized.</p>${baseline?`<p><strong>AI-search comparison:</strong> Fixed alphabetical order for the same number of target skills costs ~${baseline.hours} estimated hours; A* costs ~${roadmap.hours}. Both are examples, not personalized predictions.</p>`:''}`:'<p>No gaps identified among the recognized skill terms. Try another posting to discover new goals.</p>'}${roadmap.remaining?.length?`<p>Other requirements to tackle later: ${esc(roadmap.remaining.map(id=>bySkill.get(id)?.label||id).join(', '))}.</p>`:''}</div>
       <div class="result-section"><p>For broader occupation research, see <a href="https://www.onetonline.org/" target="_blank" rel="noopener noreferrer">O*NET ↗</a>. Many job requirements (degrees, experience, authorization, and soft skills) are not included in this score.</p></div>`;
    $('#career-results').innerHTML=html;
  }
  function renderApplications(){
    const filter=$('#app-filter').value;
    const items=state.applications.filter(a=>filter==='All'||a.status===filter).sort((a,b)=>b.date.localeCompare(a.date));
    $('#app-total').textContent=`(${state.applications.length})`;
    $('#application-list').innerHTML=items.length?items.map(a=>`<article class="app-card"><div><h4>${esc(a.company)}</h4><p>${esc(a.title)}</p><p class="app-meta">Added: ${esc(a.date)}${a.followup?' · Follow up: '+esc(a.followup):''}</p>${a.notes?`<p class="app-notes">${esc(a.notes)}</p>`:''}${a.url?`<a class="link-small" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">View posting ↗</a>`:''}</div><div class="app-actions"><label class="filter-label">Status <select data-app-status="${esc(a.id)}" aria-label="Update ${esc(a.company)} application status">${['Saved','Applied','Interview','Offer','Rejected'].map(st=>`<option${st===a.status?' selected':''}>${st}</option>`).join('')}</select></label>${a.followup?dateBadge(a.followup):''}<button class="delete" type="button" data-delete-app="${esc(a.id)}">Delete</button></div></article>`).join(''):'<p class="empty">No applications found. Add your first opportunity on the left.</p>';
  }
  function initApplications(){
    $('#app-date').value=isoToday();$('#app-filter').addEventListener('change',renderApplications);
    $('#application-form').addEventListener('submit',e=>{
      e.preventDefault();const val=id=>$(id).value.trim();
      const entry={id:uid(),company:val('#app-company').slice(0,90),title:val('#app-title').slice(0,90),status:val('#app-status'),date:val('#app-date'),followup:val('#app-followup'),url:safeUrl(val('#app-url')),notes:val('#app-notes').slice(0,450)};
      if(!entry.company||!entry.title||!entry.date){notice('Company, title and date are required.',true);return}
      if(val('#app-url')&&!entry.url){notice('Please use an http or https job posting URL.',true);return}
      state.applications.unshift(entry);save();$('#application-form').reset();$('#app-date').value=isoToday();renderApplications();renderOverview();notice('Application saved to this browser.')
    });
    $('#application-list').addEventListener('change',e=>{const btn=e.target.closest('[data-app-status]');if(!btn)return;const a=state.applications.find(x=>x.id===btn.dataset.appStatus);if(a){a.status=btn.value;save();renderApplications()}});
    $('#application-list').addEventListener('click',e=>{const btn=e.target.closest('[data-delete-app]');if(!btn)return;if(!window.confirm('Delete this application?'))return;state.applications=state.applications.filter(a=>a.id!==btn.dataset.deleteApp);save();renderApplications();renderOverview()});
  }
  function renderDeadlines(){
    const items=[...state.deadlines].sort((a,b)=>Number(a.done)-Number(b.done)||a.date.localeCompare(b.date));
    $('#task-total').textContent=`(${items.length})`;
    $('#task-list').innerHTML=items.length?items.map(t=>`<div class="task${t.done?' completed':''}"><input type="checkbox" data-task-check="${esc(t.id)}" aria-label="Mark ${esc(t.title)} complete" ${t.done?'checked':''}><div class="task-info"><strong>${esc(t.title)}</strong><small>${esc(t.category)} · ${esc(t.date)}</small></div>${t.done?'<span class="task-status">Done</span>':dateBadge(t.date)}<button class="delete" type="button" data-delete-task="${esc(t.id)}" aria-label="Delete ${esc(t.title)}">Delete</button></div>`).join(''):'<p class="empty">No deadlines saved yet. Add an assignment or an important date.</p>';
  }
  function initDeadlines(){
    $('#task-date').value=isoToday();
    $('#deadline-form').addEventListener('submit',e=>{e.preventDefault();const title=$('#task-title').value.trim();const date=$('#task-date').value;if(!title||!date)return;
      state.deadlines.push({id:uid(),title:title.slice(0,90),date,category:$('#task-category').value,done:false});save();$('#deadline-form').reset();$('#task-date').value=isoToday();renderDeadlines();renderOverview();notice('Deadline saved.')
    });
    $('#task-list').addEventListener('change',e=>{const input=e.target.closest('[data-task-check]');if(!input)return;const task=state.deadlines.find(t=>t.id===input.dataset.taskCheck);if(task){task.done=input.checked;save();renderDeadlines();renderOverview()}});
    $('#task-list').addEventListener('click',e=>{const b=e.target.closest('[data-delete-task]');if(!b)return;if(!window.confirm('Delete this deadline?'))return;state.deadlines=state.deadlines.filter(t=>t.id!==b.dataset.deleteTask);save();renderDeadlines();renderOverview()})
  }
  function renderBudget(){
    const b=state.budget,box=$('#budget-results');
    if(!b){box.innerHTML='<div class="result-empty"><div class="empty-glyph">◉</div><h3>Make your monthly budget</h3><p>Enter estimated monthly income and expenses. Your numbers remain in this browser.</p></div>';return}
    const keys=['rent','food','transport','tuition','other'];
    const labels={rent:'Rent & utilities',food:'Food & groceries',transport:'Transportation',tuition:'Tuition & school',other:'Other expenses'};
    const total=keys.reduce((s,k)=>s+b[k],0),remainder=b.income-total,used=b.income>0?Math.min(100,100*total/b.income):(total>0?100:0);
    box.innerHTML=`<h3>Monthly picture</h3><div class="budget-head"><div class="budget-metric"><span>Total planned spending</span><strong>${currency(total)}</strong></div><div class="budget-metric${remainder<0?' negative':''}"><span>Amount remaining</span><strong>${currency(remainder)}</strong></div></div><div class="budget-bar" aria-label="${Math.round(used)} percent of monthly income allocated"><span style="width:${used}%"></span></div><p class="helper">${b.income>0?Math.round(total/b.income*100)+'% of stated monthly income is allocated.':'Add income to see the share of income allocated.'} ${remainder<0?'Planned spending exceeds your income.':''}</p><div class="budget-line"><span>Take-home income</span><strong>${currency(b.income)}</strong></div>${keys.map(k=>`<div class="budget-line"><span>${labels[k]}</span><strong>${currency(b[k])}</strong></div>`).join('')}`;
  }
  function initBudget(){
    if(state.budget)for(const [k,v]of Object.entries(state.budget)){if($('#'+k))$('#'+k).value=String(v)}
    $('#budget-form').addEventListener('submit',e=>{e.preventDefault();const b={};for(const id of ['income','rent','food','transport','tuition','other']){const val=Number($('#'+id).value);if(!Number.isFinite(val)||val<0||val>1e7){notice('Please enter valid nonnegative amounts.',true);return}b[id]=val}state.budget=b;save();renderBudget();renderOverview();notice('Budget saved locally.')});
  }
  let chatHistory=[];
  let asking=false;
  let hasServer=false;
  let backendConfigured=false;
  function appendMessage(kind,answer,source){
    const node=document.createElement('div');node.className='message '+kind;
    const p=document.createElement('p');p.textContent=answer;node.appendChild(p);
    if(source){const url=safeUrl(source.url);if(url){
      const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.className='source-link';link.textContent='Reference: '+String(source.title||source.source||'Official resource')+' ↗';node.appendChild(link);
    }}
    $('#messages').appendChild(node);$('#messages').scrollTop=$('#messages').scrollHeight;
    return node;
  }
  async function detectAssistantMode(){
    const pill=$('#chat-mode'),sub=$('#chat-subtitle'),status=$('#connection-status');
    if(location.protocol!=='file:'){
      try{
        const r=await fetch('/api/health',{cache:'no-store'});
        if(r.ok){const data=await r.json();hasServer=true;backendConfigured=!!data.aiConnected;}
      }catch(err){console.warn('Backend not reachable:',err.message)}
    }
    pill.textContent=backendConfigured?'AI connected':'Resource mode';
    sub.textContent=backendConfigured?'Gemini-assisted answers · Check linked official sources':'Curated question answering · No API key needed';
    status.innerHTML='<span class="dot"></span>'+(backendConfigured?'AI assistant ready':'Private student workspace');
  }
  async function ask(question){
    if(!question.trim()||asking)return;
    asking=true;const button=$('#chat-form button[type="submit"]');button.disabled=true;button.textContent='Thinking…';
    appendMessage('user',question);
    const loading=appendMessage('assistant','Finding a useful starting point…');
    try{
      let answer,source,mode='curated';
      if(hasServer){
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
        try{
          const response=await fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,history:chatHistory.slice(-6)}),signal:controller.signal});
          const data=await response.json();
          if(!response.ok)throw Error(data.error||'Request failed');
          answer=data.answer;source=data.source;mode=data.mode;
        }finally{clearTimeout(timer)}
      }else{
        const hit=E.searchKnowledge(question,D.KNOWLEDGE);
        answer=hit?hit.item.answer:'I could not find a reliable answer in my current curated library. Check the Resources page or contact your school for guidance.';
        source=hit?{title:hit.item.source,url:hit.item.url}:null;
      }
      loading.remove();appendMessage('assistant',answer,source);
      chatHistory.push({role:'user',text:question},{role:'assistant',text:answer});
      chatHistory=chatHistory.slice(-10);
      if(mode==='curated-fallback')notice('Live AI was unavailable. Shown: curated resource answer.');
    }catch(err){
      loading.remove();
      const hit=E.searchKnowledge(question,D.KNOWLEDGE);
      appendMessage('assistant',(hit?hit.item.answer:'The assistant could not respond. Please retry or check Resources.')+' (Offline fallback.)',hit?{title:hit.item.source,url:hit.item.url}:null);
      notice('The server could not respond. Shown: available offline guidance.',true);
    }finally{asking=false;button.disabled=false;button.textContent='Ask →'}
  }
  function initAssistant(){
    $('#chat-form').addEventListener('submit',e=>{e.preventDefault();const q=$('#chat-input').value.trim();if(q&&!asking){$('#chat-input').value='';ask(q)}});
    $$('.suggest').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.prompt)));
    detectAssistantMode();
  }
  function initResources(){$('#resource-grid').innerHTML=D.RESOURCES.map(r=>`<a class="resource" href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer"><span class="resource-label">${esc(r.category)}</span><strong>${esc(r.title)}</strong><small>${esc(r.description)}</small><span class="resource-domain">${esc(r.domain)} ↗</span></a>`).join('')}
  function initBackup(){
    $('#export-data').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='bridge-ai-workspace.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('Downloaded your Bridge AI workspace JSON backup.')});
    $('#import-data').addEventListener('click',()=>$('#import-file').click());
    $('#import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2e6)throw Error('File is too large');const text=await file.text();const parsed=JSON.parse(text);if(parsed.version!==1)throw Error('This is not a Bridge AI v1 workspace backup');if(!window.confirm('Import this backup and replace the current saved workspace?'))return;state=sanitize(parsed);save();rebuildAll();notice('Workspace imported successfully.')}catch(err){notice('Import failed: '+err.message,true)}finally{e.target.value=''}});
  }
  function rebuildAll(){renderOverview();renderApplications();renderDeadlines();renderBudget();$('#custom-skills').value=state.customSkills;$$('.skill-pill').forEach(b=>{const active=state.skills.includes(b.dataset.skill);b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});if(state.budget)for(const [k,v] of Object.entries(state.budget)){if($('#'+k))$('#'+k).value=String(v)}}
  initCareer();initApplications();initDeadlines();initBudget();initAssistant();initResources();initBackup();rebuildAll();view(location.hash.slice(1)||'overview');
})();
