const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { calcularParcela, calcularCapacidade } = require('./funcoes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), by: 'FINV' });
});

router.post('/api/parcela', (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularParcela(
      Number(dados.valorVeiculo),
      Number(dados.entrada),
      Number(dados.taxaMensal),
      Number(dados.numParcelas)
    );
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/api/capacidade', (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularCapacidade(
      Number(dados.rendaMensal),
      Number(dados.taxaMensal),
      Number(dados.numParcelas),
      Number(dados.entradaPercent)
    );
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;