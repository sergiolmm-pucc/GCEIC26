import { useMutation } from "@tanstack/react-query";
import { IcmsFormData } from "../schemas/icms-schema";
import { icmsService } from "../services/icms-service";
import { IcmsCalculationResult } from "../types/tax";

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function useIcms() {
  const mutation = useMutation<IcmsCalculationResult, AxiosErrorLike, IcmsFormData>({
    mutationFn: (data: IcmsFormData) => icmsService.calculate(data),
  });

  return {
    loading: mutation.isPending,
    result: mutation.data,
    error: mutation.error
      ? mutation.error.response?.data?.message ||
        mutation.error.message ||
        "Erro ao calcular o ICMS"
      : null,
    calculateIcms: mutation.mutateAsync,
  };
}
