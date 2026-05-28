import type { IpiCalculationInput } from "../schemas/ipi-schema";

interface IpiCalculationResponse {
  ncm: string;
  productDescription: string;
  productValue: string;
  freightValue: string;
  additionalExpenses: string;
  calculationBasis: string;
  ipiRate: string;
  ipiAmount: string;
  total: string;
  legalSource: string;
}

const ipiRatesByNcm = {
  "2201.10.00": {
    rate: 0.026,
    description: "Aguas minerais e aguas gaseificadas",
    legalSource:
      "TIPI Receita Federal: NCM 2201.10.00 possui aliquota de IPI de 2,6%",
  },
} as const;

export function ipiService(
  payload: IpiCalculationInput,
): IpiCalculationResponse {
  const {
    productValue,
    freightValue = 0,
    additionalExpenses = 0,
    ncm,
  } = payload;

  if (productValue <= 0) {
    throw new Error("productValue deve ser maior que zero");
  }

  const ipiRule = ipiRatesByNcm[ncm as keyof typeof ipiRatesByNcm];

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
