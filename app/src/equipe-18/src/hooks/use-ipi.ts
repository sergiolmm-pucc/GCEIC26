import { useMutation } from "@tanstack/react-query";
import { IpiFormData } from "../schemas/ipi-schema";
import { ipiService } from "../services/ipi-service";
import { IpiCalculationResult } from "../types/tax";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function useIpi() {
  const mutation = useMutation<IpiCalculationResult, AxiosErrorLike, IpiFormData>({
    mutationFn: (data: IpiFormData) => ipiService.calculate(data),
  });

  return {
    loading: mutation.isPending,
    result: mutation.data,
    error: mutation.error
      ? mutation.error.response?.data?.message ||
        mutation.error.message ||
        "Erro ao calcular o IPI"
      : null,
    calculateIpi: mutation.mutateAsync,
  };
}
