
var TOPICS=window.TOPICS,HANDLE='@easyfarmmed',L='ABCDE',KEY='efm-v2';
var BY={};TOPICS.forEach(function(t){t.tests.concat(t.warm||[]).forEach(function(q){q.slug=t.slug;q.topic=t.title;BY[q.id]=q})});
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
// 19.11: прогрес — компактно (лише питання з відповідями), затримка 0,5 с, а при закритті/згортанні — одразу (keepalive)
function progData(){var st={};Object.keys(S.st).forEach(function(k){var x=S.st[k];if(x&&(x.c+x.w)>0)st[k]=x});return {st:st,best:S.best,runs:S.runs,run:S.run||null,rt:S.rt||0,days:S.days||{},d0:S.d0||null}}
var pt=null,pdirty=0;function pushNow(keep){if(!ON||!S.code||!pdirty)return;clearTimeout(pt);pdirty=0;
  api('/rest/v1/rpc/save_progress',{p_code:S.code,p_data:progData()},keep).then(function(r){if(!r.ok)pdirty=1}).catch(function(){pdirty=1})}
function pushProg(){if(!ON||!S.code)return;pdirty=1;clearTimeout(pt);pt=setTimeout(function(){pushNow(false)},500)}
function merge(d){if(!d)return;if((d.rt||0)>(S.rt||0)){S.rt=d.rt;if(d.run)S.run=d.run;else delete S.run}Object.keys(d.st||{}).forEach(function(id){var a=S.st[id],b=d.st[id];if(!a||(b.c+b.w)>(a.c+a.w))S.st[id]=b});
  Object.keys(d.best||{}).forEach(function(k){S.best[k]=Math.max(S.best[k]||0,d.best[k])});Object.keys(d.runs||{}).forEach(function(k){S.runs[k]=Math.max(S.runs[k]||0,d.runs[k])});
  S.days=S.days||{};Object.keys(d.days||{}).forEach(function(k){S.days[k]=Math.max(S.days[k]||0,d.days[k])});if(d.d0&&(!S.d0||d.d0<S.d0))S.d0=d.d0}
function pull(cb){if(!ON||!S.code)return cb&&cb(false);api('/rest/v1/rpc/load_progress',{p_code:S.code}).then(function(r){return r.ok?r.json():null})
  .then(function(d){merge(d);save();pushProg();cb&&cb(!!d)}).catch(function(){cb&&cb(false)})}
function syncCard(){if(!ON)return '';
  if(TGW)return '<div class="card sync"><b>✓ Прогрес зберігається у твоєму Telegram</b><i>Відкривай тренажер з будь-якого пристрою.'+(S.code?' Твій код: <span class="c2">'+fmt(S.code)+'</span> — ним можна відкрити прогрес і в браузері.':'')+'</i>'+(S.code?'<div class="row"><button class="btn sm alt" id="cpy">Скопіювати код</button><button class="btn sm alt" id="ent">Ввести код з браузера</button></div>':'')+'</div>';
  if(S.code)return '<div class="card sync"><b>💾 Прогрес збережено</b><i>Твій код: <span class="c2">'+fmt(S.code)+'</span> — введи його на іншому пристрої</i><div class="row"><button class="btn sm alt" id="cpy">Скопіювати код</button><button class="btn sm alt" id="ent">Ввести інший</button></div></div>';
  return '<div class="card sync"><b>💾 Зберегти прогрес між пристроями</b><i>Без реєстрації: отримай код і введи його на телефоні чи ноутбуці</i><div class="row"><button class="btn sm" id="gen">Отримати код</button><button class="btn sm alt" id="ent">У мене є код</button></div></div>'}
function bindSync(){var g=$('gen'),e=$('ent'),c=$('cpy');
  if(g)g.onclick=function(){S.code=rnd(12,B32);save();pushProg();home()};
  if(c)c.onclick=function(){try{navigator.clipboard.writeText(fmt(S.code)).then(function(){c.textContent='Скопійовано ✓'})}catch(x){prompt('Твій код:',fmt(S.code))}};
  if(e)e.onclick=function(){var v=(prompt('Введи код (12 символів):')||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(!v)return;if(!/^[A-Z2-9]{12}$/.test(v))return alert('Код має 12 символів (літери й цифри 2–9).');
    S.code=v;save();if(TGW)try{TGW.CloudStorage.setItem('efm_code',v,function(){})}catch(x){}pull(function(ok){alert(ok?'Прогрес завантажено ✓':'За цим кодом ще нічого немає — тепер прогрес зберігатиметься під ним.');home()})}}
// ---- Пані КРОК (сова) реагує на відповідь (18.11, запит користувача) ----
var PRAISE=['Так! Пані КРОК задоволена','Правильно! Так тримати','Бездоганно!','Саме так!'],SCOLD=['Ой, ні!','Не цього разу…','Пастка спрацювала!','Ні-ні-ні!'];
function owlFace(ok){if(ok)return owl('h');
  return owl('a')+'<path d="M-24,22l8,-7l8,7l8,-7l8,7l8,-7l8,7" stroke="'+C.ink+'" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+   // скривилась
    '<path d="M86,-40q14,22 0,30q-14,-8 0,-30z" fill="#7cc4f2"/>'}                                                                                 // крапля поту
// 20.11: розбір хибних варіантів (поле why у JSON зошита): у бульбашці — чому вибраний варіант хибний; нижче — розбір усіх варіантів
function rozbir(t,ord,pk){if(!t.w)return '';
  return '<details class="rz"><summary>🔍 Розбір усіх варіантів</summary>'+ord.map(function(k,j){var ok=k==t.k;
    return '<div class="rzi '+(ok?'ok':'no')+(k==pk?' me':'')+'"><i>'+L[j]+'</i><span><b>'+(ok?'✓ ':'✗ ')+esc(t.o[k])+'</b>'+esc(ok?(t.x||'Правильна відповідь.'):(t.w[k]||''))+'</span></div>'}).join('')+'</details>'}
function krok(ok,t,pk){var m=(ok?PRAISE:SCOLD)[Math.floor(Math.random()*4)],why=!ok&&t.w&&t.w[pk]?'<span class="kw">Чому не «'+esc(t.o[pk])+'»: '+esc(t.w[pk])+'</span>':'';
  return '<div class="krok '+(ok?'good':'bad')+'"><div class="kowl">'+svg(owlFace(ok),'-170 -210 340 400')+(ok?'<i class="sp s1">✦</i><i class="sp s2">✦</i><i class="sp s3">✦</i>':'')+'</div>'+
    '<div class="kbub"><small>Пані КРОК</small><b>'+m+'</b>'+why+(ok?'':'<span class="kr">Правильна відповідь: '+esc(t.o[t.k])+'</span>')+(t.x?'<p>'+esc(t.x)+'</p>':'')+'</div></div>'}
function st(id){return S.st[id]||(S.st[id]={c:0,w:0,s:0})}
// 22.11: повторення з інтервалами — правильно: 1 → 3 → 7 → 21 день; помилка: завтра. Серія днів і мета 10 відповідей на день.
var IV=[1,1,3,7,21],GOAL=10;
function today(){var d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5)}
function sched(s,ok){var t=today();s.t=t;s.due=t+(ok?IV[Math.min(s.s,4)]:1)}
function markDay(){var t=today(),D=S.days=S.days||{};D[t]=(D[t]||0)+1;Object.keys(D).forEach(function(k){if(+k<t-90)delete D[k]})}
function streak(){var D=S.days||{},t=today(),n=0;if(!D[t])t--;while(D[t]){n++;t--}return n}
function dueIds(){var t=today();return Object.keys(S.st).filter(function(id){var x=S.st[id];return BY[id]&&id.slice(0,3)!='wu-'&&x&&(x.c+x.w)>0&&(x.due==null||x.due<=t)})
  .sort(function(a,b){var x=S.st[a],y=S.st[b];return ((x.s>0)-(y.s>0))||((x.due||0)-(y.due||0))})}
function repCard(){var any=Object.keys(S.st).some(function(k){var x=S.st[k];return x&&(x.c+x.w)>0});if(!any)return '';
  var D=dueIds(),sk=streak(),td=(S.days||{})[today()]||0;
  return '<div class="card rep"><div class="rp"><span class="fire">🔥</span><span><b>'+(sk?plural(sk,'день','дні','днів')+' поспіль':'Почни серію сьогодні')+'</b><i>сьогодні '+Math.min(td,GOAL)+' / '+GOAL+' відповідей'+(td>=GOAL?' ✓':'')+'</i></span></div>'+
   (D.length?'<b>🔁 Повторення на сьогодні: '+plural(D.length,'питання','питання','питань')+'</b><i>помилки й те, що пора освіжити, — щоб не забулось до КРОКу</i><button class="btn" id="brep">Повторити ('+Math.min(D.length,20)+')</button>'
    :'<b>✓ На сьогодні все повторено</b><i>нові питання на повторення з\'являться завтра</i>')+'</div>'}
function bindRep(){if($('brep'))$('brep').onclick=function(){var D=dueIds().slice(0,20);logEv('rep_start',{n:D.length});start(D,'Повторення на сьогодні','rep',true,false)}}
var EQ=[];function logEv(ev,p){if(!ON)return;EQ.push({uid:S.uid,ev:ev,p:p||null,src:S.lastSrc||S.src||null,tg:!!TGW});if(EQ.length>200)EQ=EQ.slice(-200);flushEv()}
function flushEv(){if(!ON||!EQ.length||flushEv.busy)return;flushEv.busy=1;var b=EQ.splice(0,30);
  api('/rest/v1/events',b,true).then(function(r){flushEv.busy=0;if(!r.ok&&r.status>=500)EQ=b.concat(EQ);else if(EQ.length)flushEv()}).catch(function(){flushEv.busy=0;EQ=b.concat(EQ)})}
function learned(id){return (S.st[id]||{}).s>=2}function wrong(id){var s=S.st[id];return !!s&&s.w>0&&!learned(id)}
function ids(t){return t.tests.map(function(q){return q.id})}
function WB(){return TOPICS.filter(function(t){return !t.krok})}function KB(){return TOPICS.filter(function(t){return t.krok})}
function allIds(L){var a=[];(L||WB()).forEach(function(t){a=a.concat(ids(t))});return a}
function svg(f,vb){return '<svg viewBox="'+(vb||'-200 -190 400 380')+'">'+f+'</svg>'}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function $(id){return document.getElementById(id)}
var app=$('app'),R=null;
function bar(){return '<div class="top"><a class="brand" href="#/">ФАРМА ЗА ХВИЛИНУ</a><a class="tg" href="https://t.me/easyfarmmed" target="_blank" rel="noopener">✈ '+HANDLE+'</a></div>'}
// 19.11: «правильно» = остання відповідь правильна (росте одразу під час проходження); «вивчено» = 2 правильні поспіль
function known(id){return (S.st[id]||{}).s>=1}
function prog(a){var n=a.filter(known).length,l=a.filter(learned).length;return '<div class="pb"><i style="width:'+(a.length?100*n/a.length:0)+'%"></i></div><span class="pn">'+n+' / '+a.length+' правильно'+(l?' · '+l+' вивчено':'')+'</span>'}
function plural(n,a,b,c){var d=n%10,h=n%100;return n+' '+(d==1&&h!=11?a:d>=2&&d<=4&&(h<12||h>14)?b:c)}
function home(){
  var A=allIds(),W=A.filter(wrong),runs=0;Object.keys(S.runs).forEach(function(k){runs+=S.runs[k]});
  app.innerHTML=bar()+'<h1>Тренажери <em>тестів</em></h1><p class="lead">Тести до робочого зошита з фармакології — щотижня нова тема. Помилки повертаються, доки не запам\'ятаєш; питання вивчене після 2 правильних відповідей поспіль.</p>'+
   '<div class="stats"><div><b>'+A.filter(known).length+'/'+A.length+'</b>правильно</div><div><b>'+WB().length+'</b>'+plural(WB().length,'тема','теми','тем').replace(/^\d+ /,'')+'</div><div><b>'+runs+'</b>спроб</div></div>'+
   repCard()+(GATE&&SUB!==true?'<div class="note">🎁 Перші '+FREE+' тестів — безкоштовно для всіх ('+Math.min(used(),FREE)+' / '+FREE+'). Далі — для підписників '+HANDLE+'.</div>':'')+resumeCard()+'<h2>Теми зошита</h2>'+WB().reverse().map(function(t){var a=ids(t);return '<a class="card" href="#/t/'+t.slug+'"><span class="code">'+esc(t.code)+'</span><b>'+esc(t.title)+'</b><i>'+plural(a.length,'тест','тести','тестів')+' у форматі КРОК 1 →</i>'+prog(a)+'</a>'}).join('')+
   '<h2>Усі теми разом</h2><div class="card mix"><b>🎲 Мікс усіх тем</b><i>тести з різних тем упереміш — як на іспиті</i><div class="row">'+
   [20,50].filter(function(n){return n<A.length}).map(function(n){return '<button class="btn sm" data-n="'+n+'">'+n+' тестів</button>'}).join('')+
   '<button class="btn sm" data-n="all">Усі '+A.length+'</button></div></div>'+
   '<button class="btn alt" id="bw"'+(W.length?'':' disabled')+'>Помилки з усіх тем ('+W.length+')</button>'+
   (KB().length?'<h2>База КРОК</h2><a class="card kb" href="#/krok"><span class="code">КРОК</span><b>📚 База КРОК</b><i>'+plural(allIds(KB()).length,'тест','тести','тестів')+' · '+plural(KB().length,'тема','теми','тем')+' — у тому числі теми, які ще не проходили →</i>'+prog(allIds(KB()))+'</a>':'')+
   '<button class="btn share" id="bsh">📤 Поділитись тренажером з одногрупниками</button>'+syncCard()+
   '<div class="foot">Навчальний матеріал, не клінічна рекомендація · '+(ON?'анонімна статистика відповідей (без імен) допомагає нам робити кращі ролики':'прогрес зберігається лише в цьому браузері')+'</div>';
  bindSync();bindRep();
  app.querySelectorAll('[data-n]').forEach(function(b){b.onclick=function(){var n=b.dataset.n,s=shuffle(A);start(n=='all'?s:s.slice(0,+n),'Мікс усіх тем','mix',true,false)}});
  $('bw').onclick=function(){start(W,'Помилки з усіх тем','mix',true,false)};
  $('bsh').onclick=function(){share('Тренажер тестів КРОК 1 з фармакології до робочого зошита: помилки повертаються, доки не запам\'ятаєш. Безкоштовно:','home')};
}
function krokHome(){
  var L=KB(),A=allIds(L),W=A.filter(wrong);
  app.innerHTML=bar()+'<a class="back" href="#/">← На головну</a><h1>База <em>КРОК</em></h1><p class="lead">Тести КРОК 1 з фармакології за темами — зокрема ті, яких ще не було на заняттях. Базу поступово доповнюємо.</p>'+resumeCard()+
   '<div class="stats"><div><b>'+A.filter(known).length+'/'+A.length+'</b>правильно</div><div><b>'+L.length+'</b>'+plural(L.length,'тема','теми','тем').replace(/^\d+ /,'')+'</div><div><b>'+W.length+'</b>помилок</div></div>'+
   '<div class="card mix"><b>🎲 Мікс бази КРОК</b><i>тести з усіх тем бази упереміш</i><div class="row">'+
   [20,50].filter(function(n){return n<A.length}).map(function(n){return '<button class="btn sm" data-n="'+n+'">'+n+' тестів</button>'}).join('')+'</div></div>'+
   '<button class="btn alt" id="bw"'+(W.length?'':' disabled')+'>Помилки з бази ('+W.length+')</button>'+
   '<h2>Теми</h2>'+L.map(function(t){var a=ids(t);return '<a class="card" href="#/t/'+t.slug+'"><span class="code">'+esc(t.code)+'</span><b>'+esc(t.title)+'</b><i>'+plural(a.length,'тест','тести','тестів')+' →</i>'+prog(a)+'</a>'}).join('')+
   '<div class="foot">Тести КРОК — дослівно; пояснень до них поки немає. Навчальний матеріал, не клінічна рекомендація.</div>';
  app.querySelectorAll('[data-n]').forEach(function(b){b.onclick=function(){start(shuffle(A).slice(0,+b.dataset.n),'Мікс бази КРОК','krokmix',true,false)}});
  $('bw').onclick=function(){start(W,'Помилки з бази КРОК','krokmix',true,false)};
}
function topic(slug){
  var t=TOPICS.filter(function(x){return x.slug==slug})[0];if(!t)return home();
  var a=ids(t),W=a.filter(wrong),F=a.filter(function(i){return !learned(i)});
  app.innerHTML=bar()+(t.krok?'<a class="back" href="#/krok">← База КРОК</a>':'<a class="back" href="#/">← Усі теми</a>')+'<h1>'+esc(t.title)+'</h1><p class="lead">'+plural(a.length,'тест','тести','тестів')+(t.krok?' · база КРОК · ':' у форматі КРОК 1 · ')+esc(t.code)+'</p>'+
   '<div class="hero">'+svg(owl('s'))+'</div>'+(S.run&&S.run.key==slug?resumeCard():'')+
   '<div class="stats"><div><b>'+a.filter(known).length+'/'+a.length+'</b>правильно</div><div><b>'+a.filter(learned).length+'</b>вивчено</div><div><b>'+(S.best[slug]||0)+'/'+a.length+'</b>найкраще</div><div><b>'+(S.runs[slug]||0)+'</b>спроб</div></div>'+
   (t.warm&&t.warm.length?'<div class="card mix"><b>🔥 Розминка</b><i>'+plural(t.warm.length,'просте питання','прості питання','простих питань')+' — щоб згадати основне перед тестами зошита. Не обов\'язково.</i><div class="row"><button class="btn sm" id="bwu">Почати розминку</button></div></div><h2>Тести зошита</h2>':'')+
   '<button class="btn" id="b1">'+(t.warm&&t.warm.length?'Одразу до тестів ('+a.length+')':'Усі тести теми')+'</button>'+
   '<button class="btn alt" id="b2"'+(W.length?'':' disabled')+'>Лише помилки ('+W.length+')</button>'+
   '<button class="btn alt" id="b3"'+(F.length&&F.length<a.length?'':' disabled')+'>Невивчені ('+F.length+')</button>'+
   '<div class="foot">Навчальний матеріал, не клінічна рекомендація</div>';
  if($('bwu'))$('bwu').onclick=function(){start(t.warm.map(function(q){return q.id}),'Розминка · '+t.title,slug,false,false,true)};
  $('b1').onclick=function(){start(a,t.title,slug,false,true)};$('b2').onclick=function(){start(W,t.title,slug,false,false)};$('b3').onclick=function(){start(F,t.title,slug,false,false)};
}
function start(list,label,key,mixed,full,warm){if(!list.length)return;logEv('start',{key:key,n:list.length,warm:!!warm});R={q:shuffle(list),all:list.slice(),n:list.length,done:0,first:{},miss:[],label:label,key:key,mixed:mixed,full:full,warm:!!warm};keepRun();window.scrollTo(0,0);next()}
// 19.11: незавершений тест не губиться — зберігається після кожної відповіді (у браузері й на сервері разом із прогресом)
function keepRun(){S.rt=Date.now();if(R){S.run=JSON.parse(JSON.stringify(R))}else delete S.run;save()}
function runOk(r){return r&&r.q&&r.q.length&&r.all&&r.q.every(function(id){return BY[id]})}
function resume(){var r=S.run;if(!runOk(r))return;logEv('resume',{key:r.key});R=JSON.parse(JSON.stringify(r));window.scrollTo(0,0);next()}
function restart(){var r=S.run;if(!r)return;start(r.all.filter(function(id){return BY[id]}),r.label,r.key,r.mixed,r.full,r.warm)}
// 20.11: тонка смужка замість великої картки (користувач: «маячить в очі»); ✕ — скинути незавершений тест
function resumeCard(){var r=S.run;if(!runOk(r))return '';var a=Object.keys(r.first||{}).length;
  return '<div class="resume"><span class="ri">⏸</span><span class="rt"><b>'+esc(r.label)+'</b><i>не завершено · '+r.done+'/'+r.n+'</i></span>'+
   '<button class="btn sm" id="brs">Продовжити</button><button class="rx" id="brn" aria-label="Скинути незавершений тест" title="Скинути">✕</button></div>'}
function dropRun(){delete S.run;S.rt=Date.now();save();route()}
function bindResume(){if($('brs'))$('brs').onclick=resume;if($('brn'))$('brn').onclick=dropRun}
function next(){
  if(!R)return home();if(!R.q.length)return finish();if(!R.warm&&locked())return gate();GSHOW=0;
  var id=R.q[0],t=BY[id],ord=shuffle(t.o.map(function(_,k){return k}));window.scrollTo(0,0);
  app.innerHTML=bar()+'<div class="bar"><i style="width:'+(100*R.done/R.n)+'%"></i></div><div class="meta"><span>'+R.done+' з '+R.n+' зараховано</span><span>залишилось: '+R.q.length+'</span></div>'+
   '<div class="q"><small>'+(R.mixed?esc(t.topic).toUpperCase()+' · ':'')+(R.warm?'РОЗМИНКА':'ТЕСТ')+(R.first[id]===false?' · ЩЕ РАЗ':'')+'</small>'+esc(t.q)+'</div>'+
   ord.map(function(k,j){return '<button class="opt" data-k="'+k+'"><i>'+L[j]+'</i><span>'+esc(t.o[k])+'</span></button>'}).join('')+'<div id="fb"></div>'+
   '<button class="endb" id="bend">'+(Object.keys(R.first).length?'⏹ Завершити тест і побачити результат':'✕ Вийти')+'</button>';
  $('bend').onclick=function(){finish(true)};
  var bs=app.querySelectorAll('.opt'),ans=false;
  function pick(b){if(ans)return;ans=true;var k=+b.dataset.k,ok=k==t.k,s=st(id);
    bs.forEach(function(x){var kk=+x.dataset.k;x.classList.add(kk==t.k?'ok':x==b?'bad':'dim')});
    var first=!(id in R.first);if(first)R.first[id]=ok;logAns(t,ok,first,R.warm?'warm':R.mixed?'mix':'topic');
    R.q.shift();if(ok){s.c++;s.s++;R.done++}else{s.w++;s.s=0;R.q.splice(Math.min(3,R.q.length),0,id);if(R.miss.indexOf(id)<0)R.miss.push(id)}
    if(first&&!R.warm){sched(s,ok);markDay()}
    keepRun();
    $('fb').innerHTML=krok(ok,t,k)+rozbir(t,ord,k)+'<button class="btn" id="nx">Далі →</button>';$('bend').textContent='⏹ Завершити тест і побачити результат';
    var fbx=$('fb');if(fbx.scrollIntoView)setTimeout(function(){fbx.scrollIntoView({behavior:'smooth',block:'nearest'})},60);
    try{if(TGW&&TGW.HapticFeedback)TGW.HapticFeedback.notificationOccurred(ok?'success':'error')}catch(e){}
    $('nx').onclick=next}
  bs.forEach(function(b){b.onclick=function(){pick(b)}});
  document.onkeydown=function(e){var n=parseInt(e.key,10);if(n>=1&&n<=bs.length)pick(bs[n-1]);else if(e.key=='Enter'&&$('nx'))$('nx').click()};
}
function finish(early){
  var r=R;R=null;delete S.run;S.rt=Date.now();document.onkeydown=null;
  var k=Object.keys(r.first),a=k.length,ok=k.filter(function(i){return r.first[i]}).length,done=!r.q.length,perfect=done&&ok==r.n;
  logEv('finish',{key:r.key,a:Object.keys(r.first).length,ok:Object.keys(r.first).filter(function(i){return r.first[i]}).length,n:r.n,done:!r.q.length,early:!!early});
  var back=(r.key=='mix'||r.key=='rep')?'#/':r.key=='krokmix'?'#/krok':'#/t/'+r.key;
  if(!a){save();go(back);return}   // ще не відповідав — просто вийти
  if(!r.warm&&done){S.runs[r.key]=(S.runs[r.key]||0)+1;if(r.full)S.best[r.key]=Math.max(S.best[r.key]||0,ok)}save();
  var TP=TOPICS.filter(function(x){return x.slug==r.key})[0],pct=Math.round(100*ok/a),col=pct>=80?'var(--teal)':pct>=50?'#f2a33a':'var(--red)';
  var shTxt=r.warm?'Розім\'явся перед тестами КРОК 1 з фармакології («'+(TP?TP.title:'')+'») — '+pct+'%. Тренажер до робочого зошита, безкоштовно:':'Пройшов тренажер «'+r.label+'»: '+pct+'% з першої спроби ('+ok+' з '+a+') 💪 Пані КРОК 0 : '+ok+' Я. Спробуй і ти — тести КРОК 1 до робочого зошита з фармакології:';
  app.innerHTML=bar()+'<h1>'+(perfect?'Ідеально!':done?'Зараховано всі '+r.n:'Тест <em>завершено</em>')+'</h1><p class="lead">'+esc(r.label)+'</p>'+
   '<div class="score"><div class="ring" style="--p:'+pct+';--c:'+col+'"><b>'+pct+'%</b></div><div class="sc"><b>'+ok+' з '+a+'</b>правильно з першої спроби'+(done?'':'<br>відповіді на '+a+' з '+r.n+' питань')+'</div></div>'+
   '<p class="lead">'+(perfect?'Пані КРОК тебе не підловить.':pct>=80?'Дуже добре! Помилки нижче — пройди їх ще раз.':pct>=50?'Непогано. Помилки нижче — пройди їх ще раз, і відсоток виросте.':'Пані КРОК поки веде — пройди помилки ще раз, вони повертаються, доки не запам\'ятаєш.')+'</p>'+
   (r.warm&&TP?'<button class="btn" id="bgo">Тепер — тести зошита ('+TP.tests.length+') →</button>':'')+
   (r.miss.length&&!r.warm?'<button class="btn" id="b2">Пройти помилки ('+r.miss.length+')</button>':'')+
   '<button class="btn'+(r.warm||(r.miss.length&&!r.warm)?' alt':'')+'" id="b1">'+(r.warm?'Розминка ще раз':'Пройти тест ще раз')+'</button>'+
   '<div class="row nav">'+(r.key=='mix'?'':'<button class="btn sm alt" data-go="'+back+'">'+(r.key=='krokmix'?'До бази КРОК':'До теми')+'</button>')+'<button class="btn sm alt" data-go="#/">Усі теми</button></div>'+
   '<button class="btn share" id="bsh">📤 Поділитись результатом</button>'+
   (r.miss.length?'<h2>Помилки — правильні відповіді</h2><ul class="list">'+r.miss.map(function(i){var t=BY[i];return '<li>'+(r.mixed?'<small>'+esc(t.topic)+'</small>':'')+esc(t.q)+'<br><b>✓ '+esc(t.o[t.k])+'</b></li>'}).join('')+'</ul>':'')+
   '<a class="btn alt" href="https://t.me/easyfarmmed" target="_blank" rel="noopener">Розбори й конспекти — Telegram '+HANDLE+'</a>';
  $('bsh').onclick=function(){share(shTxt,'res')};if($('bgo'))$('bgo').onclick=function(){start(ids(TP),TP.title,TP.slug,false,true)};
  app.querySelectorAll('[data-go]').forEach(function(x){x.onclick=function(){go(x.dataset.go)}});
  $('b1').onclick=function(){start(r.all.filter(function(id){return BY[id]}),r.label,r.key,r.mixed,r.full,r.warm)};if($('b2'))$('b2').onclick=function(){start(r.miss.slice(),r.label,r.key,r.mixed,false)};
}
// 20.11: перехід, що спрацьовує й тоді, коли адреса вже така сама (посилання на той самий #… нічого не робило)
function go(h){if((location.hash||'#/')==h)route();else location.hash=h}
// ---- 19.11: «Поділитись» — пересилання в Telegram (у Mini App), системне меню телефона або Telegram у новій вкладці ----
function share(text,tag){logEv('share',{tag:tag});var url='https://t.me/EasyFarmMedBot?startapp=share-'+tag,tg='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text);
  if(TGW&&TGW.openTelegramLink)return TGW.openTelegramLink(tg);
  if(navigator.share)return navigator.share({text:text,url:url}).catch(function(){});
  window.open(tg,'_blank','noopener')}
// ---- 18.11: тренажер лише для підписників каналу (вмикається "gate": true у .site_config.json, коли розгорнуто функцію check-sub) ----
var GATE=ON&&!!CFG.gate,SUB=GATE?null:true,BOTAPP='https://t.me/EasyFarmMedBot?startapp=',FREE=10,GSHOW=0;
function used(){var n=0;Object.keys(S.st).forEach(function(k){var x=S.st[k];if(k.slice(0,3)!='wu-'&&x&&(x.c+x.w)>0)n++});return n}
function locked(){return GATE&&SUB!==true&&used()>=FREE}
function after(){if(!GSHOW)return;if(SUB===true){logEv('gate_pass');GSHOW=0;if(R)next();else route()}else gate()}  // результат перевірки прийшов, поки видно замок
function openTg(u){if(TGW&&TGW.openTelegramLink)TGW.openTelegramLink(u);else window.open(u,'_blank','noopener')}
function subCheck(cb){if(!GATE)return cb&&cb();if(!TGW){SUB='web';return cb&&cb()}
  if(S.subOk&&Date.now()-S.subOk<6*3600e3){SUB=true;return cb&&cb()}
  SUB=null;cb&&cb();
  fetch(CFG.url.replace(/\/$/,'')+'/functions/v1/check-sub',{method:'POST',headers:hdr(),body:JSON.stringify({initData:TGW.initData})})
   .then(function(r){return r.json().then(function(j){return {s:r.status,j:j}})})
   .then(function(x){if(x.j&&x.j.member===true){SUB=true;S.subOk=Date.now()}else if(x.j&&x.j.member===false){SUB=false;S.subOk=0}else SUB=true;save();cb&&cb()})
   .catch(function(){SUB=true;cb&&cb()})}   // збій сервера — не блокуємо підписників
function gate(){if(!GSHOW)logEv('gate',{used:used()});GSHOW=1;window.scrollTo(0,0);var tg='<svg viewBox="0 0 24 24" width="22" height="22" style="vertical-align:-5px;margin-right:8px"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M5.5 11.8l11-4.3c.5-.2 1 .1.8.9l-1.9 8.8c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1l-6.5 4.1-2.8-.9c-.6-.2-.6-.6.1-.9z" fill="#2aabee"/></svg>';
  if(SUB===null){app.innerHTML=bar()+'<div class="hero">'+svg(owl('s'))+'</div><p class="lead" style="text-align:center">Перевіряю підписку на канал…</p>';return}
  var web=SUB==='web';
  app.innerHTML=bar()+'<div class="hero">'+svg(owl('s'))+'</div><h1>'+FREE+' тестів <em>пройдено!</em></h1>'+
   '<p class="lead">'+(web?'Перші '+FREE+' тестів — безкоштовно для всіх. Далі тренажер відкривається в Telegram для підписників каналу '+HANDLE+' — теж безкоштовно.':'Перші '+FREE+' тестів — для всіх. Щоб продовжити, підпишись на канал '+HANDLE+' — і відкриються всі тести. Безкоштовно.')+'</p>'+
   (web?'<button class="btn" id="g1" style="background:#2aabee">'+tg+'Відкрити тренажер у Telegram</button><button class="btn alt" id="g2">Спершу підписатись на канал</button>'
       :'<button class="btn" id="g2" style="background:#2aabee">'+tg+'Підписатись на '+HANDLE+'</button><button class="btn alt" id="g3">Я підписався — перевірити</button>')+
   '<div class="note">У каналі — ролики, конспекти, розбори тестів і PDF до кожної теми.</div><a class="btn alt" href="#/" style="margin-top:14px">На головну</a>';
  if($('g1'))$('g1').onclick=function(){logEv('gate_tg');openTg(BOTAPP+(S.lastSrc||'web'))};
  $('g2').onclick=function(){logEv('gate_sub');openTg('https://t.me/easyfarmmed')};
  if($('g3'))$('g3').onclick=function(){logEv('gate_check');S.subOk=0;subCheck(after)}}
function route(){document.onkeydown=null;R=null;window.scrollTo(0,0);GSHOW=0;if(/^#\/krok/.test(location.hash))krokHome();else{var m=location.hash.match(/^#\/t\/([\w-]+)/);if(m)topic(m[1]);else home()}bindResume()}
window.addEventListener('hashchange',route);if(!S.d0){S.d0=today();save()}route();subCheck(after);
logEv('open',{h:(location.hash||'#/').slice(0,40),day:today()-S.d0,due:dueIds().length,streak:streak()});
if(TGW){try{TGW.ready();TGW.expand()}catch(e){}
  var cdone=0;function useCode(v){if(cdone)return;cdone=1;if(v&&/^[A-Z2-9]{12}$/.test(v))S.code=v;else if(!S.code)S.code=rnd(12,B32);save();
    try{TGW.CloudStorage.setItem('efm_code',S.code,function(){})}catch(e){}pull(function(){if(!R&&!GSHOW)route()})}
  var cs=TGW.CloudStorage&&(!TGW.isVersionAtLeast||TGW.isVersionAtLeast('6.9'));
  if(cs){try{TGW.CloudStorage.getItem('efm_code',function(err,v){useCode(err?null:v)})}catch(e){useCode(null)}setTimeout(function(){useCode(null)},4000)}
  else useCode(null)}
else if(S.code)pull(function(){if(!R)route()});
flush();document.addEventListener('visibilitychange',function(){if(document.visibilityState=='hidden'){flush();flushEv();pushNow(true)}});
window.addEventListener('pagehide',function(){flush();pushNow(true)});
if(TGW&&TGW.onEvent)try{TGW.onEvent('viewportChanged',function(){pushNow(true)})}catch(e){}
setInterval(function(){pushNow(false)},15000);   // страховка: незбережене — раз на 15 с
