import express from 'express';
import cors from 'cors';
import { freteRouter } from './routes/frete.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middlewares globais
app.use(cors());
app.use(express.json());

// ── Rota de health check
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    servico: 'Frete API',
    versao: '1.0.0',
    rotas: [
      'POST /frete/peso',
      'POST /frete/distancia',
      'POST /frete/tipo',
      'POST /frete/calcular',
    ],
  });
});

// ── Rotas do frete
app.use('/frete', freteRouter);

// ── 404 genérico
app.use((_req, res) => {
  res.status(404).json({ sucesso: false, erro: 'Rota não encontrada' });
});

// ── Inicia o servidor (não executa durante os testes)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚚 Frete API rodando em http://localhost:${PORT}\n`);
  });
}

export default app;
