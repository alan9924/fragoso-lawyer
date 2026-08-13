/* ============================================================================
   FERRO FRAGOSO — Capa de inteligencia sobre los campos de las plantillas
   ----------------------------------------------------------------------------
   Las plantillas de contratos.js marcan sus huecos con {{Etiqueta}}. Esa
   etiqueta era, hasta ahora, TODO lo que el usuario veía: una pantalla por
   campo, un input de texto, y la etiqueta cruda como pregunta. Con 219
   etiquetas distintas —y hasta 52 en un solo documento— eso produce
   formularios impracticables y contratos que salen con huecos.

   Este módulo agrega tres cosas encima de la misma etiqueta, sin tocar las
   plantillas:

     tipoDeCampo()   qué clase de dato es (fecha, dinero, RFC, selección…)
     ayudaDeCampo()  qué significa y qué se escribe ahí, en español llano
     agrupar()       en qué sección del formulario vive

   La estrategia es inferencia por patrón + anulaciones puntuales. Así las 219
   etiquetas quedan cubiertas sin anotarlas a mano una por una, y las que de
   verdad confunden reciben una explicación escrita.
   ============================================================================ */

(function (global) {
  'use strict';

  /* ── Normalización ──────────────────────────────────────────────────── */
  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /* ── Tipos de campo ──────────────────────────────────────────────────
     El orden importa: la primera regla que casa manda. Las más específicas
     van arriba. */
  const REGLAS_TIPO = [
    /* Derivado: se calcula solo a partir del monto correspondiente. La regla
       es "con letra" a secas — las plantillas usan Monto, Renta, Cantidad,
       Importe, Precio y Suma indistintamente. */
    { re: /con letra/, tipo: 'derivado-letras' },

    { re: /^fecha|fecha de|fecha del/, tipo: 'fecha' },
    { re: /^rfc|rfc del|rfc de/, tipo: 'rfc' },
    { re: /^curp|curp del/, tipo: 'curp' },
    { re: /correo|email|e-mail/, tipo: 'email' },
    { re: /telefono|celular|whatsapp/, tipo: 'tel' },

    { re: /tipo de persona|personalidad juridica/, tipo: 'select-persona' },
    { re: /regimen (matrimonial|de bienes)/, tipo: 'select-regimen' },
    { re: /periodicidad|frecuencia de pago/, tipo: 'select-periodicidad' },

    { re: /interes (ordinario|moratorio)|tasa/, tipo: 'porcentaje' },

    /* "Origen del adeudo" describe de dónde viene la deuda, no es una cifra.
       Va antes de la regla de dinero, que si no lo captura por "adeudo". */
    { re: /^origen|origen del|concepto/, tipo: 'texto-largo' },

    { re: /monto|precio|renta|importe|sueldo|salario|honorarios|deposito|pena|anticipo|saldo|adeudo|deuda|valor|suma|abono|mensualidad|subtotal|descuento|^total$|^total |^iva$/, tipo: 'dinero' },

    /* Acotado a propósito: un "numero de" suelto se tragaba "Número de serie
       o identificador", que no es un entero. */
    { re: /^dias|dias de|dias para|plazo en dias|parcialidades|numero de (pagos|dias|meses|parcialidades|exhibiciones|integrantes)/, tipo: 'entero' },

    { re: /domicilio|direccion|ubicacion/, tipo: 'texto-largo' },
    { re: /descripcion|objeto|servicios|actividades|obligaciones|funciones|entregables|caracteristicas|destino|garantia|clausula|motivo|hechos|declaracion/, tipo: 'texto-largo' },
    { re: /datos bancarios|clabe|cuenta/, tipo: 'texto-largo' },

    { re: /ciudad y estado|ciudad de firma|^ciudad|estado|municipio|entidad/, tipo: 'texto' },
    { re: /nombre|razon social|parte |apoderado|testigo|aval|beneficiario/, tipo: 'texto' },
  ];

  const CONFIG_TIPO = {
    'fecha':            { input: 'date',     ancho: 'medio' },
    'rfc':              { input: 'text',     ancho: 'medio', maxlength: 13, transform: 'upper', placeholder: 'XAXX010101000' },
    'curp':             { input: 'text',     ancho: 'medio', maxlength: 18, transform: 'upper', placeholder: 'XAXX010101HDFXXX01' },
    'email':            { input: 'email',    ancho: 'medio', placeholder: 'nombre@dominio.com' },
    'tel':              { input: 'tel',      ancho: 'medio', placeholder: '55 1234 5678' },
    'dinero':           { input: 'text',     ancho: 'medio', inputmode: 'decimal', prefijo: '$', placeholder: '25,000.00' },
    'porcentaje':       { input: 'text',     ancho: 'corto', inputmode: 'decimal', sufijo: '%', placeholder: '3' },
    'entero':           { input: 'text',     ancho: 'corto', inputmode: 'numeric', placeholder: '30' },
    'texto':            { input: 'text',     ancho: 'largo' },
    'texto-largo':      { input: 'textarea', ancho: 'largo' },
    'derivado-letras':  { input: 'derivado', ancho: 'largo' },
    'select-persona':   { input: 'select',   ancho: 'medio', opciones: ['Persona física', 'Persona moral'] },
    'select-regimen':   { input: 'select',   ancho: 'medio', opciones: ['Sociedad conyugal', 'Separación de bienes'] },
    'select-periodicidad': { input: 'select', ancho: 'medio', opciones: ['Semanal', 'Quincenal', 'Mensual', 'Bimestral', 'Trimestral', 'Anual'] },
  };

  function tipoDeCampo(etiqueta) {
    const n = norm(etiqueta);
    for (const r of REGLAS_TIPO) {
      if (r.re.test(n)) {
        return Object.assign({ tipo: r.tipo }, CONFIG_TIPO[r.tipo] || CONFIG_TIPO['texto']);
      }
    }
    return Object.assign({ tipo: 'texto' }, CONFIG_TIPO['texto']);
  }

  /* ── Explicaciones ───────────────────────────────────────────────────
     Escritas para quien nunca ha firmado un contrato. Cada una responde tres
     cosas: qué es, por qué importa y un ejemplo concreto. Las reglas van por
     patrón para cubrir las 219 etiquetas; las que más confunden llevan texto
     propio. */
  const AYUDAS = [
    {
      re: /con letra/,
      que: 'La misma cantidad, escrita con palabras.',
      porque: 'En un contrato el número y la letra deben coincidir. Si alguien altera el número después de firmar, la letra es la que prevalece: por eso se escribe dos veces.',
      ejemplo: 'Lo calculamos solo a partir del monto que ya capturaste.'
    },
    {
      re: /^rfc|rfc del|rfc de/,
      que: 'La clave que el SAT le asigna a cada contribuyente.',
      porque: 'Identifica sin ambigüedad a quien firma y es indispensable para poder facturar lo pactado.',
      ejemplo: '13 caracteres si es persona física, 12 si es empresa. Viene en tu Constancia de Situación Fiscal.'
    },
    {
      re: /^curp/,
      que: 'La clave única de registro de población.',
      porque: 'Identifica a la persona física ante cualquier autoridad, más allá del nombre.',
      ejemplo: '18 caracteres. Aparece en tu acta de nacimiento o la consultas en gob.mx.'
    },
    {
      re: /tipo de persona|personalidad juridica/,
      que: '¿Firma un individuo o una empresa?',
      porque: 'Cambia qué documentos acreditan la firma: una persona física firma con su identificación; una empresa firma a través de un representante con poder notarial.',
      ejemplo: 'Persona física si es alguien por su propio derecho. Persona moral si es una S.A. de C.V., S. de R.L., A.C., etc.'
    },
    {
      re: /ciudad y estado de jurisdiccion/,
      que: 'La ciudad cuyos tribunales resolverán si hay un pleito.',
      porque: 'Si algo sale mal, el juicio se lleva ahí. Conviene que sea tu ciudad: litigar en otro estado cuesta viáticos, tiempo y un abogado local.',
      ejemplo: 'Querétaro, Querétaro'
    },
    {
      re: /ciudad de firma/,
      que: 'Dónde se firma físicamente el documento.',
      porque: 'Es un dato formal del contrato. No tiene que ser la misma ciudad que la de los tribunales.',
      ejemplo: 'Querétaro, Querétaro'
    },
    {
      re: /fecha de firma/,
      que: 'El día en que se firma.',
      porque: 'Desde esta fecha corren la mayoría de los plazos del contrato.',
      ejemplo: 'Si aún no lo firman, pon la fecha en que planean hacerlo.'
    },
    {
      re: /fecha de inicio/,
      que: 'Cuándo empiezan a correr las obligaciones.',
      porque: 'Puede ser distinta a la fecha de firma: se puede firmar hoy un contrato que arranca el mes que entra.',
      ejemplo: ''
    },
    {
      re: /fecha de termino|fecha de vencimiento/,
      que: 'Cuándo dejan de aplicar las obligaciones.',
      porque: 'Sin fecha de fin, un contrato puede volverse indefinido y complicado de terminar.',
      ejemplo: ''
    },
    {
      re: /interes moratorio/,
      que: 'El recargo que se cobra por cada periodo de retraso en el pago.',
      porque: 'Es lo que desincentiva que te paguen tarde. Sin esto, retrasarse le sale gratis al deudor.',
      ejemplo: 'Se pacta mensual. Cuidado: un interés desproporcionado puede ser reducido por un juez.'
    },
    {
      re: /interes ordinario/,
      que: 'El rendimiento que genera el dinero prestado mientras el plazo corre normalmente.',
      porque: 'Es el costo del préstamo. Se cobra aunque el deudor pague puntual.',
      ejemplo: 'Se pacta mensual, por ejemplo 2%.'
    },
    {
      re: /forma de pago/,
      que: 'Cómo y cuándo se paga.',
      porque: 'Si no queda escrito, cada parte asume algo distinto y ahí empiezan los conflictos.',
      ejemplo: '50% al firmar y 50% contra entrega. O: mensualidades los días 5 de cada mes.'
    },
    {
      re: /datos bancarios|clabe|cuenta/,
      que: 'A dónde se deposita.',
      porque: 'Dejarlo en el contrato evita que después el pago se retrase por no saber a qué cuenta.',
      ejemplo: 'Banco, titular de la cuenta y CLABE de 18 dígitos.'
    },
    {
      re: /domicilio|direccion/,
      que: 'La dirección completa.',
      porque: 'Es el lugar donde legalmente se le pueden entregar avisos y notificaciones a esa parte.',
      ejemplo: 'Calle y número, colonia, código postal, ciudad y estado.'
    },
    {
      re: /descripcion de los servicios|entregables/,
      que: 'Qué se va a hacer exactamente.',
      porque: 'Es la cláusula que más pleitos evita. Entre más específico, menos margen para el "yo entendí otra cosa".',
      ejemplo: 'Di qué se entrega, cuántas revisiones incluye y qué NO está incluido.'
    },
    {
      re: /titular de derechos patrimoniales/,
      que: 'Quién se queda como dueño de lo que se produzca.',
      porque: 'Sin esta cláusula, el autor conserva los derechos aunque el cliente haya pagado. Si el cliente necesita usarlo libremente, tiene que decirlo aquí.',
      ejemplo: 'Normalmente se pone el nombre del cliente.'
    },
    {
      re: /plazo de confidencialidad/,
      que: 'Cuánto tiempo sigue obligando el secreto después de que termina el contrato.',
      porque: 'La información sensible no deja de serlo el día que acaba la relación.',
      ejemplo: '2 años, 3 años, 5 años.'
    },
    {
      re: /dias de aviso|dias para subsanar|dias/,
      que: 'Número de días naturales.',
      porque: 'Poner un plazo concreto evita discutir después qué era "un tiempo razonable".',
      ejemplo: '15, 30, 60…'
    },
    {
      re: /garantia|aval|fiador/,
      que: 'Quién o qué respalda el cumplimiento si la parte obligada falla.',
      porque: 'Es lo que hace cobrable una deuda cuando el deudor no tiene con qué responder.',
      ejemplo: 'Un fiador que firma, un depósito en garantía, o un bien específico.'
    },
    {
      re: /periodicidad de los pagos/,
      que: 'Cada cuánto toca pagar.',
      porque: 'Junto con el día de pago define el calendario completo. Antes esto y la fecha venían en un solo campo y el calendario salía a medias.',
      ejemplo: 'Mensual es lo más común en planes de pago.'
    },
    {
      re: /^dia de pago|dia de pago/,
      que: 'Qué día de cada periodo se paga.',
      porque: 'Fija cuándo empieza la mora. Sin día cierto, discutir un retraso es imposible.',
      ejemplo: 'Los días 5. O bien: los días 1 y 15.'
    },
    {
      re: /^subtotal$|^iva$|^total$|^importe$|^saldo pendiente$/,
      que: 'Se calcula solo con los conceptos que capturaste.',
      porque: 'En un comprobante de pago las cifras tienen que cuadrar entre sí. Calcularlas evita emitir una nota donde el total no corresponde a sus conceptos.',
      ejemplo: 'Si tu caso necesita otra cifra, puedes ajustarla a mano.'
    },
    {
      re: /cedula|experiencia del/,
      que: 'El número de cédula profesional, o una línea sobre la experiencia que respalda el trabajo.',
      porque: 'Acredita que quien presta el servicio está capacitado. En profesiones reguladas la cédula es obligatoria; en las demás basta describir la experiencia.',
      ejemplo: 'Cédula profesional 12345678. O bien: 8 años de experiencia en diseño editorial.'
    },
    {
      re: /plazo de vigencia|plazo del|vigencia|duracion/,
      que: 'Cuánto dura el contrato.',
      porque: 'Define hasta cuándo obligan las cláusulas. Un contrato sin vigencia clara es difícil de terminar sin discusión.',
      ejemplo: '6 meses, 1 año, 24 meses.'
    },
    {
      re: /porcentaje de incremento/,
      que: 'Cuánto sube la renta al renovar.',
      porque: 'Pactarlo desde el inicio evita la negociación incómoda cada año y le da certeza a ambas partes.',
      ejemplo: 'Suele referirse a la inflación anual (INPC) o pactarse fijo, por ejemplo 5%.'
    },
    {
      re: /deposito/,
      que: 'El dinero que se entrega en garantía y se devuelve al final.',
      porque: 'Cubre daños o rentas impagas. No es un pago adelantado: si todo sale bien, se regresa completo.',
      ejemplo: 'Normalmente equivale a uno o dos meses de renta.'
    },
    {
      re: /pena convencional|pena por/,
      que: 'La multa pactada para quien incumpla.',
      porque: 'Evita tener que probar en juicio cuánto costó el incumplimiento: la cantidad ya está acordada.',
      ejemplo: 'Un juez puede reducirla si resulta desproporcionada frente al daño real.'
    },
    {
      re: /honorarios|sueldo|salario/,
      que: 'Cuánto se paga por el trabajo.',
      porque: 'Es la obligación principal de quien contrata. Escríbela sin IVA: el contrato ya menciona el impuesto aparte.',
      ejemplo: 'Solo la cantidad: 25,000.00'
    },
    {
      re: /otras obligaciones|obligaciones adicionales/,
      que: 'Cualquier compromiso extra que quieras dejar por escrito.',
      porque: 'Es el espacio para lo específico de tu caso que la plantilla no puede anticipar.',
      ejemplo: 'Si no se te ocurre nada, puedes poner: las demás previstas en este contrato.'
    },
    {
      re: /razon social|^nombre|nombre del|nombre\/razon/,
      que: 'El nombre completo, tal como aparece en la identificación oficial o en el acta constitutiva.',
      porque: 'Un nombre incompleto o mal escrito puede complicar la ejecución del contrato si hay que reclamarlo.',
      ejemplo: 'Si es empresa, incluye el tipo de sociedad: "Ejemplo, S.A. de C.V."'
    },
    {
      re: /destino del inmueble/,
      que: 'Para qué se va a usar el inmueble.',
      porque: 'Define si el arrendamiento es de casa habitación o comercial, y eso cambia las reglas que le aplican.',
      ejemplo: 'Casa habitación. O: local comercial para venta de ropa.'
    },
    {
      re: /documento que acredita propiedad/,
      que: 'Con qué papel demuestra el dueño que lo es.',
      porque: 'Da certeza de que quien firma tiene derecho a hacerlo. Sin esto se corre el riesgo de contratar con quien no es dueño.',
      ejemplo: 'Escritura pública número X ante el Notario Y, inscrita en el Registro Público.'
    },
  ];

  const AYUDA_GENERICA = {
    que: 'Este dato se inserta tal cual en el texto del contrato.',
    porque: 'Si lo dejas en blanco, el documento saldrá con un hueco marcado y no servirá para firmarse.',
    ejemplo: ''
  };

  function ayudaDeCampo(etiqueta) {
    const n = norm(etiqueta);
    for (const a of AYUDAS) {
      if (a.re.test(n)) return { que: a.que, porque: a.porque, ejemplo: a.ejemplo };
    }
    return AYUDA_GENERICA;
  }

  /* ── Agrupación en secciones ─────────────────────────────────────────
     Una pantalla por campo convierte un contrato de 24 huecos en 24 pasos.
     Agrupar por tema los baja a cinco o seis pantallas con sentido propio. */
  const GRUPOS = [
    {
      clave: 'partes',
      titulo: 'Datos de las partes',
      subtitulo: 'Quiénes firman. Escríbelos como aparecen en su identificación oficial.',
      re: /nombre|razon social|rfc|curp|domicilio|tipo de persona|parte |apoderado|otorgante|aval|testigo|beneficiario|cedula|correo|telefono|nacionalidad|estado civil|ocupacion|edad|identificacion/
    },
    {
      clave: 'objeto',
      titulo: 'De qué trata el acuerdo',
      subtitulo: 'El corazón del contrato: qué se entrega, se renta, se presta o se vende.',
      /* "Cantidad" y "Unidad de medida" describen lo que se vende, y además
         alimentan el Importe: tienen que preguntarse ANTES del grupo de dinero
         o el usuario ve los cálculos en cero. */
      re: /descripcion|objeto|servicios|actividades|obligaciones|funciones|entregables|caracteristicas|destino|inmueble|bien|puesto|jornada|documento que acredita|^cantidad$|unidad de medida|marca, modelo|numero de serie|estado o condicion|conceptos adicionales/
    },
    {
      clave: 'dinero',
      titulo: 'Dinero',
      subtitulo: 'Cuánto, cómo y a dónde se paga.',
      re: /monto|precio|renta|importe|sueldo|salario|honorarios|deposito|pena|anticipo|saldo|adeudo|deuda|valor|interes|tasa|forma de pago|lugar de pago|lugar o cuenta|datos bancarios|clabe|cuenta|parcialidades|periodicidad|con letra|subtotal|^iva$|descuento|^total$|referencia de pago/
    },
    {
      clave: 'plazos',
      titulo: 'Plazos y vigencia',
      subtitulo: 'Cuándo empieza, cuándo acaba y con cuánta anticipación se avisa.',
      re: /fecha de inicio|fecha de termino|fecha de vencimiento|vigencia|plazo|dias|duracion|prorroga|periodo/
    },
    {
      clave: 'cierre',
      titulo: 'Firma y jurisdicción',
      subtitulo: 'Dónde se firma y qué tribunales resuelven si hay un desacuerdo.',
      re: /ciudad de firma|fecha de firma|jurisdiccion|ciudad y estado|fecha de actualizacion/
    },
  ];

  const GRUPO_OTROS = {
    clave: 'otros',
    titulo: 'Detalles adicionales',
    subtitulo: 'Datos específicos de este documento.'
  };

  function grupoDeCampo(etiqueta) {
    const n = norm(etiqueta);
    // El cierre gana sobre los demás: "Ciudad de firma" también casa con "partes".
    const cierre = GRUPOS.find((g) => g.clave === 'cierre');
    if (cierre.re.test(n)) return 'cierre';
    for (const g of GRUPOS) {
      if (g.clave === 'cierre') continue;
      if (g.re.test(n)) return g.clave;
    }
    return 'otros';
  }

  /* Devuelve [{clave, titulo, subtitulo, campos:[]}] conservando el orden en
     que los campos aparecen en el documento dentro de cada grupo. */
  function agrupar(campos) {
    const bolsas = {};
    campos.forEach((c) => {
      const k = grupoDeCampo(c);
      (bolsas[k] = bolsas[k] || []).push(c);
    });
    const orden = GRUPOS.concat([GRUPO_OTROS]);
    const out = [];
    orden.forEach((g) => {
      const lista = bolsas[g.clave];
      if (lista && lista.length) {
        out.push({ clave: g.clave, titulo: g.titulo, subtitulo: g.subtitulo, campos: lista });
      }
    });
    return out;
  }

  /* ── Monto con letra ─────────────────────────────────────────────────
     Es el campo que más gente deja en blanco: nadie quiere escribir
     "cuatrocientos treinta y siete mil quinientos". Se calcula. */
  const UNI = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
    'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
    'veintisiete', 'veintiocho', 'veintinueve'];
  const DEC = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const CEN = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  function decenas(n) {
    if (n < 30) return UNI[n];
    const d = Math.floor(n / 10), u = n % 10;
    return DEC[d] + (u ? ' y ' + UNI[u] : '');
  }

  function centenas(n) {
    if (n === 100) return 'cien';
    const c = Math.floor(n / 100), r = n % 100;
    const a = CEN[c];
    const b = r ? decenas(r) : '';
    return a && b ? a + ' ' + b : (a || b);
  }

  /* "uno" se apocopa antes de mil y de millón: veintiún mil, un millón. */
  function apocope(txt) {
    return txt.replace(/veintiuno$/, 'veintiún').replace(/\buno$/, 'un');
  }

  function enteroALetras(n) {
    if (n === 0) return 'cero';
    let out = '';
    const millones = Math.floor(n / 1e6);
    const resto = n % 1e6;
    const miles = Math.floor(resto / 1000);
    const cientos = resto % 1000;

    if (millones) {
      out += millones === 1 ? 'un millón' : apocope(seccion(millones)) + ' millones';
    }
    if (miles) {
      out += (out ? ' ' : '') + (miles === 1 ? 'mil' : apocope(seccion(miles)) + ' mil');
    }
    if (cientos) {
      out += (out ? ' ' : '') + centenas(cientos);
    }
    return out.trim();

    function seccion(v) {
      return v < 1000 ? centenas(v) : enteroALetras(v);
    }
  }

  /* Acepta "25,000.50", "$25000", "25 000.5". Devuelve '' si no hay número. */
  function montoALetras(valor) {
    /* `valor || ''` convertía el cero en cadena vacía: 0 es falsy. */
    const limpio = String(valor == null ? '' : valor).replace(/[^\d.,]/g, '').replace(/,/g, '');
    if (!limpio) return '';
    const num = parseFloat(limpio);
    if (!isFinite(num) || num < 0) return '';
    const entero = Math.floor(num);
    const centavos = Math.round((num - entero) * 100);
    let txt = enteroALetras(entero);
    if (centavos > 0) txt += ' ' + String(centavos).padStart(2, '0') + '/100';
    return txt;
  }

  /* Qué campo de dinero alimenta a un "monto con letra" dado. Empata por el
     sufijo de la etiqueta: "Monto con letra del pagaré" ← "Monto del pagaré". */
  function campoOrigenDeLetras(etiquetaLetras, todosLosCampos) {
    const candidatos = todosLosCampos.filter((c) => tipoDeCampo(c).tipo === 'dinero');
    if (!candidatos.length) return null;

    /* "Renta con letra" → pista "renta" → empata con "Monto de renta mensual".
       Si lo que queda es una palabra genérica (monto, importe…) no distingue
       nada y se usa el primer campo de dinero del documento. */
    /* "total" NO va aquí: en una nota de venta distingue el Total del Precio
       unitario, que es justo lo que hay que desempatar. */
    const GENERICAS = /^(monto|cantidad|importe|precio|suma|el|la|de|del)$/;
    const pistas = norm(etiquetaLetras)
      .replace(/con letra/, ' ')
      .split(/\s+/)
      .filter((w) => w && !GENERICAS.test(w));

    /* Por niveles, de más estricto a más laxo. Buscar por subcadena a secas
       hacía que "Total con letra" empatara con "Subtotal". */
    for (const p of pistas) {
      const exacto = candidatos.find((c) => norm(c) === p);
      if (exacto) return exacto;
    }
    for (const p of pistas) {
      const palabra = candidatos.find((c) => new RegExp('\\b' + p + '\\b').test(norm(c)));
      if (palabra) return palabra;
    }
    for (const p of pistas) {
      const parcial = candidatos.find((c) => norm(c).indexOf(p) !== -1);
      if (parcial) return parcial;
    }
    return candidatos[0];
  }

  /* ── Aritmética entre campos ─────────────────────────────────────────
     La nota de venta tenía Subtotal, IVA, Descuento y Total como texto libre:
     el usuario tecleaba cada cifra a mano y nada verificaba que la suma
     cuadrara. Se pueden emitir notas donde el total no corresponde a sus
     conceptos, que es exactamente lo que un documento de pago no debe permitir.

     Las fórmulas se declaran por contrato —no globalmente— porque etiquetas
     como "Importe" o "Total" son genéricas y podrían existir en otra plantilla
     con otro significado. */
  function aNumero(v) {
    if (v == null) return 0;
    const limpio = String(v).replace(/[^\d.,-]/g, '').replace(/,/g, '');
    const n = parseFloat(limpio);
    return isFinite(n) ? n : 0;
  }

  function aMoneda(n) {
    if (!isFinite(n)) return '';
    return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const TASA_IVA = 0.16; /* la plantilla rotula la línea como "IVA (16%)" */

  const FORMULAS = {
    '19_nota_pago_venta': {
      'Importe': {
        deps: ['Cantidad', 'Precio unitario'],
        calc: (g) => aNumero(g('Cantidad')) * aNumero(g('Precio unitario')),
        nota: 'Cantidad × precio unitario'
      },
      'Subtotal': {
        deps: ['Importe', 'Importe adicional'],
        calc: (g) => aNumero(g('Importe')) + aNumero(g('Importe adicional')),
        nota: 'Importe + conceptos adicionales'
      },
      'IVA': {
        deps: ['Subtotal', 'Descuento'],
        calc: (g) => (aNumero(g('Subtotal')) - aNumero(g('Descuento'))) * TASA_IVA,
        nota: '16% sobre el subtotal ya con descuento'
      },
      'Total': {
        deps: ['Subtotal', 'Descuento', 'IVA'],
        calc: (g) => aNumero(g('Subtotal')) - aNumero(g('Descuento')) + aNumero(g('IVA')),
        nota: 'Subtotal − descuento + IVA'
      },
      'Saldo pendiente': {
        deps: ['Total', 'Monto pagado'],
        calc: (g) => aNumero(g('Total')) - aNumero(g('Monto pagado')),
        nota: 'Total − lo que ya se pagó'
      },
    },
  };

  function formulaDe(contratoId, campo) {
    const set = FORMULAS[contratoId];
    return (set && set[campo]) || null;
  }

  function tieneFormulas(contratoId) {
    return !!FORMULAS[contratoId];
  }

  /* Evalúa la cadena completa. `visible(campo)` permite tratar como 0 los
     campos que viven en una cláusula opcional apagada —si el usuario no activó
     el IVA, el IVA no suma— y `manual` marca los que el usuario decidió
     escribir a mano, que no se pisan. Varias pasadas en vez de ordenar el
     grafo: la cadena es corta y así no importa en qué orden se declaren. */
  function evaluarFormulas(contratoId, valores, visible, manual) {
    const set = FORMULAS[contratoId];
    if (!set) return {};
    const esVisible = typeof visible === 'function' ? visible : () => true;
    const esManual = typeof manual === 'function' ? manual : () => false;
    const leer = (c) => (esVisible(c) ? valores[c] : 0);
    const salida = {};

    for (let pasada = 0; pasada < 5; pasada++) {
      let cambio = false;
      Object.keys(set).forEach((campo) => {
        if (esManual(campo) || !esVisible(campo)) return;
        const n = set[campo].calc(leer);
        const txt = aMoneda(n);
        if (valores[campo] !== txt) {
          valores[campo] = txt;
          salida[campo] = txt;
          cambio = true;
        }
      });
      if (!cambio) break;
    }
    return salida;
  }

  /* ── Validación ──────────────────────────────────────────────────────
     Solo avisa; nunca bloquea. Un contrato mal validado que no deja avanzar
     es peor que uno con una advertencia visible. */
  function validar(etiqueta, valor) {
    const v = String(valor || '').trim();
    if (!v) return { ok: true, vacio: true };
    const t = tipoDeCampo(etiqueta).tipo;

    if (t === 'rfc') {
      const ok = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(v);
      return ok ? { ok: true } : { ok: false, msg: 'Un RFC lleva 12 caracteres (empresa) o 13 (persona física). Revísalo en tu Constancia de Situación Fiscal.' };
    }
    if (t === 'curp') {
      const ok = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i.test(v);
      return ok ? { ok: true } : { ok: false, msg: 'La CURP lleva exactamente 18 caracteres.' };
    }
    if (t === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return ok ? { ok: true } : { ok: false, msg: 'Revisa el correo: parece que le falta el @ o el dominio.' };
    }
    if (t === 'dinero') {
      const ok = /^[\d,\s]+(\.\d{1,2})?$/.test(v.replace(/^\$/, ''));
      return ok ? { ok: true } : { ok: false, msg: 'Escribe solo la cantidad, sin texto. Por ejemplo: 25,000.00' };
    }
    if (t === 'entero') {
      const ok = /^\d+$/.test(v);
      return ok ? { ok: true } : { ok: false, msg: 'Escribe solo el número de días.' };
    }
    if (t === 'porcentaje') {
      const ok = /^\d+(\.\d+)?$/.test(v.replace(/%$/, '').trim());
      return ok ? { ok: true } : { ok: false, msg: 'Escribe solo el porcentaje. Por ejemplo: 3' };
    }
    return { ok: true };
  }

  /* Fecha en formato legal mexicano para el documento final. */
  function fechaALegible(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ''))) return iso || '';
    const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
      'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const [a, m, d] = iso.split('-').map(Number);
    return `${d} de ${MES[m - 1]} de ${a}`;
  }

  global.CamposIA = {
    tipoDeCampo,
    ayudaDeCampo,
    grupoDeCampo,
    agrupar,
    montoALetras,
    campoOrigenDeLetras,
    validar,
    fechaALegible,
    formulaDe,
    tieneFormulas,
    evaluarFormulas,
    aNumero,
    aMoneda,
  };
})(window);
