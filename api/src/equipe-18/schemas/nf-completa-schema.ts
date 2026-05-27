import { z } from "zod";

export const nfCompletaSchema = z.object({
  productValue: z.number().positive("productValue deve ser maior que zero"),
  state: z
    .string()
    .trim()
    .length(2, "state deve ser uma UF com 2 letras")
    .transform((state) => state.toUpperCase()),
  ncm: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/, {
    message: "ncm deve seguir o formato 0000.00.00",
  }),
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
  pisRate: z
    .number()
    .min(0, "pisRate nao pode ser negativo")
    .max(1, "pisRate deve ser entre 0 e 1")
    .optional(),
  confinsRate: z
    .number()
    .min(0, "confinsRate nao pode ser negativo")
    .max(1, "confinsRate deve ser entre 0 e 1")
    .optional(),
});

export type NfCompletaInput = z.input<typeof nfCompletaSchema>;
export type NfCompletaOutput = z.infer<typeof nfCompletaSchema>;
