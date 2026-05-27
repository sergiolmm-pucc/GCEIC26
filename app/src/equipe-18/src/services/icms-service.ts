import { IcmsFormData } from "../schemas/icms-schema";
import { IcmsCalculationResult } from "../types/tax";
import apiClient from "./api-client";

export const icmsService = {
  async calculate(data: IcmsFormData): Promise<IcmsCalculationResult> {
    const payload = {
      productValue: Number(data.productValue),
      state: data.state,
    };

    const response = await apiClient.post<IcmsCalculationResult>("/impostos/icms", payload);
    return response.data;
  }
};
