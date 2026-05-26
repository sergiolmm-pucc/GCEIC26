const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


// checa se api no ar
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() , by:'SLMM-33', turma:'101'});
});

app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./funcoes');
  res.json({
    success: true,
    data: {
      campos: TABELA.CAMPOS,
      formula: TABELA.FORMULA,
    },
  });

});

// POST /api/calcular
app.post('/api/calcular', (req, res) => {
  try {
    const { calcular } = require('./funcoes');
    const dados = req.body;

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    
    const resultado = calcular(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app

