/* ═══════════════════════════════════════════════════════════════
   FERRO FRAGOSO — Wrapper de Analytics
   Envía eventos a GA4 (gtag) si está cargado; si no, solo registra
   en consola para no romper nada mientras no haya un ID real.

   Para activar en producción:
   1. Reemplaza GA4_MEASUREMENT_ID por el ID real (formato G-XXXXXXXXXX).
   2. Agrega el snippet de gtag.js de Google en el <head> de cada página
      (o vía Google Tag Manager) ANTES de este script.
   ═══════════════════════════════════════════════════════════════ */

const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← reemplazar con el ID real de GA4

function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    } else if (typeof window.plausible === 'function') {
        window.plausible(eventName, { props: params });
    } else if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
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
