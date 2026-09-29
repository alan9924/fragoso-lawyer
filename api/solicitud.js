// ═══════════════════════════════════════════════════════════════════════
// /api/solicitud — Punto único de entrada para pedir cualquier servicio
// ═══════════════════════════════════════════════════════════════════════
//
// Reemplaza a WhatsApp como destino de "elegir un producto" en todo el
// sitio: el cliente elige cualquier servicio o membresía del catálogo,
// deja sus datos y cuenta su caso en texto libre; esta función genera un
// folio, crea el expediente en la MISMA base de Notion que usa
// /api/seguimiento (así el folio es consultable de inmediato en
// seguimiento.html) y regresa el link de pago si ya existe en el catálogo.
//
// Antes esto solo aceptaba 3 productos "sin intake" (el resto seguía
// yendo a WhatsApp). Ya no hay esa distinción: el campo "Cuéntanos tu
// caso" es el mismo lugar donde antes se escribía el mensaje de WhatsApp
// — la información que antes recibía un abogado por chat ahora llega
// igual, solo que con folio y seguimiento desde el primer momento.
//
// Usa la MISMA configuración que api/seguimiento.js — NOTION_TOKEN y
// NOTION_DATABASE_ID. Si ya seguiste SEGUIMIENTO-SETUP.md no hay nada nuevo
// que configurar en Notion salvo dos columnas adicionales (ver abajo).
//
// ─── Columnas de Notion que usa ADEMÁS de las de seguimiento.js ───
//   Nombre               Texto (rich_text) — quién solicita.
//   Detalle del cliente  Texto (rich_text) — lo que escribió en el
//                        formulario. NUNCA se expone de vuelta al público:
//                        /api/seguimiento no la incluye en su respuesta.
// Si tus columnas se llaman distinto, ajusta PROPS abajo (debe coincidir
// con el mismo nombre de columna que uses en Notion, igual que en
// api/seguimiento.js — no hace falta que los dos archivos usen literalmente
// el mismo objeto, solo apuntar a las mismas columnas reales).
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const catalogo = require('../precios.js');

const PROPS = {
    folio: 'Folio',
    email: 'Correo',
    telefono: 'Teléfono',
    servicio: 'Servicio',
    etapa: 'Etapa',
    proximoPaso: 'Próximo paso',
    nombre: 'Nombre',
    detalle: 'Detalle del cliente',
};

const NOTION_VERSION = '2022-06-28';
// El "detalle" es el único campo largo. Puede traer el resumen completo de
// un cuestionario de varios pasos (ver WIZARDS en solicitud.html), no solo
// una frase — 1900 deja margen bajo el límite de 2000 caracteres que Notion
// acepta por bloque de rich_text.
const MAX_FIELD_LEN = 1900;
const MAX_FIELD_CORTO = 120;

// Ids que nunca deben poder solicitarse aquí. Los modificadores ("envío
// certificado", "exprés 24 h") se excluyen solos por su bandera. La llamada
// de filtro gratuita SÍ se acepta desde 2026-09-03: es el primer peldaño del
// embudo (index.html → "Cuéntanos tu caso") y conviene que nazca con folio.
// Las entradas `legacy` del catálogo tampoco se aceptan: ya no se venden.
const EXCLUIDOS = [];

const intentos = new Map();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 6; // más bajo que en seguimiento: esto además escribe datos

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

function limpiarIntentosViejos() {
    const ahora = Date.now();
    for (const [ip, registro] of intentos) {
        if (ahora - registro.desde > VENTANA_MS) intentos.delete(ip);
    }
}

function folioNuevo() {
    const anio = new Date().getFullYear();
    // Base36 del timestamp + 3 caracteres al azar: no es secuencial (no hay
    // base de datos propia para llevar un contador), pero la probabilidad
    // de choque es despreciable para el volumen de un despacho. Si algún
    // día importa la secuencia exacta, hay que mover esto a un contador
    // real (Vercel KV / la propia Notion).
    const t = Date.now().toString(36).toUpperCase().slice(-5);
    const r = Math.random().toString(36).toUpperCase().slice(2, 5);
    return `FF-${anio}-${t}${r}`;
}

function normalizado(str) {
    return String(str || '').trim();
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
        return res.status(500).json({ ok: false, error: 'El servicio de solicitudes no está configurado todavía.' });
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'desconocida').split(',')[0].trim();
    limpiarIntentosViejos();
    if (limitado(ip)) {
        return res.status(429).json({ ok: false, error: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' });
    }

    const body = req.body || {};
    const servicioId = normalizado(body.servicio);
    const nombre = normalizado(body.nombre);
    const contacto = normalizado(body.correo);
    const telefono = normalizado(body.telefono);
    const detalle = normalizado(body.detalle);
    const honeypot = normalizado(body.sitio_web);

    if (honeypot) {
        // Igual que en seguimiento: no delatamos que se detectó un bot.
        return res.status(200).json({ ok: true, folio: folioNuevo(), _simulado: true });
    }

    if (!nombre || nombre.length > MAX_FIELD_CORTO) {
        return res.status(400).json({ ok: false, error: 'Captura tu nombre.' });
    }
    if (!contacto || contacto.length > MAX_FIELD_CORTO || !contacto.includes('@')) {
        return res.status(400).json({ ok: false, error: 'Captura un correo válido.' });
    }
    if (telefono.length > MAX_FIELD_CORTO || detalle.length > MAX_FIELD_LEN) {
        return res.status(400).json({ ok: false, error: 'Uno de los campos es demasiado largo.' });
    }

    if (!catalogo || !catalogo.FF_SERVICIOS) {
        console.error('El catálogo de precios.js no está disponible.');
        return res.status(500).json({ ok: false, error: 'No pudimos procesar tu solicitud. Intenta de nuevo en unos minutos.' });
    }

    // Cualquier id real del catálogo sirve — servicio a la carta o
    // membresía — salvo modificadores (no son un producto en sí, son un
    // extra sobre otro) y los excluidos explícitos de arriba.
    const esMembresia = !catalogo.FF_SERVICIOS[servicioId] && !!catalogo.FF_MEMBRESIAS[servicioId];
    const servicioCrudo = catalogo.FF_SERVICIOS[servicioId] || catalogo.FF_MEMBRESIAS[servicioId];
    if (!servicioCrudo || servicioCrudo.modificador || servicioCrudo.legacy || EXCLUIDOS.includes(servicioId)) {
        return res.status(400).json({ ok: false, error: 'Ese producto no está disponible para solicitarse así. Elige otro de la lista.' });
    }
    const servicio = esMembresia
        ? { nombre: servicioCrudo.nombre, precio: servicioCrudo.mensual, unidad: 'MXN / mes', pago: servicioCrudo.pago }
        : servicioCrudo;

    const folio = folioNuevo();

    try {
        const resp = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Notion-Version': NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent: { database_id: databaseId },
                properties: {
                    [PROPS.folio]: { title: [{ text: { content: folio } }] },
                    [PROPS.servicio]: { rich_text: [{ text: { content: servicio.nombre } }] },
                    [PROPS.etapa]: { select: { name: 'Recibido' } },
                    [PROPS.email]: { email: contacto },
                    ...(telefono ? { [PROPS.telefono]: { phone_number: telefono } } : {}),
                    [PROPS.nombre]: { rich_text: [{ text: { content: nombre } }] },
                    ...(detalle ? { [PROPS.detalle]: { rich_text: [{ text: { content: detalle } }] } } : {}),
                    [PROPS.proximoPaso]: { rich_text: [{ text: { content: (catalogo.FF_REQUISITOS && catalogo.FF_REQUISITOS[servicioId] && catalogo.FF_REQUISITOS[servicioId].plazo)
                        ? 'Un abogado revisará tu solicitud y te contactará en 24 h hábiles. ' + catalogo.FF_REQUISITOS[servicioId].plazo
                        : 'Un abogado revisará tu solicitud y te contactará en 24–48 h hábiles.' } }] },
                },
            }),
        });

        if (!resp.ok) {
            const detalleError = await resp.text().catch(() => '');
            console.error('Notion respondió con error al crear la solicitud:', resp.status, detalleError);
            return res.status(502).json({ ok: false, error: 'No pudimos registrar tu solicitud en este momento. Intenta de nuevo en unos minutos.' });
        }

        return res.status(200).json({
            ok: true,
            folio,
            servicio: servicio.nombre,
            precio: servicio.precio,
            unidad: servicio.unidad,
            pago: servicio.pago || null,
        });
    } catch (err) {
        console.error('Error creando solicitud:', err);
        return res.status(500).json({ ok: false, error: 'No pudimos registrar tu solicitud en este momento. Intenta de nuevo en unos minutos.' });
    }
}
