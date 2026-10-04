import { workflow, node, trigger, ifElse, sticky, expr } from '@n8n/workflow-sdk';

const registro = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Registro en la L1',
    parameters: {
      httpMethod: 'POST',
      path: 'captacion',
      authentication: 'none',
      responseMode: 'onReceived',
      options: { allowedOrigins: 'https://app.metodosynesis.com,https://metodosynesis.com' }
    }
  },
  output: [{ body: { nombre: 'Marta', email: 'marta@example.com', telefono: '+34 612 345 678', angulo: 'rabietas', timestamp: '2026-10-04T10:00:00Z', utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'rabietas-oct', utm_content: 'video-1' } }]
});

const preparar = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar lead',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode:
        "const b = $json.body || {};\n" +
        "const t = function (v, max) { return String(v == null ? '' : v).replace(/\\s+/g, ' ').trim().slice(0, max || 200); };\n" +
        "const nombre = t(b.nombre, 80);\n" +
        "const email = t(b.email, 120).toLowerCase();\n" +
        "const telefono = t(b.telefono, 40);\n" +
        "let num = telefono.replace(/[^0-9]/g, '');\n" +
        "if (num.indexOf('00') === 0) num = num.slice(2);\n" +
        "if (num.length === 9) num = '34' + num;\n" +
        "const primer = nombre.split(' ')[0] || nombre;\n" +
        "const m1 = 'Hola ' + primer + ', soy Paloma 🌿\\n\\nAcabo de ver que te has registrado en la clase gratuita de crianza y quería escribirte personalmente.\\n\\nTienes acceso a la clase aquí para que la puedas ver en cualquier momento → https://metodosynesis.com/vsl/\\n\\nSi la ves hasta el final, al terminar desbloqueas un recurso que he preparado para acompañarte en los momentos más difíciles.\\n\\nEn menos de 5 minutos vas a regularte, ponerle nombre a lo que sientes, entender qué le está pasando a tu hijo y salir con pasos concretos para la próxima vez que ocurra.\\n\\nEsta semana es gratuito.\\n\\nEspero que te sirva 💚';\n" +
        "const m2 = 'Hola ' + primer + ' 🌿\\n\\nTe escribí hace unos días y quería saber si tuviste ocasión de ver la clase y desbloquear el recurso.\\n\\nSi lo usaste me encantaría saber cómo te fue, porque cada persona lo vive de forma diferente.\\n\\nY si todavía no has tenido un momento, no pasa nada, aquí sigo.\\n\\nMe dices algo cuando puedas.';\n" +
        "let angulo = t(b.angulo, 30).toLowerCase();\n" +
        "if (['rabietas', 'no_obedece', 'pega'].indexOf(angulo) < 0) angulo = angulo ? angulo : 'generico';\n" +
        "return { json: {\n" +
        "  nombre: nombre || 'Sin nombre',\n" +
        "  email: email,\n" +
        "  telefono: telefono,\n" +
        "  angulo: angulo,\n" +
        "  wa1: num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(m1) : '',\n" +
        "  wa2: num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(m2) : '',\n" +
        "  utm_source: t(b.utm_source, 100),\n" +
        "  utm_medium: t(b.utm_medium, 100),\n" +
        "  utm_campaign: t(b.utm_campaign, 150),\n" +
        "  utm_content: t(b.utm_content, 150)\n" +
        "} };"
    }
  },
  output: [{ nombre: 'Marta', email: 'marta@example.com', telefono: '+34 612 345 678', angulo: 'rabietas', wa1: 'https://wa.me/34612345678?text=Hola', wa2: 'https://wa.me/34612345678?text=Hola', utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'rabietas-oct', utm_content: 'video-1' }]
});

const emailValido = node({
  type: 'n8n-nodes-base.filter',
  version: 2.3,
  config: {
    name: 'Email válido',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [
          { leftValue: expr('{{ $json.email }}'), operator: { type: 'string', operation: 'regex' }, rightValue: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
        ],
        combinator: 'and'
      }
    }
  },
  output: [{ nombre: 'Marta', email: 'marta@example.com', telefono: '+34 612 345 678', angulo: 'rabietas', wa1: '', wa2: '', utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '' }]
});

const brevoContacto = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Contacto en Brevo (lista 3)',
    retryOnFail: true,
    maxTries: 2,
    waitBetweenTries: 2000,
    onError: 'continueRegularOutput',
    parameters: {
      method: 'POST',
      url: 'https://api.brevo.com/v3/contacts',
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'sendInBlueApi',
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('{{ JSON.stringify({ email: $json.email, attributes: { NOMBRE: $json.nombre, TELEFONO: $json.telefono }, listIds: [3], updateEnabled: true }) }}'),
      options: {}
    },
    credentials: { sendInBlueApi: { id: '2MWUMDRskHFe3yBG', name: 'Brevo Synesis' } }
  },
  output: [{ id: 123 }]
});

const buscarLead = node({
  type: 'n8n-nodes-base.notion',
  version: 3,
  config: {
    name: 'Buscar ficha en Notion',
    alwaysOutputData: true,
    parameters: {
      resource: 'databasePage',
      operation: 'getAll',
      authentication: 'apiKey',
      dataSourceId: { __rl: true, mode: 'id', value: '364a2155-8efb-80c2-96e4-000bfa5f391d' },
      returnAll: false,
      limit: 1,
      filterType: 'json',
      filterJson: expr("{{ JSON.stringify({ property: 'Email', email: { equals: $('Preparar lead').item.json.email } }) }}"),
      simple: false,
      options: {}
    },
    credentials: { notionApi: { id: 'pT3cffg2cQZGSHOU', name: 'Notion Synesis' } }
  },
  output: [{}]
});

const esNuevo = ifElse({
  version: 2.3,
  config: {
    name: '¿Lead nuevo?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
        conditions: [{ leftValue: expr('{{ $json.id ?? "" }}'), operator: { type: 'string', operation: 'empty', singleValue: true }, rightValue: '' }],
        combinator: 'and'
      }
    }
  }
});

const L = "$('Preparar lead').item.json";

const crearFicha = node({
  type: 'n8n-nodes-base.notion',
  version: 3,
  config: {
    name: 'Crear ficha (Lead Generado)',
    parameters: {
      resource: 'databasePage',
      operation: 'create',
      authentication: 'apiKey',
      dataSourceId: { __rl: true, mode: 'id', value: '364a2155-8efb-80c2-96e4-000bfa5f391d' },
      title: expr('{{ ' + L + '.nombre }}'),
      propertiesUi: {
        propertyValues: [
          { key: 'Email|email', emailValue: expr('{{ ' + L + '.email }}') },
          { key: 'Estado|status', statusValue: 'Lead Generado' },
          { key: 'Teléfono|phone_number', phoneValue: expr('{{ ' + L + '.telefono }}') },
          { key: 'Fecha Captación|date', date: expr('{{ $now.toISODate() }}'), includeTime: false },
          { key: 'Angulo|rich_text', textContent: expr('{{ ' + L + '.angulo }}') },
          { key: 'WA1|url', urlValue: expr('{{ ' + L + '.wa1 }}'), ignoreIfEmpty: true },
          { key: 'WA2|url', urlValue: expr('{{ ' + L + '.wa2 }}'), ignoreIfEmpty: true },
          { key: 'UTM Source|rich_text', textContent: expr('{{ ' + L + '.utm_source }}') },
          { key: 'UTM Medium|rich_text', textContent: expr('{{ ' + L + '.utm_medium }}') },
          { key: 'UTM Campaign|rich_text', textContent: expr('{{ ' + L + '.utm_campaign }}') },
          { key: 'UTM Content|rich_text', textContent: expr('{{ ' + L + '.utm_content }}') }
        ]
      },
      simple: true,
      options: {}
    },
    credentials: { notionApi: { id: 'pT3cffg2cQZGSHOU', name: 'Notion Synesis' } }
  },
  output: [{ id: 'def456', url: 'https://www.notion.so/def456' }]
});

const avisarPaloma = node({
  type: 'n8n-nodes-base.sendInBlue',
  version: 1,
  config: {
    name: 'Avisar a Paloma: nuevo lead',
    parameters: {
      resource: 'email',
      operation: 'send',
      sendHTML: true,
      sender: 'palomarobles.crianza@gmail.com',
      receipients: 'palomarobles.crianza@gmail.com',
      subject: '🌿NUEVO LEAD🌿',
      htmlContent: expr('<p><b>Nombre:</b> {{ ' + L + '.nombre }}</p>\n<p><b>Email:</b> {{ ' + L + '.email }}</p>\n<p><b>Teléfono:</b> {{ ' + L + '.telefono }}</p>\n<p><b>Ángulo:</b> {{ ' + L + '.angulo }}</p>\n<p><b>Ficha:</b> <a href="{{ $json.url }}">abrir en Notion</a></p>')
    },
    credentials: { sendInBlueApi: { id: '2MWUMDRskHFe3yBG', name: 'Brevo Synesis' } }
  }
});

const nota = sticky('## Captación\nFormulario de la L1 (app.metodosynesis.com/rabietas/, /no-obedece/, /pega/) → contacto en Brevo (lista 3) → si el email no está en Notion, crea la ficha como Lead Generado (con ángulo, UTMs y enlaces de WhatsApp) y avisa a Paloma por email.\n\nWebhook: https://n8n.metodosynesis.com/webhook/captacion', [], { color: 4 });

export default workflow('captacion', 'Captación (L1 → Brevo + Notion)')
  .add(registro)
  .to(preparar)
  .to(emailValido)
  .to(brevoContacto)
  .to(buscarLead)
  .to(esNuevo
    .onTrue(crearFicha.to(avisarPaloma)))
  .add(nota);
