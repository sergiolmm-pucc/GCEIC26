const express = require("express");
const router = express.Router();
const { 
  calcularJurosSimples, 
  calcularJurosCompostos, 
  simularInvestimento 
} = require('./calcFinanceiraFunc'); 

router.post('/juros-simples', (req, res) => {
  try {
    const resultado = calcularJurosSimples(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/juros-compostos', (req, res) => {
  try {
    const resultado = calcularJurosCompostos(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/investimento', (req, res) => {
  try {
    const resultado = simularInvestimento(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;