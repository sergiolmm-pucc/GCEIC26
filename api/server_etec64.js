import express from 'express';
import cors from 'cors';
import etecRoutes from './routes/etecRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api', etecRoutes);

// Rota de status/healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    projeto: 'Cálculo ETEC - API (ETEC64)',
    versao: '1.0.0'
  });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    sucesso: false,
    erro: 'Ocorreu um erro interno no servidor.'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`Endpoint de cálculo ativo em: http://localhost:${PORT}/api/etec64/media`);
  });
}

export default app; // Exportado para facilidade nos testes
