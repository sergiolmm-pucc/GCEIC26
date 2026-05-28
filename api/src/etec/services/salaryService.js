const { ENCARGOS_EMPREGADOR_DOMESTICO } = require('../constants/taxTables2026');
const { roundMoney } = require('../utils/money');
const { calculateInssEmpregado, calculateIrrf } = require('./taxService');

function calculateEmployerCharges(remuneracaoBruta) {
  const inssEmpregador = roundMoney(
    remuneracaoBruta * ENCARGOS_EMPREGADOR_DOMESTICO.inssEmpregador,
  );
  const fgts = roundMoney(remuneracaoBruta * ENCARGOS_EMPREGADOR_DOMESTICO.fgts);
  const seguroAcidente = roundMoney(
    remuneracaoBruta * ENCARGOS_EMPREGADOR_DOMESTICO.seguroAcidente,
  );
  const reservaIndenizatoria = roundMoney(
    remuneracaoBruta * ENCARGOS_EMPREGADOR_DOMESTICO.reservaIndenizatoria,
  );

  return {
    inssEmpregador,
    fgts,
    seguroAcidente,
    reservaIndenizatoria,
  };
}

function calculateSalary({
  salarioBruto,
  dependentes = 0,
  outrosProventos = 0,
  outrosDescontos = 0,
}) {
  const remuneracaoBruta = roundMoney(salarioBruto + outrosProventos);
  const inssEmpregado = calculateInssEmpregado(remuneracaoBruta);
  const irrf = calculateIrrf({
    baseBruta: remuneracaoBruta,
    inssEmpregado,
    dependentes,
  });
  const encargos = calculateEmployerCharges(remuneracaoBruta);
  const salarioLiquido = roundMoney(
    remuneracaoBruta - inssEmpregado - irrf - outrosDescontos,
  );
  const totalEncargosEmpregador = roundMoney(
    encargos.inssEmpregador +
      encargos.fgts +
      encargos.seguroAcidente +
      encargos.reservaIndenizatoria,
  );

  return {
    remuneracaoBruta,
    inssEmpregado,
    irrf,
    outrosDescontos,
    salarioLiquido,
    ...encargos,
    totalEncargosEmpregador,
    custoTotalEmpregador: roundMoney(remuneracaoBruta + totalEncargosEmpregador),
  };
}

module.exports = {
  calculateEmployerCharges,
  calculateSalary,
};
