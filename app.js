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
const route=$('.route-scene'),world=$('.map-world'),dest=$('.destination'),hero=$('.hero-scene'),heroPics=$$('.hero-photo'),mountain=$('.mountain-scene');
const landscape=$$('.route-landscape'),beats=$('.route-beats');
let previousKey='',heroIndex=-1,requested=false,landscapeIndex=0,lastLandscape='halong-photo.jpg';
const overview={key:'',name:'Весь маршрут',day:'С юга на север и обратно',copy:'Муйне → Хошимин → Вандон → Халонг → Сапа и Фансипан → Ханой → Хошимин → Муйне.',meta:'3 программных дня · группа 6–9 гостей · 650 USD нетто',img:'halong-photo.jpg',alt:'Бухта Халонг',link:'#program'};
function routeTop(){return route.getBoundingClientRect().top+scrollY}
function visitBeat(i){if(reduced){setDestination(i<0?overview:routeData[i],i<0?'all':String(i));return}const fraction=i<0?0:(i+.5)/routeData.length;scrollTo({top:routeTop()+(route.offsetHeight-innerHeight)*fraction,behavior:'smooth'})}
const allButton=document.createElement('button');allButton.type='button';allButton.textContent='Весь путь';allButton.setAttribute('aria-label','Показать весь маршрут');allButton.addEventListener('click',()=>visitBeat(-1));beats.append(allButton);
routeData.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.textContent=d.label;b.setAttribute('aria-label','Этап: '+d.name);b.addEventListener('click',()=>visitBeat(i));beats.append(b)});
function setDestination(d,key){
 if(previousKey===key)return;
 const initial=previousKey==='';previousKey=key;
 const pic=$('img',dest);pic.src=d.img;pic.alt=d.alt;
 if(d.key||initial){if(lastLandscape!==d.img){const next=1-landscapeIndex;landscape[next].src=d.img;landscape[next].alt=d.alt;landscape[next].classList.add('active');landscape[landscapeIndex].classList.remove('active');landscapeIndex=next;lastLandscape=d.img}}
 if(!reduced)pic.animate([{opacity:.2,transform:'scale(1.12)'},{opacity:1,transform:'scale(1.03)'}],{duration:800,easing:'cubic-bezier(.2,.6,.2,1)'});
 $('.destination-day').textContent=d.day;$('h3',dest).textContent=d.name;$('.destination-copy').textContent=d.copy;$('.destination-meta').textContent=d.meta;$('.destination-link').href=d.link;
 $('.route-counter').textContent=key==='all'?'Весь маршрут':`${Number(key)+1} / ${routeData.length}`;
 $$('.map-node').forEach(n=>{const active=n.dataset.place===d.key,label=$('text',n),point=$('circle',n);if(!n.dataset.baseLabel){n.dataset.baseLabel=label.textContent;n.dataset.labelX=label.getAttribute('x');n.dataset.labelY=label.getAttribute('y')}n.classList.toggle('active',active);label.textContent=active?d.name:n.dataset.baseLabel;label.setAttribute('x',active?point.getAttribute('cx'):n.dataset.labelX);label.setAttribute('y',active?Number(point.getAttribute('cy'))-17:n.dataset.labelY);label.setAttribute('text-anchor',active?'middle':'start')});
 $$('.route-beats button').forEach((b,k)=>{const active=key==='all'?k===0:k===Number(key)+1;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
}
function draw(){requested=false;const vh=innerHeight;
 $('.reading-progress').style.transform=`scaleX(${clamp(scrollY/(document.documentElement.scrollHeight-vh))})`;
 if(reduced)return;
 const hr=hero.getBoundingClientRect(),hp=clamp(-hr.top/(hero.offsetHeight-vh));
 if(hr.bottom>0){const hi=Math.min(2,Math.floor(hp*3));if(hi!==heroIndex){heroIndex=hi;heroPics.forEach((im,i)=>im.classList.toggle('active',i===hi));$('.hero-place').textContent=['Бухта Халонг','Деревня Кат-Кат','Канатная дорога Фансипан'][hi]}heroPics.forEach(im=>im.style.transform=`scale(${1.03+hp*.2}) translateY(${hp*-3}%)`);$('.hero-copy').style.transform=`translateY(${-hp*65}px)`;}
 const r=route.getBoundingClientRect();
 if(r.top<vh&&r.bottom>0){const p=clamp(-r.top/(route.offsetHeight-vh)),v=p*routeData.length,i=Math.min(routeData.length-1,Math.floor(v)),f=p===1?1:v-i,d=routeData[i];
  const amount=smooth((f-.08)/.24)*(1-smooth((f-.78)/.22)),isOverview=amount<.09;
  setDestination(isOverview?overview:d,isOverview?'all':String(i));
  const z=1+amount*1.65,tx=(.5-d.x)*amount*z*100,ty=(.5-d.y)*amount*z*100;
  world.style.transform=`translate(${tx}%,${ty}%) scale(${z})`;
  world.classList.toggle('zoomed',amount>.45);
  landscape.forEach(im=>im.style.transform=`scale(${1.04+amount*.12}) translateY(${-amount*2}%)`);
  $('.route-stage').style.setProperty('--camera',amount);
 }
 const mr=mountain.getBoundingClientRect(),mp=clamp(-mr.top/(mountain.offsetHeight-vh));if(mr.top<vh&&mr.bottom>0){$('.mountain-stage>img').style.transform=`scale(${1+mp*.2}) translateY(${-mp*4}%)`;$('.mountain-copy').style.transform=`translateY(${-mp*45}px)`;}
 $$('.photo-window,.day-panorama').forEach(el=>{const rr=el.getBoundingClientRect();if(rr.bottom>0&&rr.top<vh)$('img',el).style.transform=`scale(1.08) translateY(${(rr.top/vh-.4)*-16}px)`});
 $$('.place-shot').forEach((el,i)=>{const rr=el.getBoundingClientRect();if(rr.bottom>0&&rr.top<vh){const p=clamp((vh-rr.top)/(vh+rr.height));el.style.transform=`translateY(${(p-.5)*(i%2?50:-50)}px)`}});
 const cr=$('.cruise-line').getBoundingClientRect();$('.cruise-line').style.setProperty('--path-offset',String(1200*(1-clamp((vh-cr.top)/(vh*.9)))));
}
function schedule(){if(!requested){requested=true;requestAnimationFrame(draw)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);setDestination(overview,'all');draw();

// Reveal individual content parts, with readable no-script and reduced-motion states.
const revealTargets=$$('.section h2,.section .lead,.section .section-grid>div>p,.intro-media figure,.package-list article,.cruise-points article,.roles article,.launch-list p,.day-detail h3,.timetable li,.risk-list p,.price-ticket,.meeting-checklist');
if(!reduced&&'IntersectionObserver'in window){document.body.classList.add('motion-enabled');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -20px 0px'});revealTargets.forEach((el,i)=>{el.classList.add('reveal-part');el.style.setProperty('--delay',(i%3)*65+'ms');io.observe(el)})}
// The program image follows the actual day being presented.
const dayObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const img=$('.program-photo img');img.src=e.target.dataset.photo;img.alt=$('h3',e.target).textContent;if(!reduced)img.animate([{opacity:.35},{opacity:1}],{duration:650,easing:'ease-out'});$('.program-caption').textContent=$('h3',e.target).textContent}}),{rootMargin:'-15% 0px -55% 0px',threshold:0});$$('.day-detail').forEach(el=>dayObserver.observe(el));
$$('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{const spa=b.dataset.scenario==='spa';$$('[data-scenario]').forEach(x=>{const active=x===b;x.classList.toggle('selected',active);x.setAttribute('aria-pressed',String(active))});$('.scenario-content h3').textContent=spa?'SPA вместо Фансипана':'Фансипан после обеда';$('.scenario-content p').textContent=spa?'3–4 часа в отельном или курортном комплексе без доплаты. Объект, процедуры и детские условия выбираются отдельно. Кат-Кат остаётся в программе; если непогода мешает и прогулке, нужна другая согласованная замена.':'План посещения — с 13:00 до 16:00. Состав билетов и включённые фуникулёры нужно подтвердить до запуска.'}));
const tabs=$$('.ops-tabs [role=tab]');function activateTab(b){tabs.forEach(t=>{const active=t===b;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$('#'+t.getAttribute('aria-controls')).hidden=!active})}tabs.forEach((b,i)=>{b.tabIndex=i? -1:0;b.addEventListener('click',()=>activateTab(b));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activateTab(tabs[n]);tabs[n].focus()}})});
const format=v=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(v)+' USD';function calc(){const n=Number($('#guests').value),m=Math.max(0,Number($('#markup').value)||0);$('#guestValue').textContent=n;$('#netTotal').textContent=format(n*650);$('#retailPrice').textContent=format(650+m);$('#marginTotal').textContent=format(n*m)}$('#guests').addEventListener('input',calc);$('#markup').addEventListener('input',calc);calc();
$('#printBrief').addEventListener('click',()=>{const details=$$('details');details.forEach(d=>d.open=true);window.print()});
$('#presentMode').addEventListener('click',async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add('presenting');$('#presentMode').textContent='Выйти из показа'}else await document.exitFullscreen()}catch{document.body.classList.toggle('presenting');$('#presentMode').textContent=document.body.classList.contains('presenting')?'Выйти из показа':'Режим показа'}});document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('presenting');$('#presentMode').textContent='Режим показа'}});
// Preload only the local destination photographs used by scroll scenes.
routeData.forEach(d=>{const i=new Image();i.src=d.img});

$('.jump-menu').addEventListener('change',e=>{if(e.target.value)location.hash=e.target.value});
