const express = require('express');
const router = express.Router();
const { calcularMarkup, calcularLucro, calcularEquilibrio } = require('./markupController');

router.get('/', (req, res) => res.json({ message: 'API MarkUp - Grupo 13 funcionando!' }));
router.post('/markup', calcularMarkup);
router.post('/lucro', calcularLucro);
router.post('/equilibrio', calcularEquilibrio);

module.exports = router;
