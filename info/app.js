(()=>{
'use strict';
/* Método Synesis · "Lo que hablamos": el recurso de la llamada, para verlo con calma.
   Mismo enlace de caso que /llamada/ (?c=base64 JSON). Si cambian precios o planes, cambiarlos aquí y en /llamada/app.js. */

const WHATSAPP='34644623164';
const PROGRAMA={
  familias:'+150',
  semanas:12,
  planes:[
    {id:'esencial',nombre:'Esencial',precio:197,cuota2:'98,50',cuota3:'65,66',sesiones:0},
    {id:'impulso',nombre:'Impulso',precio:295,cuota2:'147,50',cuota3:'98,33',sesiones:2},
    {id:'intensivo',nombre:'Intensivo',precio:385,cuota2:'192,50',cuota3:'128,33',sesiones:5}
  ],
  videos:[
    {n:'Paula',h:'niño de 4 años',src:'/media/videos/testimonio-paula.mp4'},
    {n:'Alba',h:'niño de 3 años',src:'/media/videos/testimonio-alba.mp4'}
  ],
  formatoVideos:{vid:'/media/videos/plataforma.mov',rec:'/media/videos/recursos.mov',ses:'/media/videos/sesiones-1a1.mov'}
};

const REACCIONES={
  'Acabo gritando aunque no quiero':'que solo va en serio cuando hay gritos',
  'Me bloqueo y no sé qué hacer':'que cuando se desborda, nadie le sujeta',
  'Cedo para que pare':'que desbordarse funciona',
  'Intento razonar pero no funciona':'que las palabras no sirven cuando está desbordado'
};
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
/* módulo del bloque 4 que más tiene que ver con lo que nos contó */
const MODULO={rabietas:'Rabietas',obedece:'No escucha',pega:'Momentos difíciles',generico:'Límites'};

const EJEMPLO={rol:'madre',nino:'o',padre:'Laura',hijo:'Antonio',edad:3,angulo:'obedece',
  situacion:'Hay que repetírselo todo mil veces',reaccion:'Me bloqueo y no sé qué hacer',siente:'Agotamiento',
  cree:'Lo hace para llamar mi atención',deseo:'Que me escuche sin tener que gritarle, y volver a disfrutar de estar con él.'};

function leerEnlace(){
  try{
    let c=new URLSearchParams(location.search).get('c');if(!c)return null;
    c=c.replace(/ /g,'+').replace(/-/g,'+').replace(/_/g,'/');while(c.length%4)c+='=';
    const b=atob(c),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);
    const j=JSON.parse(new TextDecoder().decode(u));
    const rol=String(j.rol||'').toLowerCase();
    return {rol:rol.indexOf('amb')===0?'ambos':(rol==='padre'?'padre':'madre'),
      nino:j.g==='a'?'a':'o',padre:j.p||'',hijo:j.h||'',edad:+j.e||3,
      angulo:HITOS[j.ang]?j.ang:'generico',situacion:j.sit||'',reaccion:j.rea||'',
      siente:j.sie||'',cree:j.cre||'',deseo:j.des||'',plan:j.plan||''};
  }catch(e){return null}
}
const C=leerEnlace()||{...EJEMPLO};

const S={veces:1,unidad:'dia',modo:'nada',plan:PROGRAMA.planes.some(p=>p.id===C.plan)?C.plan:'impulso'};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const low=s=>{s=String(s||'');return s.charAt(0).toLowerCase()+s.slice(1)};
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const dec=n=>n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
const ico={
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3Z"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>'
};

/* datos derivados */
function datos(){
  const edad=Math.min(12,Math.max(1,+C.edad||3));
  const ella=C.rol!=='padre',amb=C.rol==='ambos',nina=C.nino==='a';
  const plan=PROGRAMA.planes.find(x=>x.id===S.plan)||PROGRAMA.planes[1];
  const restan=(18-edad)*52;
  return {edad,amb,nina,plan,restan,
    horizonte:edad<6?(6-edad)*365:3*365,
    h:esc(C.hijo||'tu peque'),p:esc(C.padre),
    v:(sg,pl)=>amb?pl:sg,
    g:(m,f)=>nina?f:m,
    gp:(m,f)=>amb?m.replace(/o$/,'os'):(ella?f:m),
    aprende:REACCIONES[C.reaccion]||'que cuando se desborda, nadie sabe qué hacer',
    hitos:[6,9,12,15,18].filter(a=>a>edad),
    porSemana:plan.precio/restan};
}
const totalVeces=d=>Math.round(S.veces*(S.unidad==='semana'?d.horizonte/7:d.horizonte));
function fraseHito(d,edad,k){
  const set=HITOS[C.angulo]||HITOS.generico;
  let t=(edad>=18?HITO18:set[edad])[k].replace('{elque}',d.g('el que','la que'));
  if(d.amb)[['Y a ti ya no te quedan','Y a vosotros ya no os quedan'],['Y tú, sabiendo','Y vosotros, sabiendo'],['te lo cuenta a ti','os lo cuenta a vosotros'],
    ['Te sigue contando','Os sigue contando'],['contigo','con vosotros']].forEach(([a,b])=>{t=t.split(a).join(b)});
  return t;
}
function waLink(texto){return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;}

/* ───────────── secciones ───────────── */
function hero(d){
  const hola=d.p?`Hola, ${d.p}.`:'Hola.';
  const burbuja=C.deseo?`<div class="dijiste"><p class="mini">${d.v('Lo que me dijiste','Lo que me contasteis')}</p>
      <div class="burbuja"><p>${esc(C.deseo)}</p><span class="burbuja-meta" aria-hidden="true">✓✓</span></div></div>`:'';
  return `<section class="hero">
    <div class="firma"><img src="/media/fotos/paloma-recurso.jpg" alt="" width="64" height="64"><p><b>Paloma Robles</b>Educadora infantil y guía familiar</p></div>
    <p class="hola">${hola}</p>
    <h1>Lo que hablamos de <em>${d.h}</em>, para ${d.v('que lo veas','que lo veáis')} con calma.</h1>
    <p class="lead">Aquí ${d.v('tienes','tenéis')} todo: ${d.v('tu','vuestro')} caso, cómo trabajamos y los programas. Léelo a ${d.v('tu','vuestro')} ritmo, y si te surge cualquier duda, escríbeme.</p>
    ${burbuja}
    <nav class="indice" aria-label="En esta página">
      <a href="#esperar">Lo que cuesta esperar</a><a href="#metodo">El método</a><a href="#familias">Otras familias</a><a href="#programas">Programas</a><a href="#dudas">Dudas</a>
    </nav>
  </section>`;
}

function esperar(d){
  return `<section id="esperar" class="sec">
    <p class="eyebrow">Lo que cuesta esperar</p>
    <h2>¿Cuántas veces pasa algo así en ${d.v('tu','vuestra')} casa?</h2>
    <p class="sub">${C.situacion?`${esc(C.situacion)}. `:''}Pon el número que más se parezca a lo que vivís cada día.</p>
    <div class="caja contador-caja">
      <div class="veces">
        <span class="stepper"><button data-act="veces" data-v="-1" aria-label="Menos">−</button><output id="veces">${S.veces}</output><button data-act="veces" data-v="1" aria-label="Más">+</button></span>
        <span class="unidad" role="group" aria-label="Cada cuánto">${[['dia','al día'],['semana','a la semana']].map(([k,t])=>`<button data-act="unidad" data-v="${k}" class="${S.unidad===k?'on':''}" aria-pressed="${S.unidad===k}">${t}</button>`).join('')}</span>
      </div>
      <div class="contador" id="contador" aria-live="polite">${num(totalVeces(d))}</div>
      <p class="contador-l">veces más ${d.edad<6?`hasta que ${d.h} cumpla 6 años`:'en los próximos 3 años'}, si nada cambia.</p>
      <p class="ensena">Y cada una le enseña ${esc(d.aprende)}.</p>
    </div>
    <p class="nota">${ico.check}<span>${d.v('Si lo vas a hablar con alguien, enséñale este número. Ponedlo juntos.','Ponedlo juntos: es el número de los dos.')}</span></p>
  </section>`;
}

function camino(d){
  const k=S.modo==='nada'?0:1;
  return `<section class="sec">
    <p class="eyebrow">Lo que viene</p>
    <h2>No se pasa con la edad. <span class="alarma">Cambia de forma.</span></h2>
    <div class="seg" role="group"><button data-act="modo" data-v="nada" class="${S.modo==='nada'?'on':''}" aria-pressed="${S.modo==='nada'}">Si nada cambia</button><button data-act="modo" data-v="empieza" class="${S.modo==='empieza'?'on':''}" aria-pressed="${S.modo==='empieza'}">Si ${d.v('empiezas','empezáis')} ahora</button></div>
    <ol class="linea ${S.modo}" id="linea">${d.hitos.map(a=>`<li><b>${a} años</b><p>${esc(fraseHito(d,a,k))}</p></li>`).join('')}</ol>
  </section>`;
}

function metodo(d){
  const tu=d.v('Tú','Vosotros');
  const B=[
    {n:1,t:tu,s:'El punto de partida',
     p:`Antes de cambiar lo que hace ${d.h}, ${d.v('miramos lo que pasa en ti','miramos lo que pasa en vosotros')} cuando la situación aprieta. Por qué a veces ${d.v('te desbordas','os desbordáis')} aunque no ${d.v('quieras','queráis')}: no es falta de paciencia, es el cerebro en piloto automático, muchas veces repitiendo lo que vivimos de pequeños. Aprendes a hacer una pausa, saber qué sientes y responder desde la calma.`,
     caso:C.reaccion?`${d.v('Me dijiste','Me dijisteis')}: «${esc(C.reaccion)}». Aquí es donde eso empieza a cambiar.`:'',
     m:['Perspectiva del adulto','Viaje a tu infancia','Autorregulación emocional']},
    {n:2,t:d.h,s:'Qué hay detrás de lo que hace',
     p:`A los ${d.edad} años, la parte del cerebro que frena impulsos, razona y espera todavía está en obras. Por eso se desborda, no escucha o no puede parar: no es un desafío, es su momento. Vive en el aquí y ahora, necesita que le anticipes los cambios y órdenes muy concretas. Y su «yo solo» no es un pulso contigo: está construyendo su seguridad.`,
     caso:C.cree?`${d.v('Me dijiste','Me dijisteis')}: «${esc(C.cree)}». Al terminar este bloque lo ${d.v('vas','vais')} a ver con otros ojos.`:'',
     m:['El cerebro de tu hijo','La perspectiva de tu hijo','Etapa de independencia']},
    {n:3,t:'La relación',s:'El vínculo como base de todo',
     p:`Un niño que se siente visto y seguro coopera más. Aprendes a conectar antes de corregir, a ser su ancla cuando se desborda y a poner límites firmes sin gritos, castigos ni chantajes. Validar lo que siente no es permitirlo todo. Te llevas una brújula: una secuencia sencilla para saber qué hacer en cada momento difícil, de la pausa a reparar después.`,
     caso:'',
     m:['La conexión y la presencia','Cómo acompañar en momentos difíciles','Tu brújula para educar']},
    {n:4,t:'El día a día',s:'Situaciones reales',
     p:`Con todo lo anterior, vamos situación por situación: qué pasa por dentro, por qué ocurre y qué hacer, con ejemplos reales de casa.`,
     caso:C.situacion?`«${esc(C.situacion)}»: lo trabajamos aquí, paso a paso.`:'',
     m:['Rabietas','No escucha','Límites','Castigos','Pantallas']}
  ];
  const destaca=MODULO[C.angulo];
  return `<section id="metodo" class="sec">
    <p class="eyebrow">El método</p>
    <h2>Cambiamos el patrón <em>empezando por ${d.v('ti','vosotros')}</em>.</h2>
    <p class="sub">No son trucos para que ${d.h} obedezca. Es entender qué está pasando, para saber qué hacer cada vez. Cuatro bloques, en este orden:</p>
    <div class="bloques">${B.map(b=>`<article class="bloque">
      <header><span class="n">${b.n}</span><div><h3>${b.t}</h3><small>${b.s}</small></div></header>
      <p>${b.p}</p>
      ${b.caso?`<p class="en-caso"><span>En ${d.v('tu','vuestro')} caso</span>${b.caso}</p>`:''}
      <ul class="modulos">${b.m.map(x=>`<li class="${b.n===4&&x===destaca?'on':''}">${esc(x)}</li>`).join('')}</ul>
    </article>`).join('')}</div>
    <p class="pie">Primero ${d.v('entiendes','entendéis')}, después ${d.v('sabes','sabéis')} qué hacer. Por eso los cambios se quedan.</p>
  </section>`;
}

function familias(){
  return `<section id="familias" class="sec">
    <p class="eyebrow">No es tarde</p>
    <h2><em>${PROGRAMA.familias} familias</em> estaban donde ${datos().v('estás tú','estáis vosotros')}.</h2>
    <p class="sub">Escúchalo de ellas, no de nosotros.</p>
    <div class="videos">${PROGRAMA.videos.map(x=>`<figure class="vcard">
      ${x.src?`<video src="${esc(x.src)}#t=0.1" controls playsinline preload="metadata"></video>`:`<div class="vpend">${ico.video}<span>Vídeo próximamente</span></div>`}
      <figcaption><span class="av">${esc(x.n[0])}</span><span><b>${esc(x.n)}</b> · ${esc(x.h)}</span></figcaption></figure>`).join('')}</div>
  </section>`;
}

function formato(d){
  const V=PROGRAMA.formatoVideos;
  const F=[
    ['vid','Vídeos cortos','8 a 12 minutos','Para entender qué pasa en cada situación y cómo afrontarla. Los ves cuando puedas, a tu ritmo.'],
    ['rec','Recursos prácticos','5 a 10 minutos','Guías y ejercicios para llevarlo a casa desde el primer día.'],
    ['ses','Sesiones 1 a 1 con Paloma','En Impulso e Intensivo',`Una hora para ver ${d.v('tu','vuestro')} caso concreto conmigo y ajustar lo que haga falta.`]];
  return `<section class="sec">
    <p class="eyebrow">Cómo lo vas a vivir</p>
    <h2>Unos <em>20 minutos a la semana</em>.</h2>
    <p class="sub">${PROGRAMA.semanas} semanas de acompañamiento. Un vídeo cuando ${d.h} se duerme, un recurso con el café. Cabe en una semana que ya va llena.</p>
    <div class="formato">${F.map(x=>`<article class="fv">
      <div class="fv-media">${V[x[0]]?`<video src="${esc(V[x[0]])}" data-auto muted loop playsinline preload="none" aria-label="${esc(x[1])}"></video>`:`<div class="vpend">${ico.video}</div>`}</div>
      <div class="fv-txt"><h3><i class="sw ${x[0]}"></i>${x[1]}</h3><span class="tag">${x[2]}</span><p>${x[3]}</p></div></article>`).join('')}</div>
    <p class="nota">${ico.check}<span><b>El acceso no termina a las ${PROGRAMA.semanas} semanas.</b> Los vídeos y recursos son ${d.v('tuyos','vuestros')} para siempre: ${d.v('te','os')} sirven ahora, a los 6 y a los 12.</span></p>
  </section>`;
}

function programas(d){
  const pl=PROGRAMA.planes;
  return `<section id="programas" class="sec">
    <p class="eyebrow">Los programas</p>
    <h2>A ${d.h} le quedan <em>${num(d.restan)} semanas</em> en casa ${d.v('contigo','con vosotros')}.</h2>
    <p class="sub">El método son ${PROGRAMA.semanas} de ellas. Elige el plan que mejor ${d.v('te','os')} encaje:</p>
    <div class="planes" role="radiogroup" aria-label="Plan">${pl.map(x=>`<button class="plan ${x.id===S.plan?'on':''}" data-act="plan" data-v="${x.id}" role="radio" aria-checked="${x.id===S.plan}">
      <span class="plan-top"><small>${x.nombre}</small>${x.id==='impulso'?'<span class="reco">El más elegido</span>':''}</span>
      <b>${x.precio}<i>€</i></b>
      <span class="cuotas">o 2 pagos de ${x.cuota2}&nbsp;€ · o 3 de ${x.cuota3}&nbsp;€</span>
      <ul>${x.sesiones?`<li>${x.sesiones} sesiones 1 a 1 con Paloma</li>`:''}<li>Todos los vídeos y recursos, para siempre</li><li>${PROGRAMA.semanas} semanas de acompañamiento</li>${x.sesiones?'':'<li class="no">Sin sesiones 1 a 1</li>'}</ul>
    </button>`).join('')}</div>
    <div class="porsemana" id="porsemana">${porSemana(d)}</div>
    <p class="plazas">Plazas limitadas: las sesiones las hago yo personalmente.</p>
  </section>`;
}
const porSemana=d=>`<strong>${dec(d.porSemana)}<i>€</i></strong><span>por cada semana que le queda en casa ${d.v('contigo','con vosotros')}, con ${esc(d.plan.nombre)}.</span>`;

function dudas(d){
  const Q=[
    ['¿Y si no tengo tiempo?',`Son unos 20 minutos a la semana, en vídeos de 8 a 12 minutos que ves cuando puedes. Menos de lo que os quita una tarde mala.`],
    ['Lo tengo que hablar con mi pareja',`Claro, esto se decide en equipo. Enséñale esta página, sobre todo el contador de arriba. Y si queréis, os resuelvo las dudas a los dos por WhatsApp o en una llamada corta.`],
    [`¿Funcionará con ${d.h}?`,`El método va situación por situación, como las que vivís con ${d.h}, y está pensado para niños de 2 a 6 años. Si ${d.v('quieres','queréis')} que lo vea ${d.v('contigo','con vosotros')} de cerca, Impulso e Intensivo incluyen sesiones 1 a 1 conmigo.`],
    ['Es dinero, me lo tengo que pensar',`Lo entiendo. Son ${dec(d.porSemana)} € por cada semana que le queda en casa, y lo que aprendes ${d.v('te','os')} sirve para siempre. Se puede pagar en 2 o 3 veces sin coste extra.`],
    ['Ya he probado muchas cosas y nada funciona','Casi todo lo que se prueba va a la conducta: premios, castigos, rincones. Aquí empezamos por entender qué hay detrás y por ti. Por eso el cambio se sostiene.'],
    ['¿Cuándo se empieza?','Cuando me digas. Te paso el enlace, entras en la plataforma ese mismo día y, si tu plan tiene sesiones, reservamos la primera esa semana.']
  ];
  return `<section id="dudas" class="sec">
    <p class="eyebrow">Es normal dudar</p>
    <h2>Lo que suele frenar</h2>
    <div class="faq">${Q.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </section>`;
}

function cierre(d){
  const quien=C.padre?`, soy ${C.padre}`:'';
  const peque=C.hijo?` (${C.hijo})`:'';
  const empezar=`Hola Paloma${quien}${peque}. He visto la información y quiero empezar con el plan ${d.plan.nombre}. ¿Me pasas el enlace?`;
  const duda=`Hola Paloma${quien}. He visto la información y tengo una duda: `;
  return `<section id="empezar" class="sec cierre">
    <p class="eyebrow">Cuando ${d.v('quieras','queráis')}</p>
    <h2>${d.p?`${d.p}, ¿empezamos?`:'¿Empezamos?'}</h2>
    <p class="sub">Escríbeme con el plan que ${d.v('elijas','elijáis')} y te paso el enlace para empezar. Si prefieres pagarlo en 2 o 3 veces, dímelo también.</p>
    <div class="elige" role="group" aria-label="Plan">${PROGRAMA.planes.map(x=>`<button data-act="plan" data-v="${x.id}" class="${x.id===S.plan?'on':''}" aria-pressed="${x.id===S.plan}">${x.nombre}</button>`).join('')}</div>
    <a class="btn prim xl" id="wa-empezar" href="${waLink(empezar)}" target="_blank" rel="noopener">${ico.wa}<span>Quiero empezar con ${esc(d.plan.nombre)}</span></a>
    <a class="btn sec xl" href="${waLink(duda)}" target="_blank" rel="noopener">Tengo una duda</a>
    <div class="firma pie-firma"><img src="/media/fotos/paloma-recurso.jpg" alt="" width="48" height="48" loading="lazy"><p>Un abrazo,<b>Paloma</b></p></div>
  </section>`;
}

/* ───────────── render ───────────── */
const app=$('#app');
function render(){
  const d=datos();
  app.innerHTML=hero(d)+esperar(d)+camino(d)+metodo(d)+familias()+formato(d)+programas(d)+dudas(d)+cierre(d);
  observar();
}
let rafC=0;
function cuenta(desde,hasta,ms){
  const el=$('#contador');if(!el)return;
  cancelAnimationFrame(rafC);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=num(hasta);return;}
  const t0=performance.now();
  const paso=t=>{const k=Math.min(1,(t-t0)/ms);const e=1-Math.pow(1-k,3);el.textContent=num(desde+(hasta-desde)*e);if(k<1)rafC=requestAnimationFrame(paso);};
  rafC=requestAnimationFrame(paso);
}
function pintaPlan(){
  const d=datos();
  document.querySelectorAll('[data-act="plan"]').forEach(b=>{const on=b.dataset.v===S.plan;b.classList.toggle('on',on);b.setAttribute(b.getAttribute('role')==='radio'?'aria-checked':'aria-pressed',on);});
  $('#porsemana').innerHTML=porSemana(d);
  const quien=C.padre?`, soy ${C.padre}`:'',peque=C.hijo?` (${C.hijo})`:'';
  const a=$('#wa-empezar');
  a.href=waLink(`Hola Paloma${quien}${peque}. He visto la información y quiero empezar con el plan ${d.plan.nombre}. ¿Me pasas el enlace?`);
  a.querySelector('span').textContent=`Quiero empezar con ${d.plan.nombre}`;
  // las dudas usan el precio por semana del plan elegido
  const det=[...document.querySelectorAll('#dudas details')].map(x=>x.open);
  const s=document.querySelector('#dudas');s.outerHTML=dudas(d);
  document.querySelectorAll('#dudas details').forEach((x,i)=>{x.open=det[i]});
}

app.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const act=b.dataset.act,v=b.dataset.v,d=datos();
  if(act==='veces'){
    const antes=totalVeces(d);S.veces=Math.min(20,Math.max(1,S.veces+(+v)));
    $('#veces').textContent=S.veces;cuenta(antes,totalVeces(d),700);
  }else if(act==='unidad'){
    const antes=totalVeces(d);S.unidad=v;
    b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
    cuenta(antes,totalVeces(d),700);
  }else if(act==='modo'){
    if(S.modo===v)return;S.modo=v;
    b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
    const k=v==='nada'?0:1,l=$('#linea');
    l.className='linea '+v;
    l.querySelectorAll('li').forEach((li,i)=>{li.querySelector('p').textContent=fraseHito(d,d.hitos[i],k);});
  }else if(act==='plan'){
    S.plan=v;pintaPlan();
  }
});

/* vídeos del formato: solo se cargan y reproducen al verse; el contador arranca al llegar */
let vistoContador=false;
function observar(){
  if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(x=>{
    const v=x.target;
    if(v.id==='contador'){if(x.isIntersecting&&!vistoContador){vistoContador=true;cuenta(0,totalVeces(datos()),1400);}return;}
    if(x.isIntersecting){if(v.preload==='none')v.preload='auto';const p=v.play();if(p&&p.catch)p.catch(()=>{});}else v.pause();
  }),{threshold:.35});
  document.querySelectorAll('video[data-auto]').forEach(v=>io.observe(v));
  io.observe($('#contador'));
  }else{const c=$('#contador');if(c)c.textContent=num(totalVeces(datos()));}
  const barra=$('#barra'),fin=$('#empezar'),hero=document.querySelector('.hero');
  addEventListener('scroll',()=>{const r1=hero.getBoundingClientRect(),r2=fin.getBoundingClientRect();barra.hidden=!(r1.bottom<0&&r2.top>innerHeight);},{passive:true});
}

document.title=C.hijo?`Lo que hablamos de ${C.hijo} · Método Synesis`:document.title;
render();
})();
