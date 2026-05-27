import { IpiFormData } from "../schemas/ipi-schema";
import { IpiCalculationResult } from "../types/tax";
import apiClient from "./api-client";

export const ipiService = {
  async calculate(data: IpiFormData): Promise<IpiCalculationResult> {
    const payload = {
      productValue: Number(data.productValue),
      freightValue: Number(data.freightValue || 0),
      additionalExpenses: Number(data.additionalExpenses || 0),
      ncm: data.ncm,
    };

    const response = await apiClient.post<IpiCalculationResult>("/impostos/ipi", payload);
    return response.data;
  }
};
