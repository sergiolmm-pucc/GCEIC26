import { z } from "zod";

const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

export const icmsSchema = z.object({
  productValue: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "O valor do produto é obrigatório" : "Valor inválido",
    })
    .positive("O valor deve ser maior que zero"),
  state: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "O estado é obrigatório" : "Estado inválido",
    })
    .trim()
    .length(2, "Use a sigla de 2 letras do estado (UF)")
    .transform((state) => state.toUpperCase())
    .pipe(z.enum(brazilianStates, { error: "Selecione uma UF brasileira válida" })),
});

export type IcmsFormData = z.infer<typeof icmsSchema>;
