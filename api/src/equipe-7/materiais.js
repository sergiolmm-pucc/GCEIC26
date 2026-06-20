const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

// Função pura de cálculo (usada no teste unitário)
function calcularMateriais(precoEletrico, precoHidraulico) {
    const e = lerNumero('precoEletrico', precoEletrico);
    const h = lerNumero('precoHidraulico', precoHidraulico);
    return (e + h).toFixed(2);
}

// Rota HTTP da API (usada no app e teste de integração)
router.post('/calcular', (req, res) => {
    try {
        const custoMateriais = calcularMateriais(req.body.precoEletrico, req.body.precoHidraulico);
        res.json({ success: true, custoMateriais });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

router.calcularMateriais = calcularMateriais;
module.exports = router;