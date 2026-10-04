import { workflow, node, trigger, ifElse, sticky, expr } from '@n8n/workflow-sdk';

const reservaCal = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Reserva en Cal.com',
    parameters: {
      httpMethod: 'POST',
      path: 'cal-reserva',
      authentication: 'none',
      responseMode: 'onReceived',
      options: {}
    }
  },
  output: [{ body: { triggerEvent: 'BOOKING_CREATED', payload: { startTime: '2026-10-08T09:00:00Z', attendees: [{ name: 'Marta López', email: 'marta@example.com' }], responses: { name: { value: 'Marta López' }, email: { value: 'marta@example.com' }, 'quien-asiste': { value: 'Madre' } } } } }]
});

const normalizar = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Normalizar reserva',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'evento', name: 'evento', value: expr('{{ $json.body?.triggerEvent ?? $json.triggerEvent ?? "" }}'), type: 'string' },
          { id: 'email', name: 'email', value: expr('{{ ($json.body?.payload?.responses?.email?.value ?? $json.body?.payload?.attendees?.[0]?.email ?? "").trim().toLowerCase() }}'), type: 'string' },
          { id: 'nombre', name: 'nombre', value: expr('{{ $json.body?.payload?.responses?.name?.value ?? $json.body?.payload?.attendees?.[0]?.name ?? "" }}'), type: 'string' },
          { id: 'quien', name: 'quien', value: expr('{{ $json.body?.payload?.responses?.["quien-asiste"]?.value ?? "Madre" }}'), type: 'string' },
          { id: 'inicio', name: 'inicio', value: expr('{{ $json.body?.payload?.startTime ?? "" }}'), type: 'string' }
        ]
      }
    }
  },
  output: [{ evento: 'BOOKING_CREATED', email: 'marta@example.com', nombre: 'Marta López', quien: 'Madre', inicio: '2026-10-08T09:00:00Z' }]
});

const soloNuevas = node({
  type: 'n8n-nodes-base.filter',
  version: 2.3,
  config: {
    name: 'Solo reservas nuevas',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [
          { leftValue: expr('{{ $json.evento }}'), operator: { type: 'string', operation: 'equals' }, rightValue: 'BOOKING_CREATED' },
          { leftValue: expr('{{ $json.email }}'), operator: { type: 'string', operation: 'notEmpty', singleValue: true }, rightValue: '' }
        ],
        combinator: 'and'
      }
    }
  },
  output: [{ evento: 'BOOKING_CREATED', email: 'marta@example.com', nombre: 'Marta López', quien: 'Madre', inicio: '2026-10-08T09:00:00Z' }]
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
      filterJson: expr('{{ JSON.stringify({ property: "Email", email: { equals: $json.email } }) }}'),
      simple: false,
      options: {}
    },
    credentials: { notionApi: { id: 'pT3cffg2cQZGSHOU', name: 'Notion Synesis' } }
  },
  output: [{ id: 'abc123', url: 'https://www.notion.so/abc123', properties: { Email: { email: 'marta@example.com' } } }]
});

const existeFicha = ifElse({
  version: 2.3,
  config: {
    name: '¿Existe la ficha?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'loose' },
        conditions: [{ leftValue: expr('{{ $json.id ?? "" }}'), operator: { type: 'string', operation: 'notEmpty', singleValue: true }, rightValue: '' }],
        combinator: 'and'
      }
    }
  }
});

const prepararDatos = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar datos del caso',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode: 
        "const p = $json.properties || {};\n" +
        "const txt = function (k) {\n" +
        "  const v = p[k]; if (!v) return '';\n" +
        "  if (v.rich_text) return v.rich_text.map(function (t) { return t.plain_text; }).join('').trim();\n" +
        "  if (v.title) return v.title.map(function (t) { return t.plain_text; }).join('').trim();\n" +
        "  if (v.type === 'url') return v.url || '';\n" +
        "  if (v.type === 'email') return v.email || '';\n" +
        "  if (v.status) return v.status.name || '';\n" +
        "  if (v.select) return v.select.name || '';\n" +
        "  return '';\n" +
        "};\n" +
        "const reserva = $('Normalizar reserva').item.json;\n" +
        "const situacion = txt('Situación');\n" +
        "const corte = situacion.indexOf(' — ');\n" +
        "const sitOpcion = corte >= 0 ? situacion.slice(0, corte).trim() : situacion;\n" +
        "const relato = corte >= 0 ? situacion.slice(corte + 3).trim() : '';\n" +
        "return { json: {\n" +
        "  pageId: $json.id,\n" +
        "  email: reserva.email,\n" +
        "  nombre: (reserva.nombre || '').trim().split(/\\s+/)[0] || '',\n" +
        "  quien: reserva.quien,\n" +
        "  angulo: txt('Angulo').toLowerCase(),\n" +
        "  hijoP1: txt('Hijo (auditoría)'),\n" +
        "  sitOpcion: sitOpcion,\n" +
        "  relato: relato,\n" +
        "  reaccion: txt('Cómo reacciona'),\n" +
        "  siente: txt('Cómo se siente'),\n" +
        "  cree: txt('Qué cree que le pasa'),\n" +
        "  deseo: txt('Qué cambiaría'),\n" +
        "  relacion: txt('Relación'),\n" +
        "  auditoria: txt('URL auditoría')\n" +
        "} };"
    }
  },
  output: [{ pageId: 'abc123', email: 'marta@example.com', nombre: 'Marta', quien: 'Madre', angulo: 'rabietas', hijoP1: 'Lucía, 4 años', sitOpcion: 'Estalla por cualquier cosa', relato: 'Ayer tuvo varias rabietas largas.', reaccion: 'Cedo para que pare', siente: 'Culpa', cree: 'No entiendo qué le pasa realmente', deseo: 'Que haya calma en casa', relacion: 'Buena en general pero los conflictos la rompen', auditoria: 'https://metodosynesis.com/abc/' }]
});

const claudeHaiku = node({
  type: '@n8n/n8n-nodes-langchain.anthropic',
  version: 1,
  config: {
    name: 'Claude Haiku: ordenar respuestas',
    parameters: {
      resource: 'text',
      operation: 'message',
      modelId: { __rl: true, mode: 'id', value: 'claude-haiku-4-5-20251001' },
      messages: {
        values: [
          { role: 'user', content: expr('Datos del lead:\n{{ JSON.stringify({ hijo_p1: $json.hijoP1, angulo: $json.angulo, situacion: $json.sitOpcion, reaccion: $json.reaccion }) }}') }
        ]
      },
      simplify: true,
      options: {
        maxTokens: 400,
        temperature: 0,
        system: 
        'Recibes respuestas de un cuestionario de crianza. Devuelve SOLO un objeto JSON válido, sin texto antes ni después, sin bloques de código. El primer carácter debe ser { y el último }.\n' +
        'Campos:\n' +
        '- "h": nombre del hijo/a extraído de hijo_p1, con mayúscula inicial. Si no hay nombre, "tu peque".\n' +
        '- "e": edad en años (número entero entre 1 y 12) extraída de hijo_p1. Si no se indica, 3.\n' +
        '- "g": "a" si el nombre es claramente de niña o el texto dice niña/hija; si no, "o".\n' +
        '- "ang": uno de "rabietas", "obedece", "pega", "generico". Usa el angulo recibido si es uno de esos; si no, deduce el más adecuado por la situación.\n' +
        '- "sit": EXACTAMENTE una de las opciones de la lista de su ángulo. Si la situación recibida ya coincide, cópiala; si es otra cosa, elige la más cercana.\n' +
        '  rabietas: "Estalla por cualquier cosa" | "Se tira al suelo y grita" | "No puede calmarse cuando se enfada" | "Llora de forma desproporcionada"\n' +
        '  obedece: "Me ignora cuando le hablo" | "Hay que repetírselo todo mil veces" | "Solo hace caso si grito o amenazo"\n' +
        '  pega: "Nos pega a nosotros (sus padres)" | "Pega a otros niños" | "Pega a otros adultos (profes, familia)" | "Se pega o se hace daño a sí mismo"\n' +
        '  generico: "Rabietas e intensidad emocional" | "No escucha ni obedece" | "Se opone y lo discute todo" | "Peleas en las transiciones" | "Pega o muerde cuando se frustra"\n' +
        '- "rea": EXACTAMENTE una de: "Acabo gritando aunque no quiero" | "Me bloqueo y no sé qué hacer" | "Cedo para que pare" | "Intento razonar pero no funciona". Si la reacción recibida es otra cosa, elige la más cercana.\n' +
        '- "otros": si la situación o la reacción NO coincidían con ninguna opción, copia aquí literalmente lo que escribió la persona (ej. "Reacción: ..."). Si coincidían, "".'
      }
    },
    credentials: { anthropicApi: { id: 'l7sqcc7bYYyZT5qC', name: 'Anthropic Synesis' } }
  },
  output: [{ content: [{ type: 'text', text: '{"h":"Lucía","e":4,"g":"a","ang":"rabietas","sit":"Estalla por cualquier cosa","rea":"Cedo para que pare","otros":""}' }] }]
});

const montarEnlace = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Montar enlace del recurso',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode:
        "const d = $('Preparar datos del caso').item.json;\n" +
        "const r = $json;\n" +
        "let texto = '';\n" +
        "if (typeof r.merged_response === 'string') texto = r.merged_response;\n" +
        "else if (Array.isArray(r.content)) texto = r.content.map(function (c) { return c.text || ''; }).join('');\n" +
        "else if (typeof r.text === 'string') texto = r.text;\n" +
        "else if (typeof r.output === 'string') texto = r.output;\n" +
        "let ia = {};\n" +
        "const m = texto.match(/\\{[\\s\\S]*\\}/);\n" +
        "if (m) { try { ia = JSON.parse(m[0]); } catch (e) { ia = {}; } }\n" +
        "const LISTAS = {\n" +
        "  rabietas: ['Estalla por cualquier cosa','Se tira al suelo y grita','No puede calmarse cuando se enfada','Llora de forma desproporcionada'],\n" +
        "  obedece: ['Me ignora cuando le hablo','Hay que repetírselo todo mil veces','Solo hace caso si grito o amenazo'],\n" +
        "  pega: ['Nos pega a nosotros (sus padres)','Pega a otros niños','Pega a otros adultos (profes, familia)','Se pega o se hace daño a sí mismo'],\n" +
        "  generico: ['Rabietas e intensidad emocional','No escucha ni obedece','Se opone y lo discute todo','Peleas en las transiciones','Pega o muerde cuando se frustra']\n" +
        "};\n" +
        "const REACC = ['Acabo gritando aunque no quiero','Me bloqueo y no sé qué hacer','Cedo para que pare','Intento razonar pero no funciona'];\n" +
        "const norm = function (s) { return (s || '').toLowerCase().replace(/\\s*\\(.*?\\)\\s*/g, ' ').replace(/\\s+/g, ' ').trim(); };\n" +
        "let ang = '', sit = '';\n" +
        "Object.keys(LISTAS).forEach(function (k) { LISTAS[k].forEach(function (o) { if (!sit && norm(o) === norm(d.sitOpcion)) { ang = k; sit = o; } }); });\n" +
        "if (!sit) {\n" +
        "  ang = LISTAS[ia.ang] ? ia.ang : (LISTAS[d.angulo] ? d.angulo : 'generico');\n" +
        "  sit = LISTAS[ang].indexOf(ia.sit) >= 0 ? ia.sit : LISTAS[ang][0];\n" +
        "}\n" +
        "let rea = REACC.filter(function (o) { return norm(o) === norm(d.reaccion); })[0] || '';\n" +
        "if (!rea) rea = REACC.indexOf(ia.rea) >= 0 ? ia.rea : '';\n" +
        "const q = (d.quien || '').toLowerCase();\n" +
        "const rol = q.indexOf('amb') === 0 ? 'ambos' : (q === 'padre' ? 'padre' : 'madre');\n" +
        "const caso = {\n" +
        "  rol: rol,\n" +
        "  p: d.nombre || '',\n" +
        "  h: ia.h || 'tu peque',\n" +
        "  e: Math.min(12, Math.max(1, parseInt(ia.e, 10) || 3)),\n" +
        "  g: ia.g === 'a' ? 'a' : 'o',\n" +
        "  ang: ang,\n" +
        "  sit: sit,\n" +
        "  rea: rea,\n" +
        "  sie: d.siente || '',\n" +
        "  cre: d.cree || '',\n" +
        "  des: d.deseo || '',\n" +
        "  n: { relato: d.relato || '', otros: ia.otros || '', rel: d.relacion || '', aud: d.auditoria || '' }\n" +
        "};\n" +
        "const c = Buffer.from(JSON.stringify(caso), 'utf8').toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');\n" +
        "return { json: { pageId: d.pageId, email: d.email, url: 'https://app.metodosynesis.com/llamada/?c=' + c, caso: caso, iaOk: !!m } };"
    }
  },
  output: [{ pageId: 'abc123', email: 'marta@example.com', url: 'https://app.metodosynesis.com/llamada/?c=eyJyb2wiOiJtYWRyZSJ9', caso: { rol: 'madre' }, iaOk: true }]
});

const guardarNotion = node({
  type: 'n8n-nodes-base.notion',
  version: 3,
  config: {
    name: 'Guardar enlace en Notion',
    parameters: {
      resource: 'databasePage',
      operation: 'update',
      authentication: 'apiKey',
      pageId: { __rl: true, mode: 'id', value: expr('{{ $json.pageId }}') },
      propertiesUi: {
        propertyValues: [
          { key: 'URL Recurso Llamada|url', urlValue: expr('{{ $json.url }}') },
          { key: 'Estado|status', statusValue: 'Reserva Llamada' }
        ]
      },
      simple: true,
      options: {}
    },
    credentials: { notionApi: { id: 'pT3cffg2cQZGSHOU', name: 'Notion Synesis' } }
  },
  output: [{ id: 'abc123', url: 'https://www.notion.so/abc123' }]
});

const avisarPaloma = node({
  type: 'n8n-nodes-base.sendInBlue',
  version: 1,
  config: {
    name: 'Avisar a Paloma: reserva sin ficha',
    parameters: {
      resource: 'email',
      operation: 'send',
      sendHTML: false,
      sender: 'palomarobles.crianza@gmail.com',
      receipients: 'palomarobles.crianza@gmail.com',
      subject: expr('Reserva sin ficha en Notion: {{ $("Normalizar reserva").item.json.nombre }}'),
      textContent: expr('Ha reservado llamada alguien que no aparece en Notion con ese email, así que no se ha generado su recurso de llamada.\n\nNombre: {{ $("Normalizar reserva").item.json.nombre }}\nEmail: {{ $("Normalizar reserva").item.json.email }}\nQuién asiste: {{ $("Normalizar reserva").item.json.quien }}\nFecha: {{ $("Normalizar reserva").item.json.inicio }}\n\nPuedes abrir https://app.metodosynesis.com/llamada/ y rellenar el caso a mano con "Editar caso".')
    },
    credentials: { sendInBlueApi: { id: '2MWUMDRskHFe3yBG', name: 'Brevo Synesis' } }
  }
});

const nota = sticky('## Recurso de llamada\nCal.com (Booking Created) → busca la ficha por email en Notion → Claude Haiku ordena P1 y los "Otro" → monta el enlace /llamada/?c=… → lo guarda en Notion y pasa el lead a "Reserva Llamada".\n\nSi no hay ficha, avisa a Paloma por email.\n\nWebhook para Cal.com: https://n8n.metodosynesis.com/webhook/cal-reserva', [], { color: 4 });

export default workflow('recurso-llamada', 'Recurso de llamada (Cal.com → Notion)')
  .add(reservaCal)
  .to(normalizar)
  .to(soloNuevas)
  .to(buscarLead)
  .to(existeFicha
    .onTrue(prepararDatos.to(claudeHaiku).to(montarEnlace).to(guardarNotion))
    .onFalse(avisarPaloma))
  .add(nota)
  .group('Leer el caso', [normalizar, soloNuevas, buscarLead], { description: 'Normaliza la reserva de Cal.com, descarta otros eventos y busca la ficha del lead en Notion por email' })
  .group('Generar recurso', [prepararDatos, claudeHaiku, montarEnlace, guardarNotion], { description: 'Lee las respuestas, Haiku las ajusta a las opciones del recurso, monta el enlace y lo guarda en la ficha' });
