import { z } from "zod";

export const ipiCalculationSchema = z.object({
  productValue: z.number().positive("productValue deve ser maior que zero"),
  freightValue: z
    .number()
    .min(0, "freightValue nao pode ser negativo")
    .optional()
    .default(0),
  additionalExpenses: z
    .number()
    .min(0, "additionalExpenses nao pode ser negativo")
    .optional()
    .default(0),
  ncm: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/, {
    message: "ncm deve seguir o formato 0000.00.00",
  }),
});

export type IpiCalculationInput = z.input<typeof ipiCalculationSchema>;
