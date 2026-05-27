const { Router } = require('express');
const { TABELA_NF_VENDA, decodificarChaveNF, calcularImpostosNFVenda } = require('./funcoes');

const nfvendaRouter = Router();

nfvendaRouter.get('/tabelas', (_req, res) => {
  res.json({ success: true, data: TABELA_NF_VENDA });
});

nfvendaRouter.post('/decodificar', (req, res) => {
  try {
    const { chave } = req.body;
    if (!chave) return res.status(400).json({ success: false, error: 'Campo "chave" é obrigatório' });
    const resultado = decodificarChaveNF(chave);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

nfvendaRouter.post('/calcular', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularImpostosNFVenda(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = nfvendaRouter;
