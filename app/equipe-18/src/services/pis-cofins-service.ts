import apiClient from "./api-client";
import { PisCofinsFormData } from "../schemas/pis-cofins-schema";

export interface PisCofinsResponse {
  productValue: string;
  pisRate: string;
  pisAmount: string;
  confinsRate: string;
  confinsAmount: string;
  totalTax: string;
  total: string;
}

export const pisCofinsService = {
  async calculate(data: PisCofinsFormData): Promise<PisCofinsResponse> {
    const payload = {
      productValue: Number(data.productValue),
      pisRate: Number(data.pisRate),
      confinsRate: Number(data.confinsRate),
    };
    const response = await apiClient.post<PisCofinsResponse>("/impostos/pis-cofins", payload);
    return response.data;
  },
};
