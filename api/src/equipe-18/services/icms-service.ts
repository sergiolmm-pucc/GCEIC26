import { icmsCalculationSchema } from "../schemas/icms-schema";

type StateCode =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

interface IcmsCalculationResponse {
  productValue: string;
  state: StateCode;
  icmsRate: string;
  icmsAmount: string;
  total: string;
  taxRule: IcmsTaxRuleMetadata;
}

interface IcmsTaxRule {
  rate: number;
  validFrom: string;
  sourceName: string;
  sourceUrl: string;
  operationType: "internal";
}

interface IcmsTaxRuleMetadata {
  operationType: "internal";
  validFrom: string;
  sourceName: string;
  sourceUrl: string;
}

const SIMPLIFIED_ICMS_SOURCE = {
  validFrom: "2026-01-01",
  sourceName:
    "Tabela simplificada de aliquotas internas de ICMS do projeto academico",
  sourceUrl: "docs/icms-rules.md",
  operationType: "internal" as const,
};

export const ICMS_RULES_BY_STATE: Record<StateCode, IcmsTaxRule> = {
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

export function icmsService(payload: unknown): IcmsCalculationResponse {
  const { productValue, state } = icmsCalculationSchema.parse(payload);
  const taxRule = ICMS_RULES_BY_STATE[state as StateCode];

  if (taxRule === undefined) {
    throw new Error("state deve ser uma UF brasileira valida");
  }

  const icmsAmount = productValue * taxRule.rate;
  const total = productValue + icmsAmount;

  return {
    productValue: productValue.toFixed(2),
    state: state as StateCode,
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
