const express = require('express');
const cors = require('cors');
const autonomiaRoutes = require('./routes/autonomia');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    projeto: 'Cálculo de Autonomia de Carros',
    turma: 'GCEIC26 - PUC Campinas',
    endpoints: [
      'POST /autonomia/calcular',
      'POST /autonomia/custo-viagem',
      'POST /autonomia/comparar-combustivel',
    ],
  });
});

app.use('/autonomia', autonomiaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});

module.exports = app;
