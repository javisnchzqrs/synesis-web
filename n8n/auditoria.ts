import { workflow, node, trigger, ifElse, sticky, expr } from '@n8n/workflow-sdk';

// Copia de referencia. En n8n, __MCP_TOKEN__ y __SYSTEM_PROMPT__ están sustituidos
// por el token del conector y por el prompt maestro de la auditoría (no se publica en este repositorio).

const cuestionario = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Cuestionario enviado',
    parameters: {
      httpMethod: 'POST',
      path: 'auditoria',
      authentication: 'none',
      responseMode: 'onReceived',
      options: { allowedOrigins: 'https://app.metodosynesis.com,https://metodosynesis.com' }
    }
  },
  output: [{ body: { tipo: 'auditoria', lead_id: 'lucia-4-anos-1791130000000', email: 'marta@example.com', angulo: 'rabietas', hijo: 'Lucía, 4 años', situacion: 'Estalla por cualquier cosa — Ayer se tiró al suelo en el súper', reaccion: 'Acabo gritando aunque no quiero', despues: 'Culpa', cree: 'No entiendo qué le pasa realmente', relacion: 'Buena pero los conflictos la rompen', deseo: 'Que haya calma en casa' } }]
});

const preparar = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Preparar respuestas',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode:
        "const b = $json.body || {};\n" +
        "const limpio = function (v) { return String(v == null ? '' : v).replace(/[\\r\\n\\t]+/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 1500); };\n" +
        "let id = String(b.lead_id || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60);\n" +
        "if (id.length < 3) id = 'analisis-' + Date.now();\n" +
        "let angulo = limpio(b.angulo).toLowerCase();\n" +
        "if (['rabietas', 'no_obedece', 'pega', 'generico'].indexOf(angulo) < 0) angulo = 'generico';\n" +
        "return { json: {\n" +
        "  id: id,\n" +
        "  url: 'https://app.metodosynesis.com/auditoria/?id=' + id,\n" +
        "  email: limpio(b.email).toLowerCase(),\n" +
        "  angulo: angulo,\n" +
        "  hijo: limpio(b.hijo),\n" +
        "  situacion: limpio(b.situacion),\n" +
        "  reaccion: limpio(b.reaccion),\n" +
        "  despues: limpio(b.despues),\n" +
        "  cree: limpio(b.cree),\n" +
        "  relacion: limpio(b.relacion),\n" +
        "  deseo: limpio(b.deseo)\n" +
        "} };"
    }
  },
  output: [{ id: 'lucia-4-anos-1791130000000', url: 'https://app.metodosynesis.com/auditoria/?id=lucia-4-anos-1791130000000', email: 'marta@example.com', angulo: 'rabietas', hijo: 'Lucía, 4 años', situacion: 'Estalla por cualquier cosa — Ayer se tiró al suelo', reaccion: 'Acabo gritando aunque no quiero', despues: 'Culpa', cree: 'No entiendo qué le pasa', relacion: 'Buena', deseo: 'Calma' }]
});

const soloValidos = node({
  type: 'n8n-nodes-base.filter',
  version: 2.3,
  config: {
    name: 'Solo cuestionarios con email',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [
          { leftValue: expr('{{ $json.email }}'), operator: { type: 'string', operation: 'contains' }, rightValue: '@' }
        ],
        combinator: 'and'
      }
    }
  },
  output: [{ id: 'lucia-4-anos-1791130000000', email: 'marta@example.com' }]
});

// ── Rama 1: ficha en Notion ──

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
  output: [{ id: 'abc123', properties: { Estado: { status: { name: 'Lead Generado' } } } }]
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

const P = "$('Preparar respuestas').item.json";

const actualizarFicha = node({
  type: 'n8n-nodes-base.notion',
  version: 3,
  config: {
    name: 'Actualizar ficha',
    parameters: {
      resource: 'databasePage',
      operation: 'update',
      authentication: 'apiKey',
      pageId: { __rl: true, mode: 'id', value: expr('{{ $json.id }}') },
      propertiesUi: {
        propertyValues: [
          { key: 'Estado|status', statusValue: expr("{{ ['', 'Lead Generado', 'Lead Huérfano', 'Contactado', 'En seguimiento'].includes($json.properties?.Estado?.status?.name ?? '') ? 'Con Auditoría' : $json.properties.Estado.status.name }}") },
          { key: 'URL auditoría|url', urlValue: expr('{{ ' + P + '.url }}') },
          { key: 'Angulo|rich_text', textContent: expr('{{ ' + P + '.angulo }}') },
          { key: 'Hijo (auditoría)|rich_text', textContent: expr('{{ ' + P + '.hijo }}') },
          { key: 'Situación|rich_text', textContent: expr('{{ ' + P + '.situacion }}') },
          { key: 'Cómo reacciona|rich_text', textContent: expr('{{ ' + P + '.reaccion }}') },
          { key: 'Cómo se siente|rich_text', textContent: expr('{{ ' + P + '.despues }}') },
          { key: 'Qué cree que le pasa|rich_text', textContent: expr('{{ ' + P + '.cree }}') },
          { key: 'Relación|rich_text', textContent: expr('{{ ' + P + '.relacion }}') },
          { key: 'Qué cambiaría|rich_text', textContent: expr('{{ ' + P + '.deseo }}') }
        ]
      },
      simple: true,
      options: {}
    },
    credentials: { notionApi: { id: 'pT3cffg2cQZGSHOU', name: 'Notion Synesis' } }
  },
  output: [{ id: 'abc123' }]
});

const crearHuerfano = node({
  type: 'n8n-nodes-base.notion',
  version: 3,
  config: {
    name: 'Crear ficha huérfana',
    parameters: {
      resource: 'databasePage',
      operation: 'create',
      authentication: 'apiKey',
      dataSourceId: { __rl: true, mode: 'id', value: '364a2155-8efb-80c2-96e4-000bfa5f391d' },
      title: 'Huérfano',
      propertiesUi: {
        propertyValues: [
          { key: 'Email|email', emailValue: expr('{{ ' + P + '.email }}') },
          { key: 'Estado|status', statusValue: 'Lead Huérfano' },
          { key: 'Fecha Captación|date', date: expr('{{ $now.toISODate() }}'), includeTime: false },
          { key: 'URL auditoría|url', urlValue: expr('{{ ' + P + '.url }}') },
          { key: 'Angulo|rich_text', textContent: expr('{{ ' + P + '.angulo }}') },
          { key: 'Hijo (auditoría)|rich_text', textContent: expr('{{ ' + P + '.hijo }}') },
          { key: 'Situación|rich_text', textContent: expr('{{ ' + P + '.situacion }}') },
          { key: 'Cómo reacciona|rich_text', textContent: expr('{{ ' + P + '.reaccion }}') },
          { key: 'Cómo se siente|rich_text', textContent: expr('{{ ' + P + '.despues }}') },
          { key: 'Qué cree que le pasa|rich_text', textContent: expr('{{ ' + P + '.cree }}') },
          { key: 'Relación|rich_text', textContent: expr('{{ ' + P + '.relacion }}') },
          { key: 'Qué cambiaría|rich_text', textContent: expr('{{ ' + P + '.deseo }}') }
        ]
      },
      simple: true,
      options: {}
    },
    credentials: { notionApi: { id: 'pT3cffg2cQZGSHOU', name: 'Notion Synesis' } }
  },
  output: [{ id: 'def456' }]
});

// ── Rama 2: generar y publicar la auditoría ──

const claude = node({
  type: '@n8n/n8n-nodes-langchain.anthropic',
  version: 1,
  config: {
    name: 'Claude Sonnet: escribir auditoría',
    retryOnFail: true,
    maxTries: 2,
    waitBetweenTries: 3000,
    parameters: {
      resource: 'text',
      operation: 'message',
      modelId: { __rl: true, mode: 'id', value: 'claude-sonnet-4-6' },
      messages: {
        values: [
          { role: 'user', content: expr('Ángulo de entrada: {{ $json.angulo }}. Datos del cuestionario. Hijo (P1): {{ $json.hijo }}. Situación que se repite (P2): {{ $json.situacion }}. Reacción del adulto (P3): {{ $json.reaccion }}. Cómo se siente después (P4): {{ $json.despues }}. Qué cree que pasa (P5): {{ $json.cree }}. Cómo describe la relación (P6): {{ $json.relacion }}. Qué es lo que más le preocupa a futuro (P7): {{ $json.deseo }}. Genera ahora el JSON de la auditoría siguiendo exactamente las instrucciones. El primer carácter debe ser la llave de apertura y el último la de cierre.') }
        ]
      },
      simplify: true,
      options: {
        maxTokens: 8000,
        system: __SYSTEM_PROMPT__
      }
    },
    credentials: { anthropicApi: { id: 'l7sqcc7bYYyZT5qC', name: 'Anthropic Synesis' } }
  },
  output: [{ content: [{ type: 'text', text: '{"nombre_hijo":"Lucía"}' }] }]
});

const montar = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Montar datos de la auditoría',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode:
        "const d = $('Preparar respuestas').item.json;\n" +
        "const r = $json;\n" +
        "let texto = '';\n" +
        "if (Array.isArray(r.content)) texto = r.content.map(function (c) { return c.text || ''; }).join('');\n" +
        "else if (typeof r.text === 'string') texto = r.text;\n" +
        "else if (typeof r.merged_response === 'string') texto = r.merged_response;\n" +
        "const m = texto.match(/\\{[\\s\\S]*\\}/);\n" +
        "if (!m) throw new Error('Claude no devolvió JSON para ' + d.id);\n" +
        "let ia;\n" +
        "try { ia = JSON.parse(m[0]); } catch (e) { throw new Error('JSON de Claude no válido para ' + d.id + ': ' + e.message); }\n" +
        "const CAMPOS = ['nombre_hijo','edad_hijo','s1_mensaje_padre','s1_pregunta_paloma','s2_conducta','s2_corazon_1','s2_corazon_2','s2_corazon_3','s3_bucle_hace','s3_bucle_pide','s3_bucle_lees','s3_bucle_aprende','s4_raiz_main','s4_raiz_sub','s4_edad9','s4_edad14','s4_edad30','s5_consecuencia','s7_benef_hijo','s7_benef_relacion','s7_benef_social'];\n" +
        "const datos = { v: 1, id: d.id, creado: new Date().toISOString(), angulo: d.angulo };\n" +
        "let vacios = 0;\n" +
        "CAMPOS.forEach(function (k) { const v = String(ia[k] == null ? '' : ia[k]).replace(/[\\r\\n]+/g, ' ').trim(); if (!v) vacios++; datos[k] = v; });\n" +
        "if (vacios > 3) throw new Error('Auditoría incompleta para ' + d.id + ' (' + vacios + ' campos vacíos)');\n" +
        "if (!datos.nombre_hijo) datos.nombre_hijo = 'tu peque';\n" +
        "return { json: { id: d.id, archivo: 'app.metodosynesis.com/auditoria/datos/' + d.id + '.json', contenido: JSON.stringify(datos) } };"
    }
  },
  output: [{ id: 'lucia-4-anos-1791130000000', archivo: 'app.metodosynesis.com/auditoria/datos/lucia-4-anos-1791130000000.json', contenido: '{}' }]
});

const publicar = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: {
    name: 'Publicar en el servidor',
    retryOnFail: true,
    maxTries: 3,
    waitBetweenTries: 2000,
    parameters: {
      method: 'POST',
      url: 'http://127.0.0.1:3100/__MCP_TOKEN__/mcp',
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: { parameters: [{ name: 'Accept', value: 'application/json, text/event-stream' }] },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr("{{ JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'escribir', arguments: { archivo: $json.archivo, contenido: $json.contenido } } }) }}"),
      options: { timeout: 20000 }
    }
  },
  output: [{ jsonrpc: '2.0', id: 1, result: { content: [{ type: 'text', text: 'Guardado' }] } }]
});

const comprobar = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Comprobar publicación',
    parameters: {
      mode: 'runOnceForEachItem',
      language: 'javaScript',
      jsCode:
        "const r = $json;\n" +
        "const txt = ((r.result && r.result.content) || []).map(function (c) { return c.text || ''; }).join(' ');\n" +
        "if (r.error || (r.result && r.result.isError)) throw new Error('No se pudo publicar la auditoría: ' + (txt || JSON.stringify(r.error)));\n" +
        "return { json: { ok: true, id: $('Montar datos de la auditoría').item.json.id, url: $('Preparar respuestas').item.json.url, servidor: txt } };"
    }
  },
  output: [{ ok: true, id: 'lucia-4-anos-1791130000000', url: 'https://app.metodosynesis.com/auditoria/?id=lucia-4-anos-1791130000000' }]
});

// ── Aviso si algo falla ──

const fallo = trigger({
  type: 'n8n-nodes-base.errorTrigger',
  version: 1,
  config: { name: 'Si falla la auditoría', parameters: {} },
  output: [{ execution: { id: '1', url: 'https://n8n.metodosynesis.com/', error: { message: 'Error' }, lastNodeExecuted: 'Claude' }, workflow: { id: 'x', name: 'Auditoría' } }]
});

const avisar = node({
  type: 'n8n-nodes-base.sendInBlue',
  version: 1,
  config: {
    name: 'Avisar a Paloma del fallo',
    parameters: {
      resource: 'email',
      operation: 'send',
      sendHTML: false,
      sender: 'palomarobles.crianza@gmail.com',
      receipients: 'palomarobles.crianza@gmail.com',
      subject: 'Una auditoría no se ha podido generar',
      textContent: expr('Alguien ha enviado el cuestionario pero su auditoría no se ha generado.\n\nPaso que falló: {{ $json.execution?.lastNodeExecuted }}\nError: {{ $json.execution?.error?.message }}\n\nLas respuestas están en su ficha de Notion (si dejó un email válido). Detalle técnico: {{ $json.execution?.url }}')
    },
    credentials: { sendInBlueApi: { id: '2MWUMDRskHFe3yBG', name: 'Brevo Synesis' } }
  }
});

const nota = sticky('## Auditoría\nCuestionario (app.metodosynesis.com/cuestionario/) → webhook → \n1) ficha en Notion: actualiza (o crea huérfana) con las respuestas y la URL de la auditoría.\n2) Claude Sonnet escribe los textos → se guardan en /auditoria/datos/<id>.json en el servidor → la página /auditoria/?id=<id> los muestra.\n\nSi algo falla, email a Paloma.\nWebhook: https://n8n.metodosynesis.com/webhook/auditoria', [], { color: 4 });

export default workflow('auditoria', 'Auditoría (cuestionario → análisis)')
  .add(cuestionario)
  .to(preparar)
  .to(soloValidos)
  .to(buscarLead)
  .to(existeFicha
    .onTrue(actualizarFicha)
    .onFalse(crearHuerfano))
  .add(soloValidos)
  .to(claude)
  .to(montar)
  .to(publicar)
  .to(comprobar)
  .add(fallo)
  .to(avisar)
  .add(nota);
