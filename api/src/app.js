const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Checa se a API está no ar
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    by: 'AGUA-GROUP',
    projeto: 'Cálculo de Consumo de Água',
  });
});

// Retorna as tabelas de referência (tarifas e constantes)
app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./funcoes');
  res.json({
    success: true,
    data: {
      faixasTarifa: TABELA.TARIFA.faixas,
      consumoMedioPorPessoa: `${TABELA.CONSUMO_MEDIO_POR_PESSOA} L/dia`,
      margemSeguranca: `${TABELA.REFERENCIA * 100}%`,
    },
  });
});

// POST /api/calcular — calcula consumo e valor da conta
app.post('/api/calcular', (req, res) => {
  try {
    const { calcular } = require('./funcoes');
    const dados = req.body;

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ error: 'Corpo da requisição inválido' });
    }

    const resultado = calcular(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app;