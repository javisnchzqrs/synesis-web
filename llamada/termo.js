/* Visual 3D de «La filosofía»: termómetro (lo habitual) y termostato (con Synesis).
   API: window.TermoAPI = {montar(host), modo('hab'|'syn'), accion(i), ajustar(), reiniciar()} */
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const reloj=()=>performance.now()/1000;
const R=new THREE.WebGLRenderer({antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
R.toneMapping=THREE.ACESFilmicToneMapping;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const escena=new THREE.Scene();
const FONDO_C=new THREE.Color('#F4E6D9'),FONDO_F=new THREE.Color('#EBF0E8');
escena.background=FONDO_C.clone();
escena.environment=new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(),.04).texture;
const cam=new THREE.PerspectiveCamera(30,1,.1,100);
const MIRA=new THREE.Vector3(0,-.1,0);let miraX=0;
const sol=new THREE.DirectionalLight(0xfff1e2,2.1);sol.position.set(4,6,6);sol.castShadow=true;
sol.shadow.mapSize.set(2048,2048);sol.shadow.radius=10;Object.assign(sol.shadow.camera,{left:-6,right:6,top:6,bottom:-6});
escena.add(sol);
const hemi=new THREE.HemisphereLight(0xfff3e8,0xe6d3bf,.7);escena.add(hemi);
const pared=new THREE.Mesh(new THREE.PlaneGeometry(40,30),new THREE.ShadowMaterial({opacity:.10}));
pared.position.z=-.42;pared.receiveShadow=true;escena.add(pared);

/* ── termómetro ── */
const T=new THREE.Group();escena.add(T);
const Y0=-1.62,ALTO=4.15;
const tabla=new THREE.Mesh(new RoundedBoxGeometry(1.75,6.3,.2,6,.24),new THREE.MeshPhysicalMaterial({color:'#FBF8F3',roughness:.55,clearcoat:.4,clearcoatRoughness:.5}));
tabla.position.set(0,.45,-.3);tabla.castShadow=true;tabla.receiveShadow=true;T.add(tabla);
const cv=document.createElement('canvas');cv.width=8;cv.height=256;const cx=cv.getContext('2d');
const gr=cx.createLinearGradient(0,256,0,0);gr.addColorStop(0,'#8FAF9A');gr.addColorStop(.5,'#E7C9A9');gr.addColorStop(1,'#C4785D');cx.fillStyle=gr;cx.fillRect(0,0,8,256);
const tf=new THREE.CanvasTexture(cv);tf.colorSpace=THREE.SRGBColorSpace;
const franja=new THREE.Mesh(new THREE.PlaneGeometry(.12,ALTO),new THREE.MeshBasicMaterial({map:tf}));
franja.position.set(.46,Y0+ALTO/2,-.19);T.add(franja);
for(let k=0;k<=10;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(k%5?.12:.22,.022,.02),new THREE.MeshBasicMaterial({color:'#B9AE9E'}));m.position.set(-.42-(k%5?0:.05),Y0+k*ALTO/10,-.19);T.add(m);}
const vidrio=new THREE.MeshPhysicalMaterial({color:'#ffffff',transmission:1,roughness:.04,thickness:.35,ior:1.45,clearcoat:1,clearcoatRoughness:.05});
const tubo=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,ALTO+.3,48,1,true),vidrio);tubo.position.y=Y0+ALTO/2+.1;T.add(tubo);
const tapa=new THREE.Mesh(new THREE.SphereGeometry(.2,32,16,0,Math.PI*2,0,Math.PI/2),vidrio);tapa.position.y=Y0+ALTO+.25;T.add(tapa);
const bulbo=new THREE.Mesh(new THREE.SphereGeometry(.46,48,32),vidrio);bulbo.position.y=Y0-.22;bulbo.castShadow=true;T.add(bulbo);
const C_CALMA=new THREE.Color('#6D9278'),C_TENSION=new THREE.Color('#C4785D');
const matLiq=new THREE.MeshPhysicalMaterial({color:C_TENSION.clone(),roughness:.2,clearcoat:.8,emissive:C_TENSION.clone(),emissiveIntensity:.12});
const gCol=new THREE.CylinderGeometry(.115,.115,1,32);gCol.translate(0,.5,0);
const col=new THREE.Mesh(gCol,matLiq);col.position.y=Y0-.2;T.add(col);
const gota=new THREE.Mesh(new THREE.SphereGeometry(.115,32,16),matLiq);T.add(gota);
const bLiq=new THREE.Mesh(new THREE.SphereGeometry(.36,48,32),matLiq);bLiq.position.y=Y0-.22;T.add(bLiq);

/* ── termostato ── */
const D=new THREE.Group();D.position.set(2.75,.45,0);escena.add(D);
const cuerpo=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.3,.34,96),new THREE.MeshPhysicalMaterial({color:'#FBF8F3',roughness:.35,clearcoat:.8,clearcoatRoughness:.2}));
cuerpo.rotation.x=Math.PI/2;cuerpo.castShadow=true;D.add(cuerpo);
const cara=new THREE.Mesh(new THREE.CircleGeometry(1.02,96),new THREE.MeshPhysicalMaterial({color:'#F6F1EA',roughness:.6}));cara.position.z=.175;D.add(cara);
const arco=(a0,a1,r)=>{const pts=[];for(let i=0;i<=80;i++){const a=a0+(a1-a0)*i/80;pts.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,.19));}return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),120,.045,12,false);};
const A0=Math.PI*1.25,BARRIDO=Math.PI*1.5;
D.add(new THREE.Mesh(arco(A0,A0-BARRIDO,.86),new THREE.MeshStandardMaterial({color:'#E3D9CB',roughness:.7})));
const matArco=new THREE.MeshPhysicalMaterial({color:'#C4785D',roughness:.3,clearcoat:.8,emissive:'#C4785D',emissiveIntensity:.15});
const prog=new THREE.Mesh(arco(A0,A0-.01,.86),matArco);D.add(prog);
const bola=new THREE.Mesh(new THREE.SphereGeometry(.1,24,16),new THREE.MeshPhysicalMaterial({color:'#ffffff',clearcoat:1,roughness:.2}));D.add(bola);

/* ── estado ── */
let host=null,ov={},modo='hab';
let nivel=.84,vel=0,objetivo=.84,K=14,AM=3.2;const BASE=.84;
const V_INI=.12;let v=V_INI,vPintado=-1;
let tareas=[],temporales=[],timers=[],ocupado=false;
const anima=(dur,f,fin)=>tareas.push({t0:reloj(),dur,f,fin});
const luego=(ms,f)=>timers.push(setTimeout(f,ms));
const temp=o=>{T.add(o);temporales.push(o);return o;};
const C_A=new THREE.Color('#C4785D'),C_B=new THREE.Color('#4C6E57');

function frase(h){if(!ov.frase)return;const e=ov.frase;e.style.opacity=0;clearTimeout(e._t);e._t=setTimeout(()=>{e.innerHTML=h;e.style.opacity=1},220);}
function setOcupado(b){ocupado=b;if(host)host.closest('.slide')?.querySelectorAll('[data-act=termo]').forEach(x=>x.disabled=b);}
function limpiar(){tareas=[];timers.forEach(clearTimeout);timers=[];temporales.forEach(o=>T.remove(o));temporales=[];setOcupado(false);}
function capas(k){host?.closest('.slide')?.querySelectorAll('[data-capa]').forEach(e=>e.classList.toggle('on',k>=+e.dataset.capa/4-.02));}

function pintaDial(){
  if(Math.abs(v-vPintado)<.004)return;vPintado=v;
  prog.geometry.dispose();prog.geometry=arco(A0,A0-BARRIDO*Math.max(.01,v),.86);
  const a=A0-BARRIDO*v;bola.position.set(Math.cos(a)*.86,Math.sin(a)*.86,.25);
  const k=Math.max(0,(v-V_INI)/(1-V_INI));
  const c=C_A.clone().lerp(C_B,k);matArco.color.copy(c);matArco.emissive.copy(c);
  escena.background.copy(FONDO_C).lerp(FONDO_F,k);
  hemi.color.set('#fff3e8').lerp(new THREE.Color('#f1f7f2'),k);sol.color.set('#fff1e2').lerp(new THREE.Color('#f7fbff'),k);
  if(ov.tu)ov.tu.style.color='#'+c.getHexString();
  capas(modo==='syn'?k:0);
}

/* ── lo habitual: tres intentos ── */
const matHielo=new THREE.MeshPhysicalMaterial({color:'#E3F1F6',transmission:.92,roughness:.12,thickness:.8,ior:1.31,clearcoat:1});
const matGota=new THREE.MeshPhysicalMaterial({color:'#DDEFF5',transmission:.8,roughness:.1,thickness:.2});
const matPinza=new THREE.MeshPhysicalMaterial({color:'#3A3A3A',roughness:.35,metalness:.2,clearcoat:.6});
function fin(){luego(1300,()=>{setOcupado(false);frase('Cambias el número. <span>No la temperatura.</span>');});}
function hielo(){
  const cubo=temp(new THREE.Mesh(new RoundedBoxGeometry(.72,.72,.72,5,.14),matHielo));cubo.castShadow=true;
  const desde=new THREE.Vector3(3.2,2.2,1.2),hasta=new THREE.Vector3(.62,Y0-.22,.42);
  cubo.position.copy(desde);frase('Le ponemos hielo…');
  anima(.9,e=>{const k=1-Math.pow(1-e,3);cubo.position.lerpVectors(desde,hasta,k);cubo.rotation.set(k*.5,k*.8,k*.2);},()=>{
    K=9;AM=3.4;objetivo=.26;frase('Baja…');let ult=0,dicho=false;
    anima(4.6,(e,t)=>{
      const s=1-e*.86;cubo.scale.setScalar(s);cubo.position.y=hasta.y-(1-s)*.25;
      if(e>.35)objetivo=.26+(BASE-.26)*Math.pow((e-.35)/.65,1.4);
      if(t-ult>.32){ult=t;const g=temp(new THREE.Mesh(new THREE.SphereGeometry(.05,16,12),matGota));g.scale.y=1.4;g.position.copy(cubo.position).y-=.36*s;let vy=0;anima(1.2,()=>{vy+=.012;g.position.y-=vy;},()=>T.remove(g));}
      if(e>.55&&!dicho){dicho=true;frase('…un rato.');}
    },()=>{T.remove(cubo);objetivo=BASE;K=14;AM=3.2;fin();});
  });
}
function pinza(){
  const yP=Y0+.3*ALTO;
  const mk=s=>{const g=temp(new THREE.Group());const a=new THREE.Mesh(new RoundedBoxGeometry(.9,.24,.5,4,.08),matPinza);a.position.x=s*.45;a.castShadow=true;g.add(a);
    const b=new THREE.Mesh(new RoundedBoxGeometry(.14,.5,.5,4,.06),matPinza);b.position.set(s*.86,0,0);g.add(b);g.position.set(s*3,yP,.05);return g;};
  const izq=mk(-1),der=mk(1);frase('Lo sujetamos a la fuerza…');
  K=12;AM=4;objetivo=.3;
  anima(.8,e=>{const k=1-Math.pow(1-e,3);izq.position.x=-3+k*2.8;der.position.x=3-k*2.8;},()=>{
    frase('Mientras aprietas, ahí se queda.');
    luego(2300,()=>{
      frase('En cuanto sueltas…');
      anima(.7,e=>{izq.position.x=-.2-e*3;der.position.x=.2+e*3;},()=>{T.remove(izq);T.remove(der);});
      K=22;AM=1.6;objetivo=1.0;vel=.9;
      luego(700,()=>{frase('<span>sube.</span>');objetivo=BASE;K=14;AM=3.2;fin();});
    });
  });
}
function posit(){
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
  x.fillStyle='#F6E4A6';x.fillRect(0,0,512,512);x.fillStyle='rgba(0,0,0,.05)';x.fillRect(0,0,512,70);
  x.fillStyle='#3A3A3A';x.font='700 92px "DM Sans", system-ui, sans-serif';x.textAlign='center';x.fillText('Todo',256,250);x.fillText('bien',256,350);
  const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
  const p=temp(new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.5),new THREE.MeshStandardMaterial({map:tx,roughness:.85,side:THREE.DoubleSide,transparent:true})));
  p.castShadow=true;const desde=new THREE.Vector3(3.5,3,1.4),hasta=new THREE.Vector3(.02,Y0+.78*ALTO,.3);
  p.position.copy(desde);frase('Lo tapamos para no verlo…');
  anima(.8,e=>{const k=1-Math.pow(1-e,3);p.position.lerpVectors(desde,hasta,k);p.rotation.z=(1-k)*.9-.06;},()=>{
    luego(2200,()=>{
      let vy=0,rz=-.06;
      anima(1.6,e=>{vy+=.006;p.position.y-=vy;p.position.x+=.01;rz-=.02;p.rotation.z=rz;p.rotation.x=e*1.2;p.material.opacity=1-Math.max(0,e-.6)/.4;},()=>T.remove(p));
      luego(500,()=>frase('<span>Sigue ahí.</span>'));
      fin();
    });
  });
}
const ACC=[hielo,pinza,posit];

/* ── con Synesis ── */
let ajustando=false;
function ajustar(){
  if(modo!=='syn'||ajustando||v>.99)return;ajustando=true;const v0=v;frase('Ajustas el termostato…');
  anima(3.2,e=>{v=v0+(1-v0)*(e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2);},()=>{ajustando=false;
    luego(300,()=>frase('Cambia la temperatura. <span class="v">Y el número baja solo.</span>'));
    luego(3600,()=>frase('<span class="v">Y se queda.</span>'));});
  luego(1600,()=>frase('Cambia la temperatura de la casa…'));
}

/* ── montaje en la diapositiva ── */
function overlays(){
  host.querySelectorAll('.t-ov').forEach(e=>e.remove());
  const mk=(cls,html)=>{const e=document.createElement('div');e.className='t-ov '+cls;e.innerHTML=html;host.appendChild(e);return e;};
  ov={nombre:mk('t-nombre',host.dataset.nombre||'Tu peque'),alta:mk('t-esc alta','Tensión'),baja:mk('t-esc baja','Calma'),
      tu:mk('t-tu','<b>Tú</b><small>Termostato</small>'),frase:mk('t-frase','&nbsp;')};
}
function encaja(){
  if(!host)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  R.setSize(w,h);cam.aspect=w/h;
  const t2=2*Math.tan(15*Math.PI/180);
  cam.position.z=Math.max(7.9/t2,(modo==='syn'?8.2:4.8)/cam.aspect/t2);
  cam.updateProjectionMatrix();
}
const ro=new ResizeObserver(encaja);
function ponModo(m){
  modo=m;limpiar();ajustando=false;
  nivel=objetivo=BASE;vel=0;K=14;AM=3.2;v=V_INI;vPintado=-1;
  T.position.x=m==='syn'?-.4:0;D.visible=m==='syn';miraX=m==='syn'?1.1:0;
  if(ov.tu)ov.tu.style.display=m==='syn'?'':'none';
  encaja();pintaDial();
  frase('&nbsp;');
}
const API={
  montar(h){
    const nuevo=host!==h;host=h;
    if(R.domElement.parentNode!==h)h.prepend(R.domElement);
    if(nuevo||!h.querySelector('.t-ov')){ro.disconnect();ro.observe(h);overlays();}
    ov.nombre.textContent=h.dataset.nombre||'Tu peque';
    ponModo(h.dataset.modo==='syn'?'syn':'hab');
  },
  modo(m){if(host)host.dataset.modo=m;ponModo(m);},
  accion(i){if(modo!=='hab'||ocupado||!ACC[i])return;setOcupado(true);ACC[i]();},
  ajustar,
  reiniciar(){ponModo(modo);}
};
const ray=new THREE.Raycaster(),pt=new THREE.Vector2();
R.domElement.addEventListener('click',e=>{if(modo!=='syn')return;const r=R.domElement.getBoundingClientRect();pt.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(pt,cam);if(ray.intersectObject(D,true).length)ajustar();});

/* ── bucle: solo pinta cuando la diapositiva está a la vista ── */
const proy=(p,w,h)=>{const q=p.clone().project(cam);return [(q.x*.5+.5)*w,(-q.y*.5+.5)*h];};
const pon=(e,p)=>{const [a,b]=proy(p,host.clientWidth,host.clientHeight);e.style.left=a+'px';e.style.top=b+'px';};
let tPrev=reloj();
function bucle(){
  requestAnimationFrame(bucle);
  const t=reloj(),dt=Math.min(.05,t-tPrev);tPrev=t;
  if(!host||!host.isConnected||!host.closest('.slide.on'))return;
  for(let i=tareas.length-1;i>=0;i--){const a=tareas[i],e=Math.min(1,(t-a.t0)/a.dur);a.f(e,t);if(e>=1){tareas.splice(i,1);a.fin&&a.fin();}}
  if(modo==='syn'){pintaDial();const k=Math.max(0,(v-V_INI)/(1-V_INI));K=3.2;AM=3.4;objetivo=BASE-(BASE-.2)*k;D.rotation.y=Math.sin(t*.5)*.04;D.position.y=.45+Math.sin(t*1.1)*.02;}
  vel+=(K*(objetivo-nivel)-AM*vel)*dt;nivel+=vel*dt;
  const n=Math.max(.02,Math.min(1,nivel+Math.sin(t*2.3)*.006));
  col.scale.y=n*ALTO+.2;gota.position.y=col.position.y+col.scale.y;
  const c=C_CALMA.clone().lerp(C_TENSION,Math.max(0,Math.min(1,(n-.2)/.62)));matLiq.color.copy(c);matLiq.emissive.copy(c);
  T.rotation.y=Math.sin(t*.35)*.05;
  MIRA.x=miraX;cam.position.x=miraX+Math.sin(t*.2)*.3;cam.position.y=.3;cam.lookAt(MIRA);
  const wp=p=>T.localToWorld(p.clone());
  pon(ov.nombre,wp(new THREE.Vector3(-1.5,Y0-.22,.3)));
  pon(ov.alta,wp(new THREE.Vector3(.62,Y0+ALTO*.95,-.1)));
  pon(ov.baja,wp(new THREE.Vector3(.62,Y0+ALTO*.05,-.1)));
  if(modo==='syn')pon(ov.tu,D.position.clone().add(new THREE.Vector3(0,0,.3)));
  R.render(escena,cam);
}
bucle();
window.TermoAPI=API;
if(window.__termoPend){API.montar(window.__termoPend);window.__termoPend=null;}
