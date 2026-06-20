const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

// Função pura de cálculo (usada no teste unitário)
function calcularCustos(volume, precoAgua, precoManutencao) {
    const v = lerNumero('volume', volume);
    const a = lerNumero('precoAgua', precoAgua);
    const m = lerNumero('precoManutencao', precoManutencao);
    return {
        custoAgua: (v * a).toFixed(2),
        custoManutencao: (v * m).toFixed(2)
    };
}

// Rota HTTP da API (usada no app e teste de integração)
router.post('/calcular', (req, res) => {
    try {
        const resultados = calcularCustos(req.body.volume, req.body.precoAgua, req.body.precoManutencao);
        res.json({
            success: true,
            custoAgua: resultados.custoAgua,
            custoManutencao: resultados.custoManutencao
        });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

router.calcularCustos = calcularCustos;
module.exports = router;