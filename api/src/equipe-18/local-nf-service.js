const SIMPLIFIED_ICMS_SOURCE = {
  validFrom: "2026-01-01",
  sourceName: "Tabela simplificada de aliquotas internas de ICMS do projeto academico",
  sourceUrl: "docs/icms-rules.md",
  operationType: "internal",
};

const ICMS_RULES_BY_STATE = {
  AC: { rate: 0.19, ...SIMPLIFIED_ICMS_SOURCE },
  AL: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
  AP: { rate: 0.18, ...SIMPLIFIED_ICMS_SOURCE },
  AM: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
  BA: { rate: 0.205, ...SIMPLIFIED_ICMS_SOURCE },
  CE: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
  DF: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
  ES: { rate: 0.17, ...SIMPLIFIED_ICMS_SOURCE },
  GO: { rate: 0.19, ...SIMPLIFIED_ICMS_SOURCE },
  MA: { rate: 0.22, ...SIMPLIFIED_ICMS_SOURCE },
  MT: { rate: 0.17, ...SIMPLIFIED_ICMS_SOURCE },
  MS: { rate: 0.17, ...SIMPLIFIED_ICMS_SOURCE },
  MG: { rate: 0.18, ...SIMPLIFIED_ICMS_SOURCE },
  PA: { rate: 0.19, ...SIMPLIFIED_ICMS_SOURCE },
  PB: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
  PR: { rate: 0.195, ...SIMPLIFIED_ICMS_SOURCE },
  PE: { rate: 0.205, ...SIMPLIFIED_ICMS_SOURCE },
  PI: { rate: 0.21, ...SIMPLIFIED_ICMS_SOURCE },
  RJ: { rate: 0.22, ...SIMPLIFIED_ICMS_SOURCE },
  RN: { rate: 0.18, ...SIMPLIFIED_ICMS_SOURCE },
  RS: { rate: 0.17, ...SIMPLIFIED_ICMS_SOURCE },
  RO: { rate: 0.195, ...SIMPLIFIED_ICMS_SOURCE },
  RR: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
  SC: { rate: 0.17, ...SIMPLIFIED_ICMS_SOURCE },
  SP: { rate: 0.18, ...SIMPLIFIED_ICMS_SOURCE },
  SE: { rate: 0.19, ...SIMPLIFIED_ICMS_SOURCE },
  TO: { rate: 0.2, ...SIMPLIFIED_ICMS_SOURCE },
};

const ipiRatesByNcm = {
  "2201.10.00": {
    rate: 0.026,
    description: "Aguas minerais e aguas gaseificadas",
    legalSource: "TIPI Receita Federal: NCM 2201.10.00 possui aliquota de IPI de 2,6%",
  },
};

function icmsService(payload) {
  const { productValue, state } = payload;
  
  if (!productValue || productValue <= 0) {
    throw new Error("productValue deve ser maior que zero");
  }
  
  if (!state || typeof state !== "string") {
    throw new Error("state deve ser fornecido");
  }

  const stateUpper = state.toUpperCase();
  const taxRule = ICMS_RULES_BY_STATE[stateUpper];

  if (!taxRule) {
    throw new Error("state deve ser uma UF brasileira valida");
  }

  const icmsAmount = productValue * taxRule.rate;
  const total = productValue + icmsAmount;

  return {
    productValue: productValue.toFixed(2),
    state: stateUpper,
    icmsRate: `${(taxRule.rate * 100).toFixed(2)}%`,
    icmsAmount: icmsAmount.toFixed(2),
    total: total.toFixed(2),
    taxRule: {
      operationType: taxRule.operationType,
      validFrom: taxRule.validFrom,
      sourceName: taxRule.sourceName,
      sourceUrl: taxRule.sourceUrl,
    },
  };
}

function ipiService(payload) {
  const {
    productValue,
    freightValue = 0,
    additionalExpenses = 0,
    ncm,
  } = payload;

  if (!productValue || productValue <= 0) {
    throw new Error("productValue deve ser maior que zero");
  }

  if (!ncm) {
    throw new Error("NCM deve ser fornecido");
  }

  const ipiRule = ipiRatesByNcm[ncm];

  if (!ipiRule) {
    throw new Error("NCM nao suportado para calculo de IPI");
  }

  const calculationBasis = productValue + freightValue + additionalExpenses;
  const ipiAmount = calculationBasis * ipiRule.rate;
  const total = calculationBasis + ipiAmount;

  return {
    ncm,
    productDescription: ipiRule.description,
    productValue: productValue.toFixed(2),
    freightValue: freightValue.toFixed(2),
    additionalExpenses: additionalExpenses.toFixed(2),
    calculationBasis: calculationBasis.toFixed(2),
    ipiRate: `${(ipiRule.rate * 100).toFixed(2)}%`,
    ipiAmount: ipiAmount.toFixed(2),
    total: total.toFixed(2),
    legalSource: ipiRule.legalSource,
  };
}

function pisCofinService(payload) {
  const { productValue, pisRate = 0.0165, confinsRate = 0.076 } = payload;

  if (!productValue || productValue <= 0) {
    throw new Error("productValue inválido");
  }

  const pisAmount = productValue * pisRate;
  const confinsAmount = productValue * confinsRate;
  const totalTax = pisAmount + confinsAmount;
  const total = productValue + totalTax;

  return {
    productValue: productValue.toFixed(2),
    pisRate: `${(pisRate * 100).toFixed(2)}%`,
    pisAmount: pisAmount.toFixed(2),
    confinsRate: `${(confinsRate * 100).toFixed(2)}%`,
    confinsAmount: confinsAmount.toFixed(2),
    totalTax: totalTax.toFixed(2),
    total: total.toFixed(2),
  };
}

function nfCompletaService(payload) {
  const {
    productValue,
    state,
    ncm,
    freightValue = 0,
    additionalExpenses = 0,
    pisRate,
    confinsRate,
  } = payload;

  // 1. Calculate ICMS
  const icmsResult = icmsService({ productValue, state });

  // 2. Calculate IPI
  const ipiResult = ipiService({
    productValue,
    freightValue,
    additionalExpenses,
    ncm,
  });

  // 3. Calculate PIS/COFINS
  const pisResult = pisCofinService({
    productValue,
    pisRate,
    confinsRate,
  });

  // 4. Sum up all values
  const icmsVal = parseFloat(icmsResult.icmsAmount);
  const ipiVal = parseFloat(ipiResult.ipiAmount);
  const pisVal = parseFloat(pisResult.pisAmount);
  const cofinsVal = parseFloat(pisResult.confinsAmount);

  const taxesTotal = icmsVal + ipiVal + pisVal + cofinsVal;
  const grandTotal = productValue + freightValue + additionalExpenses + taxesTotal;

  return {
    productValue: productValue.toFixed(2),
    state: icmsResult.state,
    ncm,
    icms: {
      rate: icmsResult.icmsRate,
      amount: icmsResult.icmsAmount,
      taxRule: {
        operationType: icmsResult.taxRule.operationType,
        validFrom: icmsResult.taxRule.validFrom,
        sourceName: icmsResult.taxRule.sourceName,
        sourceUrl: icmsResult.taxRule.sourceUrl,
      },
    },
    ipi: {
      description: ipiResult.productDescription,
      freightValue: ipiResult.freightValue,
      additionalExpenses: ipiResult.additionalExpenses,
      calculationBasis: ipiResult.calculationBasis,
      rate: ipiResult.ipiRate,
      amount: ipiResult.ipiAmount,
      legalSource: ipiResult.legalSource,
    },
    pisCofins: {
      pisRate: pisResult.pisRate,
      pisAmount: pisResult.pisAmount,
      confinsRate: pisResult.confinsRate,
      confinsAmount: pisResult.confinsAmount,
      totalTax: pisResult.totalTax,
    },
    totals: {
      taxesTotal: taxesTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    },
  };
}

module.exports = {
  icmsService,
  ipiService,
  pisCofinService,
  nfCompletaService,
};
