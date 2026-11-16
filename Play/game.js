"use strict";
const $=s=>document.querySelector(s),F={F1:"data:image/jpeg;base64,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",F2:"data:image/jpeg;base64,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"};
const SCENES={
intro:[
{s:6,bg:"linear-gradient(#1b2a49,#0b0d12)",cap:"Astana. 3 a.m. Snow keeps falling. Somebody always pays.",fig:"🌃"},
{s:3,bg:"#2c3e50",face:"F1",cap:"Marek Vale, ex-detective",b:[["They took my badge, my savings, my name.",34,8]]},
{s:3,bg:"#4a1c1c",fig:"🕴️",b:[["Vale is alone. Don Corvo wants him finished.",8,10]],sfx:["CLICK",58,62]},
{s:6,bg:"linear-gradient(#222,#4a0f0f)",face:"F1",cap:"Corvo's villa: far north-east corner of the city. Follow the red beacon.",b:[["Fine. Let's settle the debt.",36,38]],sfx:["BANG!",70,50]}],
end:[
{s:6,bg:"linear-gradient(#e9e4d2,#9a8f7a)",fig:"🕴️",cap:"The Don, on his knees in the snow.",b:[["You think this ends the debt, Vale?",8,28]]},
{s:3,bg:"#223",face:"F2",b:[["It ends tonight.",36,12]],sfx:["BANG!",58,60]},
{s:3,bg:"linear-gradient(#fff,#b33)",fig:"🌹",cap:"Red petals. White snow. Silence."},
{s:6,bg:"linear-gradient(#0b0d12,#1b2a49)",face:"F2",cap:"Dawn over Astana.",b:[["Debt paid.",40,20]]}]};
let state="menu",comicDone=null;
/* ---------- AUDIO (lo-fi synth, no files) ---------- */
let AC,master,lp,nbuf,nextT=0,step=0;const mtof=m=>440*2**((m-69)/12);
function tone(f,t,d,type,v,att=.01){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.05)}
function noise(t,d,v,f1,f2,type="bandpass"){const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=nbuf;fl.type=type;fl.frequency.setValueAtTime(f1,t);fl.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(master);s.start(t);s.stop(t+d+.05)}
function sfx(k){if(!AC)return;const t=AC.currentTime;
if(k=="shot"){noise(t,.25,.9,1800,250);tone(150,t,.18,"sine",.7)}
else if(k=="eshot"){noise(t,.18,.35,1400,300)}
else if(k=="hit"){tone(900,t,.06,"square",.15)}
else if(k=="hurt"){tone(110,t,.25,"sawtooth",.35)}
else if(k=="pick"){tone(660,t,.12,"triangle",.3);tone(990,t+.08,.2,"triangle",.3)}
else if(k=="rel"){tone(300,t,.05,"square",.12);tone(500,t+.5,.05,"square",.12)}
else if(k=="bt"){noise(t,.6,.5,3000,200,"lowpass")}
else if(k=="step"){noise(t,.09,.2,500,120,"lowpass")}else if(k=="page"){noise(t,.12,.3,2000,800)}
else if(k=="die"){tone(220,t,.4,"sawtooth",.25)}}
const PROG=[[33,[57,60,64,67]],[29,[53,57,60,64]],[36,[48,52,55,59]],[31,[55,59,62,65]]];
function sched(){if(!AC||AC.state!=="running")return;nextT=Math.max(nextT,AC.currentTime);while(nextT<AC.currentTime+.3){const sd=60/72/2,pr=PROG[(step>>3)&3],k=step&7,t=nextT+(k&1?.04:0);
if(k==0){pr[1].forEach((n,i)=>{tone(mtof(n),t+i*.01,3.2,"triangle",.045,.5);tone(mtof(n)*1.006,t,3.2,"sine",.03,.5)});tone(mtof(pr[0]),t,2.6,"sine",.28,.03)}
if(k==0||k==3||k==6){tone(120,t,.18,"sine",.5);tone(50,t,.2,"sine",.5)}
if(k==4)noise(t,.14,.25,2500,900);noise(t,.04,.07,7000,6000,"highpass");
if(Math.random()<.6)tone(mtof(pr[1][(Math.random()*4)|0]+12),t,.7,"triangle",.07,.005);
if(k==2&&(step>>3)%2==1&&Math.random()<.5)tone(mtof(pr[1][3]+24),t,1,"sine",.06,.02);
nextT+=sd;step++}}
function audioInit(){if(AC){AC.resume().catch(()=>{});return}AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.6;lp=AC.createBiquadFilter();lp.type="lowpass";lp.frequency.value=2400;master.connect(lp);lp.connect(AC.destination);{const cv=AC.createConvolver(),ib=AC.createBuffer(2,AC.sampleRate*2,AC.sampleRate);for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3)}cv.buffer=ib;const wg=AC.createGain();wg.gain.value=.28;lp.connect(cv);cv.connect(wg);wg.connect(AC.destination)}
nbuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
const cb=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),cd=cb.getChannelData(0);for(let i=0;i<cd.length;i++)cd[i]=Math.random()<.0007?(Math.random()-.5)*.8:0;
const cs=AC.createBufferSource(),cg=AC.createGain();cs.buffer=cb;cs.loop=true;cg.gain.value=.3;cs.connect(cg);cg.connect(master);cs.start();nextT=AC.currentTime+.1;setInterval(sched,100)}
function muffle(on){if(AC)lp.frequency.setTargetAtTime(on?650:2400,AC.currentTime,.12)}
/* ---------- WORLD ---------- */
let scene,cam,ren,gun,snow,boss,P,W,keys={},T={mx:0,my:0,fire:0,sprint:0},clockT=0,lastT=0,flash=0,ending=0;
const BG=new THREE.BoxGeometry(1,1,1),MC={},CG=new THREE.CircleGeometry(.75,16),SM=new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.45});let H;const blob=g=>{const s=new THREE.Mesh(CG,SM);s.rotation.x=-Math.PI/2;s.position.y=.03;g.add(s)};
const mat=(c,basic)=>MC[c+(basic?"b":"")]||(MC[c+(basic?"b":"")]=basic?new THREE.MeshBasicMaterial({color:c}):new THREE.MeshLambertMaterial({color:c}));
const box=(g,w,h,d,c,x,y,z,basic)=>{const m=new THREE.Mesh(BG,mat(c,basic));m.scale.set(w,h,d);m.position.set(x,y,z);g.add(m);return m};
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function cvTex(w,h,fn,rep){const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"));const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=8;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(rep,rep);return t}
const SPEC={robber:{hp:60,sp:3.4,cd:1.5,dmg:7,rng:14,body:0x3a3a44,hat:0x111111,sc:1},mob:{hp:100,sp:2.7,cd:1.0,dmg:10,rng:18,body:0x111114,hat:0x1b1b1b,sc:1},boss:{hp:520,sp:2.2,cd:.5,dmg:12,rng:20,body:0xe9e4d2,hat:0xf2efe6,sc:1.2}};
function spawn(type,x,z){const s=SPEC[type],g=new THREE.Group();
box(g,.22,.8,.25,0x15151a,-.2,.4,0);box(g,.22,.8,.25,0x15151a,.2,.4,0);box(g,.8,.9,.45,s.body,0,1.25,0);box(g,.42,.42,.42,0xd9a066,0,1.9,0);box(g,.12,.14,.55,0x222,.35,1.3,.4);
if(type=="robber"){box(g,.46,.2,.46,s.hat,0,2.12,0);box(g,.44,.22,.05,0x111,0,1.9,.22)}else{box(g,.8,.05,.8,s.hat,0,2.1,0);box(g,.42,.22,.42,s.hat,0,2.23,0);box(g,.1,.5,.02,type=="boss"?0xb3122a:0x8a1020,0,1.3,.24)}
blob(g);g.scale.setScalar(s.sc);g.position.set(x,0,z);scene.add(g);
const e={id:W.en.length,g,type,hp:s.hp,max:s.hp,x,z,cd:Math.random()*2,dead:false,t:0,sc:s.sc,ph:Math.random()*6,alert:false,s};W.en.push(e);return e}
function build(){
scene=new THREE.Scene();scene.background=new THREE.Color(0x090d18);scene.fog=new THREE.Fog(0x090d18,30,240);
cam=new THREE.PerspectiveCamera(72,1,.1,400);cam.rotation.order="YXZ";scene.add(cam);
scene.add(new THREE.HemisphereLight(0x7088b8,0x241a14,1.05));const mo=new THREE.DirectionalLight(0x9ab4ff,.55);mo.position.set(-30,60,20);scene.add(mo);
W={boxes:[],en:[],bul:[],pk:[],fx:[],t:0};P={x:-250,z:-250,y:1.7,yaw:-2.356,pitch:0,hp:100,ammo:12,res:48,bt:100,btOn:false,rel:0,cd:0,kills:0,sprint:0};
const gt=cvTex(256,256,c=>{c.scale(4,4);c.fillStyle="#4b4e55";c.fillRect(0,0,64,64);c.fillStyle="#23252b";c.fillRect(23,0,18,64);c.fillRect(0,23,64,18);c.fillStyle="#b8a13a";for(let i=0;i<64;i+=16){c.fillRect(31,i,2,7);c.fillRect(i,31,7,2)}c.fillStyle="#6a6d75";for(let i=0;i<30;i++)c.fillRect(Math.random()*64,Math.random()*64,.5,.5)},11);
const gr=new THREE.Mesh(new THREE.PlaneGeometry(550,550),new THREE.MeshLambertMaterial({map:gt}));gr.rotation.x=-Math.PI/2;scene.add(gr);
const R=rng(7),wt=[0,1,2].map(k=>cvTex(128,128,c=>{c.fillStyle="#1b1d26";c.fillRect(0,0,128,128);for(let y=0;y<4;y++)for(let x=0;x<4;x++){c.fillStyle=R()<.3?"#ffd36b":"#2b3040";c.fillRect(x*32+7,y*32+6,18,20);c.fillStyle="#0007";c.fillRect(x*32+7,y*32+6,18,2)}}));
const cols=[0x8d8678,0x6c7a89,0x8a5f55,0x6f6a5a];
for(let i=0;i<10;i++)for(let j=0;j<10;j++){const cx=(i-4.5)*50,cz=(j-4.5)*50;
if(i==9&&j==9){const v=new THREE.Group();box(v,16,9,14,0x7a2e2e,cx,4.5,cz-6);box(v,18,1,16,0x2a1010,cx,9.5,cz-6);scene.add(v);W.boxes.push({x0:cx-8,x1:cx+8,z0:cz-13,z1:cz+1,h:10});
for(const [dx,dz] of[[-16,16],[16,16],[-16,-16],[16,-16]])box(scene,1.2,5,1.2,0xb3122a,cx+dx,2.5,cz+dz);continue}
if(R()<.18){for(let k=0;k<3;k++){const tx=cx+(R()-.5)*20,tz=cz+(R()-.5)*20;box(scene,.8,2,.8,0x4a3320,tx,1,tz);const c=new THREE.Mesh(new THREE.ConeGeometry(2.2,5,5),mat(0x1f3d2b));c.position.set(tx,4.5,tz);scene.add(c);W.boxes.push({x0:tx-.5,x1:tx+.5,z0:tz-.5,z1:tz+.5,h:3})}continue}
const w=22+R()*7,d=22+R()*7,h=14+R()*30,tx=wt[(R()*3)|0].clone();tx.needsUpdate=true;tx.repeat.set(Math.max(1,Math.round(w/14)),Math.max(1,Math.round(h/14)));const m=new THREE.Mesh(BG,new THREE.MeshLambertMaterial({map:tx,color:cols[(R()*4)|0]}));m.scale.set(w,h,d);m.position.set(cx,h/2,cz);scene.add(m);W.boxes.push({x0:cx-w/2,x1:cx+w/2,z0:cz-d/2,z1:cz+d/2,h})}
for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){box(scene,.3,5,.3,0x222,i*50+8,2.5,j*50+8);box(scene,.9,.4,.9,0xffd36b,i*50+8,5.2,j*50+8,true)}
const bc=box(scene,1.5,140,1.5,0xff2a3a,225,70,225,true);bc.material=new THREE.MeshBasicMaterial({color:0xff2a3a,fog:false});
mkHero();
const sp=[];for(let i=0;i<700;i++)sp.push(Math.random()*50-25,Math.random()*28,Math.random()*50-25);const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));snow=new THREE.Points(sg,new THREE.PointsMaterial({size:.18,color:0xffffff}));snow.frustumCulled=false;scene.add(snow);
const far=(x,z)=>Math.hypot(x+250,z+250)>70&&!(x>190&&z>190);
for(let c=0;c<14;c++){const x=50*(((R()*11)|0)-5)+(R()-.5)*8,z=(R()-.5)*470;if(!far(x,z))continue;const n=3+((R()*2)|0);for(let k=0;k<n;k++)spawn(R()<.55?"robber":"mob",x+k*2.2,z+(R()-.5)*4)}
for(let c=0;c<18;c++){const x=(R()-.5)*470,z=50*(((R()*11)|0)-5);if(far(x,z))spawn(R()<.6?"robber":"mob",x,z)}
boss=spawn("boss",225,205);boss.alert=false;for(const [dx,dz] of[[-7,-4],[7,-4],[-4,6],[4,6]])spawn("mob",225+dx,205+dz);
for(let c=0;c<26;c++){const x=50*(((R()*11)|0)-5)+(R()-.5)*8,z=(R()-.5)*470;addPk("hp",x,z)}
addPk("hp",-240,-235);addPk("hp",200,215);addPk("ammo",-240,-215)}

function mkHero(){const root=new THREE.Group(),body=new THREE.Group(),sk=0xd9a066;root.add(body);blob(root);
const legs=new THREE.Group(),lL=new THREE.Group(),lR=new THREE.Group();lL.position.set(-.2,.85,0);lR.position.set(.2,.85,0);
for(const l of[lL,lR]){box(l,.26,.85,.28,0x15151a,0,-.42,0);box(l,.28,.12,.4,0x050505,0,-.82,.06)}legs.add(lL,lR);body.add(legs);
const up=new THREE.Group();up.position.y=.85;body.add(up);box(up,.84,.85,.48,0x0d0d10,0,.45,0);box(up,.9,.75,.52,0x0a0a0d,0,-.12,0);box(up,.2,.5,.02,0x1a1a20,0,.55,.25);
const hd=new THREE.Group();hd.position.set(0,1.2,0);up.add(hd);box(hd,.4,.42,.4,sk,0,0,0);box(hd,.44,.2,.44,0x1a120c,0,.2,-.03);box(hd,.44,.03,.03,0x999999,0,.04,.21);
const aR=new THREE.Group();aR.position.set(-.52,.8,0);up.add(aR);box(aR,.2,.2,.7,0x0d0d10,0,0,.32);box(aR,.1,.12,.5,0x2a2a2a,0,.02,.8);box(aR,.14,.14,.14,sk,0,0,.7);
const muz=new THREE.Object3D();muz.position.set(0,.02,1.1);aR.add(muz);const fl=box(aR,.25,.25,.1,0xffe08a,0,.02,1.15,true);fl.visible=false;
const aL=new THREE.Group();aL.position.set(.52,.8,0);aL.rotation.set(-1.25,.5,0);up.add(aL);box(aL,.2,.2,.6,0x0d0d10,0,0,.28);
scene.add(root);H={root,body,legs,lL,lR,up,aR,muz,fl,ph:0,la:0,fw:0,st:0,kick:0,hurt:0,dead:0,stp:0}}
function heroAnim(dt){if(state=="dead"){H.dead+=dt;H.body.rotation.x=-Math.min(1.5,H.dead*2.6);H.body.position.y=Math.min(.3,H.dead*.5);H.up.rotation.x=0;return}
const run=Math.hypot(H.fw,H.st)>.05;let ph=run?Math.atan2(-H.st,H.fw):0,sg=1;if(ph>1.5708){ph-=Math.PI;sg=-1}else if(ph<-1.5708){ph+=Math.PI;sg=-1}
H.la+=(ph-H.la)*Math.min(1,dt*14);H.legs.rotation.y=H.la;
if(run){H.ph+=dt*((keys.ShiftLeft||keys.ShiftRight||T.sprint)?12:8.5)*(P.btOn?1.5:1);const s=Math.floor(H.ph/Math.PI);if(s!=H.stp){H.stp=s;sfx("step")}}else H.ph*=.9;
const sw=run?Math.sin(H.ph)*.9*sg:0;H.lL.rotation.x=sw;H.lR.rotation.x=-sw;
H.kick=Math.max(0,H.kick-dt*8);H.hurt=Math.max(0,H.hurt-dt*2.2);
H.up.position.y=.85+(run?Math.abs(Math.sin(H.ph))*.06:Math.sin(performance.now()*.002)*.012);
H.up.rotation.x=-.55*H.hurt+H.kick*.05;H.aR.rotation.x=-P.pitch-H.kick*.25-.7*H.hurt;H.fl.visible=H.kick>.6;H.body.rotation.x=0;H.body.position.y=0}
function heroCam(dt=1/60){const cp=Math.cos(P.pitch),fx=-Math.sin(P.yaw)*cp,fy=Math.sin(P.pitch),fz=-Math.cos(P.yaw)*cp,o={x:P.x,y:1.9,z:P.z};
const offset={x:Math.cos(P.yaw)*.75-fx*3.6,y:-fy*3.6,z:-Math.sin(P.yaw)*.75-fz*3.6},length=Math.hypot(offset.x,offset.y,offset.z),d={x:offset.x/length,y:offset.y/length,z:offset.z/length};
const safe=Math.max(.08,Math.min(length,wallT(o,d,length)-.25));
cameraReach=cameraReach===null||safe<cameraReach?safe:cameraReach+(safe-cameraReach)*(1-Math.exp(-Math.max(0,dt)*10));
cam.position.set(o.x+d.x*cameraReach,Math.max(.4,o.y+d.y*cameraReach),o.z+d.z*cameraReach);cam.rotation.set(P.pitch,P.yaw,0)}
function addPk(t,x,z){const m=new THREE.Group();if(t=="hp"){box(m,.5,.3,.35,0xeeeeee,0,0,0);box(m,.14,.32,.1,0xcc2222,0,.01,.18)}else box(m,.4,.3,.3,0xd9a42b,0,0,0);m.position.set(x,.6,z);scene.add(m);W.pk.push({m,t,x,z})}
function rayBox(o,d,b,mx){let t0=0,t1=mx;for(const[p,v,lo,hi]of[[o.x,d.x,b.x0,b.x1],[o.z,d.z,b.z0,b.z1],[o.y,d.y,0,b.h]]){if(Math.abs(v)<1e-8){if(p<lo||p>hi)return Infinity}else{let a=(lo-p)/v,c=(hi-p)/v;if(a>c){const q=a;a=c;c=q}t0=Math.max(t0,a);t1=Math.min(t1,c);if(t0>t1)return Infinity}}return t0}
function wallT(o,d,mx){let m=mx;for(const b of W.boxes){const t=rayBox(o,d,b,m);if(t<m)m=t}return m}
function push(p,r){for(const b of W.boxes){const cx=Math.max(b.x0,Math.min(p.x,b.x1)),cz=Math.max(b.z0,Math.min(p.z,b.z1)),dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<r*r){if(d2<1e-6){p.x=b.x0-r;continue}const d=Math.sqrt(d2),k=(r-d)/d;p.x+=dx*k;p.z+=dz*k}}p.x=Math.max(-268,Math.min(268,p.x));p.z=Math.max(-268,Math.min(268,p.z))}
/* ---------- GAMEPLAY ---------- */
function say(t,s=3){$("#msg").textContent=t;W.msgT=s}
function hurt(d){if(state!="play")return;syncCore('Hurt',d);window.SnowHost.saveProgress();H.hurt=1;$("#hurt").style.opacity=.8;sfx("hurt");if(P.hp<=0){P.hp=0;state="dead";H.dead=0;resetInput();exitLock();syncUI();hud();deathTimer=setTimeout(()=>{if(state==="dead"){$("#dead").style.display="flex";suspendAudio();requestFrame();$("#retry").focus({preventScroll:true})}},1500);sfx("die");muffle(true)}}
function ebullet(e){const o=new THREE.Vector3(e.x,1.4*e.sc,e.z),d=new THREE.Vector3(P.x-e.x+(Math.random()-.5)*2.2,P.y-.3-o.y+(Math.random()-.5)*.8,P.z-e.z+(Math.random()-.5)*2.2).normalize();
const m=new THREE.Mesh(BG,mat(0xffdd55,true));m.scale.set(.12,.12,.6);m.position.copy(o);m.lookAt(o.clone().add(d));scene.add(m);W.bul.push({m,v:d.multiplyScalar(30),dmg:e.s.dmg,life:3});sfx("eshot")}
function kill(e,headshot=false){e.dead=true;e.t=0;syncCore('RegisterKill',e.id,e.type,headshot);window.SnowHost.saveProgress();if(Math.random()<.6)addPk("ammo",e.x,e.z);if(e.type=="boss")startEnding()}
function shoot(){const shot=coreCommand('Shoot');if(shot.startedReload)sfx('rel');if(!shot.fired)return;flash=.08;H.kick=1;sfx("shot");
const o=cam.position.clone(),d=new THREE.Vector3();cam.getWorldDirection(d);d.x+=(Math.random()-.5)*.012;d.y+=(Math.random()-.5)*.012;d.normalize();
let best=wallT(o,d,140),hit=null,hs=false;for(const e of W.en){if(e.dead)continue;for(const[cy,r,h]of[[1.9*e.sc,.3*e.sc,1],[1.2*e.sc,.6*e.sc,0]]){const c=new THREE.Vector3(e.x,cy,e.z).sub(o),t=c.dot(d);if(t<0||t>best)continue;if(c.addScaledVector(d,-t).length()<r){best=t;hit=e;hs=!!h;break}}}
H.root.updateMatrixWorld(true);const end=o.clone().addScaledVector(d,best),a=H.muz.getWorldPosition(new THREE.Vector3()),ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,end]),new THREE.LineBasicMaterial({color:0xffe9a0}));scene.add(ln);W.fx.push({m:ln,life:.07});
if(hit){hit.hp-=coreCall('ShotDamage',hs);hit.alert=true;sfx("hit");if(hs)say("HEADSHOT",1);for(const q of W.en)if(!q.dead&&Math.hypot(q.x-hit.x,q.z-hit.z)<25)q.alert=true;if(hit.hp<=0&&!hit.dead)kill(hit,hs)}
}
function reload(){if(coreCommand('Reload').accepted)sfx('rel')}
function setBT(on){const result=coreCommand('SetSlow',on);if(!result.accepted)return;muffle(P.btOn);if(on)sfx('bt');if(controls)syncUI()}
function startEnding(){state="ending";ending=0;resetInput();syncUI();document.exitPointerLock&&document.exitPointerLock();muffle(true);W.pet=[];for(let i=0;i<90;i++){const m=new THREE.Mesh(BG,mat(0xc2102a,true));m.scale.set(.2,.03,.15);m.position.set(boss.x,1.6,boss.z);scene.add(m);const a=Math.random()*6.28,s=1+Math.random()*3;W.pet.push({m,v:new THREE.Vector3(Math.cos(a)*s,2+Math.random()*4,Math.sin(a)*s)})}}
function step_(dt){const priorSlow=P.btOn;syncCore('Tick',dt);if(priorSlow!==P.btOn){muffle(P.btOn);syncUI()}const ts=P.btOn?.28:1,sd=dt*ts;W.t+=sd;
const sp=((keys.ShiftLeft||keys.ShiftRight||T.sprint)?7.5:4.8)*(P.btOn?1.5:1),fw=(keys.KeyW?1:0)-(keys.KeyS?1:0)-T.my,st=(keys.KeyD?1:0)-(keys.KeyA?1:0)+T.mx,l=Math.hypot(fw,st)||1,k=Math.min(1,l);
P.x+=(-Math.sin(P.yaw)*fw+Math.cos(P.yaw)*st)/l*k*sp*dt;P.z+=(-Math.cos(P.yaw)*fw-Math.sin(P.yaw)*st)/l*k*sp*dt;push(P,.45);
if(keys.mouse||T.fire)shoot();H.fw=fw*k/l;H.st=st*k/l;H.root.position.set(P.x,0,P.z);H.root.rotation.y=P.yaw+Math.PI;heroAnim(dt);
for(const e of W.en){if(e.dead){e.t+=dt;e.g.rotation.x=-Math.min(1,e.t/.4)*1.5;continue}
const dx=P.x-e.x,dz=P.z-e.z,d=Math.max(.001,Math.hypot(dx,dz));if(d>80)continue;e.g.rotation.y=Math.atan2(dx,dz);if(e.hp<e.max)e.alert=true;
const o={x:e.x,y:1.5,z:e.z},los=d<48&&wallT(o,{x:dx/d,y:0,z:dz/d},d)>=d-.2;let vx=0,vz=0;
if(los){e.alert=true;const nx=dx/d,nz=dz/d,sw=Math.sin(W.t*1.3+e.ph);if(d>e.s.rng){vx=nx;vz=nz}else if(d<e.s.rng*.55){vx=-nx;vz=-nz}vx+=-nz*sw*.7;vz+=nx*sw*.7;
e.cd-=sd;if(e.cd<=0){ebullet(e);e.cd=e.s.cd*(.7+Math.random()*.6)}}
else if(e.alert&&e.type!="boss"||d<28){vx=dx/d+Math.sin(W.t+e.ph)*.5;vz=dz/d+Math.cos(W.t+e.ph)*.5}
e.x+=vx*e.s.sp*sd;e.z+=vz*e.s.sp*sd;push(e,.5);e.g.position.set(e.x,0,e.z)}
for(let i=W.bul.length-1;i>=0;i--){const b=W.bul[i];b.life-=sd;b.m.position.addScaledVector(b.v,sd);const p=b.m.position;let dead=b.life<=0;
for(const q of W.boxes)if(p.x>q.x0&&p.x<q.x1&&p.z>q.z0&&p.z<q.z1&&p.y<q.h){dead=true;break}
if(p.y<0)dead=true;if(!dead&&Math.hypot(p.x-P.x,p.z-P.z)<.7&&Math.abs(p.y-1.2)<1.1){hurt(b.dmg);dead=true}
if(dead){scene.remove(b.m);W.bul.splice(i,1)}}
for(const q of W.pk){if(q.got)continue;q.m.rotation.y+=dt*2;if(!q.got&&Math.hypot(q.x-P.x,q.z-P.z)<1.6){if(!coreCommand('Pickup',q.t,q.t==='hp'?25:12).accepted)continue;q.got=true;q.m.visible=false;sfx("pick")}}
for(let i=W.fx.length-1;i>=0;i--){W.fx[i].life-=dt;if(W.fx[i].life<=0){const effect=W.fx[i].m;scene.remove(effect);effect.geometry.dispose();effect.material.dispose();W.fx.splice(i,1)}}
if(W.msgT>0){W.msgT-=dt;if(W.msgT<=0)$("#msg").textContent=""}}
function endingStep(dt){ending+=dt;const sd=dt*.25,a=1+ending*.4;for(const e of W.en)if(e.dead&&e!==boss)continue;
boss.g.rotation.x=-Math.min(1.45,ending*.35);boss.g.rotation.y+=sd*3;boss.g.position.y=Math.max(0,Math.sin(Math.min(ending,2.4)*1.3)*.8);
for(const p of W.pet){p.v.y-=2.5*sd;p.m.position.addScaledVector(p.v,sd);p.m.rotation.x+=sd*4;p.m.rotation.z+=sd*3;if(p.m.position.y<.05){p.m.position.y=.05;p.v.set(0,0,0)}}
cam.position.set(boss.x+Math.cos(a)*6,2.2+ending*.25,boss.z+Math.sin(a)*6);cam.lookAt(boss.x,1.2,boss.z);H.fw=H.st=0;heroAnim(dt);
$("#white").style.opacity=config.effects&&ending>5.5?Math.min(1,(ending-5.5)/1.3):0;
if(ending>7){state="comic";$("#hud").style.display="none";comic("end",()=>{state="fin";$("#fin").style.display="flex";$("#white").style.opacity=0;syncUI();suspendAudio();requestFrame();$("#playAgain").focus({preventScroll:true})})}}
const mc=$("#map").getContext("2d");
/* ---------- C# authoritative state bridge ---------- */
let selectedDifficulty='normal',lastCoreSnapshot=null;
function coreCall(method,...args){if(!window.SnowCoreRef)throw new Error('C# game session is not initialized');return window.SnowCoreRef.invokeMethod(method,...args)}
function applyCoreSnapshot(snapshot){
  lastCoreSnapshot=snapshot;
  if(P){P.hp=snapshot.health;P.ammo=snapshot.ammo;P.res=snapshot.reserve;P.bt=snapshot.slowEnergy;P.btOn=snapshot.slowActive;P.rel=snapshot.reloadRemaining;P.cd=snapshot.fireCooldown;P.kills=snapshot.kills}
  return snapshot;
}
function syncCore(method,...args){return applyCoreSnapshot(coreCall(method,...args))}
function coreCommand(method,...args){const result=coreCall(method,...args);applyCoreSnapshot(result.snapshot);return result}
/* ---------- UI, preferences and lifecycle ---------- */
let config=GameSettings.get(),controls,inputMode='keyboard',resumeState='play',settingsReturn='menu';
let frameHandle=0,renderPending=true,hudBudget=0,mapBudget=0,deathTimer=0,mapBackdrop=null;
let hadPointerLock=false,mouseDrag=false,worldReady=false,mouseDragPoint=null,lockPending=false,rawMouseSupported=true,cameraReach=null;
const dom={hp:$('#hp i'),bt:$('#bt i'),am:$('#am'),dist:$('#dist'),arrow:$('#arrow'),boss:$('#boss'),bossBar:$('#boss i'),hurt:$('#hurt')};
const isTouch=()=>inputMode==='touch';
const isActive=()=>state==='play'||state==='ending'||(state==='dead'&&H&&H.dead<1.5);
function requestFrame(){renderPending=true;if(!frameHandle)frameHandle=requestAnimationFrame(frame)}
function resetInput(){keys={};T.mx=T.my=T.fire=T.sprint=0;mouseDrag=false;mouseDragPoint=null;if(controls)controls.reset()}
function exitLock(){if(document.pointerLockElement&&document.exitPointerLock)document.exitPointerLock()}
function hideScreens(){for(const el of document.querySelectorAll('.scr'))el.style.display='none'}
function syncUI(){
  syncCore('SetPhase',state);
  document.body.dataset.state=state;document.body.dataset.input=inputMode;
  $('#hud').style.display=['play','paused','ending'].includes(state)?'block':'none';
  $('#touch').style.display=state==='play'&&isTouch()?'block':'none';
  $('#pauseButton').style.display=state==='play'?'':'none';
  $('#fullscreenButton').style.display=state==='play'?'':'none';
  $('#tb').setAttribute('aria-pressed',String(!!(P&&P.btOn)));
  $('#tb').dataset.active=String(!!(P&&P.btOn));
  $('#tb').classList.toggle('active',!!(P&&P.btOn));
}
function safeAudio(){
  try{audioInit();if(master)master.gain.value=config.volume/100;if(AC){nextT=AC.currentTime+.05;AC.resume().catch(()=>{})}}
  catch(_){/* A silent game is still playable when audio is blocked. */}
}
function suspendAudio(){if(AC&&AC.state==='running')AC.suspend().catch(()=>{})}
function applyPreferences(){
  document.body.dataset.effects=config.effects?'on':'off';
  if(master)master.gain.value=config.volume/100;
  if(controls)controls.setMode(config.controlsMode);
  // Razor @bind owns preference controls and output text.
  resize();syncUI();requestFrame();
}
function effectiveQuality(){return config.quality==='auto'?(isTouch()?'low':'medium'):config.quality}
function resize(){
  if(!ren)return;
  const quality=effectiveQuality(),limits={low:[960,540,220],medium:[1280,720,450],high:[1920,1080,700]}[quality];
  const width=Math.max(1,innerWidth),height=Math.max(1,innerHeight),scale=Math.min(1,limits[0]/width,limits[1]/height);
  ren.setPixelRatio(1);ren.setSize(Math.max(1,Math.round(width*scale)),Math.max(1,Math.round(height*scale)),false);
  cam.aspect=width/height;cam.updateProjectionMatrix();
  if(snow)snow.geometry.setDrawRange(0,config.effects?limits[2]:0);
  requestFrame();
}
function cacheMap(){
  mapBackdrop=document.createElement('canvas');mapBackdrop.width=mapBackdrop.height=110;
  const ctx=mapBackdrop.getContext('2d'),k=110/560;ctx.fillStyle='#555a';
  for(const b of W.boxes)if(b.h>12)ctx.fillRect((b.x0+280)*k,(b.z0+280)*k,(b.x1-b.x0)*k,(b.z1-b.z0)*k);
}
function hud(updateMap=true){
  syncCore('ReportPosition',P.x,P.z,boss.x,boss.z);
  // Health, slow-time and ammunition are rendered by Razor from GameSnapshot.
  const dx=boss.x-P.x,dz=boss.z-P.z,d=Math.hypot(dx,dz);
  dom.dist.textContent='КОРВО · '+Math.round(d)+' м · '+P.kills+' устранено';
  dom.arrow.style.transform='rotate('+(Math.atan2(dx,-dz)+P.yaw)+'rad)';
  dom.boss.style.display=d<75&&!boss.dead?'block':'none';dom.bossBar.style.width=Math.max(0,boss.hp/boss.max*100)+'%';
  $('#tb').setAttribute('aria-pressed',String(P.btOn));$('#tb').dataset.active=String(P.btOn);$('#tb').classList.toggle('active',P.btOn);
  if(!updateMap)return;
  const k=110/560,X=x=>(x+280)*k,Z=z=>(z+280)*k;mc.clearRect(0,0,110,110);if(mapBackdrop)mc.drawImage(mapBackdrop,0,0);
  mc.fillStyle='#e33';for(const e of W.en)if(!e.dead&&(e.alert||Math.hypot(e.x-P.x,e.z-P.z)<40))mc.fillRect(X(e.x)-1,Z(e.z)-1,3,3);
  mc.fillStyle='#ff0';mc.fillRect(X(boss.x)-2,Z(boss.z)-2,5,5);mc.fillStyle='#4f4';mc.fillRect(X(P.x)-2,Z(P.z)-2,4,4);
}
function frame(ts){
  frameHandle=0;if(!scene||document.hidden)return;
  const dt=Math.min(.05,(lastT?ts-lastT:16)/1000);lastT=ts;
  const active=isActive();if(!active&&!renderPending)return;renderPending=false;
  if(state==='play'){
    step_(dt);heroCam(dt);hudBudget+=dt;mapBudget+=dt;
    if(hudBudget>=.1){hud(mapBudget>=.2);hudBudget=0;if(mapBudget>=.2)mapBudget=0}
  }else if(state==='dead'){heroAnim(dt);heroCam(dt)}
  else if(state==='ending')endingStep(dt);
  if(active&&config.effects){
    const sp=snow.geometry.attributes.position,count=Math.min(sp.count,snow.geometry.drawRange.count);
    for(let i=0;i<count;i++){let y=sp.getY(i)-2.5*dt;if(y<0)y+=28;sp.setY(i,y);sp.setX(i,sp.getX(i)+Math.sin(ts*.001+i)*.01)}
    sp.needsUpdate=true;snow.position.set(cam.position.x,0,cam.position.z);
  }
  dom.hurt.style.opacity=config.effects?Math.max(0,+dom.hurt.style.opacity-dt*1.5):0;
  ren.render(scene,cam);
  if(isActive())frameHandle=requestAnimationFrame(frame);
}
function pauseGame(reason='Игра на паузе'){
  if(state!=='play'&&state!=='ending')return;
  resumeState=state;state='paused';resetInput();exitLock();suspendAudio();hideScreens();
  $('#pauseReason').textContent=reason;$('#pause').style.display='flex';syncUI();requestFrame();$('#resume').focus({preventScroll:true});
}
function resumeGame(){
  if(state!=='paused')return;
  hideScreens();resetInput();state=resumeState;lastT=0;safeAudio();syncUI();requestFrame();if(state==='play')lock();
}
function showMenu(){
  state='menu';resetInput();exitLock();suspendAudio();clearTimeout(deathTimer);hideScreens();
  $('#white').style.opacity=0;dom.hurt.style.opacity=0;$('#menu').style.display='flex';syncUI();requestFrame();$('#go').focus({preventScroll:true});
}
function disposeWorld(){
  if(!scene)return;
  const geometries=new Set(),materials=new Set(),textures=new Set(),sharedMaterials=new Set([SM,...Object.values(MC)]);
  scene.traverse(obj=>{
    if(obj.geometry&&obj.geometry!==BG&&obj.geometry!==CG)geometries.add(obj.geometry);
    for(const material of Array.isArray(obj.material)?obj.material:[obj.material])if(material){
      if(material.map)textures.add(material.map);if(!sharedMaterials.has(material))materials.add(material);
    }
  });
  for(const texture of textures)texture.dispose();for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();
  scene.clear();
}
function resetWorld(){
  resetInput();clearTimeout(deathTimer);disposeWorld();ending=0;flash=0;cameraReach=null;build();syncCore('Reset',selectedDifficulty);worldReady=true;
  $('#white').style.opacity=0;dom.hurt.style.opacity=0;$('#msg').textContent='';cacheMap();resize();heroCam();hud();
}
function restartGame(){safeAudio();hideScreens();resetWorld();begin2()}
function comic(name,done){
  state='comic';resetInput();exitLock();hideScreens();const el=$('#comic');el.style.display='block';
  let h='<div class="page">';for(const p of SCENES[name])h+=`<div class="p" style="grid-column:span ${p.s};background:${p.bg}">`+(p.cap?`<div class="cap">${p.cap}</div>`:'')+(p.fig?`<div class="fig">${p.fig}</div>`:'')+(p.face?`<img class="face" alt="Marek Vale" src="${F[p.face]}">`:'')+(p.sfx?`<div class="sfx" style="left:${p.sfx[1]}%;top:${p.sfx[2]}%">${p.sfx[0]}</div>`:'')+(p.b||[]).map(b=>`<div class="b" style="left:${b[1]}%;top:${b[2]}%">${b[0]}</div>`).join('')+'</div>';
  el.innerHTML=h+'</div><button id="nx" lang="ru">'+(name==='intro'?'В ИГРУ':'ДАЛЬШЕ')+' <span aria-hidden="true">→</span></button>';
  el.scrollTop=0;comicDone=done;sfx('page');$('#nx').onclick=nextComic;$('#nx').focus({preventScroll:true});syncUI();requestFrame();
}
function nextComic(){if(state!=='comic')return;$('#comic').style.display='none';const f=comicDone;comicDone=null;if(f)f()}
function begin(){state='play';lastT=0;resetInput();safeAudio();say('Следуй к красному маяку. Найди Дона Корво.',5);muffle(P.btOn);syncUI();hud();requestFrame();lock()}
function begin2(){hideScreens();begin()}
async function lock(){
  if(state!=='play'||isTouch()||lockPending||!document.body.requestPointerLock||document.pointerLockElement)return;
  lockPending=true;
  try{
    try{await document.body.requestPointerLock(rawMouseSupported?{unadjustedMovement:true}:undefined)}
    catch(error){
      if(!rawMouseSupported||error.name!=='NotSupportedError')throw error;
      rawMouseSupported=false;
      if(state==='play'&&!isTouch()&&!document.hidden)await document.body.requestPointerLock();
    }
  }catch(_){if(state==='play')say('Для обзора удерживай и двигай мышь.',4)}
  finally{lockPending=false}
}
function openSettings(){
  if(state==='play'||state==='ending')pauseGame();settingsReturn=state==='paused'?'paused':'menu';state='settings';
  resetInput();hideScreens();$('#settingsScreen').style.display='flex';syncUI();requestFrame();$('#settingsBack').focus({preventScroll:true});
}
function closeSettings(){
  state=settingsReturn;hideScreens();$(state==='paused'?'#pause':'#menu').style.display='flex';syncUI();requestFrame();
  $(state==='paused'?'#resume':'#settingsButton').focus({preventScroll:true});
}
function boot(){
  if(ren)return;
  ren=new THREE.WebGLRenderer({canvas:$('#c'),antialias:false,powerPreference:'default'});
  build();worldReady=true;cacheMap();heroCam();
  controls=createGameControls({mode:config.controlsMode,isPlaying:()=>state==='play',
    onMove:(x,y)=>{T.mx=x;T.my=y},onLook:(dx,dy)=>{if(state==='play'){const s=.0045*config.sensitivity/100;P.yaw-=dx*s;P.pitch=Math.max(-1.4,Math.min(1.4,P.pitch-dy*s))}},
    onFire:value=>{T.fire=value?1:0},onSprint:value=>{T.sprint=value?1:0},onReload:()=>reload(),onSlow:()=>{setBT(!P.btOn);return P.btOn},
    onMode:mode=>{inputMode=mode;resetInput();syncUI();resize()}
  });
  applyPreferences();syncUI();hud();requestFrame();
  addEventListener('resize',()=>{resetInput();resize()});
  if(window.visualViewport)visualViewport.addEventListener('resize',resize);
  if(screen.orientation)screen.orientation.addEventListener('change',()=>{resetInput();if(state==='play')pauseGame('Экран повёрнут. Нажми «Продолжить», когда будешь готов.')});
  $('#c').addEventListener('webglcontextlost',event=>{event.preventDefault();window.SnowGame.stop();$('#go').disabled=true;$('#loadErrorText').textContent='Браузер потерял графический контекст. Нажми «Повторить запуск».';$('#loadError').hidden=false;$('#loadRetry').focus({preventScroll:true})});
  $('#c').addEventListener('webglcontextrestored',()=>location.reload());
}
function newGame(difficulty='normal'){selectedDifficulty=['easy','normal','hard'].includes(difficulty)?difficulty:'normal';safeAudio();resetWorld();comic('intro',begin2)}
function applySettings(patch){config=GameSettings.set(patch);applyPreferences()}
function fullscreen(){try{const operation=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();if(operation&&operation.catch)operation.catch(()=>say('Полноэкранный режим недоступен в этом браузере.',3))}catch(_){say('Полноэкранный режим недоступен в этом браузере.',3)}}
// Razor EventCallbacks own menu, settings and pause actions. Touch input remains native.
if(!document.documentElement.requestFullscreen)$('#fullscreenButton').hidden=true;
addEventListener('keydown',event=>{
  if(event.target.matches('input,select,textarea'))return;
  if(['Space','Enter'].includes(event.code)&&event.target.closest('#touch button'))return;
  if(event.code==='Escape'){
    event.preventDefault();if(state==='play'||state==='ending')pauseGame();else if(state==='paused')resumeGame();else if(state==='settings')closeSettings();return;
  }
  if(state==='play'){
    keys[event.code]=true;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.code))event.preventDefault();
    if(!event.repeat){if(event.code==='KeyR')reload();if(event.code==='Space'||event.code==='KeyQ')setBT(!P.btOn);if(event.code==='KeyP')pauseGame()}
  }else if(state==='comic'&&!event.repeat&&['Space','Enter'].includes(event.code)&&event.target.tagName!=='BUTTON'){event.preventDefault();nextComic()}
});
addEventListener('keyup',event=>{keys[event.code]=false});
function isGameMouseTarget(event){return event.target===$('#c')||!!document.pointerLockElement&&event.target===document.pointerLockElement}
document.addEventListener('pointerdown',event=>{
  if(state!=='play'||event.pointerType!=='mouse'||isTouch()||!isGameMouseTarget(event))return;
  // Pointer lock retargets mouse events to BODY; a short click must fire between frames too.
  if(event.button===0){mouseDrag=true;mouseDragPoint={id:event.pointerId,x:event.clientX,y:event.clientY};keys.mouse=true;shoot();lock()}
  if(event.button===2){event.preventDefault();setBT(!P.btOn)}
});
function applyMouseLook(dx,dy){if(!Number.isFinite(dx)||!Number.isFinite(dy))return;const s=.0022*config.sensitivity/100;P.yaw-=dx*s;P.pitch=Math.max(-1.4,Math.min(1.4,P.pitch-dy*s))}
addEventListener('mousemove',event=>{
  if(state!=='play'||isTouch()||!document.pointerLockElement||event.target!==document.pointerLockElement)return;
  if(event.sourceCapabilities&&event.sourceCapabilities.firesTouchEvents)return;
  applyMouseLook(event.movementX,event.movementY);
});
document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||document.pointerLockElement||!mouseDragPoint||event.pointerId!==mouseDragPoint.id)return;
  if(state!=='play'||isTouch()||!(event.buttons&1)){mouseDragPoint=null;mouseDrag=false;keys.mouse=false;return}
  const dx=event.clientX-mouseDragPoint.x,dy=event.clientY-mouseDragPoint.y;
  mouseDragPoint.x=event.clientX;mouseDragPoint.y=event.clientY;applyMouseLook(dx,dy);
});
addEventListener('pointerup',event=>{if(event.pointerType==='mouse'&&event.button===0){keys.mouse=false;mouseDrag=false;mouseDragPoint=null}});
addEventListener('pointercancel',event=>{if(event.pointerType==='mouse'){keys.mouse=false;mouseDrag=false;mouseDragPoint=null}});
document.addEventListener('contextmenu',event=>{if(state==='play'&&isGameMouseTarget(event))event.preventDefault()});
document.addEventListener('pointerlockchange',()=>{const locked=!!document.pointerLockElement;if(locked){mouseDragPoint=null;mouseDrag=false}if(hadPointerLock&&!locked&&state==='play')pauseGame('Курсор освобождён. Игра на паузе.');hadPointerLock=locked});
addEventListener('blur',()=>{resetInput();pauseGame('Окно игры неактивно. Нажми «Продолжить».')});
document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();pauseGame('Игра свёрнута. Нажми «Продолжить».');suspendAudio()}else{lastT=0;requestFrame()}});
window.SnowGame={boot,newGame,restart:restartGame,resume:resumeGame,pause:pauseGame,menu:showMenu,openSettings,closeSettings,applySettings,fullscreen,stop:()=>{state='error';resetInput();suspendAudio();exitLock();if(frameHandle)cancelAnimationFrame(frameHandle);frameHandle=0;hideScreens();$('#menu').style.display='flex';syncUI()}};
