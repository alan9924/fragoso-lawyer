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
   · `legacy`      true en entradas que ya no se venden pero algo viejo puede
                   referenciar: no aparecen en el selector de solicitud.html.
   · FF_REQUISITOS qué debe tener a la mano el cliente por trámite y el plazo
                   de entrega; lo pinta solicitud.html al elegir servicio.
   ═══════════════════════════════════════════════════════════════════════════ */

const FF_MONEDA = 'MXN';

/* ── Tarifas oficiales de terceros ───────────────────────────────────────
   El IMPI y el INDAUTOR publican su tarifario en el DOF cada enero. Estas
   cifras se cotejan cada año antes de desplegar: publicar una tarifa
   gubernamental equivocada en el sitio de un despacho expone a un reclamo,
   tanto si se queda corta (el cliente paga más de lo anunciado) como si se
   pasa (parece que se infla un cobro de gobierno).

   Se separa del honorario a propósito. Con el precio "todo incluido" cada
   aumento del IMPI se comía el margen en silencio y no se podía subir el
   precio sin que pareciera un aumento de honorarios. Desglosado, la tarifa es
   un tercero: sube cuando sube el DOF y el cliente lo entiende.            */
const FF_TARIFAS_OFICIALES = {
  impi_marca_por_clase: {
    importe: 3126.40,       // 2,695.18 + IVA = 3,126.41 (tarifario IMPI 2026, trámite presencial)
    concepto: 'Derechos IMPI · solicitud de registro de marca, por clase',
    /* Contrastado el 2026-09-03 contra tres fuentes secundarias del tarifario
       2026 (todas coinciden en 3,126.41 con IVA). Sigue pendiente cotejar
       contra el DOF/portal IMPI antes de cada enero: la cifra cambia cada año.
       OPORTUNIDAD: por "Marca en Línea" la misma solicitud cuesta 2,813.77 con
       IVA (~$312 menos por clase). Si el despacho presenta en línea, ese
       diferencial es margen adicional sin tocar el precio al cliente. */
    verificado: true,
    fuente: 'gob.mx/IMPI · tarifario de derechos 2026',
  },
  indautor_registro_obra: {
    importe: 367,           // Derechos por registro de obra, tarifa 2026 (más $17 de cotejo)
    concepto: 'Derechos INDAUTOR · registro de obra',
    verificado: true,
    fuente: 'indautor.gob.mx · costos de trámites y servicios 2026',
  },
};

/* Honorario = precio al cliente − tarifa oficial. Nunca escrito a mano, para
   que al ajustar la tarifa el desglose siga cuadrando con el total. */
function ffDesglose(idServicio) {
  const s = FF_SERVICIOS[idServicio];
  if (!s || !s.tarifaOficial) return null;
  const t = FF_TARIFAS_OFICIALES[s.tarifaOficial];
  if (!t) return null;
  return {
    total: s.precio,
    honorarios: s.precio - t.importe,
    oficiales: t.importe,
    concepto: t.concepto,
    verificado: t.verificado,
  };
}

/* ── Servicios a la carta ─────────────────────────────────────────────────
   Un servicio = una entrada. Si aparece en tres páginas, sigue siendo una
   entrada: son las páginas las que lo referencian por `id`.                */
const FF_SERVICIOS = {

  /* — Entrada sin costo: califica antes de cobrar — */
  llamada_filtro: {
    nombre: 'Orientación · 15 min',
    precio: 0, unidad: 'SIN COSTO', desde: false, publico: 'ambos',
    nota: 'Para quien no sabe si tiene caso: te decimos qué servicio necesitas. Recomendación verbal, sin crédito aplicable.',
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
  /* Escalera de asesoría en tres peldaños, de menor a mayor compromiso:
       llamada_filtro (gratis, 15 min) → consulta_legal (45 min) →
       consulta_particular (60 min, con plan por escrito).
     consulta_legal vivía solo en index.html ($790) sin entrada aquí, así que
     el validador no la vigilaba (790 = 490 + 300 caía en el hueco conocido). */
  consulta_legal: {
    nombre: 'Revisión de expediente o contratos · 45 min',
    precio: 790, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Revisamos tus documentos y te decimos tus opciones. Resumen de una página por correo en 24 h. Los $790 se aplican a otro servicio si contratas en 7 días.',
    credito: 790, creditoDias: 7,
    excluye: 'No incluye plan por escrito; para eso está la estrategia legal.',
    pago: '',
  },
  consulta_particular: {
    nombre: 'Estrategia legal · 60 min',
    precio: 1490, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Para quien necesita saber exactamente qué hacer. Sales con un plan de 3 a 5 páginas en 48 h. $1,000 se aplican a otro servicio si contratas en 14 días.',
    credito: 1000, creditoDias: 14,
    pago: '',
  },
  diagnostico_negocio: {
    nombre: 'Diagnóstico legal empresarial',
    precio: 1490, unidad: 'MXN', desde: false, publico: 'negocios',
    nota: 'Sesión de diagnóstico para empresa, con prioridades por escrito.',
    pago: '',
  },

  /* — Gestión a tu nombre ─────────────────────────────────────────────────
     EL PRODUCTO ATÓMICO DEL DESPACHO. Es el mismo servicio que las páginas
     llamaban "Gestión a tu nombre" (civil), "A convenir" (familiar,
     inmobiliario), "Reclamación extrajudicial WhatsApp + PDF" (reclamación) y
     "Hablamos por ti" (membresía). Cuatro nombres y cuatro precios —$990,
     $749 y dos "a convenir"— para una sola cosa: que un abogado se dirija
     formalmente a la otra parte a tu nombre.

     Un mismo producto con cuatro precios no lee como flexibilidad, lee como
     que el precio se inventa. Se unifica en $990, que es el precio que ya
     sostenía civil.html.

     LO QUE ANTES ERA UN PRODUCTO APARTE, AHORA ES MODIFICADOR
     La variante "WhatsApp + Paquetería" ($990 en reclamación) no era otro
     servicio: era el mismo con envío físico encima. Se modela como
     modificador, igual que `expres_24h`, para que el envío pueda subir de
     precio cuando suba la paquetería sin tocar el honorario.              */
  gestion_nombre: {
    nombre: 'Gestión a tu nombre',
    precio: 990, unidad: 'MXN', desde: false, publico: 'ambos',
    /* El precio de miembro es la razón de existir de la membresía: convierte
       el descuento en motivo de suscripción en vez de en una incoherencia
       entre páginas. */
    precioMiembro: 749,
    nota: 'Carta o llamada formal a la otra parte, firmada por el despacho. Incluye la respuesta a lo que conteste la contraparte.',
    excluye: 'No obliga a pagar ni garantiza respuesta: eso solo lo resuelve un juez. Negociación posterior y litigio se cotizan aparte.',
    pago: '',
  },
  /* Producto distinto: gestión extrajudicial activa durante 15 días, con
     evaluación, redacción, envío y seguimiento incluidos. */
  presion_legal: {
    nombre: 'Presión Legal · Gestión activa 15 días',
    precio: 1450, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Evaluación, redacción, envío y seguimiento por un abogado con cédula profesional.',
    excluye: 'No garantiza respuesta ni sustituye un juicio; una eventual negociación o litigio se cotiza aparte.',
    /* 20% de descuento permanente para quien ya fue cliente ($1,450 → $1,160),
       válido en cada gestión futura, sin mensualidad. No es precio de
       membresía (no hay cuota): es fidelización de cliente recurrente. */
    precioRecurrente: 1160,
    pago: '',
  },
  envio_certificado: {
    nombre: 'Envío físico certificado con acuse',
    precio: 240, unidad: 'MXN', desde: false, publico: 'ambos',
    modificador: true,
    nota: 'Costo adicional sobre una gestión. Deja constancia de entrega como prueba documental.',
    pago: '',
  },
  /* Distinto de envio_certificado: en Presión Legal, la carta certificada va
     incluida sin costo a partir del día 15; este es el cobro por adelantarla
     desde el día 1. Mismo concepto (constancia de entrega), otro momento y
     otro precio — por eso es una entrada aparte y no el mismo modificador. */
  envio_certificado_dia1: {
    nombre: 'Carta certificada desde el día 1 (Presión Legal)',
    precio: 390, unidad: 'MXN', desde: false, publico: 'personas',
    modificador: true,
    nota: 'Adelanta a partir del día 1 el envío certificado con acuse que Presión Legal ya incluye sin costo desde el día 15.',
    pago: '',
  },

  /* — Inmobiliario ────────────────────────────────────────────────────────
     inmobiliario.html vendía este producto ($1,690 + IVA) sin entrada en el
     catálogo; el validador no lo veía porque 1,690 = 490 + 1,200 (hueco
     conocido de modificadores). Se da de alta el 2026-09-03.               */
  filtro_inmobiliario: {
    nombre: 'Filtro jurídico-documental de inmueble',
    precio: 1690, unidad: 'MXN + IVA', desde: false, publico: 'personas',
    nota: 'Revisión inicial de hasta 5 documentos, congruencia vendedor–inmueble, lista de faltantes y semáforo de alertas antes de dar un anticipo o firmar una promesa.',
    excluye: 'No incluye certificados, derechos oficiales, avalúo, peritaje ni investigación registral profunda.',
    pago: '',
  },

  /* — Acompañamiento en juicio ────────────────────────────────────────────
     POR EXPEDIENTE, NO ES MEMBRESÍA. La distinción no es cosmética: la
     membresía declara que no cubre litigio, y estos planes son precisamente
     para quien ya está en litigio. Mezclarlos ponía $690/mes de seguimiento
     a competir contra $699/mes de Patrimonio, que incluye diez veces más.
     Se cobran por expediente y terminan cuando termina el asunto.         */
  juicio_seguimiento: {
    nombre: 'Acompañamiento en juicio · Seguimiento',
    precio: 690, unidad: 'MXN / MES POR EXPEDIENTE', desde: false, publico: 'personas',
    porExpediente: true,
    nota: 'Traducción del expediente y alertas de plazos, mientras dure el asunto.',
    excluye: 'No sustituye a tu abogado litigante ni implica representación ante el juzgado.',
    pago: '',
  },
  juicio_segunda_opinion: {
    nombre: 'Acompañamiento en juicio · Segunda opinión',
    precio: 1290, unidad: 'MXN / MES POR EXPEDIENTE', desde: false, publico: 'personas',
    porExpediente: true,
    nota: 'Todo lo de Seguimiento más una revisión estratégica mensual de la ruta del caso.',
    excluye: 'No sustituye a tu abogado litigante ni implica representación ante el juzgado.',
    pago: '',
  },
  juicio_prioritario: {
    nombre: 'Acompañamiento en juicio · Prioritario',
    precio: 1990, unidad: 'MXN / MES POR EXPEDIENTE', desde: false, publico: 'personas',
    porExpediente: true,
    nota: 'Todo lo anterior, respuesta en menos de 24 h y preparación de audiencias.',
    excluye: 'No sustituye a tu abogado litigante ni implica representación ante el juzgado.',
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
    legacy: true, // no se ofrece en solicitud.html; sustituido por los paquetes con nombre propio
    /* Entrada legacy de catálogo: las páginas nuevas usan los tres paquetes de abajo. */
    tarifaOficial: 'impi_marca_por_clase',
    nota: 'Búsqueda, clasificación, solicitud, tarifa oficial y seguimiento hasta la resolución del IMPI.',
    excluye: 'Respuesta a oficios de anterioridades y defensa de oposiciones de tercero se cotizan aparte.',
    pago: '',
  },
  marca_esencial: {
    nombre: 'Registro de marca · Esencial',
    precio: 6916, unidad: 'MXN / CLASE', desde: false, publico: 'ambos',
    /* Sin esto, marcas.html mostraba "Honorarios netos $3,790" (precio −
       tarifa IMPI) y el validador lo marcaba como importe fantasma: el
       cálculo era correcto, solo faltaba declarar de qué tarifa salía. */
    tarifaOficial: 'impi_marca_por_clase',
    nota: 'Dictamen básico (1 clase), presentación y seguimiento. Derechos IMPI incluidos.',
    excluye: 'Respuesta a objeción de fondo y defensa de oposiciones se cotizan aparte.',
    pago: '',
  },
  marca_protegida: {
    nombre: 'Registro de marca · Protegido',
    precio: 8916, unidad: 'MXN / CLASE', desde: false, publico: 'ambos',
    tarifaOficial: 'impi_marca_por_clase',
    nota: 'Dictamen estratégico (hasta 2 clases + 1 alternativa), seguimiento y 1 objeción de fondo incluida.',
    excluye: 'Oposiciones de tercero y litigio se cotizan aparte.',
    pago: '',
  },
  marca_360: {
    nombre: 'Registro de marca · Marca 360',
    precio: 11900, unidad: 'MXN / CLASE', desde: false, publico: 'ambos',
    tarifaOficial: 'impi_marca_por_clase',
    nota: 'Dictamen completo, plan de clases, identidad digital y vigilancia de marca por 12 meses.',
    excluye: 'Oposiciones de tercero y litigio se cotizan aparte.',
    pago: '',
  },
  marca_segunda_lectura: {
    nombre: 'Segunda lectura de nombre',
    precio: 690, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Segunda opinión de hasta 3 alternativas; se acredita si registras con el despacho.',
    pago: '',
  },
  marca_vigilancia: {
    nombre: 'Vigilancia de marca',
    precio: 890, unidad: 'MXN / AÑO', desde: false, publico: 'ambos',
    nota: 'Monitoreo de solicitudes similares ante el IMPI durante 12 meses.',
    pago: '',
  },
  marca_gestion_preferente: {
    nombre: 'Gestión preferente de expediente',
    precio: 1200, unidad: 'MXN', desde: false, publico: 'ambos', modificador: true,
    nota: 'Preparación y presentación en 24 horas con seguimiento semanal; no acelera al IMPI.',
    pago: '',
  },
  marca_identidad_digital: {
    nombre: 'Verificación de identidad digital',
    precio: 990, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Disponibilidad de dominio .com/.mx y redes principales con reporte.',
    pago: '',
  },
  /* Entrada legacy: derechos-autor.html en realidad vende TRES niveles
     (mismo patrón que registro_marca → marca_esencial/protegida/360). Esta
     entrada genérica se queda solo por si algo viejo la referencia; las
     páginas nuevas usan los tres paquetes de abajo. Verificado contra
     derechos-autor.html el 2026-08-17: coincide con el nivel "Esencial". */
  derecho_autor: {
    nombre: 'Registro de obra · derecho de autor',
    precio: 2490, unidad: 'MXN', desde: true, publico: 'ambos',
    legacy: true, // no se ofrece en solicitud.html; sustituido por los paquetes con nombre propio
    nota: 'Registro de tu obra ante el INDAUTOR.',
    pago: '',
  },
  derecho_autor_esencial: {
    nombre: 'Derechos de autor · Registro Esencial',
    precio: 2490, unidad: 'MXN', desde: false, publico: 'ambos',
    tarifaOficial: 'indautor_registro_obra',
    nota: 'Para autores, diseñadores, fotógrafos y creadores de contenido. Diagnóstico de registrabilidad, integración de expediente, solicitud, pago oficial ante INDAUTOR y seguimiento hasta el acuse. Cubre 1 obra individual.',
    pago: '',
  },
  derecho_autor_software: {
    nombre: 'Derechos de autor · Registro de Software',
    precio: 5490, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Para startups, agencias, SaaS y desarrolladores. Revisión de titularidad y colaboradores, guía de depósito del fragmento de código, registro ante INDAUTOR y revisión de un contrato de desarrollo o cesión existente.',
    pago: '',
  },
  derecho_autor_blindaje: {
    nombre: 'Derechos de autor · Blindaje Digital',
    precio: 9900, unidad: 'MXN', desde: false, publico: 'ambos',
    nota: 'Para negocios que ya venden activos digitales. Auditoría de hasta 5 activos, mapa de titularidad, un registro incluido, un contrato de cesión o licencia, y plan de acción de 90 días.',
    pago: '',
  },
  derecho_autor_portafolio: {
    nombre: 'Derechos de autor · Portafolio Creativo',
    precio: 4990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Hasta 10 piezas relacionadas, tramitables como colección. Pieza adicional: $350–$600 MXN según formato y complejidad. La procedencia como colección se confirma en la evaluación inicial.',
    pago: '',
  },
  marca_autor: {
    /* Precio PLANO: cubre una clase de marca más el registro de obra.
       plan.html lo publicaba "/ CLASE", lo cual no aplica: el derecho de
       autor no se registra por clases de Niza. Corregido.

       Precio: 7,990 ≈ 15% de descuento sobre comprar los dos por separado
       con los paquetes VIGENTES (marca_esencial 6,916 + derecho_autor_esencial
       2,490 = 9,406 → 7,995, redondeado a 7,990). El 8,050 anterior se había
       calculado sobre el legacy registro_marca (6,990) que ya no se vende. */
    nombre: 'Marca + Derecho de autor',
    precio: 7990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Paquete: una clase de marca ante IMPI + registro de obra. Clases adicionales se cotizan aparte.',
    excluye: 'Respuesta a oficios de anterioridades y defensa de oposiciones de tercero se cotizan aparte.',
    pago: '',
  },
  obra_cesion: {
    nombre: 'Registro de obra + cesión de derechos',
    precio: 3990, unidad: 'MXN', desde: true, publico: 'ambos',
    nota: 'Para software, contenido o diseño hecho por terceros: registro y cesión a tu favor.',
    pago: '',
  },

  /* — Monetización de marca (nivel 03) ────────────────────────────────────
     Escalera: proteger → ordenar → monetizar. Este bloque no existía; era el
     hueco de mayor valor del catálogo y la razón por la que el registro de
     marca competía por precio contra gestores.

     ⚠ PRECIOS PROPUESTOS, PENDIENTES DE VALIDAR ⚠
     Se publican como referencia de mercado, no como cotización cerrada. El
     despacho no ha estructurado franquicias todavía, así que el proyecto
     completo va condicionado a diagnóstico previo: es la única forma honesta
     de venderlo sin comprometer un alcance que aún no se ha medido en horas.
     El diagnóstico sí es entregable hoy: es análisis jurídico.               */

  diagnostico_franquicia: {
    nombre: 'Diagnóstico de franquiciabilidad',
    precio: 4990, unidad: 'MXN', desde: false, publico: 'negocios',
    nota: 'Dictamen de si tu negocio puede franquiciarse: estado de la marca, replicabilidad, qué falta y qué costaría. Se acredita al proyecto si decides continuar.',
    pago: '',
  },
  licencia_marca: {
    nombre: 'Licencia de uso de marca',
    precio: 12990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Contrato de licencia e inscripción ante el IMPI, para que un tercero use tu marca y tú cobres por ello.',
    requiere: 'registro_marca',
    pago: '',
  },
  cesion_marca: {
    nombre: 'Cesión o venta de marca',
    precio: 6990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Transmisión de derechos con inscripción ante el IMPI: vender la marca como el activo que es.',
    requiere: 'registro_marca',
    pago: '',
  },
  franquicia: {
    nombre: 'Estructura de franquicia',
    precio: 59900, unidad: 'MXN', desde: true, publico: 'negocios',
    /* En México no se puede franquiciar sin marca registrada, y la Circular de
       Oferta de Franquicia debe entregarse 30 días antes de firmar. */
    nota: 'Circular de Oferta de Franquicia, contrato de franquicia y licencia de marca. Requiere diagnóstico previo.',
    requiere: 'registro_marca',
    requiereDiagnostico: true,
    pago: '',
  },

  /* — Empresa y cumplimiento — */
  reporte_riesgo: {
    nombre: 'Reporte de Riesgo Contractual',
    precio: 3990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Auditoría de tus contratos vigentes: dónde estás expuesto y qué corregir primero.',
    pago: '',
  },
  /* Entrada legacy: consulta.html en realidad vende TRES paquetes con
     nombre propio, no un piso genérico "desde $9,900". Se queda por si algo
     viejo la referencia; las páginas nuevas usan los tres de abajo.
     Verificado contra consulta.html el 2026-08-17. */
  constitucion: {
    nombre: 'Constitución de empresa',
    precio: 9900, unidad: 'MXN', desde: true, publico: 'negocios',
    legacy: true, // no se ofrece en solicitud.html; sustituido por los paquetes con nombre propio
    nota: 'S.A. o S. de R.L. lista para operar: estatutos, acta, RFC y trámites base.',
    pago: '',
  },
  constitucion_esencial: {
    nombre: 'Constitución de empresa · Esencial',
    precio: 6900, unidad: 'MXN + gastos de fedatario', desde: false, publico: 'negocios',
    nota: 'Elección y viabilidad de la denominación social, estatutos básicos (SA o SRL) y acompañamiento en firma notarial o correduría.',
    pago: '',
  },
  constitucion_blindaje: {
    nombre: 'Constitución de empresa · + Blindaje',
    precio: 9900, unidad: 'MXN + gastos de fedatario', desde: false, publico: 'negocios',
    nota: 'Todo lo de Esencial, más cláusulas de salida de socios, vesting, no competencia y confidencialidad, y gobierno corporativo a la medida.',
    pago: '',
  },
  constitucion_arranque_fiscal: {
    nombre: 'Constitución de empresa · + Arranque Fiscal',
    precio: 12900, unidad: 'MXN + gastos de fedatario', desde: false, publico: 'negocios',
    nota: 'Todo lo de Blindaje, más alta de la empresa ante el SAT y trámite de Firma Electrónica (FIEL).',
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
  /* Distinto de aviso_privacidad + terminos_plataforma por separado
     (3,990 + 3,990): empresa-operacion.html los vende como paquete conjunto
     a un precio menor. Ojo: hoy conviven ambas formas de venderlo — vale la
     pena confirmar si el combo sigue vigente o si debería ser la suma. */
  avisos_terminos_combo: {
    nombre: 'Avisos y Términos (paquete)',
    precio: 2990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Aviso de Privacidad y Términos y Condiciones a la medida para sitio, app o plataforma digital.',
    pago: '',
  },
  /* Distinto de contrato_medida ($1,990 desde): éste es para contratos
     especializados de alta complejidad u operaciones poco comunes, no un
     contrato estándar redactado desde cero. */
  contrato_atipico: {
    nombre: 'Contrato Atípico',
    precio: 5990, unidad: 'MXN', desde: true, publico: 'negocios',
    nota: 'Redacción o revisión de un contrato especializado de alta complejidad o para operaciones poco comunes.',
    pago: '',
  },

  /* — Secreto industrial ──────────────────────────────────────────────────
     Línea de producto completa que existía en secreto-industrial.html pero
     nunca se dio de alta aquí — por eso el validador no la vigilaba.
     Verificado contra la página el 2026-08-17. */
  secreto_diagnostico: {
    nombre: 'Diagnóstico de Secreto Industrial',
    precio: 1990, unidad: 'MXN', desde: false, publico: 'negocios',
    nota: 'Evaluación de la información actual y controles de confidencialidad frente a la LFPPI. Se descuenta al 100% si se contrata el Blindaje Documental dentro de 15 días.',
    pago: '',
  },
  secreto_blindaje: {
    nombre: 'Blindaje Documental de Secreto Industrial',
    precio: 7990, unidad: 'MXN', desde: false, publico: 'negocios',
    nota: 'Hasta 2 modelos de NDA, 1 política interna de manejo de información confidencial, cláusulas de confidencialidad y propiedad intelectual, protocolo de resguardo de evidencia. Ideal hasta 15 colaboradores. NDA adicional: $1,490 MXN c/u.',
    pago: '',
  },
  secreto_auditoria: {
    nombre: 'Auditoría de Defensabilidad',
    precio: 12900, unidad: 'MXN', desde: false, publico: 'negocios',
    nota: 'Revisión cruzada de NDAs, controles de acceso, IT y RH; análisis del estándar de "medios razonables"; informe de vulnerabilidades y plan de remediación priorizado.',
    pago: '',
  },
  secreto_programa_starter: {
    nombre: 'Programa de Confidencialidad Continuo · Starter',
    precio: 2490, unidad: 'MXN / MES', desde: false, publico: 'negocios',
    nota: 'Hasta 10 firmas nuevas al mes de empleados o proveedores.',
    pago: '',
  },
  secreto_programa_growth: {
    nombre: 'Programa de Confidencialidad Continuo · Growth',
    precio: 4490, unidad: 'MXN / MES', desde: false, publico: 'negocios',
    nota: 'Hasta 25 firmas nuevas al mes, con seguimiento activo.',
    pago: '',
  },
  /* Enterprise (Programa Continuo) no entra: es "Cotización", sin precio fijo. */

  /* — Reclamación / Presión Legal ─────────────────────────────────────────
     reclamacion.html vendía tres productos más además de `presion_legal`
     que nunca se dieron de alta. Verificado contra la página el 2026-08-17.
     `segunda_reclamacion` cuesta lo mismo que `gestion_nombre` ($990) — es
     probable que sea el mismo producto reetiquetado para este contexto de
     cobranza, pero se deja como entrada propia hasta confirmarlo: fusionar
     dos productos que resultan no serlo sería peor que la duplicación. */
  segunda_reclamacion: {
    nombre: 'Segunda reclamación',
    precio: 990, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Aviso más severo con apercibimiento legal explícito. Sube la presión antes de ir a juicio.',
    pago: '',
  },
  evaluacion_judicial: {
    nombre: 'Evaluación judicial',
    precio: 1290, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Análisis de viabilidad para saber si una demanda conviene por costo, tiempo y probabilidad. Acreditable a honorarios si continúas a litigio.',
    pago: '',
  },
  convenio_pago: {
    nombre: 'Convenio de pago',
    precio: 1990, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Redacción del acuerdo formal si la contraparte quiere negociar un plan de pagos o cumplimiento parcial.',
    pago: '',
  },
  reclamo_express: {
    nombre: 'Reclamo Express',
    precio: 3490, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Carta de abogado por paquetería y correo, mensajes por WhatsApp, hasta 3 llamadas y reporte final. Envío incluido.',
    excluye: 'No garantiza que te paguen. No incluye demandas ni juicios.',
    montoMinimo: 10000,
    pago: '',
  },
  /* Respuesta Directa: tres formatos de la misma respuesta al abogado de la
     otra parte; el cliente elige el canal. */
  respuesta_whatsapp: {
    nombre: 'Respuesta Directa · Mensaje por WhatsApp',
    precio: 1990, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Revisión de lo que te enviaron, respuesta firmada por abogado, una réplica si contestan y video corto con qué hacer.',
    excluye: 'No incluye juicios ni audiencias. No promete un resultado.',
    pago: '',
  },
  respuesta_carta: {
    nombre: 'Respuesta Directa · Carta formal',
    precio: 2490, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Revisión de lo que te enviaron, respuesta firmada por abogado, una réplica si contestan y video corto con qué hacer.',
    excluye: 'No incluye juicios ni audiencias. No promete un resultado.',
    pago: '',
  },
  respuesta_mensaje_carta: {
    nombre: 'Respuesta Directa · Mensaje y carta',
    precio: 2990, unidad: 'MXN', desde: false, publico: 'personas',
    nota: 'Revisión de lo que te enviaron, respuesta firmada por abogado, una réplica si contestan y video corto con qué hacer.',
    excluye: 'No incluye juicios ni audiencias. No promete un resultado.',
    pago: '',
  },
};

/* ── Membresías ───────────────────────────────────────────────────────────
   El anual es SIEMPRE mensual × 10 → equivale a los "2 meses gratis" que
   promete el copy. Antes los planes de negocio decían "o anual" sin cifra,
   así que quien quería pagar el año no sabía cuánto era.                   */
const FF_MESES_ANUAL = 10;

/* ── Por qué el cupo de gestiones es ANUAL y no mensual ───────────────────
   Los planes de personas prometían "1 gestión al trimestre", "1 al mes" y
   "hasta 3 al mes". Con la gestión valorada en $990, eso significaba:

     Tranquilidad  $2,388/año  →  4 gestiones  =  $3,960 de valor  (166%)
     Familia       $4,788/año  → 12 gestiones  = $11,880 de valor  (248%)
     Patrimonio    $8,388/año  → 36 gestiones  = $35,640 de valor  (425%)

   Una membresía que entrega cuatro veces lo que cobra no es una membresía:
   es un descuento del 90% que solo sobrevive mientras nadie la use. En
   cuanto un solo miembro de Patrimonio agota su cupo, ese contrato pierde
   dinero durante todo el año, y el que más la usa es justo el que más
   problemas tiene.

   Con cupo anual, el valor incluido queda en 41-47% de la cuota, que es el
   rango donde un retainer se sostiene sin depender de que el cliente se
   olvide de usarlo. Las gestiones adicionales no se niegan: se cobran al
   precio de miembro ($749), que sigue siendo mejor que el público.        */
const FF_MEMBRESIAS = {
  /* Personas */
  tranquilidad:         { nombre: 'Tranquilidad',         mensual: 199,  publico: 'personas', gestionesAnuales: 1, descuento: 0.20, pago: '', pagoAnual: '' },
  familia:              { nombre: 'Familia',              mensual: 399,  publico: 'personas', gestionesAnuales: 2, descuento: 0.20, pago: '', pagoAnual: '' },
  patrimonio:           { nombre: 'Patrimonio',           mensual: 699,  publico: 'personas', gestionesAnuales: 4, descuento: 0.25, pago: '', pagoAnual: '' },
  /* Negocios — escalera de empresa-operacion.html / index.html, confirmada
     como la vigente el 2026-08-17. "Contratos Esenciales", "Dirección
     Ligera" y la "Dirección Externa desde $6,990" que vivían aquí eran una
     segunda escalera de precios distinta que plan.html anunciaba en
     paralelo — mismo nombre de categoría, dos productos distintos. Se
     retiran para dejar una sola fuente de verdad. Precios más IVA. */
  direccion_base:        { nombre: 'Dirección Base',        mensual: 1990, publico: 'negocios', pago: '', pagoAnual: '' },
  direccion_activa:      { nombre: 'Dirección Activa',      mensual: 3490, publico: 'negocios', pago: '', pagoAnual: '' },
  direccion_estrategica: { nombre: 'Dirección Estratégica', mensual: 5990, publico: 'negocios', pago: '', pagoAnual: '' },
  /* "Desde": requiere diagnóstico previo, precio final no cerrado — por
     diseño no se marca con data-servicio en el HTML (no hay línea de cobro
     fija que se le pueda pegar). */
  direccion_externa:     { nombre: 'Dirección Externa',     mensual: 12900, publico: 'negocios', desde: true, pago: '', pagoAnual: '' },
};

/* Precio anual derivado, nunca escrito a mano. */
function ffAnual(idMembresia) {
  const m = FF_MEMBRESIAS[idMembresia];
  return m ? m.mensual * FF_MESES_ANUAL : null;
}

/* ── Sostenibilidad de la membresía ───────────────────────────────────────
   Devuelve qué fracción de la cuota anual se entrega en gestiones si el
   miembro agota su cupo. La regla de diseño que este catálogo impone: por
   debajo de 0.60 el plan se sostiene; por encima, el plan pierde dinero con
   los clientes que más lo usan.

   Vive en código y no en un comentario a propósito: al ajustar una cuota o
   un cupo, `ffAuditarMembresias()` dice en el acto si el plan sigue de pie.
   Es la comprobación que faltaba cuando Patrimonio llegó a 425%.          */
const FF_COBERTURA_MAX = 0.60;

function ffCoberturaMembresia(idMembresia) {
  const m = FF_MEMBRESIAS[idMembresia];
  const g = FF_SERVICIOS.gestion_nombre;
  if (!m || !g || !m.gestionesAnuales) return null;
  const cuotaAnual = m.mensual * 12;          // el peor caso es el mensual, no el anual
  const valorIncluido = m.gestionesAnuales * g.precio;
  return {
    plan: m.nombre,
    cuotaAnual,
    valorIncluido,
    cobertura: valorIncluido / cuotaAnual,
    sostenible: valorIncluido / cuotaAnual <= FF_COBERTURA_MAX,
  };
}

function ffAuditarMembresias() {
  return Object.keys(FF_MEMBRESIAS)
    .map(ffCoberturaMembresia)
    .filter(Boolean);
}

/* ── Requisitos por trámite ───────────────────────────────────────────────
   Qué necesita tener a la mano el cliente ANTES de que un abogado pueda
   empezar, y en cuánto tiempo se entrega. Vive aquí —y no en cada página— por
   la misma razón que los precios: un requisito escrito seis veces termina
   diciendo seis cosas distintas.

   Lo lee solicitud.html: al elegir un servicio, muestra su lista y su plazo
   para que el cliente reúna lo necesario antes de enviar. Lo que NO se pide
   aquí (archivos) se solicita por correo tras confirmar, como hasta ahora.

   Cada entrada: { docs: [...], plazo: '...', nota: '...' (opcional) }.
   Un id sin entrada simplemente no muestra el bloque.                      */
const FF_REQ_COMUN = {
  identidad: 'Identificación oficial vigente (INE o pasaporte) de quien contrata',
  fiscal: 'RFC y constancia de situación fiscal (si necesitas factura)',
  contraparte: 'Nombre y datos de contacto de la otra parte (teléfono, correo, domicilio)',
  evidencia: 'Evidencia del asunto: contrato, mensajes, transferencias, facturas o recibos',
  cronologia: 'Cronología breve: qué pasó, cuándo y qué has intentado ya',
  contrato: 'El contrato en PDF o Word, en la versión final que te enviaron',
};

const FF_REQUISITOS = {
  llamada_filtro: {
    docs: ['Formulario de 5 preguntas', 'Tu nombre y un teléfono o correo'],
    plazo: 'Te llamamos en menos de 24 h hábiles.',
  },

  /* Contratos */
  revision_simple: {
    docs: [FF_REQ_COMUN.contrato, 'Quién eres dentro del contrato (arrendatario, prestador, cliente…)', 'Qué te preocupa o qué quieres asegurar', 'Fecha límite para firmar, si la hay'],
    plazo: 'Reporte en 24–48 h hábiles desde que recibimos el documento (24 h con entrega exprés).',
  },
  revision_intermedia: {
    docs: [FF_REQ_COMUN.contrato, 'Anexos que formen parte del contrato', 'Quién eres dentro del contrato y qué te preocupa', 'Fecha límite para firmar, si la hay'],
    plazo: 'Reporte en 24–48 h hábiles desde que recibimos el documento completo.',
  },
  revision_estrategica: {
    docs: [FF_REQ_COMUN.contrato, 'Anexos, cartas de intención o versiones anteriores', 'Qué quieres lograr en la negociación y qué no estás dispuesto a ceder', 'Contexto de la relación con la otra parte'],
    plazo: 'Reporte con postura de negociación en 48–72 h hábiles.',
  },
  contrato_medida: {
    docs: ['Nombre, RFC y domicilio de las partes', 'Qué se contrata (objeto), monto y forma de pago', 'Plazo, entregables y fechas clave', 'Cláusulas que quieras incluir (confidencialidad, penalizaciones, exclusividad)'],
    plazo: 'Primer borrador en 3–5 días hábiles; una ronda de ajustes incluida.',
  },
  contrato_atipico: {
    docs: ['Descripción de la operación y de las partes', 'Borrador, propuesta o minuta si ya existe', 'Riesgos que te preocupan y plazos del cierre'],
    plazo: 'Se confirma al recibir la descripción; normalmente 5–10 días hábiles.',
  },

  /* Asesoría */
  consulta_legal: {
    docs: ['Formulario de 5 preguntas', 'Tu expediente o contratos (documentos del caso)', 'Dos horarios en los que puedas tomar la llamada'],
    plazo: 'Agendamos dentro de 48 h hábiles; resumen de una página por correo 24 h después de la cita.',
  },
  consulta_particular: {
    docs: ['Formulario de 5 preguntas', 'Documentos relevantes (contratos, actas, comunicaciones)', 'Línea de tiempo: fechas clave en orden', 'Dos horarios en los que puedas tomar la videollamada'],
    plazo: 'Sesión dentro de 48 h hábiles; plan de 3 a 5 páginas 48 h después.',
  },
  diagnostico_negocio: {
    docs: ['Giro, tamaño y forma legal de la empresa', 'Contratos que usas con clientes, proveedores y equipo', 'Situación de marca, avisos de privacidad y actas', 'Qué te quita el sueño hoy en lo legal'],
    plazo: 'Sesión dentro de 48 h hábiles; prioridades por escrito 48 h después.',
  },

  /* Gestión a tu nombre / Presión Legal */
  gestion_nombre: {
    docs: [FF_REQ_COMUN.contraparte, FF_REQ_COMUN.evidencia, 'Monto o petición concreta que vamos a exigir', FF_REQ_COMUN.cronologia, FF_REQ_COMUN.identidad],
    plazo: 'Carta o llamada formal en 24–48 h hábiles desde que tenemos el expediente completo.',
    nota: 'No aplica si el asunto ya está en un juzgado.',
  },
  presion_legal: {
    docs: [FF_REQ_COMUN.contraparte, FF_REQ_COMUN.evidencia, 'Monto o petición concreta', FF_REQ_COMUN.cronologia, FF_REQ_COMUN.identidad],
    plazo: 'Evaluación en 24 h hábiles; gestión activa durante 15 días naturales.',
    nota: 'Solo asuntos civiles, mercantiles o de consumo sin proceso judicial abierto. No aplica a penal, familiar, laboral, fiscal ni sucesorio.',
  },
  segunda_reclamacion: {
    docs: ['La primera reclamación enviada y la respuesta (o silencio) de la contraparte', FF_REQ_COMUN.evidencia, 'Monto actualizado que se exige'],
    plazo: 'Aviso con apercibimiento en 24–48 h hábiles.',
  },
  evaluacion_judicial: {
    docs: [FF_REQ_COMUN.evidencia, FF_REQ_COMUN.contraparte, 'Gestiones extrajudiciales ya realizadas', 'Monto en disputa y fecha de origen'],
    plazo: 'Dictamen de viabilidad en 3–5 días hábiles.',
    nota: 'Se acredita a honorarios si decides continuar a litigio con el despacho.',
  },
  convenio_pago: {
    docs: ['Nombre, RFC y domicilio de ambas partes', 'Monto total, calendario de pagos y garantías acordadas', 'Qué pasa si se incumple (penalización, vencimiento anticipado)'],
    plazo: 'Convenio listo para firma en 2–3 días hábiles.',
  },
  reclamo_express: {
    docs: [FF_REQ_COMUN.contraparte, FF_REQ_COMUN.evidencia, 'Monto o petición concreta que vamos a exigir', FF_REQ_COMUN.cronologia, FF_REQ_COMUN.identidad],
    plazo: 'Reclamo enviado en 2 días hábiles; seguimiento durante 7 días hábiles y reporte final.',
    nota: 'Conviene desde $10,000 de reclamo. Si tu caso no es viable o no enviamos a tiempo, te devolvemos tu dinero.',
  },
  respuesta_whatsapp: {
    docs: ['La carta o mensaje que te envió el abogado de la otra parte', FF_REQ_COMUN.evidencia, FF_REQ_COMUN.identidad],
    plazo: 'Respuesta enviada en 2 días hábiles, después de que la apruebes.',
  },
  respuesta_carta: {
    docs: ['La carta o mensaje que te envió el abogado de la otra parte', FF_REQ_COMUN.evidencia, FF_REQ_COMUN.identidad],
    plazo: 'Respuesta enviada en 2 días hábiles, después de que la apruebes.',
  },
  respuesta_mensaje_carta: {
    docs: ['La carta o mensaje que te envió el abogado de la otra parte', FF_REQ_COMUN.evidencia, FF_REQ_COMUN.identidad],
    plazo: 'Respuesta enviada en 2 días hábiles, después de que la apruebes.',
  },
  juicio_seguimiento: {
    docs: ['Número de expediente y juzgado', 'Copia de la demanda y de la última actuación', 'Nombre y contacto de tu abogado litigante'],
    plazo: 'Primera lectura del expediente en 48 h hábiles; alertas de plazos mientras dure el asunto.',
  },
  juicio_segunda_opinion: {
    docs: ['Número de expediente y juzgado', 'Copia completa del expediente o acceso al mismo', 'Estrategia actual de tu abogado litigante'],
    plazo: 'Primera revisión estratégica en 5 días hábiles; una al mes después.',
  },
  juicio_prioritario: {
    docs: ['Número de expediente y juzgado', 'Copia completa del expediente', 'Calendario de audiencias próximas'],
    plazo: 'Respuesta en menos de 24 h; preparación previa a cada audiencia.',
  },

  /* Inmobiliario */
  filtro_inmobiliario: {
    docs: ['Escritura o título de propiedad que te mostraron', 'Identificación del vendedor o arrendador', 'Boleta predial y último recibo de agua', 'Promesa, contrato o anticipo que te pidan firmar o pagar', 'Datos del inmueble (dirección, folio real si lo tienes)'],
    plazo: 'Semáforo de alertas en 24–48 h hábiles desde el expediente completo.',
    nota: 'Hasta 5 documentos. No incluye certificados ni derechos oficiales.',
  },

  /* Propiedad intelectual · Marcas */
  busqueda_fonetica: {
    docs: ['Nombre o nombres que quieres registrar (hasta 3)', 'Productos o servicios que vas a ofrecer bajo ese nombre'],
    plazo: 'Reporte en 24–48 h hábiles.',
  },
  marca_segunda_lectura: {
    docs: ['Hasta 3 nombres alternativos', 'Giro y productos o servicios', 'Resultado de la búsqueda anterior, si la tienes'],
    plazo: 'Opinión en 24–48 h hábiles.',
  },
  marca_esencial: {
    docs: ['Nombre exacto de la marca (denominación)', 'Logotipo en alta resolución (JPG o PNG) si es marca mixta', 'Lista de productos o servicios que ampara', 'Datos del titular: nombre o razón social, RFC, CURP (persona física), domicilio y correo', 'Fecha de primer uso en México, o indicar que aún no se usa', 'Acta constitutiva y poder del representante si el titular es una empresa'],
    plazo: 'Dictamen en 48 h hábiles; presentación ante el IMPI en 5 días hábiles; resolución del IMPI 4–8 meses.',
    nota: 'Los derechos del IMPI ya están incluidos en el precio. Una clase; clases adicionales se cotizan aparte.',
  },
  marca_protegida: {
    docs: ['Nombre exacto de la marca y alternativa si la tienes', 'Logotipo en alta resolución si es marca mixta', 'Lista de productos o servicios (hasta 2 clases)', 'Datos del titular: nombre o razón social, RFC, CURP (persona física), domicilio y correo', 'Fecha de primer uso, o indicar que aún no se usa', 'Acta constitutiva y poder si el titular es una empresa'],
    plazo: 'Dictamen estratégico en 48–72 h hábiles; presentación en 5 días hábiles; resolución del IMPI 4–8 meses.',
    nota: 'Incluye la respuesta a una objeción de fondo del IMPI.',
  },
  marca_360: {
    docs: ['Nombre exacto de la marca y variantes', 'Logotipo y manual de identidad si existe', 'Todos los productos o servicios actuales y planeados', 'Datos del titular y, si es empresa, acta y poder', 'Dominios y redes que usas o quieres asegurar'],
    plazo: 'Plan de clases en 72 h hábiles; presentación en 5 días hábiles; vigilancia durante 12 meses.',
  },
  marca_vigilancia: {
    docs: ['Número de registro o de expediente de tu marca', 'Clase o clases registradas', 'Correo donde quieres recibir las alertas'],
    plazo: 'Alertas mensuales durante 12 meses.',
  },
  marca_identidad_digital: {
    docs: ['Nombre de la marca y variantes aceptables', 'Redes sociales y extensiones de dominio que te interesan'],
    plazo: 'Reporte en 24–48 h hábiles.',
  },
  marca_autor: {
    docs: ['Todo lo de Registro de marca · Esencial', 'Ejemplar de la obra a registrar (logotipo, contenido o diseño) en archivo digital', 'Nombre completo del autor y del titular, si son distintos'],
    plazo: 'Marca: presentación en 5 días hábiles. Obra: acuse del INDAUTOR en 3–6 semanas.',
  },

  /* Propiedad intelectual · Derechos de autor */
  derecho_autor_esencial: {
    docs: ['Título y rama de la obra (literaria, artística, musical, software…)', 'Ejemplar de la obra en archivo digital (PDF, imágenes, audio o video)', 'Nombre completo, nacionalidad y domicilio del autor o autores', 'Quién es el titular de los derechos y, si no es el autor, el contrato que lo acredita', 'Fecha de creación y si ya se divulgó', FF_REQ_COMUN.identidad, 'RFC o CURP del titular'],
    plazo: 'Expediente en 3–5 días hábiles; acuse del INDAUTOR en 3–6 semanas.',
    nota: 'Los derechos del INDAUTOR ya están incluidos.',
  },
  derecho_autor_software: {
    docs: ['Nombre del programa y versión', 'Primeras y últimas 10 páginas del código fuente en PDF (o el fragmento representativo)', 'Descripción funcional breve', 'Lista de desarrolladores y su relación con la empresa (empleado, freelance, socio)', 'Contratos de desarrollo o cesión existentes', 'Datos del titular: razón social o nombre, RFC, domicilio'],
    plazo: 'Revisión de titularidad en 5 días hábiles; acuse del INDAUTOR en 3–6 semanas.',
  },
  derecho_autor_blindaje: {
    docs: ['Lista de hasta 5 activos digitales que vendes o licencias', 'Quién creó cada uno y bajo qué contrato', 'Contratos con clientes o plataformas donde los distribuyes', 'Datos del titular y de la empresa'],
    plazo: 'Mapa de titularidad en 7 días hábiles; plan de 90 días y contrato en 15 días hábiles.',
  },
  derecho_autor_portafolio: {
    docs: ['Lista de las piezas (hasta 10) con título y fecha', 'Archivos digitales de cada pieza', 'Nombre completo del autor y del titular', FF_REQ_COMUN.identidad],
    plazo: 'Se confirma la procedencia como colección en 48 h hábiles; acuse en 3–6 semanas.',
  },
  obra_cesion: {
    docs: ['Ejemplar de la obra en archivo digital', 'Nombre, RFC y domicilio de quien creó la obra (cedente) y de quien la adquiere', 'Contrato, factura o acuerdo bajo el que se hizo la obra'],
    plazo: 'Contrato de cesión en 3–5 días hábiles; acuse del INDAUTOR en 3–6 semanas.',
  },

  /* Monetización de marca */
  diagnostico_franquicia: {
    docs: ['Descripción del modelo de negocio y número de unidades', 'Número de registro de tu marca (o su estatus)', 'Manuales de operación existentes, aunque sean informales', 'Estados financieros básicos de una unidad'],
    plazo: 'Dictamen en 10 días hábiles.',
  },
  licencia_marca: {
    docs: ['Título de registro de la marca', 'Datos del licenciatario', 'Territorio, plazo y regalías acordadas o propuestas', 'Estándares de calidad que exigirás'],
    plazo: 'Contrato en 7 días hábiles; inscripción ante el IMPI 2–4 meses.',
  },
  cesion_marca: {
    docs: ['Título de registro de la marca', 'Datos del adquirente (nombre, RFC, domicilio)', 'Precio y forma de pago acordados'],
    plazo: 'Contrato en 5 días hábiles; inscripción ante el IMPI 2–4 meses.',
  },
  franquicia: {
    docs: ['Diagnóstico de franquiciabilidad previo (requisito)', 'Marca registrada (título)', 'Manuales operativos y de imagen', 'Modelo financiero de la unidad tipo', 'Acta constitutiva y poderes de la franquiciante'],
    plazo: 'COF y contratos en 4–6 semanas desde el diagnóstico.',
    nota: 'La Circular de Oferta de Franquicia debe entregarse al franquiciatario 30 días antes de firmar.',
  },

  /* Empresa */
  constitucion_esencial: {
    docs: ['Mínimo dos socios (personas físicas o morales)', 'INE o pasaporte vigente de cada socio', 'Acta de nacimiento de cada socio', 'Comprobante de domicilio de cada socio (no mayor a 3 meses)', 'CURP, RFC y constancia de situación fiscal de cada socio', 'Tres opciones de nombre para la sociedad, en orden de preferencia', 'Capital social y porcentaje de cada socio', 'Domicilio de la sociedad y quién será administrador'],
    plazo: 'Autorización de denominación 2–5 días hábiles; firma ante fedatario en 2–3 semanas.',
    nota: 'Los gastos de notario o corredor se pagan aparte y varían por estado.',
  },
  constitucion_blindaje: {
    docs: ['Todo lo de Constitución Esencial', 'Reglas de salida y vesting que quieren pactar los socios', 'Quién aporta qué (dinero, trabajo, activos) y en qué plazo'],
    plazo: 'Estatutos a la medida en 5 días hábiles adicionales; firma en 3–4 semanas.',
  },
  constitucion_arranque_fiscal: {
    docs: ['Todo lo de Constitución + Blindaje', 'e.firma vigente del representante legal', 'Comprobante de domicilio fiscal de la sociedad'],
    plazo: 'Firma en 3–4 semanas; RFC y e.firma de la sociedad 1–2 semanas después.',
  },
  acuerdo_socios: {
    docs: ['Tabla de participación actual (cap table)', 'Roles y dedicación de cada socio', 'Vesting, salida y resolución de desacuerdos que quieren pactar', 'Acta constitutiva si la sociedad ya existe'],
    plazo: 'Borrador en 5–7 días hábiles; una ronda de ajustes incluida.',
  },
  safe_termsheet: {
    docs: ['El SAFE o term sheet recibido', 'Tabla de participación actual', 'Valuación o cap propuesto y monto de la ronda'],
    plazo: 'Reporte de riesgos en 48–72 h hábiles.',
  },
  reporte_riesgo: {
    docs: ['Contratos vigentes con clientes, proveedores y equipo', 'Plantillas que usas de forma recurrente', 'Quién firma y cómo se resguardan los contratos hoy'],
    plazo: 'Reporte con prioridades en 7–10 días hábiles.',
  },
  aviso_privacidad: {
    docs: ['URL del sitio o app', 'Qué datos recabas y para qué', 'Con quién los compartes (pasarelas, CRM, proveedores)', 'Razón social, RFC y domicilio del responsable'],
    plazo: 'Aviso integral y simplificado en 3–5 días hábiles.',
  },
  terminos_plataforma: {
    docs: ['URL del sitio, app o plataforma', 'Cómo funciona el servicio y cómo se cobra', 'Qué no permites a los usuarios', 'Razón social y domicilio del operador'],
    plazo: 'Términos en 5–7 días hábiles.',
  },
  avisos_terminos_combo: {
    docs: ['URL del sitio o app', 'Qué datos recabas, para qué y con quién los compartes', 'Cómo funciona el servicio y cómo se cobra', 'Razón social, RFC y domicilio del responsable'],
    plazo: 'Ambos documentos en 5–7 días hábiles.',
  },

  /* Secreto industrial */
  secreto_diagnostico: {
    docs: ['Qué información consideras confidencial (fórmulas, procesos, listas, código)', 'Cuántas personas tienen acceso y cómo', 'NDAs, contratos o políticas actuales, si existen'],
    plazo: 'Dictamen en 5 días hábiles.',
    nota: 'Se descuenta al 100% si contratas el Blindaje Documental en 15 días.',
  },
  secreto_blindaje: {
    docs: ['Resultado del diagnóstico, si lo tienes', 'Organigrama y lista de colaboradores y proveedores con acceso', 'Contratos laborales y de servicios vigentes', 'Políticas internas existentes'],
    plazo: 'Paquete documental en 10 días hábiles.',
  },
  secreto_auditoria: {
    docs: ['Todo lo del Blindaje Documental', 'Acceso a políticas y controles de IT y RH', 'Bitácoras o registros de acceso, si existen'],
    plazo: 'Informe de vulnerabilidades y plan en 15 días hábiles.',
  },
  secreto_programa_starter: {
    docs: ['Datos de la empresa y del responsable', 'Lista mensual de empleados o proveedores nuevos que deben firmar'],
    plazo: 'Alta en 48 h hábiles; firmas gestionadas cada mes.',
  },
  secreto_programa_growth: {
    docs: ['Datos de la empresa y del responsable', 'Lista mensual de firmantes nuevos', 'Canal de seguimiento acordado (correo o llamada mensual)'],
    plazo: 'Alta en 48 h hábiles; seguimiento activo mensual.',
  },

  /* Membresías */
  tranquilidad: { docs: ['Nombre completo, correo y teléfono', 'RFC si necesitas factura'], plazo: 'Alta el mismo día hábil.' },
  familia: { docs: ['Nombre completo, correo y teléfono', 'Integrantes de la familia cubiertos', 'RFC si necesitas factura'], plazo: 'Alta el mismo día hábil.' },
  patrimonio: { docs: ['Nombre completo, correo y teléfono', 'Inventario breve de propiedades o contratos a cuidar', 'RFC si necesitas factura'], plazo: 'Alta el mismo día hábil.' },
  direccion_base: { docs: ['Razón social, RFC y giro', 'Responsable de contacto', 'Plantillas de contrato que usas hoy'], plazo: 'Alta en 48 h hábiles.' },
  direccion_activa: { docs: ['Razón social, RFC y giro', 'Responsable de contacto', 'Plantillas y contratos recurrentes', 'Dos categorías para tu Radar Legal'], plazo: 'Alta en 48 h hábiles.' },
  direccion_estrategica: { docs: ['Razón social, RFC y giro', 'Responsable de contacto', 'Contratos recurrentes y organigrama comercial', 'Cuatro categorías para tu Radar Legal'], plazo: 'Alta en 48 h hábiles; primera sesión estratégica en la primera semana.' },
  direccion_externa: { docs: ['Razón social, RFC y giro', 'Áreas y responsables con los que trabajaremos', 'Negociaciones y contratos abiertos hoy'], plazo: 'Diagnóstico previo sin costo; propuesta en 5 días hábiles.' },
};

function ffRequisitos(id) {
  return FF_REQUISITOS[id] || null;
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

/* ── Conectar los CTA de pago ─────────────────────────────────────────────
   La pieza que faltaba: hasta ahora `pago` existía pero nada la leía. Un
   elemento marcado `data-servicio="marca_esencial"` en el HTML apunta a una
   entrada del catálogo; si esa entrada ya tiene `pago` (o `pagoAnual` con
   `data-anual="1"`), este script reescribe su `href` al link de cobro real.

   Si `pago` sigue vacío, NO SE TOCA el elemento: conserva el `href` que
   traiga en el HTML (típicamente un link de WhatsApp), tal como describe el
   comentario de `ffLinkPago`. Así se puede ir marcando botón por botón sin
   que el sitio se rompa mientras algunos servicios aún no tienen línea de
   cobro. */
function ffConectarCTAs() {
  if (typeof document === 'undefined') return;
  const todos = { ...FF_SERVICIOS, ...FF_MEMBRESIAS };

  document.querySelectorAll('[data-servicio]').forEach((el) => {
    const id = el.dataset.servicio;
    const s = todos[id];
    if (!s) {
      console.warn('[precios] data-servicio="' + id + '" no existe en el catálogo (' + location.pathname + ')');
      return;
    }
    const anual = el.dataset.anual === '1' || el.dataset.anual === 'true';
    const link = anual ? s.pagoAnual : s.pago;
    if (!link) return; // sigue sin línea de cobro: se deja el href actual (WhatsApp, etc.)

    el.setAttribute('href', link);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
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

  /* Importes DERIVADOS que sí son legítimos aunque no sean el precio de ningún
     servicio: el desglose honorarios/tarifa oficial y, en los paquetes, el
     precio de comprar por separado y el ahorro. Sin esto el validador los
     marcaba como datos viejos y el ruido lo habría vuelto inservible: un
     validador que da falsas alarmas se acaba ignorando. */
  Object.keys(FF_TARIFAS_OFICIALES).forEach((k) => importes.add(FF_TARIFAS_OFICIALES[k].importe));

  /* Precio de miembro: es un importe publicable ($749 junto a $990), así que
     el validador tiene que reconocerlo o marcaría como dato viejo justo el
     número que sostiene la membresía. Mismo trato para el precio de cliente
     recurrente (p. ej. $1,160 de Presión Legal para quien ya fue cliente). */
  Object.values(catalogo).forEach((s) => {
    if (s.precioMiembro) importes.add(s.precioMiembro);
    if (s.precioRecurrente) importes.add(s.precioRecurrente);
    if (s.credito) importes.add(s.credito);
    if (s.montoMinimo) importes.add(s.montoMinimo);
  });

  /* Modificadores: el total con el modificador aplicado es legítimo en la
     página ("$990 + $240 = $1,230"), aunque no sea el precio de ningún
     servicio del catálogo. */
  const modificadores = Object.values(catalogo).filter((s) => s.modificador);
  Object.values(catalogo).filter((s) => !s.modificador && s.precio > 0).forEach((base) => {
    modificadores.forEach((m) => {
      importes.add(base.precio + m.precio);
      if (base.precioMiembro) importes.add(base.precioMiembro + m.precio);
    });
  });
  Object.keys(catalogo).forEach((id) => {
    const d = ffDesglose(id);
    // Redondeado: las páginas muestran "Honorarios netos $3,790", nunca los
    // centavos exactos (3789.6). Comparar el número crudo contra el
    // redondeado nunca iba a coincidir — así fallaba para marca_esencial,
    // marca_protegida y marca_360 aunque el cálculo fuera correcto.
    if (d) { importes.add(Math.round(d.honorarios)); importes.add(Math.round(d.oficiales)); }
  });
  /* Paquete marca+autor: suma de los componentes y diferencia anunciada. */
  if (FF_SERVICIOS.marca_esencial && FF_SERVICIOS.derecho_autor_esencial && FF_SERVICIOS.marca_autor) {
    const suelto = FF_SERVICIOS.marca_esencial.precio + FF_SERVICIOS.derecho_autor_esencial.precio;
    importes.add(suelto);
    importes.add(suelto - FF_SERVICIOS.marca_autor.precio);
  }

  /* textContent, NO innerText: innerText solo devuelve lo que está renderizado.
     En marcas.html daba 1.785 caracteres contra 9.340 reales — el validador
     quedaba ciego al 80% de la página (acordeones cerrados, secciones fuera
     de vista) y por eso reportaba "coherente" sin haber mirado los precios. */
  const bruto = document.body ? document.body.textContent : '';
  const texto = bruto.replace(/\s+/g, ' ');
  const encontrados = [...texto.matchAll(/\$\s?([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,6})(?!\s*[.,]\d)/g)]
    .map((m) => Number(m[1].replace(/,/g, '')));

  const huerfanos = [...new Set(encontrados)].filter((n) => !importes.has(n));

  /* ── Sobre la comprobación que NO está aquí ──────────────────────────────
     Se intentó detectar "nombre canónico junto a un importe equivocado" con
     tres heurísticas de proximidad: hacia adelante, en ventana simétrica, y
     recorriendo ancestros del DOM. Las tres se descartaron porque fallaban en
     ambas direcciones a la vez:

       · FALSOS POSITIVOS: en derechos-autor.html el nombre "Registro de marca
         ante IMPI" aparece como componente de un paquete de $8,050. Ninguna
         heurística de cercanía puede distinguir "producto mal cotizado" de
         "componente de un paquete", porque estructuralmente son idénticos.

       · FALSO NEGATIVO en su caso de uso: al sustituir $6,990 por $490 —un
         importe válido del catálogo pero de otro producto— no se detectaba,
         porque $490 también estaba cerca legítimamente.

     Una comprobación que avisa cuando no debe y calla cuando debe es peor que
     no tenerla: enseña a ignorar las alertas. Se elimina.

     LO QUE SÍ CUBRE ESTE VALIDADOR
     `huerfanos` detecta cualquier importe de la página que no exista en el
     catálogo. Eso atrapa todo precio viejo o mal escrito, que es el fallo real
     y frecuente (fue el origen de las siete incoherencias corregidas).

     HUECO CONOCIDO
     Si un precio se sustituye por OTRO importe que sí está en el catálogo
     (poner $490 donde va $6,990), no se detecta automáticamente.

     CÓMO CERRARLO CUANDO VALGA LA PENA
     Con enlace explícito en lugar de adivinanza: marcar en el HTML
     data-servicio="registro_marca" junto al precio, y validar ese par. Es
     fiable porque no infiere nada, pero exige anotar los ~40 precios del sitio.
     ------------------------------------------------------------------------ */
  const desalineados = [];

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
  document.addEventListener('DOMContentLoaded', () => {
    ffValidarPrecios();
    ffConectarCTAs();
  });
}

if (typeof window !== 'undefined') {
  Object.assign(window, {
    FF_MONEDA, FF_SERVICIOS, FF_MEMBRESIAS, FF_MESES_ANUAL, FF_TARIFAS_OFICIALES, FF_REQUISITOS,
    ffAnual, ffPrecio, ffEtiqueta, ffLinkPago, ffCobrables, ffDesglose, ffValidarPrecios, ffConectarCTAs, ffRequisitos,
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    FF_MONEDA, FF_SERVICIOS, FF_MEMBRESIAS, FF_MESES_ANUAL, FF_TARIFAS_OFICIALES, FF_REQUISITOS,
    ffAnual, ffPrecio, ffEtiqueta, ffLinkPago, ffCobrables, ffDesglose, ffConectarCTAs, ffRequisitos,
  };
}
