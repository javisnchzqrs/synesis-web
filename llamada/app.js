(()=>{
'use strict';
/* ───────────── programa ───────────── */
const PROGRAMA={
  familias:'+80',
  semanas:12,            /* duración del acompañamiento: confirmar con Synesis */
  planes:[
    {id:'esencial',nombre:'Esencial',precio:397,cuota:133,sesiones:2},
    {id:'intensivo',nombre:'Intensivo',precio:597,cuota:199,sesiones:5}
  ],
  /* testimonios en vídeo: para activar el de Alba, pega su URL en src */
  videos:[
    {n:'Paula',h:'niño de 4 años',src:'/media/videos/testimonio-paula.mp4'},
    {n:'Alba',h:'niño de 3 años',src:'/media/videos/testimonio-alba.mp4'}
  ],
  /* sesiones 1 a 1 repartidas en las 12 semanas, según plan: confirmar con Paloma */
  sesionesEn:{esencial:[2,7],intensivo:[1,3,5,8,11]},
  /* vídeos del formato (horizontales, en bucle y sin sonido): pega la URL del de sesiones cuando lo tengas */
  formatoVideos:{
    vid:'/media/videos/plataforma.mov',
    rec:'/media/videos/recursos.mov',
    ses:'/media/videos/sesiones-1a1.mov'
  }
};

/* opciones del formulario */
const SITUACIONES={
  rabietas:['Estalla por cualquier cosa','Se tira al suelo y grita','No puede calmarse cuando se enfada','Llora de forma desproporcionada'],
  obedece:['Me ignora cuando le hablo','Hay que repetírselo todo mil veces','Solo hace caso si grito o amenazo'],
  pega:['Nos pega a nosotros (sus padres)','Pega a otros niños','Pega a otros adultos (profes, familia)','Se pega o se hace daño a sí mismo'],
  generico:['Rabietas e intensidad emocional','No escucha ni obedece','Se opone y lo discute todo','Peleas en las transiciones','Pega o muerde cuando se frustra']
};
const REACCIONES={
  'Acabo gritando aunque no quiero':'que solo va en serio cuando hay gritos',
  'Me bloqueo y no sé qué hacer':'que cuando se desborda, nadie le sujeta',
  'Cedo para que pare':'que desbordarse funciona',
  'Intento razonar pero no funciona':'que las palabras no sirven cuando está desbordado'
};
const SIENTE=['Culpa','Frustración porque nada funciona','Agotamiento','Tristeza','Alivio de que haya pasado'];
const CREE=['Lo hace para llamar mi atención','Podría controlarse si quisiera','No entiendo qué le pasa realmente','Depende de la situación','Es una fase, ya se le pasará'];

/* lo que viene por edades: [si nada cambia, si empezáis ahora] */
const HITOS={
  obedece:{
    6:['En el cole tampoco escucha. Empiezan las notas de la profe.','Llega al cole sabiendo escuchar. Y tú, sabiendo pedir.'],
    9:['Ya no ignora: lo discute todo. Y a ti ya no te quedan fuerzas.','Discutís, como en todas las casas. Pero os escucháis.'],
    12:['Deja de escucharte. En casa solo funcionan los gritos.','Llega la adolescencia y sigues siendo su referencia.'],
    15:['Cierra la puerta de su cuarto. Lo que le pasa, lo sabes por otros.','Te sigue contando lo que le pasa.']},
  rabietas:{
    6:['La rabieta sale de casa: el cole, el parque, los cumpleaños.','Llega al cole sabiendo qué hacer cuando algo le desborda.'],
    9:['Ya no son rabietas: son portazos. Y sigue sin saber qué hacer con lo que siente.','Se enfada, como todos. Y sabe volver a la calma.'],
    12:['Explota por todo. En casa se vive de puntillas.','Llega la adolescencia sabiendo poner nombre a lo que siente.'],
    15:['Lo que no aprendió a gestionar contigo, lo gestiona por su cuenta. Fuera de casa.','Cuando algo le supera, te lo cuenta a ti.']},
  pega:{
    6:['En el cole le ponen una etiqueta: «{elque} pega».','Llega al cole sabiendo parar antes de pegar.'],
    9:['Los demás niños se apartan. Y empieza a creerse la etiqueta.','Tiene amigos. Y sabe decir lo que le molesta.'],
    12:['Ya es más grande. Y ya no puedes sujetarle como ahora.','Llega la adolescencia sabiendo qué hacer con su rabia.'],
    15:['Lo que no aprendió a gestionar contigo, lo gestiona por su cuenta. Fuera de casa.','Cuando algo le supera, te lo cuenta a ti.']},
  generico:{
    6:['Lo que hoy pasa en casa llega al cole.','Llega al cole con lo que aprendió en casa.'],
    9:['Los conflictos ya no son de un rato: son el clima de la casa.','Hay conflictos, como en todas las casas. Y sabéis salir de ellos.'],
    12:['Deja de escucharte. En casa solo funcionan los gritos.','Llega la adolescencia y sigues siendo su referencia.'],
    15:['Lo que no aprendió a gestionar contigo, lo gestiona por su cuenta. Fuera de casa.','Te sigue contando lo que le pasa.']}
};
const HITO18=['Se va de casa con la relación que tuvisteis. Esa ya no se repite.','Se va de casa. Y sigue volviendo, porque contigo está bien.'];

/* caso de ejemplo */
const EJEMPLO={rol:'madre',nino:'o',padre:'Laura',hijo:'Antonio',edad:3,angulo:'obedece',
  situacion:'Hay que repetírselo todo mil veces',reaccion:'Me bloqueo y no sé qué hacer',siente:'Agotamiento',
  cree:'Lo hace para llamar mi atención',
  deseo:'Que me escuche sin tener que gritarle, y volver a disfrutar de estar con él.'};

/* Caso: 1) enlace generado por Make (?c=base64 JSON)  2) edición guardada en este navegador  3) ejemplo */
function leerEnlace(){
  try{
    let c=new URLSearchParams(location.search).get('c');if(!c)return null;
    c=c.replace(/ /g,'+').replace(/-/g,'+').replace(/_/g,'/');while(c.length%4)c+='=';
    const b=atob(c),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
    const j=JSON.parse(new TextDecoder().decode(u));
    const rol=String(j.rol||'').toLowerCase();
    const n=j.n||{};
    return {rol:rol.indexOf('amb')===0?'ambos':(rol==='padre'?'padre':'madre'),
      nino:j.g==='a'?'a':'o',padre:j.p||'—',hijo:j.h||'—',edad:+j.e||3,
      angulo:HITOS[j.ang]?j.ang:'generico',situacion:j.sit||'',reaccion:j.rea||'',
      siente:j.sie||'',cree:j.cre||'',deseo:j.des||'',
      notas:{relato:n.relato||'',otros:n.otros||'',rel:n.rel||'',aud:n.aud||''}};
  }catch(e){return null}
}
const CLAVE=(()=>{const c=new URLSearchParams(location.search).get('c');if(!c)return 'synesis-caso-v2';
  let h=0;for(let i=0;i<c.length;i++)h=(h*31+c.charCodeAt(i))|0;return 'synesis-caso-c'+(h>>>0).toString(36);})();
let C=null;
try{C=JSON.parse(localStorage.getItem(CLAVE))||null}catch(e){C=null}
if(!C||!C.hijo)C=leerEnlace();
if(!C||!C.hijo)C={...EJEMPLO};

/* estado de la llamada */
const S={semana:1,hoy:0,meta:0,veces:3,modo:'nada',hito:0,precio:false,plan:'esencial',cierre:'q',duda:''};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const low=s=>{s=String(s||'');return s.charAt(0).toLowerCase()+s.slice(1)};
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const dec=n=>n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
const lunes=()=>{const d=new Date();const add=((8-d.getDay())%7)||7;d.setDate(d.getDate()+add);return d};
const mezcla=(a,b,t)=>{const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const ico={
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
  flecha:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>'};

/* datos derivados del caso */
function datos(){
  const edad=Math.min(12,Math.max(1,+C.edad||3));
  const ella=C.rol!=='padre', nina=C.nino==='a', amb=C.rol==='ambos';
  const plan=PROGRAMA.planes.find(x=>x.id===S.plan)||PROGRAMA.planes[0];
  const restan=(18-edad)*52;
  const horizonte=edad<6?(6-edad)*365:3*365;
  return {edad,ella,nina,amb,plan,restan,horizonte,v:(sg,pl)=>amb?pl:sg,
    h:esc(C.hijo),p:esc(C.padre),
    g:(m,f)=>nina?f:m, gp:(m,f)=>amb?m.replace(/o$/,'os'):(ella?f:m),
    aprende:REACCIONES[C.reaccion]||'que cuando se desborda, nadie sabe qué hacer',
    hitos:[6,9,12,15,18].filter(a=>a>edad),
    porSemana:plan.precio/restan};
}
function fraseHito(d,edad){
  const set=HITOS[C.angulo]||HITOS.generico;
  const par=edad>=18?HITO18:set[edad];
  let t=par[S.modo==='nada'?0:1].replace('{elque}',d.g('el que','la que'));
  if(d.amb)[['Y a ti ya no te quedan','Y a vosotros ya no os quedan'],['Y tú, sabiendo','Y vosotros, sabiendo'],['te lo cuenta a ti','os lo cuenta a vosotros'],
    ['Te sigue contando','Os sigue contando'],['contigo','con vosotros']].forEach(([a,b])=>{t=t.split(a).join(b)});
  return t;
}

/* ───────────── páginas ───────────── */
function paginas(){
  const d=datos(),{h,p}=d;
  const inicio=lunes();
  const colores=Array.from({length:10},(_,i)=>mezcla('#8FAF9A','#C4785D',i/9));
  const nums=q=>`<div class="nums" role="group">${colores.map((c,i)=>`<button style="--c:${c}" data-act="num" data-q="${q}" data-v="${i+1}" class="${S[q]===i+1?'on':''}">${i+1}</button>`).join('')}</div>`;
  if(!S.hito||!d.hitos.includes(S.hito))S.hito=d.hitos[0];

  return [
  {t:'Apertura',html:`<div class="wrap apertura">
      <div class="rev"><div class="portrait"><img src="/media/fotos/paloma-recurso.jpg" alt="Paloma Robles"></div>
      <p class="firma"><b>Paloma Robles</b>Educadora infantil y guía familiar</p></div>
      <div><p class="hola rev" style="--r:.15s">Hola, ${p}.</p>
      <h1 class="h1 rev" style="--r:.3s">Hoy decidimos qué pasa con <em>${h}</em>.</h1></div></div>`,
   n:{dice:`Hola ${C.padre}. Esta llamada es para que salgas sabiendo exactamente qué hacer con ${C.hijo}. Antes de nada, cuéntame: ¿cómo ha ido esta semana?`,
      l:['Deja que hable. Apunta sus palabras exactas: las vas a usar al final.','No expliques el método todavía.','Si es escueta: «¿Y cómo te está afectando a ti, más allá de lo que hace?»']}},

  {t:'Del 1 al 10',html:`<div class="wrap centro">
      <p class="eyebrow rev">Del 1 al 10</p>
      <p class="pregunta rev" style="--r:.1s">¿Cuánto os está afectando esto hoy?</p>
      <div class="rev" style="--r:.2s;width:100%;display:flex;flex-direction:column;align-items:center">${nums('hoy')}<div class="extremos"><span>Nada</span><span>Muchísimo</span></div></div>
      <div class="bloque2 ${S.hoy?'':'off'}" id="b2"><p class="pregunta">¿Y dónde ${d.v('quieres','queréis')} estar dentro de 3 meses?</p>${nums('meta')}</div>
      <div class="res" id="res">${resEscala(d)}</div></div>`,
   n:{dice:`Del 1 al 10, ¿cuánto os está afectando esto ahora mismo, a ti y a ${C.hijo}? … ¿Y dónde te gustaría estar dentro de 3 meses?`,
      l:['Pulsa tú el número que te diga.','Si dice menos de 6: «¿Y en los días malos?». Usa ese número.','Repite la distancia en voz alta: «De 8 a 2. Ese es el camino.»']}},

  {t:'Lo que cuesta esperar',html:`<div class="wrap centro">
      <p class="eyebrow rev">Lo que cuesta esperar</p>
      <div class="veces rev" style="--r:.1s"><span>¿Cuántas veces al día pasa?</span>
        <span class="stepper"><button data-act="veces" data-v="-1" aria-label="Menos">−</button><output id="veces">${S.veces}</output><button data-act="veces" data-v="1" aria-label="Más">+</button></span></div>
      <div class="contador" id="contador" aria-live="polite">${num(S.veces*d.horizonte)}</div>
      <p class="contador-l rev" style="--r:.5s">veces más ${d.edad<6?`hasta que ${h} cumpla 6 años`:'en los próximos 3 años'}.</p>
      <p class="ensena rev" style="--r:.8s">Y cada una le enseña ${esc(d.aprende)}.</p>
      <p class="tu rev" style="--r:1s">${d.v('Y tú te quedas','Y vosotros os quedáis')} con <b>${esc(low(C.siente))}</b>.</p></div>`,
   n:{dice:`¿Cuántas veces al día pasa algo así? … Si nada cambia, de aquí a que cumpla 6 son todas estas veces más. Y cada una le enseña algo.`,
      l:['Ajusta el número con + y − según lo que diga.','Después, calla 3 segundos. Deja que lo mire.','Si dice «es una fase»: pasa a la siguiente, está hecha para eso.']}},

  {t:'Si nada cambia',html:`<div class="wrap proy ${S.modo}" id="proy">
      <div><p class="eyebrow rev">Lo que viene</p>
      <h2 class="h2 rev" style="--r:.1s">No se pasa con la edad. <span class="alarma">Cambia de forma.</span></h2>
      <div class="seg rev" style="--r:.2s" role="group"><button data-act="modo" data-v="nada" class="${S.modo==='nada'?'on':''}">Si nada cambia</button><button data-act="modo" data-v="empieza" class="${S.modo==='empieza'?'on':''}">Si empezáis ahora</button></div>
      <div class="hitos rev" style="--r:.3s">${d.hitos.map(a=>`<button data-act="hito" data-v="${a}" class="${S.hito===a?'on':''}">${a} años</button>`).join('')}</div>
      <div class="frase rev" style="--r:.4s" id="frase">${fraseHTML(d)}</div></div>
      <div class="rev" style="--r:.2s"><div class="infancia-t"><span>La infancia de <b>${h}</b>, semana a semana</span>
        <span class="ley"><span><i style="background:#BFB7AA"></i>vivido</span><span><i style="background:var(--terra)"></i>hoy</span></span></div>
      ${rejilla(d)}</div></div>`,
   n:{dice:`Muchas familias piensan que se pasa con la edad. Lo que vemos es que cambia de forma. Mira: esta es la infancia de ${C.hijo}, semana a semana. Cada punto es una semana.`,
      l:['Pulsa las edades una a una, despacio. Deja que lea.','Luego pulsa «Si empezáis ahora». No expliques: deja que lo vea cambiar.','Pregunta: «¿Cuál de los dos caminos quieres para '+C.hijo+'?»']}},

  {t:'Otras familias',html:`<div class="wrap fam">
      <div><p class="eyebrow rev">No es tarde</p>
      <h2 class="h2 rev" style="--r:.1s"><em>${PROGRAMA.familias} familias</em> estaban donde ${d.v('estás tú','estáis vosotros')}.</h2>
      <p class="fam-sub rev" style="--r:.2s">Escúchalo de ellas, no de nosotros.</p></div>
      <div class="videos">${PROGRAMA.videos.map((x,i)=>`<figure class="vcard rev" style="--r:${.25+i*.12}s">
        ${x.src?`<video src="${esc(x.src)}" controls playsinline preload="metadata"></video>`
          :`<div class="vpend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg><span>Vídeo próximamente</span></div>`}
        <figcaption><span class="av">${esc(x.n[0])}</span><span><b>${esc(x.n)}</b> · ${esc(x.h)}</span></figcaption></figure>`).join('')}</div></div>`,
   n:{dice:`${d.v('No eres '+d.gp('el único','la única'),'No sois los únicos')}. Mira lo que cuenta ${PROGRAMA.videos[0].n}, que estaba igual que vosotros.`,
      l:['Dale al play y deja que lo vea entero. No hables encima.','Si compartes pantalla, activa «compartir audio» o no se oirá.','Al terminar: «¿Te ves ahí?» y calla.']}},

  {t:'La filosofía',html:`<div class="wrap">
      <p class="eyebrow rev">La filosofía</p>
      <h2 class="h2 rev" style="--r:.1s">Cambiamos el patrón <em>empezando por ${d.v('ti','vosotros')}</em>.</h2>
      <div class="pasos">
        <div class="paso first rev" style="--r:.2s"><span class="n">1</span><h3>${d.v('Tú','Vosotros')}</h3><p>Qué hacer en el momento.</p></div>
        <div class="paso rev" style="--r:.3s"><span class="n">2</span><h3>${h}</h3><p>Qué hay detrás de lo que hace.</p></div>
        <div class="paso rev" style="--r:.4s"><span class="n">3</span><h3>${d.v('Vosotros','Los tres')}</h3><p>Volver a conectar.</p></div>
        <div class="paso rev" style="--r:.5s"><span class="n">4</span><h3>El día a día</h3><p class="aplic">${esc(C.situacion)}</p></div></div>
      <p class="filo-pie rev" style="--r:.65s">Todo el método sigue este orden. Primero ${d.v('entiendes','entendéis')}, después ${d.v('sabes','sabéis')} qué hacer.</p></div>`,
   n:{dice:`Por eso no empezamos por ${C.hijo}: empezamos por ti. Cuando tú sabes qué hacer en el momento, ${C.hijo} cambia.`,
      l:['Un minuto, no más. No es una clase.','Conecta el paso 4 con lo que te contó: «Esto de '+low(C.situacion)+' lo trabajamos desde la primera semana.»']}},

  {t:'El formato',html:formatoHTML(d),
   n:{dice:`Así es como lo vas a vivir. Vídeos cortos para entender, recursos para aplicarlo en casa, y Paloma contigo en tu caso concreto.`,
      l:['Deja que los vídeos corran. Señala cada uno mientras lo nombras.','Conecta los vídeos con su caso: «Aquí está el de '+low(C.situacion)+'.»','Recalca: las 12 semanas son el acompañamiento; los vídeos y recursos son para siempre.']}},

  {t:'Tu semana',html:semanaSlideHTML(d),
   n:{dice:`¿Y cuánto tiempo te pide esto? Mira una semana normal. Un vídeo cuando ${C.hijo} se duerme, un par de recursos con el café… Unos 20 minutos a la semana.`,
      l:['Pulsa 2 o 3 semanas, incluida una con sesión (punto naranja).','Remata el número grande: «de las 112 horas que estás despierta».','Si dice «no tengo tiempo»: vuelve aquí.']}},

  {t:'La inversión',html:`<div class="wrap">
      <p class="eyebrow rev">En perspectiva</p>
      <h2 class="h2 rev" style="--r:.1s">A ${h} le quedan <em>${num(d.restan)} semanas</em> en casa ${d.v('contigo','con vosotros')}.</h2>
      <div class="barra rev" style="--r:.2s;margin-top:58px"><span class="barra-call">${PROGRAMA.semanas} semanas: el método</span>
        <div class="barra-track" style="--anos:${18-d.edad}"><div class="barra-prog" style="--w:${(PROGRAMA.semanas/d.restan*100).toFixed(2)}"></div></div>
        <div class="barra-ed"><span>Hoy · ${d.edad} años</span><span>18 años</span></div></div>
      <div class="inv-bajo">${S.precio?invRes(d):`<button class="btn prim xl rev" style="--r:.6s" data-act="precio">Ver la inversión</button>`}</div></div>`,
   n:{dice:`Estas son las semanas que le quedan en casa contigo. El método son estas ${PROGRAMA.semanas}. [Pulsa «Ver la inversión»] Son ${d.plan.precio} €, o ${d.plan.cuota} € al mes durante 3 meses.`,
      l:['Pulsa «Ver la inversión» tú, sin esperar a que pregunte.','Di el precio con seguridad. Luego CALLA.','Si hay silencio: «¿Ves sentido en empezar ahora?»','Pincha el plan que elija: queda en el cierre.','Antes de dudas: «Lo que sientes ahora es alivio. Y el alivio se va. Lo que cambia las cosas es saber qué hacer, cada vez.»']}},

  {t:'Cierre',html:cierreHTML(d,inicio),
   n:{dice:`${C.padre}, ¿empezamos el lunes?`,
      l:['Pregunta y CALLA. El primero que habla pierde.','Si dice que sí: pulsa «Sí, empezamos» y manda el enlace de pago en ese momento.','Si duda: pulsa «Tengo una duda» y la opción que diga. Lee la frase y pregunta «¿Qué más te frena?».','Pareja: «¿Quedamos mañana a las [hora] cinco minutos con él/ella?» Nunca un «ya me dices» sin fecha.','Si no cierra: «Te mando un resumen por WhatsApp. ¿Te parece?»']}}
  ];
}

function resEscala(d){
  if(!S.hoy)return '';
  if(!S.meta)return `<strong><span class="a">${S.hoy}</span></strong><small>Ahora, ¿dónde ${d.v('quieres','queréis')} estar?</small>`;
  return `<strong><span class="a">${S.hoy}</span>${ico.flecha}<span class="b">${S.meta}</span></strong><small>Ese es el camino que vamos a hacer ${d.gp('juntos','juntas')}.</small>`;
}
function fraseHTML(d){
  const a=S.hito;
  return `<small>${S.modo==='nada'?'Si nada cambia':'Si empezáis ahora'} · a los ${a} años</small><p>${esc(fraseHito(d,a))}</p>`;
}
function rejilla(d){
  const hoy=d.edad*52,prog=PROGRAMA.semanas,filas=[];let k=0;
  for(let y=0;y<18;y++){
    filas.push(`<b data-y="${y}" class="${filaHito(d)===y?'on':''}">${y%3===0||y===d.edad?y:''}</b>`);
    for(let w=0;w<52;w++){
      const i=y*52+w;let cls='f',st='';
      if(i<hoy)cls='p';else if(i===hoy)cls='now';
      else{const t=(i-hoy)/(18*52-hoy);st=`--cn:${mezcla('#EDC7B4','#A9573C',Math.pow(t,.75))};--d:${((i-hoy)*1.1).toFixed(0)}ms;`;if(i-hoy<=prog)cls+=' prog';}
      if(y===filaHito(d))cls+=' hl';
      filas.push(`<i class="${cls}" data-y="${y}" style="${st}--a:${(k++*0.9).toFixed(0)}ms"></i>`);
    }
  }
  return `<div class="semanas ${S.modo}" id="semanas">${filas.join('')}</div>`;
}
const filaHito=d=>Math.min(17,S.hito);
const AGENDA=[
  {d:0,t:21.5,m:12,k:'vid',txt:'Vídeo',cuando:'cuando se duerme'},
  {d:2,t:8,m:5,k:'rec',txt:'Recurso',cuando:'con el café'},
  {d:3,t:21,m:60,k:'ses',txt:'Sesión con Paloma',cuando:'',ses:true},
  {d:4,t:14.5,m:5,k:'rec',txt:'Recurso',cuando:'en la pausa de la comida'}];
const DIAS=['L','M','X','J','V','S','D'];
const dur=m=>m>=60?`${Math.floor(m/60)} h${m%60?' '+m%60+' min':''}`:`${m} min`;
function semanaHTML(d){
  const w=S.semana,ses=(PROGRAMA.sesionesEn[d.plan.id]||[]).includes(w);
  const items=AGENDA.filter(x=>!x.ses||ses);
  const tot=items.reduce((a,x)=>a+x.m,0);
  const bloque=['Tú',d.h,'Vosotros','El día a día'][Math.min(3,Math.floor((w-1)/3))];
  const filas=DIAS.map((dd,i)=>{
    const its=items.filter(x=>x.d===i).map(x=>{
      const l=(x.t-7)/16*100,wd=x.m/(16*60)*100,izq=l>52;
      return `<span class="blq ${x.k}" style="left:${l.toFixed(2)}%;width:${wd.toFixed(2)}%"></span><span class="blq-l ${izq?'izq':''}" style="${izq?`right:${(100-l+1).toFixed(2)}%`:`left:${(l+wd+1).toFixed(2)}%`}"><b>${x.txt}</b> · ${dur(x.m)}${x.cuando?`<i> · ${x.cuando}</i>`:''}</span>`;}).join('');
    return `<span class="dia">${dd}</span><div class="pista">${its}</div>`;}).join('');
  return `<div class="sem-h"><span>Semana <b>${w}</b> de ${PROGRAMA.semanas} · Bloque: <b>${bloque}</b></span>${ses?'<span class="tag-ses">Con sesión</span>':''}</div>
    <div class="horas"><span></span><div><span style="left:${1/16*100}%">8h</span><span style="left:${5/16*100}%">12h</span><span style="left:${9/16*100}%">16h</span><span style="left:${13/16*100}%">20h</span></div></div>
    <div class="dias aparece">${filas}</div>
    <div class="sem-tot"><strong>${dur(tot)}</strong><span>de las 112 horas que ${d.v('estás','estáis')} ${d.gp('despierto','despierta')} esta semana.</span></div>`;
}
function formatoHTML(d){
  const V=PROGRAMA.formatoVideos;
  const F=[
    ['vid','Vídeos cortos','~12 min / semana','Piezas de 8 a 12 minutos para entender qué pasa en cada situación y cómo afrontarla.'],
    ['rec','Recursos prácticos','5–10 min / semana','Guías y ejercicios para llevar la teoría a tu casa desde el primer día.'],
    ['ses','Sesiones 1 a 1',`${d.plan.sesiones} sesiones de 1 h con Paloma`,d.v(`Para que no ${d.gp('estés solo','estés sola')}: Paloma te guía en tu caso concreto.`,'Para que no estéis solos: Paloma os guía en vuestro caso concreto.')]];
  return `<div class="wrap formato">
    <p class="eyebrow rev">El formato</p>
    <h2 class="h2 rev" style="--r:.1s">Tres piezas. <em>Una sola forma de hacerlo.</em></h2>
    <div class="fv-grid">${F.map((x,i)=>`<article class="fv rev" style="--r:${.2+i*.12}s">
      <div class="fv-media">${V[x[0]]?`<video src="${esc(V[x[0]])}" data-auto muted loop playsinline autoplay preload="auto" aria-label="${esc(x[1])}"></video>`
        :`<div class="vpend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg><span>Vídeo próximamente</span></div>`}</div>
      <div class="fv-t"><i class="sw ${x[0]}"></i><h3>${x[1]}</h3></div>
      <span class="fv-tag">${x[2]}</span>
      <p>${x[3]}</p></article>`).join('')}</div>
    <p class="siempre rev" style="--r:.6s">${ico.check}<span><b>El acceso no termina a las 12 semanas.</b> Los vídeos y recursos son ${d.v('tuyos','vuestros')} para siempre: ${d.v('te','os')} sirven ahora, a los 6 y a los 12.</span></p></div>`;
}
function semanaSlideHTML(d){
  const ses=PROGRAMA.sesionesEn[d.plan.id]||[];
  return `<div class="wrap sem-slide">
    <div><p class="eyebrow rev">Tu semana</p>
      <h2 class="h2 rev" style="--r:.1s">Cabe en una semana <em>que ya va llena</em>.</h2>
      <p class="sem-sub rev" style="--r:.2s">Así podría ser una semana ${d.v('tuya','vuestra')} durante las ${PROGRAMA.semanas} semanas de acompañamiento.</p>
      <ul class="ley-f rev" style="--r:.3s"><li><i class="sw vid"></i>Vídeo</li><li><i class="sw rec"></i>Recurso</li><li><i class="sw ses"></i>Sesión con Paloma</li></ul></div>
    <div class="sem rev" style="--r:.3s">
      <div class="sem-top"><span>Una semana de ejemplo</span><div class="chips" role="group" aria-label="Semanas">${Array.from({length:PROGRAMA.semanas},(_,k)=>k+1).map(k=>`<button data-act="semana" data-v="${k}" class="${S.semana===k?'on':''} ${ses.includes(k)?'s':''}" aria-label="Semana ${k}">${k}</button>`).join('')}</div></div>
      <div id="semana">${semanaHTML(d)}</div></div></div>`;
}
function invRes(d){
  const pl=PROGRAMA.planes;
  return `<div class="inv-res aparece"><div class="porsemana"><strong>${dec(d.porSemana)}<i>€</i></strong><span>por cada semana que le queda en casa ${d.v('contigo','con vosotros')}.</span></div>
    <div class="planes">${pl.map(x=>`<button class="plan ${x.id===S.plan?'on':''}" data-act="plan" data-v="${x.id}"><small>${x.nombre}</small><b>${x.precio}<i>€</i></b><span>o 3 pagos de ${x.cuota} €</span><em>${x.sesiones} sesiones privadas con Paloma</em></button>`).join('')}
    <p class="plazas">Plazas limitadas: las sesiones las hace Paloma personalmente.</p></div></div>`;
}
function cierreHTML(d,inicio){
  const dia=inicio.getDate(),{h,p}=d;
  const deseo=C.deseo?`<p class="deseo-l rev">${d.v('Lo que me dijiste','Lo que me contasteis')}</p><p class="deseo rev" style="--r:.1s">«${esc(C.deseo)}»</p>`:'';
  if(S.cierre==='si'){
    const chips=[(S.hoy*S.meta)?`De ${S.hoy} a ${S.meta}`:'',`Plan ${d.plan.nombre}`,`Empezáis el lunes ${dia}`].filter(Boolean);
    return `<div class="wrap centro aparece"><p class="eyebrow">Hecho</p>
      <h2 class="h2">${d.gp('Bienvenido','Bienvenida')}, ${p}. <em>Empezáis el lunes.</em></h2>
      <ol class="pasos-si"><li><small>Ahora</small>${d.v('Te','Os')} llega el enlace de pago</li><li><small>Hoy</small>${d.v('Entras','Entráis')} en la plataforma</li><li><small>Esta semana</small>Reservamos ${d.v('tu','vuestra')} primera sesión con Paloma</li></ol>
      <div class="resumen">${chips.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>`;
  }
  if(S.cierre==='duda'){
    const D=[['dinero','El dinero'],['pareja','Hablarlo con mi pareja'],['tiempo','El tiempo'],['funciona',`Si funcionará con ${C.hijo}`]].filter(x=>!(d.amb?x[0]==='pareja':false));
    const R={dinero:`Son ${dec(d.porSemana)} € por cada semana que le queda en casa. Y es para siempre: ${d.v('te','os')} sirve ahora, a los 6 y a los 12.`,
      pareja:'Perfecto, esto se decide en equipo. ¿Qué crees que te va a preguntar? Lo resolvemos ahora.',
      tiempo:'Son unos 20 minutos a la semana. Menos de lo que os quita una tarde mala.',
      funciona:`Por eso trabajamos el caso de ${C.hijo}, no uno genérico. En sesiones privadas con Paloma.`};
    return `<div class="wrap centro aparece"><p class="eyebrow">Es normal dudar</p><h2 class="h2">¿Qué ${d.v('te','os')} frena?</h2>
      <div class="dudas">${D.map(([k,t])=>`<button data-act="duda" data-v="${k}" class="${S.duda===k?'on':''}">${esc(t)}</button>`).join('')}</div>
      <div class="respuesta">${S.duda?`<p class="aparece">${esc(R[S.duda])}</p>`:''}<button class="link" data-act="volver">Volver a la pregunta</button></div></div>`;
  }
  return `<div class="wrap centro">${deseo}
      <h2 class="h2 cierre-q rev" style="--r:.35s">${p}, ¿empezamos el lunes ${dia}?</h2>
      <div class="acciones rev" style="--r:.55s"><button class="btn prim xl" data-act="si">Sí, empezamos</button><button class="btn sec xl" data-act="duda0">Tengo una duda</button></div></div>`;
}

/* ───────────── render ───────────── */
const main=$('#slides'),dots=$('#dots');
let P=[],cur=0;
function render(){
  P=paginas();
  main.innerHTML=P.map((s,i)=>`<section class="slide ${i===cur?'on':''}" data-i="${i}" aria-label="${esc(s.t)}" ${i===cur?'':'aria-hidden="true"'}>${s.html}</section>`).join('');
  dots.innerHTML=P.map((s,i)=>`<button class="${i<cur?'done':''} ${i===cur?'cur':''}" data-go="${i}" aria-label="${i+1}. ${esc(s.t)}"></button>`).join('');
  const d=datos();
  $('#caso').innerHTML=`<span class="pill">Preparado para <b>${d.p}</b></span><span class="pill"><b>${d.h}</b>, ${d.edad} años</span>`;
  navEstado();notas();entrar(cur);
}
/* repinta una sola pagina sin repetir su animacion de entrada */
function pinta(i){
  P=paginas();
  const sec=main.querySelector(`.slide[data-i="${i}"]`);if(!sec)return;
  sec.classList.add('quieto');sec.innerHTML=P[i].html;notas();autoVid();
}
function navEstado(){
  $('#prev').disabled=cur===0;
  $('#next').style.visibility=cur===P.length-1?'hidden':'visible';
  dots.querySelectorAll('button').forEach((b,k)=>{b.classList.toggle('done',k<cur);b.classList.toggle('cur',k===cur);});
}
function go(i){
  i=Math.max(0,Math.min(P.length-1,i));if(i===cur)return;
  const prev=main.querySelector(`.slide[data-i="${cur}"]`);
  cur=i;
  main.querySelectorAll('video').forEach(v=>{try{v.pause()}catch(e){}});
  main.querySelectorAll('.slide').forEach((s,k)=>{
    if(k===cur){s.classList.remove('quieto');s.classList.add('on');s.removeAttribute('aria-hidden');}
    else{s.classList.remove('on');s.setAttribute('aria-hidden','true');}
  });
  if(prev)prev.classList.remove('quieto');
  navEstado();
  if(innerWidth<=900)window.scrollTo(0,0);
  notas();entrar(cur);
  try{if(bc)bc.postMessage({i:cur})}catch(e){}
}
function autoVid(){
  main.querySelectorAll('video[data-auto]').forEach(v=>{
    if(v.closest('.slide.on')){v.muted=true;const p=v.play();if(p){if(p.catch)p.catch(()=>{});}}else v.pause();
  });
}
function entrar(i){
  autoVid();
  if((P[i]||{}).t==='Lo que cuesta esperar'){const d=datos();cuenta(0,S.veces*d.horizonte,1400,350);}
}
let rafC=0;
function cuenta(desde,hasta,ms,delay=0){
  const el=$('#contador');if(!el)return;
  cancelAnimationFrame(rafC);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=num(hasta);return;}
  el.textContent=num(desde);
  const t0=performance.now()+delay;
  const paso=t=>{const k=Math.min(1,Math.max(0,(t-t0)/ms));const e=1-Math.pow(1-k,3);el.textContent=num(desde+(hasta-desde)*e);if(k<1)rafC=requestAnimationFrame(paso);};
  rafC=requestAnimationFrame(paso);
}

/* interacciones de las paginas */
main.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const act=b.dataset.act,v=b.dataset.v,d=datos();
  if(act==='num'){
    const q=b.dataset.q;S[q]=+v;
    b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    if(q==='hoy')$('#b2').classList.remove('off');
    $('#res').innerHTML=resEscala(d);
  }
  else if(act==='veces'){
    const antes=S.veces*d.horizonte;S.veces=Math.min(20,Math.max(1,S.veces+(+v)));
    $('#veces').textContent=S.veces;cuenta(antes,S.veces*d.horizonte,700);
  }
  else if(act==='modo'){
    if(S.modo===v)return;S.modo=v;
    b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    $('#semanas').className='semanas '+v;$('#proy').className='wrap proy '+v;
    const f=$('#frase');f.innerHTML=fraseHTML(d);f.classList.remove('cambia');void f.offsetWidth;f.classList.add('cambia');
  }
  else if(act==='hito'){
    S.hito=+v;
    b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    const fila=Math.min(17,S.hito);
    document.querySelectorAll('#semanas i').forEach(x=>x.classList.toggle('hl',+x.dataset.y===fila));
    document.querySelectorAll('#semanas b').forEach(x=>x.classList.toggle('on',+x.dataset.y===fila));
    const f=$('#frase');f.innerHTML=fraseHTML(d);f.classList.remove('cambia');void f.offsetWidth;f.classList.add('cambia');
  }
  else if(act==='semana'){
    S.semana=+v;b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    $('#semana').innerHTML=semanaHTML(d);
  }
  else if(act==='precio'){S.precio=true;pinta(cur);}
  else if(act==='plan'){S.plan=v;pinta(cur);main.querySelector(`.slide[data-i="${cur}"] .inv-res`)?.classList.remove('aparece');}
  else if(act==='si'){S.cierre='si';pinta(cur);confeti();}
  else if(act==='duda0'){S.cierre='duda';S.duda='';pinta(cur);}
  else if(act==='duda'){S.duda=v;pinta(cur);main.querySelector(`.slide[data-i="${cur}"] .wrap`)?.classList.remove('aparece');}
  else if(act==='volver'){S.cierre='q';S.duda='';pinta(cur);}
});
dots.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(+b.dataset.go);});
$('#next').onclick=()=>go(cur+1);
$('#prev').onclick=()=>go(cur-1);
document.addEventListener('keydown',e=>{
  if(e.target.closest('input,textarea,select'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'||(e.key===' '?!e.target.closest('button'):false)){e.preventDefault();go(cur+1);}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(cur-1);}
  else if(e.key==='n'||e.key==='N')toggle('#notas');
  else if(e.key==='e'||e.key==='E'){llenarForm();toggle('#editor');}
  else if(e.key==='Escape')document.querySelectorAll('.drawer.abierto').forEach(x=>x.classList.remove('abierto'));
});

/* confeti del si */
function confeti(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cv=$('#confeti'),cx=cv.getContext('2d');
  const W=cv.width=innerWidth*devicePixelRatio,H=cv.height=innerHeight*devicePixelRatio;
  const col=['#4C6E57','#6D9278','#8FAF9A','#C4785D','#E7C9A9'];
  const ps=Array.from({length:150},()=>({x:W*(.2+Math.random()*.6),y:H*.55,vx:(Math.random()-.5)*16*devicePixelRatio,vy:(-10-Math.random()*14)*devicePixelRatio,s:(5+Math.random()*6)*devicePixelRatio,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:col[Math.random()*col.length|0]}));
  const t0=performance.now();
  const f=t=>{cx.clearRect(0,0,W,H);const k=(t-t0)/2600;
    ps.forEach(q=>{q.vy+=.45*devicePixelRatio;q.vx*=.99;q.x+=q.vx;q.y+=q.vy;q.r+=q.vr;cx.save();cx.globalAlpha=Math.max(0,1-k);cx.translate(q.x,q.y);cx.rotate(q.r);cx.fillStyle=q.c;cx.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);cx.restore();});
    if(k<1)requestAnimationFrame(f);else cx.clearRect(0,0,W,H);};
  requestAnimationFrame(f);
}

/* notas y editor */
function toggle(sel){const x=$(sel);const abrir=!x.classList.contains('abierto');document.querySelectorAll('.drawer').forEach(y=>y.classList.remove('abierto'));if(abrir)x.classList.add('abierto');}
document.querySelectorAll('[data-cerrar]').forEach(b=>b.onclick=()=>b.closest('.drawer').classList.remove('abierto'));
$('#bt-notas').onclick=()=>toggle('#notas');
$('#bt-editar').onclick=()=>{llenarForm();toggle('#editor');};
function notas(){
  const s=P[cur];if(!s)return;
  $('#notas-t').textContent=`${cur+1}. ${s.t}`;
  $('#notas-b').innerHTML=`<p class="aviso">Si compartes esta pestaña, abre las notas solo cuando no la compartas. Tecla N.</p>${C.rol==='ambos'?'<p class="aviso plural">Vienen los dos: habla en plural (vosotros).</p>':''}<p class="nota-t">Dile</p><p class="nota-dice">${esc(s.n.dice)}</p><p class="nota-t">Ten en cuenta</p><ul class="nota-l">${s.n.l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  $('#notas-b').insertAdjacentHTML('beforeend',casoNotas());
}
function casoNotas(){
  const n=C.notas||{};const f=[];
  if(n.relato)f.push(['Cómo empieza y acaba (sus palabras)',esc(n.relato)]);
  if(n.rel)f.push(['La relación ahora',esc(n.rel)]);
  if(n.otros)f.push(['Respondió «Otro»',esc(n.otros)]);
  if(n.aud)f.push(['Su auditoría',`<a href="${esc(n.aud)}" target="_blank" rel="noopener">Abrir en otra pestaña</a>`]);
  if(!f.length)return '';
  return `<details class="su-caso" ${cur===0?'open':''}><summary>Su caso</summary>${f.map(([t,v])=>`<p class="nota-t">${t}</p><p class="nota-caso">${v}</p>`).join('')}</details>`;
}
let bc=null;try{bc=new BroadcastChannel('synesis-llamada');bc.onmessage=e=>{if(Number.isInteger(e.data?.i))go(e.data.i);};}catch(e){}

const opts=(sel,list,val)=>{$(sel).innerHTML=list.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('');};
function llenarForm(){
  $('#f-rol').value=C.rol||'madre';$('#f-nino').value=C.nino||'o';
  $('#f-padre').value=C.padre;$('#f-hijo').value=C.hijo;$('#f-edad').value=C.edad;$('#f-angulo').value=C.angulo;
  opts('#f-situacion',SITUACIONES[C.angulo]||[],C.situacion);
  opts('#f-reaccion',Object.keys(REACCIONES),C.reaccion);
  opts('#f-siente',SIENTE,C.siente);opts('#f-cree',CREE,C.cree);
  $('#f-deseo').value=C.deseo||'';
}
$('#f-angulo').onchange=e=>opts('#f-situacion',SITUACIONES[e.target.value]||[],'');
$('#form').onsubmit=e=>{
  e.preventDefault();
  const notasPrev=C.notas;
  C={rol:$('#f-rol').value,nino:$('#f-nino').value,padre:$('#f-padre').value.trim()||'—',hijo:$('#f-hijo').value.trim()||'—',
     edad:+$('#f-edad').value||3,angulo:$('#f-angulo').value,situacion:$('#f-situacion').value,reaccion:$('#f-reaccion').value,
     siente:$('#f-siente').value,cree:$('#f-cree').value,deseo:$('#f-deseo').value.trim(),notas:notasPrev};
  try{localStorage.setItem(CLAVE,JSON.stringify(C))}catch(err){}
  Object.assign(S,{semana:1,hoy:0,meta:0,veces:3,modo:'nada',hito:0,precio:false,cierre:'q',duda:''});
  render();$('#editor').classList.remove('abierto');
};
$('#f-ejemplo').onclick=()=>{C={...EJEMPLO};try{localStorage.removeItem(CLAVE)}catch(err){}llenarForm();Object.assign(S,{hoy:0,meta:0,precio:false,cierre:'q',duda:''});render();};

render();
})();
