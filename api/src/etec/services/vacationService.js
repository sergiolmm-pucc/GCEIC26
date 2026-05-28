const { roundMoney } = require('../utils/money');
const { calculateInssEmpregado, calculateIrrf } = require('./taxService');

function calculateVacation({ salarioBruto, diasFerias = 30, dependentes = 0 }) {
  const valorFerias = roundMoney((salarioBruto / 30) * diasFerias);
  const tercoConstitucional = roundMoney(valorFerias / 3);
  const totalBruto = roundMoney(valorFerias + tercoConstitucional);
  const inssEmpregado = calculateInssEmpregado(totalBruto);
  const irrf = calculateIrrf({
    baseBruta: totalBruto,
    inssEmpregado,
    dependentes,
  });

  return {
    valorFerias,
    tercoConstitucional,
    totalBruto,
    inssEmpregado,
    irrf,
    totalLiquido: roundMoney(totalBruto - inssEmpregado - irrf),
  };
}

module.exports = { calculateVacation };
