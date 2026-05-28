const express = require('express');
const router = express.Router();
const piscinaController = require('../controllers/piscinaController');

router.post('/volume', piscinaController.calcularVolume);
router.post('/agua', piscinaController.calcularAgua);
router.post('/materiais', piscinaController.calcularMateriais);
router.post('/manutencao', piscinaController.calcularManutencao);
router.post('/mao-de-obra', piscinaController.calcularMaoDeObra);

module.exports = router;
