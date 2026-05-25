import { z } from "zod";

export const icmsCalculationSchema = z.object({
  productValue: z.number().positive("productValue deve ser maior que zero"),
  state: z
    .string()
    .trim()
    .length(2, "state deve ser uma UF com 2 letras")
    .transform((state) => state.toUpperCase()),
});

export type IcmsCalculationInput = z.input<typeof icmsCalculationSchema>;
