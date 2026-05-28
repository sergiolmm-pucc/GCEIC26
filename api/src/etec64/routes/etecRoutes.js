const express = require('express');
const { calcularMedia } = require('../controllers/mediaController.js');
const { calcularFrequencia } = require('../controllers/frequenciaController.js');
const { calcularAprovacao } = require('../controllers/aprovacaoController.js');

const router = express.Router();

router.post('/media', calcularMedia);
router.post('/frequencia', calcularFrequencia);
router.post('/aprovacao', calcularAprovacao);

module.exports = router;
