const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

router.post('/calcular', (req, res) => {
    try {
        const precoEletrico = lerNumero('precoEletrico', req.body.precoEletrico);
        const precoHidraulico = lerNumero('precoHidraulico', req.body.precoHidraulico);
        const totalMateriais = precoEletrico + precoHidraulico;

        res.json({ success: true, custoMateriais: totalMateriais.toFixed(2) });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

module.exports = router;
