/* Método Synesis · seguimiento de vídeos pre-llamada
   Sin cookies ni almacenamiento: solo funciona si el enlace lleva ?r=<id de la reserva> (uuid).
   Envía cuánto del vídeo se ha visto (segundos distintos vistos / duración) a registrar_video,
   que lo asocia a la reserva y a su lead. Sin ?r= válido no envía nada (visita.js sigue contando la apertura).
   Uso: <script src="/comun/video.js" defer data-media="<hashed_id>" data-pagina="v_adulto_1" data-duracion="573"></script> */
(function () {
  'use strict';
  var URL_RPC = 'https://oggfczwarbznrtzloivk.supabase.co/rest/v1/rpc/registrar_video';
  var CLAVE = 'sb_publishable_LSk6Pp0nj-xM-tZ-DJaJOw_GKGknq2p';
  if (navigator.webdriver) return;

  var s = document.currentScript;
  var media = s && s.getAttribute('data-media');
  var pagina = s && s.getAttribute('data-pagina');
  var duracion = Number(s && s.getAttribute('data-duracion')) || 0;
  var r = (new URLSearchParams(location.search).get('r') || '').toLowerCase();
  if (!media || !pagina || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(r)) return;

  var vistos = {}, n = 0, tAnterior = null, enviadoN = -1, nueva = true;

  function enviar() {
    if (document.visibilityState !== 'visible' && nueva) return; // las precargas no cuentan
    if (!nueva && n === enviadoN) return;
    var pct = duracion ? Math.min(1, n / Math.floor(duracion)) : 0;
    var cuerpo = { p_reserva: r, p_pagina: pagina, p_media: media, p_pct: Math.round(pct * 1000) / 1000, p_segundos: n, p_nueva: nueva };
    nueva = false;
    enviadoN = n;
    try {
      fetch(URL_RPC, {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: CLAVE },
        body: JSON.stringify(cuerpo)
      }).catch(function () { /* no es crítico */ });
    } catch (e) { /* no es crítico */ }
  }

  // Cada segundo mira por dónde va el vídeo y marca los segundos reproducidos.
  // Saltos grandes (adelantar o retroceder) no cuentan como vistos.
  setInterval(function () {
    var p = document.querySelector('wistia-player');
    if (!p) return;
    var t = Number(p.currentTime) || 0;
    var d = Number(p.duration) || 0;
    if (d > 0) duracion = d;
    if (tAnterior !== null) {
      var delta = t - tAnterior;
      if (delta > 0 && delta <= 2.5) {
        for (var sec = Math.floor(tAnterior); sec < Math.floor(t); sec++) {
          if (!vistos[sec]) { vistos[sec] = 1; n++; }
        }
      }
    }
    tAnterior = t;
  }, 1000);

  // Apertura (en cuanto la página se ve), progreso cada 20 s y al salir o bloquear el móvil
  if (document.visibilityState === 'visible') enviar();
  document.addEventListener('visibilitychange', function () { enviar(); });
  window.addEventListener('pagehide', enviar);
  setInterval(enviar, 20000);
})();
