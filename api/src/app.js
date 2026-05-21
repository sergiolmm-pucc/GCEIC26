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
    timestamp: new Date().toISOString()
  });
});


// retorna tabela padrão de impostos
app.get('/NF/tabelas', (req, res) => {

  const { TABELA } = require('./funcoes');

  res.json({
    success: true,
    data: TABELA.IMPOSTOS_PADRAO,
  });

});


// POST /NF/calcular
app.post('/NF/calcular', (req, res) => {

  try {

    const { calcularNF } = require('./funcoes');

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

app.post('/NF/calcular-inverso', (req, res) => {
  try {
    const { calcularNFInverso } = require('./funcoes');
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularNFInverso(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/NF/comparar', (req, res) => {
  try {
    const { compararAliquotas } = require('./funcoes');
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