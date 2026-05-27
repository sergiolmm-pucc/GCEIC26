const { Router } = require('express');
const { TABELA_NF_VENDA, decodificarChaveNF, calcularImpostosNFVenda } = require('./funcoes');

const nfvendaRouter = Router();

nfvendaRouter.get('/tabelas', (_req, res) => {
  res.json({ success: true, data: TABELA_NF_VENDA });
});

nfvendaRouter.post('/decodificar', (req, res) => {
  try {
    const { chave } = req.body;
    if (!chave) return res.status(400).json({ success: false, error: 'Chave de acesso é obrigatória' });
    const data = decodificarChaveNF(chave);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

nfvendaRouter.post('/calcular', (req, res) => {
  try {
    const data = calcularImpostosNFVenda(req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = nfvendaRouter;
