import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import {
  type NfCompletaInput,
  nfCompletaSchema,
} from "../schemas/nf-completa-schema";
import { nfCompletaService } from "../services/nf-completa-service";

export async function nfCompletaRoutes(app: FastifyInstance) {
  app.post<{ Body: NfCompletaInput }>(
    "/impostos/nf-completa",
    {
      attachValidation: true,
      schema: {
        description:
          "Calcula e consolida todos os impostos incidentes na nota fiscal (ICMS, IPI, PIS/COFINS)",
        tags: ["Impostos"],
        body: {
          type: "object",
          required: ["productValue", "state", "ncm"],
          properties: {
            productValue: {
              type: "number",
              exclusiveMinimum: 0,
              description: "Valor do produto em reais",
            },
            state: {
              type: "string",
              minLength: 2,
              maxLength: 2,
              description: "UF brasileira para o calculo do ICMS",
            },
            ncm: {
              type: "string",
              pattern: "^\\d{4}\\.\\d{2}\\.\\d{2}$",
              description: "Codigo NCM para aliquota de IPI",
            },
            freightValue: {
              type: "number",
              minimum: 0,
              default: 0,
              description: "Valor do frete em reais",
            },
            additionalExpenses: {
              type: "number",
              minimum: 0,
              default: 0,
              description: "Despesas acessorias em reais",
            },
            pisRate: {
              type: "number",
              minimum: 0,
              maximum: 1,
              description: "Taxa customizada do PIS (0-1)",
            },
            confinsRate: {
              type: "number",
              minimum: 0,
              maximum: 1,
              description: "Taxa customizada do COFINS (0-1)",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              productValue: { type: "string" },
              state: { type: "string" },
              ncm: { type: "string" },
              icms: {
                type: "object",
                properties: {
                  rate: { type: "string" },
                  amount: { type: "string" },
                  taxRule: {
                    type: "object",
                    properties: {
                      operationType: { type: "string" },
                      validFrom: { type: "string" },
                      sourceName: { type: "string" },
                      sourceUrl: { type: "string" },
                    },
                  },
                },
              },
              ipi: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  freightValue: { type: "string" },
                  additionalExpenses: { type: "string" },
                  calculationBasis: { type: "string" },
                  rate: { type: "string" },
                  amount: { type: "string" },
                  legalSource: { type: "string" },
                },
              },
              pisCofins: {
                type: "object",
                properties: {
                  pisRate: { type: "string" },
                  pisAmount: { type: "string" },
                  confinsRate: { type: "string" },
                  confinsAmount: { type: "string" },
                  totalTax: { type: "string" },
                },
              },
              totals: {
                type: "object",
                properties: {
                  taxesTotal: { type: "string" },
                  grandTotal: { type: "string" },
                },
              },
            },
          },
          400: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: NfCompletaInput }>,
      reply: FastifyReply,
    ) => {
      if (request.validationError) {
        return reply.code(400).send({
          message: request.validationError.message,
        });
      }

      try {
        const payload = nfCompletaSchema.parse(request.body);
        const result = nfCompletaService(payload);

        return reply.send(result);
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            message: error.issues[0]?.message ?? "Payload invalido",
          });
        }

        if (error instanceof Error) {
          return reply.code(400).send({ message: error.message });
        }

        return reply.code(400).send({ message: "Payload invalido" });
      }
    },
  );
}
