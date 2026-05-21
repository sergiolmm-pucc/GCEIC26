import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import energyRoutes from './routes/energy.js';

const app: Application = express();
const PORT: string | number = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * Rota raiz para verificação de status da API
 */
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'API de Consumo de Energia', 
    version: '1.0.0' 
  });
});

/**
 * Prefixa as rotas de energia com /ENRG
 */
app.use('/ENRG', energyRoutes);

/**
 * Inicialização do servidor
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

export { app };