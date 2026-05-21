const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── health check (padrão do professor) ──────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    by: 'SaunaCalc Elite',
    turma: '101',
  });
});

// ── tabelas de referência ────────────────────────────────────
app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./funcoes');
  res.json({
    success: true,
    data: {
      base:      TABELA.BASE_CALC.faixas,
      tipos:     TABELA.TIPOS,
      referencia: `${TABELA.REFERENCIA * 100}% kWh`,
    },
  });
});

// ── POST /api/calcular (padrão do professor) ─────────────────
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

// ── POST /api/calcularKit (Pessoa 2) ────────────────────────
app.post('/api/calcularKit', (req, res) => {
  try {
    const { calcularKit } = require('./funcoes');
    const resultado = calcularKit(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ── POST /api/calcularInstalacao (Pessoa 3) ──────────────────
app.post('/api/calcularInstalacao', (req, res) => {
  try {
    const { calcularInstalacao } = require('./funcoes');
    const resultado = calcularInstalacao(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app;