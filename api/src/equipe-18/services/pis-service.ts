interface PisRequest {
  productValue: number;
  pisRate?: number;
  confinsRate?: number;
}

interface PisResponse {
  productValue: string;
  pisRate: string;
  pisAmount: string;
  confinsRate: string;
  confinsAmount: string;
  totalTax: string;
  total: string;
}

export function pisCofinService(payload: PisRequest): PisResponse {
  const { productValue, pisRate = 0.0165, confinsRate = 0.076 } = payload;

  if (!productValue || productValue <= 0) {
    throw new Error("productValue inválido");
  }

  const pisAmount = productValue * pisRate;
  const confinsAmount = productValue * confinsRate;
  const totalTax = pisAmount + confinsAmount;
  const total = productValue + totalTax;

  return {
    productValue: productValue.toFixed(2),
    pisRate: `${(pisRate * 100).toFixed(2)}%`,
    pisAmount: pisAmount.toFixed(2),
    confinsRate: `${(confinsRate * 100).toFixed(2)}%`,
    confinsAmount: confinsAmount.toFixed(2),
    totalTax: totalTax.toFixed(2),
    total: total.toFixed(2),
  };
}
