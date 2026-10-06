# Genera las páginas legales de metodosynesis.com (python3 servidor/legales/generar.py)
import os
RAIZ = os.path.join(os.path.dirname(__file__), '..', '..', 'metodosynesis.com')
GTM = "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W8LQ6VT3');</script>"
ACT = '6 de octubre de 2026'

def pagina(slug, titulo, descripcion, cuerpo):
    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{titulo} · Método Synesis</title>
<meta name="description" content="{descripcion}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://metodosynesis.com/{slug}/">
<link rel="icon" href="https://app.metodosynesis.com/media/fotos/isotipo-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<script src="https://app.metodosynesis.com/comun/consentimiento.js"></script>
{GTM}
<style>
  :root {{ --beige: #F3EDE4; --antracita: #3A3A3A; --suave: #5f5a55; --linea: #E6DCCD; --salvia: #6d9278; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--beige); color: var(--antracita); font-family: 'DM Sans', system-ui, sans-serif; font-size: 17px; line-height: 1.65; }}
  header {{ padding: 22px 24px; border-bottom: 1px solid var(--linea); }}
  header a {{ display: inline-block; }}
  header img {{ height: 28px; width: auto; display: block; }}
  main {{ max-width: 760px; margin: 0 auto; padding: 56px 24px 80px; }}
  h1 {{ font-size: clamp(30px, 5vw, 42px); line-height: 1.15; margin: 0 0 8px; letter-spacing: -.01em; }}
  .act {{ color: var(--suave); font-size: 15px; margin: 0 0 40px; }}
  h2 {{ font-size: 21px; margin: 40px 0 10px; }}
  p, li {{ color: var(--suave); }}
  strong {{ color: var(--antracita); }}
  a {{ color: var(--antracita); }}
  ul {{ padding-left: 20px; }}
  li {{ margin-bottom: 6px; }}
  .tabla {{ overflow-x: auto; margin: 14px 0; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 15px; background: #fff; border-radius: 14px; overflow: hidden; }}
  th, td {{ text-align: left; padding: 11px 14px; border-bottom: 1px solid var(--beige); vertical-align: top; }}
  th {{ font-size: 13px; text-transform: uppercase; letter-spacing: .05em; color: var(--salvia); }}
  td {{ color: var(--suave); }}
  .ficha {{ background: #fff; border-radius: 16px; padding: 20px 24px; }}
  .ficha p {{ margin: 4px 0; }}
  footer {{ border-top: 1px solid var(--linea); padding: 28px 24px; font-size: 14px; color: var(--suave); display: flex; flex-wrap: wrap; gap: 18px; justify-content: center; }}
  footer a {{ color: var(--suave); }}
</style>
</head>
<body>
<header><a href="/" aria-label="Método Synesis, inicio"><img src="https://app.metodosynesis.com/media/fotos/logo-principal.svg" alt="Método Synesis" width="140" height="28"></a></header>
<main>
<h1>{titulo}</h1>
<p class="act">Última actualización: {ACT}</p>
{cuerpo}
</main>
<footer>
  <a href="/aviso-legal/">Aviso legal</a>
  <a href="/politica-de-privacidad/">Política de privacidad</a>
  <a href="/politica-de-cookies/">Política de cookies</a>
  <a href="#" data-cookies>Configurar cookies</a>
</footer>
</body>
</html>
'''
    os.makedirs(os.path.join(RAIZ, slug), exist_ok=True)
    open(os.path.join(RAIZ, slug, 'index.html'), 'w', encoding='utf-8').write(html)

# ── Aviso legal (único sitio con DNI y domicilio) ──
pagina('aviso-legal', 'Aviso legal', 'Datos identificativos y condiciones de uso de metodosynesis.com.', '''
<h2>1. Quién está detrás de esta web</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), te informamos de los datos del titular de metodosynesis.com y de sus subdominios:</p>
<div class="ficha">
  <p><strong>Titular:</strong> Paloma Robles Bermudo</p>
  <p><strong>NIF:</strong> 49165132X</p>
  <p><strong>Domicilio:</strong> C/ Sánchez Chacón, 9, 41701 Dos Hermanas (Sevilla), España</p>
  <p><strong>Email:</strong> <a href="mailto:palomarobles.crianza@gmail.com">palomarobles.crianza@gmail.com</a></p>
  <p><strong>Nombre comercial:</strong> Método Synesis</p>
</div>

<h2>2. Para qué sirve esta web</h2>
<p>metodosynesis.com da a conocer el Método Synesis, un programa de acompañamiento en crianza respetuosa para familias con peques de 2 a 6 años, y ofrece contenidos y recursos gratuitos, un cuestionario para analizar tu caso y la posibilidad de reservar una llamada.</p>
<p>Los contenidos tienen un fin divulgativo y educativo. No sustituyen la valoración de profesionales sanitarios, psicológicos o de otro tipo cuando la situación lo requiera.</p>

<h2>3. Condiciones de uso</h2>
<p>Al navegar por la web aceptas usarla de buena fe, sin dañarla ni impedir su funcionamiento, y sin utilizar sus contenidos con fines ilícitos o contrarios a estas condiciones.</p>

<h2>4. Propiedad intelectual</h2>
<p>Los textos, vídeos, imágenes, diseños, recursos descargables, la marca «Método Synesis» y su logotipo pertenecen a su titular o se usan con autorización. No está permitido reproducirlos, distribuirlos o transformarlos sin permiso previo y por escrito, salvo para uso personal y privado.</p>

<h2>5. Responsabilidad</h2>
<p>Ponemos todo el cuidado en que la información sea correcta y esté actualizada, pero no podemos garantizar que la web funcione siempre sin interrupciones ni errores. Los enlaces a webs de terceros se ofrecen por comodidad; no controlamos su contenido ni respondemos de él.</p>

<h2>6. Datos personales y cookies</h2>
<p>El tratamiento de tus datos se explica en la <a href="/politica-de-privacidad/">política de privacidad</a> y el uso de cookies en la <a href="/politica-de-cookies/">política de cookies</a>.</p>

<h2>7. Ley aplicable</h2>
<p>Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan según la normativa de consumidores y usuarios.</p>
''')

# ── Política de privacidad (sin DNI ni domicilio) ──
pagina('politica-de-privacidad', 'Política de privacidad', 'Cómo tratamos tus datos personales en Método Synesis.', '''
<p>Tu confianza nos importa. Aquí te contamos, sin letra pequeña, qué datos tratamos, para qué y qué derechos tienes, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>

<h2>1. Responsable</h2>
<div class="ficha">
  <p><strong>Responsable:</strong> Paloma Robles Bermudo (Método Synesis)</p>
  <p><strong>Contacto:</strong> <a href="mailto:palomarobles.crianza@gmail.com">palomarobles.crianza@gmail.com</a></p>
  <p>El resto de datos identificativos están en el <a href="/aviso-legal/">aviso legal</a>.</p>
</div>

<h2>2. Qué datos tratamos</h2>
<ul>
  <li><strong>Datos de contacto</strong> que nos das en los formularios: nombre, email y teléfono.</li>
  <li><strong>Respuestas al cuestionario</strong> sobre tu situación familiar, que pueden incluir información sobre tu peque (por ejemplo, su nombre de pila, su edad y cómo se comporta en ciertas situaciones). Te pedimos que no incluyas datos de salud ni otra información sensible que no sea necesaria.</li>
  <li><strong>Datos de la llamada</strong>: fecha y hora de la reserva y, si la llamada se graba (te lo indicamos al reservar y al empezar), la grabación, su transcripción y un resumen, que usamos solo internamente para preparar tu acompañamiento y nunca se publican ni se ceden.</li>
  <li><strong>Datos de clienta o cliente</strong>: los necesarios para darte acceso al programa y gestionar el pago.</li>
  <li><strong>Datos de navegación</strong>: origen de la visita (por ejemplo, desde qué anuncio o red social llegas), qué páginas y vídeos ves y, si lo aceptas, los que recogen las cookies de analítica y marketing.</li>
</ul>

<h2>3. Para qué los usamos y con qué base legal</h2>
<div class="tabla"><table>
  <tr><th>Finalidad</th><th>Base legal</th></tr>
  <tr><td>Enviarte el contenido que pides (vídeo, análisis de tu caso) y contactarte por email o WhatsApp sobre tu solicitud.</td><td>Tu consentimiento y la aplicación de medidas precontractuales a petición tuya.</td></tr>
  <tr><td>Preparar el análisis personalizado de tu caso a partir de tus respuestas, generado con ayuda de herramientas de inteligencia artificial.</td><td>Tu consentimiento.</td></tr>
  <tr><td>Gestionar y realizar la llamada que reservas y, si lo aceptas al inicio, grabarla para no perder detalles de tu caso.</td><td>Medidas precontractuales y tu consentimiento para la grabación.</td></tr>
  <tr><td>Prestarte el programa si lo contratas: acceso a contenidos, sesiones, comunidad y cobro.</td><td>Ejecución del contrato y obligaciones legales (fiscales y contables).</td></tr>
  <tr><td>Enviarte por email contenidos y novedades de Método Synesis. Puedes darte de baja en cualquier email.</td><td>Tu consentimiento o, si ya eres clienta o cliente, el interés legítimo (art. 21 LSSI).</td></tr>
  <tr><td>Saber qué funciona en la web y en nuestros anuncios.</td><td>Tu consentimiento a las cookies de analítica y marketing.</td></tr>
</table></div>
<p>No tomamos decisiones automatizadas que produzcan efectos jurídicos sobre ti. El análisis de tu caso es orientativo y lo puedes comentar con Paloma.</p>

<h2>4. Cuánto tiempo los guardamos</h2>
<ul>
  <li>Datos de personas interesadas que no llegan a contratar: hasta que pidas su supresión o, como máximo, 2 años desde el último contacto.</li>
  <li>Grabaciones y transcripciones de llamadas: un máximo de 12 meses.</li>
  <li>Datos de clientas y clientes: mientras dure la relación y, después, los plazos legales de conservación (por ejemplo, 6 años para obligaciones contables y fiscales).</li>
  <li>Datos de navegación: según la <a href="/politica-de-cookies/">política de cookies</a>.</li>
</ul>

<h2>5. Con quién los compartimos</h2>
<p>No vendemos tus datos. Solo acceden a ellos los proveedores que necesitamos para funcionar, que actúan como encargados del tratamiento y con los que tenemos los contratos exigidos por el RGPD:</p>
<ul>
  <li><strong>Alojamiento y bases de datos:</strong> Hetzner Online (Alemania) y Supabase (servidores en la UE, Fráncfort).</li>
  <li><strong>Email:</strong> Brevo (Francia).</li>
  <li><strong>Gestión interna de contactos:</strong> Notion Labs (EE. UU.).</li>
  <li><strong>Reserva y realización de llamadas:</strong> Cal.com (EE. UU.) y Google (Google Calendar y Google Meet).</li>
  <li><strong>Grabación y transcripción de llamadas:</strong> Fireflies.ai (EE. UU.).</li>
  <li><strong>Análisis de tu caso con inteligencia artificial:</strong> Anthropic (EE. UU.).</li>
  <li><strong>Vídeos:</strong> Wistia (EE. UU.).</li>
  <li><strong>Comunidad y contenidos del programa:</strong> Skool (EE. UU.).</li>
  <li><strong>Pagos:</strong> Stripe (Irlanda / EE. UU.).</li>
  <li><strong>Analítica y publicidad</strong> (solo si lo aceptas): Google, Microsoft y Meta.</li>
</ul>
<p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En esos casos, las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en las cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>
<p>Fuera de esto, solo cederemos datos cuando lo exija la ley.</p>

<h2>6. Tus derechos</h2>
<p>Puedes pedir en cualquier momento acceder a tus datos, rectificarlos, suprimirlos, oponerte a su tratamiento, limitarlo o llevártelos (portabilidad), así como retirar el consentimiento que hayas dado, sin que eso afecte a lo tratado antes. Escríbenos a <a href="mailto:palomarobles.crianza@gmail.com">palomarobles.crianza@gmail.com</a> indicando qué derecho quieres ejercer.</p>
<p>Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es">www.aepd.es</a>).</p>

<h2>7. Menores</h2>
<p>Nuestros servicios se dirigen a personas adultas. Los datos de los peques solo los recibimos a través de su madre, padre o tutor, y únicamente para entender la situación familiar y ayudaros.</p>

<h2>8. Seguridad</h2>
<p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos: conexiones cifradas, accesos restringidos al equipo y proveedores que cumplen el RGPD.</p>
''')

# ── Política de cookies ──
pagina('politica-de-cookies', 'Política de cookies', 'Qué cookies usamos en Método Synesis y cómo puedes configurarlas.', '''
<p>Las cookies son pequeños archivos que una web guarda en tu navegador. Aquí te explicamos cuáles usamos y cómo decidir sobre ellas.</p>

<h2>1. Tu elección</h2>
<p>Al entrar por primera vez te preguntamos. Si no aceptas, solo usamos las necesarias. Puedes cambiar de opinión cuando quieras desde <a href="#" data-cookies>Configurar cookies</a> (también está al pie de cada página). Tu elección vale para metodosynesis.com y sus subdominios y la recordamos 6 meses.</p>

<h2>2. Qué cookies usamos</h2>
<div class="tabla"><table>
  <tr><th>Tipo</th><th>Proveedor</th><th>Para qué</th><th>Duración</th></tr>
  <tr><td>Necesaria</td><td>Método Synesis (<code>synesis_consent</code>)</td><td>Recordar tu elección sobre cookies.</td><td>6 meses</td></tr>
  <tr><td>Necesaria</td><td>Método Synesis (almacenamiento de sesión)</td><td>Recordar el origen de tu visita y tus respuestas mientras rellenas un formulario.</td><td>Hasta cerrar el navegador</td></tr>
  <tr><td>Analítica</td><td>Google Analytics (<code>_ga</code>, <code>_ga_*</code>)</td><td>Medir visitas y uso de la web de forma agregada.</td><td>Hasta 2 años</td></tr>
  <tr><td>Analítica</td><td>Microsoft Clarity (<code>_clck</code>, <code>_clsk</code>, <code>CLID</code>)</td><td>Entender cómo se navega (clics, desplazamiento) para mejorar la web.</td><td>Hasta 1 año</td></tr>
  <tr><td>Marketing</td><td>Meta (<code>_fbp</code>, <code>fr</code>)</td><td>Medir la eficacia de nuestros anuncios en Facebook e Instagram.</td><td>Hasta 3 meses</td></tr>
  <tr><td>Funcional</td><td>Wistia</td><td>Reproducir los vídeos y recordar por dónde vas.</td><td>Hasta 1 año</td></tr>
</table></div>
<p>Google Tag Manager, la herramienta con la que gestionamos estas etiquetas, no guarda cookies por sí misma y respeta tu elección: si no aceptas una categoría, sus etiquetas no se activan.</p>

<h2>3. Cómo borrarlas desde el navegador</h2>
<p>También puedes bloquear o eliminar cookies desde la configuración de tu navegador (Chrome, Safari, Firefox, Edge…). Ten en cuenta que, si bloqueas las necesarias, alguna parte de la web podría no funcionar bien.</p>

<h2>4. Más información</h2>
<p>Para saber cómo tratamos tus datos, consulta la <a href="/politica-de-privacidad/">política de privacidad</a>. Si tienes dudas, escríbenos a <a href="mailto:palomarobles.crianza@gmail.com">palomarobles.crianza@gmail.com</a>.</p>
''')
print('ok')
