const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

// 1. Função pura de cálculo
function calcularVolume(largura, comprimento, profundidade) {
    if (largura < 0 || comprimento < 0 || profundidade < 0) {
        throw new Error('Valores não podem ser negativos');
    }
    const volume = largura * comprimento * profundidade;
    return volume.toFixed(2);
}

// 2. Rota HTTP do Express
router.post('/calcular', (req, res) => {
    try {
        const largura = lerNumero('largura', req.body.largura);
        const comprimento = lerNumero('comprimento', req.body.comprimento);
        const profundidade = lerNumero('profundidade', req.body.profundidade);

        const volume = calcularVolume(largura, comprimento, profundidade);

        res.json({ success: true, volume });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

// 3. Exporta o router e anexa a função a ele
router.calcularVolume = calcularVolume;
module.exports = router;