export type BrazilianState =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO"
  | "MA" | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI"
  | "RJ" | "RN" | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";

export type TaxRegime = "cumulativo" | "nao-cumulativo";

export interface IcmsTaxRuleMetadata {
  operationType: "internal";
  validFrom: string;
  sourceName: string;
  sourceUrl: string;
}

export interface IcmsCalculationResult {
  productValue: string;
  state: BrazilianState;
  icmsRate: string;
  icmsAmount: string;
  total: string;
  taxRule: IcmsTaxRuleMetadata;
}

export interface IpiCalculationResult {
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

export interface PisCofinsCalculationResult {
  revenue: number;
  regime: TaxRegime;
  pisRate: number;
  cofinsRate: number;
  pisAmount: number;
  cofinsAmount: number;
  totalAmount: number;
}

export interface NfCalculationResult {
  productValue: number;
  icms: IcmsCalculationResult;
  ipi: IpiCalculationResult;
  pisCofins: PisCofinsCalculationResult;
  totalTaxes: number;
  netAmount: number;
}
