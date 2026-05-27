const { calcularImposto } = require("../services/impostoService");

function calcular(req, res) {
  const { salario } = req.body;

  // Validação: campo obrigatório
  if (salario === undefined || salario === null) {
    return res.status(400).json({ erro: "O campo 'salario' é obrigatório." });
  }

  // Validação: deve ser número
  if (typeof salario !== "number" || isNaN(salario)) {
    return res.status(400).json({ erro: "O campo 'salario' deve ser um número válido." });
  }

  // Validação: não pode ser negativo
  if (salario < 0) {
    return res.status(400).json({ erro: "O salário não pode ser negativo." });
  }

  const resultado = calcularImposto(salario);
  return res.status(200).json(resultado);
}

module.exports = { calcular };
