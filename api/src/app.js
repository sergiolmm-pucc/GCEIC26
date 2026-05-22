const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { calcularParcela, calcularCapacidade } = require('./funcoes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/FINV/parcela', (req, res) => {
  try {
    const { valorVeiculo, entrada, taxaMensal, numParcelas } = req.body;
    const parcela = calcularParcela(valorVeiculo, entrada, taxaMensal, numParcelas);
    res.json({ parcela });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.post('/FINV/capacidade', (req, res) => {
  try {
    const { rendaMensal, percentualEntrada } = req.body;
    const capacidade = calcularCapacidade(rendaMensal, percentualEntrada);
    res.json({ capacidade });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

module.exports = app;
