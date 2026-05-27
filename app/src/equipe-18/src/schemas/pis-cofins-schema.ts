import { z } from "zod";

export const pisCofinsSchema = z.object({
  productValue: z.number().min(0.01, { message: "Valor do produto deve ser maior que 0.01" }),
  pisRate: z.number().default(0.0165),
  confinsRate: z.number().default(0.076),
  revenue: z.number().optional(),
});

export type PisCofinsFormData = z.infer<typeof pisCofinsSchema>;