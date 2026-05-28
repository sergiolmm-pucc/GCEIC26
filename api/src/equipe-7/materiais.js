const express = require('express');
const router = express.Router();

router.post('/calcular', (req, res) => {
    const { precoEletrico, precoHidraulico } = req.body;
    const totalMateriais = parseFloat(precoEletrico) + parseFloat(precoHidraulico);
    res.json({ custoMateriais: totalMateriais.toFixed(2) });
});

module.exports = router;