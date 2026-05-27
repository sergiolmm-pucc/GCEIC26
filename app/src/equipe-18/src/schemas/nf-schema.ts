import { z } from "zod";

export const nfSchema = z.object({
  productValue: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "O valor do produto é obrigatório" : "Valor inválido",
    })
    .positive("O valor do produto deve ser maior que zero"),
  state: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "O estado é obrigatório" : "Estado inválido",
    })
    .length(2, "O estado deve ter exatamente 2 letras")
    .transform((val) => val.toUpperCase()),
  ncm: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "O código NCM é obrigatório" : "Código NCM inválido",
    })
    .regex(/^\d{4}\.\d{2}\.\d{2}$/, "O NCM deve seguir o formato 0000.00.00"),
  freightValue: z
    .number({
      error: () => "O frete deve ser um número",
    })
    .min(0, "O valor do frete não pode ser negativo")
    .optional()
    .default(0),
  additionalExpenses: z
    .number({
      error: () => "Despesas devem ser um número",
    })
    .min(0, "O valor de outras despesas não pode ser negativo")
    .optional()
    .default(0),
  pisRate: z
    .number({
      error: () => "Alíquota do PIS deve ser um número",
    })
    .min(0, "A alíquota não pode ser negativa")
    .max(100, "A alíquota não pode ser maior que 100%")
    .optional(),
  confinsRate: z
    .number({
      error: () => "Alíquota do COFINS deve ser um número",
    })
    .min(0, "A alíquota não pode ser negativa")
    .max(100, "A alíquota não pode ser maior que 100%")
    .optional(),
});

export type NfFormData = z.infer<typeof nfSchema>;


