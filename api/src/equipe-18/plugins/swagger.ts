import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function swaggerPluginRaw(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Tax Calculator API",
        version: "1.0.0",
        description: "API para calculo de impostos fiscais",
      },
      servers: [
        {
          url: "http://localhost:3333",
          description: "Development",
        },
      ],
    },
  });

  await app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
}

export const swaggerPlugin = fp(swaggerPluginRaw, {
  name: "swagger-plugin",
});
