import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import {
  type IcmsCalculationInput,
  icmsCalculationSchema,
} from "../schemas/icms-schema";
import { icmsService } from "../services/icms-service";

export async function icmsRoutes(app: FastifyInstance) {
  app.post<{ Body: IcmsCalculationInput }>(
    "/impostos/icms",
    {
      attachValidation: true,
      schema: {
        description:
          "Calcula o imposto ICMS com base na UF de destino e valor do produto",
        tags: ["Impostos"],
        body: {
          type: "object",
          required: ["productValue", "state"],
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
              description: "UF brasileira usada para obter a aliquota de ICMS",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              productValue: { type: "string" },
              state: { type: "string" },
              icmsRate: { type: "string" },
              icmsAmount: { type: "string" },
              total: { type: "string" },
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
      request: FastifyRequest<{ Body: IcmsCalculationInput }>,
      reply: FastifyReply,
    ) => {
      if (request.validationError) {
        return reply.code(400).send({
          message: request.validationError.message,
        });
      }

      try {
        const payload = icmsCalculationSchema.parse(request.body);
        const result = icmsService(payload);

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
