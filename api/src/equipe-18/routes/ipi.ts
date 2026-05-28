import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import {
  type IpiCalculationInput,
  ipiCalculationSchema,
} from "../schemas/ipi-schema";
import { ipiService } from "../services/ipi-service";

export async function ipiRoutes(app: FastifyInstance) {
  app.post<{ Body: IpiCalculationInput }>(
    "/impostos/ipi",
    {
      attachValidation: true,
      schema: {
        description:
          "Calcula o imposto IPI com base no NCM do produto e valores acessorios",
        tags: ["Impostos"],
        body: {
          type: "object",
          required: ["productValue", "ncm"],
          properties: {
            productValue: {
              type: "number",
              description: "Valor do produto em reais",
            },
            freightValue: {
              type: "number",
              minimum: 0,
              description: "Valor do frete em reais",
            },
            additionalExpenses: {
              type: "number",
              minimum: 0,
              description: "Despesas acessorias cobradas do destinatario",
            },
            ncm: {
              type: "string",
              pattern: "^\\d{4}\\.\\d{2}\\.\\d{2}$",
              description:
                "Codigo NCM usado para obter a aliquota de IPI na tabela TIPI suportada",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              ncm: { type: "string" },
              productDescription: { type: "string" },
              productValue: { type: "string" },
              freightValue: { type: "string" },
              additionalExpenses: { type: "string" },
              calculationBasis: { type: "string" },
              ipiRate: { type: "string" },
              ipiAmount: { type: "string" },
              total: { type: "string" },
              legalSource: { type: "string" },
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
      request: FastifyRequest<{ Body: IpiCalculationInput }>,
      reply: FastifyReply,
    ) => {
      if (request.validationError) {
        return reply.code(400).send({
          message: request.validationError.message,
        });
      }

      try {
        const payload = ipiCalculationSchema.parse(request.body);
        const result = ipiService(payload);

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
