const express = require('express');
const router = express.Router();
const { lerNumero, enviarErro } = require('./validacao');

router.post('/calcular', (req, res) => {
    try {
        const largura = lerNumero('largura', req.body.largura);
        const comprimento = lerNumero('comprimento', req.body.comprimento);
        const profundidade = lerNumero('profundidade', req.body.profundidade);
        const volume = largura * comprimento * profundidade;

        res.json({ success: true, volume: volume.toFixed(2) });
    } catch (erro) {
        enviarErro(res, erro);
    }
});

module.exports = router;
