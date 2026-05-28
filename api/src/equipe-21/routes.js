const { Router } = require('express');
const { TABELA, calcularBurgcalc } = require('./funcoes');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    equipe: 21,
    service: 'burgcalc',
  });
});

router.get('/tabelas', (_req, res) => {
  res.json({
    success: true,
    data: {
      camposCusto: TABELA.CAMPOS_CUSTO,
      camposObrigatorios: TABELA.CAMPOS_OBRIGATORIOS,
      formula: TABELA.FORMULA,
    },
  });
});

router.post('/calcular', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        error: 'Corpo da requisicao invalido',
      });
    }

    const resultado = calcularBurgcalc(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
