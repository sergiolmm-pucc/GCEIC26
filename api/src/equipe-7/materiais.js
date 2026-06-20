const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

// 1. Função pura de cálculo
function calcularMateriais(precoEletrico, precoHidraulico) {
    if (precoEletrico < 0 || precoHidraulico < 0) {
        throw new Error('Valores não podem ser negativos');
    }
    const totalMateriais = precoEletrico + precoHidraulico;
    return totalMateriais.toFixed(2);
}

// 2. Rota HTTP do Express
router.post('/calcular', (req, res) => {
    try {
        const precoEletrico = lerNumero('precoEletrico', req.body.precoEletrico);
        const precoHidraulico = lerNumero('precoHidraulico', req.body.precoHidraulico);
        
        const custoMateriais = calcularMateriais(precoEletrico, precoHidraulico);

        res.json({ success: true, custoMateriais });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

// 3. Exporta o router e anexa a função a ele
router.calcularMateriais = calcularMateriais;
module.exports = router;