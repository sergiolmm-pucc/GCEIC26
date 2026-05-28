// Serviço com a lógica do cálculo do imposto progressivo
// Faixas:
//   Até R$ 2.500        → Isento
//   R$ 2.500 a R$ 5.000 → 7,5%
//   Acima de R$ 5.000   → 15%

function calcularImposto(salario) {
  const FAIXA1_LIMITE = 2500;
  const FAIXA2_LIMITE = 5000;
  const ALIQUOTA_FAIXA2 = 0.075;
  const ALIQUOTA_FAIXA3 = 0.15;

  let imposto = 0;
  let detalhamento = [];

  if (salario <= FAIXA1_LIMITE) {
    detalhamento.push({
      faixa: `Até R$ ${FAIXA1_LIMITE.toFixed(2)}`,
      base: salario,
      aliquota: 'Isento',
      imposto: 0,
    });
  } else if (salario <= FAIXA2_LIMITE) {
    const baseTributada = salario - FAIXA1_LIMITE;
    imposto = baseTributada * ALIQUOTA_FAIXA2;

    detalhamento.push({
      faixa: `Até R$ ${FAIXA1_LIMITE.toFixed(2)}`,
      base: FAIXA1_LIMITE,
      aliquota: 'Isento',
      imposto: 0,
    });
    detalhamento.push({
      faixa: `R$ ${FAIXA1_LIMITE.toFixed(2)} a R$ ${FAIXA2_LIMITE.toFixed(2)}`,
      base: baseTributada,
      aliquota: '7,5%',
      imposto: parseFloat((baseTributada * ALIQUOTA_FAIXA2).toFixed(2)),
    });
  } else {
    const baseFaixa2 = FAIXA2_LIMITE - FAIXA1_LIMITE;
    const baseFaixa3 = salario - FAIXA2_LIMITE;
    const impostoFaixa2 = baseFaixa2 * ALIQUOTA_FAIXA2;
    const impostoFaixa3 = baseFaixa3 * ALIQUOTA_FAIXA3;
    imposto = impostoFaixa2 + impostoFaixa3;

    detalhamento.push({
      faixa: `Até R$ ${FAIXA1_LIMITE.toFixed(2)}`,
      base: FAIXA1_LIMITE,
      aliquota: 'Isento',
      imposto: 0,
    });
    detalhamento.push({
      faixa: `R$ ${FAIXA1_LIMITE.toFixed(2)} a R$ ${FAIXA2_LIMITE.toFixed(2)}`,
      base: baseFaixa2,
      aliquota: '7,5%',
      imposto: parseFloat(impostoFaixa2.toFixed(2)),
    });
    detalhamento.push({
      faixa: `Acima de R$ ${FAIXA2_LIMITE.toFixed(2)}`,
      base: baseFaixa3,
      aliquota: '15%',
      imposto: parseFloat(impostoFaixa3.toFixed(2)),
    });
  }

  return {
    salario,
    imposto: parseFloat(imposto.toFixed(2)),
    liquido: parseFloat((salario - imposto).toFixed(2)),
    detalhamento,
  };
}

module.exports = { calcularImposto };
