'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const routeData=[
 {key:'muine',name:'Муйне',label:'Муйне',day:'Старт · день 1',copy:'Встреча гостей в Муйне в 04:00. Трансфер в аэропорт Хошимина открывает путешествие с юга на север.',meta:'04:00–07:30 · наземный трансфер',img:'muine-photo.jpg',alt:'Песчаные дюны в районе Муйне',x:.714,y:.792,link:'#day1'},
 {key:'hcm',name:'Хошимин',label:'Хошимин',day:'Пересадка · день 1',copy:'Регистрация и посадка на внутренний рейс в Вандон. Хошимин — транспортная точка маршрута; городская экскурсия в пакет не включена.',meta:'07:30–09:10 · аэропорт и посадка',img:'hcm-photo.jpg',alt:'Панорама Хошимина',x:.543,y:.799,link:'#day1'},
 {key:'vandon',name:'Вандон',label:'Вандон',day:'На севере · день 1',copy:'После перелёта группу встречают в аэропорту Вандона и везут на причал Халонга. Все переезды связаны в одну программу с сопровождением гида.',meta:'Рейс 09:10–11:10 · трансфер 11:30–12:10',img:'vandon-airport.jpg',alt:'Терминал международного аэропорта Вандон',x:.623,y:.175,link:'#day1'},
 {key:'halong',name:'Халонг',label:'Халонг',day:'Бухта островов · день 1',copy:'Частный корабль для нашей группы. Маршрут № 1 соединяет две пещеры и скальные острова; на борту предусмотрен ланч-бокс.',meta:'12:30–16:30 · четыре часа в бухте',img:'halong-photo.jpg',alt:'Корабли и скальные острова Халонга',x:.586,y:.185,link:'#cruise'},
 {key:'sapa',name:'Сапа',label:'Сапа',day:'Горный город · день 2',copy:'Ночью — VIP-слипбас из Халонга. Утром — завтрак, раннее заселение и короткий отдых перед прогулкой. В Сапе предусмотрена одна ночь в отеле.',meta:'Прибытие около 07:00 · отель ещё выбирается',img:'catcat-photo.jpg',alt:'Долина и деревня в районе Сапы',x:.246,y:.101,link:'#day2'},
 {key:'sapa',name:'Кат-Кат',label:'Кат-Кат',day:'Деревня и водопад · день 2',copy:'Прогулка с русскоязычным гидом по деревне Кат-Кат: горный пейзаж, дорожки и водопад. На маршруте встречаются лестницы и неровные участки.',meta:'09:00–11:15 · затем включённый обед',img:'catcat-waterfall.jpg',alt:'Водопад в деревне Кат-Кат',x:.242,y:.106,link:'#day2'},
 {key:'sapa',name:'Фансипан',label:'Фансипан',day:'Выше облаков · день 2',copy:'Канатная дорога и прогулка по горному комплексу. При неподходящей погоде — SPA на 3–4 часа без доплаты; объект и процедуры ещё выбираются.',meta:'План 13:00–16:00 · зависит от погоды',img:'fansipan-real.jpg',alt:'Канатная дорога Фансипан над горной долиной',x:.233,y:.108,link:'#mountain'},
 {key:'hanoi',name:'Ханой',label:'Возвращение',day:'Возвращение · день 3',copy:'Свободное утро в Сапе, выезд после 12:00 и трансфер в аэропорт Ханоя. Перелёт в Хошимин и возвращение к отелям Муйне около 02:00 дня 4.',meta:'19:30–21:30 · обратный рейс по программе',img:'hanoi-photo.jpg',alt:'Городская панорама Ханоя',x:.453,y:.181,link:'#day3'}
];
const programScene=$('.program-chapters'),programPanels=$$('.chapter-panel'),programPhotos=$$('.chapter-background img');
const programImages=[['thien-cung.jpg','halong-photo.jpg','trong-mai.jpg'],['catcat-waterfall.jpg','catcat-photo.jpg','fansipan-real.jpg'],['hcm-photo.jpg','hanoi-photo.jpg','muine-photo.jpg']];
const programCaptions=['Халонг · частный круиз','Сапа · Кат-Кат и Фансипан','Ханой → Хошимин → Муйне'];
let programIndex=-1,programBackgroundIndex=0;
function programTop(){return programScene.getBoundingClientRect().top+scrollY}
function goProgram(i,instant=false){i=Math.round(clamp(i,0,2));if(reduced){selectProgram(i);scrollTo({top:programTop(),behavior:'auto'});return}scrollTo({top:programTop()+(programScene.offsetHeight-innerHeight)*(i+.5)/3,behavior:instant?'auto':'smooth'})}
function selectProgram(i){
 if(i===programIndex)return;programIndex=i;$('.chapter-content').scrollTop=0;
 programPanels.forEach((el,k)=>el.hidden=k!==i);$$('[data-program-day]').forEach(b=>{const active=Number(b.dataset.programDay)===i;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 const dayTab=$$('.chapter-tabs button')[i],tabRow=$('.chapter-tabs');tabRow.scrollTo({left:dayTab.offsetLeft-tabRow.offsetLeft-tabRow.clientWidth/2+dayTab.offsetWidth/2,behavior:reduced?'auto':'smooth'});
 $('.chapter-counter').textContent=`День ${i+1} / 3`;$('#chapterPrev').disabled=i===0;$('#chapterNext').disabled=i===2;
 $$('.chapter-picture img').forEach((im,k)=>im.src=programImages[i][k]);$('.chapter-photo-caption').textContent=programCaptions[i];
 const next=1-programBackgroundIndex;programPhotos[next].src=programImages[i][1];programPhotos[next].classList.add('active');programPhotos[programBackgroundIndex].classList.remove('active');programBackgroundIndex=next;
 if(!reduced){$('.chapter-collage').animate([{opacity:.25,transform:'translate3d(0,45px,-80px) rotateY(-6deg)'},{opacity:1,transform:'translate3d(0,0,0) rotateY(0deg)'}],{duration:850,easing:'cubic-bezier(.2,.65,.25,1)'});programPanels[i].animate([{opacity:0,transform:'translate3d(35px,18px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:650,easing:'ease-out'})}
}
function drawProgram(){if(reduced)return;const r=programScene.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){const p=clamp(-r.top/(programScene.offsetHeight-innerHeight)),i=Math.min(2,Math.floor(p*3));selectProgram(i);$('.chapter-picture.main').style.setProperty('--drift',`${(p*3-i-.5)*-16}px`);programPhotos.forEach(im=>im.style.transform=`scale(${1.04+p*.12})`)}}
$$('[data-program-day]').forEach(b=>b.addEventListener('click',()=>goProgram(Number(b.dataset.programDay))));$('#chapterPrev').addEventListener('click',()=>goProgram(programIndex-1));$('#chapterNext').addEventListener('click',()=>goProgram(programIndex+1));
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const m=a.getAttribute('href').match(/^#day([123])$/);if(m){e.preventDefault();history.replaceState(null,'','#day'+m[1]);goProgram(Number(m[1])-1)}});
function openHashDay(){const m=location.hash.match(/^#day([123])$/);if(m)goProgram(Number(m[1])-1,true)}addEventListener('hashchange',openHashDay);addEventListener('load',openHashDay);selectProgram(0);

const journey=$('.journey-scene'),stage=$('.journey-stage'),deck=$('.journey-deck'),dest=$('.journey-content'),beats=$('.journey-stops');
const hero=$('.hero-scene'),heroPics=$$('.hero-photo'),mountain=$('.mountain-scene'),landscape=$$('.journey-landscape');
let heroIndex=-1,requested=false,selected=-1,cameraPosition=0,landscapeIndex=0,lastLandscape='muine-photo.jpg',pointerStart=null,suppressCardClickUntil=0;
const cards=routeData.map((d,i)=>{
 const b=document.createElement('button');b.type='button';b.className='journey-card';b.setAttribute('aria-label','Открыть этап: '+d.name);
 const img=document.createElement('img');img.src=d.img;img.alt=d.alt;img.width=900;img.height=1100;img.draggable=false;b.append(img);
 const caption=document.createElement('span');caption.className='journey-card-caption';const title=document.createElement('b');title.textContent=d.name;const sub=document.createElement('small');sub.textContent=d.day;caption.append(title,sub);b.append(caption);
 b.addEventListener('click',()=>{if(Date.now()>=suppressCardClickUntil)visitStop(i)});deck.append(b);
 const stop=document.createElement('button');stop.type='button';stop.textContent=d.name;stop.setAttribute('aria-label','Этап: '+d.name);stop.addEventListener('click',()=>visitStop(i));beats.append(stop);
 return b;
});
function journeyTop(){return journey.getBoundingClientRect().top+scrollY}
function visitStop(i){i=Math.round(clamp(i,0,routeData.length-1));if(reduced){setStop(i);positionCards(i);return}scrollTo({top:journeyTop()+(journey.offsetHeight-innerHeight)*i/(routeData.length-1),behavior:'smooth'})}
$('#journeyPrev').addEventListener('click',()=>visitStop(selected-1));$('#journeyNext').addEventListener('click',()=>visitStop(selected+1));
stage.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();visitStop(e.key==='Home'?0:e.key==='End'?routeData.length-1:selected+(e.key==='ArrowRight'?1:-1))}});
deck.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY}});
deck.addEventListener('pointerup',e=>{if(!pointerStart)return;const dx=e.clientX-pointerStart.x,dy=e.clientY-pointerStart.y;pointerStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){suppressCardClickUntil=Date.now()+500;visitStop(selected+(dx<0?1:-1))}});deck.addEventListener('pointercancel',()=>pointerStart=null);
function setStop(i){
 if(selected===i)return;selected=i;const d=routeData[i];
 $('.journey-day').textContent=d.day;$('h3',dest).textContent=d.name;$('.journey-copy').textContent=d.copy;$('.journey-meta').textContent=d.meta;$('.journey-link').href=d.link;
 $('.journey-counter').textContent=`${i+1} / ${routeData.length}`;$('.journey-next-label').textContent=i<routeData.length-1?'Далее: '+routeData[i+1].name:'Завершение: Муйне · около 02:00 дня 4';
 $('#journeyPrev').disabled=i===0;$('#journeyNext').disabled=i===routeData.length-1;
 cards.forEach((c,k)=>{c.classList.toggle('selected',k===i);c.setAttribute('aria-pressed',String(k===i));c.tabIndex=Math.abs(k-i)<2?0:-1});
 $$('.journey-stops button').forEach((b,k)=>{b.classList.toggle('active',k===i);b.setAttribute('aria-pressed',String(k===i))});
 const active=beats.children[i];if(active)beats.scrollTo({left:active.offsetLeft-beats.offsetLeft-beats.clientWidth/2+active.offsetWidth/2,behavior:reduced?'auto':'smooth'});
 if(lastLandscape!==d.img){const next=1-landscapeIndex;landscape[next].src=d.img;landscape[next].classList.add('active');landscape[landscapeIndex].classList.remove('active');landscapeIndex=next;lastLandscape=d.img}
 if(!reduced)dest.animate([{opacity:.3,transform:'translate3d(0,22px,-30px)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:550,easing:'ease-out'});
}
function positionCards(position){
 cameraPosition=position;const mobile=innerWidth<701,step=mobile?innerWidth*.68:Math.min(innerWidth*.3,460);
 cards.forEach((c,i)=>{const offset=i-position,abs=Math.abs(offset),x=offset*step,y=abs*(mobile?15:24),z=-Math.min(abs,3)*(mobile?90:170),angle=clamp(offset,-1.4,1.4)*(mobile?-25:-36),scale=1-Math.min(abs,3)*.08;
  c.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${angle}deg) scale(${scale})`;
  c.style.opacity=String(clamp(1-Math.max(0,abs-1)*.55));c.style.zIndex=String(50-Math.round(abs*10));c.style.pointerEvents=abs<2?'auto':'none';
 });
 $('.journey-progress span').style.transform=`scaleX(${(position+1)/routeData.length})`;
}
function draw(){requested=false;const vh=innerHeight;drawProgram();$('.reading-progress').style.transform=`scaleX(${clamp(scrollY/(document.documentElement.scrollHeight-vh))})`;
 if(reduced){positionCards(Math.max(0,selected));return}
 const hr=hero.getBoundingClientRect(),hp=clamp(-hr.top/(hero.offsetHeight-vh));
 if(hr.bottom>0){const hi=Math.min(2,Math.floor(hp*3));if(hi!==heroIndex){heroIndex=hi;heroPics.forEach((im,i)=>im.classList.toggle('active',i===hi));$('.hero-place').textContent=['Бухта Халонг','Деревня Кат-Кат','Канатная дорога Фансипан'][hi]}heroPics.forEach(im=>im.style.transform=`scale(${1.03+hp*.2}) translateY(${hp*-3}%)`);$('.hero-copy').style.transform=`translateY(${-hp*65}px)`;}
 const r=journey.getBoundingClientRect();if(r.top<vh&&r.bottom>0){const p=clamp(-r.top/(journey.offsetHeight-vh)),raw=p*(routeData.length-1),nearest=Math.round(raw),fraction=raw-Math.floor(raw),hold=clamp((fraction-.28)/.44),position=Math.floor(raw)+smooth(hold);setStop(Math.round(position));positionCards(position);landscape.forEach(im=>im.style.transform=`scale(${1.05+p*.1}) translateY(${-p*3}%)`)}
 const mr=mountain.getBoundingClientRect(),mp=clamp(-mr.top/(mountain.offsetHeight-vh));if(mr.top<vh&&mr.bottom>0){$('.mountain-stage>img').style.transform=`scale(${1+mp*.2}) translateY(${-mp*4}%)`;$('.mountain-copy').style.transform=`translateY(${-mp*45}px)`;}
 $$('.day-panorama').forEach(el=>{const rr=el.getBoundingClientRect();if(rr.bottom>0&&rr.top<vh)$('img',el).style.transform=`scale(1.08) translateY(${(rr.top/vh-.4)*-16}px)`});
 $$('.place-shot').forEach((el,i)=>{const rr=el.getBoundingClientRect();if(rr.bottom>0&&rr.top<vh){const p=clamp((vh-rr.top)/(vh+rr.height));el.style.transform=`perspective(1200px) translate3d(0,${(p-.5)*(i%2?60:-60)}px,0) rotateY(${(p-.5)*(i%2?-10:10)}deg)`}});
 const cr=$('.cruise-line').getBoundingClientRect();$('.cruise-line').style.setProperty('--path-offset',String(1200*(1-clamp((vh-cr.top)/(vh*.9)))));
}
function schedule(){if(!requested){requested=true;requestAnimationFrame(draw)}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);setStop(0);positionCards(0);draw();

// Reveal individual content parts, with readable no-script and reduced-motion states.
const revealTargets=$$('.section h2,.section .lead,.section .section-grid>div>p,.intro-media figure,.package-list article,.cruise-points article,.roles article,.launch-list p,.day-detail h3,.timetable li,.risk-list p,.price-ticket,.meeting-checklist').filter(el=>!el.closest('.route-overview'));
if(!reduced&&'IntersectionObserver'in window){document.body.classList.add('motion-enabled');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -20px 0px'});revealTargets.forEach((el,i)=>{el.classList.add('reveal-part');el.style.setProperty('--delay',(i%3)*65+'ms');io.observe(el)})}

$$('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{const spa=b.dataset.scenario==='spa';$$('[data-scenario]').forEach(x=>{const active=x===b;x.classList.toggle('selected',active);x.setAttribute('aria-pressed',String(active))});$('.scenario-content h3').textContent=spa?'SPA вместо Фансипана':'Фансипан после обеда';$('.scenario-content p').textContent=spa?'3–4 часа в отельном или курортном комплексе без доплаты. Объект, процедуры и детские условия выбираются отдельно. Кат-Кат остаётся в программе; если непогода мешает и прогулке, нужна другая согласованная замена.':'План посещения — с 13:00 до 16:00. Состав билетов и включённые фуникулёры нужно подтвердить до запуска.'}));
const tabs=$$('.ops-tabs [role=tab]');function activateTab(b){tabs.forEach(t=>{const active=t===b;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$('#'+t.getAttribute('aria-controls')).hidden=!active})}tabs.forEach((b,i)=>{b.tabIndex=i? -1:0;b.addEventListener('click',()=>activateTab(b));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activateTab(tabs[n]);tabs[n].focus()}})});
const format=v=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(v)+' USD';function calc(){const n=Number($('#guests').value),m=Math.max(0,Number($('#markup').value)||0);$('#guestValue').textContent=n;$('#netTotal').textContent=format(n*650);$('#retailPrice').textContent=format(650+m);$('#marginTotal').textContent=format(n*m)}$('#guests').addEventListener('input',calc);$('#markup').addEventListener('input',calc);calc();
$('#printBrief').addEventListener('click',()=>{const details=$$('details');details.forEach(d=>d.open=true);window.print()});
$('#presentMode').addEventListener('click',async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add('presenting');$('#presentMode').textContent='Выйти из показа'}else await document.exitFullscreen()}catch{document.body.classList.toggle('presenting');$('#presentMode').textContent=document.body.classList.contains('presenting')?'Выйти из показа':'Режим показа'}});document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('presenting');$('#presentMode').textContent='Режим показа'}});
// Preload only the local destination photographs used by scroll scenes.
routeData.forEach(d=>{const i=new Image();i.src=d.img});

$('.jump-menu').addEventListener('change',e=>{if(e.target.value)location.hash=e.target.value});
