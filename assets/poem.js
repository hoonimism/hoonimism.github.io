/* Poem → pixels → drawing I → drawing II → poem. Tap to advance; advances by itself when idle. */
(function(){
var POEM=[
"몸에는 그물 같은 껍질이 덮여 있다","신처럼 찾아오는 몸부림이","틈새에 그어진 빛 같을 때가 있다","그럴수록 두 손을 모으고","무서움에 기도하던 선명한 기억","스스로 무언가에 취하면","틀린 편지를 쓰거나 그렸다","잊고 잠에 든다","그건 가끔 비명이 돼서 껍질을 울린다","",
"단조로운 공명을 버리고 싶었다","손에 쥔 녹은 아이스크림 막대처럼","찐득한 현실을 버리고 씻고 싶었다","갈수록 버리고 싶은 것만 많아지는데","성숙해지려면 멀었는지 던져버릴 용기가 없다","닫힌 방은 성장이 멈춘 세상일지도","죽어버린 알일지도 모른다","금이 가버린 잠에서,","바뀌지 않은 자리에서 뒤척이는데","천둥이 치고, 벽이 무너지고","환호하는 사람들의 소리를 들었다","모두가 죽는 꿈을 꿨다","이른 죽음은 역사가 되지 못하는데…","",
"알속은 탯줄이 없어서","벽을 더듬어 길을 찾아야만 한다고","자라지 못한 머리가 말했다","꿈속에는 콘센트가 없다고","광원은 궤도를 따라 떠나간다고","빛은 껍질을 투과해 붉게 넓게 번진다","껍질에서 젖어 나온 몸은","침구를 바스락이며 움직인다","캔을 열려고 틱틱거리는 손톱 소리가","알을 깨려는 어미의 부리 소리만 같다","겨우 껍질을 깨고 나올 수 있었는데","깨어난 방은 아직 겨울인지","더운데도 눈이 쌓인다"];
var IMGS=["/assets/draw1.jpg","/assets/draw2.jpg"];
var LABEL=["01 — Poem","02 — Drawing I","03 — Drawing II"];
var FONT='300 {s}px "IBM Plex Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif';

var host=document.querySelector(".stage");if(!host)return;
var sec=document.createElement("div");sec.className="poemfx";
sec.innerHTML='<div class="pframe"><canvas></canvas><div class="plabel"></div><div class="phint">Tap · 눌러보세요</div></div>';
host.appendChild(sec);
var fr=sec.querySelector(".pframe"),cv=sec.querySelector("canvas"),x=cv.getContext("2d"),lab=sec.querySelector(".plabel"),hint=sec.querySelector(".phint");
var d=Math.min(window.devicePixelRatio||1,2),W,H,N=0,P,T=[],imgs=[],stage=0,t0=0,last=0,textA=0,visible=true,ready=false,touched=false;

function load(src){return new Promise(function(r){var i=new Image();i.onload=function(){r(i)};i.onerror=function(){r(null)};i.src=src})}

/* lay the poem out in one column that fills the frame */
function poemLayout(){var pad=W*.07,lines=POEM.length,lh=(H-pad*2)/lines,s=Math.min(lh/1.4,W/24);return{pad:pad,lh:lh,s:s}}
function drawPoem(c,alpha){var L=poemLayout();c.save();c.font=FONT.replace("{s}",(L.s*d).toFixed(2));c.textBaseline="middle";c.fillStyle="rgba(233,231,227,"+alpha+")";
var top=(H-L.lh*POEM.length)/2,mw=0;for(var j=0;j<POEM.length;j++)mw=Math.max(mw,c.measureText(POEM[j]).width);var lx=Math.max(L.pad*d,(W*d-mw)/2);for(var i=0;i<POEM.length;i++)c.fillText(POEM[i],lx,(top+L.lh*(i+.5))*d);c.restore()}

/* sample bright pixels of an offscreen render → N target points */
function sample(render){var o=document.createElement("canvas"),w=Math.round(W),h=Math.round(H);o.width=w*2;o.height=h*2;var c=o.getContext("2d");
var sd=d;d=2;render(c,o.width,o.height);d=sd;
var D=c.getImageData(0,0,o.width,o.height).data,cand=[];
for(var y=0;y<o.height;y++)for(var xx=0;xx<o.width;xx++){var v=D[(y*o.width+xx)*4];if(v>45)cand.push(xx,y,v)}
var n=cand.length/3,tx=new Float32Array(N),ty=new Float32Array(N),ta=new Float32Array(N);
for(var i=0;i<N;i++){var k,tries=0;do{k=(Math.random()*n|0)*3;tries++}while(cand[k+2]/255<Math.random()&&tries<4);
tx[i]=(cand[k]+Math.random())/2*d;ty[i]=(cand[k+1]+Math.random())/2*d;ta[i]=.25+.75*cand[k+2]/255}
return{x:tx,y:ty,a:ta}}

function imgRender(im){return function(c,w,h){c.fillStyle="#fff";c.fillRect(0,0,w,h);var s=Math.min(w/im.width,h/im.height)*.96,iw=im.width*s,ih=im.height*s;
c.drawImage(im,(w-iw)/2,(h-ih)/2,iw,ih);var g=c.getImageData(0,0,w,h),D=g.data;for(var i=0;i<D.length;i+=4){var v=255-D[i];D[i]=D[i+1]=D[i+2]=v}c.putImageData(g,0,0)}}

function build(){var r=fr.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;
N=Math.round(Math.min(9000,Math.max(4500,W*H*.04)));
T=[sample(function(c,w,h){c.fillStyle="#000";c.fillRect(0,0,w,h);drawPoem(c,1)})];
imgs.forEach(function(im){T.push(im?sample(imgRender(im)):T[0])});
var pT=P;P={x:new Float32Array(N),y:new Float32Array(N),a:new Float32Array(N),vx:new Float32Array(N),vy:new Float32Array(N),k:new Float32Array(N),dl:new Float32Array(N)};
var cur=tgt();for(var i=0;i<N;i++){P.x[i]=cur.x[i];P.y[i]=cur.y[i];P.a[i]=cur.a[i];P.k[i]=.012+Math.random()*.022;P.dl[i]=Math.random()*1400}}

function tgt(){return T[stage]||T[0]}

function go(s){stage=s;t0=performance.now();lab.textContent=LABEL[s];
for(var i=0;i<N;i++){P.dl[i]=Math.random()*1400;P.k[i]=.012+Math.random()*.022}}
function next(){go((stage+1)%3)}

fr.addEventListener("click",function(){if(!ready)return;touched=true;hint.style.opacity=0;last=performance.now();
next()});

function tick(now){requestAnimationFrame(tick);if(!ready||!visible)return;
var el=now-t0;
if(el>(stage===0?11000:9000)&&now-last>9000)next();
el=now-t0;var tg=tgt();
x.clearRect(0,0,W*d,H*d);
for(var i=0;i<N;i++){if(el<P.dl[i]){P.x[i]+=P.vx[i]*=.95;P.y[i]+=P.vy[i]*=.95;continue}var k=P.k[i];P.x[i]+=(tg.x[i]-P.x[i])*k;P.y[i]+=(tg.y[i]-P.y[i])*k;P.a[i]+=(tg.a[i]-P.a[i])*.05}
/* crisp text fades in once the poem has settled */
var want=stage===0&&el>4200?1:0;textA+=(want-textA)*(want?.03:.25);
var pa=1-textA*.85,sz=Math.round(2*d),gr=sz;
for(var b=0;b<4;b++){x.fillStyle="rgba(233,231,227,"+((b+1)/4*pa).toFixed(3)+")";x.beginPath();
for(var i=0;i<N;i++){var q=P.a[i]*4|0;if(q>3)q=3;if(q===b)x.rect(Math.round(P.x[i]/gr)*gr,Math.round(P.y[i]/gr)*gr,sz-1,sz-1)}x.fill()}
if(textA>.01)drawPoem(x,textA)}

if("IntersectionObserver"in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(fr);
var fontReady=document.fonts&&document.fonts.load?document.fonts.load(FONT.replace("{s}","12")+"","가"):Promise.resolve();
Promise.all([fontReady].concat(IMGS.map(load))).then(function(r){imgs=r.slice(1);build();ready=true;go(0);last=performance.now();textA=1;requestAnimationFrame(tick)});
var rt;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){if(ready){var s=stage;build();go(s)}},250)});
})();
