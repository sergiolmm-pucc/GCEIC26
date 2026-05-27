const express = require('express');
const router = express.Router();

router.post('/calcular', (req, res) => {
    const { largura, comprimento, profundidade } = req.body;
    const volume = largura * comprimento * profundidade;
    res.json({ volume: volume.toFixed(2) });
});

module.exports = router;