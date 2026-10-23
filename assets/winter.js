/* Winter: square pixels fall like snow. Tap → snow keeps falling naturally and settles, bottom-up, into the drawing.
   Tap again → the drawing loosens and falls as snow. */
(function(){
var IMG="/assets/winter.jpg";
var LABEL=["01 — Snowfall","02 — Winter"];
var host=document.querySelector(".stage");if(!host)return;
var sec=document.createElement("div");sec.className="poemfx";
sec.innerHTML='<div class="pframe"><canvas></canvas><div class="plabel"></div><div class="phint">Tap · 눌러보세요</div></div>';
host.appendChild(sec);
var fr=sec.querySelector(".pframe"),cv=sec.querySelector("canvas"),x=cv.getContext("2d"),lab=sec.querySelector(".plabel"),hint=sec.querySelector(".phint");
var d=Math.min(window.devicePixelRatio||1,2),W,H,N=0,P,T=null,img=null,stage=0,visible=true,ready=false,BW=0;
var CW,NC,cols,ptr,Q,qi,acc,landed,CLUMP=4;

function sample(){var o=document.createElement("canvas"),w=Math.round(W),h=Math.round(H);o.width=w*2;o.height=h*2;var c=o.getContext("2d");
c.fillStyle="#000";c.fillRect(0,0,o.width,o.height);
if(img){var s=Math.min(o.width/img.width,o.height/img.height)*.98,iw=img.width*s,ih=img.height*s;c.drawImage(img,(o.width-iw)/2,(o.height-ih)/2,iw,ih)}
var D=c.getImageData(0,0,o.width,o.height).data,cand=[];
for(var y=0;y<o.height;y++)for(var xx=0;xx<o.width;xx++){var v=D[(y*o.width+xx)*4];if(v>45)cand.push(xx,y,v)}
var n=cand.length/3,tx=new Float32Array(N),ty=new Float32Array(N),ta=new Float32Array(N);
for(var i=0;i<N;i++){var k=(Math.random()*n|0)*3;tx[i]=(cand[k]+Math.random())/2*d;ty[i]=(cand[k+1]+Math.random())/2*d;ta[i]=.35+.65*Math.min(1,cand[k+2]/120)}
return{x:tx,y:ty,a:ta}}

/* targets grouped into thin columns, lowest first: snow fills each column from the bottom up */
function prepCols(){CW=3*d;NC=Math.ceil(W*d/CW)+1;cols=[];for(var c=0;c<NC;c++)cols.push([]);
for(var j=0;j<N;j++){var c=Math.min(NC-1,Math.max(0,T.x[j]/CW|0));cols[c].push(j)}
for(var c=0;c<NC;c++)cols[c].sort(function(a,b){return T.y[b]-T.y[a]});ptr=new Int32Array(NC);landed=0}
function pickX(){for(var t=0;t<6;t++){var j=Math.random()*N|0,c=T.x[j]/CW|0;if(ptr[c]<cols[c].length)return T.x[j]+(Math.random()-.5)*14*d}return Math.random()*W*d}

function build(){var r=fr.getBoundingClientRect();W=r.width;H=r.height;BW=Math.round(W);cv.width=W*d;cv.height=H*d;
N=Math.round(Math.min(7000,Math.max(3500,W*H*.03)));T=sample();
P={x:new Float32Array(N),y:new Float32Array(N),a:new Float32Array(N),vy:new Float32Array(N),sw:new Float32Array(N),ph:new Float32Array(N),st:new Uint8Array(N),tg:new Int32Array(N)};
for(var i=0;i<N;i++){P.x[i]=Math.random()*W*d;P.y[i]=Math.random()*H*d;P.a[i]=i%5?0:.35+(i%3)*.25;P.vy[i]=(.1+Math.random()*.3)*d;P.sw[i]=(.2+Math.random()*.6)*d;P.ph[i]=Math.random()*6.283}}

function go(s){stage=s;lab.textContent=LABEL[s];
if(s===0){for(var i=0;i<N;i++)P.vy[i]=(.05+Math.random()*.2)*d;return}
prepCols();Q=[];acc=0;qi=0;
for(var i=0;i<N;i++){if(P.a[i]>.06&&P.y[i]<H*d){P.st[i]=1}else{P.st[i]=0;P.a[i]=0;Q.push(i)}}
for(var i=Q.length-1;i>0;i--){var j=Math.random()*(i+1)|0,t=Q[i];Q[i]=Q[j];Q[j]=t}}

fr.addEventListener("click",function(){if(!ready)return;hint.style.opacity=0;go(stage?0:1)});

function tick(now){requestAnimationFrame(tick);if(!ready||!visible)return;
var Hd=H*d,Wd=W*d,ts=now*.001;
x.clearRect(0,0,Wd,Hd);
if(stage===0){for(var i=0;i<N;i++){var tv=(.1+(i%7)*.045)*d;P.vy[i]+=(tv-P.vy[i])*.02;P.y[i]+=P.vy[i];P.x[i]+=Math.sin(ts*.5+P.ph[i])*P.sw[i]*.2;
if(P.y[i]>Hd){P.y[i]=-4;P.x[i]=Math.random()*Wd}if(P.x[i]<0)P.x[i]+=Wd;else if(P.x[i]>Wd)P.x[i]-=Wd;P.a[i]+=((i%5?0:.35+(i%3)*.25)-P.a[i])*.03}}
else{
/* same snowfall as before the tap: a flake that falls onto the drawing settles there (with a little clump),
   and a new flake starts at the top so the amount of falling snow never changes */
for(var i=0;i<N;i++){var s=P.st[i];
if(s===1){var tv=(.1+(i%7)*.045)*d;P.vy[i]+=(tv-P.vy[i])*.02;P.y[i]+=P.vy[i];P.x[i]+=Math.sin(ts*.5+P.ph[i])*P.sw[i]*.2;
if(P.x[i]<0)P.x[i]+=Wd;else if(P.x[i]>Wd)P.x[i]-=Wd;
var c=P.x[i]/CW|0;if(c>=0&&c<NC&&ptr[c]<cols[c].length){var j=cols[c][ptr[c]];if(P.y[i]>=T.y[j]&&P.y[i]-P.vy[i]-1<=T.y[j]){
ptr[c]++;P.st[i]=2;P.tg[i]=j;
for(var e=0;e<CLUMP&&ptr[c]<cols[c].length&&Q.length;e++){var r=Q.pop(),j2=cols[c][ptr[c]++];P.st[r]=2;P.tg[r]=j2;P.x[r]=T.x[j2];P.y[r]=T.y[j2];P.a[r]=0}
if(Q.length){var r=Q.pop();P.st[r]=1;P.x[r]=Math.random()*Wd;P.y[r]=-4;P.vy[r]=(.1+(r%7)*.045)*d;P.a[r]=.35+(r%3)*.25}
continue}}
if(P.y[i]>Hd){P.y[i]=-4;P.x[i]=Math.random()*Wd}}
else if(s===2){var j=P.tg[i];P.x[i]+=(T.x[j]-P.x[i])*.15;P.y[i]+=(T.y[j]-P.y[i])*.15;P.a[i]+=(T.a[j]-P.a[i])*.04}}}
var sz=Math.round(2*d),gr=sz,B=[new Path2D(),new Path2D(),new Path2D(),new Path2D()];
for(var i=0;i<N;i++){if(P.a[i]<.06)continue;var q=P.a[i]*4|0;if(q>3)q=3;B[q].rect(Math.round(P.x[i]/gr)*gr,Math.round(P.y[i]/gr)*gr,sz-1,sz-1)}
for(var b=0;b<4;b++){x.fillStyle="rgba(233,231,227,"+((b+1)/4).toFixed(2)+")";x.fill(B[b])}}

if("IntersectionObserver"in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(fr);
var im=new Image();im.onload=im.onerror=function(){img=im.width?im:null;build();ready=true;go(0);requestAnimationFrame(tick)};im.src=IMG;
var rt;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){if(!ready)return;var w=Math.round(fr.getBoundingClientRect().width);if(Math.abs(w-BW)<2)return;build();go(stage)},300)});
})();
