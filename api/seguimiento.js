// ═══════════════════════════════════════════════════════════════════════
// /api/seguimiento — Consulta de estatus de trámite (por folio + contacto)
// ═══════════════════════════════════════════════════════════════════════
//
// Qué hace: recibe { folio, contacto } desde seguimiento.html, busca el
// expediente en Notion y regresa SOLO los campos que un cliente debe ver
// (nunca el objeto crudo de Notion, que podría traer notas internas del
// despacho). El token de Notion vive únicamente aquí, en el servidor —
// jamás llega al navegador.
//
// ─── Configuración requerida (Vercel → Project Settings → Environment
//     Variables; en local usa un archivo .env con `vercel dev`) ───
//   NOTION_TOKEN        Secreto de una integración interna de Notion
//                        (notion.so/my-integrations → "+ New integration").
//   NOTION_DATABASE_ID  El ID de la base de datos de expedientes (se ve en
//                        la URL de la base: notion.so/xxxxx?v=... → el
//                        "xxxxx" de 32 caracteres es el ID).
//
// No olvides compartir la base de datos con la integración desde Notion:
// abre la base → "···" (arriba a la derecha) → "Conexiones" → agrega tu
// integración. Si no la compartes, la API responde "objeto no encontrado"
// aunque el token y el ID estén bien.
//
// ─── Columnas esperadas en tu base de Notion ───
// Si tus columnas ya existen con otros nombres, solo edita el objeto PROPS
// de abajo — no hace falta tocar el resto del archivo.
const PROPS = {
    folio: 'Folio',                       // Título de la base (title)
    email: 'Correo',                      // Tipo "Correo electrónico" (email)
    telefono: 'Teléfono',                 // Tipo "Teléfono" (phone_number)
    servicio: 'Servicio',                 // Selección o texto (select / rich_text)
    etapa: 'Etapa',                       // Selección (select) — ver STAGES abajo
    proximoPaso: 'Próximo paso',          // Texto (rich_text)
    notaPublica: 'Nota para el cliente',  // Texto (rich_text) — opcional, se muestra tal cual
    actualizado: 'Última actualización',  // Fecha (date) — opcional, si no existe se usa
                                           // la fecha de última edición de la página en Notion
};

// Etapas reconocidas, en orden, para dibujar el avance en la página.
// El texto de "Etapa" en Notion debe coincidir EXACTO con alguno de estos
// (si no coincide, igual se muestra el texto, solo que sin marcar avance).
const STAGES = [
    'Recibido',
    'En revisión',
    'En proceso',
    'Esperando información del cliente',
    'Completado',
];

const NOTION_VERSION = '2022-06-28';
const MAX_FIELD_LEN = 60;

// Límite de intentos muy simple, en memoria del proceso. Como cada función
// serverless puede correr en varias instancias, esto NO es un límite
// exacto ni a prueba de balas — es una primera barrera contra scripts
// obvios. Si esto crece en tráfico real, conviene mover el límite a un
// almacén compartido (p. ej. Vercel KV / Upstash) por IP.
const intentos = new Map();
const VENTANA_MS = 10 * 60 * 1000; // 10 minutos
const MAX_INTENTOS = 8;

function limitado(ip) {
    const ahora = Date.now();
    const registro = intentos.get(ip);
    if (!registro || ahora - registro.desde > VENTANA_MS) {
        intentos.set(ip, { desde: ahora, cuenta: 1 });
        return false;
    }
    registro.cuenta += 1;
    return registro.cuenta > MAX_INTENTOS;
}

// Limpieza ocasional para no acumular memoria indefinidamente.
function limpiarIntentosViejos() {
    const ahora = Date.now();
    for (const [ip, registro] of intentos) {
        if (ahora - registro.desde > VENTANA_MS) intentos.delete(ip);
    }
}

function textoPlano(prop) {
    if (!prop) return '';
    if (prop.type === 'rich_text') return prop.rich_text.map(t => t.plain_text).join('').trim();
    if (prop.type === 'title') return prop.title.map(t => t.plain_text).join('').trim();
    if (prop.type === 'select') return prop.select ? prop.select.name : '';
    if (prop.type === 'email') return prop.email || '';
    if (prop.type === 'phone_number') return prop.phone_number || '';
    if (prop.type === 'date') return prop.date ? prop.date.start : '';
    return '';
}

function soloDigitos(str) {
    return String(str || '').replace(/\D/g, '');
}

function normalizado(str) {
    return String(str || '').trim().toLowerCase();
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Método no permitido.' });
    }

    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!token || !databaseId) {
        console.error('Faltan NOTION_TOKEN o NOTION_DATABASE_ID en las variables de entorno.');
        return res.status(500).json({ ok: false, error: 'El servicio de seguimiento no está configurado todavía.' });
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'desconocida').split(',')[0].trim();
    limpiarIntentosViejos();
    if (limitado(ip)) {
        return res.status(429).json({ ok: false, error: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' });
    }

    const body = req.body || {};
    const folio = typeof body.folio === 'string' ? body.folio.trim() : '';
    const contacto = typeof body.contacto === 'string' ? body.contacto.trim() : '';
    const honeypot = typeof body.sitio_web === 'string' ? body.sitio_web.trim() : '';

    // Campo trampa: un humano nunca lo llena, un bot que autocompleta
    // formularios sí. Si viene lleno, respondemos "no encontrado" genérico
    // sin revelar que fue detectado como bot.
    if (honeypot) {
        return res.status(200).json({ ok: false, notFound: true });
    }

    if (!folio || folio.length > MAX_FIELD_LEN || !contacto || contacto.length > MAX_FIELD_LEN) {
        return res.status(400).json({ ok: false, error: 'Captura tu folio y tu correo o teléfono de contacto.' });
    }

    try {
        const resp = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filter: {
                    property: PROPS.folio,
                    title: { equals: folio },
                },
                page_size: 1,
            }),
        });

        if (!resp.ok) {
            const detalle = await resp.text().catch(() => '');
            console.error('Notion respondió con error:', resp.status, detalle);
            return res.status(502).json({ ok: false, error: 'No pudimos consultar el estatus en este momento. Intenta de nuevo en unos minutos.' });
        }

        const data = await resp.json();
        const pagina = data.results && data.results[0];

        // Mismo mensaje genérico si no existe el folio o si el contacto no
        // coincide: así nadie puede usar este formulario para "adivinar"
        // folios válidos ni para confirmar el correo/teléfono de otra persona.
        const noEncontrado = () => res.status(200).json({ ok: false, notFound: true });

        if (!pagina) return noEncontrado();

        const props = pagina.properties;
        const emailGuardado = normalizado(textoPlano(props[PROPS.email]));
        const telGuardado = soloDigitos(textoPlano(props[PROPS.telefono]));

        const contactoEsCorreo = contacto.includes('@');
        const coincide = contactoEsCorreo
            ? emailGuardado && emailGuardado === normalizado(contacto)
            : telGuardado && telGuardado === soloDigitos(contacto);

        if (!coincide) return noEncontrado();

        const etapa = textoPlano(props[PROPS.etapa]);
        const actualizadoProp = textoPlano(props[PROPS.actualizado]);

        return res.status(200).json({
            ok: true,
            folio: textoPlano(props[PROPS.folio]) || folio,
            servicio: textoPlano(props[PROPS.servicio]),
            etapa,
            etapaIndex: STAGES.indexOf(etapa), // -1 si la etapa no está en la lista conocida
            etapas: STAGES,
            proximoPaso: textoPlano(props[PROPS.proximoPaso]),
            notaPublica: textoPlano(props[PROPS.notaPublica]),
            actualizado: actualizadoProp || pagina.last_edited_time || null,
        });
    } catch (err) {
        console.error('Error consultando seguimiento:', err);
        return res.status(500).json({ ok: false, error: 'No pudimos consultar el estatus en este momento. Intenta de nuevo en unos minutos.' });
    }
}
