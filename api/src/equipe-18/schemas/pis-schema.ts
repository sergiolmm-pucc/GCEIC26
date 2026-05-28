export const pisSchema = {
  type: "object" as const,
  required: ["productValue"],
  properties: {
    productValue: {
      type: "number",
      minimum: 0.01,
      description: "Valor do produto em reais",
    },
    pisRate: {
      type: "number",
      default: 0.0165,
      description: "Taxa de PIS (0-1, padrão 1,65%)",
    },
    confinsRate: {
      type: "number",
      default: 0.076,
      description: "Taxa de CONFINS (0-1, padrão 7,6%)",
    },
  },
};
