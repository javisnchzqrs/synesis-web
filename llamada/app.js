(()=>{
'use strict';
/* ───────────── programa ───────────── */
const PROGRAMA={
  familias:'+150',
  semanas:12,
  nombre:'3 meses de acompañamiento 1:1 con Paloma',
  precio:497,
  /* [nombre, detalle, valor en €] */
  incluye:[
    ['Diagnóstico inicial','Un cuestionario por adulto + la 1.ª sesión'],
    ['6 sesiones 1 a 1 con Paloma','3 el primer mes, 2 el segundo y 1 el tercero. Con la pareja, si quiere.',414],
    ['Un plan después de cada sesión','Para saber qué hacer hasta la siguiente'],
    ['Tu área personal','Con tu evolución, paso a paso']],
  bonos:[
    {ico:'chat',n:'Seguimiento por WhatsApp',d:'Audio y texto. Respuesta en 24 h laborables.',badge:'3 meses + mes 4',valor:120},
    {ico:'play',n:'Formación en vídeo',d:'Para entender qué pasa en cada situación.',badge:'15 meses',valor:197},
    {ico:'mano',n:'6 recursos interactivos',lista:['Semáforo emocional','Un momento para ti','Plan de regulación','Viaje a tu infancia','La carta que nadie te escribió','El reloj del niño'],valor:90}],
  pagos:[
    {id:'unico',nombre:'Pago único',precio:'497',det:'De una vez'},
    {id:'klarna',nombre:'3 plazos sin intereses',precio:'3 × 165,67',det:'Con Klarna'}],
  /* testimonios en vídeo: para activar el de Alba, pega su URL en src */
  videos:[
    {n:'Paula',h:'niño de 4 años',src:'/media/videos/testimonio-paula.mp4'},
    {n:'Alba',h:'niño de 3 años',src:'/media/videos/testimonio-alba.mp4'}
  ],
  /* semanas con sesión (3 el 1.er mes, 2 el 2.º, 1 el 3.º): confirmar con Paloma */
  sesionesEn:[1,2,4,6,8,11],
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
const S={semana:1,hoy:null,meta:null,veces:1,unidad:'dia',modo:'nada',hito:0,precio:false,pago:'unico',cierre:'q',duda:'',filo:'hab',capa:1,ses:1};

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

/* veces que pasará de aquí al horizonte, según lo diga al día o a la semana */
const totalVeces=d=>Math.round(S.veces*(S.unidad==='semana'?d.horizonte/7:d.horizonte));

/* datos derivados del caso */
function datos(){
  const edad=Math.min(12,Math.max(1,+C.edad||3));
  const ella=C.rol!=='padre', nina=C.nino==='a', amb=C.rol==='ambos';
  const pago=PROGRAMA.pagos.find(x=>x.id===S.pago)||PROGRAMA.pagos[0];
  const horizonte=edad<6?(6-edad)*365:3*365;
  return {edad,ella,nina,amb,pago,horizonte,v:(sg,pl)=>amb?pl:sg,
    h:esc(C.hijo),p:esc(C.padre),
    g:(m,f)=>nina?f:m, gp:(m,f)=>amb?m.replace(/o$/,'os'):(ella?f:m),
    aprende:REACCIONES[C.reaccion]||'que cuando se desborda, nadie sabe qué hacer',
    hitos:[6,9,12,15,18].filter(a=>a>edad)};
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
  const colores=Array.from({length:11},(_,i)=>mezcla('#C4785D','#8FAF9A',i/10));
  const nums=q=>`<div class="nums" role="group">${colores.map((c,i)=>`<button style="--c:${c}" data-act="num" data-q="${q}" data-v="${i}" class="${S[q]===i?'on':''}">${i}</button>`).join('')}</div>`;
  if(!S.hito||!d.hitos.includes(S.hito))S.hito=d.hitos[0];

  return [
  {t:'Apertura',html:`<div class="wrap apertura">
      <div class="rev"><div class="portrait"><img src="/media/fotos/paloma-recurso.jpg" alt="Paloma Robles"></div>
      <p class="firma"><b>Paloma Robles</b>Educadora infantil y guía familiar</p></div>
      <div><p class="hola rev" style="--r:.15s">Hola, ${p}.</p>
      <h1 class="h1 rev" style="--r:.3s">Hoy decidimos qué pasa con <em>${h}</em>.</h1></div></div>`,
   n:{dice:`Hola ${C.padre}. Esta llamada es para que salgas sabiendo exactamente qué hacer con ${C.hijo}. Antes de nada, cuéntame: ¿cómo ha ido esta semana?`,
      l:['Deja que hable. Apunta sus palabras exactas: las vas a usar al final.','No expliques el método todavía.','Si es escueta: «¿Y cómo te está afectando a ti, más allá de lo que hace?»']}},

  {t:'Control',html:`<div class="wrap centro">
      <p class="eyebrow rev">Del 0 al 10</p>
      <p class="pregunta rev" style="--r:.1s">En los momentos difíciles con ${h}, ¿cuánto control ${d.v('sientes','sentís')} sobre cómo ${d.v('reaccionas tú','reaccionáis vosotros')}?</p>
      <div class="rev" style="--r:.2s;width:100%;display:flex;flex-direction:column;align-items:center">${nums('hoy')}<div class="extremos"><span>0 · Exploto, no me reconozco</span><span>10 · Reacciono como quiero</span></div></div>
      <div class="bloque2 ${S.hoy!==null?'':'off'}" id="b2"><p class="pregunta">¿Y dónde ${d.v('quieres','queréis')} estar dentro de 3 meses?</p>${nums('meta')}</div>
      <div class="res" id="res">${resEscala(d)}</div></div>`,
   n:{dice:`En los momentos difíciles con ${C.hijo}, del 0 al 10, ¿cuánto control sientes sobre cómo reaccionas tú? 0 es «exploto, no me reconozco» y 10 «reacciono como quiero». … ¿Y dónde te gustaría estar dentro de 3 meses?`,
      l:['Pulsa tú el número que te diga.','Si dice más de 5: «¿Y en el peor momento de esta semana?». Usa ese número.','Repite la distancia en voz alta: «De 3 a 8. Ese es el camino.»','Si vienen los dos: que diga cada uno su número. Pulsa el más bajo.']}},

  {t:'Lo que cuesta esperar',html:`<div class="wrap centro">
      <p class="eyebrow rev">Lo que cuesta esperar</p>
      <div class="veces rev" style="--r:.1s"><span>¿Cuántas veces pasa?</span>
        <span class="stepper"><button data-act="veces" data-v="-1" aria-label="Menos">−</button><output id="veces">${S.veces}</output><button data-act="veces" data-v="1" aria-label="Más">+</button></span>
        <span class="unidad" role="group" aria-label="Cada cuánto">${[['dia','al día'],['semana','a la semana']].map(([k,t])=>`<button data-act="unidad" data-v="${k}" class="${S.unidad===k?'on':''}">${t}</button>`).join('')}</span></div>
      <div class="contador" id="contador" aria-live="polite">${num(totalVeces(d))}</div>
      <p class="contador-l rev" style="--r:.5s">veces más ${d.edad<6?`hasta que ${h} cumpla 6 años`:'en los próximos 3 años'}.</p>
      <p class="ensena rev" style="--r:.8s">Y cada una le enseña ${esc(d.aprende)}.</p>
      <p class="tu rev" style="--r:1s">${d.v('Y tú te quedas','Y vosotros os quedáis')} con <b>${esc(low(C.siente))}</b>.</p></div>`,
   n:{dice:`¿Cuántas veces pasa algo así, al día o a la semana? … Si nada cambia, de aquí a que cumpla 6 son todas estas veces más. Y cada una le enseña algo.`,
      l:['Ajusta el número con + y − según lo que diga. Si te lo dice por semanas («unas 3 veces a la semana»), pulsa «a la semana».','Después, calla 3 segundos. Deja que lo mire.','Si dice «es una fase»: pasa a la siguiente, está hecha para eso.']}},

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

  {t:'La filosofía',html:filosofiaHTML(d),
   n:{dice:`Lo que hace ${C.hijo} es como un termómetro: te dice la temperatura que hay en casa.`,
      l:['«Cuando sube, lo normal es intentar bajar el número.»',
         '[Premios] «Un premio es como ponerle hielo. Baja… un rato.»',
         '[Castigos] «Un castigo es sujetarlo a la fuerza. Mientras aprietas, se queda. En cuanto sueltas, sube. A veces, más.»',
         '[Trucos] «Y los trucos lo tapan para no verlo. Pero sigue ahí.»',
         '«Cambias el número. No la temperatura. ¿Te suena?» → y CALLA.',
         '[Con Synesis] «Nosotros no tocamos el termómetro. Ajustamos el termostato. Y el termostato eres tú.»',
         '«Ojo: no es que tú lo provoques. Es que en ti está la palanca.» (dilo siempre)',
         '[Ajustar] «Cuando cambias cómo reaccionas, cambia la temperatura de casa. Y '+C.hijo+' baja solo. Y se queda.»',
         'Las capas: «Primero tú. Luego entendemos a '+C.hijo+'. Luego la relación. Y el día a día cambia como consecuencia.»',
         'Puente: «Por eso lo que vamos a medir no es a '+C.hijo+'. Es tu termostato: ese '+(S.hoy??'número')+' que me has dicho.»']}},

  {t:'Los 3 meses',html:mesesHTML(d),
   n:{dice:`Estos son los 3 meses. Medimos una sola cosa: tu termostato, tu control en los momentos difíciles. Hoy estás en un ${S.hoy??'[su número]'} y quieres llegar a un ${S.meta??'[su objetivo]'}. Empezamos con una evaluación, buscamos tus oportunidades y sacamos tareas. Después de cada sesión, un plan hasta la siguiente. Y antes de cada una, medimos cómo vas.`,
      l:['Pulsa las sesiones una a una: abajo cambia el ciclo.','3 sesiones el primer mes, cuando más se mueve. Luego más espacio para aplicarlo.','La línea es el objetivo, no una promesa: «Esto es lo que vamos a medir '+(d.amb?'juntos':d.gp('juntos','juntas'))+'.»']}},

  {t:'Los bonos',html:bonosHTML(d),
   n:{dice:`Y si empiezas hoy, todo esto va incluido. [Nombra cada uno, sin correr]`,
      l:['El WhatsApp pesa mucho: sigue un mes más cuando acaban las sesiones.','Deja que lea los precios tachados.','No digas el precio todavía: va en la siguiente.']}},

  {t:'La inversión',html:`<div class="wrap centro inv">
      <p class="eyebrow rev">La inversión</p>
      <h2 class="h2 rev" style="--r:.1s">${PROGRAMA.nombre}</h2>
      <div class="inv-bajo">${S.precio?invRes(d):`<button class="btn prim xl rev" style="--r:.4s" data-act="precio">Ver la inversión</button>`}</div></div>`,
   n:{dice:`Todo esto tiene un valor de ${valorTotal()} €. La inversión es de ${PROGRAMA.precio} €. Si lo prefieres, en 3 plazos sin intereses con Klarna: 3 de 165,67 €.`,
      l:['Pulsa «Ver la inversión» tú, sin esperar a que pregunte.','Di el precio con seguridad. Luego CALLA.','Si hay silencio: «¿Ves sentido en empezar ahora?»','Pincha la forma de pago que elija: queda en el cierre.','Si Klarna rechaza: 3 pagos de 175 € directamente con nosotros.','Sesión extra fuera del programa: 69 €, siempre.','La garantía no se dice aquí. Solo si duda (mira las notas del cierre).']}},

  {t:'Cierre',html:cierreHTML(d,inicio),
   n:{dice:`${C.padre}, ${S.hoy!==null&&S.meta!==null?`de ${S.hoy} a ${S.meta}. `:''}¿Empezamos hoy?`,
      l:['Pregunta y CALLA. El primero que habla pierde.','Si dice que sí: pulsa «Sí, empezamos» y manda el enlace de pago en ese momento.','Si duda: pulsa «Tengo una duda» y la opción que diga. Lee la frase y pregunta «¿Qué más te frena?».','Pareja: «¿Quedamos mañana a las [hora] cinco minutos con él/ella?» Nunca un «ya me dices» sin fecha.','Si no cierra: «Te mando un resumen por WhatsApp. ¿Te parece?»','Variante: «¿Ajustamos el termostato? ¿Empezamos hoy?»','Garantía: solo si duda y solo de palabra. «Si tras la primera sesión ves que no es para ti, te devolvemos todo menos esa sesión.»']}}
  ];
}

function resEscala(d){
  if(S.hoy===null)return '';
  if(S.meta===null)return `<strong><span class="a">${S.hoy}</span></strong><small>Ahora, ¿dónde ${d.v('quieres','queréis')} estar?</small>`;
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
  const w=S.semana,ses=PROGRAMA.sesionesEn.includes(w);
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
const R_FILO=[92,152,212,272];
function filosofiaHTML(d){
  const hab=S.filo==='hab',h=d.h;
  const capas=[[d.v('Tú','Vosotros'),'Qué hacer en el momento'],[C.hijo,'Qué hay detrás'],['La relación','Volver a conectar'],['El día a día',C.situacion]];
  return `<div class="wrap filo ${hab?'es-hab':'es-syn'}" id="filo">
    <div class="filo-txt"><p class="eyebrow rev">La filosofía</p>
      <h2 class="h2 rev solo-hab" style="--r:.1s">Lo habitual: <span class="alarma">bajar el número.</span></h2>
      <h2 class="h2 rev solo-syn" style="--r:.1s">El termostato <em>${d.v('eres tú','sois vosotros')}.</em></h2>
      <div class="seg filo-seg rev" style="--r:.2s" role="group"><button data-act="filo" data-v="hab" class="${hab?'on':''}">Lo habitual</button><button data-act="filo" data-v="syn" class="${hab?'':'on'}">Con Synesis</button></div>
      <div class="solo-hab intentos rev" style="--r:.3s">${['Premios','Castigos','Trucos'].map((t,i)=>`<button class="intento" data-act="termo" data-v="${i}"><span class="cn">${i+1}</span>${t}</button>`).join('')}</div>
      <div class="solo-syn rev" style="--r:.3s"><button class="btn prim" data-act="ajustar">Ajustar el termostato</button>
        <ol class="capas-t">${capas.map((x,i)=>`<li data-capa="${i+1}"><span class="cn">${i+1}</span><span><b>${esc(x[0])}</b><small>${esc(x[1])}</small></span></li>`).join('')}</ol></div></div>
    <div class="termo-host rev" style="--r:.15s" id="termo-host" data-nombre="${h}" data-modo="${hab?'hab':'syn'}"></div></div>`;
}
const SESIONES=[{w:1,m:1},{w:2,m:1},{w:4,m:1},{w:6,m:2},{w:8,m:2},{w:11,m:3}];
function cicloDe(n){
  if(n===1)return [['Antes','Evaluación inicial','Un cuestionario por adulto. Tu punto de partida.'],['Sesión 1','Tus oportunidades','Vemos dónde está la palanca.'],['Después','Tu plan','Tus primeras tareas, hasta la sesión 2.']];
  if(n===6)return [['Antes','Medimos','Cómo ha ido desde la sesión 5.'],['Sesión 6','Dónde estás','Comparamos con el punto de partida.'],['Después','Tu plan','Para seguir por tu cuenta.']];
  return [['Antes','Medimos','Cómo ha ido desde la sesión '+(n-1)+'.'],['Sesión '+n,'Enfocamos','Lo que más mueve tu número.'],['Después','Tu plan','Tareas hasta la sesión '+(n+1)+'.']];
}
function mesesHTML(d){
  const hay=S.hoy!==null&&S.meta!==null;
  const a=S.hoy??3,b=Math.max(S.meta??8,a);
  const W=1000,H=270,L=34,Rr=16,T=22,B=46;
  const x=w=>L+w/12*(W-L-Rr),y=v=>T+(1-v/10)*(H-T-B);
  const f=w=>a+(b-a)*(1-Math.pow(1-w/12,1.6));
  let dpath='';for(let w=0;w<=12.001;w+=.25)dpath+=(w?'L':'M')+x(w).toFixed(1)+' '+y(f(w)).toFixed(1);
  const area=dpath+`L${x(12)} ${y(0)}L${x(0)} ${y(0)}Z`;
  const meses=[0,1,2].map(m=>`<rect class="mes ${m%2?'b':''}" x="${x(m*4)}" y="${T-10}" width="${x(4)-x(0)}" height="${H-B-T+10}"/><text class="mes-t" x="${x(m*4+2)}" y="${H-16}">Mes ${m+1} · ${3-m} ${m===2?'sesión':'sesiones'}</text>`).join('');
  const grid=[0,5,10].map(v=>`<line class="rej" x1="${x(0)}" x2="${x(12)}" y1="${y(v)}" y2="${y(v)}"/><text class="rej-t" x="${L-10}" y="${y(v)+4}">${v}</text>`).join('');
  const nodos=SESIONES.map((s,i)=>{const w=s.w-.5,cx=x(w),cy=y(f(w));return `<g class="nodo ${S.ses===i+1?'on':''}" data-act="ses" data-v="${i+1}" style="--d:${.6+i*.12}s"><circle cx="${cx}" cy="${cy}" r="17"/><text x="${cx}" y="${cy+5}">${i+1}</text></g>`;}).join('');
  const ciclo=cicloDe(S.ses);
  return `<div class="wrap meses">
    <div class="meses-h"><div><p class="eyebrow rev">Los 3 meses</p>
      <h2 class="h2 rev" style="--r:.1s">Un objetivo. <em>Medido sesión a sesión.</em></h2></div>
      <div class="kpi rev" style="--r:.2s"><small>Lo que medimos · ${d.v('tu','vuestro')} termostato</small><b>Tu control en los momentos difíciles</b>${hay?`<span class="kpi-n"><i class="a">${a}</i>${ico.flecha}<i class="b">${b}</i></span>`:''}</div></div>
    <div class="grafica rev" style="--r:.25s"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FAF9A" stop-opacity=".35"/><stop offset="1" stop-color="#8FAF9A" stop-opacity="0"/></linearGradient></defs>
      ${meses}${grid}
      <line class="meta-l" x1="${x(0)}" x2="${x(12)}" y1="${y(b)}" y2="${y(b)}"/><text class="meta-t" x="${x(12)-6}" y="${y(b)-10}">Objetivo${hay?' · '+b:''}</text>
      <path class="area" d="${area}"/><path class="linea" d="${dpath}" pathLength="1"/>
      <circle class="ini" cx="${x(0)}" cy="${y(a)}" r="7"/><text class="ini-t" x="${x(0)+14}" y="${y(a)+22}">Hoy${hay?' · '+a:''}</text>
      ${nodos}</svg></div>
    <div class="ciclo" aria-live="polite">${ciclo.map((c,i)=>`<div class="paso-c ${i===1?'mid':''}"><small>${c[0]}</small><b>${c[1]}</b><span>${c[2]}</span></div>${i<2?`<span class="ciclo-f">${ico.flecha}</span>`:''}`).join('')}</div></div>`;
}
const BICO={
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/></svg>',
  mano:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18.4 5.6l-2.1 2.1M21 12h-3"/><circle cx="12" cy="14" r="5"/><path d="m10 14 1.5 1.5L14 13"/></svg>',
  cole:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 12 5l9 5-9 5z"/><path d="M7 12v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"/></svg>'};
function bonosHTML(d){
  const vb=PROGRAMA.bonos.reduce((a,x)=>a+x.valor,0);
  return `<div class="wrap bonos-w">
    <div class="bonos-h"><p class="eyebrow rev">Si ${d.v('empiezas','empezáis')} hoy</p>
      <h2 class="h2 rev" style="--r:.1s">Además, ${d.v('te llevas','os lleváis')} <em>todo esto.</em></h2></div>
    <div class="bgrid">${PROGRAMA.bonos.map((x,i)=>`<article class="bcard rev" style="--r:${.2+i*.1}s">
      <div class="bcard-top"><span class="bico">${BICO[x.ico]}</span>${x.badge?`<span class="bbadge">${esc(x.badge)}</span>`:''}</div>
      <h3>${esc(x.n)}</h3>
      ${x.lista?`<ul class="blista">${x.lista.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:`<p>${esc(x.d)}</p>`}
      <div class="bprecio"><s>${x.valor} €</s><b>Gratis</b></div></article>`).join('')}</div>
    <div class="btotal rev" style="--r:.65s"><span>Valor de los bonos</span><s>${vb} €</s><b>Gratis</b></div></div>`;
}
const valorTotal=()=>PROGRAMA.incluye.reduce((a,x)=>a+(x[2]||0),0)+PROGRAMA.bonos.reduce((a,x)=>a+x.valor,0);
function invRes(d){
  return `<div class="inv-res2 aparece">
    <div class="precio"><s>${num(valorTotal())} €</s><strong>${PROGRAMA.precio}<i>€</i></strong></div>
    <div class="planes pagos">${PROGRAMA.pagos.map(x=>`<button class="plan ${x.id===S.pago?'on':''}" data-act="pago" data-v="${x.id}"><small>${x.nombre}</small><b>${x.precio}<i>€</i></b><span>${x.det}</span></button>`).join('')}</div>
    <p class="plazas">Plazas limitadas: las sesiones las hace Paloma personalmente.</p></div>`;
}
function cierreHTML(d,inicio){
  const dia=inicio.getDate(),{h,p}=d;
  const deseo=C.deseo?`<p class="deseo-l rev">${d.v('Lo que me dijiste','Lo que me contasteis')}</p><div class="burbuja rev" style="--r:.1s"><p>${esc(C.deseo)}</p><span class="burbuja-meta" aria-hidden="true">✓✓</span></div>`:'';
  if(S.cierre==='si'){
    const chips=[(S.hoy!==null&&S.meta!==null)?`Objetivo: de ${S.hoy} a ${S.meta}`:'','3 meses con Paloma',d.pago.nombre].filter(Boolean);
    return `<div class="wrap centro aparece"><p class="eyebrow">Hecho</p>
      <h2 class="h2">${d.gp('Bienvenido','Bienvenida')}, ${p}. <em>Empezamos hoy.</em></h2>
      <ol class="pasos-si"><li><small>Ahora</small>${d.v('Te','Os')} llega el enlace de pago</li><li><small>Hoy</small>${d.v('Rellenas tu','Rellenáis cada uno vuestro')} cuestionario de diagnóstico</li><li><small>Esta semana</small>${d.v('Tu','Vuestra')} primera sesión con Paloma</li></ol>
      <div class="resumen">${chips.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>`;
  }
  if(S.cierre==='duda'){
    const D=[['dinero','El dinero'],['pareja','Hablarlo con mi pareja'],['tiempo','El tiempo'],['funciona',`Si funcionará con ${C.hijo}`]].filter(x=>!(d.amb?x[0]==='pareja':false));
    const R={dinero:`Se puede pagar en 3 plazos sin intereses: 3 de 165,67 €. Y empezamos igual hoy.`,
      pareja:'Perfecto, esto se decide en equipo. Además, puede venir a las sesiones. ¿Qué crees que te va a preguntar? Lo resolvemos ahora.',
      tiempo:'Son unos 20 minutos a la semana. Menos de lo que os quita una tarde mala.',
      funciona:`Por eso trabajamos el caso de ${C.hijo}, no uno genérico. En sesiones 1 a 1 con Paloma.`};
    return `<div class="wrap centro aparece"><p class="eyebrow">Es normal dudar</p><h2 class="h2">¿Qué ${d.v('te','os')} frena?</h2>
      <div class="dudas">${D.map(([k,t])=>`<button data-act="duda" data-v="${k}" class="${S.duda===k?'on':''}">${esc(t)}</button>`).join('')}</div>
      <div class="respuesta">${S.duda?`<p class="aparece">${esc(R[S.duda])}</p>`:''}<button class="link" data-act="volver">Volver a la pregunta</button></div></div>`;
  }
  return `<div class="wrap centro">${deseo}
      ${(S.hoy!==null&&S.meta!==null)?`<p class="kpi-cierre rev" style="--r:.25s">${d.v('Tu','Vuestro')} objetivo <span><i class="a">${S.hoy}</i>${ico.flecha}<i class="b">${S.meta}</i></span></p>`:''}
      <h2 class="h2 cierre-q rev" style="--r:.35s">${p}, ¿empezamos hoy?</h2>
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
  if((P[i]||{}).t==='La filosofía'){const h=main.querySelector(`.slide[data-i="${i}"] #termo-host`);if(h){if(window.TermoAPI)TermoAPI.montar(h);else window.__termoPend=h;}}
  if(['Los 3 meses','Cierre'].includes((P[i]||{}).t)){P=paginas();const sec=main.querySelector(`.slide[data-i="${i}"]`);if(sec)sec.innerHTML=P[i].html;notas();}
  autoVid();
  if((P[i]||{}).t==='Lo que cuesta esperar'){const d=datos();cuenta(0,totalVeces(d),1400,350);}
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
    const antes=totalVeces(d);S.veces=Math.min(20,Math.max(1,S.veces+(+v)));
    $('#veces').textContent=S.veces;cuenta(antes,totalVeces(d),700);
  }
  else if(act==='unidad'){
    const antes=totalVeces(d);S.unidad=v;
    b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    cuenta(antes,totalVeces(d),700);
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
  else if(act==='filo'){if(S.filo===v)return;S.filo=v;const w=$('#filo');w.classList.toggle('es-hab',v==='hab');w.classList.toggle('es-syn',v==='syn');b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));if(window.TermoAPI)TermoAPI.modo(v);}
  else if(act==='termo'){if(window.TermoAPI)TermoAPI.accion(+v);}
  else if(act==='ajustar'){if(window.TermoAPI)TermoAPI.ajustar();}
  else if(act==='ses'){S.ses=+v;pinta(cur);}
  else if(act==='precio'){S.precio=true;pinta(cur);}
  else if(act==='pago'){S.pago=v;pinta(cur);main.querySelector(`.slide[data-i="${cur}"] .inv-res2`)?.classList.remove('aparece');}
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
  Object.assign(S,{semana:1,hoy:null,meta:null,veces:1,unidad:'dia',modo:'nada',hito:0,precio:false,cierre:'q',duda:''});
  render();$('#editor').classList.remove('abierto');
};
$('#f-ejemplo').onclick=()=>{C={...EJEMPLO};try{localStorage.removeItem(CLAVE)}catch(err){}llenarForm();Object.assign(S,{hoy:null,meta:null,precio:false,cierre:'q',duda:''});render();};

render();
})();
