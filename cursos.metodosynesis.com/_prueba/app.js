/* Método Synesis · plataforma de talleres (internamente, minicursos) (cursos.metodosynesis.com)
   Login con email y contraseña (Supabase Auth, proyecto synesis-panel).
   Cada clienta solo ve sus cursos (RLS). Escribe solo por funciones: cursos_guardar_progreso,
   cursos_guardar_medicion y cursos_guardar_perfil. El alta la hace n8n al recibir el pago de Stripe. */
(function () {
  'use strict';
  var SB_URL = 'https://oggfczwarbznrtzloivk.supabase.co';
  var SB_KEY = 'sb_publishable_LSk6Pp0nj-xM-tZ-DJaJOw_GKGknq2p';
  var URL_ENLACE = 'https://n8n.metodosynesis.com/webhook/cursos-enlace';
  var URL_RESERVA = 'https://app.metodosynesis.com/reserva/';
  var FOTO = 'https://app.metodosynesis.com/media/fotos/paloma-recurso.jpg';
  var LOGO = 'https://app.metodosynesis.com/media/fotos/logo-principal.svg';
  var LEGAL = '<p class="legal"><a href="https://metodosynesis.com/politica-de-privacidad" target="_blank" rel="noopener">Privacidad</a><a href="https://metodosynesis.com/aviso-legal" target="_blank" rel="noopener">Aviso legal</a></p>';
  var DIAS_DESCUENTO = 30;
  var app = document.getElementById('app');
  var E = {}; // estado
  var pararVideo = null;

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pct(x) { return Math.round((x || 0) * 100); }
  function $(sel) { return app.querySelector(sel); }
  function fecha(d) { return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }); }
  function fechaCorta(d) { var x = new Date(d + 'T12:00:00'); return x.getDate() + '/' + (x.getMonth() + 1); }
  function lunes() { var d = new Date(); var dia = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dia); return d.toISOString().slice(0, 10); }
  function peque() { return (E.usuario && E.usuario.hijo) ? E.usuario.hijo.trim().split(/\s+/)[0] : 'tu peque'; }
  function Peque() { var p = peque(); return (E.usuario && E.usuario.hijo) ? p.charAt(0).toUpperCase() + p.slice(1) : p; }
  var CHECK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var FLECHA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  var ATRAS = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
  var ICO = {
    inicio: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
    videos: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="M10 9.2v5.6l4.6-2.8z" fill="currentColor"/></svg>',
    recurso: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    evolucion: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5.5-5.5 4 4L21 7"/><path d="M15 7h6v6"/></svg>'
  };
  var NOMBRE_RECURSO = { rabietas: 'Kit de rabietas', pega: 'Kit Pega y muerde' };
  var PLAY = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

  /* ---------- datos ---------- */
  var sb = null;
  var api = window.SYNESIS_MOCK || {
    iniciar: function (alCambiar) {
      sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' } });
      sb.auth.onAuthStateChange(function (ev, s) { alCambiar(ev, s); });
      return sb.auth.getSession().then(function (r) { return r.data.session; });
    },
    entrar: function (email, clave) { return sb.auth.signInWithPassword({ email: email, password: clave }).then(function (r) { if (r.error) throw r.error; }); },
    salir: function () { return sb.auth.signOut(); },
    nuevaClave: function (clave) { return sb.auth.updateUser({ password: clave }).then(function (r) { if (r.error) throw r.error; }); },
    pedirEnlace: function (email) {
      return fetch(URL_ENLACE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) });
    },
    cargar: function () {
      return Promise.all([
        sb.from('cursos_usuarios').select('user_id,email,nombre,hijo,edad_rango').maybeSingle(),
        sb.from('cursos').select('id,nombre,situacion,recurso_url,orden,cursos_videos(id,orden,titulo,descripcion,wistia_id,duracion_seg)').order('orden'),
        sb.from('cursos_accesos').select('curso_id,created_at'),
        sb.from('cursos_progreso').select('video_id,pct,bloques'),
        sb.from('cursos_mediciones').select('curso_id,semana,control,dias,nota,es_inicial,created_at').order('semana')
      ]).then(function (r) {
        r.forEach(function (x) { if (x.error) throw x.error; });
        return { usuario: r[0].data, cursos: r[1].data, accesos: r[2].data, progreso: r[3].data, mediciones: r[4].data };
      });
    },
    progreso: function (videoId, bloques, duracion) {
      return sb.rpc('cursos_guardar_progreso', { p_video_id: videoId, p_bloques: bloques, p_duracion: duracion }).then(function (r) { if (r.error) throw r.error; return r.data; });
    },
    medicion: function (cursoId, control, dias, nota, inicial) {
      return sb.rpc('cursos_guardar_medicion', { p_curso_id: cursoId, p_control: control, p_dias: dias, p_nota: nota || null, p_inicial: !!inicial }).then(function (r) { if (r.error) throw r.error; });
    },
    perfil: function (hijo) { return sb.rpc('cursos_guardar_perfil', { p_hijo: hijo, p_edad_rango: null }).then(function (r) { if (r.error) throw r.error; }); }
  };

  function guardarDatos(d) {
    E.usuario = d.usuario || {};
    E.cursos = (d.cursos || []).map(function (c) { c.videos = (c.cursos_videos || []).sort(function (a, b) { return a.orden - b.orden; }); return c; });
    E.accesos = {}; (d.accesos || []).forEach(function (a) { E.accesos[a.curso_id] = a.created_at; });
    E.progreso = {}; (d.progreso || []).forEach(function (p) { E.progreso[p.video_id] = { pct: Number(p.pct) || 0, bloques: p.bloques || [] }; });
    E.mediciones = d.mediciones || [];
  }
  function recargar() { return api.cargar().then(guardarDatos); }

  function curso(id) { return (E.cursos || []).filter(function (c) { return c.id === id; })[0]; }
  function pctVideo(v) { return (E.progreso[v.id] || {}).pct || 0; }
  function visto(v) { return pctVideo(v) >= 0.9; }
  function pctCurso(c) { if (!c.videos.length) return 0; return c.videos.reduce(function (s, v) { return s + Math.min(1, pctVideo(v) / 0.9); }, 0) / c.videos.length; }
  function siguiente(c) { for (var i = 0; i < c.videos.length; i++) if (!visto(c.videos[i])) return c.videos[i]; return null; }
  function medicionesDe(id) { return E.mediciones.filter(function (m) { return m.curso_id === id; }); }
  function inicial(id) { return medicionesDe(id).filter(function (m) { return m.es_inicial; })[0]; }
  function semanales(id) { return medicionesDe(id).filter(function (m) { return !m.es_inicial; }); }
  function pregunta(c) { return 'Cuando ' + esc(Peque()) + ' ' + esc(c.situacion) + ', ¿cuánto control sientes sobre cómo reaccionas tú?'; }

  /* ---------- piezas ---------- */
  function barra(atras) {
    return '<header class="barra">' + (atras ? '<a class="atras" href="' + atras + '">' + ATRAS + 'Volver</a>' : '<img class="logo" src="' + LOGO + '" alt="Método Synesis">') +
      '<button class="salir" data-salir>Salir</button></header>';
  }
  function navInf(c, activo) {
    return '<nav class="nav-inf" aria-label="Secciones del taller">' + [['inicio', 'Inicio', ''], ['videos', 'Vídeos', '/videos'], ['recurso', 'Recurso', '/recurso'], ['evolucion', 'Evolución', '/evolucion']].map(function (p) {
      return '<a href="#/curso/' + c.id + p[2] + '"' + (p[0] === activo ? ' aria-current="page"' : '') + '>' + ICO[p[0]] + '<span>' + p[1] + '</span></a>';
    }).join('') + '</nav>';
  }
  function nombreRecurso(c) { return NOMBRE_RECURSO[c.id] || 'Tu recurso'; }
  function anillo(x) {
    var r = 19, l = 2 * Math.PI * r, hecho = x >= 0.9;
    return '<span class="anillo' + (hecho ? ' hecho' : '') + '"><svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="' + r + '" fill="' + (hecho ? 'var(--salvia)' : 'none') + '" stroke="var(--linea)" stroke-width="4"/>' +
      (hecho ? '' : '<circle cx="23" cy="23" r="' + r + '" fill="none" stroke="var(--salvia)" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (l * Math.min(1, x / 0.9)) + ' ' + l + '"/>') +
      '</svg><span>' + (hecho ? CHECK : pct(x) + '%') + '</span></span>';
  }
  function cta(c) {
    var desde = E.accesos[c.id], hasta = desde ? new Date(new Date(desde).getTime() + DIAS_DESCUENTO * 864e5) : null;
    var url = URL_RESERVA + '?' + new URLSearchParams({ nombre: E.usuario.nombre || '', email: E.usuario.email || '', utm_source: 'minicurso', utm_campaign: c.id }).toString();
    return '<section class="cta"><div class="quien"><img src="' + FOTO + '" alt=""><span><b style="color:var(--beige)">Paloma Robles</b> · educadora infantil</span></div>' +
      '<h2>Tú eres la palanca. Paloma te ayuda a usarla.</h2>' +
      '<p>Ya tienes las claves. En el acompañamiento, Paloma está contigo 3 meses, paso a paso, con lo que vivís en casa.</p>' +
      (hasta && hasta > new Date() ? '<p class="regalo"><b>Si empiezas antes del ' + fecha(hasta) + '</b>, te descontamos los 37 € de este taller.</p>' : '') +
      '<a class="boton terra cta" href="' + esc(url) + '" target="_blank" rel="noopener" data-cta="' + esc(c.id) + '">Hablar con Paloma</a></section>';
  }

  /* ---------- pantallas de acceso ---------- */
  function vistaEntrar(msg) {
    app.innerHTML = '<main class="acceso"><img class="logo" src="' + LOGO + '" alt="Método Synesis">' +
      '<h1>Entra en tu taller</h1><p class="sub">Con el email con el que lo compraste.</p>' +
      '<form id="f"><label class="campo"><span>Email</span><input type="email" name="email" autocomplete="email" required></label>' +
      '<label class="campo"><span>Contraseña</span><input type="password" name="clave" autocomplete="current-password" required></label>' +
      '<div id="m">' + (msg || '') + '</div><button class="boton" type="submit">Entrar</button></form>' +
      '<p class="pie"><button class="enlace" data-ir="olvido">¿Primera vez o no recuerdas tu contraseña?</button></p>' + LEGAL + '</main>';
    $('#f').onsubmit = function (e) {
      e.preventDefault(); var b = this.querySelector('button'); b.disabled = true;
      api.entrar(this.email.value.trim(), this.clave.value).catch(function () {
        b.disabled = false; $('#m').innerHTML = '<p class="aviso error">El email o la contraseña no coinciden. Si es tu primera vez, pide tu enlace abajo.</p>';
      });
    };
  }
  function vistaOlvido() {
    app.innerHTML = '<main class="acceso"><img class="logo" src="' + LOGO + '" alt="Método Synesis">' +
      '<h1>Te enviamos un enlace</h1><p class="sub">Para crear tu contraseña o cambiarla. Usa el email con el que compraste.</p>' +
      '<form id="f"><label class="campo"><span>Email</span><input type="email" name="email" autocomplete="email" required></label>' +
      '<div id="m"></div><button class="boton" type="submit">Enviarme el enlace</button></form>' +
      '<p class="pie"><button class="enlace" data-ir="entrar">Ya tengo contraseña</button></p></main>';
    $('#f').onsubmit = function (e) {
      e.preventDefault(); var b = this.querySelector('button'); b.disabled = true;
      api.pedirEnlace(this.email.value.trim()).catch(function () {}).then(function () {
        $('#m').innerHTML = '<p class="aviso">Listo. Si ese email tiene un taller, te llega el enlace en un minuto. Mira también en promociones o spam.</p>';
      });
    };
  }
  function vistaNuevaClave() {
    app.innerHTML = '<main class="acceso"><img class="logo" src="' + LOGO + '" alt="Método Synesis">' +
      '<h1>Crea tu contraseña</h1><p class="sub">Mínimo 8 caracteres. Tu móvil la recordará.</p>' +
      '<form id="f"><label class="campo"><span>Contraseña nueva</span><input type="password" name="clave" minlength="8" autocomplete="new-password" required></label>' +
      '<div id="m"></div><button class="boton" type="submit">Guardar y entrar</button></form></main>';
    $('#f').onsubmit = function (e) {
      e.preventDefault(); var b = this.querySelector('button'); b.disabled = true;
      api.nuevaClave(this.clave.value).then(function () { E.recuperando = false; history.replaceState(null, '', '/'); arrancar(); })
        .catch(function () { b.disabled = false; $('#m').innerHTML = '<p class="aviso error">No se ha podido guardar. Pide un enlace nuevo y vuelve a probar.</p>'; });
    };
  }

  /* ---------- mis cursos ---------- */
  function vistaInicio() {
    var cs = E.cursos || [];
    if (cs.length === 1) { location.replace('#/curso/' + cs[0].id); return; }
    var nombre = (E.usuario.nombre || '').split(' ')[0];
    var h = barra() + '<main class="pagina"><h1 style="font-size:30px;letter-spacing:-.03em;line-height:1.1;margin-top:10px">Hola' + (nombre ? ', ' + esc(nombre) : '') + '</h1>';
    if (!cs.length) {
      h += '<p class="sub">Aún no tienes ningún taller con este email. Si acabas de pagar, espera un minuto y recarga.</p>';
    } else {
      h += '<p class="sub">Tus talleres</p><div class="mis">';
      cs.forEach(function (c) {
        var x = pctCurso(c);
        h += '<a class="portada" href="#/curso/' + c.id + '"><span class="eti">Taller</span><h1>' + esc(c.nombre) + '</h1>' +
          '<div class="total"><div class="fila"><span>Tu progreso</span><b>' + pct(x) + '%</b></div><div class="barra-pct"><i style="width:' + pct(x) + '%"></i></div></div></a>';
      });
      h += '</div>';
    }
    app.innerHTML = h + LEGAL + '</main>';
  }

  /* ---------- curso: inicio, vídeos, recurso y evolución ---------- */
  function vistaCurso(c) {
    var x = pctCurso(c), sig = siguiente(c), todos = !sig, vistos = c.videos.filter(visto).length;
    var sem = semanales(c.id), ult = sem[sem.length - 1], hechaSemana = ult && ult.semana === lunes();
    var h = barra((E.cursos.length > 1) ? '#/' : null) + '<main class="pagina con-nav">' +
      '<section class="portada compacta"><span class="eti">Taller</span><h1>' + esc(c.nombre) + '</h1>' +
      '<div class="total"><div class="fila"><span>Tu progreso</span><b>' + pct(x) + '%</b></div><div class="barra-pct"><i style="width:' + pct(x) + '%"></i></div></div>' +
      (todos ? '' : '<a class="boton" href="#/curso/' + c.id + '/video/' + sig.orden + '">' + PLAY + '<span>' + (x > 0 ? 'Seguir' : 'Empezar') + ': ' + esc(sig.titulo) + '</span></a>') +
      '</section><div class="accesos">' +
      acceso(c, 'videos', 'Vídeos', todos ? 'Los ' + c.videos.length + ' vistos. Puedes volver cuando quieras.' : vistos + ' de ' + c.videos.length + ' vistos') +
      acceso(c, 'recurso', nombreRecurso(c), c.recurso_url ? 'Para usarlo en el día a día' : 'Muy pronto aquí') +
      acceso(c, 'evolucion', 'Tu evolución', hechaSemana ? 'Esta semana: ' + ult.control + ' de 10' : 'Toca la de esta semana', !hechaSemana) +
      '</div>' + cta(c) + LEGAL + '</main>' + navInf(c, 'inicio');
    app.innerHTML = h;
  }
  function acceso(c, id, titulo, sub, aviso) {
    return '<a class="acceso-bloque" href="#/curso/' + c.id + '/' + id + '"><span class="ico">' + ICO[id] + '</span><span><b>' + esc(titulo) + '</b><small' + (aviso ? ' class="toca"' : '') + '>' + esc(sub) + '</small></span><span class="flecha">' + FLECHA + '</span></a>';
  }
  function vistaVideos(c) {
    var x = pctCurso(c), sig = siguiente(c);
    var l = '<ul class="videos">';
    c.videos.forEach(function (v) {
      var p = pctVideo(v);
      l += '<li><a href="#/curso/' + c.id + '/video/' + v.orden + '"' + (sig && sig.id === v.id ? ' class="siguiente"' : '') + '>' + anillo(p) +
        '<span><b>' + esc(v.titulo) + '</b><small>' + (visto(v) ? 'Visto' : p > 0 ? 'Visto el ' + pct(p) + '%' : (sig && sig.id === v.id ? 'Tu siguiente vídeo' : 'Sin empezar')) +
        (v.duracion_seg ? ' · ' + Math.round(v.duracion_seg / 60) + ' min' : '') + '</small></span><span class="flecha">' + FLECHA + '</span></a></li>';
    });
    app.innerHTML = barra() + '<main class="pagina con-nav"><h1 class="titulo">Vídeos</h1><p class="sub">' + c.videos.filter(visto).length + ' de ' + c.videos.length + ' vistos · ' + pct(x) + '% del taller</p>' +
      l + '</ul>' + LEGAL + '</main>' + navInf(c, 'videos');
  }
  function vistaRecurso(c) {
    if (!c.recurso_url) {
      app.innerHTML = barra() + '<main class="pagina con-nav"><section class="tarjeta"><h2>Tu recurso está en camino</h2><p class="sub">Paloma lo está terminando. En cuanto esté, aparece aquí.</p></section></main>' + navInf(c, 'recurso');
      return;
    }
    app.innerHTML = '<div class="pantalla-recurso"><header class="barra-fina"><a href="#/curso/' + c.id + '">' + ATRAS + 'Volver al taller</a><span>' + esc(nombreRecurso(c)) + '</span></header>' +
      '<iframe src="' + esc(c.recurso_url) + '" title="' + esc(nombreRecurso(c)) + '"></iframe></div>';
  }
  function vistaEvolucionPag(c) {
    app.innerHTML = barra() + '<main class="pagina con-nav">' + vistaEvolucion(c) + cta(c) + LEGAL + '</main>' + navInf(c, 'evolucion');
    activarMedicion(c, false);
  }

  /* ---------- evolución ---------- */
  function grafico(c) {
    var ini = inicial(c.id), sem = semanales(c.id);
    var pts = (ini ? [{ x: 'Inicio', y: ini.control, ini: true }] : []).concat(sem.map(function (m) { return { x: fechaCorta(m.semana), y: m.control }; }));
    if (!pts.length) return '';
    var W = 340, H = 190, iz = 26, de = 14, ar = 14, ab = 30, n = pts.length;
    var px = function (i) { return n === 1 ? (iz + (W - iz - de) / 2) : iz + i * (W - iz - de) / (n - 1); };
    var py = function (y) { return ar + (10 - y) * (H - ar - ab) / 10; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Evolución de tu control del 0 al 10">';
    [0, 5, 10].forEach(function (y) { s += '<line x1="' + iz + '" x2="' + (W - de) + '" y1="' + py(y) + '" y2="' + py(y) + '" stroke="var(--linea)"/><text x="' + (iz - 8) + '" y="' + (py(y) + 4) + '" font-size="11" text-anchor="end" fill="var(--suave)">' + y + '</text>'; });
    if (n > 1) s += '<polyline fill="none" stroke="var(--salvia)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" points="' + pts.map(function (p, i) { return px(i) + ',' + py(p.y); }).join(' ') + '"/>';
    var cada = Math.ceil(n / 7);
    pts.forEach(function (p, i) {
      s += '<circle cx="' + px(i) + '" cy="' + py(p.y) + '" r="5.5" fill="' + (p.ini ? 'var(--terra)' : 'var(--salvia)') + '" stroke="var(--tarjeta)" stroke-width="2"/>';
      if (i === n - 1 || p.ini) s += '<text x="' + px(i) + '" y="' + (py(p.y) - 11) + '" font-size="12" font-weight="700" text-anchor="middle" fill="var(--tinta)">' + p.y + '</text>';
      if (i % cada === 0 || i === n - 1) s += '<text x="' + px(i) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" fill="var(--suave)">' + esc(p.x) + '</text>';
    });
    return s + '</svg>';
  }
  function formMedicion(c, esInicial) {
    var escala = ''; for (var i = 0; i <= 10; i++) escala += '<button type="button" data-v="' + i + '" aria-pressed="false">' + i + '</button>';
    var dias = ''; for (var d = 0; d <= 7; d++) dias += '<button type="button" data-d="' + d + '" aria-pressed="false">' + d + '</button>';
    var sinNombre = esInicial && !(E.usuario && E.usuario.hijo);
    return '<form id="med">' +
      (sinNombre ? '<label class="campo"><span>¿Cómo se llama tu peque?</span><input name="hijo" autocomplete="off" maxlength="40" placeholder="Su nombre"></label>' : '') +
      '<div class="pregunta"><b id="txtPregunta">' + pregunta(c) + '</b><div class="escala" data-grupo="v">' + escala + '</div><div class="extremos"><span>0 · nada</span><span>10 · total</span></div></div>' +
      (esInicial ? '' : '<div class="pregunta"><b>¿Cuántos días ha pasado esta semana?</b><div class="dias" data-grupo="d">' + dias + '</div></div>' +
        '<label class="campo"><span>¿Algo que quieras apuntar? <small style="font-weight:400;color:var(--suave)">(opcional)</small></span><textarea name="nota" rows="2" maxlength="600"></textarea></label>') +
      '<div id="mm"></div><button class="boton" type="submit" disabled style="margin-top:20px">' + (esInicial ? 'Empezar el taller' : 'Guardar esta semana') + '</button></form>';
  }
  function vistaEvolucion(c) {
    var ini = inicial(c.id), sem = semanales(c.id), ult = sem[sem.length - 1];
    var hechaSemana = ult && ult.semana === lunes();
    var h = '<section class="tarjeta"><h2>Tu evolución</h2><p class="sub">Cada semana, una pregunta. 20 segundos.</p>';
    if (ini || sem.length) h += '<div class="grafico">' + grafico(c) + '</div>';
    if (ini && ult) {
      var dif = ult.control - ini.control;
      h += '<div class="resumen"><div><small>Al empezar</small><b>' + ini.control + '</b></div><div><small>Esta última semana</small><b>' + ult.control + (dif ? ' <small style="display:inline;font-size:14px;color:' + (dif > 0 ? 'var(--salvia-d)' : 'var(--terra)') + '">' + (dif > 0 ? '+' : '') + dif + '</small>' : '') + '</b></div></div>';
      if (dif > 0) h += '<p class="sub" style="margin-top:12px">Has subido ' + dif + (dif === 1 ? ' punto' : ' puntos') + ' desde que empezaste. Eso lo has hecho tú.</p>';
    }
    h += '</section><section class="tarjeta">';
    if (hechaSemana) h += '<div class="hecho-semana" style="margin-top:0">' + CHECK + '<span>Esta semana ya está. Te escribimos el domingo para la siguiente.</span></div><p class="pie" style="margin-top:12px"><button class="enlace" data-cambiar>Cambiar mi respuesta</button></p><div id="formSem" hidden>' + formMedicion(c, false) + '</div>';
    else h += '<h2>¿Cómo ha ido esta semana?</h2>' + formMedicion(c, false);
    return h + '</section>';
  }
  function activarMedicion(c, esInicial) {
    var f = $('#med'); if (!f) return;
    var cambiar = app.querySelector('[data-cambiar]');
    if (cambiar) cambiar.onclick = function () { $('#formSem').hidden = false; cambiar.parentNode.hidden = true; };
    var val = {};
    f.querySelectorAll('[data-grupo]').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        val[g.dataset.grupo] = Number(b.dataset.v != null ? b.dataset.v : b.dataset.d);
        f.querySelector('[type=submit]').disabled = !(val.v != null && (esInicial || val.d != null));
      });
    });
    if (f.hijo) f.hijo.addEventListener('input', function () {
      E.usuario.hijo = f.hijo.value.trim() || null; $('#txtPregunta').innerHTML = pregunta(c);
    });
    f.onsubmit = function (e) {
      e.preventDefault(); var b = f.querySelector('[type=submit]'); b.disabled = true;
      var antes = f.hijo && f.hijo.value.trim() ? api.perfil(f.hijo.value.trim()) : Promise.resolve();
      antes.then(function () { return api.medicion(c.id, val.v, esInicial ? null : val.d, f.nota ? f.nota.value.trim() : null, esInicial); })
        .then(recargar).then(function () {
          if (esInicial) location.replace('#/curso/' + c.id + '/video/1'); else pintar();
        }).catch(function () { b.disabled = false; $('#mm').innerHTML = '<p class="aviso error">No se ha podido guardar. Revisa tu conexión y vuelve a probar.</p>'; });
    };
  }
  function vistaEmpezar(c) {
    app.innerHTML = barra(E.cursos.length > 1 ? '#/' : null) + '<main class="pagina"><section class="portada"><span class="eti">Antes de empezar</span><h1>Tu punto de partida</h1>' +
      '<p>Una sola pregunta. Así, dentro de unas semanas, verás cuánto has avanzado.</p></section><section class="tarjeta bloque">' + formMedicion(c, true) + '</section>' + LEGAL + '</main>';
    activarMedicion(c, true);
  }

  /* ---------- vídeo ---------- */
  function vistaVideo(c, v) {
    var i = c.videos.indexOf(v), sigV = c.videos[i + 1], antV = c.videos[i - 1];
    app.innerHTML = barra('#/curso/' + c.id + '/videos') + '<main class="pagina con-nav">' +
      '<div class="marco">' + (v.wistia_id ? '<wistia-player media-id="' + esc(v.wistia_id) + '" aspect="1.7777777777777777"></wistia-player>'
        : '<div class="hueco">Vídeo en preparación.<br>Muy pronto lo tienes aquí.</div>') + '</div>' +
      '<div class="video-info"><span class="eti">' + esc(c.nombre) + ' · Vídeo ' + v.orden + ' de ' + c.videos.length + '</span><h1>' + esc(v.titulo) + '</h1>' +
      (v.descripcion ? '<p class="sub">' + esc(v.descripcion) + '</p>' : '') +
      '<div class="total claro"><div class="fila" style="color:var(--suave)"><span id="estado">' + (visto(v) ? 'Visto' : 'Visto el ' + pct(pctVideo(v)) + '%') + '</span><b id="pctV">' + pct(pctVideo(v)) + '%</b></div><div class="barra-pct"><i id="barV" style="width:' + pct(pctVideo(v)) + '%"></i></div></div></div>' +
      '<div class="navegar">' + (sigV ? '<a class="boton" href="#/curso/' + c.id + '/video/' + sigV.orden + '">Siguiente: ' + esc(sigV.titulo) + '</a>' : '<a class="boton" href="#/curso/' + c.id + '/evolucion">Ver tu evolución</a>') +
      '<a class="boton linea" href="#/curso/' + c.id + '/recurso">Abrir tu recurso</a>' +
      (antV ? '<a class="boton linea" href="#/curso/' + c.id + '/video/' + antV.orden + '">Anterior: ' + esc(antV.titulo) + '</a>' : '') + '</div>' +
      (!sigV ? cta(c) : '') + LEGAL + '</main>' + navInf(c, 'videos');
    if (v.wistia_id) {
      if (!document.querySelector('script[data-wistia="' + v.wistia_id + '"]')) {
        var s = document.createElement('script'); s.src = 'https://fast.wistia.com/embed/' + v.wistia_id + '.js'; s.type = 'module'; s.async = true; s.dataset.wistia = v.wistia_id; document.head.appendChild(s);
      }
      pararVideo = seguirVideo(v);
    }
  }
  // Marca tramos de 5 s reproducidos de verdad (los saltos no cuentan) y los envía cada 15 s y al salir.
  function seguirVideo(v) {
    var mios = {}, nuevos = {}, hayNuevos = false, tAnt = null, dur = v.duracion_seg || 0;
    ((E.progreso[v.id] || {}).bloques || []).forEach(function (b) { mios[b] = 1; });
    function enviar() {
      if (!hayNuevos || !dur) return;
      var lista = Object.keys(nuevos).map(Number); nuevos = {}; hayNuevos = false;
      api.progreso(v.id, lista, Math.round(dur)).then(function (p) {
        var prev = E.progreso[v.id] || { bloques: [] };
        E.progreso[v.id] = { pct: Number(p) || prev.pct || 0, bloques: Object.keys(mios).map(Number) };
        pintarPct();
      }).catch(function () { lista.forEach(function (b) { nuevos[b] = 1; }); hayNuevos = true; });
    }
    function pintarPct() {
      var p = dur ? Math.min(1, Object.keys(mios).length * 5 / dur) : pctVideo(v);
      var e = document.getElementById('pctV'); if (!e) return;
      e.textContent = pct(p) + '%'; document.getElementById('barV').style.width = pct(p) + '%';
      document.getElementById('estado').textContent = p >= 0.9 ? 'Visto' : 'Visto el ' + pct(p) + '%';
    }
    var t1 = setInterval(function () {
      var p = document.querySelector('wistia-player'); if (!p) return;
      var t = Number(p.currentTime) || 0, d = Number(p.duration) || 0;
      if (d > 0) dur = d;
      if (tAnt !== null) {
        var delta = t - tAnt;
        if (delta > 0 && delta <= 2.5) {
          var b = Math.floor(t / 5);
          if (!mios[b]) { mios[b] = 1; nuevos[b] = 1; hayNuevos = true; pintarPct(); }
        }
      }
      tAnt = t;
    }, 1000);
    var t2 = setInterval(enviar, 15000);
    var alSalir = function () { if (document.visibilityState === 'hidden') enviar(); };
    document.addEventListener('visibilitychange', alSalir);
    window.addEventListener('pagehide', enviar);
    return function () { enviar(); clearInterval(t1); clearInterval(t2); document.removeEventListener('visibilitychange', alSalir); window.removeEventListener('pagehide', enviar); };
  }

  /* ---------- router ---------- */
  function pintar() {
    if (pararVideo) { pararVideo(); pararVideo = null; }
    window.scrollTo(0, 0);
    var r = (location.hash || '#/').slice(2).split('/');
    document.body.classList.remove('modo-recurso');
    if (r[0] !== 'curso') return vistaInicio();
    var c = curso(r[1]);
    if (!c) { location.replace('#/'); return; }
    if (!inicial(c.id) && r[2] !== 'empezar') { location.replace('#/curso/' + c.id + '/empezar'); return; }
    if (r[2] === 'empezar') return inicial(c.id) ? location.replace('#/curso/' + c.id) : vistaEmpezar(c);
    if (r[2] === 'video') {
      var v = c.videos.filter(function (x) { return String(x.orden) === r[3]; })[0];
      return v ? vistaVideo(c, v) : location.replace('#/curso/' + c.id);
    }
    document.body.classList.toggle('modo-recurso', r[2] === 'recurso' && !!c.recurso_url);
    if (r[2] === 'videos') return vistaVideos(c);
    if (r[2] === 'recurso') return vistaRecurso(c);
    if (r[2] === 'evolucion') return vistaEvolucionPag(c);
    vistaCurso(c);
  }

  app.addEventListener('click', function (e) {
    var s = e.target.closest('[data-salir]'); if (s) { api.salir().then(function () { location.hash = ''; }); return; }
    var i = e.target.closest('[data-ir]'); if (i) { i.dataset.ir === 'olvido' ? vistaOlvido() : vistaEntrar(); }
  });

  var dentro = false;
  function arrancar() {
    if (E.recuperando) return vistaNuevaClave();
    recargar().then(function () { dentro = true; pintar(); })
      .catch(function () { app.innerHTML = '<main class="acceso"><h1>Algo no ha cargado</h1><p class="sub">Revisa tu conexión y recarga la página.</p><button class="boton" onclick="location.reload()">Recargar</button></main>'; });
  }
  window.addEventListener('hashchange', function () { if (dentro) pintar(); });

  function inicio() {
    E.recuperando = /type=(recovery|invite)/.test(location.hash);
    api.iniciar(function (ev, s) {
      if (ev === 'PASSWORD_RECOVERY') { E.recuperando = true; vistaNuevaClave(); }
      else if (ev === 'SIGNED_IN' && !dentro && !E.recuperando) arrancar();
      else if (ev === 'SIGNED_OUT') { dentro = false; E = {}; vistaEntrar(); }
    }).then(function (s) {
      if (E.recuperando && s) return vistaNuevaClave();
      if (s) arrancar(); else if (!E.recuperando) vistaEntrar();
    });
  }
  if (window.supabase || window.SYNESIS_MOCK) inicio(); else window.addEventListener('load', inicio);
})();
