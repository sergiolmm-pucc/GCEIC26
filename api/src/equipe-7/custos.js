const express = require('express');
const router = express.Router();

router.post('/calcular', (req, res) => {
    const { volume, precoAgua, precoManutencao } = req.body;
    const custoAgua = volume * precoAgua;
    const custoManutencao = volume * precoManutencao;
    res.json({ 
        custoAgua: custoAgua.toFixed(2), 
        custoManutencao: custoManutencao.toFixed(2) 
    });
});

module.exports = router;