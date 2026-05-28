const express = require('express');
const { TABELA, calcular } = require('./funcoes');

const router = express.Router();

router.get('/tabelas', (req, res) => {
  res.json({
    success: true,
    data: TABELA,
  });
});

router.post('/calcular', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisicao invalido' });
    }

    const resultado = calcular(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
