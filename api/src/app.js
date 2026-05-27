const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


// checa se api está no ar
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    by: 'SLMM-33',
    turma: '101'
  });
});


// retorna tabela padrão de impostos
app.get('/api/equipe-9/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-9/funcoes');

  res.json({
    success: true,
    data: TABELA.IMPOSTOS_PADRAO,
  });
});


// POST /api/equipe-9/calcular
app.post('/api/equipe-9/calcular', (req, res) => {
  try {
    const { calcularNF } = require('./equipe-9/funcoes');

    const dados = req.body;

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Corpo da requisição inválido'
      });
    }

    const resultado = calcularNF(dados);

    return res.status(200).json({
      success: true,
      data: resultado
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
});


// POST /api/equipe-9/calcular-inverso
app.post('/api/equipe-9/calcular-inverso', (req, res) => {
  try {
        const { calcularNFInverso } = require('./equipe-9/funcoes');
    
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularNFInverso(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});


// POST /api/equipe-9/comparar
app.post('/api/equipe-9/comparar', (req, res) => {
  try {
    const { compararAliquotas } = require('./equipe-9/funcoes');
    
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = compararAliquotas(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app;