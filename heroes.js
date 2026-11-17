var SH='β',PLUM='#6d4c7d';
var C={ink:'#1e2a3a',mut:'#5b6b7a',bg:'#eef5f3',teal:'#1f8a70',coral:'#f26b3a',red:'#e5484d',pink:'#f49ab5',ok:'#1e9e5a',bad:'#d7263d',warn:'#d98a00',card:'#ffffff'};
var DUR=[4, 8, 7, 7],ST=[],TOTAL=0;DUR.forEach(function(d){ST.push(TOTAL);TOTAL+=d});
var items=[];
function add(sc,a,x,y,svg,o){o=o||{};items.push({sc:sc,a:a,x:x,y:y,svg:svg,s:o.s||1,m:o.m,u:o.u,f:o.f,fd:o.fd||.45,pop:o.pop!==false,dy0:o.dy0==null?26:o.dy0,keep:o.keep,now:o.now,stay:o.stay})}
function tx(x,y,t,sz,fill,cls,anc,ls){return '<text x="'+x+'" y="'+y+'" class="'+(cls||'')+'" style="font-size:'+sz+'px'+(ls?';letter-spacing:'+ls+'px':'')+'" fill="'+(fill||C.ink)+'" text-anchor="'+(anc||'middle')+'">'+t+'</text>'}

// ---------- герої ----------
function capy(mood,shield,flip){var e=mood=='h'?'<path d="M-118,-30q10,-10 20,0" stroke="#3b2a1e" stroke-width="6" fill="none" stroke-linecap="round"/>':mood=='w'?'<circle cx="-108" cy="-30" r="8" fill="#3b2a1e"/><path d="M-124,-50l26,6" stroke="#3b2a1e" stroke-width="5" stroke-linecap="round"/>':'<path d="M-118,-30q10,6 20,0" stroke="#3b2a1e" stroke-width="6" fill="none" stroke-linecap="round"/>';
var s='<g'+(flip?' transform="scale(-1,1)"':'')+'><ellipse cx="0" cy="138" rx="130" ry="14" fill="#000" opacity=".08"/><rect x="-70" y="90" width="38" height="48" rx="16" fill="#8c6140"/><rect x="50" y="90" width="38" height="48" rx="16" fill="#8c6140"/><ellipse cx="25" cy="38" rx="125" ry="82" fill="#a8774f"/><ellipse cx="40" cy="58" rx="80" ry="40" fill="#b98a60" opacity=".55"/>'+
'<rect x="-175" y="-72" width="160" height="110" rx="50" fill="#b98558"/><circle cx="-40" cy="-70" r="15" fill="#8c6140"/><circle cx="-40" cy="-70" r="7" fill="#6f4a30"/>'+e+'<ellipse cx="-122" cy="2" rx="14" ry="8" fill="#f2a07b" opacity=".7"/><ellipse cx="-163" cy="-20" rx="11" ry="8" fill="#3b2a1e"/><path d="M-170,10q9,7 18,0" stroke="#3b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/>'+
'<circle cx="-78" cy="-94" r="24" fill="#ffa62b"/><circle cx="-86" cy="-100" r="6" fill="#ffd08a"/><path d="M-78,-118q16,-16 30,-4q-16,12 -30,4z" fill="#3fa34d"/></g>';
if(shield)s+=shd(flip?215:-215,18);return s}
function shd(x,y){return '<g transform="translate('+x+','+y+')"><path d="M-58,-62h116v52q0,64 -58,86q-58,-22 -58,-86z" fill="'+C.teal+'" stroke="#fff" stroke-width="7"/><path d="M-40,-46h80v36q0,44 -40,62q-40,-18 -40,-62z" fill="#fff" opacity=".14"/>'+tx(0,SH.length>1?18:28,SH,SH.length>1?42:70,'#fff','g')+'</g>'}
function squirrel(mood){var eye=mood=='h'?'<path d="M18,-48q10,-11 20,0M50,-48q10,-11 20,0" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>':
'<circle cx="28" cy="-46" r="12" fill="#222"/><circle cx="60" cy="-46" r="12" fill="#222"/><circle cx="32" cy="-50" r="4" fill="#fff"/><circle cx="64" cy="-50" r="4" fill="#fff"/>'+(mood=='a'?'<path d="M14,-68l26,10M74,-68l-26,10" stroke="#222" stroke-width="6" stroke-linecap="round"/>':'')+(mood=='s'?'<path d="M14,-62l24,-6M74,-62l-24,-6" stroke="#222" stroke-width="5" stroke-linecap="round"/>':'');
var mouth=mood=='a'||mood=='s'?'<path d="M36,-14q8,-7 16,0" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/>':'<path d="M34,-18q10,10 20,0" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/>';
return '<ellipse cx="0" cy="128" rx="90" ry="12" fill="#000" opacity=".08"/><path d="M-40,70C-170,60 -185,-120 -90,-158C-20,-182 20,-110 -36,-88C-92,-66 -76,6 -24,30Z" fill="#e0662f"/><path d="M-60,40C-140,20 -150,-100 -95,-130C-60,-148 -40,-120 -60,-104C-110,-80 -100,0 -50,20Z" fill="#f59a5e" opacity=".6"/>'+
'<ellipse cx="10" cy="48" rx="62" ry="74" fill="#f08a4b"/><ellipse cx="26" cy="62" rx="36" ry="48" fill="#ffd9b8"/><ellipse cx="-20" cy="118" rx="30" ry="12" fill="#c95a26"/><ellipse cx="44" cy="118" rx="30" ry="12" fill="#c95a26"/>'+
'<path d="M18,28h28l-14,26h18l-34,46l10,-34h-16z" fill="#ffd23f" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/>'+
'<path d="M8,-80l2,-46l26,30zM78,-80l-2,-46l-26,30z" fill="#e0662f"/><path d="M12,-98l1,-22l12,14zM74,-98l-1,-22l-12,14z" fill="#ffc9a3"/><circle cx="44" cy="-40" r="52" fill="#f08a4b"/><ellipse cx="50" cy="-22" rx="30" ry="22" fill="#ffd9b8"/>'+eye+'<ellipse cx="44" cy="-30" rx="8" ry="6" fill="#5a2a14"/>'+mouth+'<ellipse cx="16" cy="-24" rx="9" ry="6" fill="#ff7f7f" opacity=".5"/><ellipse cx="76" cy="-24" rx="9" ry="6" fill="#ff7f7f" opacity=".5"/>'}
function heart(mood){var f=mood=='t'?'<circle cx="-38" cy="-38" r="11" fill="#2a1416"/><circle cx="38" cy="-38" r="11" fill="#2a1416"/><path d="M-22,4q22,-12 44,0" stroke="#2a1416" stroke-width="7" fill="none" stroke-linecap="round"/>'+drop(118,-110,1.1)+drop(-128,-60,.8):
mood=='c'?'<path d="M-52,-38q14,12 28,0M24,-38q14,12 28,0" stroke="#2a1416" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-24,-2q24,20 48,0" stroke="#2a1416" stroke-width="7" fill="none" stroke-linecap="round"/>':
'<circle cx="-38" cy="-38" r="11" fill="#2a1416"/><circle cx="38" cy="-38" r="11" fill="#2a1416"/><circle cx="-34" cy="-42" r="4" fill="#fff"/><circle cx="42" cy="-42" r="4" fill="#fff"/><path d="M-24,-4q24,20 48,0" stroke="#2a1416" stroke-width="7" fill="none" stroke-linecap="round"/>';
return '<ellipse cx="0" cy="150" rx="110" ry="13" fill="#000" opacity=".08"/><path d="M0,120C-190,0 -165,-150 -60,-148C-28,-147 -8,-128 0,-108C8,-128 28,-147 60,-148C165,-150 190,0 0,120Z" fill="'+C.red+'"/><ellipse cx="-80" cy="-86" rx="30" ry="18" fill="#fff" opacity=".35" transform="rotate(-30 -80 -86)"/><ellipse cx="-72" cy="-8" rx="16" ry="10" fill="#ff9aa0" opacity=".8"/><ellipse cx="72" cy="-8" rx="16" ry="10" fill="#ff9aa0" opacity=".8"/>'+f}
function lungs(mood){var lobe='M-22,-70C-70,-92 -150,-44 -150,40C-150,118 -96,140 -44,118C-20,108 -20,70 -22,-70Z';
var eyes=mood=='h'?'<path d="M-96,10q14,-14 28,0M68,10q14,-14 28,0" stroke="#3a1424" stroke-width="7" fill="none" stroke-linecap="round"/>':mood=='w'?'<path d="M-98,-6l26,12M-98,18l26,-12M98,-6l-26,12M98,18l-26,-12" stroke="#3a1424" stroke-width="6" stroke-linecap="round"/>':'<circle cx="-82" cy="10" r="10" fill="#3a1424"/><circle cx="82" cy="10" r="10" fill="#3a1424"/>';
return '<ellipse cx="0" cy="150" rx="120" ry="13" fill="#000" opacity=".08"/><rect x="-14" y="-150" width="28" height="96" rx="14" fill="#e98aa6"/><path d="'+lobe+'" fill="'+C.pink+'"/><path d="'+lobe+'" fill="'+C.pink+'" transform="scale(-1,1)"/><path d="M0,-60L-50,-20M0,-60L50,-20M-50,-20l-26,30M-50,-20l12,40M50,-20l26,30M50,-20l-12,40" stroke="#d76b8c" stroke-width="'+(mood=='w'?5:10)+'" stroke-linecap="round" fill="none"/>'+eyes+'<ellipse cx="-112" cy="44" rx="15" ry="9" fill="#ff6f96" opacity=".5"/><ellipse cx="112" cy="44" rx="15" ry="9" fill="#ff6f96" opacity=".5"/>'}
function drop(x,y,s){return '<path transform="translate('+x+','+y+') scale('+(s||1)+')" d="M0,-24C10,-8 18,2 18,12a18,18 0 0 1 -36,0C-18,2 -10,-8 0,-24Z" fill="#6ec6ff" stroke="#fff" stroke-width="3"/>'}
function door(lab,col,open){var s='<rect x="-62" y="-98" width="124" height="196" rx="22" fill="#fff" stroke="'+C.ink+'" stroke-width="6"/>';
s+=open?'<rect x="-48" y="-84" width="96" height="168" rx="14" fill="#fff1b8"/><path d="M-48,-84L-6,-104L-6,104L-48,84Z" fill="'+col+'"/><circle cx="-16" cy="2" r="6" fill="#fff"/>':'<rect x="-48" y="-84" width="96" height="168" rx="14" fill="'+col+'"/><rect x="-36" y="-70" width="72" height="56" rx="8" fill="#fff" opacity=".2"/><circle cx="30" cy="8" r="8" fill="#fff"/>';
return s+'<rect x="-52" y="-172" width="104" height="58" rx="29" fill="'+C.ink+'"/>'+tx(0,-130,lab,38,'#fff','g')}
function stop(){return '<circle r="40" fill="'+C.bad+'" stroke="#fff" stroke-width="7"/><rect x="-22" y="-7" width="44" height="14" rx="5" fill="#fff"/>'}
function anger(){return '<path d="M-20,-6q12,0 12,-14M6,-20q0,12 14,12M20,6q-12,0 -12,14M-6,20q0,-12 -14,-12" stroke="'+C.bad+'" stroke-width="7" fill="none" stroke-linecap="round"/>'}
function wheeze(){return '<path d="M0,0q14,-14 28,0t28,0M10,40q14,-14 28,0t28,0" stroke="'+C.bad+'" stroke-width="6" fill="none" stroke-linecap="round"/>'}
function cube(){return '<ellipse cx="0" cy="96" rx="80" ry="10" fill="#000" opacity=".08"/><rect x="-76" y="-76" width="152" height="152" rx="26" fill="#fff" stroke="#c9d3dd" stroke-width="6"/><path d="M-50,-50l14,6M44,-54l8,10M-46,44l10,-8M48,46l-12,-6" stroke="#c9d3dd" stroke-width="6" stroke-linecap="round"/><circle cx="-26" cy="-6" r="9" fill="'+C.ink+'"/><circle cx="26" cy="-6" r="9" fill="'+C.ink+'"/><path d="M-22,36q22,-18 44,0" stroke="'+C.ink+'" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-40,-30l18,6M40,-30l-18,6" stroke="'+C.ink+'" stroke-width="5" stroke-linecap="round"/>'+drop(64,-80,.8)}


function crab(mood){var c='#ef5b3f',d='#c9412b',s='';
[-1,1].forEach(function(k){for(var i=0;i<3;i++)s+='<path d="M'+(k*80)+','+(12+i*20)+'q'+(k*46)+',6 '+(k*62)+','+(46+i*6)+'" stroke="'+d+'" stroke-width="13" fill="none" stroke-linecap="round"/>'});
function claw(k){return '<path d="M'+(k*70)+',-20Q'+(k*120)+',-40 '+(k*135)+',-92" stroke="'+d+'" stroke-width="18" fill="none" stroke-linecap="round"/>'+
'<g transform="translate('+(k*140)+',-120) scale('+k+',1)"><path d="M-36,22C-52,-10 -34,-52 6,-58C30,-60 46,-44 40,-26L4,-20L40,-6C40,16 10,40 -36,22Z" fill="'+c+'"/><path d="M-20,-30q14,-10 28,-14" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".45"/></g>'}
s+=claw(-1)+claw(1);
s+='<ellipse cx="0" cy="118" rx="120" ry="12" fill="#000" opacity=".08"/><ellipse cx="0" cy="20" rx="112" ry="74" fill="'+c+'"/><ellipse cx="-30" cy="-12" rx="40" ry="18" fill="#fff" opacity=".22"/>';
s+='<path d="M-30,-40v-40M30,-40v-40" stroke="'+d+'" stroke-width="10" stroke-linecap="round"/>';
var eye=function(x){return '<circle cx="'+x+'" cy="-88" r="22" fill="#fff"/>'+(mood=='s'?'<path d="M'+(x-12)+',-86q12,8 24,0" stroke="#2a1416" stroke-width="6" fill="none" stroke-linecap="round"/>':'<circle cx="'+(x+3)+'" cy="-86" r="10" fill="#2a1416"/>')};
s+=eye(-30)+eye(30);
if(mood=='a')s+='<path d="M-54,-118l40,12M54,-118l-40,12" stroke="#2a1416" stroke-width="8" stroke-linecap="round"/>';
s+=mood=='a'?'<path d="M-24,30q24,-16 48,0" stroke="#2a1416" stroke-width="8" fill="none" stroke-linecap="round"/>':mood=='s'?'<path d="M-20,34q20,-10 40,0" stroke="#2a1416" stroke-width="7" fill="none" stroke-linecap="round"/>':'<path d="M-22,22q22,18 44,0" stroke="#2a1416" stroke-width="8" fill="none" stroke-linecap="round"/>';
s+='<ellipse cx="-62" cy="16" rx="14" ry="9" fill="#ff9a8a" opacity=".8"/><ellipse cx="62" cy="16" rx="14" ry="9" fill="#ff9a8a" opacity=".8"/>';return s}
function scis(mood){var bl='#c8d3dd',ed='#8c9aa7',ring=C.teal;
var blade=function(r){return '<g transform="rotate('+r+')"><path d="M-14,0L-6,-190Q0,-206 8,-190L16,0Z" fill="'+bl+'" stroke="'+ed+'" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="96" r="44" fill="none" stroke="'+ring+'" stroke-width="20"/><path d="M0,8V52" stroke="'+ring+'" stroke-width="20" stroke-linecap="round"/></g>'};
var op=mood=='x'?34:20,s='<ellipse cx="0" cy="168" rx="110" ry="12" fill="#000" opacity=".08"/>'+blade(-op)+blade(op);
s+='<circle r="40" fill="#fff" stroke="'+ed+'" stroke-width="6"/>';
s+=mood=='x'?'<path d="M-24,-14l14,14M-10,-14l-14,14M10,-14l14,14M24,-14l-14,14" stroke="'+C.ink+'" stroke-width="6" stroke-linecap="round"/><path d="M-12,16q12,-8 24,0" stroke="'+C.ink+'" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="-60" y="-120" width="120" height="30" rx="10" fill="#f2c39b" transform="rotate(-24)"/><path d="M-18,-112v14M0,-112v14M18,-112v14" stroke="#d9a47a" stroke-width="4" transform="rotate(-24)"/>':
mood=='h'?'<path d="M-24,-6q8,-10 16,0M8,-6q8,-10 16,0" stroke="'+C.ink+'" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-12,12q12,12 24,0" stroke="'+C.ink+'" stroke-width="5" fill="none" stroke-linecap="round"/>':
'<circle cx="-14" cy="-6" r="7" fill="'+C.ink+'"/><circle cx="14" cy="-6" r="7" fill="'+C.ink+'"/><path d="M-10,14q10,8 20,0" stroke="'+C.ink+'" stroke-width="5" fill="none" stroke-linecap="round"/>';
return s}
function hog(mood){var sp='';for(var i=0;i<9;i++){var a=-170+i*20,r=a*Math.PI/180;sp+='<path d="M'+(Math.cos(r)*70).toFixed(1)+','+(Math.sin(r)*56).toFixed(1)+'L'+(Math.cos(r+.11)*124).toFixed(1)+','+(Math.sin(r+.11)*104).toFixed(1)+'L'+(Math.cos(r+.26)*70).toFixed(1)+','+(Math.sin(r+.26)*56).toFixed(1)+'Z" fill="#6b4a36"/>'}
var e=mood=='h'?'<path d="M-82,-8q10,-12 20,0" stroke="#2a1a10" stroke-width="6" fill="none" stroke-linecap="round"/>':mood=='w'?'<path d="M-84,-16l18,10M-84,4l18,-10" stroke="#2a1a10" stroke-width="5" stroke-linecap="round"/>':'<circle cx="-72" cy="-6" r="9" fill="#2a1a10"/><circle cx="-69" cy="-9" r="3" fill="#fff"/>';
return '<ellipse cx="0" cy="84" rx="110" ry="11" fill="#000" opacity=".08"/>'+sp+'<ellipse cx="10" cy="10" rx="104" ry="66" fill="#8d6648"/><ellipse cx="-62" cy="18" rx="58" ry="46" fill="#f3d2b0"/><ellipse cx="-30" cy="72" rx="20" ry="10" fill="#6b4a36"/><ellipse cx="40" cy="72" rx="20" ry="10" fill="#6b4a36"/>'+e+'<circle cx="-118" cy="18" r="10" fill="#2a1a10"/><ellipse cx="-74" cy="34" rx="11" ry="7" fill="#ff9a8a" opacity=".8"/>'}
function vessel(st){var p=st==1?34:st==2?-8:12,w='#e86a6a';
var top='M-220,-70Q-110,-70 -60,'+(-70+p)+'Q0,'+(-70+p*1.6)+' 60,'+(-70+p)+'Q110,-70 220,-70',bot='M-220,70Q-110,70 -60,'+(70-p)+'Q0,'+(70-p*1.6)+' 60,'+(70-p)+'Q110,70 220,70';
var botR='L220,70Q110,70 60,'+(70-p)+'Q0,'+(70-p*1.6)+' -60,'+(70-p)+'Q-110,70 -220,70Z';
var cells='';[-150,-60,40,140].forEach(function(x,i){var y=i%2?-14:16,k=Math.abs(x)<80?(1-p/80):1;cells+='<ellipse cx="'+x+'" cy="'+(y*k).toFixed(0)+'" rx="'+(22*k+6).toFixed(0)+'" ry="'+(14*k+4).toFixed(0)+'" fill="#c62f3a"/>'});
return '<path d="'+top+botR+'" fill="#fbe1e1"/>'+cells+
'<path d="'+top+'" stroke="'+w+'" stroke-width="22" fill="none" stroke-linecap="round"/><path d="'+bot+'" stroke="'+w+'" stroke-width="22" fill="none" stroke-linecap="round"/>'}
function pill(t,col,w,dash){w=w||300;return '<rect x="'+(-w/2)+'" y="-40" width="'+w+'" height="80" rx="40" fill="#fff" stroke="'+col+'" stroke-width="5"'+(dash?' stroke-dasharray="14 10"':'')+'/>'+tx(0,13,t,34,dash?C.mut:C.ink)}
function arrow(len){return '<path d="M0,0H'+(len-20)+'" stroke="'+C.mut+'" stroke-width="8" stroke-linecap="round"/><path d="M'+len+',0l-28,-17v34z" fill="'+C.mut+'"/>'}
function card2(icon,t,badge,col){return '<rect x="-142" y="-136" width="284" height="272" rx="36" fill="#fff" stroke="'+col+'" stroke-width="5"/><g transform="translate(0,-26)">'+icon+'</g>'+tx(0,92,t,38,C.ink)+'<rect x="-110" y="-160" width="220" height="52" rx="26" fill="'+col+'"/>'+tx(0,-124,badge,30,'#fff')}
function icBaby(){return '<circle r="58" fill="#f2c39b"/><path d="M-6,-58q-14,-22 8,-26q14,0 6,14" stroke="#8c6140" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-30,-6q8,-8 16,0M14,-6q8,-8 16,0" stroke="#3b2a1e" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="-34" cy="14" rx="10" ry="6" fill="#f08080" opacity=".6"/><ellipse cx="34" cy="14" rx="10" ry="6" fill="#f08080" opacity=".6"/><circle cy="30" r="14" fill="'+C.teal+'"/><rect x="-22" y="24" width="44" height="12" rx="6" fill="'+C.teal+'"/>'}
function icKidney(){return '<path d="M10,-60C-50,-70 -66,-20 -60,10C-54,52 -10,70 20,52C44,38 24,14 30,0C36,-14 58,-22 50,-42C44,-56 28,-58 10,-60Z" fill="#c0504d"/><path d="M30,0h40" stroke="'+C.bad+'" stroke-width="12" stroke-linecap="round"/><path d="M58,-10l14,10l-14,10" stroke="'+C.bad+'" stroke-width="6" fill="none"/>'}
function tag(t){var w=t.length*19.5+52;return '<rect x="'+(-w/2)+'" y="-31" width="'+w+'" height="62" rx="31" fill="#fff" stroke="#c9d6d2" stroke-width="4"/>'+tx(0,12,t,34,C.ink)}
function icK(){return '<circle r="58" fill="'+C.warn+'"/>'+tx(0,18,'K⁺',56,'#fff','g')}

// ---------- інфографіка ----------
var KC={ok:C.ok,bad:C.bad,neu:C.teal,warn:C.warn};
function ico(k){return k=='up'?'<path d="M0,-17L15,1H6V16H-6V1H-15Z" fill="#fff"/>':k=='down'?'<path d="M0,17L15,-1H6V-16H-6V-1H-15Z" fill="#fff"/>':k=='x'?'<path d="M-11,-11L11,11M11,-11L-11,11" stroke="#fff" stroke-width="7" stroke-linecap="round"/>':'<path d="M-13,1L-4,11L14,-11" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'}
function chip(t,k,ic,w){w=w||820;var c=KC[k];return '<rect x="'+(-w/2)+'" y="-48" width="'+w+'" height="96" rx="48" fill="#fff" stroke="'+c+'" stroke-width="5"/><g transform="translate('+(-w/2+54)+',0)"><circle r="32" fill="'+c+'"/>'+ico(ic)+'</g>'+tx(-w/2+108,15,t,42,C.ink,'','start')}
function capn(lines,k){var hh=lines.length*58+52,s='<rect x="-480" y="'+(-hh/2)+'" width="960" height="'+hh+'" rx="40" fill="'+C.ink+'"/>';
if(k)s+='<circle cx="-430" cy="0" r="14" fill="'+KC[k]+'"/>';
lines.forEach(function(l,i){s+=tx(k?20:0,-hh/2+26+44+i*58,l,44,'#fff')});return s}
function head(t,sub){return tx(0,0,t,66,C.ink,'h')+(sub?tx(0,66,sub,40,C.mut):'')}
function card(icon,t,st){var dim=st=='dim';var s='<rect x="-142" y="-136" width="284" height="272" rx="36" fill="'+(dim?'#e3e9ec':'#fff')+'" stroke="'+(dim?'#9aa8b3':st=='ok'?C.ok:'#c9d6d2')+'" stroke-width="5"'+(dim?' stroke-dasharray="14 10"':'')+'/><g opacity="'+(dim?.35:1)+'" transform="translate(0,-26)">'+icon+'</g>'+tx(0,92,t,38,dim?'#7b8994':C.ink);
if(st)s+='<rect x="-104" y="-160" width="208" height="52" rx="26" fill="'+(dim?C.mut:C.ok)+'"/>'+tx(0,-124,dim?'приховано':'лишається',30,'#fff');return s}
function icHeart(){return '<path d="M0,52C-90,0 -78,-66 -30,-66C-14,-66 -4,-56 0,-46C4,-56 14,-66 30,-66C78,-66 90,0 0,52Z" fill="'+C.red+'"/><path d="M-70,-8h34l10,-22l16,44l12,-22h68" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'}
function icHand(){return '<rect x="-34" y="-10" width="68" height="62" rx="20" fill="#f2c39b"/><rect x="-34" y="-58" width="15" height="56" rx="7" fill="#f2c39b"/><rect x="-16" y="-68" width="15" height="66" rx="7" fill="#f2c39b"/><rect x="2" y="-64" width="15" height="62" rx="7" fill="#f2c39b"/><rect x="20" y="-52" width="14" height="50" rx="7" fill="#f2c39b"/><rect x="34" y="-6" width="30" height="16" rx="8" fill="#f2c39b" transform="rotate(-35 34 -6)"/><path d="M-62,-40q-10,20 0,40M-78,-50q-14,30 0,60M70,-60q10,20 0,40M86,-70q14,30 0,60" stroke="'+C.mut+'" stroke-width="5" fill="none" stroke-linecap="round"/>'}
function icDrop(){return drop(0,0,2.6)}
function sum(sym,col,t,sub){return '<rect x="-470" y="-86" width="940" height="172" rx="40" fill="#fff"/><circle cx="-378" cy="0" r="50" fill="'+col+'"/>'+tx(-378,20,sym,54,'#fff','g')+tx(-300,-10,t,46,C.ink,'','start')+tx(-300,44,sub,36,C.mut,'','start')}


function racoon(mood){var g='#8e979f',d='#4b5560',l='#d9dee2',s='<ellipse cx="0" cy="170" rx="120" ry="13" fill="#000" opacity=".08"/>';
var tail='';for(var i=0;i<5;i++)tail+='<ellipse cx="'+(96+i*18)+'" cy="'+(120-i*30)+'" rx="30" ry="22" fill="'+(i%2?d:g)+'" transform="rotate(-30 '+(96+i*18)+' '+(120-i*30)+')"/>';
s+=tail+'<ellipse cx="0" cy="96" rx="86" ry="78" fill="'+g+'"/><ellipse cx="0" cy="112" rx="52" ry="50" fill="'+l+'"/>';
s+='<rect x="-58" y="96" width="116" height="62" rx="8" fill="#fff" stroke="'+C.teal+'" stroke-width="5"/><path d="M0,100V156" stroke="'+C.teal+'" stroke-width="4"/>';
s+='<path d="M-80,-60L-96,-130L-40,-92Z" fill="'+g+'"/><path d="M80,-60L96,-130L40,-92Z" fill="'+g+'"/><path d="M-76,-74L-86,-112L-54,-90Z" fill="'+d+'"/><path d="M76,-74L86,-112L54,-90Z" fill="'+d+'"/>';
s+='<ellipse cx="0" cy="-30" rx="98" ry="82" fill="'+g+'"/><path d="M-96,-36C-70,-70 -24,-64 0,-40C24,-64 70,-70 96,-36C80,-6 40,-6 0,-18C-40,-6 -80,-6 -96,-36Z" fill="'+d+'"/>';
s+='<ellipse cx="0" cy="10" rx="50" ry="36" fill="'+l+'"/><ellipse cx="0" cy="-6" rx="14" ry="10" fill="#222"/>';
if(mood=='z')return s+'<path d="M-54,-36q16,10 32,0M22,-36q16,10 32,0" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="26" rx="10" ry="8" fill="#222"/>'
 +'<path d="M-84,58q84,40 168,0l4,26q-88,42 -176,0z" fill="#e5484d"/><rect x="40" y="70" width="34" height="70" rx="10" fill="#e5484d"/><path d="M44,140v14M56,140v16M68,140v14" stroke="#e5484d" stroke-width="5"/>'
 +tx(120,-110,'z',44,'#7d8b96','h')+tx(160,-150,'z',32,'#7d8b96','h')+'<path d="M-150,-20l-16,-10M-152,10l-20,0M-150,40l-16,10" stroke="#8fc3e8" stroke-width="6" stroke-linecap="round"/>';
if(mood=='g'||mood=='k'){var ex=mood=='k'?'<path d="M-50,-50l24,24M-26,-50l-24,24M26,-50l24,24M50,-50l-24,24" stroke="#fff" stroke-width="7" stroke-linecap="round"/>':'<circle cx="-38" cy="-38" r="14" fill="#fff"/><circle cx="38" cy="-38" r="14" fill="#fff"/><circle cx="-44" cy="-42" r="6" fill="#222"/><circle cx="44" cy="-33" r="6" fill="#222"/>';
 var mo=mood=='k'?'<ellipse cx="0" cy="24" rx="16" ry="12" fill="#222"/><path d="M-118,10h-44M-122,34h-52M-118,58h-40" stroke="#9fd18b" stroke-width="7" stroke-linecap="round" opacity=".9"/>'+tx(-200,-20,'ацетон',30,'#6aa457','h')
  :'<path d="M-18,24q9,-9 18,0q9,9 18,0" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/><path transform="translate(-102,-62) scale(.8)" d="M0,-24C10,-8 18,2 18,12a18,18 0 0 1 -36,0C-18,2 -10,-8 0,-24Z" fill="#6ec6ff" stroke="#fff" stroke-width="3"/><path transform="translate(104,-40) scale(.7)" d="M0,-24C10,-8 18,2 18,12a18,18 0 0 1 -36,0C-18,2 -10,-8 0,-24Z" fill="#6ec6ff" stroke="#fff" stroke-width="3"/>';
 return s+ex+mo}
var eye=mood=='h'?'<path d="M-52,-38q14,-14 28,0M24,-38q14,-14 28,0" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>':'<circle cx="-38" cy="-38" r="13" fill="#fff"/><circle cx="38" cy="-38" r="13" fill="#fff"/><circle cx="-35" cy="-37" r="7" fill="#222"/><circle cx="41" cy="-37" r="7" fill="#222"/>';
s+=eye+(mood=='s'?'<path d="M-14,26q14,-10 28,0" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-62,-78l28,10" stroke="#222" stroke-width="6" stroke-linecap="round"/><path transform="translate(92,-70) scale(.9)" d="M0,-24C10,-8 18,2 18,12a18,18 0 0 1 -36,0C-18,2 -10,-8 0,-24Z" fill="#6ec6ff" stroke="#fff" stroke-width="3"/>':'<path d="M-16,18q16,14 32,0" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/>');
return s}
function capyDoc(mood){return capy(mood||'h',0)+'<g transform="translate(-95,-104)"><path d="M-62,18q2,-40 62,-44q60,4 62,44z" fill="#fff" stroke="#c9d6d2" stroke-width="4"/><path d="M-8,-14h16v-14h-16zM-15,-21h30" stroke="none" fill="none"/><rect x="-6" y="-20" width="12" height="30" rx="2" fill="#e5484d"/><rect x="-15" y="-11" width="30" height="12" rx="2" fill="#e5484d"/></g>'}
function owl(mood){var b=PLUM,d='#553a63',l='#d9c8e3',s='<ellipse cx="0" cy="168" rx="120" ry="13" fill="#000" opacity=".08"/>';
s+='<path d="M-40,150l-14,16M-26,152v18M-12,150l12,16M40,150l14,16M26,152v18M12,150l-12,16" stroke="#e8912d" stroke-width="9" stroke-linecap="round"/>';
s+='<path d="M-78,-118L-104,-176L-44,-140Z" fill="'+d+'"/><path d="M78,-118L104,-176L44,-140Z" fill="'+d+'"/>';
s+='<ellipse cx="0" cy="20" rx="112" ry="140" fill="'+b+'"/><ellipse cx="0" cy="58" rx="74" ry="90" fill="'+l+'"/>';
s+='<path d="M-30,30q10,12 20,0M10,30q10,12 20,0M-10,62q10,12 20,0M-30,94q10,12 20,0M10,94q10,12 20,0" stroke="#b79cc7" stroke-width="6" fill="none" stroke-linecap="round"/>';
s+='<path d="M-108,0C-150,30 -146,96 -112,120C-100,90 -96,40 -108,0Z" fill="'+d+'"/><path d="M108,0C150,30 146,96 112,120C100,90 96,40 108,0Z" fill="'+d+'"/>';
[-1,1].forEach(function(k){var x=k*46;s+='<circle cx="'+x+'" cy="-58" r="42" fill="#fff" stroke="'+C.ink+'" stroke-width="7"/>';
s+=mood=='h'?'<path d="M'+(x-18)+',-54q18,-20 36,0" stroke="'+C.ink+'" stroke-width="8" fill="none" stroke-linecap="round"/>':'<circle cx="'+(x+(mood=='s'?k*-8:0))+'" cy="'+(mood=='s'?-50:-56)+'" r="'+(mood=='a'?11:16)+'" fill="'+C.ink+'"/>';
if(mood=='s')s+='<path d="M'+(x-42)+',-58a42,42 0 0 1 84,0Z" fill="'+b+'" stroke="'+C.ink+'" stroke-width="7" stroke-linejoin="round"/>';
if(mood=='a')s+='<path d="M'+(x-k*36)+',-112L'+(x+k*30)+',-92" stroke="'+C.ink+'" stroke-width="10" stroke-linecap="round"/>'});
s+='<path d="M-6,-58h12" stroke="'+C.ink+'" stroke-width="7"/><path d="M-14,-28L14,-28L0,2Z" fill="#e8912d" stroke="#c9741a" stroke-width="4" stroke-linejoin="round"/>';
s+='<path d="M0,-196L118,-158L0,-120L-118,-158Z" fill="'+C.ink+'"/><rect x="-52" y="-150" width="104" height="34" rx="12" fill="'+C.ink+'"/><path d="M96,-160v54" stroke="'+C.coral+'" stroke-width="7" stroke-linecap="round"/><circle cx="96" cy="-98" r="11" fill="'+C.coral+'"/>';
return s}
var TG='@easyfarmmed',TGC='#2aabee';
