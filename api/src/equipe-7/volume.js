const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

// Função pura de cálculo (usada no teste unitário)
function calcularVolume(largura, comprimento, profundidade) {
    const l = lerNumero('largura', largura);
    const c = lerNumero('comprimento', comprimento);
    const p = lerNumero('profundidade', profundidade);
    return (l * c * p).toFixed(2);
}

// Rota HTTP da API (usada no app e teste de integração)
router.post('/calcular', (req, res) => {
    try {
        const volume = calcularVolume(req.body.largura, req.body.comprimento, req.body.profundidade);
        res.json({ success: true, volume });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

// Anexa a função ao objeto router para exportação dupla limpa
router.calcularVolume = calcularVolume;
module.exports = router;