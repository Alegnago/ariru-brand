(() => {
'use strict';
const D=window.CARD_DATA;
const names={corona:'Corona',diagonale:'Diagonale',asimmetrica:'Asimmetrica',landscape:'Orizzontale',portrait:'Verticale',light:'Chiaro',dark:'Scuro'};
const state={composition:'corona',orientation:'landscape',typography:'petrona',tone:'light'};
let flipped=false;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function current(){return D.cards.find(c=>Object.keys(state).every(k=>c[k]===state[k]));}
function text(lines,x,y,size,family,weight,anchor='start',lineHeight=0,cls=''){
 return `<text class="${cls}" x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?lineHeight:0}">${esc(line)}</tspan>`).join('')}</text>`;
}
function cardSvg(card,side){
 const l=D.layouts.find(x=>x.id===card.layoutId),w=l.widthMm*10,h=l.heightMm*10,short=550;
 const title=side==='front'?'Arianna Ruaro · Biologa nutrizionista':`Riceve su appuntamento. ${D.centers.map(c=>`${c.name}. ${c.address}. ${c.phone}`).join('. ')}`;
 let content=`<rect width="${w}" height="${h}" fill="${card.palette.background}"/>`;
 if(side==='front'){
  content+=`<g class="fruit-layer" aria-hidden="true">`+l.fruits.map(f=>{
   const size=f.scale*short,x=f.x*w,y=f.y*h;
   return `<image data-fruit="${f.id}" href="${D.fruits[f.id].png}" x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" transform="rotate(${f.rotation} ${x} ${y})"/>`;
  }).join('')+'</g>';
  const n=l.front.name,q=l.front.qualification;
  const split=n.baselines.length===2?['Arianna','Ruaro']:['Arianna Ruaro'];
  content+=`<g class="front-type" fill="${card.palette.text}">`;
  split.forEach((line,i)=>content+=text([line],n.x*w,n.baselines[i]*h,n.size*short,D.typography[card.typography].nameFamily,n.weight,n.anchor,0,'card-name'));
  content+=text([q.text],q.x*w,q.y*h,q.size*short,'Geologica',q.weight,q.anchor,0,'card-qualification')+'</g>';
 }else{
  const b=l.back,x=b.x*w,p=card.orientation==='portrait';
  content+=`<g class="back-type" fill="${card.palette.text}">`+text([card.back.heading],b.heading.x*w,b.heading.y*h,b.heading.size*short,'Geologica',b.heading.weight,'start',0,'back-heading');
  D.centers.forEach((c,i)=>{
   const pos=b.centers[i],lines=p?c.portrait:{name:[c.name],address:[c.address],phone:[c.phone]};
   content+=`<g class="center-details" data-center="${i+1}">`+text(lines.name,x,pos.nameY*h,b.nameSize*short,'Geologica',b.nameWeight,'start',(b.lineHeight||0)*h,'center-name')+text(lines.address,x,pos.addressY*h,b.addressSize*short,'Geologica',b.bodyWeight,'start',(b.lineHeight||0)*h,'center-address')+text(lines.phone,x,pos.phoneY*h,b.phoneSize*short,'Geologica',b.bodyWeight,'start',(b.lineHeight||0)*h,'center-phone')+'</g>';
  });
  content+=b.lineYs.map(y=>`<path d="M${x} ${y*h}h${b.width*w}" stroke="${card.palette.text}" stroke-width=".65" opacity=".3"/>`).join('')+'</g>';
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" style="overflow:hidden">${content}</svg>`;
}
function render(){
 const c=current();
 $('.workspace').dataset.orientation=c.orientation;
 $('#selection-name').innerHTML=`${names[c.composition]} <span>${c.widthMm} × ${c.heightMm} mm</span>`;
 $('#selection-status').textContent=`${String(c.number).padStart(2,'0')} / 24 · ${D.typography[c.typography].label} · ${names[c.tone]}`;
 for(const group of document.querySelectorAll('[data-control]'))for(const b of group.querySelectorAll('button'))b.setAttribute('aria-pressed',String(state[group.dataset.control]===b.dataset.value));
 $('#typography').value=state.typography;
 $('#faces').innerHTML=['front','back'].map((side,i)=>`<figure class="face"><figcaption><span>0${i+1}</span><strong style="font-weight:350" data-caption="${i}">${side==='front'?'Fronte':'Retro'}</strong></figcaption><button type="button" class="card-button${flipped?' is-flipped':''}" data-card="${i}" aria-label="${side==='front'?'Fronte':'Retro'}, gira il biglietto"><span class="card-turn"><span class="card-side" data-side="${side}" aria-hidden="${flipped}">${cardSvg(c,side)}</span><span class="card-side reverse" data-side="${side==='front'?'back':'front'}" aria-hidden="${!flipped}">${cardSvg(c,side==='front'?'back':'front')}</span></span></button></figure>`).join('');
 $('#faces').classList.remove('changing');
 void $('#faces').offsetWidth;
 $('#faces').classList.add('changing');
 $('#faces').querySelectorAll('.card-button').forEach(b=>b.addEventListener('click',flip));
 updateFlip();
 document.querySelectorAll('.variant').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===c.id)));
}
function updateFlip(){
 $('#flip').setAttribute('aria-pressed',String(flipped));
 document.querySelectorAll('.card-button').forEach((b,i)=>{
  b.classList.toggle('is-flipped',flipped);
  const label=(i===0)!==flipped?'Fronte':'Retro';
  $(`[data-caption="${i}"]`).textContent=label;
  const content=label==='Fronte'?'Arianna Ruaro, Biologa nutrizionista':`Riceve su appuntamento. ${D.centers.map(c=>`${c.name}, ${c.address}, ${c.phone}`).join('. ')}`;
  b.setAttribute('aria-label',`${label}. ${content}. Gira il biglietto`);
  b.querySelectorAll('.card-side').forEach(s=>s.setAttribute('aria-hidden',String(s.classList.contains('reverse')!==flipped)));
 });
}
function flip(){flipped=!flipped;updateFlip();}
for(const group of document.querySelectorAll('[data-control]'))group.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 state[group.dataset.control]=b.dataset.value;render();
});
$('#typography').addEventListener('change',e=>{state.typography=e.target.value;render();});
$('#flip').addEventListener('click',flip);
document.addEventListener('keydown',e=>{
 if(e.key.toLowerCase()==='g'&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();flip();}
});
$('#overview-toggle').addEventListener('click',()=>{
 const open=$('#overview').hidden;
 $('#overview').hidden=!open;$('#overview-toggle').setAttribute('aria-expanded',String(open));$('#overview-toggle .arrow').textContent=open?'↑':'↓';
 if(open&&!$('#variant-grid').children.length){
  $('#variant-grid').innerHTML=D.cards.map(c=>`<button type="button" class="variant" data-id="${c.id}" aria-pressed="${c.id===current().id}" aria-label="Variante ${c.number}: ${names[c.composition]}, ${names[c.orientation]}, ${D.typography[c.typography].label}, ${names[c.tone]}"><span class="thumb ${c.orientation}">${cardSvg(c,'front')}</span><span class="variant-label"><b>${String(c.number).padStart(2,'0')}</b><span>${names[c.composition]} · ${names[c.tone]}<small>${names[c.orientation]} · ${D.typography[c.typography].label}</small></span></span></button>`).join('');
  $('#variant-grid').addEventListener('click',e=>{
   const b=e.target.closest('.variant');if(!b)return;
   const c=D.cards.find(c=>c.id===b.dataset.id);for(const k of Object.keys(state))state[k]=c[k];flipped=false;render();
   $('#selection-name').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
   $('#faces .card-button').focus({preventScroll:true});
  });
 }
});
render();
// Explicit font loading lets missing local files produce a visible error, not a silent fallback.
window.cardsReady=Promise.all([document.fonts.load('300 60px Petrona','Arianna Ruaro'),document.fonts.load('350 24px Geologica','Riceve su appuntamento')]).then(results=>{
 if(results.some(r=>r.length===0))throw new Error('Missing brand font');
 return Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
}).then(()=>document.fonts.ready).catch(error=>{$('#font-error').hidden=false;console.error(error);throw error;});
window.cardStudio={data:D,state,render,cardSvg,current,flip};
})();
