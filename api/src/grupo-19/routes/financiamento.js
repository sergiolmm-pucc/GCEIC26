const express = require('express');
const router = express.Router();
const controller = require('../controllers/FinanciamentoController');

// Endpoint base: /FIN/
router.post('/sac', (req, res) => controller.calcularSAC(req, res));
router.post('/price', (req, res) => controller.calcularPRICE(req, res));
router.post('/comparar', (req, res) => controller.comparar(req, res));
router.post('/capacidade', (req, res) => controller.simularCapacidade(req, res));

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), endpoint: 'FIN' });
});

module.exports = router;
