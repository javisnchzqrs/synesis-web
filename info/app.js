(()=>{
'use strict';
/* Método Synesis · "Lo que hablamos": el recurso de la llamada, para verlo con calma.
   Mismo enlace de caso que /llamada/ (?c=base64 JSON). La oferta (precio, cuotas, bonos) sale de /comun/oferta.js. */

const PROGRAMA={
  familias:'+150',
  videos:[
    {n:'Paula',h:'niño de 4 años',src:'/media/videos/testimonio-paula.mp4'},
    {n:'Alba',h:'niño de 3 años',src:'/media/videos/testimonio-alba.mp4'}
  ]
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
      siente:j.sie||'',cree:j.cre||'',deseo:j.des||''};
  }catch(e){return null}
}
const C=leerEnlace()||{...EJEMPLO};

/* formas de pago que ve la familia (las cuotas propias, solo Paloma si Klarna rechaza) */
const PAGOS=OFERTA.pagos.filter(x=>!x.siRechaza);
/* ───────────── estado ───────────── */
const S={veces:1,unidad:'dia',modo:'nada',filo:'hab',hoy:null,meta:null,ses:1,pago:'unico'};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const mezcla=(a,b,t)=>{const h=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const ico={
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3Z"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>',
  flecha:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></svg>',
  mano:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18.4 5.6l-2.1 2.1M21 12h-3"/><circle cx="12" cy="14" r="5"/><path d="m10 14 1.5 1.5L14 13"/></svg>'
};

/* datos derivados */
function datos(){
  const edad=Math.min(12,Math.max(1,+C.edad||3));
  const ella=C.rol!=='padre',amb=C.rol==='ambos',nina=C.nino==='a';
  return {edad,amb,nina,
    horizonte:edad<6?(6-edad)*365:3*365,
    h:esc(C.hijo||'tu peque'),p:esc(C.padre),
    v:(sg,pl)=>amb?pl:sg,
    g:(m,f)=>nina?f:m,
    gp:(m,f)=>amb?m.replace(/o$/,'os'):(ella?f:m),
    aprende:REACCIONES[C.reaccion]||'que cuando se desborda, nadie sabe qué hacer',
    hitos:[6,9,12,15,18].filter(a=>a>edad),
    pago:PAGOS.find(x=>x.id===S.pago)||PAGOS[0]};
}
const totalVeces=d=>Math.round(S.veces*(S.unidad==='semana'?d.horizonte/7:d.horizonte));
function fraseHito(d,edad,k){
  const set=HITOS[C.angulo]||HITOS.generico;
  let t=(edad>=18?HITO18:set[edad])[k].replace('{elque}',d.g('el que','la que'));
  if(d.amb)[['Y a ti ya no te quedan','Y a vosotros ya no os quedan'],['Y tú, sabiendo','Y vosotros, sabiendo'],['te lo cuenta a ti','os lo cuenta a vosotros'],
    ['Te sigue contando','Os sigue contando'],['contigo','con vosotros']].forEach(([a,b])=>{t=t.split(a).join(b)});
  return t;
}
function waLink(texto){return `https://wa.me/${OFERTA.whatsapp}?text=${encodeURIComponent(texto)}`;}

/* ───────────── secciones ───────────── */
function hero(d){
  const hola=d.p?`Hola, ${d.p}.`:'Hola.';
  const burbuja=C.deseo?`<div class="dijiste"><p class="mini">${d.v('Lo que me dijiste','Lo que me contasteis')}</p>
      <div class="burbuja"><p>${esc(C.deseo)}</p><span class="burbuja-meta" aria-hidden="true">✓✓</span></div></div>`:'';
  return `<section class="hero">
    <div class="firma"><img src="/media/fotos/paloma-recurso.jpg" alt="" width="64" height="64"><p><b>Paloma Robles</b>Educadora infantil y guía familiar</p></div>
    <p class="hola">${hola}</p>
    <h1>Lo que hablamos de <em>${d.h}</em>, para ${d.v('que lo veas','que lo veáis')} con calma.</h1>
    <p class="lead">Aquí ${d.v('tienes','tenéis')} todo: ${d.v('tu','vuestro')} caso, cómo trabajamos y el programa. Léelo a ${d.v('tu','vuestro')} ritmo, y si te surge cualquier duda, escríbeme.</p>
    ${burbuja}
    <nav class="indice" aria-label="En esta página">
      <a href="#esperar">Lo que cuesta esperar</a><a href="#filosofia">La filosofía</a><a href="#meses">Los 3 meses</a><a href="#familias">Otras familias</a><a href="#incluye">Lo que incluye</a><a href="#dudas">Dudas</a>
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

function filosofia(d){
  const capas=[[d.v('Tú','Vosotros'),'Qué hacer en el momento'],[C.hijo||'Tu peque','Qué hay detrás'],['La relación','Volver a conectar'],['El día a día',C.situacion||'Situaciones reales']];
  return `<section id="filosofia" class="sec">
    <p class="eyebrow">La filosofía</p>
    <h2>${d.h} es el termómetro. <em>${d.v('Tú eres','Vosotros sois')} el termostato.</em></h2>
    <p class="sub">Lo que hace ${d.h} marca la temperatura que hay en casa. Mira las dos formas de bajarla.</p>
    <div class="filo es-${S.filo}" id="filo">
      <div class="seg filo-seg" role="group"><button data-act="filo" data-v="hab" class="${S.filo==='hab'?'on':''}">Lo habitual</button><button data-act="filo" data-v="syn" class="${S.filo==='syn'?'on':''}">Con Synesis</button></div>
      <p class="filo-sub solo-hab">Lo normal es intentar bajar el número. Pulsa cada uno:</p>
      <p class="filo-sub solo-syn">Cuando cambias la temperatura, el número baja solo. Y se queda.</p>
      <div class="solo-hab intentos">${['Premios','Castigos','Trucos'].map((t,i)=>`<button class="intento" data-act="termo" data-v="${i}"><span class="cn">${i+1}</span>${t}</button>`).join('')}</div>
      <div class="solo-syn"><button class="btn prim" data-act="ajustar">Ajustar el termostato</button></div>
      <div class="termo-host" id="termo-host" data-nombre="${esc(C.hijo||'Tu peque')}" data-modo="${S.filo}"></div>
      <ol class="capas-t solo-syn">${capas.map((x,i)=>`<li data-capa="${i+1}"><span class="cn">${i+1}</span><span><b>${esc(x[0])}</b><small>${esc(x[1])}</small></span></li>`).join('')}</ol>
    </div>
    <p class="nota">${ico.check}<span><b>No es que ${d.v('tú lo provoques','vosotros lo provoquéis')}.</b> Es que en ${d.v('ti','vosotros')} está la palanca.</span></p>
  </section>`;
}

/* los 3 meses: escala de control + gráfica + ciclo de cada sesión */
const SESIONES=[{w:1},{w:2},{w:4},{w:6},{w:8},{w:11}];
function cicloDe(n){
  if(n===1)return [['Antes','Evaluación inicial','Un cuestionario por adulto. Tu punto de partida.'],['Sesión 1','Tus oportunidades','Vemos dónde está la palanca.'],['Después','Tu plan','Tus primeras tareas, hasta la sesión 2.']];
  if(n===6)return [['Antes','Medimos','Cómo ha ido desde la sesión 5.'],['Sesión 6','Dónde estás','Comparamos con el punto de partida.'],['Después','Tu plan','Para seguir por tu cuenta.']];
  return [['Antes','Medimos','Cómo ha ido desde la sesión '+(n-1)+'.'],['Sesión '+n,'Enfocamos','Lo que más mueve tu número.'],['Después','Tu plan','Tareas hasta la sesión '+(n+1)+'.']];
}
function nums(q){
  const colores=Array.from({length:11},(_,i)=>mezcla('#C4785D','#8FAF9A',i/10));
  return `<div class="nums" role="group">${colores.map((c,i)=>`<button style="--c:${c}" data-act="num" data-q="${q}" data-v="${i}" class="${S[q]===i?'on':''}" aria-pressed="${S[q]===i}">${i}</button>`).join('')}</div>`;
}
function grafica(){
  const hay=S.hoy!==null&&S.meta!==null;
  const a=S.hoy??3,b=Math.max(S.meta??8,a);
  const W=560,H=300,L=30,Rr=14,T=22,B=44;
  const x=w=>L+w/12*(W-L-Rr),y=v=>T+(1-v/10)*(H-T-B);
  const f=w=>a+(b-a)*(1-Math.pow(1-w/12,1.6));
  let dpath='';for(let w=0;w<=12.001;w+=.25)dpath+=(w?'L':'M')+x(w).toFixed(1)+' '+y(f(w)).toFixed(1);
  const area=dpath+`L${x(12)} ${y(0)}L${x(0)} ${y(0)}Z`;
  const meses=[0,1,2].map(m=>`<rect class="mes ${m%2?'b':''}" x="${x(m*4)}" y="${T-10}" width="${x(4)-x(0)}" height="${H-B-T+10}"/><text class="mes-t" x="${x(m*4+2)}" y="${H-14}">Mes ${m+1} · ${3-m} ${m===2?'sesión':'sesiones'}</text>`).join('');
  const grid=[0,5,10].map(v=>`<line class="rej" x1="${x(0)}" x2="${x(12)}" y1="${y(v)}" y2="${y(v)}"/><text class="rej-t" x="${L-8}" y="${y(v)+4}">${v}</text>`).join('');
  const nodos=SESIONES.map((s,i)=>{const w=s.w-.5,cx=x(w),cy=y(f(w));return `<g class="nodo ${S.ses===i+1?'on':''}" data-act="ses" data-v="${i+1}"><circle cx="${cx}" cy="${cy}" r="16"/><text x="${cx}" y="${cy+5}">${i+1}</text></g>`;}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FAF9A" stop-opacity=".35"/><stop offset="1" stop-color="#8FAF9A" stop-opacity="0"/></linearGradient></defs>
      ${meses}${grid}
      <line class="meta-l" x1="${x(0)}" x2="${x(12)}" y1="${y(b)}" y2="${y(b)}"/><text class="meta-t" x="${x(12)-6}" y="${y(b)-10}">Objetivo${hay?' · '+b:''}</text>
      <path class="area" d="${area}"/><path class="linea-g" d="${dpath}"/>
      <circle class="ini" cx="${x(0)}" cy="${y(a)}" r="7"/><text class="ini-t" x="${x(0)+14}" y="${y(a)+22}">Hoy${hay?' · '+a:''}</text>
      ${nodos}</svg>`;
}
const ciclo=()=>cicloDe(S.ses).map((c,i)=>`<div class="paso-c ${i===1?'mid':''}"><small>${c[0]}</small><b>${c[1]}</b><span>${c[2]}</span></div>${i<2?`<span class="ciclo-f">${ico.flecha}</span>`:''}`).join('');
function resEscala(d){
  if(S.hoy===null)return '';
  if(S.meta===null)return `<strong><span class="a">${S.hoy}</span></strong><small>Ahora, ¿dónde ${d.v('quieres','queréis')} estar?</small>`;
  return `<strong><span class="a">${S.hoy}</span>${ico.flecha}<span class="b">${S.meta}</span></strong><small>Ese es el camino que vamos a hacer ${d.gp('juntos','juntas')}.</small>`;
}
function meses(d){
  return `<section id="meses" class="sec">
    <p class="eyebrow">Los 3 meses</p>
    <h2>Un objetivo. <em>Medido sesión a sesión.</em></h2>
    <p class="sub">Medimos una sola cosa: ${d.v('tu','vuestro')} termostato. Márcalo ${d.v('tú','vosotros')}:</p>
    <div class="caja escala">
      <p class="pregunta">En los momentos difíciles con ${d.h}, ¿cuánto control ${d.v('sientes','sentís')} sobre cómo ${d.v('reaccionas tú','reaccionáis vosotros')}?</p>
      ${nums('hoy')}<div class="extremos"><span>0 · Exploto, no me reconozco</span><span>10 · Reacciono como quiero</span></div>
      <p class="pregunta p2">¿Y dónde ${d.v('quieres','queréis')} estar dentro de 3 meses?</p>
      ${nums('meta')}
      <div class="res" id="res">${resEscala(d)}</div>
    </div>
    <div class="grafica" id="grafica">${grafica()}</div>
    <p class="mini-c">Pulsa cada sesión:</p>
    <div class="ciclo" id="ciclo" aria-live="polite">${ciclo()}</div>
    <ul class="puntos">
      <li><b>6 sesiones conmigo</b>: 3 el primer mes, 2 el segundo y 1 el tercero. Con ${d.v('tu pareja, si quiere','los dos')}.</li>
      <li><b>Un plan después de cada sesión</b>, con las tareas hasta la siguiente.</li>
      <li><b>Antes de cada sesión medimos cómo vas</b>, para enfocarla en lo que más mueve.</li>
      <li><b>${d.v('Tu','Vuestra')} área personal</b>, con ${d.v('tu','vuestra')} evolución.</li>
    </ul>
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

function incluye(d){
  const li=x=>`<li><span><b>${esc(x[0])}</b>${x[1]?`<small>${esc(x[1])}</small>`:''}</span>${x[2]?`<em>${num(x[2])} €</em>`:''}</li>`;
  return `<section id="incluye" class="sec">
    <p class="eyebrow">Lo que incluye</p>
    <h2>3 meses de acompañamiento <em>paso a paso</em> conmigo.</h2>
    <div class="caja prog"><ul class="prog-l">${OFERTA.incluye.map(li).join('')}</ul></div>
    <h3 class="bonos-t">Y si ${d.v('empiezas','empezáis')} en las 48 h siguientes a nuestra llamada:</h3>
    <div class="bgrid">${OFERTA.bonos.map(x=>`<article class="bcard">
      <div class="bcard-top"><span class="bico">${ico[x.ico]||''}</span>${x.badge?`<span class="bbadge">${esc(x.badge)}</span>`:''}</div>
      <h3>${esc(x.n)}</h3>
      ${x.lista?`<ul class="blista">${x.lista.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:`<p>${esc(x.d)}</p>`}
      <div class="bprecio"><s>${x.valor} €</s><b>Gratis</b></div></article>`).join('')}</div>
    <div class="total"><span>Valor total</span><b>${num(OFERTA.valorTotal())} €</b></div>
  </section>`;
}

function inversion(d){
  return `<section id="inversion" class="sec">
    <p class="eyebrow">La inversión</p>
    <div class="precio"><s>${num(OFERTA.valorTotal())} €</s><strong>${OFERTA.precio}<i>€</i></strong></div>
    <p class="sub">Elige cómo ${d.v('prefieres','preferís')} pagarlo:</p>
    <div class="planes" role="radiogroup" aria-label="Forma de pago">${PAGOS.map(x=>`<button class="plan ${x.id===S.pago?'on':''}" data-act="pago" data-v="${x.id}" role="radio" aria-checked="${x.id===S.pago}">
      <span class="plan-top"><small>${esc(x.nombre)}</small></span>
      <b>${esc(x.precio)}<i>€</i></b>
      <span class="cuotas">${esc(x.det)}</span>
    </button>`).join('')}</div>
    <p class="plazas">Plazas limitadas: las sesiones las hago yo personalmente.</p>
  </section>`;
}

function dudas(d){
  const Q=[
    ['¿Y si no tengo tiempo?',`Las sesiones las cuadramos contigo. Y el plan de cada semana va dentro de lo que ya vivís en casa, no aparte.`],
    ['Lo tengo que hablar con mi pareja',`Claro, esto se decide en equipo. Enséñale esta página, sobre todo el contador de arriba. Puede venir a las sesiones, y si queréis os resuelvo las dudas a los dos por WhatsApp.`],
    [`¿Funcionará con ${d.h}?`,`Trabajamos ${d.v('tu','vuestro')} caso, no uno genérico. Empezamos con una evaluación y antes de cada sesión medimos cómo ${d.v('vas','vais')}, así que lo vemos sobre la marcha. Está pensado para peques de 2 a 6 años.`],
    ['Es dinero, me lo tengo que pensar',`Lo entiendo. Se puede pagar en 3 plazos sin intereses con Klarna (3 × ${OFERTA.cuotaKlarna} €).`],
    ['Ya he probado muchas cosas y nada funciona','Casi todo lo que se prueba intenta bajar el número: premios, castigos, rincones. Aquí trabajamos el termostato. Por eso el cambio se queda.'],
    ['¿Cuándo se empieza?',`Cuando me digas. Te paso el enlace y ese mismo día ${d.v('rellenas tu','rellenáis vuestro')} cuestionario de diagnóstico. La primera sesión, esa misma semana.`]
  ];
  return `<section id="dudas" class="sec">
    <p class="eyebrow">Es normal dudar</p>
    <h2>Lo que suele frenar</h2>
    <div class="faq">${Q.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </section>`;
}

function textoEmpezar(d){
  const quien=C.padre?`, soy ${C.padre}`:'',peque=C.hijo?` (${C.hijo})`:'';
  return `Hola Paloma${quien}${peque}. He visto la información y quiero empezar, con ${d.pago.wa}. ¿Me pasas el enlace?`;
}
function cierre(d){
  const quien=C.padre?`, soy ${C.padre}`:'';
  const duda=`Hola Paloma${quien}. He visto la información y tengo una duda: `;
  return `<section id="empezar" class="sec cierre">
    <p class="eyebrow">Cuando ${d.v('quieras','queráis')}</p>
    <h2>${d.p?`${d.p}, ¿empezamos?`:'¿Empezamos?'}</h2>
    <p class="sub">Escríbeme con la forma de pago que ${d.v('prefieras','prefiráis')} y te paso el enlace para empezar.</p>
    <div class="elige" role="group" aria-label="Forma de pago">${PAGOS.map(x=>`<button data-act="pago" data-v="${x.id}" class="${x.id===S.pago?'on':''}" aria-pressed="${x.id===S.pago}">${esc(x.nombre)}</button>`).join('')}</div>
    <a class="btn prim xl" id="wa-empezar" href="${esc(waLink(textoEmpezar(d)))}" target="_blank" rel="noopener">${ico.wa}<span>Quiero empezar</span></a>
    <a class="btn sec xl" href="${esc(waLink(duda))}" target="_blank" rel="noopener">Tengo una duda</a>
    <div class="firma pie-firma"><img src="/media/fotos/paloma-recurso.jpg" alt="" width="48" height="48" loading="lazy"><p>Un abrazo,<b>Paloma</b></p></div>
  </section>`;
}

/* ───────────── render ───────────── */
const app=$('#app');
function render(){
  const d=datos();
  app.innerHTML=hero(d)+esperar(d)+camino(d)+filosofia(d)+meses(d)+familias()+incluye(d)+inversion(d)+dudas(d)+cierre(d);
  observar();montarTermo();
}
function montarTermo(){const h=$('#termo-host');if(!h)return;if(window.TermoAPI)TermoAPI.montar(h);else window.__termoPend=h;}
let rafC=0;
function cuenta(desde,hasta,ms){
  const el=$('#contador');if(!el)return;
  cancelAnimationFrame(rafC);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=num(hasta);return;}
  const t0=performance.now();
  const paso=t=>{const k=Math.min(1,(t-t0)/ms);const e=1-Math.pow(1-k,3);el.textContent=num(desde+(hasta-desde)*e);if(k<1)rafC=requestAnimationFrame(paso);};
  rafC=requestAnimationFrame(paso);
}
function pintaPago(){
  const d=datos();
  document.querySelectorAll('[data-act="pago"]').forEach(b=>{const on=b.dataset.v===S.pago;b.classList.toggle('on',on);b.setAttribute(b.getAttribute('role')==='radio'?'aria-checked':'aria-pressed',on);});
  $('#wa-empezar').href=waLink(textoEmpezar(d));
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
  }else if(act==='filo'){
    if(S.filo===v)return;S.filo=v;
    const w=$('#filo');w.classList.toggle('es-hab',v==='hab');w.classList.toggle('es-syn',v==='syn');
    b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    if(window.TermoAPI)TermoAPI.modo(v);
  }else if(act==='termo'){if(window.TermoAPI)TermoAPI.accion(+v);}
  else if(act==='ajustar'){if(window.TermoAPI)TermoAPI.ajustar();}
  else if(act==='num'){
    S[b.dataset.q]=+v;
    b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});
    $('#res').innerHTML=resEscala(d);$('#grafica').innerHTML=grafica();
  }else if(act==='ses'){S.ses=+v;$('#grafica').innerHTML=grafica();$('#ciclo').innerHTML=ciclo();}
  else if(act==='pago'){S.pago=v;pintaPago();}
});

/* el contador arranca al llegar; la barra de abajo aparece entre la portada y el cierre */
let vistoContador=false;
function observar(){
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(x=>{
      if(x.target.id==='contador'&&x.isIntersecting&&!vistoContador){vistoContador=true;cuenta(0,totalVeces(datos()),1400);}
    }),{threshold:.35});
    io.observe($('#contador'));
  }else{const c=$('#contador');if(c)c.textContent=num(totalVeces(datos()));}
  const barra=$('#barra'),fin=$('#empezar'),hero=document.querySelector('.hero');
  addEventListener('scroll',()=>{const r1=hero.getBoundingClientRect(),r2=fin.getBoundingClientRect();barra.hidden=!(r1.bottom<0&&r2.top>innerHeight);},{passive:true});
}

document.title=C.hijo?`Lo que hablamos de ${C.hijo} · Método Synesis`:document.title;
render();
})();
