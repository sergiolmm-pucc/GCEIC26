import type { NfCompletaInput } from "../schemas/nf-completa-schema";
import { icmsService } from "./icms-service";
import { ipiService } from "./ipi-service";
import { pisCofinService } from "./pis-service";

export interface NfCompletaResponse {
  productValue: string;
  state: string;
  ncm: string;
  icms: {
    rate: string;
    amount: string;
    taxRule: {
      operationType: string;
      validFrom: string;
      sourceName: string;
      sourceUrl: string;
    };
  };
  ipi: {
    description: string;
    freightValue: string;
    additionalExpenses: string;
    calculationBasis: string;
    rate: string;
    amount: string;
    legalSource: string;
  };
  pisCofins: {
    pisRate: string;
    pisAmount: string;
    confinsRate: string;
    confinsAmount: string;
    totalTax: string;
  };
  totals: {
    taxesTotal: string;
    grandTotal: string;
  };
}

export function nfCompletaService(
  payload: NfCompletaInput,
): NfCompletaResponse {
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
  const grandTotal =
    productValue + freightValue + additionalExpenses + taxesTotal;

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
