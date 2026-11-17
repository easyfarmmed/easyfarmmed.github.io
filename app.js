
var TOPICS=window.TOPICS,HANDLE='@easyfarmmed',L='ABCDE',KEY='efm-v2';
var BY={};TOPICS.forEach(function(t){t.tests.forEach(function(q){q.slug=t.slug;q.topic=t.title;BY[q.id]=q})});
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var S=load();S.st=S.st||{};S.best=S.best||{};S.runs=S.runs||{};
// перенос старого прогресу (окрема сторінка тренажера, ключ efm-W01-23)
Object.keys(window.LEGACY||{}).forEach(function(k){try{var o=JSON.parse(localStorage.getItem(k));if(!o||S['mig_'+k])return;var ids=LEGACY[k],sl=ids[0].split('-')[0];
  Object.keys(o.st||{}).forEach(function(i){var id=ids[+i];if(id&&!S.st[id])S.st[id]=o.st[i]});
  if(o.best)S.best[sl]=Math.max(S.best[sl]||0,o.best);if(o.runs)S.runs[sl]=(S.runs[sl]||0)+o.runs;S['mig_'+k]=1;save()}catch(e){}});
try{var m=location.search.match(/[?&]src=([\w-]{1,30})/);if(m){S.src=S.src||m[1];S.lastSrc=m[1];save()}}catch(e){}
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
   '<h2>Теми</h2>'+TOPICS.slice().reverse().map(function(t){var a=ids(t);return '<a class="card" href="#/t/'+t.slug+'"><span class="code">'+esc(t.code)+'</span><b>'+esc(t.title)+'</b><i>'+plural(a.length,'тест','тести','тестів')+' у форматі КРОК 1 →</i>'+prog(a)+'</a>'}).join('')+
   '<h2>Усі теми разом</h2><div class="card mix"><b>🎲 Мікс усіх тем</b><i>тести з різних тем упереміш — як на іспиті</i><div class="row">'+
   [20,50].filter(function(n){return n<A.length}).map(function(n){return '<button class="btn sm" data-n="'+n+'">'+n+' тестів</button>'}).join('')+
   '<button class="btn sm" data-n="all">Усі '+A.length+'</button></div></div>'+
   '<button class="btn alt" id="bw"'+(W.length?'':' disabled')+'>Помилки з усіх тем ('+W.length+')</button>'+
   '<div class="foot">Навчальний матеріал, не клінічна рекомендація · прогрес зберігається лише в цьому браузері</div>';
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
  if(!R)return home();if(!R.q.length)return finish();
  var id=R.q[0],t=BY[id],ord=shuffle(t.o.map(function(_,k){return k}));window.scrollTo(0,0);
  app.innerHTML=bar()+'<div class="bar"><i style="width:'+(100*R.done/R.n)+'%"></i></div><div class="meta"><span>'+R.done+' з '+R.n+' зараховано</span><span>у черзі: '+R.q.length+'</span></div>'+
   '<div class="q"><small>'+(R.mixed?esc(t.topic).toUpperCase()+' · ':'')+'ТЕСТ'+(R.first[id]===false?' · ЩЕ РАЗ':'')+'</small>'+esc(t.q)+'</div>'+
   ord.map(function(k,j){return '<button class="opt" data-k="'+k+'"><i>'+L[j]+'</i><span>'+esc(t.o[k])+'</span></button>'}).join('')+'<div id="fb"></div>'+
   '<a class="back sm" href="#/">✕ Завершити</a>';
  var bs=app.querySelectorAll('.opt'),ans=false;
  function pick(b){if(ans)return;ans=true;var k=+b.dataset.k,ok=k==t.k,s=st(id);
    bs.forEach(function(x){var kk=+x.dataset.k;x.classList.add(kk==t.k?'ok':x==b?'bad':'dim')});
    if(!(id in R.first))R.first[id]=ok;
    R.q.shift();if(ok){s.c++;s.s++;R.done++}else{s.w++;s.s=0;R.q.splice(Math.min(3,R.q.length),0,id);if(R.miss.indexOf(id)<0)R.miss.push(id)}
    save();
    $('fb').innerHTML='<div class="ex '+(ok?'ok':'bad')+'">'+svg(ok?capyDoc('h'):racoon('w'),ok?'-200 -150 360 300':undefined)+'<div><b>'+(ok?'Правильно!':'Ні — правильна: '+esc(t.o[t.k]))+'</b>'+esc(t.x)+'</div></div><button class="btn" id="nx">Далі →</button>';
    $('nx').onclick=next;$('nx').focus()}
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
function route(){document.onkeydown=null;R=null;window.scrollTo(0,0);var m=location.hash.match(/^#\/t\/([\w-]+)/);if(m)topic(m[1]);else home()}
window.addEventListener('hashchange',route);route();
