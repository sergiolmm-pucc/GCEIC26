import express from 'express';
import cors from 'cors';
import { pricingRouter } from './routes/pricingRoutes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({
      name: 'API Simulador de Preco Bruto e Liquido',
      endpoint: '/PBL',
      status: 'online'
    });
  });

  app.use('/PBL', pricingRouter);

  app.use((error, _request, response, _next) => {
    const statusCode = error.statusCode ?? 500;
    response.status(statusCode).json({
      statusCode,
      message: error.message ?? 'Erro interno do servidor',
      error: error.message ?? 'Erro interno do servidor'
    });
  });

  return app;
}
