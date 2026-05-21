const express = require('express');
const router = express.Router();
const { calcularAutonomia, calcularCustoViagem, compararCombustivel } = require('../controllers/autonomiaController');

// POST /autonomia/calcular — Henrique Zaccarias
router.post('/calcular', (req, res) => {
  try {
    const { kmPercorridos, litrosAbastecidos } = req.body;
    const resultado = calcularAutonomia(Number(kmPercorridos), Number(litrosAbastecidos));
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

// POST /autonomia/custo-viagem — Rafael Tamura
router.post('/custo-viagem', (req, res) => {
  try {
    const { distanciaKm, autonomiaKmL, precoCombustivel } = req.body;
    const resultado = calcularCustoViagem(
      Number(distanciaKm),
      Number(autonomiaKmL),
      Number(precoCombustivel)
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

// POST /autonomia/comparar-combustivel — Caio Adamo
router.post('/comparar-combustivel', (req, res) => {
  try {
    const { precoGasolina, precoEtanol, autonomiaGasolina, autonomiaEtanol } = req.body;
    const resultado = compararCombustivel(
      Number(precoGasolina),
      Number(precoEtanol),
      Number(autonomiaGasolina),
      Number(autonomiaEtanol)
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

module.exports = router;
