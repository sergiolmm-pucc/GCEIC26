import { z } from "zod";

export const ipiSchema = z.object({
  productValue: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "O valor do produto é obrigatório" : "Valor inválido",
    })
    .positive("O valor deve ser maior que zero"),
  freightValue: z
    .number({
      error: () => "O frete deve ser um número",
    })
    .min(0, "O valor do frete não pode ser negativo")
    .optional()
    .default(0),
  additionalExpenses: z
    .number({
      error: () => "As despesas acessórias devem ser um número",
    })
    .min(0, "As despesas acessórias não podem ser negativas")
    .optional()
    .default(0),
  ncm: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "O código NCM é obrigatório" : "Código NCM inválido",
    })
    .regex(/^\d{4}\.\d{2}\.\d{2}$/, "O NCM deve seguir o formato 0000.00.00"),
});

export type IpiFormData = z.infer<typeof ipiSchema>;
