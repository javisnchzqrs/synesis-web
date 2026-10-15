(()=>{
'use strict';
/* Método Synesis · «El programa»: página para familias muy interesadas que aún no han dejado datos
   (llamada en frío, recomendación…). Sin caso: la propia familia elige edad y situación y la página se adapta.
   Enlace: app.metodosynesis.com/programa/?n=Nombre  (n opcional, solo para el saludo).
   Si cambian precios o planes, cambiarlos aquí, en /info/app.js y en /llamada/app.js. */

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

/* lo que más os cuesta → qué aprende cada vez que pasa y qué viene por edades */
const TEMAS={
  rabietas:{t:'Rabietas',aprende:'que cuando se desborda, nadie sabe qué hacer con lo que siente',modulo:'Rabietas'},
  obedece:{t:'No escucha',aprende:'que solo va en serio cuando hay gritos',modulo:'No escucha'},
  pega:{t:'Pega o muerde',aprende:'que la rabia se saca con las manos',modulo:'Cómo acompañar en momentos difíciles'},
  generico:{t:'Un poco de todo',aprende:'que cuando algo se tuerce, en casa nadie sabe cómo salir',modulo:'Límites'}
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
    6:['En el cole le ponen una etiqueta: «el que pega».','Llega al cole sabiendo parar antes de pegar.'],
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

const q=new URLSearchParams(location.search);
const NOMBRE=String(q.get('n')||'').replace(/[<>"]/g,'').trim().split(/\s+/)[0].slice(0,24);
const S={edad:+q.get('e')>=1&&+q.get('e')<=8?+q.get('e'):3,tema:TEMAS[q.get('t')]?q.get('t'):'generico',
  veces:1,unidad:'dia',modo:'nada',plan:'impulso'};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const dec=n=>n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
const ico={
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
  flecha:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3Z"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>'
};

function datos(){
  const edad=S.edad;
  const plan=PROGRAMA.planes.find(x=>x.id===S.plan)||PROGRAMA.planes[1];
  const restan=Math.max(1,(18-edad)*52);
  return {edad,plan,restan,tema:TEMAS[S.tema],
    horizonte:edad<6?(6-edad)*365:3*365,
    hitos:[6,9,12,15,18].filter(a=>a>edad),
    porSemana:plan.precio/restan};
}
const totalVeces=d=>Math.round(S.veces*(S.unidad==='semana'?d.horizonte/7:d.horizonte));
const fraseHito=(edad,k)=>(edad>=18?HITO18:(HITOS[S.tema]||HITOS.generico)[edad])[k];
const waLink=t=>`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const quien=()=>NOMBRE?`, soy ${NOMBRE}`:'';

/* ───────────── secciones ───────────── */
function hero(){
  return `<section class="hero">
    <div class="firma"><img src="/media/fotos/paloma-recurso.jpg" alt="" width="64" height="64"><p><b>Paloma Robles</b>Educadora infantil y guía familiar</p></div>
    <p class="hola">${NOMBRE?`Hola, ${esc(NOMBRE)}.`:'Hola.'}</p>
    <h1>Entiende a tu peque. <em>Guíale con criterio.</em> Cría sin culpa.</h1>
    <p class="lead">Aquí tienes todo sobre Método Synesis, para verlo con calma: qué cambia en casa, cómo trabajamos y los programas. Léelo a tu ritmo y, si te surge cualquier duda, escríbeme.</p>
    <nav class="indice" aria-label="En esta página">
      <a href="#normal">Por dónde empezar</a><a href="#cambia">Qué cambia</a><a href="#metodo">El método</a><a href="#familias">Otras familias</a><a href="#programas">Programas</a><a href="#dudas">Dudas</a>
    </nav>
  </section>`;
}

function normal(){
  const F=['Sé que no debería gritar, pero a veces no puedo evitarlo.','¿Por qué no me escucha? ¿Es normal esto?','Cada cosa que pruebo funciona dos días y volvemos a lo mismo.','Le quiero con todo. Pero hay momentos en que no sé qué hacer.'];
  return `<section id="normal" class="sec">
    <p class="eyebrow">Es normal</p>
    <h2>Si alguna de estas frases te suena, no te pasa solo a ti.</h2>
    <div class="frases">${F.map(f=>`<div class="burbuja"><p>${esc(f)}</p><span class="burbuja-meta" aria-hidden="true">✓✓</span></div>`).join('')}</div>
    <p class="pie">El problema no eres tú. Es que nadie te enseñó a hacer esto.</p>
    <p class="sub">La mayoría de padres y madres que llegan aquí ya quieren a su peque con todo y ya han leído mucho. Lo que les falta no es amor ni información: es un método que lo integre y saber qué hacer en el momento difícil.</p>
  </section>`;
}

function elige(){
  const edades=[2,3,4,5,6];
  return `<section class="sec" id="elige">
    <p class="eyebrow">Tu caso</p>
    <h2>Cuéntame dos cosas y esta página se adapta a ti.</h2>
    <div class="caja elige-caja">
      <p class="mini">¿Cuántos años tiene tu peque?</p>
      <div class="chips" role="group" aria-label="Edad">${edades.map(e=>`<button data-act="edad" data-v="${e}" class="${S.edad===e?'on':''}" aria-pressed="${S.edad===e}">${e} años</button>`).join('')}</div>
      <p class="mini" style="margin-top:18px">¿Qué es lo que más os cuesta ahora?</p>
      <div class="chips" role="group" aria-label="Situación">${Object.entries(TEMAS).map(([k,x])=>`<button data-act="tema" data-v="${k}" class="${S.tema===k?'on':''}" aria-pressed="${S.tema===k}">${x.t}</button>`).join('')}</div>
    </div>
  </section>`;
}

function esperar(d){
  return `<section id="esperar" class="sec">
    <p class="eyebrow">Lo que cuesta esperar</p>
    <h2>¿Cuántas veces pasa algo así en tu casa?</h2>
    <p class="sub">Pon el número que más se parezca a lo que vivís cada día.</p>
    <div class="caja contador-caja">
      <div class="veces">
        <span class="stepper"><button data-act="veces" data-v="-1" aria-label="Menos">−</button><output id="veces">${S.veces}</output><button data-act="veces" data-v="1" aria-label="Más">+</button></span>
        <span class="unidad" role="group" aria-label="Cada cuánto">${[['dia','al día'],['semana','a la semana']].map(([k,t])=>`<button data-act="unidad" data-v="${k}" class="${S.unidad===k?'on':''}" aria-pressed="${S.unidad===k}">${t}</button>`).join('')}</span>
      </div>
      <div class="contador" id="contador" aria-live="polite">${num(totalVeces(d))}</div>
      <p class="contador-l" id="contador-l">veces más ${d.edad<6?'hasta que cumpla 6 años':'en los próximos 3 años'}, si nada cambia.</p>
      <p class="ensena" id="ensena">Y cada una le enseña ${esc(d.tema.aprende)}.</p>
    </div>
    <p class="nota">${ico.check}<span>No es para asustarte. Es para que veas que cada día cuenta, en un sentido y en el otro.</span></p>
  </section>`;
}

function camino(d){
  const k=S.modo==='nada'?0:1;
  return `<section class="sec">
    <p class="eyebrow">Lo que viene</p>
    <h2>No se pasa con la edad. <span class="alarma">Cambia de forma.</span></h2>
    <div class="seg" role="group"><button data-act="modo" data-v="nada" class="${S.modo==='nada'?'on':''}" aria-pressed="${S.modo==='nada'}">Si nada cambia</button><button data-act="modo" data-v="empieza" class="${S.modo==='empieza'?'on':''}" aria-pressed="${S.modo==='empieza'}">Si empezáis ahora</button></div>
    <ol class="linea ${S.modo}" id="linea">${d.hitos.map(a=>`<li><b>${a} años</b><p>${esc(fraseHito(a,k))}</p></li>`).join('')}</ol>
  </section>`;
}

function cambia(){
  const P=[
    ['En el momento difícil','Gritas, cedes o te bloqueas. Y luego te sientes fatal.','Sabes qué hacer. Haces una pausa y respondes, en vez de reaccionar.'],
    ['Con tu peque','Parece que te desafía, que lo hace a propósito.','Entiendes lo que hay detrás. Y deja de ser una lucha.'],
    ['En ti','Te acuestas pensando en lo que hiciste mal.','Te equivocas como todos, pero sabes volver. Sin culpa.'],
    ['En casa','Cada tarde es una prueba. Se vive con tensión.','Hay más ratos buenos. Y los malos duran menos.']
  ];
  const E=[['Calma','Responder en vez de reaccionar'],['Criterio','Saber por qué haces lo que haces'],['Conexión','Una relación más real con tu peque'],['Confianza','Sentirte capaz, sin dudar de todo']];
  return `<section id="cambia" class="sec">
    <p class="eyebrow">Lo que cambia</p>
    <h2>No es que se porte mejor. <em>Es que tú sabes qué hacer.</em></h2>
    <p class="sub">No te prometemos un peque perfecto, ni a ti tampoco. Te prometemos claridad: entender qué está pasando y por qué, para actuar con seguridad.</p>
    <div class="antes-despues">${P.map(([t,a,b])=>`<article class="ad">
      <h3>${t}</h3>
      <p class="antes"><span>Ahora</span>${a}</p>
      <p class="despues"><span>Después</span>${b}</p></article>`).join('')}</div>
    <div class="estados">${E.map(([t,s])=>`<div><b>${t}</b><span>${s}</span></div>`).join('')}</div>
  </section>`;
}

function metodo(d){
  const B=[
    {n:1,t:'Tú',s:'El punto de partida',
     p:'Antes de cambiar lo que hace tu peque, miramos lo que pasa en ti cuando la situación aprieta. Por qué a veces te desbordas aunque no quieras: no es falta de paciencia, es el cerebro en piloto automático, muchas veces repitiendo lo que vivimos de pequeños. Aprendes a hacer una pausa, saber qué sientes y responder desde la calma.',
     m:['Perspectiva del adulto','Viaje a tu infancia','Autorregulación emocional']},
    {n:2,t:'Tu peque',s:'Qué hay detrás de lo que hace',
     p:`A los ${d.edad} años, la parte del cerebro que frena impulsos, razona y espera todavía está en obras. Por eso se desborda, no escucha o no puede parar: no es un desafío, es su momento. Vive en el aquí y ahora, necesita que le anticipes los cambios y órdenes muy concretas. Y su «yo solo» no es un pulso contigo: está construyendo su seguridad.`,
     m:['El cerebro de tu hijo','La perspectiva de tu hijo','Etapa de independencia']},
    {n:3,t:'La relación',s:'El vínculo como base de todo',
     p:'Un niño que se siente visto y seguro coopera más. Aprendes a conectar antes de corregir, a ser su ancla cuando se desborda y a poner límites firmes sin gritos, castigos ni chantajes. Validar lo que siente no es permitirlo todo. Te llevas una brújula: una secuencia sencilla para saber qué hacer en cada momento difícil, de la pausa a reparar después.',
     m:['La conexión y la presencia','Cómo acompañar en momentos difíciles','Tu brújula para educar']},
    {n:4,t:'El día a día',s:'Situaciones reales',
     p:'Con todo lo anterior, vamos situación por situación: qué pasa por dentro, por qué ocurre y qué hacer, con ejemplos reales de casa.',
     m:['Rabietas','No escucha','Límites','Castigos','Pantallas']}
  ];
  return `<section id="metodo" class="sec">
    <p class="eyebrow">El método</p>
    <h2>Cambiamos el patrón <em>empezando por ti</em>.</h2>
    <p class="sub">No son trucos para que tu peque obedezca. Es entender qué está pasando, para saber qué hacer cada vez. Cuatro bloques, en este orden:</p>
    <div class="bloques" id="bloques">${B.map(b=>`<article class="bloque">
      <header><span class="n">${b.n}</span><div><h3>${b.t}</h3><small>${b.s}</small></div></header>
      <p>${b.p}</p>
      <ul class="modulos">${b.m.map(x=>`<li class="${x===d.tema.modulo?'on':''}">${esc(x)}</li>`).join('')}</ul>
    </article>`).join('')}</div>
    <p class="pie">Primero entiendes, después sabes qué hacer. Por eso los cambios se quedan.</p>
  </section>`;
}

function diferente(){
  const D=[
    ['Empieza por ti, no por tu peque','La mayoría de cursos te dan técnicas para el niño. Aquí atacamos la causa: lo que pasa en ti en el momento difícil.'],
    ['Un método, no consejos sueltos','Tú, tu peque, la relación y el día a día, en un orden que tiene sentido. Nada de tips que funcionan dos días.'],
    ['Sin juicio','No estás haciéndolo mal. Te faltan herramientas. Aquí nadie te va a hacer sentir peor de lo que ya te sientes.'],
    ['Con una persona real','No te quedas con unos vídeos y ya: según el plan, Paloma ve tu caso contigo en sesiones 1 a 1.']
  ];
  return `<section class="sec">
    <p class="eyebrow">Por qué no es «otro curso más»</p>
    <h2>Lo que lo hace distinto</h2>
    <div class="dif">${D.map(([t,p])=>`<div>${ico.check}<p><b>${t}</b>${p}</p></div>`).join('')}</div>
  </section>`;
}

function familias(){
  return `<section id="familias" class="sec">
    <p class="eyebrow">No es tarde</p>
    <h2><em>${PROGRAMA.familias} familias</em> estaban donde estás tú.</h2>
    <p class="sub">Escúchalo de ellas, no de nosotros.</p>
    <div class="videos">${PROGRAMA.videos.map(x=>`<figure class="vcard">
      <video src="${esc(x.src)}#t=0.1" controls playsinline preload="metadata"></video>
      <figcaption><span class="av">${esc(x.n[0])}</span><span><b>${esc(x.n)}</b> · ${esc(x.h)}</span></figcaption></figure>`).join('')}</div>
  </section>`;
}

function formato(){
  const V=PROGRAMA.formatoVideos;
  const F=[
    ['vid','Vídeos cortos','8 a 12 minutos','Para entender qué pasa en cada situación y cómo afrontarla. Los ves cuando puedas, a tu ritmo.'],
    ['rec','Recursos prácticos','5 a 10 minutos','Guías y ejercicios para llevarlo a casa desde el primer día.'],
    ['ses','Sesiones 1 a 1 con Paloma','En Impulso e Intensivo','Una hora para ver tu caso concreto y ajustar lo que haga falta.']];
  return `<section class="sec">
    <p class="eyebrow">Cómo lo vas a vivir</p>
    <h2>Unos <em>20 minutos a la semana</em>.</h2>
    <p class="sub">${PROGRAMA.semanas} semanas de acompañamiento. Un vídeo cuando tu peque se duerme, un recurso con el café. Cabe en una semana que ya va llena.</p>
    <div class="formato">${F.map(x=>`<article class="fv">
      <div class="fv-media"><video src="${esc(V[x[0]])}" data-auto muted loop playsinline preload="none" aria-label="${esc(x[1])}"></video></div>
      <div class="fv-txt"><h3><i class="sw ${x[0]}"></i>${x[1]}</h3><span class="tag">${x[2]}</span><p>${x[3]}</p></div></article>`).join('')}</div>
    <p class="nota">${ico.check}<span><b>El acceso no termina a las ${PROGRAMA.semanas} semanas.</b> Los vídeos y recursos son tuyos para siempre: te sirven ahora, a los 6 y a los 12.</span></p>
  </section>`;
}

function paloma(){
  return `<section class="sec">
    <p class="eyebrow">Quién te acompaña</p>
    <div class="paloma">
      <img src="/media/fotos/paloma-recurso.jpg" alt="Paloma Robles" width="120" height="120" loading="lazy">
      <div><h2>Paloma Robles</h2><p class="mini">Educadora infantil y guía familiar</p></div>
    </div>
    <p class="sub">He acompañado a más de 150 familias que estaban justo donde estás tú. Trabajo desde una idea sencilla: tu peque no necesita que le controles, necesita que le entiendas y le guíes. Mi forma de trabajar bebe de Reggio Emilia y Montessori, con una mirada sin juicio, y siempre aterrizada en lo que pasa de verdad en tu casa.</p>
  </section>`;
}

function programas(d){
  return `<section id="programas" class="sec">
    <p class="eyebrow">Los programas</p>
    <h2>A tu peque le quedan <em><span id="restan">${num(d.restan)}</span> semanas</em> en casa contigo.</h2>
    <p class="sub">El método son ${PROGRAMA.semanas} de ellas. Elige el plan que mejor te encaje:</p>
    <div class="planes" role="radiogroup" aria-label="Plan">${PROGRAMA.planes.map(x=>`<button class="plan ${x.id===S.plan?'on':''}" data-act="plan" data-v="${x.id}" role="radio" aria-checked="${x.id===S.plan}">
      <span class="plan-top"><small>${x.nombre}</small>${x.id==='impulso'?'<span class="reco">El más elegido</span>':''}</span>
      <b>${x.precio}<i>€</i></b>
      <span class="cuotas">o 2 pagos de ${x.cuota2}&nbsp;€ · o 3 de ${x.cuota3}&nbsp;€</span>
      <ul>${x.sesiones?`<li>${x.sesiones} sesiones 1 a 1 con Paloma</li>`:''}<li>Todos los vídeos y recursos, para siempre</li><li>${PROGRAMA.semanas} semanas de acompañamiento</li>${x.sesiones?'':'<li class="no">Sin sesiones 1 a 1</li>'}</ul>
    </button>`).join('')}</div>
    <div class="porsemana" id="porsemana">${porSemana(d)}</div>
    <p class="plazas">Plazas limitadas: las sesiones las hago yo personalmente.</p>
  </section>`;
}
const porSemana=d=>`<strong>${dec(d.porSemana)}<i>€</i></strong><span>por cada semana que le queda en casa contigo, con ${esc(d.plan.nombre)}.</span>`;

function dudas(d){
  const Q=[
    ['¿No será otro curso más?','Si has probado cosas que no funcionaron, casi siempre iban a la conducta: premios, castigos, rincones. Aquí empezamos por entender qué hay detrás y por ti. Por eso el cambio se sostiene.'],
    ['Creo que el problema soy yo','Precisamente por eso el método empieza por ti. Que te desbordes no es un rasgo fijo: es algo que se aprende a manejar. Lo vemos en familias que llegaron diciendo exactamente lo mismo.'],
    ['¿Y si no tengo tiempo?','Son unos 20 minutos a la semana, en vídeos de 8 a 12 minutos que ves cuando puedes. Menos de lo que os quita una tarde mala.'],
    ['¿Lo podemos hacer en pareja?','Sí, y es lo ideal: cuando los dos entendéis lo mismo, en casa remáis en la misma dirección. Los vídeos los podéis ver juntos y a las sesiones 1 a 1 podéis venir los dos.'],
    ['Es dinero, me lo tengo que pensar',`Lo entiendo. Son ${dec(d.porSemana)} € por cada semana que le queda en casa, y lo que aprendes te sirve para siempre. Se puede pagar en 2 o 3 veces sin coste extra.`],
    ['¿Funciona con la edad de mi peque?','El método está pensado para niños y niñas de 2 a 6 años, que es cuando más se nota el cambio. Si tu peque es mayor, escríbeme y te digo con sinceridad si encaja.'],
    ['¿Cuándo se empieza?','Cuando me digas. Te paso el enlace, entras en la plataforma ese mismo día y, si tu plan tiene sesiones, reservamos la primera esa semana.']
  ];
  return `<section id="dudas" class="sec">
    <p class="eyebrow">Es normal dudar</p>
    <h2>Lo que suele frenar</h2>
    <div class="faq">${Q.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </section>`;
}

function cierre(d){
  const empezar=`Hola Paloma${quien()}. He visto la información de Método Synesis y quiero empezar con el plan ${d.plan.nombre}. ¿Me pasas el enlace?`;
  const duda=`Hola Paloma${quien()}. He visto la información de Método Synesis y tengo una duda: `;
  return `<section id="empezar" class="sec cierre">
    <p class="eyebrow">Cuando quieras</p>
    <h2>${NOMBRE?`${esc(NOMBRE)}, ¿empezamos?`:'¿Empezamos?'}</h2>
    <p class="sub">Escríbeme con el plan que elijas y te paso el enlace para empezar. Si prefieres pagarlo en 2 o 3 veces, dímelo también.</p>
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
  app.innerHTML=hero()+normal()+elige()+esperar(d)+camino(d)+cambia()+metodo(d)+diferente()+familias()+formato()+paloma()+programas(d)+dudas(d)+cierre(d);
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
function toggle(b){b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});}
/* al cambiar edad o situación: se repintan las piezas que dependen de ellas, sin mover la página */
function adapta(antes){
  const d=datos();
  $('#contador-l').textContent=`veces más ${d.edad<6?'hasta que cumpla 6 años':'en los próximos 3 años'}, si nada cambia.`;
  $('#ensena').textContent=`Y cada una le enseña ${d.tema.aprende}.`;
  cuenta(antes,totalVeces(d),700);
  const k=S.modo==='nada'?0:1;
  $('#linea').innerHTML=d.hitos.map(a=>`<li><b>${a} años</b><p>${esc(fraseHito(a,k))}</p></li>`).join('');
  document.querySelectorAll('#bloques .bloque')[1].querySelector('p').textContent=document.querySelectorAll('#bloques .bloque')[1].querySelector('p').textContent.replace(/A los \d+ años/,`A los ${d.edad} años`);
  document.querySelectorAll('#bloques .modulos li').forEach(li=>li.classList.toggle('on',li.textContent===d.tema.modulo));
  $('#restan').textContent=num(d.restan);
  pintaPlan();
}
function pintaPlan(){
  const d=datos();
  document.querySelectorAll('[data-act="plan"]').forEach(b=>{const on=b.dataset.v===S.plan;b.classList.toggle('on',on);b.setAttribute(b.getAttribute('role')==='radio'?'aria-checked':'aria-pressed',on);});
  $('#porsemana').innerHTML=porSemana(d);
  const a=$('#wa-empezar');
  a.href=waLink(`Hola Paloma${quien()}. He visto la información de Método Synesis y quiero empezar con el plan ${d.plan.nombre}. ¿Me pasas el enlace?`);
  a.querySelector('span').textContent=`Quiero empezar con ${d.plan.nombre}`;
  const abiertos=[...document.querySelectorAll('#dudas details')].map(x=>x.open);
  $('#dudas').outerHTML=dudas(d);
  document.querySelectorAll('#dudas details').forEach((x,i)=>{x.open=abiertos[i]});
}

app.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const act=b.dataset.act,v=b.dataset.v,d=datos();
  if(act==='edad'){const antes=totalVeces(d);S.edad=+v;toggle(b);adapta(antes);}
  else if(act==='tema'){const antes=totalVeces(d);S.tema=v;toggle(b);adapta(antes);}
  else if(act==='veces'){const antes=totalVeces(d);S.veces=Math.min(20,Math.max(1,S.veces+(+v)));$('#veces').textContent=S.veces;cuenta(antes,totalVeces(d),700);}
  else if(act==='unidad'){const antes=totalVeces(d);S.unidad=v;toggle(b);cuenta(antes,totalVeces(d),700);}
  else if(act==='modo'){
    if(S.modo===v)return;S.modo=v;toggle(b);
    const k=v==='nada'?0:1,l=$('#linea');l.className='linea '+v;
    l.querySelectorAll('li').forEach((li,i)=>{li.querySelector('p').textContent=fraseHito(d.hitos[i],k);});
  }
  else if(act==='plan'){S.plan=v;pintaPlan();}
});

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
  }
  const barra=$('#barra'),fin=$('#empezar'),hero=document.querySelector('.hero');
  addEventListener('scroll',()=>{const r1=hero.getBoundingClientRect(),r2=fin.getBoundingClientRect();barra.hidden=!(r1.bottom<0&&r2.top>innerHeight);},{passive:true});
}

render();
})();
