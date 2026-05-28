const express = require('express');
const router = express.Router();
const { calcular } = require('./funcoes');

// Endpoint que vai receber o pedido do frontend
router.post('/equipe-22/calcular', (req, res) => {
    try {
        const resultado = calcular(req.body);
        // O segredo está aqui: enviando o success e o data como o frontend espera!
        res.status(200).json({ success: true, data: resultado });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;