const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check para o pipeline CI/CD
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Retorna as tabelas/constantes usadas nos calculos
app.get('/MKP/tabelas', (req, res) => {
  const { TABELA } = require('./funcoes');
  res.json({
    success: true,
    data: {
      tiposCalculo: TABELA.TIPOS_CALCULO,
      exemplos: TABELA.EXEMPLOS,
    },
  });
});

// POST /MKP/calcular - endpoint principal
app.post('/MKP/calcular', (req, res) => {
  try {
    const { calcular } = require('./funcoes');
    const dados = req.body;
    console.log(dados);

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ error: 'Corpo da requisicao invalido' });
    }

    const resultado = calcular(dados);
    console.log(resultado);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app;
