/* Método Synesis · consentimiento de cookies (Consent Mode v2)
   Cargar en <head> ANTES del fragmento de GTM:
   <script src="https://app.metodosynesis.com/comun/consentimiento.js"></script>
   - Por defecto todo denegado; GTM decide qué etiqueta puede dispararse.
   - La elección se guarda 6 meses en una cookie de .metodosynesis.com (vale para todas las webs).
   - window.synesisCookies.abrir() vuelve a mostrar las opciones (enlace "Configurar cookies"). */
(function () {
  'use strict';
  var COOKIE = 'synesis_consent', VERSION = '1', DIAS = 182;
  var POLITICA = 'https://metodosynesis.com/politica-de-cookies/';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function leer() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
    if (!m) return null;
    var p = decodeURIComponent(m[1]).split('|');
    if (p[0] !== VERSION) return null;
    return { analitica: p[1] === '1', marketing: p[2] === '1' };
  }
  function guardar(e) {
    var v = encodeURIComponent([VERSION, e.analitica ? 1 : 0, e.marketing ? 1 : 0, Date.now()].join('|'));
    var dom = /(^|\.)metodosynesis\.com$/.test(location.hostname) ? '; domain=.metodosynesis.com' : '';
    document.cookie = COOKIE + '=' + v + '; max-age=' + (DIAS * 86400) + '; path=/; SameSite=Lax' + dom + (location.protocol === 'https:' ? '; Secure' : '');
  }
  function estadoGoogle(e) {
    return {
      analytics_storage: e.analitica ? 'granted' : 'denied',
      ad_storage: e.marketing ? 'granted' : 'denied',
      ad_user_data: e.marketing ? 'granted' : 'denied',
      ad_personalization: e.marketing ? 'granted' : 'denied'
    };
  }

  var actual = leer();
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500
  });
  if (actual) {
    gtag('consent', 'update', estadoGoogle(actual));
    window.dataLayer.push({ event: 'synesis_consentimiento', consent_analitica: actual.analitica, consent_marketing: actual.marketing });
  }

  function aplicar(e) {
    guardar(e);
    gtag('consent', 'update', estadoGoogle(e));
    window.dataLayer.push({ event: 'synesis_consentimiento', consent_analitica: e.analitica, consent_marketing: e.marketing });
    cerrar();
  }

  var raiz = null;
  var CSS = '' +
    '#syn-ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;display:flex;justify-content:center;font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:#3A3A3A}' +
    '#syn-ck .ck{background:#fff;border-radius:20px;box-shadow:0 18px 50px rgba(58,58,58,.22);padding:22px 24px;max-width:720px;width:100%;font-size:15px;line-height:1.5}' +
    '#syn-ck h2{font-size:17px;margin:0 0 6px;font-weight:700}' +
    '#syn-ck p{margin:0;color:#5f5a55}' +
    '#syn-ck a{color:#3A3A3A}' +
    '#syn-ck .bts{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}' +
    '#syn-ck button{font:inherit;font-weight:700;border-radius:999px;padding:11px 20px;cursor:pointer;border:1.5px solid #3A3A3A;background:#fff;color:#3A3A3A}' +
    '#syn-ck button.si{background:#3A3A3A;color:#fff}' +
    '#syn-ck button.link{border:0;padding:11px 6px;text-decoration:underline;font-weight:500;background:none}' +
    '#syn-ck .op{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:12px 0;border-top:1px solid #EFE7DB}' +
    '#syn-ck .op b{display:block;font-size:15px}' +
    '#syn-ck .op span{font-size:13.5px;color:#6b6660}' +
    '#syn-ck input{width:20px;height:20px;accent-color:#6d9278;flex:none;margin-top:3px}' +
    '#syn-ck .ops{margin-top:12px}' +
    '@media (max-width:560px){#syn-ck{left:10px;right:10px;bottom:10px}#syn-ck .ck{padding:18px}#syn-ck .bts button{flex:1 1 auto}}';

  function cerrar() { if (raiz) { raiz.remove(); raiz = null; } }

  function abrir(conOpciones) {
    cerrar();
    if (!document.getElementById('syn-ck-css')) {
      var st = document.createElement('style'); st.id = 'syn-ck-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var e = leer() || { analitica: false, marketing: false };
    raiz = document.createElement('div');
    raiz.id = 'syn-ck';
    raiz.setAttribute('role', 'dialog');
    raiz.setAttribute('aria-label', 'Preferencias de cookies');
    raiz.innerHTML = '<div class="ck">' +
      '<h2>Tu privacidad, primero</h2>' +
      '<p>Usamos cookies propias y de terceros para saber cómo se usa la web y medir nuestros anuncios. Solo las activamos si nos dejas. <a href="' + POLITICA + '">Más información</a></p>' +
      (conOpciones ?
        '<div class="ops">' +
        '<label class="op"><div><b>Necesarias</b><span>Hacen que la web funcione y recuerdan esta elección. Siempre activas.</span></div><input type="checkbox" checked disabled></label>' +
        '<label class="op"><div><b>Analítica</b><span>Google Analytics y Microsoft Clarity: cómo se navega por la web, de forma agregada.</span></div><input type="checkbox" id="ck-an"' + (e.analitica ? ' checked' : '') + '></label>' +
        '<label class="op"><div><b>Marketing</b><span>Meta (Facebook e Instagram): medir y mejorar nuestros anuncios.</span></div><input type="checkbox" id="ck-mk"' + (e.marketing ? ' checked' : '') + '></label>' +
        '</div>' +
        '<div class="bts"><button class="si" data-a="guardar">Guardar mi elección</button><button data-a="todo">Aceptar todas</button></div>'
        :
        '<div class="bts"><button class="si" data-a="todo">Aceptar</button><button data-a="nada">Rechazar</button><button class="link" data-a="config">Configurar</button></div>') +
      '</div>';
    raiz.addEventListener('click', function (ev) {
      var a = ev.target.getAttribute && ev.target.getAttribute('data-a');
      if (a === 'todo') aplicar({ analitica: true, marketing: true });
      else if (a === 'nada') aplicar({ analitica: false, marketing: false });
      else if (a === 'config') abrir(true);
      else if (a === 'guardar') aplicar({ analitica: document.getElementById('ck-an').checked, marketing: document.getElementById('ck-mk').checked });
    });
    document.body.appendChild(raiz);
  }

  window.synesisCookies = { abrir: function () { abrir(true); }, estado: leer };

  function iniciar() {
    if (!leer()) abrir(false);
    document.addEventListener('click', function (ev) {
      var t = ev.target.closest && ev.target.closest('[data-cookies]');
      if (t) { ev.preventDefault(); abrir(true); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
