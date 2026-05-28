const { roundMoney } = require('../utils/money');
const { calculateInssEmpregado, calculateIrrf } = require('./taxService');

function calculateTermination({
  salarioBruto,
  diasTrabalhadosMes,
  mesesTrabalhadosAno,
  mesesFeriasProporcionais,
  feriasVencidas = false,
  avisoPrevioIndenizado = false,
  motivo = 'semJustaCausa',
}) {
  const saldoSalario = roundMoney((salarioBruto / 30) * diasTrabalhadosMes);
  const decimoTerceiroProporcional = roundMoney(
    (salarioBruto / 12) * mesesTrabalhadosAno,
  );
  const feriasProporcionais = roundMoney(
    (salarioBruto / 12) * mesesFeriasProporcionais,
  );
  const feriasProporcionaisComTerco = roundMoney(
    feriasProporcionais + feriasProporcionais / 3,
  );
  const feriasVencidasComTerco = feriasVencidas
    ? roundMoney(salarioBruto + salarioBruto / 3)
    : 0;
  const avisoPrevio =
    avisoPrevioIndenizado && motivo === 'semJustaCausa' ? salarioBruto : 0;
  const totalBruto = roundMoney(
    saldoSalario +
      decimoTerceiroProporcional +
      feriasProporcionaisComTerco +
      feriasVencidasComTerco +
      avisoPrevio,
  );
  const baseDescontos = roundMoney(
    saldoSalario + decimoTerceiroProporcional + avisoPrevio,
  );
  const inssEmpregado = calculateInssEmpregado(baseDescontos);
  const irrf = calculateIrrf({
    baseBruta: baseDescontos,
    inssEmpregado,
    dependentes: 0,
  });
  const totalDescontos = roundMoney(inssEmpregado + irrf);

  return {
    saldoSalario,
    decimoTerceiroProporcional,
    feriasProporcionaisComTerco,
    feriasVencidasComTerco,
    avisoPrevio,
    totalBruto,
    descontos: {
      inssEmpregado,
      irrf,
      total: totalDescontos,
    },
    totalLiquidoEstimado: roundMoney(totalBruto - totalDescontos),
  };
}

module.exports = { calculateTermination };
