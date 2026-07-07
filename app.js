const APP_VERSION='0.57';
// Novější sestavení knihovny jsPDF vystavují konstruktor jako
// window.jspdf.jsPDF (vnořené), ne jako window.jsPDF přímo — podle
// přesné verze CDN sestavení se to může lišit. Appka pak. Tohle
// zajistí, že "new jsPDF()" funguje spolehlivě, ať knihovna zvolí
// kterýkoliv způsob vystavení.
if(typeof window.jsPDF==='undefined' && window.jspdf?.jsPDF){
  window.jsPDF = window.jspdf.jsPDF;
}
const app=document.querySelector('.app-shell');
const screens={
  dashboard:document.getElementById('screen-dashboard'),
  stages:document.getElementById('screen-stages'),
  stageDetail:document.getElementById('screen-stage-detail'),
  diary:document.getElementById('screen-diary'),
  transactions:document.getElementById('screen-transactions'),
  entryDetail:document.getElementById('screen-entry-detail'),
  gallery:document.getElementById('screen-gallery'),
  photoDetail:document.getElementById('screen-photo-detail'),
  photoAttach:document.getElementById('screen-photo-attach'),
  calendar:document.getElementById('screen-calendar'),
  project:document.getElementById('screen-project'),
  settings:document.getElementById('screen-settings'),
  offers:document.getElementById('screen-offers'),
  documents:document.getElementById('screen-documents'),
  tasks:document.getElementById('screen-tasks'),
  projectFolder:document.getElementById('screen-project-folder')
};

const stageData={
  pozemek:{name:'Pozemek a plot', title:'Pozemek a plot', status:'Nezahájeno', spent:'0 Kč', icon:'stage-pozemek.svg', color:'green', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  foundation:{name:'Základy', title:'Základy', status:'Nezahájeno', spent:'0 Kč', icon:'stage-foundation.svg', color:'purple', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  project:{name:'Projekt a povolení', title:'Projekt a povolení', status:'Nezahájeno', spent:'0 Kč', icon:'stage-project.svg', color:'green', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  earthworks:{name:'Zemní práce', title:'Zemní práce', status:'Nezahájeno', spent:'0 Kč', icon:'stage-earthworks.svg', color:'green', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  walls:{name:'Hrubá stavba', title:'Hrubá stavba', status:'Nezahájeno', spent:'0 Kč', icon:'stage-walls.svg', color:'blue', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  roof:{name:'Střecha', title:'Střecha', status:'Nezahájeno', spent:'0 Kč', icon:'stage-roof.svg', color:'cyan', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  windows:{name:'Okna a dveře', title:'Okna a dveře', status:'Nezahájeno', spent:'0 Kč', icon:'stage-windows.svg', color:'pink', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  electric:{name:'Elektroinstalace', title:'Elektroinstalace', status:'Nezahájeno', spent:'0 Kč', icon:'stage-electric.svg', color:'yellow', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  water:{name:'Voda a kanalizace', title:'Voda a kanalizace', status:'Nezahájeno', spent:'0 Kč', icon:'stage-water.svg', color:'orange', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  heating:{name:'Vytápění a technologie', title:'Vytápění a technologie', status:'Nezahájeno', spent:'0 Kč', icon:'stage-heating.svg', color:'orange', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  paint:{name:'Vnitřní práce', title:'Vnitřní práce', status:'Nezahájeno', spent:'0 Kč', icon:'stage-paint.svg', color:'green', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  garden:{name:'Zahrada a okolí', title:'Zahrada a okolí', status:'Nezahájeno', spent:'0 Kč', icon:'stage-garden.svg', color:'purple', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  tools:{name:'Nářadí a vybavení', title:'Nářadí a vybavení', status:'Nezahájeno', spent:'0 Kč', icon:'stage-tools.svg', color:'cyan', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'},
  custom:{name:'Vlastní etapa', title:'Vlastní etapa', status:'Nezahájeno', spent:'0 Kč', icon:'stage-custom.svg', color:'gray', diary:'Zatím žádný zápis u této etapy.', last:'Etapa zatím čeká na první zápis.', expense:'Zatím bez výdajů', expenseValue:'0 Kč'}
};

const entryData={};

let currentStageId='foundation';
let entryBackTarget='diary';
let galleryBackTarget='dashboard';
let diaryBackTarget='dashboard';
let transBackTarget='dashboard';
let photoBackTarget='gallery';
let activeGalleryStage='all';
let currentPhotoIndex=0;
let currentPhotoEntryId=null;
let currentPhotoUrl=null;
const photoData=[];


function go(screen){
  Object.values(screens).forEach(s=>s?.classList.remove('is-active'));
  screens[screen]?.classList.add('is-active');
  app.dataset.screen=screen;
  document.querySelectorAll('.bottom-nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===screen || (screen==='stageDetail' && a.dataset.nav==='stages') || (screen==='entryDetail' && a.dataset.nav==='diary') || ((screen==='gallery'||screen==='photoDetail'||screen==='photoAttach') && a.dataset.nav===(galleryBackTarget==='stageDetail'?'stages':'dashboard')) || (screen==='calendar' && a.dataset.nav==='dashboard')));
  window.scrollTo({top:0,behavior:'smooth'});
  if(screen==='calendar' && typeof renderMonthGrid==='function'){ renderMonthGrid(); renderDaySummary(calSelectedDate); }
}

document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault(); if(el.dataset.nav==='diary'){diaryBackTarget='dashboard';document.querySelectorAll('.diary-entry').forEach(en=>en.style.display='block');document.querySelector('[data-selected-stage]').textContent='Základová deska';} go(el.dataset.nav)}));
document.querySelectorAll('[data-nav-card]').forEach(c=>c.addEventListener('click',()=>{
  if(c.dataset.navCard==='transactions') transBackTarget='dashboard';
  go(c.dataset.navCard);
  if(c.dataset.transPreset) applyTransFilter(c.dataset.transPreset);
}));

document.querySelector('.primary-button')?.addEventListener('click',()=>{
  const currentRow=stagesList.querySelector('.stage-row.stage-current');
  if(currentRow?.dataset.stageId) openStage(currentRow.dataset.stageId);
  else showToast('Žádná aktuální etapa','Nejdřív si v Etapách nastav, která etapa právě probíhá.');
});

// Poznámka: click na řádky etap v seznamu řeší delegovaný listener
// na stagesList (viz níže) — funguje i pro etapy přidané za běhu.

function openStage(id){
  currentStageId=id || 'foundation';
  let d=stageData[id];
  if(!d){
    // Etapa vytvořená uživatelem přes "Přidat etapu" / "Vlastní etapa" —
    // nemá záznam v předpřipravených datech, tak si detail poskládáme
    // z toho, co už o ní víme z řádku v seznamu.
    const row=stagesList?.querySelector(`[data-stage-id="${id}"]`);
    const name=row?.querySelector('h2')?.textContent || 'Etapa';
    const icon=row?.querySelector('img')?.getAttribute('src') || 'stage-custom.svg';
    const statusText=row?.querySelector('p')?.textContent?.trim() || '';
    const moneyText=row?.querySelector('.stage-money')?.textContent?.trim() || '0 Kč';
    d={name, title:name, status:statusText, spent:moneyText, icon, color:'gray',
       diary:'Zatím tu není žádný zápis.', last:'Zatím žádná aktivita.',
       expense:'Zatím bez výdajů', expenseValue:'0 Kč'};
  }
  document.querySelector('[data-stage-title]').textContent=d.title;
  document.querySelector('[data-stage-name]').textContent=d.name;
  document.querySelector('[data-stage-status]').textContent=d.status;
  document.querySelector('[data-stage-spent]').textContent=d.spent;
  document.querySelector('[data-stage-icon]').src=d.icon;
  document.querySelector('[data-stage-diary]').textContent=d.diary;
  document.querySelector('[data-last-diary]').textContent=d.last;
  const hero=document.querySelector('.stage-detail-hero');
  hero.dataset.tone=d.color;
  go('stageDetail');
  if(typeof renderTasks==='function') renderTasks();
  if(typeof renderStageDetailTransactions==='function') renderStageDetailTransactions();
  if(typeof renderStageDetailDiary==='function') renderStageDetailDiary();
  if(typeof recalcStageMoney==='function') recalcStageMoney();
  if(typeof renderStagePhotoStrip==='function') renderStagePhotoStrip();
}

function openDiaryForStage(){
  const stage=currentStageDisplayName();
  diaryBackTarget='stageDetail';
  document.querySelector('[data-selected-stage]').textContent=stage;
  document.querySelectorAll('.diary-entry').forEach(e=>e.style.display=(e.dataset.stage===stage)?'block':'none');
  document.querySelectorAll('[data-stage-filter]').forEach(b=>b.classList.toggle('is-active',b.dataset.stageFilter===stage));
  go('diary');
}

document.querySelectorAll('[data-open-related="diary"]').forEach(b=>b.addEventListener('click',openDiaryForStage));
document.querySelectorAll('[data-open-entry]').forEach(b=>b.addEventListener('click',()=>openEntry(b.dataset.openEntry,'stageDetail')));

// --- Číslování zápisů (chronologicky podle DATA ZÁPISU, ne podle
// data přidání) — #1 = nejstarší datum. Znovu-spustitelná funkce,
// ať se čísla správně přepočítají i po přidání zpětného zápisu. ---
function renumberDiaryEntries(){
  const entries=[...document.querySelectorAll('.diary-entry')];
  document.querySelectorAll('.entry-number').forEach(b=>b.remove());
  const sorted=entries.map(el=>({el,d:new Date(el.dataset.dateIso||el.dataset.entryId)})).sort((a,b)=>a.d-b.d);
  sorted.forEach((item,i)=>{
    const badge=document.createElement('span');
    badge.className='entry-number';
    badge.textContent='Zápis č. '+(i+1);
    item.el.querySelector('time')?.insertAdjacentElement('afterend',badge);
  });
}
renumberDiaryEntries();

// --- "⋮" u zápisu: export tohoto konkrétního dne ---
document.querySelectorAll('.entry-more').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const entry=btn.closest('.diary-entry');
    const title=entry.querySelector('h2')?.textContent||'Zápis';
    const time=entry.querySelector('time')?.textContent||'';
    const entryId=entry.dataset.entryId;
    openSheet(`<div class="quick-form-top"><h2>${title}</h2><p>${time}</p></div><button class="primary-wide" id="entry-export-btn">Exportovat tento zápis do PDF</button><button class="ghost-wide" data-close-detail>Zavřít</button>`);
    document.getElementById('entry-export-btn')?.addEventListener('click',()=>{
      buildDiaryPDF('one-day',null,entryId);
      closeQuickForm();
    });
  });
});
document.getElementById('diary-back-btn')?.addEventListener('click',()=>go(diaryBackTarget));
document.getElementById('trans-back-btn')?.addEventListener('click',()=>go(transBackTarget));
document.getElementById('trans-add-btn')?.addEventListener('click',()=>openTransactionForm());
document.querySelector('[data-entry-back]')?.addEventListener('click',()=>go(entryBackTarget));

const stageMenu=document.getElementById('stage-menu');
function renderDiaryStageMenu(){
  if(!stageMenu) return;
  const names=visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean);
  stageMenu.innerHTML = ['Všechny etapy', ...names].map(n=>
    `<button data-stage-filter="${n==='Všechny etapy'?'all':n}">${n}</button>`
  ).join('');
}
document.querySelector('[data-stage-toggle]')?.addEventListener('click',()=>{
  renderDiaryStageMenu();
  toggleOverlay(stageMenu, '#stage-menu');
});
stageMenu?.addEventListener('click', e=>{
  const btn=e.target.closest('[data-stage-filter]');
  if(!btn) return;
  const stage=btn.dataset.stageFilter;
  document.querySelector('[data-selected-stage]').textContent=stage==='all'?'Všechny etapy':stage;
  document.querySelectorAll('.diary-entry').forEach(e=>e.style.display=(stage==='all'||e.dataset.stage===stage)?'block':'none');
  stageMenu.classList.remove('open');
});
document.querySelector('[data-open-calendar]')?.addEventListener('click',()=>go('calendar'));


// =========================================================
// v0.93 — Skutečná galerie fotek
// Fotky žijí uvnitř zápisů deníku (každý zápis má vlastní photos[]).
// Galerie, dashboard i detail etapy z nich čerpají agregovaně — dřív
// to všechno viselo na prázdném poli photoData a nikdy se nic
// neuložilo doopravdy.
// =========================================================
function getAllProjectPhotos(){
  const entries=(typeof getCurrentProjectEntries==='function') ? getCurrentProjectEntries() : [];
  const photos=[];
  entries.forEach(e=>{
    (e.photos||[]).forEach(p=>{
      photos.push({
        url:resolvePhotoRef(p.url),
        dateISO:e.dateISO,
        dateLabel:e.dateLabel,
        stage:e.stage||'Bez etapy',
        entryId:e.id,
        entryText:e.text,
      });
    });
  });
  photos.sort((a,b)=> (b.dateISO||'').localeCompare(a.dateISO||''));
  return photos;
}
function visiblePhotoList(){
  const all=getAllProjectPhotos();
  if(activeGalleryStage==='all') return all;
  return all.filter(p=>p.stage===activeGalleryStage);
}
function visiblePhotoIndexes(){
  return visiblePhotoList().map((p,i)=>i);
}
function renderGalleryGrid(){
  const grid=document.getElementById('gallery-grid');
  if(!grid) return;
  const list=visiblePhotoList();
  grid.innerHTML = list.length
    ? list.map((p,i)=>`<button class="gallery-tile" data-photo-index="${i}"><img src="${p.url}" alt=""></button>`).join('')
    : '<p class="empty-hint">Zatím žádné fotografie.</p>';
  grid.querySelectorAll('.gallery-tile').forEach(tile=>tile.addEventListener('click',()=>openPhoto(tile.dataset.photoIndex)));
}
function updateGalleryFilter(){
  const nameEl=document.querySelector('[data-gallery-stage-name]');
  if(nameEl) nameEl.textContent=activeGalleryStage==='all'?'Všechny etapy':activeGalleryStage;
  document.querySelectorAll('[data-gallery-filter]').forEach(b=>b.classList.toggle('is-active', (activeGalleryStage==='all'&&b.dataset.galleryFilter==='all') || (activeGalleryStage!=='all'&&b.dataset.galleryFilter==='stage')));
  renderGalleryGrid();
}
function openGallery(origin='dashboard', stage=null){
  galleryBackTarget=origin==='stage'?'stageDetail':'dashboard';
  activeGalleryStage=stage || (origin==='stage'?(currentStageDisplayName()):'all');
  renderGalleryStageMenu();
  updateGalleryFilter();
  go('gallery');
}
function openPhoto(index){
  currentPhotoIndex=Number(index)||0;
  photoBackTarget='gallery';
  renderPhoto();
  go('photoDetail');
}
function renderPhoto(){
  const list=visiblePhotoList();
  if(!list.length) return;
  if(currentPhotoIndex<0 || currentPhotoIndex>=list.length) currentPhotoIndex=0;
  const p=list[currentPhotoIndex];
  const mainImg=document.querySelector('[data-photo-main]');
  if(mainImg) mainImg.src=p.url;
  const counter=document.querySelector('[data-photo-counter]');
  if(counter) counter.textContent=`${currentPhotoIndex+1} / ${list.length}`;
  const dateEl=document.querySelector('[data-photo-date]');
  if(dateEl) dateEl.textContent=p.dateLabel||p.dateISO||'—';
  const stageEl=document.querySelector('[data-photo-stage]');
  if(stageEl) stageEl.textContent=p.stage||'—';
  const entryEl=document.querySelector('[data-photo-entry]');
  if(entryEl) entryEl.textContent=p.entryText ? (p.entryText.length>40?p.entryText.slice(0,40)+'…':p.entryText) : '—';
  currentPhotoEntryId=p.entryId;
  currentPhotoUrl=p.url;
}
// Fotka žije jako součást zápisu do deníku — datum i etapa se ve
// skutečnosti mění úpravou toho zápisu, ne fotky samotné. Proto
// "Upravit", "Etapa" i "Připojeno k zápisu" vedou na stejné místo.
function openPhotoLinkedEntry(){
  if(!currentPhotoEntryId){ showToast('Bez zápisu','Tahle fotka není připojená k žádnému zápisu.'); return; }
  openEntry(currentPhotoEntryId, 'photoDetail');
}
document.getElementById('photo-edit-date')?.addEventListener('click', openPhotoLinkedEntry);
document.getElementById('photo-edit-stage')?.addEventListener('click', openPhotoLinkedEntry);
document.getElementById('photo-open-entry')?.addEventListener('click', openPhotoLinkedEntry);

document.getElementById('photo-action-download')?.addEventListener('click', ()=>{
  if(!currentPhotoUrl) return;
  const a=document.createElement('a');
  a.href=currentPhotoUrl;
  a.download='fotka.jpg';
  document.body.appendChild(a); a.click(); a.remove();
});
document.getElementById('photo-action-share')?.addEventListener('click', async()=>{
  if(!currentPhotoUrl) return;
  try{
    const res=await fetch(currentPhotoUrl);
    const blob=await res.blob();
    const file=new File([blob], 'fotka.jpg', {type:blob.type||'image/jpeg'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({files:[file]});
    } else {
      showToast('Sdílení nedostupné','Tenhle prohlížeč neumí přímé sdílení obrázku — stáhni si ho a pošli ručně.');
    }
  }catch(err){
    showToast('Nepovedlo se','Zkus to prosím znovu.');
  }
});
document.getElementById('photo-action-delete')?.addEventListener('click', ()=>{
  openSheet(`<div class="quick-form-top"><h2>Smazat fotku?</h2><p>Fotka se odstraní ze zápisu i z galerie. Zbytek zápisu (text, ostatní fotky) zůstane.</p></div><button class="ghost-wide" id="photo-delete-confirm">Smazat fotku</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
  document.getElementById('photo-delete-confirm')?.addEventListener('click',()=>{
    const entries=getCurrentProjectEntries();
    const entry=entries.find(e=>e.id===currentPhotoEntryId);
    if(entry){
      entry.photos=(entry.photos||[]).filter(ph=>ph.url!==currentPhotoUrl);
      saveProjectEntries(entries);
    }
    closeQuickForm();
    if(typeof renderDiaryTimeline==='function') renderDiaryTimeline();
    if(typeof renderDashboardPhotoPreview==='function') renderDashboardPhotoPreview();
    if(typeof renderStagePhotoStrip==='function') renderStagePhotoStrip();
    showToast('Fotka smazána','Zbytek zápisu zůstal beze změny.');
    updateGalleryFilter();
    go('gallery');
  });
});
function shiftPhoto(delta){
  const list=visiblePhotoList();
  if(!list.length) return;
  currentPhotoIndex=(currentPhotoIndex+delta+list.length)%list.length;
  renderPhoto();
}
// Náhled na Dashboardu ("Poslední fotografie") a v detailu etapy
function renderDashboardPhotoPreview(){
  const wrap=document.querySelector('.gallery-card .photo-row');
  if(!wrap) return;
  const list=getAllProjectPhotos().slice(0,6);
  wrap.innerHTML = list.length
    ? list.map(p=>`<img src="${p.url}" alt="">`).join('')
    : '<p class="empty-hint">Zatím žádné fotografie.</p>';
}
function renderStagePhotoStrip(){
  const strip=document.getElementById('stage-photo-add-btn')?.closest('.stage-photo-strip');
  if(!strip) return;
  const addBtn=document.getElementById('stage-photo-add-btn');
  const stageName=currentStageDisplayName();
  const list=getAllProjectPhotos().filter(p=>p.stage===stageName);
  strip.querySelectorAll('img').forEach(img=>img.remove());
  list.slice(0,8).forEach((p,i)=>{
    const img=document.createElement('img');
    img.src=p.url; img.alt='';
    img.addEventListener('click',()=>{ openGallery('stage', stageName); openPhoto(i); });
    strip.insertBefore(img, addBtn);
  });
}

document.querySelectorAll('[data-open-gallery]').forEach(b=>b.addEventListener('click',()=>openGallery(b.dataset.openGallery)));
document.querySelector('[data-gallery-back]')?.addEventListener('click',()=>go(galleryBackTarget));
document.querySelectorAll('[data-gallery-filter]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.galleryFilter==='all'){activeGalleryStage='all';updateGalleryFilter();}else{toggleOverlay(document.getElementById('gallery-stage-menu'), '#gallery-stage-menu');}}));
function renderGalleryStageMenu(){
  const menu=document.getElementById('gallery-stage-menu');
  if(!menu) return;
  const names=visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean);
  menu.innerHTML = ['Všechny etapy', ...names].map(n=>
    `<button data-gallery-stage="${n==='Všechny etapy'?'all':n}">${n}</button>`
  ).join('');
}
document.getElementById('gallery-stage-menu')?.addEventListener('click', e=>{
  const btn=e.target.closest('[data-gallery-stage]');
  if(!btn) return;
  activeGalleryStage = btn.dataset.galleryStage==='all' ? 'all' : btn.dataset.galleryStage;
  document.getElementById('gallery-stage-menu')?.classList.remove('open');
  updateGalleryFilter();
});
document.getElementById('stage-photo-add-btn')?.addEventListener('click',()=>openQuickForm('photo'));
document.querySelector('[data-photo-back]')?.addEventListener('click',()=>go(photoBackTarget));
document.querySelector('[data-photo-prev]')?.addEventListener('click',()=>shiftPhoto(-1));
document.querySelector('[data-photo-next]')?.addEventListener('click',()=>shiftPhoto(1));
document.querySelector('[data-open-attach]')?.addEventListener('click',()=>go('photoAttach'));
document.querySelector('[data-attach-back]')?.addEventListener('click',()=>go('photoDetail'));
document.querySelectorAll('.attach-row').forEach(row=>row.addEventListener('click',()=>{document.querySelectorAll('.attach-row').forEach(r=>r.classList.remove('is-selected'));row.classList.add('is-selected');}));
document.querySelector('.attach-confirm')?.addEventListener('click',()=>go('photoDetail'));

let txRows=[...document.querySelectorAll('.transaction-row')];
const summary=document.getElementById('trans-summary');
// =========================================================
// Úložiště fotek přes IndexedDB
// -------------------------------------------------------
// localStorage (kde appka drží projekty/etapy/deník/transakce) má na
// iPhonu i jinde tvrdý strop kolem 5 MB na appku — to u desítek/stovek
// fotek za celou stavbu nutně dřív nebo později dojde. IndexedDB je
// jiné, mnohem prostornější browserové úložiště (běžně stovky MB až
// GB, podle volného místa v telefonu) určené přesně pro tenhle účel.
// Nové fotky/účtenky se teď ukládají tam; v datech projektu (co jde do
// localStorage) zůstává jen malý odkaz "idb:<id>" místo statisíců
// znaků base64. Starší, dřív uložené fotky (ještě jako plná data)
// dál fungují beze změny — nic se hromadně nepřevádí, jen nové fotky
// jdou od teď tudy.
const MediaStore=(function(){
  const DB_NAME='mojestavba-media', STORE='photos';
  let dbPromise=null;
  function openDB(){
    if(dbPromise) return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      if(!window.indexedDB){ reject(new Error('no-idb')); return; }
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{ req.result.createObjectStore(STORE); };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error);
    });
    return dbPromise;
  }
  async function put(id, dataUrl){
    try{
      const db=await openDB();
      return new Promise((resolve,reject)=>{
        const tx=db.transaction(STORE,'readwrite');
        tx.objectStore(STORE).put(dataUrl, id);
        tx.oncomplete=()=>resolve(true);
        tx.onerror=()=>reject(tx.error);
      });
    }catch(err){ return false; }
  }
  async function get(id){
    try{
      const db=await openDB();
      return new Promise((resolve,reject)=>{
        const tx=db.transaction(STORE,'readonly');
        const req=tx.objectStore(STORE).get(id);
        req.onsuccess=()=>resolve(req.result||null);
        req.onerror=()=>reject(req.error);
      });
    }catch(err){ return null; }
  }
  async function getAllEntries(){
    try{
      const db=await openDB();
      return new Promise((resolve,reject)=>{
        const tx=db.transaction(STORE,'readonly');
        const store=tx.objectStore(STORE);
        const out={};
        const cursorReq=store.openCursor();
        cursorReq.onsuccess=()=>{
          const cursor=cursorReq.result;
          if(cursor){ out[cursor.key]=cursor.value; cursor.continue(); }
          else resolve(out);
        };
        cursorReq.onerror=()=>reject(cursorReq.error);
      });
    }catch(err){ return {}; }
  }
  return {put, get, getAllEntries};
})();
// V paměti "prohřátá" kopie IndexedDB fotek, aby zbytek appky mohl
// odkaz "idb:<id>" vyřešit na skutečná data synchronně (appka je
// jinak psaná tak, že si fotku hned vloží do <img src>).
const PHOTO_CACHE={};
async function warmupPhotoCache(){
  const all=await MediaStore.getAllEntries();
  Object.assign(PHOTO_CACHE, all);
}
warmupPhotoCache();
// Vyřeší "idb:<id>" odkaz na skutečná data fotky; starší fotky (plné
// base64 uložené před touhle verzí) vrátí beze změny.
function resolvePhotoRef(ref){
  if(typeof ref==='string' && ref.startsWith('idb:')){
    return PHOTO_CACHE[ref.slice(4)] || '';
  }
  return ref;
}
function resolvePhotoList(list){
  return (list||[]).map(p=> (p && typeof p==='object') ? {...p, url:resolvePhotoRef(p.url)} : p);
}

// Fotky se dřív ukládaly jako dočasný odkaz na paměť prohlížeče
// (URL.createObjectURL) — ten po jakémkoliv obnovení stránky (i bez
// nasazení nové verze) přestane platit a fotka se rozbije na
// otazník. Teď fotku zmenšíme, uložíme do IndexedDB (viz výše) a appka
// dostane zpátky lehký odkaz, který přežije reload i nasazení nové
// verze a přitom prakticky nezatíží malé úložiště appky.
function fileToStoredImage(file, maxDim=1100, quality=0.68){
  function store(dataUrl){
    const id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
    PHOTO_CACHE[id]=dataUrl;
    MediaStore.put(id, dataUrl); // na pozadí, appka nečeká
    return 'idb:'+id;
  }
  return new Promise((resolve,reject)=>{
    if(!file.type || !file.type.startsWith('image/')){
      // Není obrázek (např. PDF) — uložíme rovnou jako base64 beze změny
      // (netýká se limitu na fotky, appka tohle neřeší přes IndexedDB).
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=reject;
      reader.readAsDataURL(file);
      return;
    }
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width, h=img.height;
        if(w>maxDim || h>maxDim){
          const scale=maxDim/Math.max(w,h);
          w=Math.round(w*scale); h=Math.round(h*scale);
        }
        const canvas=document.createElement('canvas');
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(store(canvas.toDataURL('image/jpeg', quality)));
      };
      img.onerror=reject;
      img.src=reader.result;
    };
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}
function money(n){return new Intl.NumberFormat('cs-CZ').format(n)+' Kč'}
// PDF-bezpečná verze money(): Intl.NumberFormat('cs-CZ') vkládá mezi
// tisíce speciální "neviditelnou" mezeru (ne obyčejnou), kterou ořezané
// PDF písmo nezná — text se pak stejně jako u tečky "·" za touhle mezerou
// utnul (u částek nad 1000 Kč zbyla v PDF jen první skupina číslic).
// Nahradíme ji obyčejnou mezerou, která v PDF spolehlivě funguje vždycky.
function moneyPdf(n){ return money(n).replace(/[\u00A0\u202F\u2009]/g,' '); }
function setSummary(label,value,cls='money-green'){summary.querySelector('.card-label').textContent=label;const h=summary.querySelector('h2');h.className=cls;h.textContent=money(value)}
let activeTransStage='Základová deska';
function currentBalance(){
  return txRows.reduce((a,r)=>a + (r.dataset.type==='income' ? Number(r.dataset.amount) : -Number(r.dataset.amount)), 0);
}
function applyTransFilter(f){
  document.querySelectorAll('[data-trans-filter]').forEach(b=>b.classList.toggle('is-active', b.dataset.transFilter===f));
  document.querySelector('[data-trans-stage-toggle]')?.classList.toggle('is-active', f==='stage');
  txRows.forEach(r=>{let show=f==='all'||(f==='stage'&&r.dataset.stage===activeTransStage)||(f==='expense'&&r.dataset.type==='expense')||(f==='income'&&r.dataset.type==='income');r.classList.toggle('hidden',!show);});
  if(f==='all')setSummary('Aktuální zůstatek',currentBalance(),'money-green');
  if(f==='stage')setSummary(activeTransStage,txRows.filter(r=>r.dataset.stage===activeTransStage&&r.dataset.type==='expense').reduce((a,r)=>a+Number(r.dataset.amount),0),'money-yellow');
  if(f==='expense')setSummary('Celkem výdaje',txRows.filter(r=>r.dataset.type==='expense').reduce((a,r)=>a+Number(r.dataset.amount),0),'money-yellow');
  if(f==='income')setSummary('Celkem vklady',txRows.filter(r=>r.dataset.type==='income').reduce((a,r)=>a+Number(r.dataset.amount),0),'money-green');
}
document.querySelectorAll('[data-trans-filter]').forEach(btn=>btn.addEventListener('click',()=>applyTransFilter(btn.dataset.transFilter)));
const transStageMenu=document.getElementById('trans-stage-menu');
function renderTransStageMenu(){
  if(!transStageMenu) return;
  const names=visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean);
  transStageMenu.innerHTML = names.map(n=>`<button data-trans-stage="${n}">${n}</button>`).join('');
}
document.querySelector('[data-trans-stage-toggle]')?.addEventListener('click',()=>{
  renderTransStageMenu();
  toggleOverlay(transStageMenu, '#trans-stage-menu');
});
transStageMenu?.addEventListener('click', e=>{
  const btn=e.target.closest('[data-trans-stage]');
  if(!btn) return;
  activeTransStage=btn.dataset.transStage;
  document.querySelector('[data-trans-selected-stage]').textContent=activeTransStage;
  transStageMenu.classList.remove('open');
  applyTransFilter('stage');
});

// =========================================================
// v0.25.0 — Etapy: aktuální = první v seznamu, přetahování, dokončené na konci
// =========================================================
const stagesList=document.getElementById('stages-list');
const stagesEmpty=document.getElementById('stages-empty');
const addStageWrap=document.getElementById('add-stage-wrap');
const addStageDropdown=document.getElementById('add-stage-dropdown');
const stagesHint=document.getElementById('stages-hint');

// Ikony jsou sdílené napříč typy projektu (i když se přesný název
// etapy může podle typu lišit) — proto oddělený katalog ikon od sad.
const STAGE_ICON_BY_ID={
  project:'stage-project.svg', earthworks:'stage-earthworks.svg', foundation:'stage-foundation.svg',
  walls:'stage-walls.svg', roof:'stage-roof.svg', windows:'stage-windows.svg', electric:'stage-electric.svg',
  water:'stage-water.svg', heating:'stage-heating.svg', insulation:'stage-insulation.svg',
  interior:'stage-paint.svg', bathroom:'stage-bathroom.svg', kitchen:'stage-kitchen.svg',
  finishing:'stage-finishing.svg', demolition:'stage-demolition.svg', debris:'stage-debris.svg',
  terrain:'stage-terrain.svg', paths:'stage-paths.svg', pergola:'stage-pergola.svg',
  irrigation:'stage-irrigation.svg', lighting:'stage-lighting.svg', planting:'stage-garden.svg',
  lawn:'stage-lawn.svg', custom:'stage-custom.svg', smarthome:'stage-smarthome.svg',
  recuperation:'stage-recuperation.svg', fence:'stage-fence.svg',
};
// Předpřipravené sady etap podle typu projektu — "Vlastní etapa" jde
// přidat vždycky navíc, bez ohledu na typ.
const STAGE_SETS={
  'Rodinný dům':[
    {id:'project',name:'Projekt a povolení'},{id:'earthworks',name:'Zemní práce'},
    {id:'foundation',name:'Základy'},{id:'walls',name:'Hrubá stavba'},{id:'roof',name:'Střecha'},
    {id:'windows',name:'Okna a dveře'},{id:'electric',name:'Elektro'},{id:'smarthome',name:'Chytrá domácnost'},
    {id:'water',name:'Voda a kanalizace'},
    {id:'heating',name:'Technologie a vytápění'},{id:'recuperation',name:'Rekuperace'},
    {id:'insulation',name:'Zateplení a fasáda'},
    {id:'interior',name:'Interiér'},{id:'bathroom',name:'Koupelna'},{id:'kitchen',name:'Kuchyň'},
    {id:'fence',name:'Plot'},
    {id:'finishing',name:'Poslední úpravy'},
  ],
  'Rekonstrukce':[
    {id:'project',name:'Projekt a povolení'},{id:'demolition',name:'Demolice'},
    {id:'debris',name:'Odvoz suti'},{id:'electric',name:'Elektro'},{id:'water',name:'Voda a kanalizace'},
    {id:'windows',name:'Okna a dveře'},{id:'insulation',name:'Zateplení'},{id:'interior',name:'Interiér'},
    {id:'finishing',name:'Poslední úpravy'},
  ],
  'Garáž':[
    {id:'project',name:'Projekt a povolení'},{id:'foundation',name:'Základy'},
    {id:'walls',name:'Hrubá stavba'},{id:'roof',name:'Střecha'},{id:'electric',name:'Elektro'},
    {id:'water',name:'Voda a kanalizace'},{id:'interior',name:'Interiér'},{id:'finishing',name:'Poslední úpravy'},
  ],
  'Zahrada':[
    {id:'terrain',name:'Terénní úpravy'},{id:'fence',name:'Plot'},{id:'paths',name:'Chodníky'},{id:'pergola',name:'Pergola'},
    {id:'irrigation',name:'Zavlažování'},{id:'lighting',name:'Osvětlení'},{id:'planting',name:'Výsadba'},
    {id:'lawn',name:'Trávník'},{id:'finishing',name:'Poslední úpravy'},
  ],
};
function getStageSetForProject(project){
  const type=project?.type||'';
  return STAGE_SETS[type] || STAGE_SETS['Rodinný dům'];
}

function visibleStageRows(){
  return [...stagesList.querySelectorAll('.stage-row:not([data-hidden-stage])')];
}
// Oprava starých dat: smazání předpřipravené etapy (např. "Základy") ji
// jen skrylo (data-hidden-stage), nikdy doopravdy neodstranilo. Pokud se
// pak stejná etapa znovu přidala přes "Přidat etapu", vznikl v seznamu
// druhý řádek se stejným data-stage-id — querySelector pak vždy najde
// jen ten první (často ten skrytý duch), takže se dřívější etapa
// nedala pořádně otevřít ani do ní přidat výdaj. Tahle funkce po
// každém obnovení seznamu etap sloučí duplicitní id do jednoho řádku
// (přednostně necháme ten viditelný).
function dedupeStageRows(){
  const groups={};
  [...stagesList.querySelectorAll('.stage-row')].forEach(row=>{
    const id=row.dataset.stageId;
    if(!id) return;
    (groups[id]=groups[id]||[]).push(row);
  });
  Object.values(groups).forEach(rows=>{
    if(rows.length<2) return;
    const keep = rows.find(r=>!r.hasAttribute('data-hidden-stage')) || rows[0];
    rows.forEach(r=>{ if(r!==keep) r.remove(); });
  });
  // Druhé kolo: dvě etapy se stejným NÁZVEM, ale jiným id (typicky
  // předpřipravená etapa jako "Základy" + později zvlášť založená
  // "vlastní etapa" se stejným jménem jako náhrada za tu smazanou).
  // I tohle appku mátlo — necháme jen jednu, přednostně tu
  // předpřipravenou (má vlastní ikonu a napojení na appku), jinak
  // viditelnou, jinak první.
  const byName={};
  [...stagesList.querySelectorAll('.stage-row')].forEach(row=>{
    const name=(row.querySelector('h2')?.textContent||'').trim().toLowerCase();
    if(!name) return;
    (byName[name]=byName[name]||[]).push(row);
  });
  Object.values(byName).forEach(rows=>{
    if(rows.length<2) return;
    const keep = rows.find(r=>stageData[r.dataset.stageId])
      || rows.find(r=>!r.hasAttribute('data-hidden-stage'))
      || rows[0];
    rows.forEach(r=>{ if(r!==keep) r.remove(); });
  });
}
function updateStagesEmptyState(){
  const rows=visibleStageRows();
  const empty=rows.length===0;
  stagesEmpty.classList.toggle('show',empty);
  addStageWrap.style.display=empty?'none':'';
  stagesList.style.display=empty?'none':'';
  stagesHint.style.display=(empty||rows.length<2)?'none':'';
}

// Nabídka "Přidat etapu" se generuje podle typu aktuálního projektu;
// etapa, co už je v seznamu, se v nabídce schová.
function refreshAddStageOptions(){
  const presetsWrap=document.getElementById('add-stage-presets');
  if(!presetsWrap) return;
  const project=(typeof ProjectStore!=='undefined') ? ProjectStore.current() : null;
  const set=getStageSetForProject(project);
  presetsWrap.innerHTML=set.map(s=>{
    const alreadyAdded=stagesList.querySelector(`[data-stage-id="${s.id}"]:not([data-hidden-stage])`);
    const icon=STAGE_ICON_BY_ID[s.id]||'stage-custom.svg';
    return `<button class="add-stage-option" data-preset-id="${s.id}" data-preset-name="${s.name}"${alreadyAdded?' style="display:none"':''}><img alt="" src="${icon}"><span>${s.name}</span></button>`;
  }).join('');
}

// Udělá z řádku aktuální etapu (zobrazenou nahoře, výrazně) a odebere to předchozí
function setCurrentStage(row){
  if(!row||row.classList.contains('done'))return;
  const prev=stagesList.querySelector('.stage-row.stage-current');
  if(prev && prev!==row){
    prev.classList.remove('stage-current');
    prev.querySelector('em')?.remove();
  }
  if(!row.classList.contains('stage-current')){
    row.classList.add('stage-current');
    if(!row.querySelector('em')){
      const em=document.createElement('em');
      em.textContent='AKTUÁLNÍ';
      row.insertBefore(em, row.querySelector('b'));
    }
    let p=row.querySelector('p');
    if(!p){
      p=document.createElement('p');
      row.querySelector('h2')?.insertAdjacentElement('afterend', p);
    }
    if(!p.textContent.trim() || p.textContent.includes('Nezahájeno') || p.textContent.includes('Dokončeno') || p.textContent.includes('Nedokončeno')) p.innerHTML='<i></i>Probíhá';
  }
}

// Po jakékoliv změně pořadí: první nedokončený řádek = aktuální
function resortStages(){
  const rows=[...stagesList.querySelectorAll('.stage-row')];
  const notDone=rows.filter(r=>!r.classList.contains('done'));
  const done=rows.filter(r=>r.classList.contains('done'));
  [...notDone,...done].forEach(r=>stagesList.appendChild(r));
  const firstVisible=visibleStageRows().find(r=>!r.classList.contains('done'));
  if(firstVisible) setCurrentStage(firstVisible);
}

function makeStageRowHTML(name,iconSrc,status){
  const statusRow = status ? `<p><i></i>${status}</p>` : '';
  return `<button class="stage-row-menu" type="button" data-stage-menu-btn aria-label="Možnosti etapy">⋯</button><img src="${iconSrc}" alt=""><div><h2>${name}</h2>${statusRow}</div><strong class="stage-money muted-money">0 Kč</strong><b>›</b>`;
}

function addStageRow(name,iconSrc,explicitId=null){
  if(explicitId){
    const hidden=stagesList.querySelector(`[data-stage-id="${explicitId}"][data-hidden-stage]`);
    if(hidden){
      hidden.removeAttribute('data-hidden-stage');
      hidden.style.display='';
      const isFirst=visibleStageRows().filter(r=>r!==hidden).length===0;
      hidden.querySelector('h2').textContent=name;
      if(isFirst) setCurrentStage(hidden);
      updateStagesEmptyState();
      refreshAddStageOptions();
      return;
    }
  }
  const article=document.createElement('article');
  article.className='stage-row glass-card';
  article.dataset.stageId=explicitId||('custom-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
  const isFirst=visibleStageRows().length===0;
  article.innerHTML=makeStageRowHTML(name,iconSrc,isFirst?'Probíhá':'');
  stagesList.insertBefore(article, stagesList.querySelector('.stage-row.done'));
  if(isFirst) setCurrentStage(article);
  updateStagesEmptyState();
  refreshAddStageOptions();
}

function makeStageCurrent(row){
  const firstNotDone=stagesList.querySelector('.stage-row:not(.done)');
  if(firstNotDone && firstNotDone!==row) stagesList.insertBefore(row, firstNotDone);
  setCurrentStage(row);
}

// --- "⋯" u etapy (v seznamu i v detailu): nastavit jako aktuální, nebo smazat ---
function openStageActionsMenu(row){
  if(!row) return;
  const name=row.querySelector('h2')?.textContent || 'Etapa';
  const isDone=row.classList.contains('done');
  const isCurrent=row.classList.contains('stage-current');
  let topButtons;
  if(isDone){
    topButtons=`<p class="quick-form-note">Dokončenou etapu nelze nastavit jako aktuální.</p><button class="primary-wide" id="reopen-stage-btn">Znovu otevřít etapu</button>`;
  } else if(isCurrent){
    topButtons=`<p class="quick-form-note">Tohle už je tvoje aktuální etapa.</p><button class="primary-wide" id="complete-stage-btn">Dokončit etapu</button>`;
  } else {
    topButtons=`<button class="primary-wide" id="make-current-btn">Nastavit jako aktuální etapu</button><button class="ghost-wide" id="complete-stage-btn">Dokončit etapu</button>`;
  }
  openSheet(`<div class="quick-form-top"><h2>${name}</h2><p>Co s touto etapou chceš udělat?</p></div>${topButtons}<button class="ghost-wide" id="delete-stage-btn">Smazat etapu</button><button class="ghost-wide" data-close-detail>Zavřít</button>`);
  document.getElementById('make-current-btn')?.addEventListener('click',()=>{
    makeStageCurrent(row);
    closeQuickForm();
    showToast('Aktuální etapa změněna',`„${name}" je teď aktuální etapa.`);
  });
  document.getElementById('complete-stage-btn')?.addEventListener('click',()=>{
    openSheet(`<div class="quick-form-top"><h2>Dokončit etapu „${name}"?</h2><p>Etapa se označí jako hotová. Kdykoliv to jde vrátit zpět přes stejné menu tří teček — "Znovu otevřít etapu".</p></div><button class="primary-wide" id="complete-stage-confirm">Dokončit etapu</button><button class="ghost-wide" data-close-detail>Nechat tak</button>`);
    document.getElementById('complete-stage-confirm')?.addEventListener('click',()=>{
      const wasCurrent=row.classList.contains('stage-current');
      row.classList.add('done');
      row.classList.remove('stage-current');
      row.querySelector('em')?.remove();
      let p=row.querySelector('p');
      if(!p){ p=document.createElement('p'); row.querySelector('h2')?.insertAdjacentElement('afterend', p); }
      p.innerHTML='<i></i>Dokončeno';
      if(wasCurrent){
        const next=visibleStageRows().find(r=>r!==row && !r.classList.contains('done'));
        if(next) setCurrentStage(next);
      }
      resortStages();
      persistCurrentStages();
      closeQuickForm();
      showStageCompletionCelebration(name);
    });
  });
  document.getElementById('reopen-stage-btn')?.addEventListener('click',()=>{
    row.classList.remove('done');
    const p=row.querySelector('p');
    if(p) p.innerHTML='<i></i>Nedokončeno';
    persistCurrentStages();
    closeQuickForm();
    showToast('Etapa znovu otevřena',`„${name}" už neni označená jako hotová.`);
  });
  document.getElementById('delete-stage-btn')?.addEventListener('click',()=>{
    openSheet(`<div class="quick-form-top"><h2>Smazat etapu „${name}"?</h2><p>Etapa zmizí ze seznamu. Transakce, které už u ní máš zapsané, zůstanou zachované v Transakcích. Tohle nejde vrátit zpět — jen si to potvrď.</p></div><button class="ghost-wide" id="delete-stage-confirm">Smazat etapu</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
    document.getElementById('delete-stage-confirm')?.addEventListener('click',()=>{
      const wasCurrent=row.classList.contains('stage-current');
      if(row.hasAttribute('data-dynamic-stage')){
        row.remove();
      } else {
        row.classList.remove('stage-current','done');
        row.querySelector('em')?.remove();
        row.setAttribute('data-hidden-stage','');
        row.style.display='none';
      }
      if(wasCurrent){
        const next=visibleStageRows().find(r=>!r.classList.contains('done'));
        if(next) setCurrentStage(next);
      }
      persistCurrentStages();
      updateStagesEmptyState();
      refreshAddStageOptions();
      closeQuickForm();
      showToast('Etapa smazána',`„${name}" byla odstraněna ze seznamu.`);
      if(appShell.dataset.screen==='stageDetail' && currentStageId===row.dataset.stageId) go('stages');
    });
  });
}

// Delegovaný click na celém seznamu etap — funguje i pro etapy přidané
// později (dřív měly listener jen ty, co byly v HTML hned od začátku).
stagesList?.addEventListener('click', e=>{
  const menuBtn=e.target.closest('[data-stage-menu-btn]');
  const row=e.target.closest('.stage-row');
  if(!row) return;
  if(menuBtn){
    e.stopPropagation();
    openStageActionsMenu(row);
    return;
  }
  openStage(row.dataset.stageId);
});

document.getElementById('stage-detail-menu-btn')?.addEventListener('click',()=>{
  const row=stagesList.querySelector(`[data-stage-id="${currentStageId}"]`);
  openStageActionsMenu(row);
});

resortStages();
updateStagesEmptyState();

// --- Rozbalovací "Přidat etapu" ---
document.getElementById('add-stage-toggle')?.addEventListener('click',()=>toggleOverlay(addStageWrap, '#add-stage-wrap'));
document.getElementById('add-stage-presets')?.addEventListener('click',e=>{
  const btn=e.target.closest('[data-preset-id]');
  if(!btn) return;
  const id=btn.dataset.presetId;
  const name=btn.dataset.presetName;
  addStageRow(name, STAGE_ICON_BY_ID[id]||'stage-custom.svg', id);
  showToast('Etapa přidána',`„${name}" je teď v seznamu.`);
  addStageWrap.classList.remove('open');
});

// --- Vlastní etapa: jen název ---
function openCustomStageForm(){
  addStageWrap.classList.remove('open');
  openSheet(`<div class="quick-form-top"><h2>Vytvořit vlastní etapu</h2><p>Stačí název — uvidíš ji rovnou v seznamu etap.</p></div><label class="form-field"><span>Název etapy <i id="custom-stage-count">0/24</i></span><input id="custom-stage-name" maxlength="24" placeholder="např. Bazén"></label><button class="primary-wide" id="custom-stage-save" disabled>Vytvořit etapu</button>`);
  const input=document.getElementById('custom-stage-name');
  const count=document.getElementById('custom-stage-count');
  const save=document.getElementById('custom-stage-save');
  input?.addEventListener('input',()=>{count.textContent=input.value.length+'/24';save.disabled=input.value.trim().length===0;});
  save?.addEventListener('click',()=>{
    const name=input.value.trim();
    if(!name)return;
    const dup=visibleStageRows().some(r=>(r.querySelector('h2')?.textContent||'').trim().toLowerCase()===name.toLowerCase());
    if(dup){ showToast('Etapa už existuje',`Etapu „${name}" už v seznamu máš.`); return; }
    addStageRow(name,'stage-custom.svg');
    closeQuickForm();
    showToast('Etapa vytvořena',`„${name}" je teď v seznamu etap.`);
  });
}
document.querySelectorAll('#add-stage-custom-option,#stages-empty-custom').forEach(b=>b?.addEventListener('click',openCustomStageForm));
document.getElementById('stages-empty-preset')?.addEventListener('click',()=>{
  closeAllOverlays('#add-stage-wrap');
  addStageWrap.style.display='';
  addStageWrap.classList.add('open');
  addStageWrap.scrollIntoView({behavior:'smooth',block:'center'});
});

updateStagesEmptyState();

// =========================================================
// v0.43 — Reálná data projektů
// Den stavby se teď počítá z data zahájení (ne pevné číslo).
// Přepínání projektů v horní liště doopravdy vymění jméno,
// lokalitu, den stavby i seznam etap za data patřící danému
// projektu. "Upravit projekt" v Nastavení teď změny i uloží.
// =========================================================
function typePillsHTML(prefix, currentValue){
  const presets=['Rodinný dům','Garáž','Rekonstrukce','Zahrada'];
  const isCustom = !!currentValue && !presets.includes(currentValue);
  const pills = presets.map(v=>`<button type="button" class="type-pill${currentValue===v?' is-active':''}" data-type-value="${v}">${v}</button>`).join('');
  return `<div class="type-pill-row" id="${prefix}-type-pills">${pills}<button type="button" class="type-pill${isCustom?' is-active':''}" id="${prefix}-type-custom-btn" data-type-value="">Vlastní</button></div><input type="text" id="${prefix}-type" maxlength="24" placeholder="Napiš vlastní typ projektu..." value="${isCustom?currentValue:''}" style="margin-top:8px${isCustom?'':';display:none'}">`;
}
function wireTypePills(prefix){
  const wrap=document.getElementById(prefix+'-type-pills');
  const customBtn=document.getElementById(prefix+'-type-custom-btn');
  const input=document.getElementById(prefix+'-type');
  if(!wrap||!input) return;
  wrap.querySelectorAll('.type-pill').forEach(btn=>{
    btn.addEventListener('click',()=>{
      wrap.querySelectorAll('.type-pill').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if(btn===customBtn){
        input.style.display='';
        input.value='';
        input.focus();
      } else {
        input.style.display='none';
        input.value=btn.dataset.typeValue;
      }
    });
  });
}
function getTypeValue(prefix){
  const input=document.getElementById(prefix+'-type');
  if(input && input.style.display!=='none') return input.value.trim();
  const active=document.querySelector(`#${prefix}-type-pills .type-pill.is-active`);
  return active ? active.dataset.typeValue : (input?input.value.trim():'');
}
function isRenovationProject(project){
  return !!(project && project.type && /rekonstruk/i.test(project.type));
}
function isGardenProject(project){
  return !!(project && project.type && /zahrad/i.test(project.type));
}
function isGarageProject(project){
  return !!(project && project.type && /garáž|garaz/i.test(project.type));
}
function isCustomProject(project){
  if(!project || !project.type) return false;
  const t=project.type.trim();
  if(!t) return false;
  if(/^rodinný\s*dům$/i.test(t)) return false;
  return !isRenovationProject(project) && !isGardenProject(project) && !isGarageProject(project);
}
function updateHeroImage(theme){
  const heroImg=document.getElementById('hero-house-img');
  if(!heroImg) return;
  const t = theme || app.getAttribute('data-dash-theme') || 'neon';
  const project = (typeof ProjectStore!=='undefined') ? ProjectStore.current() : null;
  const suffix = t==='blueprint' ? '-light' : '';
  let base = 'hero-house';
  if(isGardenProject(project)) base = 'hero-house-garden';
  else if(isGarageProject(project)) base = 'hero-house-garage';
  else if(isRenovationProject(project)) base = 'hero-house-renovation';
  else if(isCustomProject(project)) base = 'hero-house-custom';
  heroImg.src = `${base}${suffix}.webp`;
}

const ProjectStore=(function(){
  const KEY='ms_projects';
  const CURRENT_KEY='ms_current_project_id';
  function todayISO(){return new Date().toISOString().slice(0,10);}
  function uid(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
  function loadAll(){
    try{const list=JSON.parse(localStorage.getItem(KEY));return Array.isArray(list)?list:[];}
    catch(err){return [];}
  }
  function saveAll(list){try{localStorage.setItem(KEY, JSON.stringify(list));return true;}catch(err){return false;}}
  function getCurrentId(){try{return localStorage.getItem(CURRENT_KEY);}catch(err){return null;}}
  function setCurrentId(id){try{localStorage.setItem(CURRENT_KEY, id||'');}catch(err){}}

  // Starší verze appky uměla uložit jen jeden projekt (bez data
  // zahájení, bez podpory víc projektů zároveň) pod klíčem "ms_project".
  // Při prvním spuštění nové appky ho převedeme do nového formátu.
  function migrateLegacyIfNeeded(){
    let list=loadAll();
    if(list.length) return list;
    let legacy=null;
    try{legacy=JSON.parse(localStorage.getItem('ms_project'));}catch(err){}
    if(legacy && legacy.name){
      const p={id:uid(), name:legacy.name, location:legacy.location||'', type:legacy.type||'🏠', startDate:legacy.startDate||todayISO(), stagesSnapshot:null};
      list=[p];
      saveAll(list);
      setCurrentId(p.id);
    }
    return list;
  }
  function all(){return migrateLegacyIfNeeded();}
  function current(){
    const list=all();
    const id=getCurrentId();
    return list.find(p=>p.id===id) || list[0] || null;
  }
  function create(data){
    const list=all();
    const p={id:uid(), name:data.name, location:data.location||'', type:data.type||'🏠', startDate:data.startDate||null, stagesSnapshot:null};
    list.push(p);
    saveAll(list);
    setCurrentId(p.id);
    return p;
  }
  function update(id, patch){
    const list=all();
    const p=list.find(x=>x.id===id);
    if(!p) return null;
    const backup=JSON.stringify(p);
    Object.assign(p, patch);
    if(!saveAll(list)){
      Object.assign(p, JSON.parse(backup));
      return null;
    }
    return p;
  }
  function remove(id){
    const list=all().filter(x=>x.id!==id);
    saveAll(list);
    if(getCurrentId()===id) setCurrentId(list[0]?.id || null);
    return list;
  }
  function switchTo(id){setCurrentId(id); return current();}
  // Den zahájení = den 1. Počítá se z kalendářních dní, ne z hodin,
  // aby se číslo neposouvalo v průběhu dne.
  function dayNumber(startISO, endISO){
    if(!startISO) return null;
    const start=new Date(startISO+'T00:00:00');
    const now=endISO ? new Date(endISO+'T00:00:00') : new Date();
    start.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return Math.round((now-start)/86400000)+1;
  }
  return {all, current, create, update, remove, switchTo, dayNumber, todayISO, getCurrentId};
})();


const dayBox=document.getElementById('day-box');
function renderDayCounter(project){
  const el=document.querySelector('.day-box strong');
  const label=document.querySelector('.day-box p');
  if(!el || !dayBox) return;
  dayBox.classList.remove('not-started','completed');
  if(project && project.completedDate){
    const n=ProjectStore.dayNumber(project.startDate, project.completedDate);
    dayBox.classList.add('completed');
    if(label) label.textContent='Postaveno za';
    el.textContent=(n && n>0) ? (n+' dní') : '—';
    return;
  }
  if(label) label.textContent='Den stavby';
  const n=project ? ProjectStore.dayNumber(project.startDate) : null;
  if(project && !project.startDate){
    dayBox.classList.add('not-started');
    el.innerHTML='▶&nbsp;Zahájit stavbu';
  } else {
    el.textContent=(n && n>0) ? n : '—';
  }
}
function openStartConstructionSheet(){
  const project=ProjectStore.current();
  if(!project) return;
  if(visibleStageRows().length===0){
    showToast('Nejdřív přidej první etapu','Stavbu jde zahájit, až máš aspoň jednu etapu. Přesměrovávám tě do Etap.');
    setTimeout(()=>go('stages'), 900);
    return;
  }
  openSheet(`<div class="quick-form-top"><h2>Zahájit stavbu</h2><p>Od tohoto data se počítá den stavby (den zahájení = den 1). Klidně nech dnešní datum, nebo zvol jiné.</p></div><label class="form-field"><span>Datum zahájení</span><input id="start-construction-date" type="date" value="${ProjectStore.todayISO()}"></label><button class="primary-wide" id="start-construction-confirm">Zahájit stavbu</button>`);
  document.getElementById('start-construction-confirm')?.addEventListener('click',()=>{
    const val=document.getElementById('start-construction-date')?.value || ProjectStore.todayISO();
    ProjectStore.update(project.id, {startDate:val});
    deleteSystemEvent('Zahájení stavby');
    addEventRecord({title:'Zahájení stavby', dateISO:val, dateLabel:formatDateCZ(val), type:'system', reminder:'none', stage:'Bez etapy'});
    applyCurrentProjectToUI();
    closeQuickForm();
    showToast('Stavba zahájena','Den stavby se od teď počítá od zadaného data. Přidal jsem to i do kalendáře.');
  });
}
function openCompleteConstructionSheet(){
  const project=ProjectStore.current();
  if(!project || !project.startDate) return;
  openTypeToConfirmSheet({
    title:'Zkolaudovat stavbu?',
    description:'Den stavby se zastaví na dnešním dni. Kdykoliv to jde vzít zpět v Nastavení.',
    confirmWord:'ZKOLAUDOVAT',
    confirmLabel:'Zkolaudovat stavbu',
    onConfirm:()=>{
      const completedDate=ProjectStore.todayISO();
      ProjectStore.update(project.id, {completedDate});
      deleteSystemEvent('Kolaudace stavby');
      addEventRecord({title:'Kolaudace stavby', dateISO:completedDate, dateLabel:formatDateCZ(completedDate), type:'system', reminder:'none', stage:'Bez etapy'});
      applyCurrentProjectToUI();
      closeQuickForm();
      const days=ProjectStore.dayNumber(project.startDate, completedDate);
      showFireworksCelebration(project.name, days);
    }
  });
}
function openCancelCompletionSheet(){
  const project=ProjectStore.current();
  if(!project || !project.completedDate) return;
  openSheet(`<div class="quick-form-top"><h2>Zrušit zkolaudování?</h2><p>Den stavby se znovu rozpočítá a bude dál přibývat. Etapy, deník ani transakce se tím nesmažou.</p></div><button class="ghost-wide" id="cancel-completion-confirm">Zrušit zkolaudování</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
  document.getElementById('cancel-completion-confirm')?.addEventListener('click',()=>{
    ProjectStore.update(project.id, {completedDate:null});
    deleteSystemEvent('Kolaudace stavby');
    applyCurrentProjectToUI();
    closeQuickForm();
    showToast('Zkolaudování zrušeno','Den stavby se zase počítá dál.');
  });
}
function openTypeToConfirmSheet({title,description,confirmWord,confirmLabel,onConfirm}){
  openSheet(`<div class="quick-form-top"><h2>${title}</h2><p>${description}</p></div><label class="form-field"><span>Napiš „${confirmWord}" pro potvrzení</span><input id="type-confirm-input" autocomplete="off" autocapitalize="characters" placeholder="${confirmWord}"></label><button class="primary-wide" id="type-confirm-btn" disabled>${confirmLabel}</button><button class="ghost-wide" data-close-detail>Zrušit</button>`);
  const input=document.getElementById('type-confirm-input');
  const btn=document.getElementById('type-confirm-btn');
  input?.addEventListener('input',()=>{
    btn.disabled = input.value.trim().toUpperCase() !== confirmWord.toUpperCase();
  });
  btn?.addEventListener('click',()=>{ if(!btn.disabled) onConfirm(); });
}
function showFireworksCelebration(projectName, days){
  const n=days||0;
  const dayWord = n===1 ? 'dni' : (n>=2&&n<=4 ? 'dnech' : 'dnech');
  const overlay=document.createElement('div');
  overlay.className='fireworks-overlay';
  overlay.innerHTML=`<div class="fireworks-canvas"></div><div class="celebration-card"><h1>🎉 Gratulujeme!</h1><p>„${projectName}" je hotový po ${n} ${dayWord} od zahájení stavby. Ať slouží dlouho a bez starostí.</p><button class="primary-wide" id="fireworks-close">Děkuji</button></div>`;
  document.body.appendChild(overlay);
  const canvas=overlay.querySelector('.fireworks-canvas');
  const colors=['#e8622a','#30e9ff','#b04cff','#ffd35c','#4dffab','#ff5e7b','#ffffff'];
  let rounds=0;
  const timer=setInterval(()=>{
    for(let i=0;i<3;i++){
      const fw=document.createElement('div');
      fw.className='firework-burst';
      fw.style.left=(8+Math.random()*84)+'%';
      fw.style.top=(8+Math.random()*55)+'%';
      fw.style.setProperty('--fw-color', colors[Math.floor(Math.random()*colors.length)]);
      canvas.appendChild(fw);
      setTimeout(()=>fw.remove(), 1300);
    }
    rounds++;
    if(rounds>=9) clearInterval(timer);
  }, 380);
  const close=()=>{ clearInterval(timer); overlay.remove(); };
  overlay.querySelector('#fireworks-close')?.addEventListener('click', close);
}
function showStageCompletionCelebration(stageName){
  const overlay=document.createElement('div');
  overlay.className='fireworks-overlay';
  overlay.innerHTML=`<div class="fireworks-canvas"></div><div class="celebration-card"><h1>🎉 Etapa hotová!</h1><p>„${stageName}" je dokončená. Skvělá práce — jede se dál.</p><button class="primary-wide" id="fireworks-close">Děkuji</button></div>`;
  document.body.appendChild(overlay);
  const canvas=overlay.querySelector('.fireworks-canvas');
  const colors=['#e8622a','#30e9ff','#b04cff','#ffd35c','#4dffab','#ff5e7b','#ffffff'];
  let rounds=0;
  const timer=setInterval(()=>{
    for(let i=0;i<3;i++){
      const fw=document.createElement('div');
      fw.className='firework-burst';
      fw.style.left=(8+Math.random()*84)+'%';
      fw.style.top=(8+Math.random()*55)+'%';
      fw.style.setProperty('--fw-color', colors[Math.floor(Math.random()*colors.length)]);
      canvas.appendChild(fw);
      setTimeout(()=>fw.remove(), 1300);
    }
    rounds++;
    if(rounds>=9) clearInterval(timer);
  }, 380);
  const close=()=>{ clearInterval(timer); overlay.remove(); };
  overlay.querySelector('#fireworks-close')?.addEventListener('click', close);
}
function openCancelStartSheet(project){
  openTypeToConfirmSheet({
    description:'Den stavby se přestane počítat, dokud stavbu znovu nezahájíš. Etapy, deník ani transakce se tím nesmažou.',
    confirmWord:'ZRUŠIT',
    confirmLabel:'Zrušit zahájení',
    onConfirm:()=>{
      ProjectStore.update(project.id, {startDate:null});
      deleteSystemEvent('Zahájení stavby');
      applyCurrentProjectToUI();
      closeQuickForm();
      showToast('Zahájení zrušeno','Den stavby uvidíš znovu po opětovném zahájení.');
    }
  });
}
function openRunningConstructionMenu(project){
  const n=ProjectStore.dayNumber(project.startDate);
  openSheet(`<div class="quick-form-top"><h2>Stavba běží</h2><p>Den ${n||1} od zahájení ${formatDateCZ(project.startDate)}.</p></div><button class="primary-wide" id="running-complete-btn">🎉&nbsp;Zkolaudovat stavbu</button><button class="ghost-wide" id="running-cancel-btn">Zrušit zahájení stavby</button><button class="ghost-wide" data-close-detail>Zavřít</button>`);
  document.getElementById('running-complete-btn')?.addEventListener('click',()=>{ closeQuickForm(); openCompleteConstructionSheet(); });
  document.getElementById('running-cancel-btn')?.addEventListener('click',()=>{ closeQuickForm(); openCancelStartSheet(project); });
}
dayBox?.addEventListener('click',()=>{
  const project=ProjectStore.current();
  if(!project || project.completedDate) return;
  if(!project.startDate) openStartConstructionSheet();
  else openRunningConstructionMenu(project);
});

// Uloží, jaké etapy jsou teď vidět v seznamu (a v jakém stavu),
// jako "snapshot" patřící aktuálnímu projektu.
function captureStagesSnapshot(){
  dedupeStageRows();
  return [...stagesList.querySelectorAll('.stage-row')].filter(r=>!r.hasAttribute('data-hidden-stage')).map(row=>({
    id:row.dataset.stageId,
    name:row.querySelector('h2')?.textContent||'',
    icon:row.querySelector('img')?.getAttribute('src')||'',
    statusText:row.querySelector('p')?.textContent?.trim()||'',
    moneyText:row.querySelector('.stage-money')?.textContent?.trim()||'0 Kč',
    done:row.classList.contains('done'),
    current:row.classList.contains('stage-current'),
  }));
}
function persistCurrentStages(){
  const id=ProjectStore.getCurrentId();
  if(!id) return;
  ProjectStore.update(id, {stagesSnapshot: captureStagesSnapshot()});
}
// Podle uloženého snapshotu znovu poskládá seznam etap: předpřipravené
// etapy jen skryje/zobrazí, vlastní etapy (co nejsou trvale v HTML)
// vytvoří/zahodí podle potřeby.
function restoreStagesSnapshot(snapshot){
  [...stagesList.querySelectorAll('.stage-row')].forEach(row=>{
    row.setAttribute('data-hidden-stage','');
    row.style.display='none';
    // Řádek patří statické sadě sdílené mezi projekty — když ho
    // schováváme (protože nepatří do projektu, na který se právě
    // přepínáme), musí se mu smazat i staré značky "aktuální"/
    // "hotovo", jinak si je řádek "pamatuje" a projeví se nesprávně,
    // až ho příště pro jiný projekt zase zobrazíme.
    row.classList.remove('stage-current','done');
  });
  stagesList.querySelectorAll('.stage-row[data-dynamic-stage]').forEach(r=>r.remove());
  (snapshot||[]).forEach(s=>{
    let row=stagesList.querySelector(`[data-stage-id="${s.id}"]`);
    if(row){
      row.removeAttribute('data-hidden-stage');
      row.style.display='';
    } else {
      row=document.createElement('article');
      row.className='stage-row glass-card';
      row.dataset.stageId=s.id;
      row.setAttribute('data-dynamic-stage','');
      row.innerHTML=makeStageRowHTML(s.name, s.icon||'stage-custom.svg', s.statusText||'');
      stagesList.appendChild(row);
    }
    row.classList.toggle('done', !!s.done);
    row.classList.toggle('stage-current', !!s.current);
    if(s.current){
      if(!row.querySelector('em')){
        const em=document.createElement('em');
        em.textContent='AKTUÁLNÍ';
        row.insertBefore(em, row.querySelector('b'));
      }
    } else {
      row.querySelector('em')?.remove();
    }
    if(s.statusText){
      let p=row.querySelector('p');
      if(!p){
        p=document.createElement('p');
        row.querySelector('h2')?.insertAdjacentElement('afterend', p);
      }
      p.innerHTML='<i></i>'+s.statusText;
    } else {
      row.querySelector('p')?.remove();
    }
    const moneyEl=row.querySelector('.stage-money');
    if(moneyEl) moneyEl.textContent=s.moneyText||'0 Kč';
  });
  dedupeStageRows();
  resortStages();
  updateStagesEmptyState();
  refreshAddStageOptions();
}
// Kdykoliv se seznam etap jakkoliv změní (přidání, smazání aktuální
// etapy, dokončení...), obnovíme uložený snapshot patřící aktuálnímu
// projektu — nemusíme to ručně volat na každém jednotlivém tlačítku.
new MutationObserver(()=>persistCurrentStages()).observe(stagesList,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-hidden-stage']});

// =========================================================
// v0.45 — Reálné transakce
// Transakce patří k aktuálnímu projektu (uloží se v localStorage),
// dají se přidat přes centrální plus i z etapy, a u každé je "⋯"
// pro Upravit / Smazat — pro případ překlepu nebo omylu.
// =========================================================
function getCurrentProjectTx(){
  return ProjectStore.current()?.transactions || [];
}
function saveProjectTx(list){
  const id=ProjectStore.getCurrentId();
  if(!id) return false;
  return !!ProjectStore.update(id, {transactions:list});
}
function addTransactionRecord(tx){
  const list=getCurrentProjectTx();
  tx.id='t'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  list.unshift(tx);
  return saveProjectTx(list) ? tx : null;
}
function updateTransactionRecord(id,patch){
  const list=getCurrentProjectTx();
  const tx=list.find(t=>t.id===id);
  if(!tx) return null;
  Object.assign(tx,patch);
  return saveProjectTx(list) ? tx : null;
}
function deleteTransactionRecord(id){
  saveProjectTx(getCurrentProjectTx().filter(t=>t.id!==id));
}
function formatDateCZ(iso){
  if(!iso) return '';
  const d=new Date(iso+'T00:00:00');
  if(isNaN(d)) return iso;
  return `${d.getDate()}. ${d.getMonth()+1}. ${d.getFullYear()}`;
}
// Transakce si pamatuje etapu jen jako text (název), ne id — najdeme
// jí ikonu podle skutečného řádku v seznamu etap. Bez etapy/Ostatní/
// neexistující etapa → obecná ikonka.
function getStageIconByName(name){
  if(!name || name==='Bez etapy') return 'stage-custom.svg';
  const row=[...stagesList.querySelectorAll('.stage-row')].find(r=>r.querySelector('h2')?.textContent?.trim()===name);
  return row?.querySelector('img')?.getAttribute('src') || 'stage-custom.svg';
}
function txRowHTML(t){
  const isIncome=t.type==='income';
  const photos=t.photos || (t.photo?[t.photo]:[]);
  let iconHTML;
  if(isIncome){
    iconHTML=`<span class="tx-icon green">＋</span>`;
  } else {
    const stageIcon=getStageIconByName(t.stage);
    iconHTML=`<span class="tx-icon-wrap"><span class="tx-icon purple"><img src="${stageIcon}" alt="" class="tx-stage-icon"></span></span>`;
  }
  const photoThumb=photos.length?`<span class="tx-thumb"><img src="${resolvePhotoRef(photos[0].url)}" alt=""></span>`:'';
  const photoCount=photos.length>1?`<b class="tx-thumb-count">+${photos.length-1}</b>`:'';
  const receiptThumb=t.receipt?`<span class="tx-thumb"><img src="${resolvePhotoRef(t.receipt)}" alt=""></span>`:'';
  const cluster=(!isIncome && (photoThumb||receiptThumb))?`<span class="tx-thumb-cluster">${photoThumb}${photoCount}${receiptThumb}</span>`:'';
  return `<article class="transaction-row glass-card" data-tx-id="${t.id}" data-type="${t.type}" data-stage="${t.stage||'Bez etapy'}" data-amount="${t.amount}">
    ${iconHTML}
    <div><strong>${t.name}</strong><small>${t.dateLabel||''} · ${t.stage||'Bez etapy'}</small></div>
    <b${isIncome?' class="positive"':''}>${isIncome?'+':'-'}${money(t.amount)}</b>
    <button class="stage-row-menu" type="button" data-tx-menu-btn aria-label="Možnosti transakce">⋯</button>
    ${cluster}
  </article>`;
}
// Přepočítá skutečnou částku utracenou v každé etapě ze všech
// výdajových transakcí — .stage-money se dřív jen pasivně ukládal
// (co tam bylo napsáno naposled), nikdy se nedopočítal ze skutečných
// dat. Volá se po každé změně transakcí.
function recalcStageMoney(){
  const sums={};
  getCurrentProjectTx().forEach(t=>{
    if(t.type!=='expense') return;
    const stage=t.stage||'Bez etapy';
    sums[stage]=(sums[stage]||0)+Number(t.amount||0);
  });
  document.querySelectorAll('.stage-row').forEach(row=>{
    const name=row.querySelector('h2')?.textContent?.trim();
    const moneyEl=row.querySelector('.stage-money');
    if(!name || !moneyEl) return;
    const sum=sums[name]||0;
    moneyEl.textContent = sum<0 ? ('-'+money(Math.abs(sum))) : money(sum);
    moneyEl.classList.toggle('muted-money', sum===0);
    moneyEl.classList.toggle('negative-money', sum!==0);
  });
  const detailMoney=document.querySelector('[data-stage-spent]');
  if(detailMoney){
    const currentName=currentStageDisplayName();
    detailMoney.textContent=money(sums[currentName]||0);
  }
}
function renderTransactionList(){
  const listEl=document.getElementById('transaction-list');
  if(!listEl) return;
  const list=[...getCurrentProjectTx()].sort((a,b)=>(b.dateISO||'').localeCompare(a.dateISO||''));
  listEl.innerHTML = list.length ? list.map(txRowHTML).join('') : '<p class="empty-hint">Zatím žádné transakce. Přidej první přes centrální plus.</p>';
  txRows=[...listEl.querySelectorAll('.transaction-row')];
  applyTransFilter(document.querySelector('[data-trans-filter].is-active')?.dataset.transFilter||'all');
  renderStageDetailTransactions();
  recalcStageMoney();
}
// Mini seznam transakcí v detailu etapy (poslední 3 pro danou etapu)
function renderStageDetailDiary(){
  const stageName=currentStageDisplayName();
  const entries=getCurrentProjectEntries().filter(e=>e.stage===stageName && !e.hiddenFromDiary).sort((a,b)=>b.dateISO.localeCompare(a.dateISO));
  const listWrap=document.querySelector('[data-stage-diary]');
  if(listWrap){
    listWrap.textContent = entries.length
      ? `${entries.length} ${entries.length===1?'zápis':'zápisy'} u této etapy — poslední ${entries[0].dateLabel||''}`
      : 'Zatím žádný zápis u této etapy.';
  }
  const lastWrap=document.querySelector('[data-last-diary]');
  const smallLabel=document.getElementById('activity-diary-card')?.querySelector('small');
  if(entries.length){
    const latest=entries[0];
    if(lastWrap) lastWrap.textContent = latest.text?.slice(0,60) || 'Bez popisu';
    if(smallLabel) smallLabel.textContent = latest.dateLabel || '';
  } else {
    if(lastWrap) lastWrap.textContent = 'Zatím žádný zápis.';
    if(smallLabel) smallLabel.textContent = 'Zatím prázdné';
  }
}
function renderStageDetailTransactions(){
  const wrap=document.querySelector('[data-stage-transactions]');
  const stageName=currentStageDisplayName();
  const stageTx=getCurrentProjectTx().filter(t=>t.stage===stageName).sort((a,b)=>(b.dateISO||'').localeCompare(a.dateISO||''));
  if(wrap){
    const items=stageTx.slice(0,3);
    wrap.innerHTML = items.length ? items.map(t=>{
      const isIncome=t.type==='income';
      return `<article data-tx-id="${t.id}"><span class="${isIncome?'qa-green':'qa-orange'}">▰</span><small>${t.dateLabel||''}</small><p>${t.name}</p><b>${isIncome?'+':'-'}${money(t.amount)}</b></article>`;
    }).join('') : '<p class="empty-hint">Zatím žádná transakce v této etapě.</p>';
    wrap.querySelectorAll('[data-tx-id]').forEach(el=>el.addEventListener('click',()=>openTransactionDetail(el.dataset.txId)));
  }
  const lastExpenseWrap=document.querySelector('[data-last-expense-wrap]');
  if(lastExpenseWrap){
    const lastExpense=stageTx.find(t=>t.type==='expense');
    lastExpenseWrap.innerHTML = lastExpense
      ? `<p>${lastExpense.name}</p><strong class="money-red">-${money(lastExpense.amount)}</strong>`
      : `<p>Zatím bez výdajů</p>`;
  }
}
document.getElementById('activity-diary-card')?.addEventListener('click',()=>{
  const stageName=currentStageDisplayName();
  const entries=getCurrentProjectEntries().filter(e=>e.stage===stageName && !e.hiddenFromDiary).sort((a,b)=>b.dateISO.localeCompare(a.dateISO));
  if(entries.length) openEntry(entries[0].id,'stageDetail');
  else openDiaryForStage();
});
document.getElementById('activity-gallery-card')?.addEventListener('click',()=>{
  const stageName=currentStageDisplayName();
  openGallery('stage', stageName);
});
document.getElementById('activity-expense-card')?.addEventListener('click',()=>{
  const stageName=currentStageDisplayName();
  const last=getCurrentProjectTx().filter(t=>t.type==='expense'&&t.stage===stageName)[0];
  if(last){ openTransactionDetail(last.id); return; }
  transBackTarget='stageDetail';
  activeTransStage=stageName;
  go('transactions');
  const selEl=document.querySelector('[data-trans-selected-stage]');
  if(selEl) selEl.textContent=stageName;
  applyTransFilter('stage');
});
function renderDashboardMoneyCards(){
  const list=getCurrentProjectTx();
  const balance=list.reduce((a,t)=>a+(t.type==='income'?t.amount:-t.amount),0);
  const balanceCard=document.querySelector('[data-nav-card="transactions"][data-trans-preset="all"] h2');
  if(balanceCard){
    balanceCard.textContent=money(balance);
    balanceCard.className=balance<0?'money-red':'money-green';
  }
  const lastExpense=list.find(t=>t.type==='expense');
  const expenseCard=document.querySelector('[data-nav-card="transactions"][data-trans-preset="expense"]');
  if(expenseCard){
    const h2=expenseCard.querySelector('h2');
    const p=expenseCard.querySelector('p.muted');
    if(lastExpense){
      if(h2) h2.textContent=money(lastExpense.amount);
      if(p) p.innerHTML=`${lastExpense.name}<br>${lastExpense.dateLabel||''}`;
    } else {
      if(h2) h2.textContent='0 Kč';
      if(p) p.innerHTML='Zatím žádný výdaj';
    }
  }
}
// Formulář nové/upravované transakce — reálné vstupy (žádné předvyplněné
// ukázkové hodnoty), etapy se nabízí z aktuálního seznamu etap.
function transactionFormHTML(prefill, options={}){
  const isEdit=!!(prefill && prefill.id);
  const lockExpense=!!options.lockExpense;
  const type=lockExpense ? 'expense' : (prefill?.type||'expense');
  const stageNames=['Bez etapy', ...visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean)];
  const stageDefault=options.presetStage || prefill?.stage || currentStageDisplayName();
  const stagePicker=stagePillsHTML('tx-form-stage', stageNames, stageDefault);
  const namePlaceholder=type==='income'?'např. Vklad na stavbu':'např. Materiál';
  const toggleHTML=lockExpense ? '' : `<div class="form-toggle" id="tx-type-toggle"><button type="button" data-tx-type="expense" class="${type==='expense'?'is-active':''}">Výdaj</button><button type="button" data-tx-type="income" class="${type==='income'?'is-active':''}">Vklad</button></div>`;
  return `<div class="quick-form-top"><h2>${isEdit?'Upravit transakci':(lockExpense?'Nový výdaj':'Nová transakce')}</h2><p>Doklad zůstane jen u výdaje, nepatří do galerie ani kroniky.</p></div>
${toggleHTML}
<label class="form-field"><span>Datum</span><input id="tx-form-date" type="date" value="${prefill?.dateISO||ProjectStore.todayISO()}"></label>
<label class="form-field" id="tx-stage-field"${type==='income'?' style="display:none"':''}><span>Etapa</span>${stagePicker}</label>
<label class="form-field"><span>Částka (Kč) *</span><input id="tx-form-amount" type="number" inputmode="numeric" value="${prefill?.amount||''}" placeholder="např. 12450"></label>
<label class="form-field"><span>Název *</span><input id="tx-form-name" value="${prefill?.name||''}" maxlength="40" placeholder="${namePlaceholder}"></label>
<label class="form-field" id="tx-company-field"${type==='income'?' style="display:none"':''}><span>Firma volitelně</span><input id="tx-form-company" value="${prefill?.company||''}" maxlength="30"></label>
<label class="form-field"><span>Poznámka volitelně</span><input id="tx-form-note" value="${prefill?.note||''}" placeholder="${type==='income'?'Poznámka ke vkladu...':'Poznámka k výdaji...'}"></label>
<div class="form-field" id="tx-receipt-field"${type==='income'?' style="display:none"':''}><span>Účtenka volitelně</span>
<div class="photo-strip-form" id="tx-receipt-strip">
${prefill?.receipt?`<img src="${resolvePhotoRef(prefill.receipt)}" alt="" id="tx-receipt-preview">`:''}
<button type="button" id="tx-receipt-add-btn" style="${prefill?.receipt?'display:none':''}"><span class="psf-icon">📷</span><small>Vyfotit účtenku</small></button>
</div>
<input type="file" accept="image/*" id="tx-receipt-input" hidden>
</div>
<div class="form-field" id="tx-photo-field"${type==='income'?' style="display:none"':''}><span>Fotky volitelně<i class="field-hint">Přidají se i do galerie k téhle etapě</i></span>
<div class="photo-strip-form" id="tx-photo-strip">
<button type="button" id="tx-photo-add-btn"><span class="psf-icon">🖼️</span><small>Přidat fotky</small></button>
</div>
<input type="file" accept="image/*" multiple id="tx-photo-input" hidden>
</div>
<button class="primary-wide" id="tx-form-save">${isEdit?'Uložit změny':'Uložit transakci'}</button>`;
}
// Chytrý našeptávač pro textová pole — vlastní, ne systémový (se
// systémovým <datalist> jsou na iOS potíže se spolehlivostí). Ukáže
// max 5 dřívějších hodnot, co obsahují napsaný text, kliknutím se
// rovnou vyplní.
function attachAutocomplete(inputId, getValues){
  const input=document.getElementById(inputId);
  if(!input) return;
  const wrap=document.createElement('div');
  wrap.className='autocomplete-list';
  input.parentElement.style.position='relative';
  input.insertAdjacentElement('afterend', wrap);
  function render(){
    const q=input.value.trim().toLowerCase();
    if(!q){ wrap.innerHTML=''; wrap.classList.remove('open'); return; }
    const values=[...new Set(getValues().filter(Boolean))];
    const matches=values.filter(v=>v.toLowerCase().includes(q) && v.toLowerCase()!==q).slice(0,5);
    if(!matches.length){ wrap.innerHTML=''; wrap.classList.remove('open'); return; }
    wrap.innerHTML=matches.map(v=>`<button type="button" data-ac-value="${v}">${v}</button>`).join('');
    wrap.classList.add('open');
  }
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  wrap.addEventListener('mousedown', e=>{
    const btn=e.target.closest('[data-ac-value]');
    if(!btn) return;
    input.value=btn.dataset.acValue;
    wrap.innerHTML=''; wrap.classList.remove('open');
  });
  input.addEventListener('blur', ()=>setTimeout(()=>wrap.classList.remove('open'), 150));
}
function openTransactionForm(prefill=null, options={}){
  const isEdit=!!(prefill && prefill.id);
  const lockExpense=!!options.lockExpense;
  openSheet(transactionFormHTML(prefill, options));
  wireStagePills('tx-form-stage');
  attachAutocomplete('tx-form-company', ()=>getCurrentProjectTx().map(t=>t.company));
  attachAutocomplete('tx-form-name', ()=>getCurrentProjectTx().map(t=>t.name));
  let currentType=lockExpense ? 'expense' : (prefill?.type||'expense');
  let receiptUrl=prefill?.receipt||null;
  const receiptAddBtn=document.getElementById('tx-receipt-add-btn');
  const receiptInput=document.getElementById('tx-receipt-input');
  const receiptStrip=document.getElementById('tx-receipt-strip');
  receiptAddBtn?.addEventListener('click',()=>receiptInput?.click());
  receiptInput?.addEventListener('change',async()=>{
    const file=receiptInput.files[0];
    if(!file) return;
    receiptUrl=await fileToStoredImage(file);
    let img=document.getElementById('tx-receipt-preview');
    if(!img){
      img=document.createElement('img');
      img.id='tx-receipt-preview';
      receiptStrip.insertBefore(img, receiptAddBtn);
    }
    img.src=resolvePhotoRef(receiptUrl);
    receiptAddBtn.style.display='none';
  });
  const photoAddBtn=document.getElementById('tx-photo-add-btn');
  const photoInput=document.getElementById('tx-photo-input');
  const photoStrip=document.getElementById('tx-photo-strip');
  let expensePhotos=prefill?.photos ? [...prefill.photos] : (prefill?.photo?[prefill.photo]:[]);
  function renderTxPhotoStrip(){
    if(!photoStrip||!photoAddBtn) return;
    [...photoStrip.querySelectorAll('.psf-thumb')].forEach(el=>el.remove());
    expensePhotos.forEach((p,i)=>{
      const wrap=document.createElement('div');
      wrap.className='psf-thumb';
      wrap.innerHTML=`<img src="${resolvePhotoRef(p.url)}" alt=""><button type="button" class="psf-remove" data-remove-index="${i}" aria-label="Odebrat fotku">×</button>`;
      photoStrip.insertBefore(wrap, photoAddBtn);
    });
    photoStrip.querySelectorAll('.psf-remove').forEach(btn=>{
      btn.addEventListener('click',()=>{
        expensePhotos.splice(Number(btn.dataset.removeIndex),1);
        renderTxPhotoStrip();
      });
    });
  }
  renderTxPhotoStrip();
  photoAddBtn?.addEventListener('click',()=>photoInput?.click());
  photoInput?.addEventListener('change',async()=>{
    const files=[...photoInput.files];
    photoInput.value='';
    for(const file of files){
      const url=await fileToStoredImage(file);
      expensePhotos.push({url, name:file.name});
    }
    renderTxPhotoStrip();
  });
  function syncTypeUI(){
    const stageField=document.getElementById('tx-stage-field');
    const companyField=document.getElementById('tx-company-field');
    const receiptField=document.getElementById('tx-receipt-field');
    const nameInput=document.getElementById('tx-form-name');
    const noteInput=document.getElementById('tx-form-note');
    if(stageField) stageField.style.display = currentType==='income' ? 'none' : '';
    if(companyField) companyField.style.display = currentType==='income' ? 'none' : '';
    if(receiptField) receiptField.style.display = currentType==='income' ? 'none' : '';
    const photoField=document.getElementById('tx-photo-field');
    if(photoField) photoField.style.display = currentType==='income' ? 'none' : '';
    if(nameInput) nameInput.placeholder = currentType==='income' ? 'např. Vklad na stavbu' : 'např. Materiál';
    if(noteInput) noteInput.placeholder = currentType==='income' ? 'Poznámka ke vkladu...' : 'Poznámka k výdaji...';
  }
  document.querySelectorAll('#tx-type-toggle [data-tx-type]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      currentType=btn.dataset.txType;
      document.querySelectorAll('#tx-type-toggle [data-tx-type]').forEach(b=>b.classList.toggle('is-active',b===btn));
      syncTypeUI();
    });
  });
  document.getElementById('tx-form-save')?.addEventListener('click',()=>{
    const amount=Math.round(Number(String(document.getElementById('tx-form-amount').value).replace(/[^0-9]/g,'')));
    const name=document.getElementById('tx-form-name').value.trim();
    if(!amount || amount<=0 || !name){ showToast('Chybí údaje','Vyplň prosím částku a název.'); return; }
    const dateISO=document.getElementById('tx-form-date').value || ProjectStore.todayISO();
    const record={
      type:currentType, amount, name,
      stage:currentType==='income' ? '' : document.getElementById('tx-form-stage').value,
      company:currentType==='income' ? '' : document.getElementById('tx-form-company').value.trim(),
      note:document.getElementById('tx-form-note').value.trim(),
      receipt:currentType==='income' ? null : receiptUrl,
      photos:currentType==='income' ? [] : expensePhotos,
      dateISO, dateLabel:formatDateCZ(dateISO),
    };
    const hadMedia = !!(record.receipt || (record.photos && record.photos.length));
    function saveWithFallback(saveFn, recordToSave){
      let saved=saveFn(recordToSave);
      if(!saved && hadMedia){
        // Nepovedlo se s fotkou/účtenkou (typicky málo místa v úložišti
        // appky) — zkusíme to uložit aspoň bez nich, ať výdaj nezmizí.
        saved=saveFn({...recordToSave, receipt:null, photos:[]});
        if(saved) return {saved, mediaDropped:true};
      }
      return {saved, mediaDropped:false};
    }
    let result;
    if(isEdit){
      result=saveWithFallback(patch=>updateTransactionRecord(prefill.id, patch), record);
      if(!result.saved){ showToast('Nepodařilo se uložit','Úložiště appky je zaplněné — zkus to prosím znovu, případně appku restartuj. Fotky teď appka ukládá do prostornějšího úložiště, tohle by se mělo dít jen výjimečně.'); return; }
      showToast(result.mediaDropped?'Transakce upravena bez fotky':'Transakce upravena', result.mediaDropped?'Na fotku/účtenku už nezbylo místo v úložišti appky, zbytek změn se uložil.':'Změny se uložily.');
    } else {
      result=saveWithFallback(saveTx=>addTransactionRecord(saveTx), record);
      if(!result.saved){ showToast('Nepodařilo se uložit','Úložiště appky je zaplněné — zkus to prosím znovu, případně appku restartuj. Fotky teď appka ukládá do prostornějšího úložiště, tohle by se mělo dít jen výjimečně.'); return; }
      showToast(result.mediaDropped?'Výdaj uložen bez fotky':'Transakce uložena', result.mediaDropped?'Na fotku/účtenku už nezbylo místo v úložišti appky, výdaj samotný se ale uložil.':'Najdeš ji v seznamu transakcí.');
    }
    // Fotky u výdaje se navíc uloží jako lehký (skrytý) zápis do
    // deníku, stejně jako fotky přidané přes rychlé plus — díky
    // tomu se objeví i v galerii u té samé etapy, ale ne v Deníku.
    const newPhotos=expensePhotos.filter(p=>!(prefill?.photos||[]).some(op=>op.url===p.url));
    if(currentType==='expense' && newPhotos.length && !result.mediaDropped){
      addEntryRecord({
        dateISO, dateLabel:formatDateCZ(dateISO),
        day:new Date(dateISO+'T00:00:00').getDate(),
        month:CZ_MONTHS_SHORT[new Date(dateISO+'T00:00:00').getMonth()],
        year:new Date(dateISO+'T00:00:00').getFullYear(),
        time:new Date().toTimeString().slice(0,5),
        stage:record.stage||'Bez etapy', weather:'',
        text:`Foto k výdaji — ${name}`,
        workType:'', workers:'', materials:'',
        photos:newPhotos.map(p=>({url:p.url, name:p.name||''})),
        attachment:null,
        hiddenFromDiary:true,
      });
      if(typeof renderDiaryTimeline==='function') renderDiaryTimeline();
      if(typeof renderDashboardPhotoPreview==='function') renderDashboardPhotoPreview();
      if(typeof renderStagePhotoStrip==='function') renderStagePhotoStrip();
    }
    renderTransactionList();
    renderDashboardMoneyCards();
    closeQuickForm();
    if(!isEdit) go('transactions');
  });
}

function applyCurrentProjectToUI(){
  const project=ProjectStore.current();
  if(!project) return;
  document.querySelectorAll('[data-bind-name]').forEach(el=>el.textContent=project.name);
  document.querySelectorAll('[data-bind-location]').forEach(el=>el.textContent=project.location||'—');
  renderDayCounter(project);
  restoreStagesSnapshot(project.stagesSnapshot);
  if(typeof updateHeroImage==='function') updateHeroImage();
  if(typeof renderTransactionList==='function') renderTransactionList();
  if(typeof renderDashboardMoneyCards==='function') renderDashboardMoneyCards();
  if(typeof renderNextEventCard==='function') renderNextEventCard();
  if(typeof renderMonthGrid==='function' && app.dataset.screen==='calendar'){ renderMonthGrid(); renderDaySummary(calSelectedDate); }
  if(typeof renderDiaryTimeline==='function') renderDiaryTimeline();
  if(typeof renderDashboardPhotoPreview==='function') renderDashboardPhotoPreview();
  if(typeof recalcStageMoney==='function') recalcStageMoney();
  const currentRow=stagesList.querySelector('.stage-row.stage-current');
  const stageBoxTitle=document.querySelector('.stage-box h1');
  if(stageBoxTitle) stageBoxTitle.textContent = currentRow ? (currentRow.querySelector('h2')?.textContent||'—') : '—';
  const settingsSummary=document.querySelector('[data-settings-summary]');
  if(settingsSummary){
    const stageCount=visibleStageRows().length;
    const stageLabel=`${stageCount} ${stageCount===1?'etapa':'etap'}`;
    if(project.completedDate){
      const n=ProjectStore.dayNumber(project.startDate, project.completedDate);
      settingsSummary.textContent=`Zkolaudováno po ${(n&&n>0)?n:'—'} dnech · ${stageLabel}`;
    } else if(!project.startDate){
      settingsSummary.textContent=`Stavba zatím nezahájena · ${stageLabel}`;
    } else {
      const n=ProjectStore.dayNumber(project.startDate);
      settingsSummary.textContent=`Den stavby ${(n&&n>0)?n:'—'} · ${stageLabel}`;
    }
  }
  if(typeof renderProjectMenu==='function') renderProjectMenu();
}


// =========================================================
// v0.58 — Skutečné události a kalendář
// Události patří k aktuálnímu projektu (jako transakce), kalendář
// je teď datumově přesný měsíční pohled s reálnou navigací a
// přidáváním událostí kliknutím na den. Připomínky fungují přes
// systémová oznámení, dokud je appka otevřená v telefonu/prohlížeči.
// =========================================================
const CZ_MONTHS=['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const CZ_MONTHS_GEN=['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'];

function getCurrentProjectEvents(){
  return ProjectStore.current()?.events || [];
}
function saveProjectEvents(list){
  const id=ProjectStore.getCurrentId();
  if(!id) return;
  ProjectStore.update(id, {events:list});
}
function addEventRecord(ev){
  const list=getCurrentProjectEvents();
  ev.id='e'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  list.push(ev);
  saveProjectEvents(list);
  return ev;
}
function updateEventRecord(id,patch){
  const list=getCurrentProjectEvents();
  const ev=list.find(e=>e.id===id);
  if(!ev) return null;
  Object.assign(ev,patch);
  saveProjectEvents(list);
  return ev;
}
function deleteEventRecord(id){
  saveProjectEvents(getCurrentProjectEvents().filter(e=>e.id!==id));
}
// Smaže systémové milníky (zahájení/kolaudace) daného titulku — použito
// při zrušení zahájení/kolaudace, ať tam nezůstane osiřelá událost.
function deleteSystemEvent(title){
  saveProjectEvents(getCurrentProjectEvents().filter(e=>!(e.type==='system' && e.title===title)));
}

const REMINDER_LABELS={none:'Bez připomenutí', day_before:'Den předem', morning_of:'Ten den ráno', week_before:'Týden předem'};
function reminderTriggerDate(ev){
  if(!ev.reminder || ev.reminder==='none' || !ev.dateISO) return null;
  const d=new Date(ev.dateISO+'T'+(ev.time||'08:00')+':00');
  if(ev.reminder==='day_before') d.setDate(d.getDate()-1);
  if(ev.reminder==='week_before') d.setDate(d.getDate()-7);
  if(ev.reminder==='morning_of') d.setHours(8,0,0,0);
  return d;
}
// Zkontroluje připomínky napříč všemi projekty (appka může mít otevřený
// jen jeden, ale takhle to funguje spolehlivě i po přepnutí). Funguje
// jen dokud je appka otevřená — bez serverové části nejde spolehlivě
// posílat oznámení se zavřenou appkou.
function checkReminders(){
  if(!('Notification' in window) || Notification.permission!=='granted') return;
  let prefs; try{ prefs=JSON.parse(localStorage.getItem('ms_notif_prefs')); }catch(e){}
  if(!prefs || !prefs.enabled) return;
  const now=new Date();
  ProjectStore.all().forEach(project=>{
    (project.events||[]).forEach(ev=>{
      if(ev.remindedAt || !ev.reminder || ev.reminder==='none') return;
      const trigger=reminderTriggerDate(ev);
      if(!trigger || trigger>now) return;
      if(now-trigger>1000*60*60*6) { ev.remindedAt='skipped'; return; } // moc stará, už nedávat
      new Notification('Moje Stavba — připomínka',{body:`${ev.title} · ${ev.dateLabel||ev.dateISO}`});
      ev.remindedAt=new Date().toISOString();
      saveProjectEvents(project.events);
    });
  });
}
setInterval(checkReminders,60000);
checkReminders();

// --- Formulář nové/upravené události ---
function eventFormHTML(prefill){
  const isEdit=!!(prefill && prefill.id);
  const stageNames=['Bez etapy', ...visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean)];
  const stagePicker=stagePillsHTML('ev-form-stage', stageNames, prefill?.stage||currentStageDisplayName());
  const reminderSelected=prefill?.reminder||'none';
  const reminderPicker=`<input type="hidden" id="ev-form-reminder" value="${reminderSelected}">
  <div class="type-pill-row" id="ev-form-reminder-pills">
    ${Object.entries(REMINDER_LABELS).map(([val,label])=>`<button type="button" class="type-pill${val===reminderSelected?' is-active':''}" data-reminder-value="${val}">${label}</button>`).join('')}
  </div>`;
  return `<div class="quick-form-top"><h2>${isEdit?'Upravit událost':'Nová událost'}</h2><p>Událost se zobrazí v kalendáři a na dashboardu jako nejbližší událost.</p></div>
<label class="form-field"><span>Název *</span><input id="ev-form-title" value="${prefill?.title||''}" maxlength="40" placeholder="např. Betonáž věnce"></label>
<label class="form-field"><span>Datum *</span><input id="ev-form-date" type="date" value="${prefill?.dateISO||eventFormPresetDate||ProjectStore.todayISO()}"></label>
<label class="form-field"><span>Čas volitelně</span><input id="ev-form-time" type="time" value="${prefill?.time||''}"></label>
<label class="form-field"><span>Etapa volitelně</span>${stagePicker}</label>
<label class="form-field"><span>Připomenutí</span>${reminderPicker}</label>
<button class="primary-wide" id="ev-form-save">${isEdit?'Uložit změny':'Uložit událost'}</button>
${isEdit?'<button class="ghost-wide" id="ev-form-delete" type="button">Smazat událost</button>':''}`;
}
let eventFormPresetDate=null;
function openEventForm(prefill=null, presetDate=null){
  const isEdit=!!(prefill && prefill.id);
  eventFormPresetDate=presetDate;
  openSheet(eventFormHTML(prefill));
  wireStagePills('ev-form-stage');
  document.querySelectorAll('#ev-form-reminder-pills [data-reminder-value]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#ev-form-reminder-pills [data-reminder-value]').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.getElementById('ev-form-reminder').value=btn.dataset.reminderValue;
    });
  });
  document.getElementById('ev-form-save')?.addEventListener('click',()=>{
    const title=document.getElementById('ev-form-title').value.trim();
    const dateISO=document.getElementById('ev-form-date').value;
    if(!title || !dateISO){ showToast('Chybí údaje','Vyplň prosím název a datum.'); return; }
    const record={
      title, dateISO,
      time:document.getElementById('ev-form-time').value||'',
      stage:document.getElementById('ev-form-stage').value,
      reminder:document.getElementById('ev-form-reminder').value,
      dateLabel:formatDateCZ(dateISO),
      type:'user',
    };
    if(isEdit){
      updateEventRecord(prefill.id, record);
      showToast('Událost upravena','Změny se uložily.');
    } else {
      addEventRecord(record);
      showToast('Událost uložena','Najdeš ji v kalendáři.');
    }
    closeQuickForm();
    renderNextEventCard();
    if(typeof renderMonthGrid==='function'){ calSelectedDate=dateISO; renderMonthGrid(); }
    if(app.dataset.screen!=='calendar') go('calendar');
  });
  document.getElementById('ev-form-delete')?.addEventListener('click',()=>{
    openSheet(`<div class="quick-form-top"><h2>Smazat událost?</h2><p>${prefill.title} · ${prefill.dateLabel||prefill.dateISO}</p></div><button class="ghost-wide" id="ev-delete-confirm">Smazat</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
    document.getElementById('ev-delete-confirm')?.addEventListener('click',()=>{
      deleteEventRecord(prefill.id);
      closeQuickForm();
      renderNextEventCard();
      if(typeof renderMonthGrid==='function') renderMonthGrid();
      showToast('Událost smazána',`„${prefill.title}" byla odstraněna.`);
    });
  });
}
function openEventDetail(ev){
  openSheet(`<div class="quick-form-top"><h2>${ev.title}</h2><p>${ev.type==='system'?'Milník stavby':'Událost'}</p></div>
<div class="mini-detail"><span>Datum</span><b>${ev.dateLabel||ev.dateISO}${ev.time?' · '+ev.time:''}</b></div>
${ev.stage&&ev.stage!=='Bez etapy'?`<div class="mini-detail"><span>Etapa</span><b>${ev.stage}</b></div>`:''}
<div class="mini-detail"><span>Připomenutí</span><b>${REMINDER_LABELS[ev.reminder||'none']}</b></div>
${ev.type!=='system'?`<button class="primary-wide" id="ev-detail-edit">Upravit událost</button><button class="ghost-wide" id="ev-detail-delete">Smazat událost</button>`:''}
<button class="ghost-wide" data-close-detail>Zavřít</button>`);
  document.getElementById('ev-detail-edit')?.addEventListener('click',()=>openEventForm(ev));
  document.getElementById('ev-detail-delete')?.addEventListener('click',()=>{
    openSheet(`<div class="quick-form-top"><h2>Smazat událost?</h2><p>${ev.title} · ${ev.dateLabel||ev.dateISO}</p></div><button class="ghost-wide" id="ev-delete-confirm2">Smazat</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
    document.getElementById('ev-delete-confirm2')?.addEventListener('click',()=>{
      deleteEventRecord(ev.id);
      closeQuickForm();
      renderNextEventCard();
      if(typeof renderMonthGrid==='function') renderMonthGrid();
      showToast('Událost smazána',`„${ev.title}" byla odstraněna.`);
    });
  });
}

// --- Dashboard: karta Nejbližší událost ---
function renderNextEventCard(){
  const card=document.querySelector('[data-nav-card="calendar"]');
  if(!card) return;
  const todayISO=ProjectStore.todayISO();
  const upcoming=getCurrentProjectEvents().filter(e=>e.dateISO>=todayISO).sort((a,b)=>a.dateISO.localeCompare(b.dateISO))[0];
  const h2=card.querySelector('h2');
  const sub=card.querySelector('p.muted');
  const dayNum=card.querySelector('.calendar-icon strong');
  const monthLbl=card.querySelector('.calendar-icon span');
  if(!upcoming){
    if(h2) h2.textContent='Žádná událost';
    if(sub) sub.textContent='Zatím není nic v kalendáři';
    if(dayNum) dayNum.textContent='—';
    if(monthLbl) monthLbl.textContent='—';
    return;
  }
  const d=new Date(upcoming.dateISO+'T00:00:00');
  if(h2) h2.textContent=upcoming.title;
  if(sub) sub.textContent=upcoming.dateLabel+(upcoming.time?' · '+upcoming.time:'');
  if(dayNum) dayNum.textContent=d.getDate();
  if(monthLbl) monthLbl.textContent=CZ_MONTHS[d.getMonth()].slice(0,3);
}

// --- Kalendář: reálný měsíční pohled ---
let calViewYear, calViewMonth, calSelectedDate;
(function(){
  const t=new Date();
  calViewYear=t.getFullYear(); calViewMonth=t.getMonth(); calSelectedDate=ProjectStore.todayISO();
})();
function isoDate(y,m,d){
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function renderMonthGrid(){
  const grid=document.getElementById('month-grid');
  const headStrong=document.querySelector('.month-head strong');
  if(!grid) return;
  if(headStrong) headStrong.textContent=`${CZ_MONTHS[calViewMonth][0].toUpperCase()+CZ_MONTHS[calViewMonth].slice(1)} ${calViewYear}`;
  [...grid.querySelectorAll('button')].forEach(b=>b.remove());

  const events=getCurrentProjectEvents();
  const eventsByDate={};
  events.forEach(e=>{ (eventsByDate[e.dateISO]=eventsByDate[e.dateISO]||[]).push(e); });
  const todayISO=ProjectStore.todayISO();

  const firstOfMonth=new Date(calViewYear,calViewMonth,1);
  const startOffset=(firstOfMonth.getDay()+6)%7; // pondělí = 0
  const daysInMonth=new Date(calViewYear,calViewMonth+1,0).getDate();
  const daysInPrevMonth=new Date(calViewYear,calViewMonth,0).getDate();

  const frag=document.createDocumentFragment();
  for(let i=startOffset-1;i>=0;i--){
    const btn=document.createElement('button');
    btn.className='muted-day'; btn.textContent=daysInPrevMonth-i; btn.disabled=true;
    frag.appendChild(btn);
  }
  for(let d=1; d<=daysInMonth; d++){
    const dateISO=isoDate(calViewYear,calViewMonth,d);
    const btn=document.createElement('button');
    btn.dataset.date=dateISO;
    btn.textContent=d;
    if(dateISO===todayISO) btn.classList.add('today');
    if(dateISO===calSelectedDate) btn.classList.add('selected');
    const dayEvents=eventsByDate[dateISO];
    if(dayEvents && dayEvents.length){
      dayEvents.slice(0,3).forEach(e=>{
        const dot=document.createElement('i');
        dot.className='dot '+(e.type==='system'?'orange':'purple');
        btn.appendChild(dot);
      });
    }
    const markers=calendarMarkers[dateISO];
    if(markers && markers.length){
      markers.slice(0,2).forEach(mk=>{
        const dot=document.createElement('i');
        dot.className='dot '+mk.dotClass;
        btn.appendChild(dot);
      });
    }
    btn.addEventListener('click',()=>{ calSelectedDate=dateISO; renderMonthGrid(); renderDaySummary(dateISO); });
    frag.appendChild(btn);
  }
  const totalCells=startOffset+daysInMonth;
  const trailing=(7-(totalCells%7))%7;
  for(let d=1; d<=trailing; d++){
    const btn=document.createElement('button');
    btn.className='muted-day'; btn.textContent=d; btn.disabled=true;
    frag.appendChild(btn);
  }
  grid.appendChild(frag);
}
function renderDaySummary(dateISO){
  const title=document.querySelector('[data-cal-day-title]');
  const itemsWrap=document.getElementById('cal-day-items');
  if(!itemsWrap) return;
  const d=new Date(dateISO+'T00:00:00');
  const todayISO=ProjectStore.todayISO();
  if(title) title.textContent = dateISO===todayISO ? 'Dnes' : `${d.getDate()}. ${CZ_MONTHS_GEN[d.getMonth()]}`;
  const events=getCurrentProjectEvents().filter(e=>e.dateISO===dateISO);
  const markers=calendarMarkers[dateISO]||[];
  if(!events.length && !markers.length){
    itemsWrap.innerHTML='<article class="calendar-item empty-item"><span>▣</span><div><b>Žádné záznamy</b><small>Vybraný den je zatím prázdný</small></div></article>';
    return;
  }
  const eventItems=events.map(e=>`<article class="calendar-item" data-event-id="${e.id}"><span>${e.type==='system'?'🏗':'▣'}</span><div><b>${e.title}</b><small>${e.time||''}${e.stage&&e.stage!=='Bez etapy'?' · '+e.stage:''}</small></div><em>›</em></article>`).join('');
  const markerItems=markers.map(mk=>`<article class="calendar-item marker-item marker-${mk.dotClass}"><span>${mk.icon}</span><div><b>${mk.label}</b><small>${mk.dotClass==='pink'?'Platnost nabídky':'Termín úkolu'}</small></div><em>›</em></article>`).join('');
  itemsWrap.innerHTML=eventItems+markerItems;
  itemsWrap.querySelectorAll('[data-event-id]').forEach(el=>{
    el.addEventListener('click',()=>{
      const ev=events.find(e=>e.id===el.dataset.eventId);
      if(ev) openEventDetail(ev);
    });
  });
}
document.querySelectorAll('.month-head button').forEach((btn,i)=>btn.addEventListener('click',()=>{
  calViewMonth += (i===0?-1:1);
  if(calViewMonth<0){calViewMonth=11;calViewYear--;}
  if(calViewMonth>11){calViewMonth=0;calViewYear++;}
  renderMonthGrid();
}));
document.getElementById('cal-add-event-btn')?.addEventListener('click',()=>openEventForm(null, calSelectedDate));
document.querySelector('[data-calendar-open-gallery]')?.addEventListener('click',()=>openGallery('dashboard','Základová deska'));

// Ponecháváme jednoduché barevné značky pro termíny nabídek a úkolů —
// nejsou to skutečné "Události", jen vizuální upozornění v mřížce.
const calendarMarkers={};
function addCalendarMarker(validity,label,dotClass,icon){
  if(!validity) return false;
  const m=validity.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if(!m) return false;
  const dateISO=`${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  (calendarMarkers[dateISO]=calendarMarkers[dateISO]||[]).push({label,dotClass,icon});
  return true;
}
function addOfferToCalendar(validity,label){ return addCalendarMarker(validity,label,'pink','◈'); }

// =========================================================
// v0.59 — Skutečné zápisy do stavebního deníku
// Zápisy patří k aktuálnímu projektu (jako transakce/události) a
// obsahují i použité materiály, fotky a jednu přílohu (certifikát,
// záruční list...). Fotky/přílohy se drží jako blob adresy v paměti
// telefonu — vydrží, dokud appku nezavřeš úplně (stejné omezení jako
// mají už dřív nahrané Dokumenty v Projektu).
// =========================================================
function getCurrentProjectEntries(){
  return ProjectStore.current()?.entries || [];
}
function saveProjectEntries(list){
  const id=ProjectStore.getCurrentId();
  if(!id) return;
  ProjectStore.update(id, {entries:list});
}
// Nativní <select> na iOS umí v tmavém režimu systému vykreslit
// úplně černé, nečitelné kolečko volby bez ohledu na CSS appky —
// color-scheme na tohle spolehlivě nestačí (to je jen "zavřená"
// krabice selectu, ne ta rozjížděcí nabídka). Proto etapy volíme
// vlastními dlaždicemi, stejně jako appka dělá jinde.
// Starý seznam stageData má u některých etap jiné názvy, než appka
// teď doopravdy používá (např. "Elektroinstalace" vs. "Elektro") —
// pro předvyplnění etapy v rychlých formulářích proto vždycky
// čteme skutečný název přímo z řádku etapy v DOM, ne ze stageData.
function currentStageDisplayName(){
  const onStageDetail = app.dataset.screen==='stageDetail';
  const row = (onStageDetail && currentStageId) ? stagesList.querySelector(`[data-stage-id="${currentStageId}"]`) : null;
  return row?.querySelector('h2')?.textContent
    || document.querySelector('.stage-row.stage-current h2')?.textContent
    || 'Bez etapy';
}
function stagePillsHTML(id, options, selected){
  const sel = (selected && options.includes(selected)) ? selected : (options[0] || '');
  return `<input type="hidden" id="${id}" value="${sel}">
  <div class="type-pill-row" id="${id}-pills">
    ${options.map(o=>`<button type="button" class="type-pill${o===sel?' is-active':''}" data-pill-value="${o}">${o}</button>`).join('')}
  </div>`;
}
function wireStagePills(id){
  const wrap=document.getElementById(id+'-pills');
  const hidden=document.getElementById(id);
  wrap?.querySelectorAll('[data-pill-value]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      wrap.querySelectorAll('[data-pill-value]').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if(hidden) hidden.value=btn.dataset.pillValue;
    });
  });
}
function addEntryRecord(entry){
  const list=getCurrentProjectEntries();
  entry.id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  entry.createdAt=Date.now();
  list.push(entry);
  saveProjectEntries(list);
  return entry;
}
function updateEntryRecord(id,patch){
  const list=getCurrentProjectEntries();
  const e=list.find(x=>x.id===id);
  if(!e) return null;
  Object.assign(e,patch);
  saveProjectEntries(list);
  return e;
}
function deleteEntryRecord(id){
  saveProjectEntries(getCurrentProjectEntries().filter(e=>e.id!==id));
}

const CZ_MONTHS_SHORT=['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];
let currentOpenEntryId=null;

// --- Formulář nový/upravovaný zápis ---
let entryFormPhotos=[];
let entryFormAttachment=null;
function entryFormHTML(prefill){
  const isEdit=!!(prefill && prefill.id);
  const stageNames=['Bez etapy', ...visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean)];
  const currentStageName=currentStageDisplayName();
  const stagePicker=stagePillsHTML('entry-form-stage', stageNames, prefill?.stage||currentStageName);
  entryFormPhotos=prefill?.photos ? [...prefill.photos] : [];
  entryFormAttachment=prefill?.attachment || null;
  return `<div class="quick-form-top"><h2>${isEdit?'Upravit zápis':'Nový zápis'}</h2><p>Zápis se uloží do deníku a zobrazí se v etapě i v kompletní kronice.</p></div>
<label class="form-field"><span>Datum</span><input id="entry-form-date" type="date" value="${prefill?.dateISO||ProjectStore.todayISO()}"></label>
<label class="form-field"><span>Etapa</span>${stagePicker}</label>
<label class="form-field"><span>Počasí volitelně</span><input id="entry-form-weather" value="${prefill?.weather||''}" placeholder="např. 18 °C, polojasno"></label>
<label class="form-field"><span>Popis</span><textarea id="entry-form-text" placeholder="Napište, co se dnes na stavbě dělo...">${prefill?.text||''}</textarea></label>
<div class="photo-strip-form" id="entry-form-photos-strip"><button type="button" id="entry-form-photo-add"><span class="psf-icon">📷</span><small>Přidat foto</small></button></div>
<input type="file" accept="image/*" multiple id="entry-form-photo-input" hidden>
<details class="form-more" ${isEdit?'open':''}>
<summary>Další možnosti</summary>
<label>Typ práce<input id="entry-form-worktype" value="${prefill?.workType||''}" placeholder="např. Betonáž"></label>
<label>Kdo pracoval<input id="entry-form-workers" value="${prefill?.workers||''}" placeholder="např. Já + pomocník"></label>
<label>Použité materiály<textarea id="entry-form-materials" placeholder="např. Beton C25/30, 4 m³; výztuž KARI">${prefill?.materials||''}</textarea></label>
<label>Příloha (certifikát, záruční list...)<button type="button" class="ghost-wide" id="entry-form-file-btn">${entryFormAttachment?entryFormAttachment.name:'Vybrat soubor'}</button><input type="file" id="entry-form-file-input" hidden></label>
</details>
<button class="primary-wide" id="entry-form-save">${isEdit?'Uložit změny':'Uložit zápis'}</button>
${isEdit?'<button class="ghost-wide" id="entry-form-delete" type="button">Smazat zápis</button>':''}`;
}
function renderEntryFormPhotoStrip(){
  const strip=document.getElementById('entry-form-photos-strip');
  const addBtn=document.getElementById('entry-form-photo-add');
  if(!strip||!addBtn) return;
  [...strip.querySelectorAll('.psf-thumb')].forEach(el=>el.remove());
  entryFormPhotos.forEach((p,i)=>{
    const wrap=document.createElement('div');
    wrap.className='psf-thumb';
    wrap.innerHTML=`<img src="${resolvePhotoRef(p.url)}" alt=""><button type="button" class="psf-remove" data-remove-index="${i}" aria-label="Odebrat fotku">×</button>`;
    strip.insertBefore(wrap, addBtn);
  });
  strip.querySelectorAll('.psf-remove').forEach(btn=>{
    btn.addEventListener('click',()=>{
      entryFormPhotos.splice(Number(btn.dataset.removeIndex),1);
      renderEntryFormPhotoStrip();
    });
  });
}
function openEntryForm(prefill=null){
  const isEdit=!!(prefill && prefill.id);
  openSheet(entryFormHTML(prefill));
  wireStagePills('entry-form-stage');
  renderEntryFormPhotoStrip();
  const photoAddBtn=document.getElementById('entry-form-photo-add');
  const photoInput=document.getElementById('entry-form-photo-input');
  photoAddBtn?.addEventListener('click',()=>photoInput?.click());
  photoInput?.addEventListener('change',async()=>{
    const files=[...photoInput.files];
    photoInput.value='';
    for(const file of files){
      const url=await fileToStoredImage(file);
      entryFormPhotos.push({url, name:file.name});
      renderEntryFormPhotoStrip();
    }
  });
  const fileBtn=document.getElementById('entry-form-file-btn');
  const fileInput=document.getElementById('entry-form-file-input');
  fileBtn?.addEventListener('click',()=>fileInput?.click());
  fileInput?.addEventListener('change',async()=>{
    const file=fileInput.files[0];
    if(!file) return;
    if(file.size>4*1024*1024){ showToast('Soubor je moc velký','Zkus prosím soubor menší než 4 MB.'); fileInput.value=''; return; }
    const url=await fileToStoredImage(file);
    entryFormAttachment={name:file.name, url, sizeLabel:fmtSize(file.size)};
    fileBtn.textContent=file.name;
  });
  document.getElementById('entry-form-save')?.addEventListener('click',()=>{
    const text=document.getElementById('entry-form-text').value.trim();
    const dateISO=document.getElementById('entry-form-date').value || ProjectStore.todayISO();
    if(!text){ showToast('Chybí popis','Napiš prosím, co se na stavbě dělo.'); return; }
    const d=new Date(dateISO+'T00:00:00');
    const record={
      dateISO, dateLabel:formatDateCZ(dateISO),
      day:d.getDate(), month:CZ_MONTHS_SHORT[d.getMonth()], year:d.getFullYear(),
      time:new Date().toTimeString().slice(0,5),
      stage:document.getElementById('entry-form-stage').value,
      weather:document.getElementById('entry-form-weather').value.trim(),
      text,
      workType:document.getElementById('entry-form-worktype').value.trim(),
      workers:document.getElementById('entry-form-workers').value.trim(),
      materials:document.getElementById('entry-form-materials').value.trim(),
      photos:entryFormPhotos,
      attachment:entryFormAttachment,
    };
    let saved;
    if(isEdit){
      saved=updateEntryRecord(prefill.id, record);
      showToast('Zápis upraven','Změny se uložily.');
    } else {
      saved=addEntryRecord(record);
      showToast('Zápis uložen','Najdeš ho v deníku.');
    }
    closeQuickForm();
    renderDiaryTimeline();
    if(typeof renderStageDetailTransactions==='function') renderStageDetailTransactions();
    if(typeof renderStageDetailDiary==='function') renderStageDetailDiary();
    if(typeof renderDashboardPhotoPreview==='function') renderDashboardPhotoPreview();
    if(typeof renderStagePhotoStrip==='function') renderStagePhotoStrip();
    openEntry(saved.id, app.dataset.screen==='stageDetail'?'stageDetail':'diary');
  });
  document.getElementById('entry-form-delete')?.addEventListener('click',()=>{
    openSheet(`<div class="quick-form-top"><h2>Smazat zápis?</h2><p>${prefill.dateLabel} — ${prefill.text.slice(0,60)}</p></div><button class="ghost-wide" id="entry-delete-confirm">Smazat</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
    document.getElementById('entry-delete-confirm')?.addEventListener('click',()=>{
      deleteEntryRecord(prefill.id);
      closeQuickForm();
      renderDiaryTimeline();
      go('diary');
      showToast('Zápis smazán','Zápis byl odstraněn z deníku.');
    });
  });
}

// --- Diář: vykreslení seznamu (jako .diary-entry, kompatibilní se
// stávajícím PDF exportem, který tuhle strukturu čte přímo z DOM) ---
function renderDiaryTimeline(){
  const wrap=document.getElementById('diary-timeline');
  if(!wrap) return;
  const entries=[...getCurrentProjectEntries()].filter(e=>!e.hiddenFromDiary).sort((a,b)=>a.dateISO.localeCompare(b.dateISO));
  if(!entries.length){
    wrap.innerHTML='<p class="empty-hint">Zatím žádné zápisy ve stavebním deníku.</p>';
    return;
  }
  wrap.innerHTML=entries.map(e=>`<article class="diary-entry glass-card" data-entry-id="${e.id}" data-date-iso="${e.dateISO}" data-stage="${e.stage||'Bez etapy'}">
    <time>${e.dateLabel}</time>
    <h2>${e.text.length>70?e.text.slice(0,70)+'…':e.text}</h2>
    <div class="entry-meta"><span>${e.stage||'Bez etapy'}</span>${e.weather?`<span>${e.weather}</span>`:''}${e.photos&&e.photos.length?`<span>${e.photos.length} 📷</span>`:''}</div>
    ${e.photos&&e.photos.length?`<div class="entry-photos">${e.photos.slice(0,3).map(p=>`<img src="${resolvePhotoRef(p.url)}" alt="">`).join('')}</div>`:''}
  </article>`).join('');
  wrap.querySelectorAll('.diary-entry').forEach(el=>el.addEventListener('click',()=>openEntry(el.dataset.entryId,'diary')));
  if(typeof renumberDiaryEntries==='function') renumberDiaryEntries();
}
document.getElementById('diary-add-entry-btn')?.addEventListener('click',()=>openEntryForm(null));

// --- Detail zápisu: reálná data ---
function openEntry(id,back='diary'){
  const d=getCurrentProjectEntries().find(e=>e.id===id);
  if(!d){ showToast('Zápis nenalezen','Zápis už tu není — možná byl smazán.'); go(back||'diary'); return; }
  entryBackTarget=back;
  currentOpenEntryId=id;
  document.querySelector('[data-entry-stage]').textContent=d.stage||'Bez etapy';
  document.querySelector('[data-entry-day]').textContent=d.day;
  document.querySelector('[data-entry-month]').textContent=d.month;
  document.querySelector('[data-entry-year]').textContent=d.year;
  document.querySelector('[data-entry-time]').textContent=d.time||'—';
  document.querySelector('[data-entry-weather]').textContent=d.weather||'—';
  document.querySelector('[data-entry-status]').textContent=d.workType||'Zápis';
  document.querySelector('[data-entry-title]').textContent=d.text.length>60?d.text.slice(0,60)+'…':d.text;
  document.querySelector('[data-entry-text]').textContent=d.text;

  const workWrap=document.getElementById('entry-detail-work');
  if(workWrap){
    workWrap.style.display=(d.workType||d.workers)?'block':'none';
    const line=workWrap.querySelector('.entry-work-line');
    if(line) line.innerHTML=[d.workType?`<b>${d.workType}</b>`:'',d.workers?`<span>${d.workers}</span>`:''].filter(Boolean).join(' · ');
  }
  const materialsWrap=document.getElementById('entry-detail-materials');
  if(materialsWrap){
    materialsWrap.style.display=d.materials?'block':'none';
    const p=materialsWrap.querySelector('[data-entry-materials]');
    if(p) p.textContent=d.materials||'';
  }
  const photosCount=document.querySelector('[data-entry-photos-count]');
  const photosWrap=document.getElementById('entry-detail-photos');
  if(photosCount) photosCount.textContent=`Fotky (${(d.photos||[]).length})`;
  if(photosWrap){
    photosWrap.innerHTML=(d.photos&&d.photos.length)
      ? d.photos.map(p=>`<img src="${resolvePhotoRef(p.url)}" alt="">`).join('')
      : '<p class="empty-hint">Zatím žádné fotografie.</p>';
  }
  const attachWrap=document.getElementById('entry-detail-attachment');
  if(attachWrap){
    attachWrap.innerHTML = d.attachment
      ? `<article class="file-row"><span class="file-doc">${docTypeLabel(d.attachment.name)}</span><div><b>${d.attachment.name}</b><small>${d.attachment.sizeLabel||''}</small></div><a href="${resolvePhotoRef(d.attachment.url)}" download="${d.attachment.name}">↓</a></article>`
      : '<p class="empty-hint">Zatím žádná příloha.</p>';
  }
  go('entryDetail');
}
document.getElementById('entry-edit-btn')?.addEventListener('click',()=>{
  const d=getCurrentProjectEntries().find(e=>e.id===currentOpenEntryId);
  if(d) openEntryForm(d);
});
document.getElementById('entry-delete-btn')?.addEventListener('click',()=>{
  const d=getCurrentProjectEntries().find(e=>e.id===currentOpenEntryId);
  if(!d) return;
  openSheet(`<div class="quick-form-top"><h2>Smazat zápis?</h2><p>${d.dateLabel} — ${d.text.slice(0,60)}</p></div><button class="ghost-wide" id="entry-delete-confirm2">Smazat</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
  document.getElementById('entry-delete-confirm2')?.addEventListener('click',()=>{
    deleteEntryRecord(d.id);
    closeQuickForm();
    renderDiaryTimeline();
    go('diary');
    showToast('Zápis smazán','Zápis byl odstraněn z deníku.');
  });
});
document.getElementById('entry-pdf-btn')?.addEventListener('click',()=>{
  const d=getCurrentProjectEntries().find(e=>e.id===currentOpenEntryId);
  if(d) buildSingleEntryPDF(d);
});

function buildSingleEntryPDF(e){
  if(!window.jspdf){showToast('PDF se nepodařilo vytvořit','Knihovna pro PDF se nenačetla — zkontroluj připojení k internetu.');return;}
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const fontOK=registerPdfFont(doc);
  const boldFont=()=>{ try{ doc.setFont(fontOK?"DejaVuSans":"helvetica","bold"); }catch(e){ doc.setFont("helvetica","bold"); } };
  const normalFont=()=>{ try{ doc.setFont(fontOK?"DejaVuSans":"helvetica","normal"); }catch(e){ doc.setFont("helvetica","normal"); } };
  const info=getProjectInfo();
  let y=22;
  doc.setFontSize(18);doc.text('Zápis do stavebního deníku',20,y);y+=9;
  doc.setFontSize(11);doc.text(info.name+(info.location?' - '+info.location:''),20,y);y+=10;
  doc.setFontSize(10);doc.setTextColor(90);
  doc.text(`${e.dateLabel}${e.time?' - '+e.time:''} - ${e.stage||'Bez etapy'}${e.weather?' - '+e.weather:''}`,20,y);
  doc.setTextColor(0);y+=10;
  doc.setFontSize(12);
  const lines=doc.splitTextToSize(e.text,170);
  doc.text(lines,20,y);y+=lines.length*6+6;
  if(e.workType||e.workers){
    doc.setFont('DejaVuSans','bold');doc.text('Práce',20,y);y+=6;
    doc.setFont('DejaVuSans','normal');doc.setFontSize(10);
    doc.text([e.workType,e.workers].filter(Boolean).join(' - '),20,y);y+=8;
  }
  if(e.materials){
    doc.setFontSize(12);doc.setFont('DejaVuSans','bold');doc.text('Použité materiály',20,y);y+=6;
    doc.setFont('DejaVuSans','normal');doc.setFontSize(10);
    const mLines=doc.splitTextToSize(e.materials,170);
    doc.text(mLines,20,y);y+=mLines.length*5+6;
  }
  if(e.photos && e.photos.length){
    const imgs=[...document.querySelectorAll('#entry-detail-photos img')];
    let px=20;
    imgs.forEach((img,i)=>{
      try{
        const canvas=document.createElement('canvas');
        canvas.width=img.naturalWidth||400; canvas.height=img.naturalHeight||300;
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        if(y>230){doc.addPage();y=20;}
        doc.addImage(canvas.toDataURL('image/jpeg',0.85),'JPEG',px,y,60,42);
        px+= (i%2===0) ? 66 : -66;
        if(i%2===1) y+=48;
      }catch(err){}
    });
  }
  doc.save(`Zapis_${e.dateISO}.pdf`);
  showToast('PDF vytvořeno','Zápis byl stažen jako PDF.');
}


// v0.11.0 - společná horní lišta: přepínač projektu, overlay vyhledávání, nastavení a sdílení
const projectSwitchBtn=document.getElementById('project-switch-btn');
const projectMenu=document.getElementById('project-menu');
const searchToggle=document.getElementById('search-toggle');
const searchOverlay=document.getElementById('search-overlay');
projectSwitchBtn?.addEventListener('click',()=>{
  toggleOverlay(projectMenu, '#project-menu');
  searchOverlay?.classList.remove('open');
});
searchToggle?.addEventListener('click',()=>{
  toggleOverlay(searchOverlay, '#search-overlay');
  projectMenu?.classList.remove('open');
  searchOverlay?.querySelector('input')?.focus();
});
// Menu projektů se teď vykresluje z reálných uložených projektů
// (ProjectStore, definovaný níže) — přepnutí opravdu vymění jméno,
// lokalitu, den stavby i seznam etap za data patřící k danému projektu.
function renderProjectMenu(){
  if(!projectMenu) return;
  const current=ProjectStore.current();
  projectMenu.querySelectorAll('button:not(.new-project)').forEach(b=>b.remove());
  const newProjectBtn=projectMenu.querySelector('.new-project');
  ProjectStore.all().forEach(p=>{
    const btn=document.createElement('button');
    btn.dataset.projectId=p.id;
    if(current && p.id===current.id) btn.classList.add('is-selected');
    const subtitle=[p.type, p.location].filter(Boolean).join(' · ') || '—';
    btn.innerHTML=`<span>🏠</span><strong>${p.name}</strong><small>${subtitle}</small><em>✓</em>`;
    btn.addEventListener('click',()=>{
      ProjectStore.switchTo(p.id);
      applyCurrentProjectToUI();
      projectMenu.classList.remove('open');
      showToast('Projekt přepnut',`Zobrazuješ „${p.name}".`);
    });
    projectMenu.insertBefore(btn, newProjectBtn);
  });
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#project-menu,#project-switch-btn')) projectMenu?.classList.remove('open');
  if(!e.target.closest('#search-overlay,#search-toggle')) searchOverlay?.classList.remove('open');
});
document.getElementById('backup-export-btn')?.addEventListener('click',()=>{
  const backup={
    exportedAt:new Date().toISOString(),
    ms_projects:localStorage.getItem('ms_projects'),
    ms_current_project_id:localStorage.getItem('ms_current_project_id'),
    ms_dash_theme:localStorage.getItem('ms_dash_theme'),
    ms_notif_prefs:localStorage.getItem('ms_notif_prefs'),
  };
  const blob=new Blob([JSON.stringify(backup)], {type:'application/json'});
  const url=URL.createObjectURL(blob);
  const dateStr=ProjectStore.todayISO();
  const a=document.createElement('a');
  a.href=url;
  a.download=`moje-stavba-zaloha-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
  showToast('Záloha stažena','Ulož si soubor někam mimo appku (např. do Souborů nebo si ho pošli e-mailem).');
});
document.getElementById('backup-import-btn')?.addEventListener('click',()=>{
  openSheet(`<div class="quick-form-top"><h2>Obnovit ze zálohy?</h2><p>Tohle nahradí VŠECHNA aktuální data v appce (všechny projekty) obsahem záložního souboru. Nedá se to vzít zpět.</p></div><button class="primary-wide" id="backup-import-confirm">Vybrat záložní soubor</button><button class="ghost-wide" data-close-detail>Zrušit</button>`);
  document.getElementById('backup-import-confirm')?.addEventListener('click',()=>{
    document.getElementById('backup-import-input')?.click();
  });
});
document.getElementById('backup-import-input')?.addEventListener('change', async(e)=>{
  const file=e.target.files[0];
  e.target.value='';
  if(!file) return;
  try{
    const text=await file.text();
    const data=JSON.parse(text);
    if(!data.ms_projects) throw new Error('invalid');
    ['ms_projects','ms_current_project_id','ms_dash_theme','ms_notif_prefs'].forEach(k=>{
      if(data[k]!=null) localStorage.setItem(k, data[k]);
    });
    closeQuickForm();
    showToast('Záloha obnovena','Appka se za chvilku načte znovu s obnovenými daty.');
    setTimeout(()=>window.location.reload(), 1200);
  }catch(err){
    showToast('Nepovedlo se','Tenhle soubor nevypadá jako platná záloha appky Moje Stavba.');
  }
});

document.getElementById('delete-project')?.addEventListener('click',()=>{
  alert('Bezpečnostní potvrzení: tady později bude nutné napsat SMAZAT, aby nešlo projekt omylem odstranit.');
});


// v0.11.1 - centrální rychlé plus, zachováno ve stylu v0.11
// --- Globální "jeden panel v jednu chvíli": než appka otevře jakékoliv
// menu/sheet/overlay, nejdřív zavře všechny ostatní, co jsou zrovna
// otevřené — dřív šlo přes sebe otevřít klidně několik věcí najednou. ---
const ALL_OVERLAY_SELECTORS=[
  '#add-stage-wrap','#quick-plus-overlay','#quick-form-sheet','#search-overlay',
  '#file-preview-overlay','#photo-lightbox-overlay','#martin-overlay',
  '#finance-export-overlay','#diary-export-overlay','#stage-menu','#trans-stage-menu',
  '#gallery-stage-menu','#project-menu',
];
function closeAllOverlays(exceptSelector){
  ALL_OVERLAY_SELECTORS.forEach(sel=>{
    if(sel===exceptSelector) return;
    document.querySelector(sel)?.classList.remove('open');
  });
  document.getElementById('quick-form-backdrop')?.classList.remove('open');
}
function toggleOverlay(el, exceptSelector){
  if(!el) return;
  if(el.classList.contains('open')){ el.classList.remove('open'); }
  else { closeAllOverlays(exceptSelector); el.classList.add('open'); }
}
const quickPlusOverlay=document.getElementById('quick-plus-overlay');
const quickFormSheet=document.getElementById('quick-form-sheet');
const quickFormContent=document.getElementById('quick-form-content');
const quickFormBackdrop=document.getElementById('quick-form-backdrop');
function openQuickPlus(){closeAllOverlays('#quick-plus-overlay');quickPlusOverlay?.classList.add('open');}
function closeQuickPlus(){quickPlusOverlay?.classList.remove('open');}
function closeQuickForm(){quickFormSheet?.classList.remove('open');quickFormSheet?.setAttribute('aria-hidden','true');quickFormBackdrop?.classList.remove('open');}
function toggleQuickPlus(){quickPlusOverlay?.classList.contains('open')?closeQuickPlus():openQuickPlus();}
document.querySelector('.add-button')?.addEventListener('click',toggleQuickPlus);

document.getElementById('quick-plus-close')?.addEventListener('click',closeQuickPlus);
document.getElementById('quick-plus-close-bg')?.addEventListener('click',closeQuickPlus);
document.getElementById('quick-form-close')?.addEventListener('click',closeQuickForm);
quickFormBackdrop?.addEventListener('click',closeQuickForm);

// Potažení dolů za "držátko" nahoře na sheetu ho zavře — appka byla
// jinak zavíratelná jen přes křížek, což na telefonu není přirozené.
(function setupSheetSwipeDismiss(){
  const handle=quickFormSheet?.querySelector('.sheet-handle');
  if(!handle || !quickFormSheet) return;
  let startY=0, lastY=0, dragging=false;
  function start(e){
    dragging=true; startY=lastY=(e.touches?e.touches[0].clientY:e.clientY);
    quickFormSheet.style.transition='none';
  }
  function move(e){
    if(!dragging) return;
    lastY=(e.touches?e.touches[0].clientY:e.clientY);
    const dy=Math.max(0, lastY-startY);
    quickFormSheet.style.transform=`translateX(-50%) translateY(${dy}px)`;
  }
  function end(){
    if(!dragging) return;
    dragging=false;
    quickFormSheet.style.transition='';
    quickFormSheet.style.transform='';
    if(lastY-startY>90) closeQuickForm();
  }
  handle.addEventListener('touchstart', start, {passive:true});
  handle.addEventListener('touchmove', move, {passive:true});
  handle.addEventListener('touchend', end);
  handle.addEventListener('mousedown', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
})();

function quickFormTemplate(type){
  const commonTop='<div class="quick-form-top"><h2>';
  const stageNames=['Bez etapy', ...visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean)];
  const currentStageName=currentStageDisplayName();
  if(type==='photo') return commonTop+'Přidat fotografie</h2><p>Fotky se uloží do galerie a mohou se připojit k zápisu.</p></div><label class="form-field"><span>Etapa</span>'+stagePillsHTML('photo-form-stage', stageNames, currentStageName)+'</label><label class="form-field"><span>Datum</span><input id="photo-form-date" type="date" value="'+ProjectStore.todayISO()+'"></label><div class="photo-strip-form big" id="photo-form-strip"><button type="button" id="photo-form-add-btn"><span class="psf-icon">📷</span><small>Přidat foto</small></button></div><input type="file" accept="image/*" multiple id="photo-form-file-input" hidden><label class="form-field"><span>Připojit k zápisu volitelně</span><input placeholder="Název zápisu"></label><button class="primary-wide" data-save-quick="photo">Uložit fotografie</button>';
}
function openQuickForm(type, options={}){
  closeQuickPlus();
  if(type==='transaction'){ openTransactionForm(null, options); return; }
  if(type==='event'){ openEventForm(null, options.presetDate); return; }
  if(type==='entry'){ openEntryForm(null); return; }
  if(!quickFormSheet||!quickFormContent) return;
  closeAllOverlays('#quick-form-sheet');
  quickFormContent.innerHTML=quickFormTemplate(type);
  quickFormSheet.classList.add('open');
  quickFormSheet.setAttribute('aria-hidden','false');
  quickFormBackdrop?.classList.add('open');
  if(type==='photo'){
    wireStagePills('photo-form-stage');
    quickPhotoFiles=[];
    const addBtn=document.getElementById('photo-form-add-btn');
    const fileInput=document.getElementById('photo-form-file-input');
    const strip=document.getElementById('photo-form-strip');
    addBtn?.addEventListener('click',()=>fileInput?.click());
    fileInput?.addEventListener('change',async()=>{
      const files=[...fileInput.files];
      fileInput.value='';
      for(const file of files){
        const url=await fileToStoredImage(file);
        quickPhotoFiles.push({url, name:file.name||''});
        const wrap=document.createElement('div');
        wrap.className='psf-thumb';
        wrap.innerHTML=`<img src="${resolvePhotoRef(url)}" alt=""><button type="button" class="psf-remove" aria-label="Odebrat fotku">×</button>`;
        wrap.querySelector('.psf-remove').addEventListener('click',()=>{
          const idx=quickPhotoFiles.findIndex(p=>p.url===url);
          if(idx>-1) quickPhotoFiles.splice(idx,1);
          wrap.remove();
        });
        strip.insertBefore(wrap, addBtn);
      }
    });
  }
}
let quickPhotoFiles=[];
document.querySelectorAll('[data-quick-form]').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.hasAttribute('data-lock-expense')){
    const stageName=currentStageDisplayName();
    openQuickForm(btn.dataset.quickForm, {lockExpense:true, presetStage:stageName});
    return;
  }
  openQuickForm(btn.dataset.quickForm);
}));
document.addEventListener('click',e=>{
  const save=e.target.closest('[data-save-quick]');
  if(!save) return;
  if(save.dataset.saveQuick==='photo'){
    const strip=document.getElementById('photo-form-strip');
    const imgs=[...(strip?.querySelectorAll('img')||[])];
    if(!imgs.length){ showToast('Chybí fotky','Nejdřív vyber alespoň jednu fotku.'); return; }
    const dateISO=document.getElementById('photo-form-date')?.value || ProjectStore.todayISO();
    const stage=document.getElementById('photo-form-stage')?.value || 'Bez etapy';
    const noteInput=quickFormContent.querySelector('.form-field input[placeholder="Název zápisu"]');
    const note=noteInput?.value?.trim();
    const d=new Date(dateISO+'T00:00:00');
    addEntryRecord({
      dateISO, dateLabel:formatDateCZ(dateISO),
      day:d.getDate(), month:CZ_MONTHS_SHORT[d.getMonth()], year:d.getFullYear(),
      time:new Date().toTimeString().slice(0,5),
      stage, weather:'',
      text: note || `Fotky — ${formatDateCZ(dateISO)}`,
      workType:'', workers:'', materials:'',
      photos: quickPhotoFiles.map(p=>({url:p.url, name:p.name||''})),
      attachment:null,
    });
    closeQuickForm();
    if(typeof renderDiaryTimeline==='function') renderDiaryTimeline();
    if(typeof renderDashboardPhotoPreview==='function') renderDashboardPhotoPreview();
    if(typeof renderStagePhotoStrip==='function') renderStagePhotoStrip();
    if(typeof renderStageDetailDiary==='function') renderStageDetailDiary();
    showToast('Fotky uloženy',`${imgs.length===1?'Fotka se uložila':'Fotky se uložily'} do galerie.`);
    openGallery('dashboard', stage!=='Bez etapy'?stage:null);
    return;
  }
  closeQuickForm();
});


// v0.11.2_014 – sjednocené funkční prokliky bez změny profi vzhledu
function showToast(title, text=''){
  let toast=document.querySelector('.action-toast');
  if(!toast){
    toast=document.createElement('div');
    toast.className='action-toast';
    document.querySelector('.app-shell')?.appendChild(toast);
  }
  toast.innerHTML=`<b>${title}</b>${text?`<small>${text}</small>`:''}`;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=>toast.classList.remove('show'),2200);
}
function openSheet(html){
  if(!quickFormSheet||!quickFormContent) return;
  closeAllOverlays('#quick-form-sheet');
  quickFormContent.innerHTML=html;
  quickFormSheet.classList.add('open');
  quickFormSheet.setAttribute('aria-hidden','false');
  quickFormBackdrop?.classList.add('open');
}
function openOfferForm(){
  const stageName=currentStageDisplayName();
  let offerStatus='Čeká';
  const statusCycle=['Čeká','K porovnání','Přijato','Odmítnuto'];
  openSheet('<div class="quick-form-top"><h2>Nová nabídka</h2><p>Nabídka patří jen do vybrané etapy. Do rychlého plus ji nedáváme.</p></div><div class="form-mini-grid"><button type="button" id="offer-form-stage-btn"><span>Etapa</span><b>'+stageName+'</b></button><button type="button" id="offer-form-status-btn"><span>Stav</span><b id="offer-form-status-label">Čeká</b></button></div><label class="form-field"><span>Název nabídky *</span><input id="offer-form-name" placeholder="Název nabídky"></label><label class="form-field"><span>Firma *</span><input id="offer-form-company" placeholder="Název firmy"></label><label class="form-field"><span>Cena volitelně</span><input id="offer-form-price" placeholder="Cena"></label><label class="form-field"><span>Platnost nabídky (nepovinné)<i class="field-hint">Zobrazí se v kalendáři</i></span><input id="offer-form-validity" placeholder="Datum platnosti"></label><div class="receipt-box"><button>Přidat PDF</button><button>Vyfotit nabídku</button></div><button class="primary-wide" data-save-offer>Uložit nabídku</button>');
  document.getElementById('offer-form-stage-btn')?.addEventListener('click',()=>{
    showToast('Etapa nabídky', `Nabídka se ukládá do etapy „${stageName}", ve které ji zakládáš.`);
  });
  document.getElementById('offer-form-status-btn')?.addEventListener('click',()=>{
    const idx=(statusCycle.indexOf(offerStatus)+1)%statusCycle.length;
    offerStatus=statusCycle[idx];
    document.getElementById('offer-form-status-label').textContent=offerStatus;
  });
}
function openTransactionDetail(id){
  const tx=getCurrentProjectTx().find(t=>t.id===id);
  if(!tx) return;
  const sign=tx.type==='income'?'+':'-';
  const photos=tx.photos || (tx.photo?[tx.photo]:[]);
  openSheet(`<div class="quick-form-top"><h2>${tx.name}</h2><p>${tx.type==='income'?'Vklad':'Výdaj'}</p></div><div class="mini-detail"><span>Částka</span><b>${sign}${money(tx.amount)}</b></div><div class="mini-detail"><span>Datum a etapa</span><b>${tx.dateLabel} · ${tx.stage||'Bez etapy'}</b></div>${tx.company?`<div class="mini-detail"><span>Firma</span><b>${tx.company}</b></div>`:''}${tx.note?`<div class="mini-detail"><span>Poznámka</span><b>${tx.note}</b></div>`:''}${tx.receipt?`<div class="tx-receipt-detail"><span class="card-label">Účtenka</span><img src="${resolvePhotoRef(tx.receipt)}" alt="" id="tx-receipt-open"></div>`:''}${photos.length?`<div class="tx-receipt-detail"><span class="card-label">Fotky</span><div class="entry-photos">${photos.map(p=>`<img src="${resolvePhotoRef(p.url)}" alt="" class="tx-photo-open">`).join('')}</div></div>`:''}<button class="primary-wide" id="tx-edit-btn">Upravit transakci</button><button class="ghost-wide" id="tx-delete-btn">Smazat transakci</button><button class="ghost-wide" data-close-detail>Zavřít</button>`);
  document.getElementById('tx-receipt-open')?.addEventListener('click',()=>{
    openPhotoLightbox(resolvePhotoRef(tx.receipt));
  });
  document.querySelectorAll('.tx-photo-open').forEach((img,i)=>{
    img.addEventListener('click',()=>openPhotoLightbox(resolvePhotoRef(photos[i]?.url)));
  });
  document.getElementById('tx-edit-btn')?.addEventListener('click',()=>openTransactionForm(tx));
  document.getElementById('tx-delete-btn')?.addEventListener('click',()=>{
    openSheet(`<div class="quick-form-top"><h2>Smazat transakci?</h2><p>${tx.name} · ${sign}${money(tx.amount)}</p></div><button class="ghost-wide" id="tx-delete-confirm">Smazat</button><button class="primary-wide" data-close-detail>Nechat tak</button>`);
    document.getElementById('tx-delete-confirm')?.addEventListener('click',()=>{
      deleteTransactionRecord(tx.id);
      renderTransactionList();
      renderDashboardMoneyCards();
      closeQuickForm();
      showToast('Transakce smazána',`„${tx.name}" byla odstraněna.`);
    });
  });
}
// Projekt – viz kompletní implementace níže (v0.39.0)

// Horní a podstránkové hledání
function openSearchOverlay(){
  closeAllOverlays('#search-overlay');
  searchOverlay?.classList.add('open');
  const input=searchOverlay?.querySelector('input');
  input?.focus();
  renderSearchResults(input?.value||'');
}
function renderSearchResults(query){
  const box=searchOverlay?.querySelector('.search-results');
  if(!box) return;
  const q=query.trim().toLowerCase();
  if(!q){
    box.innerHTML='<p class="empty-hint">Napiš, co hledáš — etapu, výdaj, zápis nebo událost.</p>';
    return;
  }
  const results=[];
  visibleStageRows().forEach(row=>{
    const name=row.querySelector('h2')?.textContent||'';
    if(name.toLowerCase().includes(q)){
      results.push({icon:'▦', title:name, sub:'Etapa', action:()=>openStage(row.dataset.stageId)});
    }
  });
  getCurrentProjectTx().forEach(t=>{
    const hay=`${t.name} ${t.company||''}`.toLowerCase();
    if(hay.includes(q)){
      results.push({icon: t.type==='income'?'＋':'▱', title:t.name, sub:`${t.type==='income'?'Vklad':'Výdaj'} · ${money(t.amount)}`, action:()=>{go('transactions');openTransactionDetail(t.id);}});
    }
  });
  (typeof getCurrentProjectEntries==='function'?getCurrentProjectEntries():[]).forEach(en=>{
    if((en.text||'').toLowerCase().includes(q)){
      results.push({icon:'✎', title:en.text.length>40?en.text.slice(0,40)+'…':en.text, sub:`Zápis · ${en.dateLabel||''}`, action:()=>openEntry(en.id,'diary')});
    }
  });
  (typeof getCurrentProjectEvents==='function'?getCurrentProjectEvents():[]).forEach(ev=>{
    if((ev.title||'').toLowerCase().includes(q)){
      results.push({icon:'◷', title:ev.title, sub:`Událost · ${ev.dateLabel||''}`, action:()=>openEventDetail(ev)});
    }
  });
  if(!results.length){
    box.innerHTML=`<p class="empty-hint">Nic jsem nenašel pro „${query}".</p>`;
    return;
  }
  box.innerHTML=results.slice(0,20).map((r,i)=>`<button type="button" data-search-result="${i}"><span class="sr-icon">${r.icon}</span><span class="sr-text"><b>${r.title}</b><small>${r.sub}</small></span></button>`).join('');
  box.querySelectorAll('[data-search-result]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const r=results[Number(btn.dataset.searchResult)];
      searchOverlay?.classList.remove('open');
      r?.action();
    });
  });
}
searchOverlay?.querySelector('input')?.addEventListener('input',e=>renderSearchResults(e.target.value));
document.querySelectorAll('.plain-icon').forEach(btn=>{
  if(btn.id) return; // tlačítka s vlastním ID mají svou vlastní logiku jinde
  const t=btn.textContent.trim();
  if(t==='⌕') btn.addEventListener('click',openSearchOverlay);
  if(t==='+') btn.addEventListener('click',openQuickPlus);
  if(t==='⋯') btn.addEventListener('click',()=>showToast('Další možnosti', 'Tady bude kontextové menu obrazovky.'));
});

// Kalendář – detail dne
document.querySelector('.calendar-item.task-item')?.addEventListener('click',()=>showToast('Úkol','Úkoly zatím necháváme jako náhled v kalendáři.'));
document.querySelector('.calendar-item.empty-item')?.addEventListener('click',()=>openQuickForm('event'));

// Transakce – detail výdaje/vkladu (delegovaný listener, funguje i pro
// transakce vykreslené za běhu)
document.getElementById('transaction-list')?.addEventListener('click',e=>{
  const row=e.target.closest('.transaction-row');
  if(!row) return;
  const thumb=e.target.closest('.tx-thumb-cluster');
  if(thumb){
    e.stopPropagation();
    const tx=getCurrentProjectTx().find(t=>t.id===row.dataset.txId);
    if(!tx) return;
    const photos=tx.photos || (tx.photo?[tx.photo]:[]);
    openPhotoLightbox(resolvePhotoRef(photos[0]?.url || tx.receipt));
    return;
  }
  if(row.dataset.txId) openTransactionDetail(row.dataset.txId);
});

// Projekt – viz kompletní implementace níže (v0.39.0)

// Nastavení – všechny řádky mají reakci
const settingsRows=[...document.querySelectorAll('#screen-settings .settings-row')];
settingsRows.forEach(row=>row.addEventListener('click',e=>{
  if(row.id==='delete-project'||row.id==='export-kronika'||row.id==='export-finance'||row.id==='notif-toggle-row'||row.id==='backup-export-btn'||row.id==='backup-import-btn') return;
  const name=row.querySelector('b')?.textContent || 'Nastavení';
  if(name.includes('Upravit projekt')){
    const p=ProjectStore.current();
    if(!p) return;
    let startRow;
    if(p.completedDate){
      startRow = `<p class="quick-form-note">Stavba je zkolaudovaná (${formatDateCZ(p.completedDate)}) — den stavby je zastavený.</p><button class="link-button" id="ep-cancel-complete" type="button">Zrušit zkolaudování</button>`;
    } else if(p.startDate){
      startRow = `<label class="form-field"><span>Datum zahájení stavby</span><input id="ep-start-date" type="date" value="${p.startDate}"></label><button class="link-button" id="ep-cancel-start" type="button">Zrušit zahájení stavby</button><button class="link-button" id="ep-complete-btn" type="button">Zkolaudovat stavbu</button>`;
    } else {
      startRow = `<p class="quick-form-note">Stavba ještě nebyla zahájena — datum zadáš tlačítkem „Zahájit stavbu" na dashboardu.</p>`;
    }
    openSheet(`<div class="quick-form-top"><h2>Upravit projekt</h2><p>Název, lokalita a datum zahájení ovlivňují horní lištu i den stavby.</p></div><label class="form-field"><span>Název projektu <i id="ep-name-count">${p.name.length}/22</i></span><input id="ep-name" value="${p.name}" maxlength="22"></label><label class="form-field"><span>Lokalita</span><input id="ep-location" value="${p.location||''}"></label><label class="form-field"><span>Typ projektu</span>${typePillsHTML('ep',p.type||'')}</label>${startRow}<button class="primary-wide" id="ep-save">Uložit změny</button>`);
    wireTypePills('ep');
    const epName=document.getElementById('ep-name');
    const epCount=document.getElementById('ep-name-count');
    epName?.addEventListener('input',()=>{epCount.textContent=epName.value.length+'/22';});
    document.getElementById('ep-complete-btn')?.addEventListener('click',()=>{ closeQuickForm(); openCompleteConstructionSheet(); });
    document.getElementById('ep-cancel-complete')?.addEventListener('click',()=>{ closeQuickForm(); openCancelCompletionSheet(); });
    document.getElementById('ep-cancel-start')?.addEventListener('click',()=>{
      closeQuickForm();
      openCancelStartSheet(p);
    });
    document.getElementById('ep-save')?.addEventListener('click',()=>{
      const newName=epName.value.trim();
      if(!newName) return;
      const patch={
        name:newName,
        location:document.getElementById('ep-location').value.trim(),
        type:getTypeValue('ep'),
      };
      const epStartDate=document.getElementById('ep-start-date');
      if(epStartDate) patch.startDate=epStartDate.value || null;
      ProjectStore.update(p.id, patch);
      applyCurrentProjectToUI();
      closeQuickForm();
      showToast('Projekt upraven','Změny se uložily.');
    });
    return;
  }
  if(name.includes('Čeština')){showToast('Jazyk','Připraveno pro budoucí překlady.');return;}
  if(row.id==='about-app-btn'){
    openSheet(`<div class="quick-form-top"><h2>Moje Stavba</h2><p>Verze ${APP_VERSION}</p></div>
      <p class="quick-form-note">Appka vznikla z jednoduché potřeby: mít celou stavbu domu na jednom místě
      v telefonu, ne rozházenou mezi poznámkami, e-maily, foťákem a hlavou člověka, co to celé řídí.</p>
      <p class="quick-form-note">Etapy, deník, fotky, transakce i dodavatelé patří k sobě — proto je Moje
      Stavba jedna appka, ne pět různých. Cílem není appka, která toho umí hodně napůl, ale taková, která
      spolehlivě drží základní věci: kolikátý je den stavby, co se kde stalo a kolik to stálo.</p>
      <p class="quick-form-note">Appka se pořád staví — stejně jako dům, na který se v ní díváš. Něco tu
      ještě chybí, něco se bude ještě předělávat. Díky, že jsi u toho od začátku.</p>
      <button class="ghost-wide" data-close-detail>Zavřít</button>`);
    return;
  }
  showToast(name,'Funkce je připravená jako interaktivní prototyp.');
}));

// --- Sdílení: rozsah (celý projekt / etapa / období) ---
let shareScope='all';
document.querySelectorAll('#share-scope-pills .type-pill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    shareScope=btn.dataset.scope;
    document.querySelectorAll('#share-scope-pills .type-pill').forEach(b=>b.classList.toggle('is-active',b===btn));
    document.getElementById('share-scope-stage-field').style.display = shareScope==='stage' ? '' : 'none';
    document.getElementById('share-scope-range-field').style.display = shareScope==='range' ? '' : 'none';
    if(shareScope==='stage') populateShareStageSelect();
  });
});
function populateShareStageSelect(){
  const wrap=document.getElementById('share-scope-stage-pills');
  if(!wrap) return;
  const names=visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean);
  wrap.innerHTML=stagePillsHTML('share-scope-stage', names, names[0]);
  wireStagePills('share-scope-stage');
}
document.querySelectorAll('.share-tile[data-share-section]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    btn.classList.toggle('is-on');
    const financeNote=document.getElementById('share-finance-note');
    const financeOn=document.querySelector('[data-share-section="finance"]')?.classList.contains('is-on');
    if(financeNote) financeNote.style.display = financeOn ? '' : 'none';
  });
});

function inShareRange(dateISO){
  if(!dateISO) return true;
  if(shareScope!=='range') return true;
  const from=document.getElementById('share-scope-from')?.value;
  const to=document.getElementById('share-scope-to')?.value;
  if(from && dateISO<from) return false;
  if(to && dateISO>to) return false;
  return true;
}
function inShareStage(stageName){
  if(shareScope!=='stage') return true;
  const wanted=document.getElementById('share-scope-stage')?.value;
  return (stageName||'Bez etapy')===wanted;
}
function activeShareSections(){
  return [...document.querySelectorAll('.share-tile.is-on')].map(b=>b.dataset.shareSection);
}
async function generateShareSummaryPDF(){
  const project=ProjectStore.current();
  if(!project) return null;
  const sections=activeShareSections();
  const doc=new jsPDF();
  const t=makePdfToolkit(doc);
  const {st,para,sectionHeading,rightAligned,dot,photoRow,ensureSpace,marginX,pageW}=t;

  const scopeLabel = shareScope==='stage'
    ? `Etapa: ${document.getElementById('share-scope-stage')?.value||'—'}`
    : shareScope==='range'
    ? `Období: ${document.getElementById('share-scope-from')?.value||'…'} – ${document.getElementById('share-scope-to')?.value||'…'}`
    : 'Celý projekt';
  t.coverHeader('Souhrn stavby', project.name,
    `${project.location||''}${project.location?'  ·  ':''}${scopeLabel}\nVytvořeno ${formatDateCZ(ProjectStore.todayISO())} appkou Moje Stavba`);

  if(sections.includes('stages')){
    sectionHeading('Etapy', 'purple');
    const rows=visibleStageRows().filter(r=>inShareStage(r.querySelector('h2')?.textContent));
    if(!rows.length) para('Žádné etapy v tomhle rozsahu.', {color:PDF_COLORS.muted});
    rows.forEach(rw=>{
      const name=rw.querySelector('h2')?.textContent||'';
      const status=rw.querySelector('p')?.textContent?.trim()||'Nezahájeno';
      const spent=(rw.querySelector('.stage-money')?.textContent?.trim()||'0 Kč').replace(/[\u00A0\u202F\u2009]/g,' ');
      const isDone=rw.classList.contains('done');
      const isCurrent=rw.classList.contains('stage-current');
      const dotColor = isDone?PDF_COLORS.green : isCurrent?PDF_COLORS.purple : PDF_COLORS.muted;
      ensureSpace(7);
      dot(dotColor, st.y+1.6);
      t.doc.setFontSize(10.5); t.boldFont(); t.doc.setTextColor(...PDF_COLORS.ink);
      t.doc.text(name, marginX+6, st.y);
      t.doc.setFontSize(9); t.normalFont(); t.doc.setTextColor(...PDF_COLORS.muted);
      t.doc.text(status, marginX+6, st.y+4.2);
      if(sections.includes('finance')) rightAligned(spent, st.y, {size:10.5, color:PDF_COLORS.ink});
      st.y+=10;
    });
    st.y+=3;
  }

  if(sections.includes('diary') || sections.includes('gallery')){
    sectionHeading('Deník', 'cyan');
    const entries=getCurrentProjectEntries()
      .filter(e=>inShareStage(e.stage) && inShareRange(e.dateISO))
      .sort((a,b)=>(a.dateISO||'').localeCompare(b.dateISO||''));
    if(!entries.length) para('Žádné zápisy v tomhle rozsahu.', {color:PDF_COLORS.muted});
    entries.slice(0,30).forEach(e=>{
      ensureSpace(11);
      t.doc.setFillColor(...PDF_COLORS.cyan); t.doc.rect(marginX, st.y-3.6, 1, 9, 'F');
      t.doc.setFontSize(10.5); t.boldFont(); t.doc.setTextColor(...PDF_COLORS.ink);
      t.doc.text(`${e.dateLabel||e.dateISO}  -  ${e.stage||'Bez etapy'}`, marginX+5, st.y);
      st.y+=5.5;
      if(e.text && !e.hiddenFromDiary) para(e.text, {size:9.8, color:[80,84,98], x:marginX+5, maxWidth:pageW-marginX*2-5});
      const photos=(e.photos||[]).map(p=>resolvePhotoRef(p.url)).filter(Boolean);
      if(photos.length) photoRow(photos, 3, 34, 25);
      st.y+=3;
    });
    st.y+=2;
  }

  if(sections.includes('finance')){
    sectionHeading('Finance', 'green');
    const tx=getCurrentProjectTx().filter(tr=>inShareStage(tr.stage) && inShareRange(tr.dateISO));
    const totalExpense=tx.filter(tr=>tr.type==='expense').reduce((s,tr)=>s+Number(tr.amount||0),0);
    const totalIncome=tx.filter(tr=>tr.type==='income').reduce((s,tr)=>s+Number(tr.amount||0),0);
    ensureSpace(10);
    t.doc.setFontSize(10.5); t.boldFont(); t.doc.setTextColor(...PDF_COLORS.green);
    t.doc.text(`Vklady: ${moneyPdf(totalIncome)}`, marginX, st.y);
    t.doc.setTextColor(...PDF_COLORS.red);
    t.doc.text(`Výdaje: ${moneyPdf(totalExpense)}`, marginX+75, st.y);
    t.doc.setTextColor(...PDF_COLORS.ink);
    t.doc.text(`Zůstatek: ${moneyPdf(totalIncome-totalExpense)}`, marginX+150, st.y);
    st.y+=9;
    if(!tx.length) para('Žádné transakce v tomhle rozsahu.', {color:PDF_COLORS.muted});
    tx.slice(0,50).forEach(tr=>{
      const sign=tr.type==='income'?'+':'-';
      const thumb=resolvePhotoRef(tr.receipt || (tr.photos&&tr.photos[0]&&tr.photos[0].url));
      ensureSpace(9);
      t.doc.setFontSize(10); t.normalFont(); t.doc.setTextColor(...PDF_COLORS.ink);
      t.doc.text(`${tr.dateLabel||tr.dateISO}  -  ${tr.name}${tr.company?` (${tr.company})`:''}`, marginX, st.y);
      rightAligned(`${sign}${moneyPdf(tr.amount)}`, st.y, {size:10, color: tr.type==='income'?PDF_COLORS.green:PDF_COLORS.red});
      st.y+=6;
      if(thumb){ t.embedImage(thumb, marginX, st.y-4.5, 10, 10); st.y+=7; }
    });
    st.y+=3;
  }

  if(sections.includes('calendar')){
    sectionHeading('Kalendář', 'orange');
    const events=getCurrentProjectEvents().filter(e=>inShareStage(e.stage) && inShareRange(e.dateISO));
    if(!events.length) para('Žádné události v tomhle rozsahu.', {color:PDF_COLORS.muted});
    events.forEach(e=> para(`${e.dateLabel||e.dateISO}  -  ${e.title}`, {size:10}));
    st.y+=4;
  }

  if(sections.includes('documents')){
    sectionHeading('Dokumenty', 'purple');
    if(!documentsData.length) para('Žádné dokumenty u téhle etapy.', {color:PDF_COLORS.muted});
    documentsData.forEach(d=> para(`${d.name}  -  ${d.sizeLabel||''}`, {size:10}));
  }

  return doc;
}
let cachedShareBlob=null, cachedShareFileName=null;
document.getElementById('invite-generate')?.addEventListener('click', async()=>{
  const btn=document.getElementById('invite-generate');
  const project=ProjectStore.current();
  // Krok 2: PDF uz je vygenerovane a nahlednute, tak ho rovnou sdilej
  if(cachedShareBlob){
    btn.disabled=true; btn.textContent='Sdílím…';
    try{
      const file=new File([cachedShareBlob], cachedShareFileName, {type:'application/pdf'});
      if(navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({files:[file], title:cachedShareFileName, text:`Souhrn projektu ${project?.name||''}`});
      } else {
        const url=URL.createObjectURL(cachedShareBlob);
        const a=document.createElement('a');
        a.href=url; a.download=cachedShareFileName;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(()=>URL.revokeObjectURL(url), 2000);
        showToast('PDF staženo','Tenhle prohlížeč neumí přímé sdílení — pošli soubor ručně, kam potřebuješ.');
      }
    }catch(err){
      showToast('Nepovedlo se','Zkus to prosím znovu.');
    }
    cachedShareBlob=null; cachedShareFileName=null;
    btn.disabled=false; btn.textContent='Vytvořit a sdílet PDF';
    return;
  }
  // Krok 1: vygenerovat a nejdriv ukazat nahled, at si to muzes
  // zkontrolovat, nez to nekam posles
  btn.disabled=true; btn.textContent='Vytvářím PDF…';
  try{
    const doc=await generateShareSummaryPDF();
    const fileName=`${(project?.name||'projekt').replace(/[^a-z0-9]+/gi,'-')}-souhrn.pdf`;
    const blob=doc.output('blob');
    cachedShareBlob=blob; cachedShareFileName=fileName;
    const previewUrl=URL.createObjectURL(blob);
    window.open(previewUrl, '_blank');
    btn.textContent='Vypadá dobře? Sdílet PDF';
    showToast('Náhled otevřen','Zkontroluj PDF v nové záložce, pak klikni znovu na tlačítko a pošli ho.');
  }catch(err){
    showToast('Nepovedlo se','Zkus to prosím znovu.');
    btn.textContent='Vytvořit a sdílet PDF';
  }
  btn.disabled=false;
});

// =========================================================
// v0.29.0 — Nabídky: datový model, náhled + plný seznam, detail,
// zaúčtování s dotazem na reálně zaplacenou částku
// =========================================================
const offerStatus=['waiting','accepted','rejected','paid'];
const offerText={waiting:'Čeká',comparing:'K porovnání',accepted:'Přijata',rejected:'Zamítnuta',paid:'Zaplaceno'};
let offersData=[];
let offerIdSeq=1;
function fmtKc(n){return n.toLocaleString('cs-CZ')+' Kč';}
function offerRowHTML(o){
  const meta=o.status==='paid' ? `Vznikla transakce ${fmtKc(o.price)}` : (o.validity ? `Platnost do ${o.validity}` : 'Bez data platnosti');
  return `<article class="offer-item" data-offer-id="${o.id}"><div><b>${o.name}</b><small>${meta}</small></div><span class="offer-state state-${o.status}">${offerText[o.status]}</span></article>`;
}
const offersPreviewEl=document.getElementById('offers-preview');
const offersFullListEl=document.getElementById('offers-full-list');
const offersViewAllBtn=document.getElementById('offers-view-all');

function renderOffers(){
  if(!offersPreviewEl) return;
  offersPreviewEl.innerHTML=offersData.slice(0,2).map(offerRowHTML).join('') || '<p class="offers-empty">Zatím žádné nabídky.</p>';
  if(offersFullListEl) offersFullListEl.innerHTML=offersData.map(offerRowHTML).join('') || '<p class="offers-empty">Zatím žádné nabídky.</p>';
  if(offersViewAllBtn){
    offersViewAllBtn.textContent=`Zobrazit všechny nabídky (${offersData.length})`;
    offersViewAllBtn.style.display=offersData.length>2?'':'none';
  }
  [offersPreviewEl,offersFullListEl].forEach(container=>{
    container?.querySelectorAll('.offer-item').forEach(row=>{
      row.addEventListener('click',()=>openOfferDetail(Number(row.dataset.offerId)));
    });
  });
}

function openOfferDetail(id){
  const o=offersData.find(x=>x.id===id);
  if(!o) return;
  const buttonsHtml=offerStatus.map(s=>
    `<button class="offer-status-pick${s===o.status?' is-active':''}" data-pick-status="${s}">${offerText[s]}</button>`
  ).join('');
  openSheet(`<div class="quick-form-top"><h2>${o.name}</h2><p>${o.company} · ${fmtKc(o.price)}${o.validity?` · platnost do ${o.validity}`:''}</p></div><p class="offer-detail-label">Stav nabídky</p><div class="offer-status-grid">${buttonsHtml}</div><button class="ghost-wide" id="offer-detail-delete">Smazat nabídku</button><button class="ghost-wide" data-close-detail>Zavřít</button>`);
  document.querySelectorAll('[data-pick-status]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const status=btn.dataset.pickStatus;
      if(status==='paid'){ closeQuickForm(); openConvertFlow(o); return; }
      if(status==='rejected'){ o.status=status; closeQuickForm(); openRejectFlow(o); return; }
      o.status=status;
      renderOffers();
      closeQuickForm();
      showToast('Stav nabídky změněn',`${o.name} → ${offerText[o.status]}`);
    });
  });
  document.getElementById('offer-detail-delete')?.addEventListener('click',()=>{
    offersData=offersData.filter(x=>x.id!==id);
    renderOffers();
    closeQuickForm();
    showToast('Nabídka smazána',`„${o.name}" byla odstraněna.`);
  });
}

// --- Zaúčtování nabídky: kolik reálně zaplaceno + smazat nabídku? ---
// --- Zamítnutá nabídka: ponechat v seznamu, nebo smazat? ---
function openRejectFlow(o){
  renderOffers();
  openSheet(`<div class="quick-form-top"><h2>Nabídka zamítnuta</h2><p>${o.name}</p></div><p class="offer-detail-label">Co s ní chceš udělat?</p><button class="ghost-wide" id="reject-delete">Smazat nabídku</button><button class="primary-wide" id="reject-keep">Ponechat v seznamu</button>`);
  document.getElementById('reject-delete')?.addEventListener('click',()=>{
    offersData=offersData.filter(x=>x.id!==o.id);
    renderOffers();
    closeQuickForm();
    showToast('Nabídka smazána',`„${o.name}" byla odstraněna.`);
  });
  document.getElementById('reject-keep')?.addEventListener('click',()=>{
    closeQuickForm();
    showToast('Nabídka zamítnuta',`${o.name} zůstává v seznamu se stavem Zamítnuta.`);
  });
}

function openConvertFlow(o){
  openSheet(`<div class="quick-form-top"><h2>Zaúčtovat nabídku</h2><p>${o.name}</p></div><label class="form-field"><span>Kolik jste reálně zaplatili? *</span><input id="convert-amount" value="${fmtKc(o.price)}"></label><label class="offer-delete-check"><input type="checkbox" id="convert-delete" checked> Smazat nabídku po zaúčtování</label><button class="primary-wide" id="convert-confirm">Pokračovat k transakci</button>`);
  document.getElementById('convert-confirm')?.addEventListener('click',()=>{
    const amountRaw=document.getElementById('convert-amount').value;
    const shouldDelete=document.getElementById('convert-delete').checked;
    if(shouldDelete){
      offersData=offersData.filter(x=>x.id!==o.id);
    } else {
      o.status='paid';
      o.price=Number(amountRaw.replace(/[^\d]/g,''))||o.price;
    }
    renderOffers();
    const prefillAmount=Number(String(amountRaw).replace(/[^\d]/g,''))||o.price;
    openTransactionForm({name:o.name, amount:prefillAmount, type:'expense', company:o.company});
    showToast('Nabídka zaúčtována',shouldDelete?'Nabídka byla smazána, transakce je připravená k uložení.':'Nabídka zůstává jako zaplacená, transakce je připravená k uložení.');
  });
}

document.getElementById('offers-view-all')?.addEventListener('click',()=>go('offers'));
document.getElementById('offers-add-btn-full')?.addEventListener('click',openOfferForm);
renderOffers();
offersData.forEach(o=>{ if(o.validity) addOfferToCalendar(o.validity,o.name); });
// =========================================================
// v0.30.0 — Dokumenty: reálný upload, náhled/limit, otevření souboru
// =========================================================
const DOC_SIZE_LIMIT=3*1024*1024; // 3 MB — soubory se teď ukládají natrvalo přímo do úložiště appky, ne jako dočasný odkaz, takže musí zůstat rozumně malé
let documentsData=[];
let docIdSeq=1;
function fmtSize(bytes){
  if(bytes<1024) return bytes+' B';
  if(bytes<1024*1024) return (bytes/1024).toFixed(0)+' kB';
  return (bytes/1024/1024).toFixed(1)+' MB';
}
function docTypeLabel(name){
  const ext=(name.split('.').pop()||'').toUpperCase();
  return ext.length<=4?ext:'DOC';
}
function docRowHTML(d,isPreview){
  return `<article data-doc-id="${d.id}"><span>${docTypeLabel(d.name)}</span><p>${d.name}</p><small>${d.sizeLabel}</small></article>`;
}
const docsPreviewEl=document.getElementById('docs-preview');
const docsFullListEl=document.getElementById('docs-full-list');
function renderDocuments(){
  if(!docsPreviewEl) return;
  const previewItems=documentsData.slice(0,2).map(d=>docRowHTML(d,true)).join('');
  docsPreviewEl.innerHTML=previewItems+'<button id="docs-add-btn-preview">+<small>Přidat</small></button>';
  if(docsFullListEl){
    docsFullListEl.innerHTML=documentsData.length
      ? documentsData.map(d=>docRowHTML(d,false)).join('')
      : '<p class="offers-empty">Zatím žádné dokumenty.</p>';
  }
  [docsPreviewEl,docsFullListEl].forEach(container=>{
    container?.querySelectorAll('[data-doc-id]').forEach(row=>{
      row.addEventListener('click',()=>openDocument(Number(row.dataset.docId)));
    });
  });
  document.getElementById('docs-add-btn-preview')?.addEventListener('click',()=>document.getElementById('docs-file-input')?.click());
}
// --- Spolehlivý náhled souboru přímo v appce (bez závislosti na nové kartě) ---
function openFilePreview(name,url){
  url=resolvePhotoRef(url);
  const ext=(name.split('.').pop()||'').toLowerCase();
  const body=document.getElementById('file-preview-body');
  document.getElementById('file-preview-name').textContent=name;
  if(['jpg','jpeg','png','gif','webp'].includes(ext)){
    body.innerHTML=`<img src="${url}" alt="${name}">`;
  } else if(ext==='pdf'){
    body.innerHTML=`<iframe src="${url}"></iframe>`;
  } else {
    body.innerHTML=`<p class="file-preview-nopreview">Náhled pro tento typ souboru appka nepodporuje.</p><a class="primary-wide" href="${url}" download="${name}">Stáhnout „${name}"</a>`;
  }
  closeAllOverlays('#file-preview-overlay');
  document.getElementById('file-preview-overlay')?.classList.add('open');
}
document.getElementById('file-preview-close')?.addEventListener('click',()=>document.getElementById('file-preview-overlay')?.classList.remove('open'));
document.getElementById('file-preview-close-bg')?.addEventListener('click',()=>document.getElementById('file-preview-overlay')?.classList.remove('open'));

// --- Rychlý náhled fotky/účtenky u výdaje: vyskakovací okno přes cca 1/3
// obrazovky místo zobrazení fotky natvrdo v detailu nebo otevírání nové karty ---
function openPhotoLightbox(url){
  if(!url) return;
  closeAllOverlays('#photo-lightbox-overlay');
  const img=document.getElementById('photo-lightbox-img');
  if(img) img.src=url;
  document.getElementById('photo-lightbox-overlay')?.classList.add('open');
  document.getElementById('photo-lightbox-overlay')?.setAttribute('aria-hidden','false');
}
function closePhotoLightbox(){
  document.getElementById('photo-lightbox-overlay')?.classList.remove('open');
  document.getElementById('photo-lightbox-overlay')?.setAttribute('aria-hidden','true');
  const img=document.getElementById('photo-lightbox-img');
  if(img) img.src='';
}
document.getElementById('photo-lightbox-close')?.addEventListener('click',closePhotoLightbox);
document.getElementById('photo-lightbox-close-bg')?.addEventListener('click',closePhotoLightbox);

function openDocument(id){
  const d=documentsData.find(x=>x.id===id);
  if(!d) return;
  if(!d.url){
    showToast('Soubor nejde otevřít','Přidej vlastní reálný soubor.');
    return;
  }
  openFilePreview(d.name,d.url);
}
async function handleDocFile(file){
  if(!file) return;
  if(file.size>DOC_SIZE_LIMIT){
    showToast('Soubor je moc velký',`Limit je ${fmtSize(DOC_SIZE_LIMIT)}, „${file.name}" má ${fmtSize(file.size)}. Zkus ho zmenšit nebo vybrat jiný.`);
    return false;
  }
  const url=await fileToStoredImage(file);
  documentsData.unshift({id:docIdSeq++,name:file.name,sizeLabel:`${docTypeLabel(file.name)} · ${fmtSize(file.size)}`,url});
  return true;
}
async function handleDocFiles(fileList){
  const files=[...fileList];
  if(!files.length) return;
  let added=0, skipped=0;
  for(const file of files){
    const ok=await handleDocFile(file);
    if(ok) added++; else skipped++;
  }
  renderDocuments();
  if(added && !skipped) showToast('Dokumenty přidány', files.length===1 ? `„${files[0].name}" je teď u téhle etapy.` : `${added} souborů je teď u téhle etapy.`);
  else if(added && skipped) showToast('Přidáno částečně', `${added} souborů se přidalo, ${skipped} bylo moc velkých — zkontroluj hlášky výše.`);
}
document.getElementById('docs-file-input')?.addEventListener('change',e=>handleDocFiles(e.target.files));
document.getElementById('docs-add-btn-full')?.addEventListener('click',()=>document.getElementById('docs-file-input')?.click());
document.getElementById('docs-view-all')?.addEventListener('click',()=>go('documents'));
renderDocuments();

// =========================================================
// v0.31.0 — Úkoly: vázané na konkrétní etapu, priorita, kalendář
// =========================================================
const priorityText={low:'Nízká',mid:'Střední',high:'Vysoká'};
const priorityOrder=['low','mid','high'];
let tasksData=[];
let taskIdSeq=1;
function tasksForCurrentStage(){ return tasksData.filter(t=>t.stageId===currentStageId); }
function taskRowHTML(t){
  return `<article data-task-id="${t.id}" class="${t.done?'is-done':''}"><i></i><span>${t.title}</span><small>${t.date||'Bez termínu'}</small><b class="priority-${t.priority}">${priorityText[t.priority]}</b></article>`;
}
const tasksPreviewEl=document.getElementById('tasks-preview');
const tasksFullListEl=document.getElementById('tasks-full-list');
const tasksViewAllBtn=document.getElementById('tasks-view-all');
function renderTasks(){
  if(!tasksPreviewEl) return;
  const mine=tasksForCurrentStage();
  tasksPreviewEl.innerHTML=mine.slice(0,3).map(taskRowHTML).join('') || '<p class="offers-empty">Zatím žádné úkoly u téhle etapy.</p>';
  if(tasksFullListEl) tasksFullListEl.innerHTML=mine.map(taskRowHTML).join('') || '<p class="offers-empty">Zatím žádné úkoly u téhle etapy.</p>';
  if(tasksViewAllBtn){
    tasksViewAllBtn.textContent=`Zobrazit všechny úkoly (${mine.length})`;
    tasksViewAllBtn.style.display=mine.length>3?'':'none';
  }
  const titleEl=document.querySelector('[data-tasks-stage-title]');
  if(titleEl) titleEl.textContent='Úkoly · '+(currentStageDisplayName());
  [tasksPreviewEl,tasksFullListEl].forEach(container=>{
    container?.querySelectorAll('[data-task-id]').forEach(row=>{
      row.addEventListener('click',()=>openTaskDetail(Number(row.dataset.taskId)));
    });
  });
}
function openTaskDetail(id){
  const t=tasksData.find(x=>x.id===id);
  if(!t) return;
  const prioButtons=priorityOrder.map(p=>
    `<button class="offer-status-pick priority-pick-${p}${p===t.priority?' is-active':''}" data-pick-priority="${p}">${priorityText[p]}</button>`
  ).join('');
  openSheet(`<div class="quick-form-top"><h2>${t.title}</h2><p>${t.date?('Termín: '+t.date):'Bez termínu'} · ${currentStageDisplayName()}</p></div><p class="offer-detail-label">Priorita</p><div class="offer-status-grid three-col">${prioButtons}</div><button class="ghost-wide" id="task-toggle-done">${t.done?'Vrátit mezi nedokončené':'Označit jako hotové'}</button><button class="ghost-wide" id="task-delete">Smazat úkol</button><button class="ghost-wide" data-close-detail>Zavřít</button>`);
  document.querySelectorAll('[data-pick-priority]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      t.priority=btn.dataset.pickPriority;
      renderTasks();
      closeQuickForm();
      showToast('Priorita změněna',`${t.title} → ${priorityText[t.priority]}`);
    });
  });
  document.getElementById('task-toggle-done')?.addEventListener('click',()=>{
    t.done=!t.done;
    renderTasks();
    closeQuickForm();
    showToast(t.done?'Úkol dokončen':'Úkol vrácen',t.title);
  });
  document.getElementById('task-delete')?.addEventListener('click',()=>{
    tasksData=tasksData.filter(x=>x.id!==id);
    renderTasks();
    closeQuickForm();
    showToast('Úkol smazán',`„${t.title}" byl odstraněn.`);
  });
}
function openTaskForm(){
  openSheet(`<div class="quick-form-top"><h2>Nový úkol</h2><p>Úkol se přidá jen k etapě „${currentStageDisplayName()}".</p></div><label class="form-field"><span>Název úkolu *</span><input id="task-form-title" placeholder="Název úkolu"></label><label class="form-field"><span>Termín (nepovinné)<i class="field-hint">Zobrazí se v kalendáři</i></span><input id="task-form-date" placeholder="Datum termínu"></label><p class="offer-detail-label">Priorita</p><div class="offer-status-grid three-col" id="task-form-priority"><button class="offer-status-pick priority-pick-low is-active" data-form-priority="low">Nízká</button><button class="offer-status-pick priority-pick-mid" data-form-priority="mid">Střední</button><button class="offer-status-pick priority-pick-high" data-form-priority="high">Vysoká</button></div><button class="primary-wide" id="task-form-save">Uložit úkol</button>`);
  let picked='low';
  document.querySelectorAll('[data-form-priority]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      picked=btn.dataset.formPriority;
      document.querySelectorAll('[data-form-priority]').forEach(b=>b.classList.toggle('is-active',b===btn));
    });
  });
  document.getElementById('task-form-save')?.addEventListener('click',()=>{
    const title=document.getElementById('task-form-title')?.value.trim();
    if(!title){ showToast('Chybí název','Napiš, co je potřeba udělat.'); return; }
    const date=document.getElementById('task-form-date')?.value.trim();
    const task={id:taskIdSeq++,stageId:currentStageId,title,date,priority:picked,done:false};
    tasksData.push(task);
    renderTasks();
    closeQuickForm();
    if(date){
      const added=addCalendarMarker(date,title,'orange','☑');
      showToast('Úkol uložen',added?'Termín byl zapsán do kalendáře.':'Termín zatím nebyl zapsán do kalendáře.');
    } else {
      showToast('Úkol uložen',`„${title}" je teď v seznamu úkolů etapy.`);
    }
  });
}
document.getElementById('task-add-btn')?.addEventListener('click',openTaskForm);
document.getElementById('tasks-add-btn-full')?.addEventListener('click',openTaskForm);
document.getElementById('tasks-view-all')?.addEventListener('click',()=>{ renderTasks(); go('tasks'); });
renderTasks();
tasksData.forEach(t=>{ if(t.date) addCalendarMarker(t.date,t.title,'orange','☑'); });

// =========================================================
// v0.39.0 — Projekt: reálné soubory, funkční složky, oblíbené
// =========================================================
const PROJECT_FOLDER_LABEL={drawings:'Výkresy',docs:'Dokumentace',favorites:'Oblíbené',custom:'Vlastní složky'};
let projectFilesData=[];
let projectFileIdSeq=1;
let currentProjectFolder=null;
let uploadTargetCategory='docs';

function fileThumbHTML(f){
  const ext=(f.name.split('.').pop()||'').toLowerCase();
  if(['jpg','jpeg','png','gif','webp'].includes(ext) && f.url){
    return `<img class="proj-file-thumb" src="${resolvePhotoRef(f.url)}" alt="">`;
  }
  return `<span class="proj-file-badge">${docTypeLabel(f.name)}</span>`;
}
function projectPreviewRowHTML(f){
  return `<button class="settings-row" data-file-id="${f.id}">${fileThumbHTML(f)}<div><b>${f.name}${f.favorite?' <i class="fav-star">★</i>':''}</b><small>${f.sizeLabel} · ${PROJECT_FOLDER_LABEL[f.category]}</small></div><em>›</em></button>`;
}
function projectFolderRowHTML(f){
  return `<article data-file-id="${f.id}">${fileThumbHTML(f)}<p>${f.name}</p><small>${f.sizeLabel}</small><button class="fav-toggle${f.favorite?' is-fav':''}" data-fav-id="${f.id}" title="Oblíbené">★</button></article>`;
}
function openProjectFile(id){
  const f=projectFilesData.find(x=>x.id===id);
  if(!f) return;
  if(!f.url){ showToast('Soubor nejde otevřít','Přidej vlastní reálný soubor.'); return; }
  openFilePreview(f.name,f.url);
}
function renderProjectFolderScreen(folder){
  currentProjectFolder=folder;
  const titleEl=document.getElementById('project-folder-title');
  if(titleEl) titleEl.textContent=PROJECT_FOLDER_LABEL[folder]||'Složka';
  const list=document.getElementById('project-folder-list');
  if(!list) return;
  const files=folder==='favorites' ? projectFilesData.filter(f=>f.favorite) : projectFilesData.filter(f=>f.category===folder);
  list.innerHTML=files.length ? files.map(projectFolderRowHTML).join('') : '<p class="offers-empty">Tahle složka je zatím prázdná.</p>';
  list.querySelectorAll('article[data-file-id]').forEach(row=>{
    row.addEventListener('click',e=>{
      if(e.target.closest('.fav-toggle')) return;
      openProjectFile(Number(row.dataset.fileId));
    });
  });
  list.querySelectorAll('.fav-toggle').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const f=projectFilesData.find(x=>x.id===Number(btn.dataset.favId));
      if(f){ f.favorite=!f.favorite; renderProjectFiles(); }
    });
  });
}
function renderProjectFiles(){
  const counts={drawings:0,docs:0,custom:0,favorites:0};
  projectFilesData.forEach(f=>{ counts[f.category]=(counts[f.category]||0)+1; if(f.favorite) counts.favorites++; });
  const set=(id,n,word)=>{ const el=document.getElementById(id); if(el) el.textContent=`${n} ${word}`; };
  set('folder-count-drawings',counts.drawings,'souborů');
  set('folder-count-docs',counts.docs,'souborů');
  set('folder-count-custom',counts.custom,'souborů');
  set('folder-count-favorites',counts.favorites,'položek');

  const preview=document.getElementById('project-files-preview');
  if(preview){
    const sorted=[...projectFilesData].sort((a,b)=>b.id-a.id).slice(0,3);
    preview.innerHTML=sorted.map(projectPreviewRowHTML).join('') || '<p class="offers-empty">Zatím žádné soubory.</p>';
    preview.querySelectorAll('[data-file-id]').forEach(row=>{
      row.addEventListener('click',()=>openProjectFile(Number(row.dataset.fileId)));
    });
  }
  if(currentProjectFolder) renderProjectFolderScreen(currentProjectFolder);
}
async function handleProjectFile(file,category){
  if(!file) return false;
  if(file.size>DOC_SIZE_LIMIT){
    showToast('Soubor je moc velký',`Limit je ${fmtSize(DOC_SIZE_LIMIT)}, „${file.name}" má ${fmtSize(file.size)}. Zkus ho zmenšit nebo vybrat jiný.`);
    return false;
  }
  const url=await fileToStoredImage(file);
  projectFilesData.unshift({id:projectFileIdSeq++,name:file.name,category:category||'docs',sizeLabel:`${docTypeLabel(file.name)} · ${fmtSize(file.size)}`,url,favorite:false});
  return true;
}
async function handleProjectFiles(fileList,category){
  const files=[...fileList];
  if(!files.length) return;
  let added=0, skipped=0;
  for(const file of files){
    const ok=await handleProjectFile(file,category);
    if(ok) added++; else skipped++;
  }
  renderProjectFiles();
  if(added && !skipped) showToast('Soubory přidány', files.length===1 ? `„${files[0].name}" je teď v projektu.` : `${added} souborů (celá složka) je teď v projektu.`);
  else if(added && skipped) showToast('Přidáno částečně', `${added} souborů se přidalo, ${skipped} bylo moc velkých — zkontroluj hlášky výše.`);
}
document.querySelectorAll('.project-folder').forEach(btn=>{
  btn.addEventListener('click',()=>{
    renderProjectFolderScreen(btn.dataset.folder);
    go('projectFolder');
  });
});
document.getElementById('project-file-input')?.addEventListener('change',e=>{
  handleProjectFiles(e.target.files,uploadTargetCategory);
  e.target.value='';
});
document.getElementById('project-add-btn')?.addEventListener('click',()=>{
  openSheet(`<div class="quick-form-top"><h2>Kam chceš soubor přidat?</h2><p>Vyber složku — pak se otevře fotoaparát nebo výběr souboru.</p></div>
    <button class="ghost-wide" data-upload-target="drawings">📐 Výkresy</button>
    <button class="ghost-wide" data-upload-target="docs">📄 Dokumentace</button>
    <button class="ghost-wide" data-upload-target="custom">🗂 Vlastní složky</button>
    <button class="ghost-wide" data-close-detail>Zrušit</button>`);
  document.querySelectorAll('[data-upload-target]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      uploadTargetCategory=btn.dataset.uploadTarget;
      closeQuickForm();
      document.getElementById('project-file-input')?.click();
    });
  });
});
document.getElementById('project-folder-add-btn')?.addEventListener('click',()=>{
  uploadTargetCategory=(currentProjectFolder&&currentProjectFolder!=='favorites')?currentProjectFolder:'docs';
  document.getElementById('project-file-input')?.click();
});
renderProjectFiles();

// =========================================================
// v0.42.0 — Martin: AI asistent appky (simulovaná inteligence,
// rozpoznávání vzorů + doptávání, striktně jen věci appky)
// =========================================================
const martinOverlay=document.getElementById('martin-overlay');
const martinMessages=document.getElementById('martin-messages');
let martinPending=null;
let martinStarted=false;

function martinNorm(s){
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function martinAddMessage(text,from){
  const el=document.createElement('div');
  el.className='martin-msg from-'+from;
  el.textContent=text;
  martinMessages.appendChild(el);
  martinMessages.scrollTop=martinMessages.scrollHeight;
}
function martinGreet(){
  if(martinStarted) return;
  martinStarted=true;
  martinAddMessage('Ahoj, jsem Martin 👋 Umím tě navigovat po appce nebo pomoct něco přidat. Zkus třeba "kde jsou fotky ze základů" nebo "přidej výdaj 2000 za hřebíky".','martin');
}

const MARTIN_STAGES={
  'zaklad':'foundation','zemni':'earthworks','povoleni':'project',
  'hruba stavba':'walls','strech':'roof','okna':'windows','dvere':'windows',
  'elektro':'electric','vod':'water','kanalizac':'water','vnitrni':'paint','zahrad':'garden',
};
function martinMatchStage(t){
  for(const key in MARTIN_STAGES){
    if(t.includes(key)){
      const id=MARTIN_STAGES[key];
      return {id,name:stageData[id]?.name||id};
    }
  }
  return null;
}

function martinFinishExpense(amount,desc,isDeposit){
  return {
    text:`Připravil jsem ${isDeposit?'vklad':'výdaj'} ${amount} Kč${desc?` za „${desc}"`:''} — zkontroluj a ulož.`,
    action:()=>{
      openQuickForm('transaction');
      const amountInput=[...document.querySelectorAll('.form-field input')].find(i=>i.closest('.form-field').querySelector('span')?.textContent.includes('Částka'));
      const nameInput=[...document.querySelectorAll('.form-field input')].find(i=>i.closest('.form-field').querySelector('span')?.textContent.includes('Název'));
      if(amountInput) amountInput.value=amount;
      if(desc && nameInput) nameInput.value=desc.charAt(0).toUpperCase()+desc.slice(1);
      if(isDeposit) document.querySelectorAll('.form-toggle button').forEach(b=>b.classList.toggle('is-active',b.textContent.trim()==='Vklad'));
    }
  };
}
function martinDoExpense(raw,isDeposit,fallbackDesc){
  const amountMatch=raw.match(/(\d[\d\s]{0,6})/);
  const amount=amountMatch?amountMatch[1].replace(/\s/g,''):null;
  const descMatch=raw.match(/za\s+([^,.]+)/i);
  let desc=descMatch?descMatch[1].trim():(fallbackDesc||null);
  if(desc) desc=desc.replace(/\s*(kc|korun[a-zě]*)\s*$/i,'').trim();
  if(!amount){
    // Zkusíme z původní věty vytáhnout, o čem to je (i bez "za"), ať se na
    // to Martin nemusí ptát znovu, až mu za chvíli napíšeš jen částku.
    let guess=fallbackDesc;
    if(!guess){
      const m=raw.match(/(?:n[aá]kup(?:u|em)?|nakoupit|koupil[a-zě]*|koupit|objednal[a-zě]*|objednat|objedn[aá]vk[a-zě]*)\s+([^,.]+)/i);
      guess=m?m[1].trim():null;
    }
    martinPending={type:'expense',isDeposit,desc:guess};
    return {text:isDeposit?'Kolik peněz vkládáš?':(guess?`Kolik stály ${guess}?`:'Kolik to bylo a za co? (např. „2000 za hřebíky")')};
  }
  return martinFinishExpense(amount,desc,isDeposit);
}

function martinFinishTask(title){
  return {
    text:`Připravil jsem úkol „${title}" — zkontroluj a ulož.`,
    action:()=>{ openTaskForm(); const el=document.getElementById('task-form-title'); if(el) el.value=title.charAt(0).toUpperCase()+title.slice(1); }
  };
}
function martinDoTask(raw){
  const m=raw.match(/úkol[a-zě]*\s*[:\-]?\s*(.+)/i);
  let title=m?m[1].trim().replace(/^(na|s tim,?|ze|abych?)\s+/i,'').trim():null;
  if(!title||title.length<3){ martinPending={type:'task'}; return {text:'Co je potřeba udělat?'}; }
  return martinFinishTask(title);
}

function martinFinishOffer(name){
  return {
    text:`Připravil jsem nabídku „${name}" — doplň firmu a cenu, pak ulož.`,
    action:()=>{ openOfferForm(); const el=document.getElementById('offer-form-name'); if(el) el.value=name.charAt(0).toUpperCase()+name.slice(1); }
  };
}
function martinDoOffer(raw){
  const m=raw.match(/nabídk[a-zě]*\s+(?:na|od|za)?\s*(.+)/i);
  const name=m?m[1].trim():null;
  if(!name||name.length<3){ martinPending={type:'offer'}; return {text:'Od koho nebo na co je ta nabídka?'}; }
  return martinFinishOffer(name);
}

function martinFinishEntry(text){
  return {
    text:'Připravil jsem zápis do deníku — zkontroluj a ulož.',
    action:()=>{ openQuickForm('entry'); const el=document.querySelector('.form-field textarea'); if(el) el.value=text.charAt(0).toUpperCase()+text.slice(1); }
  };
}
function martinDoEntry(raw){
  const m=raw.match(/zápis[a-zě]*\s+(?:do deník[a-zě]*)?\s*[:\-]?\s*(.+)/i);
  const text=m?m[1].trim():null;
  if(!text||text.length<4){ martinPending={type:'entry'}; return {text:'Co se dnes na stavbě dělo? Napiš mi to a přidám to do deníku.'}; }
  return martinFinishEntry(text);
}

function martinFindGallery(t,raw){
  const stage=martinMatchStage(t);
  if(stage){
    return {text:`Tady jsou fotky etapy „${stage.name}".`,action:()=>openGallery('stage',stage.name)};
  }
  return {text:'Ukazuju všechny fotky. Chceš jen z konkrétní etapy? Napiš mi její název.',action:()=>openGallery('dashboard')};
}
function martinFindStage(t){
  const stage=martinMatchStage(t);
  if(stage){
    return {text:`Otevírám etapu „${stage.name}".`,action:()=>openStage(stage.id)};
  }
  return {text:'Otevírám seznam etap.',action:()=>go('stages')};
}
function martinGoto(screen,msg,rerenderFn){
  return {text:msg,action:()=>{ go(screen); if(rerenderFn) rerenderFn(); }};
}

function martinParse(raw){
  const t=martinNorm(raw);

  if(martinPending){
    const p=martinPending; martinPending=null;
    if(p.type==='expense') return martinDoExpense(raw,p.isDeposit,p.desc);
    if(p.type==='task') return martinFinishTask(raw.trim());
    if(p.type==='offer') return martinFinishOffer(raw.trim());
    if(p.type==='entry') return martinFinishEntry(raw.trim());
    if(p.type==='confirm-nav'){
      if(/^(ano|jo|jasne|urcite|klidne|presmeruj|otevri|prosim)/.test(t)) return {text:'Jasně, přesměrovávám tě tam.', action:p.action};
      return {text:'Dobře, nechávám tě tady. Kdyby ses rozmyslel/a, stačí napsat znovu.'};
    }
  }

  // --- PŘIDAT ---
  // Silná slova o nákupu (nákup, koupil, objednal, faktura...) spustí výdaj
  // sama o sobě — i bez čísla nebo slova "výdaj". Slabší slova (přidej,
  // zaplatil, stojí...) potřebují ještě číslo nebo výslovné "Kč"/"výdaj",
  // ať si Martin nesplete třeba "přidej úkol" s výdajem.
  const martinStrongPurchase=/nakup|nakoupit|koupil|koupit|objednal|objednat|objednavk|faktur|ucetenk|dodal[a-zě]* material/;
  const martinGenericAdd=/prid|zapis|zaps|utrati|zaplatil|stoji|potreb/;
  const martinExpenseNoun=/vydaj|kc\b|korun|castk/;
  const martinHasNumber=/\d/.test(t);
  if(!/vklad/.test(t) && (martinStrongPurchase.test(t) || (martinGenericAdd.test(t) && (martinExpenseNoun.test(t) || martinHasNumber)))) return martinDoExpense(raw,false);
  if(/prid|zapis|zaps|vloz/.test(t) && /vklad/.test(t)) return martinDoExpense(raw,true);
  if(/prid|novy|nova|musim|nezapomenout/.test(t) && /ukol/.test(t)) return martinDoTask(raw);
  if(/prid|novy|nova/.test(t) && /nabidk/.test(t)) return martinDoOffer(raw);
  if(/prid|novy|nova|zapis|zaps/.test(t) && /denik/.test(t)) return martinDoEntry(raw);

  // --- NAJÍT / NAVIGOVAT ---
  if(/fotk|galeri/.test(t)) return martinFindGallery(t,raw);
  if(/etap/.test(t)) return martinFindStage(t);
  if(/ukol/.test(t)) return martinGoto('tasks','Otevírám úkoly aktuální etapy.',()=>typeof renderTasks==='function'&&renderTasks());
  if(/nabidk/.test(t)) return martinGoto('offers','Otevírám nabídky aktuální etapy.');
  if(/dokument/.test(t) && !/projekt/.test(t)) return martinGoto('documents','Otevírám dokumenty aktuální etapy.');
  if(/kalendar|udalost/.test(t)) return martinGoto('calendar','Otevírám kalendář.');
  if(/nastaveni/.test(t)) return martinGoto('settings','Otevírám nastavení.');
  if(/projekt/.test(t)) return martinGoto('project','Otevírám Projekt.');
  if(/denik|zapis/.test(t)) return martinGoto('diary','Otevírám stavební deník.');
  if(/transakc|vydaj|vklad|financ|penize|zustatek/.test(t)) return martinGoto('transactions','Otevírám Transakce.');

  if(/^(ahoj|dobry den|cau|hej)/.test(t)) return {text:'Ahoj! Zkus mi třeba řict "kde jsou fotky" nebo "přidej výdaj 500 za lepidlo".'};
  if(/dekuj/.test(t)) return {text:'Rádo se stalo! 🙂'};

  // --- Poslední pokus: shoduje se dotaz s něčím, co už v projektu
  // reálně existuje (naplánovaná událost, uložená transakce)? Pokud
  // ano, zeptáme se, jestli tam Martin má přesměrovat, místo aby
  // rovnou přiznal, že neví.
  const dataMatch=martinFindInProjectData(raw,t);
  if(dataMatch) return dataMatch;

  return {text:'Tohle bohužel ještě neumím. Umím tě navigovat po appce (etapy, deník, fotky, transakce, kalendář, úkoly, nabídky...) nebo pomoct něco přidat (výdaj, úkol, nabídku, zápis). Zkus to zkusit jinak.'};
}
function martinFindInProjectData(raw,t){
  if(t.length<3) return null;
  const words=t.split(/\s+/).filter(w=>w.length>3);
  const matches=(hay)=>{
    const h=(hay||'').toLowerCase();
    if(!h) return false;
    return h.includes(t) || t.includes(h) || words.some(w=>h.includes(w));
  };
  const events=(typeof getCurrentProjectEvents==='function'?getCurrentProjectEvents():[]);
  const ev=events.find(e=>matches(martinNorm(e.title||'')));
  if(ev){
    martinPending={type:'confirm-nav',action:()=>openEventDetail(ev)};
    return {text:`Našel jsem naplánovanou událost „${ev.title}" (${ev.dateLabel}). Chceš, ať tě tam přesměruju?`};
  }
  const tx=getCurrentProjectTx().find(x=>matches(martinNorm(x.name||'')) || matches(martinNorm(x.company||'')));
  if(tx){
    martinPending={type:'confirm-nav',action:()=>{go('transactions');openTransactionDetail(tx.id);}};
    return {text:`Našel jsem transakci „${tx.name}" (${money(tx.amount)}). Chceš, ať ji otevřu?`};
  }
  const entries=(typeof getCurrentProjectEntries==='function'?getCurrentProjectEntries():[]);
  const en=entries.find(e=>matches(martinNorm(e.text||'')));
  if(en){
    martinPending={type:'confirm-nav',action:()=>openEntry(en.id,'diary')};
    return {text:`Našel jsem zápis v deníku, co zmiňuje podobnou věc (${en.dateLabel}). Chceš, ať ho otevřu?`};
  }
  return null;
}

function martinHandleUserText(raw){
  martinAddMessage(raw,'user');
  const result=martinParse(raw);
  setTimeout(()=>{
    martinAddMessage(result.text,'martin');
    if(result.action){
      setTimeout(()=>{ martinOverlay?.classList.remove('open'); result.action(); },900);
    }
  },350);
}
const martinCardEl=document.querySelector('.martin-card');
function positionMartinCard(){
  if(!martinCardEl || !martinOverlay?.classList.contains('open')) return;
  if(window.visualViewport){
    const vv=window.visualViewport;
    const topGap=Math.max(vv.offsetTop + vv.height*0.05, 54);
    const bottomGap=10;
    martinCardEl.style.top=topGap+'px';
    martinCardEl.style.height=Math.max(Math.min(vv.height-topGap-bottomGap,460),260)+'px';
  } else {
    martinCardEl.style.top='';
    martinCardEl.style.height='';
  }
}
document.getElementById('martin-toggle')?.addEventListener('click',()=>{
  closeAllOverlays('#martin-overlay');
  martinOverlay?.classList.add('open');
  martinGreet();
  positionMartinCard();
  document.getElementById('martin-input')?.focus();
});
if(window.visualViewport){
  window.visualViewport.addEventListener('resize',()=>{
    if(martinOverlay?.classList.contains('open')){
      positionMartinCard();
      martinMessages.scrollTop=martinMessages.scrollHeight;
    }
  });
  window.visualViewport.addEventListener('scroll',()=>{
    if(martinOverlay?.classList.contains('open')) positionMartinCard();
  });
}
document.getElementById('martin-input')?.addEventListener('focus',()=>{
  setTimeout(()=>{ positionMartinCard(); martinMessages.scrollTop=martinMessages.scrollHeight; },300);
});
document.getElementById('martin-close')?.addEventListener('click',()=>martinOverlay?.classList.remove('open'));
document.getElementById('martin-close-bg')?.addEventListener('click',()=>martinOverlay?.classList.remove('open'));
document.getElementById('martin-input-row')?.addEventListener('submit',e=>{
  e.preventDefault();
  const input=document.getElementById('martin-input');
  const val=input.value.trim();
  if(!val) return;
  input.value='';
  martinHandleUserText(val);
});
document.querySelectorAll('[data-chip]').forEach(btn=>{
  btn.addEventListener('click',()=>martinHandleUserText(btn.dataset.chip));
});

document.getElementById('stage-detail-trans-all')?.addEventListener('click',()=>{
  const name=currentStageDisplayName();
  transBackTarget='stageDetail';
  go('transactions');
  activeTransStage=name||activeTransStage;
  document.querySelector('[data-trans-selected-stage]').textContent=activeTransStage;
  applyTransFilter('stage');
});
document.querySelectorAll('.section-head button').forEach(btn=>{
  if(btn.textContent.includes('Přidat nabídku')) btn.addEventListener('click',openOfferForm);
});

document.addEventListener('click',e=>{
if(e.target.closest('[data-save-offer]')){
    const name=document.getElementById('offer-form-name')?.value.trim()||'Nová nabídka';
    const company=document.getElementById('offer-form-company')?.value.trim()||'';
    const priceRaw=document.getElementById('offer-form-price')?.value||'0';
    const price=Number(priceRaw.replace(/[^\d]/g,''))||0;
    const validity=document.getElementById('offer-form-validity')?.value.trim()||'';
    const statusLabel=document.getElementById('offer-form-status-label')?.textContent||'Čeká';
    const statusMap={'Čeká':'waiting','K porovnání':'comparing','Přijato':'accepted','Odmítnuto':'rejected'};
    offersData.unshift({id:offerIdSeq++,name,company,price,validity,status:statusMap[statusLabel]||'waiting'});
    renderOffers();
    closeQuickForm();
    if(validity){
      const added=addOfferToCalendar(validity,name);
      if(added) showToast('Nabídka uložena','Platnost byla zapsána do kalendáře.');
      else showToast('Nabídka uložena','Platnost zatím nebyla zapsána do kalendáře.');
    } else {
      showToast('Nabídka uložena','Nabídka se zobrazí pouze v aktuální etapě.');
    }
  }
  if(e.target.closest('[data-close-detail]')) closeQuickForm();
});

// Projekt menu – nový projekt má reakci
projectMenu?.querySelector('.new-project')?.addEventListener('click',()=>{
  projectMenu.classList.remove('open');
  openSheet(`<div class="quick-form-top"><h2>Nový projekt</h2><p>Každý projekt má vlastní etapy, den stavby i lokalitu. Datum zahájení zadáš později přímo na dashboardu.</p></div><label class="form-field"><span>Název projektu *<i id="np-name-count">0/22</i></span><input id="np-name" maxlength="22" placeholder="např. Garáž"></label><label class="form-field"><span>Typ projektu</span>${typePillsHTML('np','')}</label><label class="form-field"><span>Lokalita</span><input id="np-location" maxlength="28" placeholder="např. Malé Březno"></label><button class="primary-wide" id="np-save" disabled>Vytvořit projekt</button>`);
  wireTypePills('np');
  const nameInput=document.getElementById('np-name');
  const count=document.getElementById('np-name-count');
  const save=document.getElementById('np-save');
  nameInput?.addEventListener('input',()=>{count.textContent=nameInput.value.length+'/22';save.disabled=nameInput.value.trim().length===0;});
  save?.addEventListener('click',()=>{
    const name=nameInput.value.trim();
    if(!name) return;
    persistCurrentStages();
    const p=ProjectStore.create({
      name,
      location:document.getElementById('np-location').value.trim(),
      type:getTypeValue('np'),
    });
    applyCurrentProjectToUI();
    closeQuickForm();
    showToast('Projekt založen',`„${p.name}" je teď aktivní projekt.`);
  });
});

// Stop bubbling u interaktivních řádků, kde je lepší zachovat detail

// =========================================================
// v0.16.0 — Onboarding prvního projektu + funkční exporty (PDF)
// =========================================================

// --- Pomocné čtení dat z DOMu (mock data appky) ---
// Vestavěné fonty jsPDF (Helvetica...) neumí písmena s háčkem/čárkou
// (ř, č, ž, š, ě, ď, ť, ň) - bez zásahu se v PDF tisknou jako nesmysly.
// Zaregistrujeme místo nich DejaVu Sans (ořezanou jen na potřebné znaky).
function registerPdfFont(doc){
  if(typeof PDF_FONT_REGULAR_B64==='undefined') return false;
  try{
    doc.addFileToVFS('DejaVuSans.ttf', PDF_FONT_REGULAR_B64);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', PDF_FONT_BOLD_B64);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');
    doc.setFont('DejaVuSans','normal');
    return true;
  }catch(err){ return false; }
}
// --- Sdílená "sada nástrojů" pro hezčí PDF výstupy (Souhrn ke sdílení,
// Kronika stavby) — jednotné barevné nadpisy sekcí, zarovnané částky,
// a spolehlivé vkládání fotek přímo z uložených dat (base64), takže
// fotka/účtenka může sedět přímo u zápisu/výdaje, ke kterému patří,
// místo aby skončila v jedné odtržené hromadě na konci dokumentu.
const PDF_COLORS={
  cyan:[37,168,214], purple:[150,76,214], green:[46,168,110],
  orange:[214,132,40], red:[214,70,90], ink:[26,28,36], muted:[120,126,145], line:[224,227,235],
};
function makePdfToolkit(doc, opts={}){
  const fontOK=registerPdfFont(doc);
  const marginX=opts.marginX||18;
  const maxY=opts.maxY||280;
  const pageW=doc.internal.pageSize.getWidth();
  const st={y:opts.startY||20};
  function boldFont(){ try{ doc.setFont(fontOK?'DejaVuSans':'helvetica','bold'); }catch(e){ doc.setFont('helvetica','bold'); } }
  function normalFont(){ try{ doc.setFont(fontOK?'DejaVuSans':'helvetica','normal'); }catch(e){ doc.setFont('helvetica','normal'); } }
  function ensureSpace(need){ if(st.y+need>maxY){ doc.addPage(); st.y=20; } }
  function coverHeader(title, name, subtitle, tone='purple'){
    const c=PDF_COLORS[tone]||PDF_COLORS.purple;
    doc.setFillColor(...c); doc.rect(0,0,pageW,7,'F');
    st.y=22;
    doc.setFontSize(11); boldFont(); doc.setTextColor(...c);
    doc.text(title.toUpperCase(),marginX,st.y); st.y+=9;
    doc.setFontSize(21); boldFont(); doc.setTextColor(...PDF_COLORS.ink);
    doc.text(name||'Moje stavba',marginX,st.y); st.y+=8;
    doc.setFontSize(10.5); normalFont(); doc.setTextColor(...PDF_COLORS.muted);
    const wrapped=doc.splitTextToSize(subtitle||'',pageW-marginX*2);
    doc.text(wrapped,marginX,st.y); st.y+=wrapped.length*5+8;
  }
  function sectionHeading(text, tone='cyan'){
    ensureSpace(15);
    const c=PDF_COLORS[tone]||PDF_COLORS.cyan;
    doc.setFillColor(...c); doc.roundedRect(marginX, st.y-4.6, 3, 6.4, 0.8, 0.8, 'F');
    doc.setFontSize(12.5); boldFont(); doc.setTextColor(...PDF_COLORS.ink);
    doc.text(text, marginX+6, st.y); st.y+=4.5;
    doc.setDrawColor(...PDF_COLORS.line); doc.setLineWidth(0.3);
    doc.line(marginX, st.y, pageW-marginX, st.y); st.y+=6.5;
  }
  function para(text, o={}){
    const size=o.size||10, color=o.color||PDF_COLORS.ink, bold=!!o.bold;
    const maxWidth=o.maxWidth||(pageW-marginX*2), x=o.x||marginX, lh=o.lh||5;
    ensureSpace(lh+2);
    doc.setFontSize(size); bold?boldFont():normalFont(); doc.setTextColor(...color);
    const wrapped=doc.splitTextToSize(text||'', maxWidth);
    doc.text(wrapped, x, st.y);
    st.y += wrapped.length*lh;
    return wrapped.length*lh;
  }
  function rightAligned(text, y, o={}){
    const size=o.size||10, color=o.color||PDF_COLORS.ink, bold=o.bold!==false;
    doc.setFontSize(size); bold?boldFont():normalFont(); doc.setTextColor(...color);
    const w=doc.getTextWidth(text);
    doc.text(text, pageW-marginX-w, y);
  }
  function dot(color, y, r=1.3){
    doc.setFillColor(...color); doc.circle(marginX+1.3, y-1.3, r, 'F');
  }
  function embedImage(url, x, y, w, h){
    try{ doc.addImage(url, x, y, w, h); return true; }
    catch(err){
      try{ doc.addImage(url,'JPEG', x, y, w, h); return true; }
      catch(err2){ return false; }
    }
  }
  function photoRow(photos, maxCount=3, thumbW=32, thumbH=24, gap=4){
    if(!photos || !photos.length) return;
    const list=photos.slice(0,maxCount);
    ensureSpace(thumbH+4);
    let x=marginX;
    list.forEach(p=>{
      const url = typeof p==='string' ? p : p.url;
      if(url && embedImage(url, x, st.y-thumbH+3, thumbW, thumbH)) x+=thumbW+gap;
    });
    st.y += thumbH+5;
  }
  return {doc, st, fontOK, boldFont, normalFont, ensureSpace, coverHeader, sectionHeading, para, rightAligned, dot, embedImage, photoRow, marginX, pageW, maxY};
}
function getProjectInfo(){
  return {
    name: document.querySelector('[data-bind-name]')?.textContent.trim() || 'Moje stavba',
    location: document.querySelector('[data-bind-location]')?.textContent.trim() || '',
    day: document.querySelector('.day-box strong')?.textContent.trim() || '',
  };
}
function getStagesData(){
  return [...document.querySelectorAll('.stage-row')].map(row=>({
    name: row.querySelector('h2')?.textContent.trim()||'',
    status: row.querySelector('p')?.textContent.trim()||'',
    money: (row.querySelector('.stage-money')?.textContent||'0 Kč').trim(),
  }));
}
function getDiaryEntries(){
  return [...document.querySelectorAll('.diary-entry')].map(e=>({
    entryId: e.dataset.entryId||'',
    date: e.querySelector('time')?.textContent.trim()||'',
    dateObj: e.dataset.dateIso ? new Date(e.dataset.dateIso) : null,
    title: e.querySelector('h2')?.textContent.trim()||'',
    meta: [...e.querySelectorAll('.entry-meta span')].map(s=>s.textContent.trim()).join(' - '),
    stage: e.dataset.stage||'Bez etapy',
    photos: [...e.querySelectorAll('.entry-photos img')],
  }));
}
function getTransactionsData(){
  return [...document.querySelectorAll('.transaction-row')].map(r=>({
    name: r.querySelector('strong')?.textContent.trim()||'',
    meta: r.querySelector('small')?.textContent.trim()||'',
    amount: (r.querySelector('b')?.textContent||'').trim(),
    type: r.dataset.type||'',
  }));
}
function pdfAddPhotos(doc, startY){
  const imgs=[...document.querySelectorAll('.gallery-tile img')].slice(0,8);
  if(!imgs.length) return;
  doc.addPage();
  doc.setFontSize(16);doc.text('Fotky ze stavby',20,20);
  let px=20, py=30, pw=82, ph=58;
  imgs.forEach((img,i)=>{
    try{
      const canvas=document.createElement('canvas');
      canvas.width=img.naturalWidth||400; canvas.height=img.naturalHeight||300;
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      doc.addImage(canvas.toDataURL('image/jpeg',0.85),'JPEG',px,py,pw,ph);
    }catch(err){ /* obrázek se nepodařilo vykreslit do PDF (např. CORS) - přeskočit */ }
    px+=pw+8;
    if(px>150){px=20;py+=ph+8;}
    if(py>220 && i<imgs.length-1){doc.addPage();px=20;py=20;}
  });
}

// --- Kronika stavby PDF (komplexní souhrn) ---
function buildKronikaPDF(){
  if(!window.jspdf){showToast('PDF se nepodařilo vytvořit','Knihovna pro PDF se nenačetla — zkontroluj připojení k internetu.');return;}
  const {jsPDF}=window.jspdf;
  const project=ProjectStore.current();
  const info=getProjectInfo();
  const doc=new jsPDF();
  const t=makePdfToolkit(doc);
  const {st,para,sectionHeading,rightAligned,dot,photoRow,ensureSpace,marginX,pageW}=t;

  t.coverHeader('Kronika stavby', info.name,
    `${info.location||''}${info.location?'  ·  ':''}Den stavby: ${info.day||'—'}\nVytvořeno ${formatDateCZ(ProjectStore.todayISO())} appkou Moje Stavba`,
    'purple');

  sectionHeading('Etapy', 'purple');
  const stageRows=visibleStageRows();
  if(!stageRows.length) para('Zatím žádné etapy.', {color:PDF_COLORS.muted});
  stageRows.forEach(rw=>{
    const name=rw.querySelector('h2')?.textContent||'';
    const status=rw.querySelector('p')?.textContent?.trim()||'Nezahájeno';
    const spent=(rw.querySelector('.stage-money')?.textContent?.trim()||'0 Kč').replace(/[\u00A0\u202F\u2009]/g,' ');
    const isDone=rw.classList.contains('done');
    const isCurrent=rw.classList.contains('stage-current');
    const dotColor = isDone?PDF_COLORS.green : isCurrent?PDF_COLORS.purple : PDF_COLORS.muted;
    ensureSpace(7);
    dot(dotColor, st.y+1.6);
    t.doc.setFontSize(10.5); t.boldFont(); t.doc.setTextColor(...PDF_COLORS.ink);
    t.doc.text(name, marginX+6, st.y);
    t.doc.setFontSize(9); t.normalFont(); t.doc.setTextColor(...PDF_COLORS.muted);
    t.doc.text(status, marginX+6, st.y+4.2);
    rightAligned(spent, st.y, {size:10.5, color:PDF_COLORS.ink});
    st.y+=10;
  });
  st.y+=4;

  // Příběh stavby: zápisy z deníku chronologicky od nejstaršího,
  // s fotkami rovnou u zápisu, ke kterému patří.
  sectionHeading('Příběh stavby', 'cyan');
  const entries=getCurrentProjectEntries().slice().sort((a,b)=>(a.dateISO||'').localeCompare(b.dateISO||''));
  if(!entries.length) para('Zatím žádné zápisy v deníku.', {color:PDF_COLORS.muted});
  entries.forEach(e=>{
    ensureSpace(11);
    t.doc.setFillColor(...PDF_COLORS.cyan); t.doc.rect(marginX, st.y-3.6, 1, 9, 'F');
    t.doc.setFontSize(10.5); t.boldFont(); t.doc.setTextColor(...PDF_COLORS.ink);
    t.doc.text(`${e.dateLabel||e.dateISO}  -  ${e.stage||'Bez etapy'}`, marginX+5, st.y);
    st.y+=5.5;
    if(e.text && !e.hiddenFromDiary) para(e.text, {size:9.8, color:[80,84,98], x:marginX+5, maxWidth:pageW-marginX*2-5});
    if(e.workType || e.workers){
      para([e.workType,e.workers].filter(Boolean).join('  -  '), {size:9, color:PDF_COLORS.muted, x:marginX+5});
    }
    const photos=(e.photos||[]).map(p=>resolvePhotoRef(p.url)).filter(Boolean);
    if(photos.length) photoRow(photos, 3, 34, 25);
    st.y+=3;
  });
  st.y+=2;

  sectionHeading('Finance', 'green');
  const tx=getCurrentProjectTx();
  const totalExpense=tx.filter(tr=>tr.type==='expense').reduce((s,tr)=>s+Number(tr.amount||0),0);
  const totalIncome=tx.filter(tr=>tr.type==='income').reduce((s,tr)=>s+Number(tr.amount||0),0);
  ensureSpace(10);
  t.doc.setFontSize(10.5); t.boldFont(); t.doc.setTextColor(...PDF_COLORS.green);
  t.doc.text(`Vklady: ${moneyPdf(totalIncome)}`, marginX, st.y);
  t.doc.setTextColor(...PDF_COLORS.red);
  t.doc.text(`Výdaje: ${moneyPdf(totalExpense)}`, marginX+75, st.y);
  t.doc.setTextColor(...PDF_COLORS.ink);
  t.doc.text(`Zůstatek: ${moneyPdf(totalIncome-totalExpense)}`, marginX+150, st.y);
  st.y+=9;
  if(!tx.length) para('Zatím žádné transakce.', {color:PDF_COLORS.muted});
  tx.slice().sort((a,b)=>(a.dateISO||'').localeCompare(b.dateISO||'')).forEach(tr=>{
    const sign=tr.type==='income'?'+':'-';
    const thumb=resolvePhotoRef(tr.receipt || (tr.photos&&tr.photos[0]&&tr.photos[0].url));
    ensureSpace(9);
    t.doc.setFontSize(10); t.normalFont(); t.doc.setTextColor(...PDF_COLORS.ink);
    t.doc.text(`${tr.dateLabel||tr.dateISO}  -  ${tr.name}${tr.company?` (${tr.company})`:''}`, marginX, st.y);
    rightAligned(`${sign}${moneyPdf(tr.amount)}`, st.y, {size:10, color: tr.type==='income'?PDF_COLORS.green:PDF_COLORS.red});
    st.y+=6;
    if(thumb){ t.embedImage(thumb, marginX, st.y-4.5, 10, 10); st.y+=7; }
  });

  doc.save('Kronika_stavby.pdf');
  showToast('Kronika vygenerována','Kompletní příběh stavby byl stažen jako PDF.');
}

// --- Finance PDF (volitelné sekce) ---
function buildFinancePDF(opts){
  if(!window.jspdf){showToast('PDF se nepodařilo vytvořit','Knihovna pro PDF se nenačetla — zkontroluj připojení k internetu.');return;}
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const fontOK=registerPdfFont(doc);
  const boldFont=()=>{ try{ doc.setFont(fontOK?"DejaVuSans":"helvetica","bold"); }catch(e){ doc.setFont("helvetica","bold"); } };
  const normalFont=()=>{ try{ doc.setFont(fontOK?"DejaVuSans":"helvetica","normal"); }catch(e){ doc.setFont("helvetica","normal"); } };
  const info=getProjectInfo();
  let y=22;
  doc.setFontSize(22);doc.text('Přehled financí',20,y);y+=9;
  doc.setFontSize(12);doc.text(info.name+(info.location?' - '+info.location:''),20,y);y+=12;

  const txs=getTransactionsData();
  const toNumber=s=>parseInt(String(s).replace(/[^\d-]/g,''),10)||0;

  if(opts.summary){
    const balance=document.querySelector('#trans-summary h2')?.textContent.trim()||'';
    const expenses=txs.filter(t=>t.type==='expense').reduce((a,t)=>a+Math.abs(toNumber(t.amount)),0);
    const incomes=txs.filter(t=>t.type==='income').reduce((a,t)=>a+toNumber(t.amount),0);
    doc.setFontSize(15);doc.text('Celkový přehled',20,y);y+=8;
    doc.setFontSize(11);
    doc.text(`Aktuální zůstatek: ${balance}`,20,y);y+=6;
    doc.text(`Celkem vklady: ${incomes.toLocaleString('cs-CZ')} Kč`,20,y);y+=6;
    doc.text(`Celkem výdaje: ${expenses.toLocaleString('cs-CZ')} Kč`,20,y);y+=10;
  }
  if(opts.byStage){
    doc.setFontSize(15);doc.text('Rozpis po etapách',20,y);y+=8;
    doc.setFontSize(11);
    getStagesData().forEach(s=>{
      if(y>275){doc.addPage();y=20;}
      doc.text(`${s.name}: ${s.money}`,20,y);y+=6;
    });
    y+=6;
  }
  if(opts.transactions){
    doc.setFontSize(15);doc.text('Seznam transakcí',20,y);y+=8;
    doc.setFontSize(10);
    txs.forEach(t=>{
      if(y>275){doc.addPage();y=20;}
      doc.text(`${t.meta}   ${t.name}   ${t.amount}`,20,y);y+=6;
    });
  }
  doc.save('Finance_prehled.pdf');
  showToast('Finance vygenerovány','Přehled byl stažen jako PDF.');
}

// --- Deník PDF (kompletní / po etapách / jedna etapa) ---
function buildDiaryPDF(mode, stage, dayId, rangeFrom, rangeTo){
  if(!window.jspdf){showToast('PDF se nepodařilo vytvořit','Knihovna pro PDF se nenačetla — zkontroluj připojení k internetu.');return;}
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const fontOK=registerPdfFont(doc);
  const boldFont=()=>{ try{ doc.setFont(fontOK?"DejaVuSans":"helvetica","bold"); }catch(e){ doc.setFont("helvetica","bold"); } };
  const normalFont=()=>{ try{ doc.setFont(fontOK?"DejaVuSans":"helvetica","normal"); }catch(e){ doc.setFont("helvetica","normal"); } };
  const info=getProjectInfo();
  let y=22;
  doc.setFontSize(20);doc.text('Stavební deník',20,y);y+=9;
  doc.setFontSize(11);doc.text(info.name+(info.location?' - '+info.location:''),20,y);y+=12;

  let entries=getDiaryEntries().sort((a,b)=>(a.dateObj&&b.dateObj)?a.dateObj-b.dateObj:0);
  if(mode==='one-stage') entries=entries.filter(e=>e.stage===stage);
  if(mode==='one-day') entries=entries.filter(e=>e.entryId===dayId);
  if(mode==='range' && rangeFrom && rangeTo){
    const from=new Date(rangeFrom), to=new Date(rangeTo);
    entries=entries.filter(e=>e.dateObj && e.dateObj>=from && e.dateObj<=to);
  }

  function writeEntry(e){
    if(y>255){doc.addPage();y=20;}
    doc.setFillColor(48,233,255);doc.rect(20,y-3.5,1.2,13,'F');
    doc.setFont('DejaVuSans','bold');doc.setFontSize(10.5);doc.text(`${e.date} — ${e.title}`,24,y);y+=5;
    doc.setFont('DejaVuSans','normal');doc.setFontSize(9.5);doc.setTextColor(90);
    const lines=doc.splitTextToSize(e.meta,166);
    doc.text(lines,24,y);doc.setTextColor(0);y+=lines.length*5+3;
    if(e.photos&&e.photos.length){
      try{
        const img=e.photos[0];
        const canvas=document.createElement('canvas');
        canvas.width=img.naturalWidth||400; canvas.height=img.naturalHeight||300;
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        if(y>240){doc.addPage();y=20;}
        doc.addImage(canvas.toDataURL('image/jpeg',0.85),'JPEG',24,y,60,42);
        y+=48;
      }catch(err){ y+=2; }
    } else { y+=4; }
  }

  if(mode==='by-stage'){
    const groups={};
    entries.forEach(e=>{(groups[e.stage]=groups[e.stage]||[]).push(e);});
    Object.keys(groups).forEach(stageName=>{
      if(y>250){doc.addPage();y=20;}
      doc.setFontSize(14);doc.text(stageName,20,y);y+=8;
      groups[stageName].forEach(writeEntry);
      y+=4;
    });
  } else {
    entries.forEach(writeEntry);
  }

  if(!entries.length){doc.setFontSize(11);doc.text('Pro vybranou volbu nejsou k dispozici žádné zápisy.',20,y);}
  doc.save('Stavebni_denik.pdf');
  showToast('Deník vygenerován','PDF deníku bylo staženo do zařízení.');
}

// --- Propojení tlačítek ---
function wireOverlay(overlayId, closeBtnId, closeBgId){
  const overlay=document.getElementById(overlayId);
  document.getElementById(closeBtnId)?.addEventListener('click',()=>overlay?.classList.remove('open'));
  document.getElementById(closeBgId)?.addEventListener('click',()=>overlay?.classList.remove('open'));
  return overlay;
}
const diaryExportOverlay=wireOverlay('diary-export-overlay','diary-export-close','diary-export-close-bg');
const financeExportOverlay=wireOverlay('finance-export-overlay','finance-export-close','finance-export-close-bg');

document.getElementById('export-kronika')?.addEventListener('click',buildKronikaPDF);
document.getElementById('export-finance')?.addEventListener('click',()=>{closeAllOverlays('#finance-export-overlay');financeExportOverlay?.classList.add('open');});
document.getElementById('diary-export-open')?.addEventListener('click',()=>{
  closeAllOverlays('#diary-export-overlay');
  const wrap=document.getElementById('diary-export-stage-wrap');
  if(wrap){
    const names=visibleStageRows().map(r=>r.querySelector('h2')?.textContent).filter(Boolean);
    wrap.innerHTML = names.length ? stagePillsHTML('diary-export-stage', names, names[0]) : '<p class="empty-hint">Žádná etapa k dispozici</p>';
    wireStagePills('diary-export-stage');
  }
  diaryExportOverlay?.classList.add('open');
});

document.querySelectorAll('input[name="diary-export-mode"]').forEach(r=>{
  r.addEventListener('change',()=>{
    const checked=document.querySelector('input[name="diary-export-mode"]:checked')?.value;
    const wrap=document.getElementById('diary-export-stage-wrap');
    if(wrap) wrap.style.display = checked==='one-stage' ? '' : 'none';
    document.getElementById('diary-export-range').style.display = checked==='range'?'grid':'none';
  });
});
document.getElementById('diary-export-go')?.addEventListener('click',()=>{
  const mode=document.querySelector('input[name="diary-export-mode"]:checked')?.value||'all';
  const stage=document.getElementById('diary-export-stage')?.value;
  const rangeFrom=document.getElementById('diary-export-range-from')?.value;
  const rangeTo=document.getElementById('diary-export-range-to')?.value;
  buildDiaryPDF(mode, stage, null, rangeFrom, rangeTo);
  diaryExportOverlay?.classList.remove('open');
});
document.getElementById('finance-export-go')?.addEventListener('click',()=>{
  const opts={
    summary: document.getElementById('fin-summary')?.checked,
    byStage: document.getElementById('fin-by-stage')?.checked,
    transactions: document.getElementById('fin-transactions')?.checked,
  };
  if(!opts.summary && !opts.byStage && !opts.transactions){showToast('Vyber aspoň jednu část','Zaškrtni, co se má do PDF zahrnout.');return;}
  buildFinancePDF(opts);
  financeExportOverlay?.classList.remove('open');
});

// --- Onboarding: první spuštění appky vyžaduje založení projektu ---
(function(){
  const screenOnboarding=document.getElementById('screen-onboarding');
  const screenDashboard=document.getElementById('screen-dashboard');
  const nameInput=document.getElementById('onb-name');
  const typeSelect=document.getElementById('onb-type');
  wireTypePills('onb');
  const locInput=document.getElementById('onb-location');
  const submitBtn=document.getElementById('onb-submit');
  const countEl=document.getElementById('onb-name-count');
  const appShell=document.querySelector('.app-shell');
  if(!screenOnboarding||!nameInput) return;

  function updateCount(){
    countEl.textContent=nameInput.value.length+'/22';
    submitBtn.disabled=nameInput.value.trim().length===0;
  }
  nameInput.addEventListener('input',updateCount);

  // --- Krokování úvodního průvodce (1-4 info kroky, 5 = motiv, 6 = formulář) ---
  const introSteps=[...document.querySelectorAll('.intro-step')];
  const introDots=[...document.querySelectorAll('#intro-dots span')];
  const nextBtn=document.getElementById('intro-next');
  const skipBtn=document.getElementById('intro-skip');
  const dotsWrap=document.getElementById('intro-dots');
  let introIndex=1;
  function showIntroStep(n){
    introIndex=n;
    introSteps.forEach(s=>s.classList.toggle('is-active', Number(s.dataset.introStep)===n));
    const isLast=n===6;
    dotsWrap.style.display=(n>=5)?'none':'';
    nextBtn.style.display=isLast?'none':'';
    skipBtn.style.display=(n>=5)?'none':'';
    if(n<5) introDots.forEach(d=>d.classList.toggle('is-active', Number(d.dataset.dot)===n));
  }
  nextBtn?.addEventListener('click',()=>showIntroStep(Math.min(introIndex+1,6)));
  skipBtn?.addEventListener('click',()=>showIntroStep(6));
  introDots.forEach(dot=>dot.addEventListener('click',()=>showIntroStep(Number(dot.dataset.dot))));

  function showOnboarding(){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('is-active'));
    screenOnboarding.classList.add('is-active');
    appShell.classList.add('is-onboarding');
    showIntroStep(1);
  }
  function finishOnboarding(){
    appShell.classList.remove('is-onboarding');
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('is-active'));
    screenDashboard.classList.add('is-active');
    appShell.dataset.screen='dashboard';
  }

  submitBtn.addEventListener('click',()=>{
    const name=nameInput.value.trim();
    if(!name) return;
    const p=ProjectStore.create({
      name,
      location:locInput.value.trim(),
      type:getTypeValue('onb'),
    });
    applyCurrentProjectToUI();
    finishOnboarding();
    showToast('Projekt založen','Vítej ve své nové stavbě — '+p.name+'. Stavbu zahájíš tlačítkem na dashboardu, až budeš mít datum.');
  });

  const existing=ProjectStore.all();
  if(!existing.length){
    showOnboarding();
  } else {
    applyCurrentProjectToUI();
  }
})();

// =========================================================
// v0.23.0 — Nastavení: reálně funkční přepínač oznámení
// =========================================================
(function(){
  const toggle=document.getElementById('notif-toggle');
  const options=document.getElementById('notif-options');
  const leadSelect=document.getElementById('notif-lead');
  const testBtn=document.getElementById('notif-test');
  if(!toggle) return;

  function loadPrefs(){
    try{return JSON.parse(localStorage.getItem('ms_notif_prefs'))||{enabled:false,lead:'60'};}
    catch(err){return {enabled:false,lead:'60'};}
  }
  function savePrefs(p){
    try{localStorage.setItem('ms_notif_prefs', JSON.stringify(p));}catch(err){}
  }
  function render(){
    const p=loadPrefs();
    toggle.checked=p.enabled;
    leadSelect.value=p.lead;
    options.classList.toggle('show', p.enabled);
  }
  render();

  toggle.addEventListener('change',()=>{
    if(toggle.checked){
      if(!('Notification' in window)){
        showToast('Oznámení nejsou podporována','Tento prohlížeč nepodporuje webová oznámení.');
        toggle.checked=false;
        return;
      }
      Notification.requestPermission().then(perm=>{
        if(perm==='granted'){
          savePrefs({enabled:true, lead:leadSelect.value});
          options.classList.add('show');
          showToast('Oznámení zapnuta','Budeme tě upozorňovat na blížící se události.');
        } else {
          toggle.checked=false;
          showToast('Oznámení povolena nejsou','Bez povolení v prohlížeči/telefonu je nemůžeme odesílat.');
        }
      });
    } else {
      savePrefs({enabled:false, lead:leadSelect.value});
      options.classList.remove('show');
      showToast('Oznámení vypnuta','Už tě nebudeme upozorňovat na události.');
    }
  });

  leadSelect?.addEventListener('change',()=>{
    savePrefs({enabled:toggle.checked, lead:leadSelect.value});
  });

  testBtn?.addEventListener('click',()=>{
    if(!('Notification' in window) || Notification.permission!=='granted'){
      showToast('Nejdřív zapni oznámení','Bez povolení nejde odeslat ani zkušební oznámení.');
      return;
    }
    const leadText={30:'30 minutami',60:'hodinou',180:'3 hodinami',1440:'dnem'}[leadSelect.value]||'hodinou';
    new Notification('Moje stavba', {
      body:`Test oznámení z aplikace Moje Stavba.`,
      icon:'',
    });
    showToast('Zkušební oznámení odesláno','Mělo by se objevit jako systémové upozornění.');
  });
})();

// =========================================================
// v0.55 — Přepínač vzhledu Dashboardu (Neon / Výkres)
// Uložené jako preference celého zařízení (ne per-projekt) —
// v Nastavení, sekce "Vzhled".
// =========================================================
(function(){
  const KEY='ms_dash_theme';
  function getTheme(){
    try{ return localStorage.getItem(KEY) || 'neon'; }catch(err){ return 'neon'; }
  }
  function applyTheme(theme){
    try{ localStorage.setItem(KEY, theme); }catch(err){}
    app.setAttribute('data-dash-theme', theme);
    document.querySelectorAll('[data-theme-option]').forEach(btn=>{
      btn.classList.toggle('is-active', btn.dataset.themeOption===theme);
    });
    const themeMeta=document.getElementById('theme-color-meta');
    if(themeMeta) themeMeta.setAttribute('content', theme==='blueprint' ? '#f2ede2' : '#02050e');
    const previewImg=document.getElementById('onb-theme-preview-img');
    if(previewImg) previewImg.src = theme==='blueprint' ? 'dashboard-preview-blueprint.webp' : 'dashboard-preview-neon.webp';
    updateHeroImage(theme);
  }
  document.querySelectorAll('[data-theme-option]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const theme=btn.dataset.themeOption;
      applyTheme(theme);
      showToast('Vzhled změněn', theme==='blueprint'
        ? 'Dashboard teď vypadá v motivu Technický.'
        : 'Dashboard je zpátky v neonovém stylu.');
    });
  });
  applyTheme(getTheme());
})();

// =========================================================
// Měsíční a výroční milníky od zahájení stavby — appka jednou za
// měsíc (a pak ve stejný den každého dalšího měsíce) přivítá uživatele
// malou oslavou s ohňostrojem, shrnutím co se za tu dobu stihlo a pár
// náhodnými fotkami z etap. Po roce se počítání přehodí na "rok"
// / "rok a X měsíců". Každý milník appka ukáže jen jednou.
// =========================================================
function czechMonthWord(n){
  if(n===1) return 'měsíc';
  if(n>=2 && n<=4) return 'měsíce';
  return 'měsíců';
}
function czechYearWord(n){
  if(n===1) return 'rok';
  if(n>=2 && n<=4) return 'roky';
  return 'let';
}
function milestoneLabel(months){
  if(months<12) return `${months} ${czechMonthWord(months)}`;
  const years=Math.floor(months/12);
  const rem=months%12;
  const yearsPart=`${years} ${czechYearWord(years)}`;
  if(rem===0) return yearsPart;
  return `${yearsPart} a ${rem} ${czechMonthWord(rem)}`;
}
// Přidá k datu N měsíců a ošetří přetečení u kratších měsíců
// (např. 31. leden + 1 měsíc = poslední den února, ne 3. březen).
function addMonthsClamped(date, months){
  const d=new Date(date.getTime());
  const targetMonthIndex=d.getMonth()+months;
  const firstOfTarget=new Date(d.getFullYear(), targetMonthIndex, 1);
  const lastDay=new Date(firstOfTarget.getFullYear(), firstOfTarget.getMonth()+1, 0).getDate();
  firstOfTarget.setDate(Math.min(d.getDate(), lastDay));
  return firstOfTarget;
}
// Vrátí počet uplynulých měsíců, pokud je dnešek přesně měsíční/roční
// výročí zahájení stavby, jinak null.
function checkMilestoneToday(startISO, todayISO){
  if(!startISO) return null;
  const start=new Date(startISO+'T00:00:00');
  const today=new Date(todayISO+'T00:00:00');
  if(isNaN(start.getTime()) || today<=start) return null;
  const monthsApprox=(today.getFullYear()-start.getFullYear())*12+(today.getMonth()-start.getMonth());
  for(const months of [monthsApprox-1, monthsApprox, monthsApprox+1]){
    if(months<1) continue;
    const candidate=addMonthsClamped(start, months);
    if(candidate.getFullYear()===today.getFullYear() && candidate.getMonth()===today.getMonth() && candidate.getDate()===today.getDate()){
      return months;
    }
  }
  return null;
}
const MILESTONE_QUOTES=[
  'Jde ti to skvěle! Nezapomeň, proč ses pro tenhle projekt rozhodl — každý dokončený krok tě přibližuje k vlastnímu domovu. Jen tak dál!',
  'Další milník za tebou. Stavba roste kousek po kousku — buď na sebe hrdý/hrdá, tohle není málo.',
  'Kus cesty máš za sebou a je to poznat. Vydrž, výsledek bude stát za všechnu tu dřinu.',
  'I ten nejdelší dům se staví jeden den po druhém. Ty svůj den za dnem posouváš dopředu — pokračuj!',
  'Zastav se na chvíli a podívej se, co všechno už stojí. Pak zase do toho — máš to pod kontrolou.',
];
function getMilestoneStats(){
  const photosCount=getAllProjectPhotos().length;
  const spent=getCurrentProjectTx().filter(t=>t.type==='expense').reduce((s,t)=>s+Number(t.amount||0),0);
  const entriesCount=getCurrentProjectEntries().length;
  const doneStages=visibleStageRows().filter(r=>r.classList.contains('done')).length;
  return {photosCount, spent, entriesCount, doneStages};
}
function getMilestonePhotos(maxCount=6){
  const all=getAllProjectPhotos();
  const byStage={};
  all.forEach(p=>{ (byStage[p.stage]=byStage[p.stage]||[]).push(p); });
  const picks=[];
  Object.values(byStage).forEach(list=>{
    picks.push(list[Math.floor(Math.random()*list.length)]);
  });
  for(let i=picks.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [picks[i],picks[j]]=[picks[j],picks[i]];
  }
  return picks.slice(0,maxCount);
}
function showMilestoneCelebration(months, project){
  const label=milestoneLabel(months);
  const isYearRound = months>=12 && months%12===0;
  const headline = isYearRound
    ? (months===12 ? 'Dnes je to rok od zahájení stavby! 🎉' : `Dnes je to ${label} od zahájení stavby! 🎉`)
    : `Dnes je to ${label} od zahájení stavby! 🎉`;
  const stats=getMilestoneStats();
  const photos=getMilestonePhotos(6);
  const quote=MILESTONE_QUOTES[months % MILESTONE_QUOTES.length];
  const overlay=document.createElement('div');
  overlay.className='fireworks-overlay';
  overlay.innerHTML=`<div class="fireworks-canvas"></div><div class="celebration-card milestone-card">
    <small class="milestone-kicker">${project.name}</small>
    <h1>${headline}</h1>
    <div class="celebration-stats">
      <div class="celebration-stat"><strong>${stats.photosCount}</strong><span>Fotek</span></div>
      <div class="celebration-stat"><strong>${money(stats.spent)}</strong><span>Utraceno</span></div>
      <div class="celebration-stat"><strong>${stats.entriesCount}</strong><span>Zápisů v deníku</span></div>
      <div class="celebration-stat"><strong>${stats.doneStages}</strong><span>Dokončených etap</span></div>
    </div>
    ${photos.length?`<div class="celebration-photos">${photos.map(p=>`<img src="${p.url}" alt="">`).join('')}</div>`:''}
    <p>${quote}</p>
    <button class="primary-wide" id="milestone-close">Jedeme dál</button>
  </div>`;
  document.body.appendChild(overlay);
  const canvas=overlay.querySelector('.fireworks-canvas');
  const colors=['#e8622a','#30e9ff','#b04cff','#ffd35c','#4dffab','#ff5e7b','#ffffff'];
  let rounds=0;
  const timer=setInterval(()=>{
    for(let i=0;i<3;i++){
      const fw=document.createElement('div');
      fw.className='firework-burst';
      fw.style.left=(8+Math.random()*84)+'%';
      fw.style.top=(8+Math.random()*55)+'%';
      fw.style.setProperty('--fw-color', colors[Math.floor(Math.random()*colors.length)]);
      canvas.appendChild(fw);
      setTimeout(()=>fw.remove(), 1300);
    }
    rounds++;
    if(rounds>=9) clearInterval(timer);
  }, 380);
  const close=()=>{ clearInterval(timer); overlay.remove(); };
  overlay.querySelector('#milestone-close')?.addEventListener('click', close);
}
function checkProjectMilestone(){
  const project=ProjectStore.current();
  if(!project || !project.startDate || project.completedDate) return;
  const todayISO=ProjectStore.todayISO();
  const months=checkMilestoneToday(project.startDate, todayISO);
  if(!months) return;
  if((project.lastMilestoneMonths||0)>=months) return;
  ProjectStore.update(project.id, {lastMilestoneMonths:months});
  showMilestoneCelebration(months, project);
}
setTimeout(checkProjectMilestone, 600);
