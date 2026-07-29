/* ═══════════════════════════════════════════════════════════════════════════
   FERRO FRAGOSO — CATÁLOGO CANÓNICO DE SERVICIOS Y PRECIOS
   ═══════════════════════════════════════════════════════════════════════════

   POR QUÉ EXISTE ESTE ARCHIVO
   ---------------------------
   Los precios estaban escritos a mano en el HTML de cada página, más de 100
   veces. Eso produjo siete incoherencias reales (el mismo paquete cobrado
   "por clase" en una página y plano en cuatro, un servicio con tres nombres
   distintos, membresías sin precio anual, catálogos que no coincidían entre
   páginas). Corregirlas sin arreglar la arquitectura garantizaba que
   volvieran en la siguiente actualización de precios.

   Este archivo es la ÚNICA fuente de verdad. Cambiar un precio aquí y
   ejecutar la validación dice exactamente qué páginas quedaron desalineadas.

   LOS PRECIOS SIGUEN EN EL HTML A PROPÓSITO
   -----------------------------------------
   No se pintan desde aquí. Google necesita leer el precio en el HTML servido,
   y renderizarlo por JS lo haría aparecer con retardo. Así que el HTML sigue
   siendo lo que se sirve, y este catálogo GOBIERNA y AUDITA.
   El validador de abajo compara ambos y avisa cuando divergen.

   CÓMO CONECTAR LAS LÍNEAS DE COBRO
   ---------------------------------
   Cuando existan los links de pago, se pegan en el campo `pago` de cada
   servicio. Nada más. Los CTA los leen de aquí, así que no hay que tocar
   ninguna página. Hoy están vacíos y el sitio sigue funcionando igual.

   REGLAS QUE ESTE CATÁLOGO IMPONE
   -------------------------------
   · `precio`      importe en MXN, entero, sin separadores.
   · `desde`       true cuando el precio es un piso y no un cerrado.
   · `unidad`      texto que acompaña al importe ("MXN", "MXN / CLASE", ...).
   · `publico`     'personas' | 'negocios' | 'ambos'  → gobierna en qué
                   página aparece, pero NUNCA cambia nombre ni precio.
   · `pago`        URL de la línea de cobro. Vacío = aún no cobrable en línea.
   ═══════════════════════════════════════════════════════════════════════════ */

const FF_MONEDA = 'MXN';

/* ── Servicios a la carta ─────────────────────────────────────────────────
   Un servicio = una entrada. Si aparece en tres páginas, sigue siendo una
   entrada: son las páginas las que lo referencian por `id`.                */
const FF_SERVICIOS = {

  /* — Entrada sin costo: califica antes de cobrar — */
  llamada_filtro: {
    nombre: 'Llamada de filtro · 10–15 min',
    precio: 0, unidad: 'SIN COSTO', desde: false, publico: 'ambos',
    nota: 'Gratis. Sirve para decir si tu caso aplica y cuánto costaría.',
    pago: '',
  },

  /* — Contratos — */
  revision_simple: {
    nombre: 'Revisión de contrato simple',
    precio: 490, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Hasta 10 páginas. Entrega en 24–48 h hábiles.',
    pago: '',
  },
  revision_intermedia: {
    nombre: 'Revisión de contrato intermedia',
    precio: 990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'De 11 a 25 páginas, con recomendaciones priorizadas.',
    pago: '',
  },
  revision_estrategica: {
    nombre: 'Revisión estratégica',
    precio: 1990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Contrato complejo. Incluye postura de negociación.',
    pago: '',
  },
  /* Modificador, no servicio: se suma al precio de cualquier revisión. */
  expres_24h: {
    nombre: 'Entrega exprés 24 h',
    precio: 300, unidad: 'MXN', desde: false, publico: 'ambos',
    modificador: true,
    nota: 'Costo adicional sobre cualquier revisión.',
    pago: '',
  },
  contrato_medida: {
    /* Se llamaba "Documento a tu medida", "Contrato personalizado desde cero"
       y "Redacción a Medida" según la página. Un solo nombre desde ahora. */
    nombre: 'Contrato a tu medida',
    precio: 1990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Redactado desde cero: cuestionario, redacción y una ronda de ajustes.',
    pago: '',
  },

  /* — Asesoría — */
  consulta_particular: {
    nombre: 'Consulta estratégica · 60 min',
    precio: 1290, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Videollamada con un socio. Sales con un plan por escrito.',
    pago: '',
  },
  diagnostico_negocio: {
    nombre: 'Diagnóstico legal empresarial',
    precio: 1490, unidad: 'MXN', desde: false, publico: 'negocios',
    nota: 'Sesión de diagnóstico para empresa, con prioridades por escrito.',
    pago: '',
  },

  /* — Propiedad intelectual — */
  busqueda_fonetica: {
    nombre: 'Búsqueda fonética de marca',
    precio: 490, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Verifica obstáculos por nombres similares antes de invertir en el registro.',
    pago: '',
  },
  registro_marca: {
    nombre: 'Registro de marca ante IMPI',
    precio: 6990, unidad: 'MXN / CLASE', desde: false, publico: 'ambos',
    nota: 'Búsqueda, clasificación, solicitud, derechos oficiales y seguimiento.',
    pago: '',
  },
  derecho_autor: {
    nombre: 'Registro de obra · derecho de autor',
    precio: 2490, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Registro de tu obra ante el INDAUTOR.',
    pago: '',
  },
  marca_autor: {
    /* Precio PLANO: cubre una clase de marca más el registro de obra.
       plan.html lo publicaba "/ CLASE", lo cual no aplica: el derecho de
       autor no se registra por clases de Niza. Corregido. */
    nombre: 'Marca + Derecho de autor',
    precio: 8990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Paquete: una clase de marca ante IMPI + registro de obra. Clases adicionales se cotizan aparte.',
    pago: '',
  },
  obra_cesion: {
    nombre: 'Registro de obra + cesión de derechos',
    precio: 3990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Para software, contenido o diseño hecho por terceros: registro y cesión a tu favor.',
    pago: '',
  },

  /* — Empresa y cumplimiento — */
  reporte_riesgo: {
    nombre: 'Reporte de Riesgo Contractual',
    precio: 3990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Auditoría de tus contratos vigentes: dónde estás expuesto y qué corregir primero.',
    pago: '',
  },
  constitucion: {
    nombre: 'Constitución de empresa',
    precio: 9900, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'S.A. o S. de R.L. lista para operar: estatutos, acta, RFC y trámites base.',
    pago: '',
  },
  acuerdo_socios: {
    nombre: 'Acuerdo de socios / fundadores',
    precio: 6990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Reparto de acciones, vesting y reglas entre socios.',
    pago: '',
  },
  safe_termsheet: {
    nombre: 'Revisión de SAFE / term sheet',
    precio: 4990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Antes de firmar con un inversionista: protege tu control y tu dilución.',
    pago: '',
  },
  aviso_privacidad: {
    nombre: 'Aviso de privacidad + LFPDPPP',
    precio: 3990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Aviso de privacidad y cumplimiento de protección de datos para sitio y app.',
    pago: '',
  },
  terminos_plataforma: {
    nombre: 'Términos y condiciones de plataforma',
    precio: 3990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Para SaaS, marketplace o app: reglas de uso que te protegen frente al usuario.',
    pago: '',
  },
};

/* ── Membresías ───────────────────────────────────────────────────────────
   El anual es SIEMPRE mensual × 10 → equivale a los "2 meses gratis" que
   promete el copy. Antes los planes de negocio decían "o anual" sin cifra,
   así que quien quería pagar el año no sabía cuánto era.                   */
const FF_MESES_ANUAL = 10;

const FF_MEMBRESIAS = {
  /* Personas */
  tranquilidad:         { nombre: 'Tranquilidad',         mensual: 199,  publico: 'personas', pago: '', pagoAnual: '' },
  familia:              { nombre: 'Familia',              mensual: 399,  publico: 'personas', pago: '', pagoAnual: '' },
  patrimonio:           { nombre: 'Patrimonio',           mensual: 699,  publico: 'personas', pago: '', pagoAnual: '' },
  /* Negocios */
  contratos_esenciales: { nombre: 'Contratos Esenciales', mensual: 1990, publico: 'negocios', pago: '', pagoAnual: '' },
  direccion_ligera:     { nombre: 'Dirección Ligera',     mensual: 3990, publico: 'negocios', pago: '', pagoAnual: '' },
  direccion_externa:    { nombre: 'Dirección Externa',    mensual: 6990, publico: 'negocios', desde: true, pago: '', pagoAnual: '' },
};

/* Precio anual derivado, nunca escrito a mano. */
function ffAnual(idMembresia) {
  const m = FF_MEMBRESIAS[idMembresia];
  return m ? m.mensual * FF_MESES_ANUAL : null;
}

/* ── Formato ──────────────────────────────────────────────────────────────
   Un solo formateador para que "$6,990" se escriba igual en todo el sitio. */
function ffPrecio(n) {
  return '$' + Number(n).toLocaleString('es-MX', { maximumFractionDigits: 0 });
}

/* Etiqueta completa tal como debe aparecer, incluido el "desde". */
function ffEtiqueta(idServicio) {
  const s = FF_SERVICIOS[idServicio];
  if (!s) return null;
  if (s.precio === 0) return 'Gratis';
  return (s.desde ? 'desde ' : '') + ffPrecio(s.precio);
}

/* ── Línea de cobro ───────────────────────────────────────────────────────
   Único punto donde se resuelve si algo es pagable en línea. Mientras `pago`
   esté vacío, devuelve null y el CTA conserva el destino que tenga en el
   HTML: así se puede ir conectando producto por producto sin romper nada. */
function ffLinkPago(idServicio) {
  const s = FF_SERVICIOS[idServicio] || FF_MEMBRESIAS[idServicio];
  return s && s.pago ? s.pago : null;
}

function ffCobrables() {
  const todos = { ...FF_SERVICIOS, ...FF_MEMBRESIAS };
  return Object.keys(todos).filter((k) => todos[k].pago);
}

/* ── Validador de coherencia ──────────────────────────────────────────────
   Recorre el HTML de la página y compara cada importe visible contra el
   catálogo. Reporta:
     · precios que no corresponden a ningún servicio (posible dato viejo)
     · servicios cuyo nombre aparece con un importe distinto al canónico
   Solo informa por consola; nunca modifica la página. Se ejecuta en local
   para no gastar ciclos en producción. */
function ffValidarPrecios({ verboso = false } = {}) {
  const local = ['localhost', '127.0.0.1', ''].includes(location.hostname)
    || location.protocol === 'file:';
  if (!local && !verboso) return null;

  const catalogo = { ...FF_SERVICIOS };
  const importes = new Set(Object.values(catalogo).map((s) => s.precio).filter((p) => p > 0));
  Object.keys(FF_MEMBRESIAS).forEach((k) => {
    importes.add(FF_MEMBRESIAS[k].mensual);
    importes.add(ffAnual(k));
  });

  /* textContent, NO innerText: innerText solo devuelve lo que está renderizado.
     En marcas.html daba 1.785 caracteres contra 9.340 reales — el validador
     quedaba ciego al 80% de la página (acordeones cerrados, secciones fuera
     de vista) y por eso reportaba "coherente" sin haber mirado los precios. */
  const bruto = document.body ? document.body.textContent : '';
  const texto = bruto.replace(/\s+/g, ' ');
  const encontrados = [...texto.matchAll(/\$\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,6})(?!\s*[.,]\d)/g)]
    .map((m) => Number(m[1].replace(/,/g, '')));

  const huerfanos = [...new Set(encontrados)].filter((n) => !importes.has(n));

  /* Nombre canónico presente pero con otro importe cerca */
  const desalineados = [];
  Object.entries(catalogo).forEach(([id, s]) => {
    const i = texto.indexOf(s.nombre);
    if (i === -1) return;
    const cerca = texto.slice(i, i + 220);
    const m = cerca.match(/\$\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,6})/);
    if (m && Number(m[1].replace(/,/g, '')) !== s.precio) {
      desalineados.push(`${id}: la página dice $${m[1]}, el catálogo dice ${ffPrecio(s.precio)}`);
    }
  });

  const informe = { pagina: location.pathname, huerfanos, desalineados };
  if (huerfanos.length || desalineados.length) {
    console.warn('[precios] Incoherencias detectadas en', location.pathname);
    if (desalineados.length) console.warn('  desalineados:', desalineados);
    if (huerfanos.length) console.warn('  importes sin servicio en el catálogo:', huerfanos);
  } else if (verboso) {
    console.info('[precios] Coherente:', location.pathname);
  }
  return informe;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => ffValidarPrecios());
}

if (typeof window !== 'undefined') {
  Object.assign(window, {
    FF_MONEDA, FF_SERVICIOS, FF_MEMBRESIAS, FF_MESES_ANUAL,
    ffAnual, ffPrecio, ffEtiqueta, ffLinkPago, ffCobrables, ffValidarPrecios,
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    FF_MONEDA, FF_SERVICIOS, FF_MEMBRESIAS, FF_MESES_ANUAL,
    ffAnual, ffPrecio, ffEtiqueta, ffLinkPago, ffCobrables,
  };
}
