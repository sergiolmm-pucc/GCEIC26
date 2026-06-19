const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

router.post('/calcular', (req, res) => {
    try {
        const volume = lerNumero('volume', req.body.volume);
        const precoAgua = lerNumero('precoAgua', req.body.precoAgua);
        const precoManutencao = lerNumero('precoManutencao', req.body.precoManutencao);
        const custoAgua = volume * precoAgua;
        const custoManutencao = volume * precoManutencao;

        res.json({
            success: true,
            custoAgua: custoAgua.toFixed(2),
            custoManutencao: custoManutencao.toFixed(2)
        });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

module.exports = router;
