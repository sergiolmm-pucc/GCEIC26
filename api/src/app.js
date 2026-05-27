const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const pricingRouter    = require('./equipe-14/pricingRoutes');
const mkpRouter        = require('./grupo13-markup/routes');

// saude da API
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), by: 'SLMM-33', turma: '101' });
});

app.use('/PBL', pricingRouter);
app.use('/MKP', mkpRouter);

app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-16/funcoes');
  res.json({ success: true, data: { campos: TABELA.CAMPOS, formula: TABELA.FORMULA } });
});

app.post('/api/calcular', (req, res) => {
  try {
    const { calcular } = require('./equipe-16/funcoes');
    const dados = req.body;
    if (!dados || typeof dados !== 'object')
      return res.status(400).json({ success: false, error: 'Corpo da requisicao invalido' });
    const resultado = calcular(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app;
