import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { pisCofinService } from "../services/pis-service";

interface PisCofinRequest {
  productValue: number;
  pisRate?: number;
  confinsRate?: number;
}

export async function pisCofinRoutes(app: FastifyInstance) {
  app.post<{ Body: PisCofinRequest }>(
    "/impostos/pis-cofins",
    {
      schema: {
        description:
          "Calcula as taxas cumulativas/nao cumulativas de PIS e COFINS",
        tags: ["Impostos"],
        body: {
          type: "object",
          required: ["productValue"],
          properties: {
            productValue: {
              type: "number",
              description: "Valor do produto em reais",
            },
            pisRate: {
              type: "number",
              description: "Taxa de PIS (0-1)",
            },
            confinsRate: {
              type: "number",
              description: "Taxa de CONFINS (0-1)",
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              productValue: { type: "string" },
              pisRate: { type: "string" },
              pisAmount: { type: "string" },
              confinsRate: { type: "string" },
              confinsAmount: { type: "string" },
              totalTax: { type: "string" },
              total: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: PisCofinRequest }>,
      reply: FastifyReply,
    ) => {
      const result = pisCofinService(request.body);
      return reply.send(result);
    },
  );
}
