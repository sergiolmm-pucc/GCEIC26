const express = require('express');
const cors = require('cors');
const financiamentoRoutes = require('./routes/financiamento');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint principal conforme especificação do projeto: /FIN/
app.use('/FIN', financiamentoRoutes);

app.get('/', (req, res) => {
  res.json({
    nome: 'API Financiamento Imobiliário',
    versao: '1.0.0',
    endpoints: {
      'POST /FIN/sac': 'Calcula financiamento pelo Sistema SAC',
      'POST /FIN/price': 'Calcula financiamento pela Tabela PRICE',
      'POST /FIN/comparar': 'Compara SAC x PRICE',
      'POST /FIN/capacidade': 'Simula capacidade de financiamento pela renda',
      'GET /FIN/health': 'Status da API',
    },
    exemploBody: {
      valorImovel: 500000,
      entrada: 100000,
      taxaAnual: 10.5,
      prazoMeses: 360,
    },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ API Financiamento rodando na porta ${PORT}`);
    console.log(`📍 Endpoint: http://localhost:${PORT}/FIN`);
  });
}

module.exports = app;
