/* Método Synesis · conteo propio de visitas
   Sin cookies ni identificadores: solo envía la página, los UTM del enlace y el navegador
   (para descartar bots; no se guarda). Por eso no necesita consentimiento.
   Uso: <script src="https://app.metodosynesis.com/comun/visita.js" defer></script> */
(function () {
  'use strict';
  var URL_RPC = 'https://oggfczwarbznrtzloivk.supabase.co/rest/v1/rpc/registrar_visita';
  var CLAVE = 'sb_publishable_LSk6Pp0nj-xM-tZ-DJaJOw_GKGknq2p';
  if (navigator.webdriver) return;

  var ruta = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  var pagina = location.hostname.indexOf('app.') === 0 ? ruta.replace(/[-/]/g, '_') : (ruta === '' ? 'home' : '');
  if (!pagina) return;

  var q = new URLSearchParams(location.search);
  var claves = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var utm = {};
  var guardadas = {};
  try { guardadas = JSON.parse(sessionStorage.getItem('synesis_utm') || '{}') || {}; } catch (e) { /* sin acceso: solo la URL */ }
  claves.forEach(function (k) { var v = q.get(k) || guardadas[k]; if (v) utm[k] = String(v).slice(0, 150); });

  var enviado = false;
  function enviar() {
    if (enviado || document.visibilityState !== 'visible') return;
    enviado = true;
    try {
      fetch(URL_RPC, {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: CLAVE },
        body: JSON.stringify({ p_pagina: pagina, p_utm: utm, p_ua: navigator.userAgent, p_angulo: q.get('angulo') || null })
      }).catch(function () { /* no es crítico */ });
    } catch (e) { /* no es crítico */ }
  }
  // Solo cuenta si la página llega a verse (no las precargas)
  if (document.visibilityState === 'visible') enviar();
  else document.addEventListener('visibilitychange', enviar);
})();
