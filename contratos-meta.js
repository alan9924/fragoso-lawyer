/* ============================================================================
   FERRO FRAGOSO — Metadatos informativos por contrato (para la tarjeta de detalle)
   Complementa a CONTRATOS (contratos.js) con: queEs, cuandoSeUsa, validez.
   El "contenido del documento" se deriva automáticamente de los encabezados
   de cláusula (bloques t:"h"/"sub") definidos en cada plantilla.
   ============================================================================ */

const CONTRATOS_META = {
  "01_prestacion_servicios": {
    queEs: "Contrato mediante el cual una persona o empresa (el Prestador) se obliga a realizar servicios profesionales a cambio de honorarios, sin que exista subordinación ni relación laboral entre las partes.",
    cuandoSeUsa: "Al contratar freelancers, consultores, agencias o profesionistas independientes para un proyecto o servicio determinado; o cuando tú mismo prestas el servicio y quieres formalizar la relación con tu cliente.",
    validez: "Tiene validez desde su firma. Su vigencia es la que pacten las partes (fecha de inicio y término), prorrogable por escrito. Puede darse por terminado anticipadamente con el aviso pactado, o rescindirse por incumplimiento."
  },
  "02_arrendamiento": {
    queEs: "Contrato mediante el cual el propietario de un inmueble (Arrendador) concede su uso y goce temporal a otra persona (Arrendatario) a cambio del pago de una renta.",
    cuandoSeUsa: "Al rentar una casa, departamento, oficina o local, ya sea como propietario que busca formalizar la renta o como inquilino que quiere dejar claras las condiciones del arrendamiento.",
    validez: "Es válido desde su firma. Tiene la vigencia forzosa que se pacte (fecha de inicio y término); en arrendamiento de vivienda, los incrementos de renta están limitados por la ley local. Puede rescindirse por falta de pago o incumplimiento grave."
  },
  "03_compraventa": {
    queEs: "Contrato mediante el cual el Vendedor transfiere la propiedad de un bien al Comprador a cambio de un precio cierto y en dinero.",
    cuandoSeUsa: "Al comprar o vender bienes muebles (vehículos, maquinaria, equipo, mercancía) o como contrato preparatorio de la compraventa de un inmueble antes de la escrituración ante notario.",
    validez: "Tiene validez desde su firma y la transmisión de propiedad ocurre conforme a lo pactado (contra pago o en la entrega). Para inmuebles de valor relevante, la ley exige además escritura pública ante notario para su plena validez frente a terceros."
  },
  "04_nda": {
    queEs: "Documento legal mediante el cual una o ambas partes se comprometen a no divulgar ni usar indebidamente la información confidencial que se comparte durante una negociación, colaboración o relación comercial.",
    cuandoSeUsa: "Antes de iniciar pláticas con inversionistas, socios potenciales, proveedores o empleados que tendrán acceso a información sensible, como bases de datos, procesos internos, secretos industriales o planes de negocio.",
    validez: "Adquiere validez legal desde su firma por ambas partes. La obligación de confidencialidad permanece vigente por el plazo pactado, contado a partir de la firma o de la terminación de la relación, según se establezca."
  },
  "05_mutuo": {
    queEs: "Contrato de préstamo de dinero mediante el cual el Mutuante entrega una cantidad al Mutuatario, quien se obliga a devolver la misma cantidad en el plazo pactado, con o sin intereses.",
    cuandoSeUsa: "Al prestar o pedir prestado dinero entre particulares, empresas, familiares o socios, y se quiere dejar constancia por escrito del monto, plazo, intereses y forma de devolución.",
    validez: "Es válido desde el momento en que se entrega el dinero y se firma el contrato. Es exigible desde la fecha de devolución pactada; conviene acompañarlo de un pagaré para dotarlo de mayor fuerza ejecutiva ante un eventual incumplimiento."
  },
  "06_comodato": {
    queEs: "Contrato mediante el cual el Comodante presta gratuitamente un bien (no dinero) al Comodatario, quien se obliga a devolver ese mismo bien al término del plazo.",
    cuandoSeUsa: "Al prestar de forma gratuita bienes como equipo, vehículos, inmuebles o mobiliario a un tercero, dejando claro el uso permitido, el plazo y la responsabilidad por daños.",
    validez: "Tiene validez desde su firma y la entrega del bien. Dura el plazo pactado; el Comodante puede exigir la devolución anticipada si tiene una necesidad urgente del bien, conforme al Código Civil."
  },
  "07_contrato_trabajo": {
    queEs: "Contrato mediante el cual una persona (Trabajador) se obliga a prestar un servicio personal subordinado a un Patrón, a cambio de un salario, conforme a la Ley Federal del Trabajo.",
    cuandoSeUsa: "Al contratar formalmente a un empleado, ya sea por tiempo determinado, indeterminado o para obra o proyecto específico, dejando establecidos puesto, salario, jornada y prestaciones.",
    validez: "Es válido y exigible desde su firma, incluso si no existe contrato escrito (la ley protege al trabajador en ese caso). Su vigencia depende del tipo pactado; debe respetar en todo momento los mínimos de ley (salario mínimo, jornada, prestaciones)."
  },
  "08_renuncia_finiquito": {
    queEs: "Par de documentos: la carta de renuncia, con la que el trabajador da por terminada voluntariamente la relación laboral, y el recibo finiquito, que documenta el pago final de salarios y prestaciones proporcionales.",
    cuandoSeUsa: "Cuando un trabajador decide dejar su empleo de forma voluntaria y es necesario formalizar la salida y liquidar las prestaciones que le corresponden (aguinaldo, vacaciones, prima vacacional, etc.).",
    validez: "La renuncia surte efectos desde la fecha señalada en la carta. El recibo finiquito tiene validez como comprobante de pago desde su firma; una vez cubierto y firmado, el trabajador se da por pagado sin reservarse acción legal por esos conceptos."
  },
  "09_aviso_privacidad": {
    queEs: "Documento obligatorio mediante el cual una empresa o persona informa a los titulares de datos personales qué información recaba, para qué la usa y cómo pueden ejercer sus derechos, conforme a la LFPDPPP.",
    cuandoSeUsa: "Al recabar datos personales de clientes, usuarios o empleados —en un sitio web, app, formulario físico o punto de venta—; es un requisito legal para cualquier negocio que trate datos personales en México.",
    validez: "Debe estar disponible y vigente desde que se recaban los datos personales, y actualizarse cada vez que cambien las finalidades del tratamiento. Su ausencia o deficiencia puede generar sanciones del INAI."
  },
  "10_terminos_condiciones": {
    queEs: "Documento que regula el acceso y uso de un sitio web o aplicación: reglas de uso, propiedad intelectual, pagos, responsabilidades y jurisdicción aplicable entre el operador de la plataforma y sus usuarios.",
    cuandoSeUsa: "Al operar un sitio web, tienda en línea o aplicación, para dejar claras las reglas de uso, limitar responsabilidad y cumplir con la normativa de protección al consumidor y comercio electrónico.",
    validez: "Rige desde su publicación y aceptación por el usuario (uso de la plataforma). El Titular puede modificarlo; los cambios surten efecto al publicarse, por lo que conviene mantener la fecha de actualización visible."
  },
  "11_pagare": {
    queEs: "Título de crédito mediante el cual una persona se obliga incondicionalmente a pagar una cantidad determinada de dinero a favor de otra, en una fecha y lugar establecidos.",
    cuandoSeUsa: "Para garantizar el pago de un préstamo, una deuda o una compra a crédito, dando a quien lo recibe la posibilidad de exigir el cobro por la vía ejecutiva mercantil si no se paga.",
    validez: "Es válido desde su firma, siempre que cumpla los requisitos del art. 170 LGTOC (mención \"pagaré\", promesa incondicional, monto, fecha y lugar de pago, firma). Es exigible a partir de la fecha de vencimiento pactada."
  },
  "12_pacto_socios": {
    queEs: "Convenio entre los socios de una sociedad que complementa los estatutos sociales, regulando la gobernanza, el ingreso y salida de capital, el vesting de fundadores y otros derechos entre socios.",
    cuandoSeUsa: "Al formar una startup o empresa con dos o más socios, para dejar claras las reglas de reparto, permanencia, venta de participaciones y toma de decisiones antes de que surjan conflictos.",
    validez: "Es válido desde su firma por todos los socios, como contrato parasocial de libertad contractual. Su vigencia suele ligarse a la permanencia de los socios en la sociedad; conviene revisarlo en cada ronda de inversión o cambio societario relevante."
  },
  "13_carta_poder": {
    queEs: "Documento mediante el cual una persona (otorgante) autoriza a otra (apoderado) a realizar un acto o trámite específico en su nombre, firmado ante dos testigos.",
    cuandoSeUsa: "Para trámites administrativos puntuales que no requieren poder notarial, como recoger documentos, cobrar un cheque o representar a alguien en una gestión concreta ante una autoridad o empresa.",
    validez: "Es válida desde su firma junto con la de los dos testigos. Se extingue automáticamente al realizarse el acto para el que fue otorgada, o en la fecha límite que se establezca en el documento."
  },
  "14_poder_general": {
    queEs: "Documento (proyecto para notaría) mediante el cual una persona otorga a otra facultades amplias de representación: para pleitos y cobranzas, actos de administración y/o actos de dominio, conforme al art. 2554 del Código Civil Federal.",
    cuandoSeUsa: "Cuando se necesita que alguien más represente legalmente a una persona o empresa de forma amplia y continua —por ejemplo, un socio, gerente o familiar— ante autoridades, bancos o para administrar o vender bienes.",
    validez: "Este formato es una minuta o proyecto: para tener validez plena y ser oponible frente a terceros, debe protocolizarse ante Notario Público, especialmente si incluye actos de dominio. Rige hasta su revocación o el plazo pactado."
  },
  "15_declaracion_protesta": {
    queEs: "Manifestación por escrito en la que una persona declara, bajo protesta de decir verdad, uno o varios hechos, asumiendo responsabilidad legal sobre su veracidad.",
    cuandoSeUsa: "En trámites administrativos o ante instituciones que exigen que el interesado manifieste formalmente hechos o circunstancias (domicilio, ingresos, estado civil, antecedentes, etc.) bajo su responsabilidad.",
    validez: "Tiene validez desde su firma. Declarar con falsedad puede tener consecuencias legales, incluso penales, dependiendo de la autoridad ante la que se presente."
  },
  "16_reconocimiento_adeudo": {
    queEs: "Convenio mediante el cual el Deudor reconoce expresamente una deuda existente frente al Acreedor y ambos pactan un calendario de pagos para liquidarla.",
    cuandoSeUsa: "Cuando existe una deuda previa (por ejemplo, de un préstamo informal o un servicio no pagado) y se quiere documentar el monto exacto y acordar un plan de pagos claro antes de tomar acciones legales.",
    validez: "Es válido y exigible desde su firma por ambas partes. El plan de pagos rige durante el plazo pactado; el incumplimiento de las parcialidades acordadas da derecho a exigir el saldo total de forma anticipada."
  },
  "17_recibo_renta": {
    queEs: "Comprobante mediante el cual el Arrendador hace constar que recibió del Arrendatario el pago de la renta correspondiente a un periodo determinado.",
    cuandoSeUsa: "Cada vez que se cobra o se paga la renta de un inmueble arrendado, como evidencia del pago y para mantener al corriente el historial de pagos entre arrendador y arrendatario.",
    validez: "Tiene validez como comprobante desde el momento de su firma por el Arrendador. No sustituye al CFDI que, en su caso, deba emitirse conforme a la legislación fiscal vigente."
  },
  "18_viaje_menores": {
    queEs: "Documento (proyecto para notaría o autoridad migratoria) mediante el cual quienes ejercen la patria potestad o tutela de un menor autorizan su viaje, solo o acompañado, dentro o fuera del país.",
    cuandoSeUsa: "Cuando un menor de edad viajará sin ambos padres o tutores presentes —por ejemplo, con uno solo de ellos, con un familiar o con un grupo escolar—, especialmente en viajes internacionales.",
    validez: "Este formato es un proyecto: para viajes internacionales, el Instituto Nacional de Migración exige el Formato SAM oficial o la autorización ratificada ante notario o autoridad consular. Verifique los requisitos vigentes del INM antes de viajar."
  },
  "19_nota_pago_venta": {
    queEs: "Comprobante privado de uso comercial que documenta una venta o un pago recibido, detallando los bienes o servicios entregados, el importe cobrado y los datos de ambas partes.",
    cuandoSeUsa: "En ventas de mostrador, entregas de mercancía, anticipos o pagos entre particulares en los que no se emite factura y aun así se quiere dejar constancia escrita de lo cobrado y lo entregado.",
    validez: "Vale como prueba de la operación entre las partes desde que se firma. No es un comprobante fiscal: no ampara deducciones ni acreditamiento de IVA o ISR. Cuando la operación deba facturarse, hay que emitir además el CFDI correspondiente."
  }
};

if (typeof window !== "undefined") window.CONTRATOS_META = CONTRATOS_META;
if (typeof module !== "undefined") module.exports = { CONTRATOS_META };
