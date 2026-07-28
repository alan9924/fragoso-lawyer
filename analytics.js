/* ═══════════════════════════════════════════════════════════════
   FERRO FRAGOSO — Wrapper de Analytics

   PARA ACTIVAR: sustituye la línea GA4_MEASUREMENT_ID de abajo por el
   ID real (formato G-XXXXXXXXXX). Eso es todo — este archivo carga
   gtag.js por su cuenta, no hay que tocar ningún HTML.

   Mientras el ID sea el placeholder, el sitio no carga nada de Google
   y no se envía ni un byte a terceros.
   ═══════════════════════════════════════════════════════════════ */

const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← reemplazar con el ID real de GA4

// Ojo: el placeholder 'G-XXXXXXXXXX' cumple el patrón de un ID real (la X es
// una letra válida), así que hay que descartarlo de forma explícita. Sin esto,
// publicar sin configurar cargaría gtag.js contra una propiedad inexistente
// y el aviso de "sin configurar" nunca aparecería.
const GA4_PLACEHOLDER = 'G-XXXXXXXXXX';
const GA4_ID_VALIDO = GA4_MEASUREMENT_ID !== GA4_PLACEHOLDER
    && /^G-[A-Z0-9]{6,}$/.test(GA4_MEASUREMENT_ID);
const ES_ENTORNO_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname)
    || window.location.protocol === 'file:';

/* ── Carga de gtag.js ──
   Antes, este wrapper asumía que alguien más había insertado el snippet de
   Google en el <head> de cada página. Nunca se insertó en ninguna de las 19,
   así que todos los eventos se perdían en silencio. Ahora el propio wrapper
   lo carga: la activación es una sola línea y no puede volver a desincronizarse. */
(function cargarGA4() {
    if (!GA4_ID_VALIDO || ES_ENTORNO_LOCAL) return;
    if (document.querySelector('script[data-ff-ga4]')) return;

    window.dataLayer = window.dataLayer || [];
    // gtag debe usar `arguments`: GA4 espera los argumentos crudos, no un array.
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID);

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`;
    s.setAttribute('data-ff-ga4', '');
    document.head.appendChild(s);
})();

/* Aviso único en consola si se publica sin configurar, para que la falta de
   datos se note de inmediato en vez de descubrirse meses después. */
if (!GA4_ID_VALIDO && !ES_ENTORNO_LOCAL && !window.__ffAnalyticsAvisado) {
    window.__ffAnalyticsAvisado = true;
    console.warn('[analytics] GA4 sin configurar: no se está registrando ninguna conversión. Define GA4_MEASUREMENT_ID en analytics.js.');
}

function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    } else if (typeof window.plausible === 'function') {
        window.plausible(eventName, { props: params });
    } else if (ES_ENTORNO_LOCAL) {
        console.info('[analytics:pendiente-de-conectar]', eventName, params);
    }
}

/* ── Auto-instrumentación de eventos comunes ── */
document.addEventListener('DOMContentLoaded', () => {
    // view_producto: se dispara una vez al cargar una página marcada como producto
    const productMeta = document.querySelector('meta[name="ff-producto"]');
    if (productMeta) {
        trackEvent('view_producto', { producto: productMeta.content, pagina: location.pathname });
    }

    // click_pago: cualquier CTA de pago (real o placeholder data-mp-link, o WhatsApp de venta)
    document.querySelectorAll('[data-mp-link], [data-track-pago]').forEach((el) => {
        el.addEventListener('click', () => {
            trackEvent('click_pago', {
                producto: el.getAttribute('data-producto') || el.getAttribute('data-track-pago') || 'desconocido',
                ref: document.querySelector('meta[name="ff-pagina-ref"]')?.content || location.pathname,
            });
        });
    });

    // wa_click: cualquier link a WhatsApp (wa.me)
    document.querySelectorAll('a[href*="wa.me"]').forEach((el) => {
        el.addEventListener('click', () => {
            trackEvent('wa_click', { pagina: location.pathname });
        });
    });
});
