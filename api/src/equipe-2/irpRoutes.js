const { Router } = require('express');
const { calcularImposto } = require('./irpService');

const irpRouter = Router();

irpRouter.post('/calcular', (req, res) => {
  const { salario } = req.body;

  if (salario === undefined || salario === null) {
    return res.status(400).json({ erro: "O campo 'salario' é obrigatório." });
  }

  if (typeof salario !== 'number' || isNaN(salario)) {
    return res.status(400).json({ erro: "O campo 'salario' deve ser um número válido." });
  }

  if (salario < 0) {
    return res.status(400).json({ erro: "O salário não pode ser negativo." });
  }

  return res.status(200).json(calcularImposto(salario));
});

module.exports = irpRouter;
