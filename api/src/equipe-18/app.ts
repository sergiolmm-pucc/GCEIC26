import fastifyCors from "@fastify/cors";
import Fastify from "fastify";

import { swaggerPlugin } from "./plugins/swagger";
import { healthRoutes } from "./routes/health";
import { icmsRoutes } from "./routes/icms";
import { ipiRoutes } from "./routes/ipi";
import { nfCompletaRoutes } from "./routes/nf-completa";
import { pisCofinRoutes } from "./routes/pis-cofins";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(fastifyCors, {
    origin: "*",
  });

  app.register(swaggerPlugin);

  app.register(healthRoutes);
  app.register(ipiRoutes);
  app.register(pisCofinRoutes);
  app.register(icmsRoutes);
  app.register(nfCompletaRoutes);

  return app;
}
