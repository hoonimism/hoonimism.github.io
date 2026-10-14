var CH={
prologue:{n:"Prologue",dy:-6,en:"“ THE WORLD IS MY REPRESENTATION ”",ko:"“ 세계는 나의 표상이다 ”",cite:"— Arthur Schopenhauer, 1818"},
shell:{n:"Shell",dy:-3,en:"Within each shell exists a world of its own.",ko:"각자의 껍질 안에는 각자의 세계가 존재한다."},
crack:{n:"Crack",dy:0,en:"My world extends only as far as I can perceive its boundaries",ko:"나의 세계는 내가 인지하는 만큼의 경계를 가진다."},
still:{n:"Still, Birth",dy:5,en:"Every dream holds an awakening. Nothing awakens unchanged.",ko:"꿈은 깨어남을 품고 있다. 깨어난 꿈은 이전과 같을 수 없다."},
winter:{n:"Winter",dy:9,en:"The season you awaken to may be winter.",ko:"깨어난 계절은 겨울일지도 모른다."}
};
(function(){
var m=document.createElement("meta");m.name="theme-color";m.content="#050505";document.head.appendChild(m);
var k=document.body.getAttribute("data-chapter"),c=CH[k];if(!c)return;
document.title=c.n+" — World Within The Shell";
var w=document.createElement("main");w.className="wrap";
w.innerHTML='<header><svg viewBox="0 0 14 28" aria-hidden="true"><ellipse cx="7" cy="14" rx="6" ry="13" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="7" cy="'+(14+c.dy)+'" r="3.2" fill="currentColor"/></svg><div class="chap"></div><div class="series">World Within<br>The Shell</div></header>'+
'<section class="stage"><div class="frame"><video playsinline preload="metadata"></video><canvas></canvas><div class="state">Coming soon · 영상 준비 중</div><button class="play" aria-label="영상 재생"></button></div>'+
'<div class="text"><p class="en"></p><p class="ko"></p><p class="cite"></p></div></section>'+
'<footer><span>김성훈 / Kim Sunghoon</span><span>2026</span></footer>';
document.body.appendChild(w);
w.querySelector(".chap").textContent=c.n;w.querySelector(".en").textContent=c.en;w.querySelector(".ko").textContent=c.ko;
var ci=w.querySelector(".cite");if(c.cite)ci.textContent=c.cite;else ci.remove();
var fr=w.querySelector(".frame"),v=w.querySelector("video"),pb=w.querySelector(".play");
v.addEventListener("loadedmetadata",function(){if(v.videoWidth&&v.videoHeight)fr.style.aspectRatio=v.videoWidth+"/"+v.videoHeight;fr.classList.add("ready")});
pb.addEventListener("click",function(){v.controls=true;v.play();fr.classList.add("playing")});
v.addEventListener("play",function(){fr.classList.add("playing")});
v.src="/video/"+k+".mp4?v="+Math.floor(Date.now()/600000);
var cv=w.querySelector("canvas"),x=cv.getContext("2d"),W,H,P=[],d=Math.min(window.devicePixelRatio||1,2);
function sz(){var r=cv.getBoundingClientRect();W=cv.width=r.width*d;H=cv.height=r.height*d;P=[];for(var i=0;i<600;i++){var u=Math.random(),q=Math.random()*6.283;P.push({q:q,r:Math.sqrt(u),s:(Math.random()-.5)*.00025,z:Math.random(),j:Math.random()*6.283})}}
function t(ms){if(fr.classList.contains("ready"))return;x.clearRect(0,0,W,H);var cx=W/2,cy=H/2,R=Math.min(W,H)*.36;
for(var i=0;i<P.length;i++){var p=P[i],q=p.q+ms*p.s,b=1+Math.sin(ms*.0006+p.j)*.04;x.fillStyle="rgba(233,231,227,"+(.12+p.z*.55)+")";x.fillRect(cx+Math.cos(q)*R*.62*p.r*b,cy+Math.sin(q)*R*p.r*b,1.1*d,1.1*d)}requestAnimationFrame(t)}
sz();addEventListener("resize",sz);requestAnimationFrame(t);
})();
