
var TOPICS=window.TOPICS,HANDLE='@easyfarmmed',L='ABCDE',KEY='efm-v2';
var BY={};TOPICS.forEach(function(t){t.tests.forEach(function(q){q.slug=t.slug;q.topic=t.title;BY[q.id]=q})});
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(typeof pushProg=='function')pushProg()}
var S=load();S.st=S.st||{};S.best=S.best||{};S.runs=S.runs||{};
// перенос старого прогресу (окрема сторінка тренажера, ключ efm-W01-23)
Object.keys(window.LEGACY||{}).forEach(function(k){try{var o=JSON.parse(localStorage.getItem(k));if(!o||S['mig_'+k])return;var ids=LEGACY[k],sl=ids[0].split('-')[0];
  Object.keys(o.st||{}).forEach(function(i){var id=ids[+i];if(id&&!S.st[id])S.st[id]=o.st[i]});
  if(o.best)S.best[sl]=Math.max(S.best[sl]||0,o.best);if(o.runs)S.runs[sl]=(S.runs[sl]||0)+o.runs;S['mig_'+k]=1;save()}catch(e){}});
try{var m=location.search.match(/[?&]src=([\w-]{1,30})/);if(m){S.src=S.src||m[1];S.lastSrc=m[1];save()}}catch(e){}
// ---- етапи 2–3: код прогресу, Telegram Mini App, анонімні відповіді (вмикається, коли в config.js є ключі Supabase) ----
var CFG=window.EFM_CFG||{},ON=!!(CFG.url&&CFG.key),B32='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
var TGW=(window.Telegram&&Telegram.WebApp&&Telegram.WebApp.initData)?Telegram.WebApp:null;
function rnd(n,abc){var a=new Uint8Array(n),s='';crypto.getRandomValues(a);for(var i=0;i<n;i++)s+=abc[a[i]%abc.length];return s}
function fmt(c){return c.slice(0,4)+'-'+c.slice(4,8)+'-'+c.slice(8)}
if(!S.uid){S.uid=rnd(16,'0123456789abcdef');save()}
if(TGW){var sp=(TGW.initDataUnsafe||{}).start_param;S.lastSrc=sp&&/^[\w-]{1,30}$/.test(sp)?sp:'tgapp';S.src=S.src||S.lastSrc}  // t.me/EasyFarmMedBot?startapp=channel → src=channel
function hdr(){var h={'apikey':CFG.key,'Content-Type':'application/json'};if(/^eyJ/.test(CFG.key))h.Authorization='Bearer '+CFG.key;return h}
function api(path,body,keep){return fetch(CFG.url.replace(/\/$/,'')+path,{method:'POST',headers:hdr(),body:JSON.stringify(body),keepalive:!!keep})}
var PQ=[];try{PQ=JSON.parse(localStorage.getItem('efm-q'))||[]}catch(e){}
function keepQ(){try{localStorage.setItem('efm-q',JSON.stringify(PQ.slice(-500)))}catch(e){}}
function flush(){if(!ON||!PQ.length||flush.busy)return;flush.busy=1;var b=PQ.splice(0,50);
  api('/rest/v1/answers',b,true).then(function(r){flush.busy=0;if(!r.ok)throw 0;keepQ();if(PQ.length)flush()}).catch(function(){flush.busy=0;PQ=b.concat(PQ);keepQ()})}
function logAns(q,ok,first,mode){if(!ON)return;PQ.push({uid:S.uid,qid:q.id,topic:q.slug,ok:ok,first_try:first,mode:mode,src:S.lastSrc||S.src||null,tg:!!TGW});keepQ();flush()}
var pt=null;function pushProg(){if(!ON||!S.code)return;clearTimeout(pt);pt=setTimeout(function(){api('/rest/v1/rpc/save_progress',{p_code:S.code,p_data:{st:S.st,best:S.best,runs:S.runs}}).catch(function(){})},1200)}
function merge(d){if(!d)return;Object.keys(d.st||{}).forEach(function(id){var a=S.st[id],b=d.st[id];if(!a||(b.c+b.w)>(a.c+a.w))S.st[id]=b});
  Object.keys(d.best||{}).forEach(function(k){S.best[k]=Math.max(S.best[k]||0,d.best[k])});Object.keys(d.runs||{}).forEach(function(k){S.runs[k]=Math.max(S.runs[k]||0,d.runs[k])})}
function pull(cb){if(!ON||!S.code)return cb&&cb(false);api('/rest/v1/rpc/load_progress',{p_code:S.code}).then(function(r){return r.ok?r.json():null})
  .then(function(d){merge(d);save();pushProg();cb&&cb(!!d)}).catch(function(){cb&&cb(false)})}
function syncCard(){if(!ON)return '';
  if(TGW)return '<div class="note">✓ Прогрес зберігається у твоєму Telegram — відкривай тренажер з будь-якого пристрою.</div>';
  if(S.code)return '<div class="card sync"><b>💾 Прогрес збережено</b><i>Твій код: <span class="c2">'+fmt(S.code)+'</span> — введи його на іншому пристрої</i><div class="row"><button class="btn sm alt" id="cpy">Скопіювати код</button><button class="btn sm alt" id="ent">Ввести інший</button></div></div>';
  return '<div class="card sync"><b>💾 Зберегти прогрес між пристроями</b><i>Без реєстрації: отримай код і введи його на телефоні чи ноутбуці</i><div class="row"><button class="btn sm" id="gen">Отримати код</button><button class="btn sm alt" id="ent">У мене є код</button></div></div>'}
function bindSync(){var g=$('gen'),e=$('ent'),c=$('cpy');
  if(g)g.onclick=function(){S.code=rnd(12,B32);save();pushProg();home()};
  if(c)c.onclick=function(){try{navigator.clipboard.writeText(fmt(S.code)).then(function(){c.textContent='Скопійовано ✓'})}catch(x){prompt('Твій код:',fmt(S.code))}};
  if(e)e.onclick=function(){var v=(prompt('Введи код (12 символів):')||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!v)return;if(!/^[A-Z2-9]{12}$/.test(v))return alert('Код має 12 символів (літери й цифри 2–9).');
    S.code=v;save();pull(function(ok){alert(ok?'Прогрес завантажено ✓':'За цим кодом ще нічого немає — тепер прогрес зберігатиметься під ним.');home()})}}
// ---- Пані КРОК (сова) реагує на відповідь (18.11, запит користувача) ----
var PRAISE=['Так! Пані КРОК задоволена','Правильно! Так тримати','Бездоганно!','Саме так!'],SCOLD=['Ой, ні!','Не цього разу…','Пастка спрацювала!','Ні-ні-ні!'];
function owlFace(ok){if(ok)return owl('h');
  return owl('a')+'<path d="M-24,22l8,-7l8,7l8,-7l8,7l8,-7l8,7" stroke="'+C.ink+'" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+   // скривилась
    '<path d="M86,-40q14,22 0,30q-14,-8 0,-30z" fill="#7cc4f2"/>'}                                                                                 // крапля поту
function krok(ok,t){var m=(ok?PRAISE:SCOLD)[Math.floor(Math.random()*4)];
  return '<div class="krok '+(ok?'good':'bad')+'"><div class="kowl">'+svg(owlFace(ok),'-170 -210 340 400')+(ok?'<i class="sp s1">✦</i><i class="sp s2">✦</i><i class="sp s3">✦</i>':'')+'</div>'+
    '<div class="kbub"><small>Пані КРОК</small><b>'+m+'</b>'+(ok?'':'<span class="kr">Правильна відповідь: '+esc(t.o[t.k])+'</span>')+'<p>'+esc(t.x)+'</p></div></div>'}
function st(id){return S.st[id]||(S.st[id]={c:0,w:0,s:0})}
function learned(id){return (S.st[id]||{}).s>=2}function wrong(id){var s=S.st[id];return !!s&&s.w>0&&!learned(id)}
function ids(t){return t.tests.map(function(q){return q.id})}
function allIds(){var a=[];TOPICS.forEach(function(t){a=a.concat(ids(t))});return a}
function svg(f,vb){return '<svg viewBox="'+(vb||'-200 -190 400 380')+'">'+f+'</svg>'}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function $(id){return document.getElementById(id)}
var app=$('app'),R=null;
function bar(){return '<div class="top"><a class="brand" href="#/">ФАРМА ЗА ХВИЛИНУ</a><a class="tg" href="https://t.me/easyfarmmed" target="_blank" rel="noopener">✈ '+HANDLE+'</a></div>'}
function prog(a){var n=a.filter(learned).length;return '<div class="pb"><i style="width:'+(a.length?100*n/a.length:0)+'%"></i></div><span class="pn">'+n+' / '+a.length+' вивчено</span>'}
function plural(n,a,b,c){var d=n%10,h=n%100;return n+' '+(d==1&&h!=11?a:d>=2&&d<=4&&(h<12||h>14)?b:c)}
function home(){
  var A=allIds(),W=A.filter(wrong),runs=0;Object.keys(S.runs).forEach(function(k){runs+=S.runs[k]});
  app.innerHTML=bar()+'<h1>Тренажери <em>тестів</em></h1><p class="lead">Тести до робочого зошита з фармакології — щотижня нова тема. Помилки повертаються, доки не запам\'ятаєш; питання вивчене після 2 правильних відповідей поспіль.</p>'+
   '<div class="stats"><div><b>'+A.filter(learned).length+'/'+A.length+'</b>вивчено</div><div><b>'+TOPICS.length+'</b>'+plural(TOPICS.length,'тема','теми','тем').replace(/^\d+ /,'')+'</div><div><b>'+runs+'</b>спроб</div></div>'+
   (GATE&&SUB!==true?'<div class="note">🎁 Перші '+FREE+' тестів — безкоштовно для всіх ('+Math.min(used(),FREE)+' / '+FREE+'). Далі — для підписників '+HANDLE+'.</div>':'')+'<h2>Теми</h2>'+TOPICS.slice().reverse().map(function(t){var a=ids(t);return '<a class="card" href="#/t/'+t.slug+'"><span class="code">'+esc(t.code)+'</span><b>'+esc(t.title)+'</b><i>'+plural(a.length,'тест','тести','тестів')+' у форматі КРОК 1 →</i>'+prog(a)+'</a>'}).join('')+
   '<h2>Усі теми разом</h2><div class="card mix"><b>🎲 Мікс усіх тем</b><i>тести з різних тем упереміш — як на іспиті</i><div class="row">'+
   [20,50].filter(function(n){return n<A.length}).map(function(n){return '<button class="btn sm" data-n="'+n+'">'+n+' тестів</button>'}).join('')+
   '<button class="btn sm" data-n="all">Усі '+A.length+'</button></div></div>'+
   '<button class="btn alt" id="bw"'+(W.length?'':' disabled')+'>Помилки з усіх тем ('+W.length+')</button>'+syncCard()+
   '<div class="foot">Навчальний матеріал, не клінічна рекомендація · '+(ON?'анонімна статистика відповідей (без імен) допомагає нам робити кращі ролики':'прогрес зберігається лише в цьому браузері')+'</div>';
  bindSync();
  app.querySelectorAll('[data-n]').forEach(function(b){b.onclick=function(){var n=b.dataset.n,s=shuffle(A);start(n=='all'?s:s.slice(0,+n),'Мікс усіх тем','mix',true,false)}});
  $('bw').onclick=function(){start(W,'Помилки з усіх тем','mix',true,false)};
}
function topic(slug){
  var t=TOPICS.filter(function(x){return x.slug==slug})[0];if(!t)return home();
  var a=ids(t),W=a.filter(wrong),F=a.filter(function(i){return !learned(i)});
  app.innerHTML=bar()+'<a class="back" href="#/">← Усі теми</a><h1>'+esc(t.title)+'</h1><p class="lead">'+plural(a.length,'тест','тести','тестів')+' у форматі КРОК 1 · '+esc(t.code)+'</p>'+
   '<div class="hero">'+svg(owl('s'))+'</div>'+
   '<div class="stats"><div><b>'+a.filter(learned).length+'/'+a.length+'</b>вивчено</div><div><b>'+(S.best[slug]||0)+'/'+a.length+'</b>найкраще</div><div><b>'+(S.runs[slug]||0)+'</b>спроб</div></div>'+
   '<button class="btn" id="b1">Усі тести теми</button>'+
   '<button class="btn alt" id="b2"'+(W.length?'':' disabled')+'>Лише помилки ('+W.length+')</button>'+
   '<button class="btn alt" id="b3"'+(F.length&&F.length<a.length?'':' disabled')+'>Невивчені ('+F.length+')</button>'+
   '<div class="foot">Навчальний матеріал, не клінічна рекомендація</div>';
  $('b1').onclick=function(){start(a,t.title,slug,false,true)};$('b2').onclick=function(){start(W,t.title,slug,false,false)};$('b3').onclick=function(){start(F,t.title,slug,false,false)};
}
function start(list,label,key,mixed,full){if(!list.length)return;R={q:shuffle(list),n:list.length,done:0,first:{},miss:[],label:label,key:key,mixed:mixed,full:full};window.scrollTo(0,0);next()}
function next(){
  if(!R)return home();if(!R.q.length)return finish();if(locked())return gate();GSHOW=0;
  var id=R.q[0],t=BY[id],ord=shuffle(t.o.map(function(_,k){return k}));window.scrollTo(0,0);
  app.innerHTML=bar()+'<div class="bar"><i style="width:'+(100*R.done/R.n)+'%"></i></div><div class="meta"><span>'+R.done+' з '+R.n+' зараховано</span><span>у черзі: '+R.q.length+'</span></div>'+
   '<div class="q"><small>'+(R.mixed?esc(t.topic).toUpperCase()+' · ':'')+'ТЕСТ'+(R.first[id]===false?' · ЩЕ РАЗ':'')+'</small>'+esc(t.q)+'</div>'+
   ord.map(function(k,j){return '<button class="opt" data-k="'+k+'"><i>'+L[j]+'</i><span>'+esc(t.o[k])+'</span></button>'}).join('')+'<div id="fb"></div>'+
   '<a class="back sm" href="#/">✕ Завершити</a>';
  var bs=app.querySelectorAll('.opt'),ans=false;
  function pick(b){if(ans)return;ans=true;var k=+b.dataset.k,ok=k==t.k,s=st(id);
    bs.forEach(function(x){var kk=+x.dataset.k;x.classList.add(kk==t.k?'ok':x==b?'bad':'dim')});
    var first=!(id in R.first);if(first)R.first[id]=ok;logAns(t,ok,first,R.mixed?'mix':'topic');
    R.q.shift();if(ok){s.c++;s.s++;R.done++}else{s.w++;s.s=0;R.q.splice(Math.min(3,R.q.length),0,id);if(R.miss.indexOf(id)<0)R.miss.push(id)}
    save();
    $('fb').innerHTML=krok(ok,t)+'<button class="btn" id="nx">Далі →</button>';
    var fbx=$('fb');if(fbx.scrollIntoView)setTimeout(function(){fbx.scrollIntoView({behavior:'smooth',block:'nearest'})},60);
    try{if(TGW&&TGW.HapticFeedback)TGW.HapticFeedback.notificationOccurred(ok?'success':'error')}catch(e){}
    $('nx').onclick=next}
  bs.forEach(function(b){b.onclick=function(){pick(b)}});
  document.onkeydown=function(e){var n=parseInt(e.key,10);if(n>=1&&n<=bs.length)pick(bs[n-1]);else if(e.key=='Enter'&&$('nx'))$('nx').click()};
}
function finish(){
  var r=R;R=null;document.onkeydown=null;
  var k=Object.keys(r.first),ok=k.filter(function(i){return r.first[i]}).length,perfect=ok==r.n;
  S.runs[r.key]=(S.runs[r.key]||0)+1;if(r.full)S.best[r.key]=Math.max(S.best[r.key]||0,ok);save();
  var back=r.key=='mix'?'#/':'#/t/'+r.key;
  app.innerHTML=bar()+'<h1>'+(perfect?'Ідеально!':'Зараховано всі '+r.n)+'</h1><p class="lead">'+esc(r.label)+' · з першої спроби: <b>'+ok+' з '+r.n+'</b> ('+Math.round(100*ok/r.n)+'%).'+(perfect?' Пані КРОК тебе не підловить.':' Помилки нижче — пройди їх ще раз.')+'</p>'+
   '<div class="hero">'+svg(perfect?capyDoc('h'):racoon('s'),perfect?'-200 -150 360 300':undefined)+'</div>'+
   (r.miss.length?'<ul class="list">'+r.miss.map(function(i){var t=BY[i];return '<li>'+(r.mixed?'<small>'+esc(t.topic)+'</small>':'')+esc(t.q)+'<br><b>'+esc(t.o[t.k])+'</b></li>'}).join('')+'</ul>':'')+
   '<button class="btn" id="b1">Ще раз</button>'+(r.miss.length?'<button class="btn alt" id="b2">Лише помилки ('+r.miss.length+')</button>':'')+
   (r.key=='mix'?'':'<a class="btn alt" href="'+back+'">До теми</a>')+'<a class="btn alt" href="#/">Усі теми</a>'+
   '<a class="btn alt" href="https://t.me/easyfarmmed" target="_blank" rel="noopener">Розбори й конспекти — Telegram '+HANDLE+'</a>';
  $('b1').onclick=function(){start(k,r.label,r.key,r.mixed,r.full)};if($('b2'))$('b2').onclick=function(){start(r.miss.slice(),r.label,r.key,r.mixed,false)};
}
// ---- 18.11: тренажер лише для підписників каналу (вмикається "gate": true у .site_config.json, коли розгорнуто функцію check-sub) ----
var GATE=ON&&!!CFG.gate,SUB=GATE?null:true,BOTAPP='https://t.me/EasyFarmMedBot?startapp=',FREE=10,GSHOW=0;
function used(){var n=0;Object.keys(S.st).forEach(function(k){var x=S.st[k];if(x&&(x.c+x.w)>0)n++});return n}
function locked(){return GATE&&SUB!==true&&used()>=FREE}
function after(){if(!GSHOW)return;if(SUB===true){GSHOW=0;if(R)next();else route()}else gate()}  // результат перевірки прийшов, поки видно замок
function openTg(u){if(TGW&&TGW.openTelegramLink)TGW.openTelegramLink(u);else window.open(u,'_blank','noopener')}
function subCheck(cb){if(!GATE)return cb&&cb();if(!TGW){SUB='web';return cb&&cb()}
  if(S.subOk&&Date.now()-S.subOk<6*3600e3){SUB=true;return cb&&cb()}
  SUB=null;cb&&cb();
  fetch(CFG.url.replace(/\/$/,'')+'/functions/v1/check-sub',{method:'POST',headers:hdr(),body:JSON.stringify({initData:TGW.initData})})
   .then(function(r){return r.json().then(function(j){return {s:r.status,j:j}})})
   .then(function(x){if(x.j&&x.j.member===true){SUB=true;S.subOk=Date.now()}else if(x.j&&x.j.member===false){SUB=false;S.subOk=0}else SUB=true;save();cb&&cb()})
   .catch(function(){SUB=true;cb&&cb()})}   // збій сервера — не блокуємо підписників
function gate(){GSHOW=1;window.scrollTo(0,0);var tg='<svg viewBox="0 0 24 24" width="22" height="22" style="vertical-align:-5px;margin-right:8px"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M5.5 11.8l11-4.3c.5-.2 1 .1.8.9l-1.9 8.8c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1l-6.5 4.1-2.8-.9c-.6-.2-.6-.6.1-.9z" fill="#2aabee"/></svg>';
  if(SUB===null){app.innerHTML=bar()+'<div class="hero">'+svg(owl('s'))+'</div><p class="lead" style="text-align:center">Перевіряю підписку на канал…</p>';return}
  var web=SUB==='web';
  app.innerHTML=bar()+'<div class="hero">'+svg(owl('s'))+'</div><h1>'+FREE+' тестів <em>пройдено!</em></h1>'+
   '<p class="lead">'+(web?'Перші '+FREE+' тестів — безкоштовно для всіх. Далі тренажер відкривається в Telegram для підписників каналу '+HANDLE+' — теж безкоштовно.':'Перші '+FREE+' тестів — для всіх. Щоб продовжити, підпишись на канал '+HANDLE+' — і відкриються всі тести. Безкоштовно.')+'</p>'+
   (web?'<button class="btn" id="g1" style="background:#2aabee">'+tg+'Відкрити тренажер у Telegram</button><button class="btn alt" id="g2">Спершу підписатись на канал</button>'
       :'<button class="btn" id="g2" style="background:#2aabee">'+tg+'Підписатись на '+HANDLE+'</button><button class="btn alt" id="g3">Я підписався — перевірити</button>')+
   '<div class="note">У каналі — ролики, конспекти, розбори тестів і PDF до кожної теми.</div><a class="btn alt" href="#/" style="margin-top:14px">На головну</a>';
  if($('g1'))$('g1').onclick=function(){openTg(BOTAPP+(S.lastSrc||'web'))};
  $('g2').onclick=function(){openTg('https://t.me/easyfarmmed')};
  if($('g3'))$('g3').onclick=function(){S.subOk=0;subCheck(after)}}
function route(){document.onkeydown=null;R=null;window.scrollTo(0,0);GSHOW=0;var m=location.hash.match(/^#\/t\/([\w-]+)/);if(m)topic(m[1]);else home()}
window.addEventListener('hashchange',route);route();subCheck(after);
if(TGW){try{TGW.ready();TGW.expand()}catch(e){}
  try{TGW.CloudStorage.getItem('efm_code',function(err,v){if(!err&&v&&/^[A-Z2-9]{12}$/.test(v))S.code=v;else if(!S.code)S.code=rnd(12,B32);save();
    TGW.CloudStorage.setItem('efm_code',S.code,function(){});pull(function(){if(!R)route()})})}catch(e){}}
else if(S.code)pull(function(){if(!R)route()});
flush();document.addEventListener('visibilitychange',function(){if(document.visibilityState=='hidden')flush()});
