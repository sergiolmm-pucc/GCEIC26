const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Saúde da API
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    by: 'AGUA-GROUP-20',
    projeto: 'Cálculo de Consumo de Água',
  });
});

// Tabelas de referência
app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-20/funcoes');
  res.json({
    success: true,
    data: {
      faixasTarifa:      TABELA.TARIFA.faixas,
      litrosPorMinBanho: TABELA.LITROS_POR_MIN_BANHO,
      litrosPorDescarga: TABELA.LITROS_POR_DESCARGA,
      margemSeguranca:   `${TABELA.MARGEM_SEGURANCA * 100}%`,
    },
  });
});

// -------------------------------------------------------
// API 1 — ANA: Consumo Diário
// POST /AGUA/consumoDiario
// -------------------------------------------------------
app.post('/AGUA/consumoDiario', (req, res) => {
  try {
    const { calcularConsumoDiario } = require('./equipe-20/funcoes');
    const { tempoBanhoMin, descargasDia, pessoas } = req.body;
    const resultado = calcularConsumoDiario(
      Number(tempoBanhoMin),
      Number(descargasDia),
      Number(pessoas)
    );
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------
// API 2 — HUGO: Custo Mensal
// POST /AGUA/custoMensal
// -------------------------------------------------------
app.post('/AGUA/custoMensal', (req, res) => {
  try {
    const { calcularCustoMensal } = require('./equipe-20/funcoes');
    const { consumoDiarioLitros, tarifa, dias } = req.body;
    const resultado = calcularCustoMensal(
      Number(consumoDiarioLitros),
      Number(tarifa),
      Number(dias) || 30
    );
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------
// API 3 — LETÍCIA: Projeção de Economia
// POST /AGUA/economia
// -------------------------------------------------------
app.post('/AGUA/economia', (req, res) => {
  try {
    const { calcularEconomia } = require('./equipe-20/funcoes');
    const { litrosAtuais, reducaoPercentual, tarifa, pessoas } = req.body;
    const resultado = calcularEconomia(
      Number(litrosAtuais),
      Number(reducaoPercentual),
      Number(tarifa),
      Number(pessoas)
    );
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app;
