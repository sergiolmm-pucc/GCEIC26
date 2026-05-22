const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const { calcularParcela } = require('./funcoes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Tabela de constantes (exigida pelos testes)
app.get('/api/tabelas', (req, res) => {
  res.json({
    success: true,
    data: {
      base: 1.29,       // taxa mensal padrão (%)
      referencia: 48    // número de parcelas padrão
    }
  });
});

// Cálculo de parcela
app.post('/api/parcela', (req, res) => {
  try {
    const { valorVeiculo, entrada, taxaMensal, numParcelas } = req.body;
    const parcela = calcularParcela(valorVeiculo, entrada, taxaMensal, numParcelas);
    res.json({ success: true, data: { parcela } });
  } catch (err) {
    res.status(400).json({ success: false, erro: err.message });
  }
});

module.exports = app;