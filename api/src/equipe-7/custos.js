const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

// 1. Função pura de cálculo
function calcularCustos(volume, precoAgua, precoManutencao) {
    if (volume < 0 || precoAgua < 0 || precoManutencao < 0) {
        throw new Error('Valores não podem ser negativos');
    }
    const custoAgua = volume * precoAgua;
    const custoManutencao = volume * precoManutencao;

    return {
        custoAgua: custoAgua.toFixed(2),
        custoManutencao: custoManutencao.toFixed(2)
    };
}

// 2. Rota HTTP do Express
router.post('/calcular', (req, res) => {
    try {
        const volume = lerNumero('volume', req.body.volume);
        const precoAgua = lerNumero('precoAgua', req.body.precoAgua);
        const precoManutencao = lerNumero('precoManutencao', req.body.precoManutencao);
        
        const custos = calcularCustos(volume, precoAgua, precoManutencao);

        res.json({
            success: true,
            custoAgua: custos.custoAgua,
            custoManutencao: custos.custoManutencao
        });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

// 3. Exporta o router e anexa a função a ele
router.calcularCustos = calcularCustos;
module.exports = router;