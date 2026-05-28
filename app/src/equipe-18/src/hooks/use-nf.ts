import { useMutation } from "@tanstack/react-query";
import { nfService } from "../services/nf-service";
import { NfFormData } from "../schemas/nf-schema";

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

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function useNf() {
  const mutation = useMutation<NfCompletaResponse, AxiosErrorLike, NfFormData>({
    mutationFn: (data: NfFormData) => nfService.calculate(data) as Promise<NfCompletaResponse>,
  });

  return {
    loading: mutation.isPending,
    result: mutation.data,
    error: mutation.error
      ? mutation.error.response?.data?.message ||
        mutation.error.message ||
        "Erro ao calcular a NF Completa"
      : null,
    calculateNf: mutation.mutateAsync,
  };
}
