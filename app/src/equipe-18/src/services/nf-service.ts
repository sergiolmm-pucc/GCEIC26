import apiClient from "./api-client";
import { NfFormData } from "../schemas/nf-schema";

export const nfService = {
  async calculate(data: NfFormData): Promise<unknown> {
    const payload = {
      productValue: Number(data.productValue),
      state: data.state,
      ncm: data.ncm,
      freightValue: Number(data.freightValue || 0),
      additionalExpenses: Number(data.additionalExpenses || 0),
      ...(data.pisRate !== undefined && data.pisRate !== null
        ? { pisRate: Number(data.pisRate) / 100 }
        : {}),
      ...(data.confinsRate !== undefined && data.confinsRate !== null
        ? { confinsRate: Number(data.confinsRate) / 100 }
        : {}),
    };

    const response = await apiClient.post("/impostos/nf-completa", payload);
    return response.data;
  }
};


