const {
  INSS_EMPREGADO_2026,
  IRRF_MENSAL_2026,
} = require('../constants/taxTables2026');
const { roundMoney } = require('../utils/money');

function calculateProgressiveTax(base, brackets) {
  let previousLimit = 0;
  let total = 0;

  for (const bracket of brackets) {
    const currentLimit = bracket.ate;
    const taxableAmount = Math.max(
      0,
      Math.min(base, currentLimit) - previousLimit,
    );

    if (taxableAmount > 0) {
      total += taxableAmount * bracket.aliquota;
    }

    previousLimit = currentLimit;

    if (base <= currentLimit) {
      break;
    }
  }

  return roundMoney(total);
}

function calculateInssEmpregado(salarioContribuicao) {
  const base = Math.min(salarioContribuicao, INSS_EMPREGADO_2026.teto);
  return calculateProgressiveTax(base, INSS_EMPREGADO_2026.faixas);
}

function calculateIrrf({ baseBruta, inssEmpregado = 0, dependentes = 0 }) {
  const baseCalculo = Math.max(
    0,
    baseBruta - inssEmpregado - dependentes * IRRF_MENSAL_2026.deducaoPorDependente,
  );
  const faixa = IRRF_MENSAL_2026.faixas.find((item) => baseCalculo <= item.ate);
  const imposto = Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao);

  return roundMoney(imposto);
}

module.exports = {
  calculateProgressiveTax,
  calculateInssEmpregado,
  calculateIrrf,
};
