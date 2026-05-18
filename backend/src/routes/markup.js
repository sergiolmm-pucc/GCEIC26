const express = require('express');
const router = express.Router();
const { calcularMarkup, calcularLucro, calcularPontoEquilibrio } = require('../controllers/markupController');

// POST /MKP/markup        → Calcula o preço de venda
// POST /MKP/lucro         → Calcula o lucro real de uma venda
// POST /MKP/equilibrio    → Calcula o ponto de equilíbrio

router.post('/markup', calcularMarkup);
router.post('/lucro', calcularLucro);
router.post('/equilibrio', calcularPontoEquilibrio);
router.get('/', (req, res) => {
  res.send('API Markup funcionando')
});

module.exports = router;