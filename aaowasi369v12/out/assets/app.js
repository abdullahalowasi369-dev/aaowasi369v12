
(function(){
 const root=document.documentElement; let saved=null; try{saved=localStorage.getItem('aao-theme')}catch{} root.dataset.theme=saved||'light';
 const island=document.querySelector('[data-island] span'); const sections=[...document.querySelectorAll('[data-section-title]')]; const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting&&island) island.textContent=e.target.dataset.sectionTitle||'aaowasi369';});},{rootMargin:'-35% 0px -55% 0px',threshold:.01}); sections.forEach(s=>io.observe(s));
 document.addEventListener('pointermove',e=>{if(matchMedia('(pointer:fine)').matches){root.style.setProperty('--mx',e.clientX+'px');root.style.setProperty('--my',e.clientY+'px')}});
 document.addEventListener('pointerdown',e=>{if(!matchMedia('(pointer:fine)').matches){const r=document.createElement('i');r.className='ripple';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),700)}});
 document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;try{localStorage.setItem('aao-theme',next)}catch{}b.textContent=next==='dark'?'☀':'☾'}));
 const countObs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return; entry.target.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0);el.textContent='0';let start=null;function step(t){start??=t;const p=Math.min(1,(t-start)/900);el.textContent=Math.round(target*p);if(p<1)requestAnimationFrame(step);else entry.target.classList.add('complete')}requestAnimationFrame(step)});countObs.unobserve(entry.target)});},{threshold:.35});document.querySelectorAll('[data-counter-card]').forEach(c=>countObs.observe(c));
 const flowDetails=['Requirement: material obligation, risk expectation or business need.','Control: behavior, configuration or process intended to manage the requirement.','Evidence: inspectable proof that the control exists and operates as expected.','Exception: gap, uncertainty, failed test or dependency that changes the control state.','Residual risk: exposure remaining after current controls and exceptions are considered.','Decision: approve, remediate, accept, escalate or reject with accountable ownership.'];
 document.querySelectorAll('[data-flow]').forEach(flow=>{const detail=document.querySelector('[data-flow-detail]');const nodes=[...flow.querySelectorAll('[data-flow-index]')];function set(i){nodes.forEach((n,k)=>n.classList.toggle('active',k===i));if(detail)detail.textContent=flowDetails[i]||flowDetails[0]}nodes.forEach(n=>n.addEventListener('click',()=>set(Number(n.dataset.flowIndex))));set(0)});
 document.querySelectorAll('[data-flag-tab]').forEach(btn=>btn.addEventListener('click',()=>{const i=btn.dataset.flagTab;document.querySelectorAll('[data-flag-tab]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('[data-flag-panel]').forEach(p=>p.classList.toggle('active',p.dataset.flagPanel===i));}));
 document.querySelectorAll('[data-project-filter]').forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.projectFilter;document.querySelectorAll('[data-project-filter]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('[data-cat]').forEach(c=>c.style.display=(f==='All'||c.dataset.cat===f)?'block':'none')}));
 document.querySelectorAll('[data-skill-filter]').forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.skillFilter;document.querySelectorAll('[data-skill-filter]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('[data-skill-cat]').forEach(c=>c.style.display=(c.dataset.skillCat===f)?'block':'none')}));
 function riskTotals(filter){let inh=0,res=0;document.querySelectorAll('.risk-row').forEach(row=>{const show=filter==='All'||row.dataset.status===filter;row.style.display=show?'grid':'none'; if(show){const txt=row.querySelector('em').textContent.split('/').map(Number);inh+=txt[0];res+=txt[1];}});const i=document.querySelector('[data-risk-total="inherent"]'), r=document.querySelector('[data-risk-total="residual"]'); if(i)i.textContent=inh;if(r)r.textContent=res;}
 document.querySelectorAll('[data-risk-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-risk-filter]').forEach(b=>b.classList.toggle('active',b===btn));riskTotals(btn.dataset.riskFilter)}));
 document.querySelectorAll('.heat-node').forEach(n=>n.addEventListener('click',()=>{document.querySelectorAll('.heat-node').forEach(x=>x.classList.remove('active'));n.classList.add('active');const d=document.querySelector('[data-heat-detail]'); if(d)d.textContent=n.dataset.case+' · '+n.dataset.detail;}));
 document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{if(!matchMedia('(pointer:fine)').matches)return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>{card.style.transform=''})});
 document.querySelectorAll('[data-top]').forEach(b=>b.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})));
})();

(function(){
  const root=document.documentElement;
  const island=document.querySelector('.dynamic-island');
  const focus=document.querySelector('[data-focus-word]');
  const focusWords=['technology risk','control assurance','AI governance','third-party risk'];
  let focusIndex=0;
  if(focus && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    setInterval(()=>{focusIndex=(focusIndex+1)%focusWords.length;focus.animate([{opacity:.15,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});focus.textContent=focusWords[focusIndex];},2600);
  }
  function toggleIsland(){if(island)island.classList.toggle('is-visible',scrollY>260)}
  addEventListener('scroll',toggleIsland,{passive:true});toggleIsland();

  const navLinks=[...document.querySelectorAll('.nav-chip')];
  const navTargets=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window){
    const navObs=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+visible.target.id));
    },{rootMargin:'-28% 0px -58% 0px',threshold:[.01,.08,.15]});
    navTargets.forEach(t=>navObs.observe(t));
  }

  const revealTargets=[...document.querySelectorAll('.value-card,.panel,.visual-card,.flagship-grid,.project-card,.skill-card,.framework-card,.contact-shell,.social-showcase')];
  revealTargets.forEach((el,i)=>{el.classList.add('revealable');el.style.setProperty('--reveal-delay',(i%4)*55+'ms')});
  if('IntersectionObserver' in window){
    const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObs.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -7%'});
    revealTargets.forEach(el=>revealObs.observe(el));
  } else revealTargets.forEach(el=>el.classList.add('is-visible'));

  document.querySelectorAll('[data-copy-email]').forEach(btn=>btn.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText('abdullahalowasi369@gmail.com');const old=btn.textContent;btn.textContent='Email copied ✓';setTimeout(()=>btn.textContent=old,1600)}catch{location.href='mailto:abdullahalowasi369@gmail.com'}
  }));

  // Give horizontal evidence tracks precise keyboard controls without intercepting page scroll.
  document.querySelectorAll('.track').forEach(track=>{
    track.tabIndex=0;
    track.addEventListener('keydown',e=>{
      if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
      e.preventDefault();
      track.scrollBy({left:(e.key==='ArrowRight'?1:-1)*Math.min(track.clientWidth*.78,420),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
  });
})();
