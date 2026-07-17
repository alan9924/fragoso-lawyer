/* ═══════════════════════════════════════════════════════════════
   FERRO FRAGOSO — Motor de Cálculo Laboral (México)
   Basado en: Ley Federal del Trabajo (LFT) y Art. 93 LISR
   Valores configurables por año fiscal.
   ═══════════════════════════════════════════════════════════════ */

const CONFIG = {
    2026: {
        salarioMinimoDiario: 315.04,       // Zona general
        salarioMinimoFrontera: 474.00,     // Zona libre frontera norte (estimado)
        umaDiario: 117.31,
        diasAguinaldo: 15,                 // Mínimo de ley
    },
    2025: {
        salarioMinimoDiario: 278.80,
        salarioMinimoFrontera: 419.88,
        umaDiario: 113.14,
        diasAguinaldo: 15,
    }
};

// ─── Tabla progresiva Art. 76 LFT (reformado 2023) ───
// Retorna días de vacaciones correspondientes según años de antigüedad
function diasVacacionesPorAntiguedad(aniosCompletos) {
    if (aniosCompletos <= 0) return 0;
    if (aniosCompletos === 1) return 12;
    if (aniosCompletos === 2) return 14;
    if (aniosCompletos === 3) return 16;
    if (aniosCompletos === 4) return 18;
    if (aniosCompletos === 5) return 20;
    // A partir del 6.º año: +2 días cada 5 años de servicio
    const bloque = Math.floor((aniosCompletos - 1) / 5); // bloques de 5 años
    return 20 + (bloque - 0) * 2; // 6-10→22, 11-15→24, 16-20→26...
}
// Corrección: recalcular con la fórmula correcta
function diasVacacionesArt76(aniosCompletos) {
    if (aniosCompletos <= 0) return 0;
    // Años 1-5: 12, 14, 16, 18, 20
    if (aniosCompletos <= 5) return 10 + (aniosCompletos * 2);
    // A partir del año 6: se incrementan 2 días por cada 5 años
    const bloquesExtra = Math.floor((aniosCompletos - 1) / 5) - 0;
    return 20 + (bloquesExtra) * 2;
}

// ─── FUNCIONES PURAS DE CÁLCULO ───

/**
 * Calcula el Salario Diario (SD) y Salario Diario Integrado (SDI)
 */
function calcularSalarios(salarioMensualBruto, prestacionesMensuales, aniosAntiguedad, anioFiscal) {
    const config = CONFIG[anioFiscal] || CONFIG[2026];
    const salarioDiario = salarioMensualBruto / 30;

    // Factor de integración: aguinaldo + prima vacacional sobre vacaciones
    const diasAguinaldo = config.diasAguinaldo;
    const diasVac = diasVacacionesArt76(Math.max(1, aniosAntiguedad));
    const primaVac = 0.25;

    const factorIntegracion = 1 + (diasAguinaldo / 365) + (diasVac * primaVac / 365);
    const sdi = salarioDiario * factorIntegracion;

    // Prestaciones diarias adicionales
    const prestacionesDiarias = prestacionesMensuales / 30;

    return {
        salarioDiario: redondear(salarioDiario),
        sdi: redondear(sdi),
        prestacionesDiarias: redondear(prestacionesDiarias),
        factorIntegracion: redondear(factorIntegracion, 4),
        diasAguinaldo,
        diasVacaciones: diasVac,
    };
}

/**
 * Salario devengado (días trabajados del último periodo no pagado)
 */
function calcularSalarioDevengado(salarioDiario, diasTrabajadosUltimoPeriodo) {
    const monto = salarioDiario * diasTrabajadosUltimoPeriodo;
    return {
        concepto: 'Salario devengado',
        detalle: `$${formatNum(salarioDiario)} × ${diasTrabajadosUltimoPeriodo} días`,
        monto: redondear(monto),
    };
}

/**
 * Aguinaldo proporcional
 * (salarioDiario × diasAguinaldo) / 365 × diasTrabajadosEnElAnio
 */
function calcularAguinaldoProporcional(salarioDiario, diasTrabajadosEnAnio, diasAguinaldo) {
    const monto = (salarioDiario * diasAguinaldo * diasTrabajadosEnAnio) / 365;
    return {
        concepto: 'Aguinaldo proporcional',
        detalle: `$${formatNum(salarioDiario)} × ${diasAguinaldo} días × ${diasTrabajadosEnAnio}/365`,
        monto: redondear(monto),
    };
}

/**
 * Vacaciones proporcionales
 * (diasVacaciones / 365) × diasTrabajadosEnAnio × salarioDiario
 */
function calcularVacacionesProporcionales(salarioDiario, aniosAntiguedad, diasTrabajadosEnAnio, diasGozados) {
    const diasCorrespondientes = diasVacacionesArt76(Math.max(1, aniosAntiguedad));
    const proporcional = (diasCorrespondientes / 365) * diasTrabajadosEnAnio;
    const diasPendientes = Math.max(0, proporcional - diasGozados);
    const monto = diasPendientes * salarioDiario;
    return {
        concepto: 'Vacaciones proporcionales',
        detalle: `${redondear(diasPendientes, 1)} días × $${formatNum(salarioDiario)}`,
        detalleExtra: `(${diasCorrespondientes} días/año, proporcional ${redondear(proporcional,1)} − ${diasGozados} gozados)`,
        monto: redondear(monto),
        diasPendientes: redondear(diasPendientes, 1),
    };
}

/**
 * Prima vacacional (25% sobre vacaciones proporcionales)
 */
function calcularPrimaVacacional(montoVacaciones) {
    const monto = montoVacaciones * 0.25;
    return {
        concepto: 'Prima vacacional (25%)',
        detalle: `25% sobre $${formatNum(montoVacaciones)}`,
        monto: redondear(monto),
    };
}

/**
 * Indemnización constitucional: 90 días de SDI (Art. 48 LFT)
 */
function calcularIndemnizacion90Dias(sdi) {
    const monto = sdi * 90;
    return {
        concepto: 'Indemnización constitucional (90 días)',
        detalle: `$${formatNum(sdi)} SDI × 90 días`,
        monto: redondear(monto),
    };
}

/**
 * 20 días por año trabajado (Art. 50 fracc. II LFT)
 */
function calcular20DiasPorAnio(sdi, aniosTrabajados) {
    const monto = sdi * 20 * aniosTrabajados;
    return {
        concepto: '20 días por año de servicio',
        detalle: `$${formatNum(sdi)} SDI × 20 × ${aniosTrabajados} años`,
        monto: redondear(monto),
    };
}

/**
 * Prima de antigüedad: 12 días por año, tope doble UMA (Art. 162 LFT)
 */
function calcularPrimaAntiguedad(salarioDiario, aniosTrabajados, umaDiario) {
    const topeDobleUMA = umaDiario * 2;
    const salarioBase = Math.min(salarioDiario, topeDobleUMA);
    const monto = salarioBase * 12 * aniosTrabajados;
    const topado = salarioDiario > topeDobleUMA;
    return {
        concepto: 'Prima de antigüedad',
        detalle: `$${formatNum(salarioBase)}${topado ? ' (topado 2×UMA)' : ''} × 12 × ${aniosTrabajados} años`,
        monto: redondear(monto),
        topado,
    };
}

/**
 * ISR sobre indemnización (Art. 93 LISR)
 * Exención: 90 × UMA diario × 365 (anualizado) × años de servicio
 * En la práctica: 90 veces el salario mínimo del área geográfica por año
 */
function calcularISRIndemnizacion(montoLiquidacion, aniosServicio, umaDiario) {
    const exencionAnual = 90 * umaDiario;
    const exencionTotal = exencionAnual * aniosServicio;
    const baseGravable = Math.max(0, montoLiquidacion - exencionTotal);

    // Tasa efectiva estimada (simplificada para efectos de la calculadora)
    // En la realidad el patrón retiene conforme al Art. 96 LISR
    let tasaEstimada = 0;
    if (baseGravable > 0) {
        if (baseGravable <= 50000) tasaEstimada = 0.10;
        else if (baseGravable <= 150000) tasaEstimada = 0.17;
        else if (baseGravable <= 300000) tasaEstimada = 0.21;
        else if (baseGravable <= 500000) tasaEstimada = 0.25;
        else tasaEstimada = 0.30;
    }

    const isrEstimado = redondear(baseGravable * tasaEstimada);

    return {
        concepto: 'ISR estimado sobre indemnización',
        exencionTotal: redondear(exencionTotal),
        baseGravable: redondear(baseGravable),
        tasaEstimada: `${(tasaEstimada * 100).toFixed(0)}%`,
        monto: isrEstimado, // Nota: monto es el ISR a pagar (se resta)
        detalle: `Exención: $${formatNum(exencionTotal)} | Gravable: $${formatNum(baseGravable)} × ${(tasaEstimada*100).toFixed(0)}%`,
    };
}

// ─── ORQUESTADOR PRINCIPAL ───

/**
 * Ejecuta el cálculo completo basado en los datos del cuestionario.
 * @param {Object} datos - Datos del cuestionario
 * @returns {Object} Resultado con desglose completo
 */
function calcularFiniquitoLiquidacion(datos) {
    const {
        motivo,           // 'renuncia' | 'despido_injustificado' | 'despido_justificado' | 'fin_contrato'
        fechaIngreso,     // Date
        fechaSalida,      // Date
        salarioMensual,   // Number
        prestaciones,     // Number
        zona,             // 'general' | 'frontera'
        diasVacGozados,   // Number (default 0)
    } = datos;

    const anioFiscal = fechaSalida.getFullYear();
    const config = CONFIG[anioFiscal] || CONFIG[2026];

    // ── Calcular antigüedad ──
    const diffMs = fechaSalida - fechaIngreso;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const aniosCompletos = Math.floor(diffDias / 365.25);
    const aniosTrabajados = Math.max(1, aniosCompletos); // Mínimo 1 año para cálculos

    // Días trabajados en el año de salida
    const inicioAnio = new Date(fechaSalida.getFullYear(), 0, 1);
    const fechaRef = fechaIngreso > inicioAnio ? fechaIngreso : inicioAnio;
    const diasEnAnio = Math.floor((fechaSalida - fechaRef) / (1000 * 60 * 60 * 24)) + 1;

    // Días trabajados en el último mes (para salario devengado)
    const inicioMes = new Date(fechaSalida.getFullYear(), fechaSalida.getMonth(), 1);
    const diasUltimoPeriodo = fechaSalida.getDate();

    // ── Salarios ──
    const salarios = calcularSalarios(salarioMensual, prestaciones, aniosCompletos, anioFiscal);

    // ═══ FINIQUITO (siempre aplica) ═══
    const finiquito = [];
    finiquito.push(calcularSalarioDevengado(salarios.salarioDiario, diasUltimoPeriodo));
    finiquito.push(calcularAguinaldoProporcional(salarios.salarioDiario, diasEnAnio, salarios.diasAguinaldo));

    const vacResult = calcularVacacionesProporcionales(
        salarios.salarioDiario, aniosCompletos, diasEnAnio, diasVacGozados || 0
    );
    finiquito.push(vacResult);
    finiquito.push(calcularPrimaVacacional(vacResult.monto));

    const totalFiniquito = finiquito.reduce((sum, item) => sum + item.monto, 0);

    // ═══ LIQUIDACIÓN (condicional) ═══
    const liquidacion = [];
    let totalLiquidacion = 0;
    let isrResult = null;

    const incluyeLiquidacion = motivo === 'despido_injustificado';

    if (incluyeLiquidacion) {
        liquidacion.push(calcularIndemnizacion90Dias(salarios.sdi));
        liquidacion.push(calcular20DiasPorAnio(salarios.sdi, aniosTrabajados));
        liquidacion.push(calcularPrimaAntiguedad(
            salarios.salarioDiario, aniosTrabajados, config.umaDiario
        ));

        totalLiquidacion = liquidacion.reduce((sum, item) => sum + item.monto, 0);

        // ISR sobre indemnización
        isrResult = calcularISRIndemnizacion(totalLiquidacion, aniosTrabajados, config.umaDiario);
    }

    // Prima de antigüedad para fin de contrato (solo si 15+ años)
    if (motivo === 'fin_contrato' && aniosCompletos >= 15) {
        const prima = calcularPrimaAntiguedad(
            salarios.salarioDiario, aniosTrabajados, config.umaDiario
        );
        liquidacion.push(prima);
        totalLiquidacion = prima.monto;
    }

    // ═══ TOTALES ═══
    const totalBruto = totalFiniquito + totalLiquidacion;
    const isrMonto = isrResult ? isrResult.monto : 0;
    const totalNeto = totalBruto - isrMonto;

    return {
        // Metadata
        motivo,
        fechaIngreso,
        fechaSalida,
        antiguedad: { anios: aniosCompletos, diasTotales: diffDias },
        salarios,
        config,
        zona,

        // Desglose
        finiquito,
        liquidacion,
        isr: isrResult,
        incluyeLiquidacion,

        // Totales
        totalFiniquito: redondear(totalFiniquito),
        totalLiquidacion: redondear(totalLiquidacion),
        isrMonto: redondear(isrMonto),
        totalBruto: redondear(totalBruto),
        totalNeto: redondear(totalNeto),
    };
}

// ─── UTILIDADES ───

function redondear(num, decimales = 2) {
    const factor = Math.pow(10, decimales);
    return Math.round(num * factor) / factor;
}

function formatNum(num) {
    return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatMoneda(num) {
    return '$' + formatNum(num);
}
