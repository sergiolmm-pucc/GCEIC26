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
    // Totalmente isento
    detalhamento.push({
      faixa: `Até R$ ${FAIXA1_LIMITE.toFixed(2)}`,
      base: salario,
      aliquota: "Isento",
      imposto: 0,
    });
  } else if (salario <= FAIXA2_LIMITE) {
    // Isento na primeira parte, 7,5% no restante
    const baseIsenta = FAIXA1_LIMITE;
    const baseTributada = salario - FAIXA1_LIMITE;
    const impostoParcial = baseTributada * ALIQUOTA_FAIXA2;
    imposto = impostoParcial;

    detalhamento.push({
      faixa: `Até R$ ${FAIXA1_LIMITE.toFixed(2)}`,
      base: baseIsenta,
      aliquota: "Isento",
      imposto: 0,
    });
    detalhamento.push({
      faixa: `R$ ${FAIXA1_LIMITE.toFixed(2)} a R$ ${FAIXA2_LIMITE.toFixed(2)}`,
      base: baseTributada,
      aliquota: "7,5%",
      imposto: parseFloat(impostoParcial.toFixed(2)),
    });
  } else {
    // Isento até 2500, 7,5% de 2500 a 5000, 15% acima de 5000
    const baseFaixa2 = FAIXA2_LIMITE - FAIXA1_LIMITE; // 2500
    const baseFaixa3 = salario - FAIXA2_LIMITE;
    const impostoFaixa2 = baseFaixa2 * ALIQUOTA_FAIXA2;
    const impostoFaixa3 = baseFaixa3 * ALIQUOTA_FAIXA3;
    imposto = impostoFaixa2 + impostoFaixa3;

    detalhamento.push({
      faixa: `Até R$ ${FAIXA1_LIMITE.toFixed(2)}`,
      base: FAIXA1_LIMITE,
      aliquota: "Isento",
      imposto: 0,
    });
    detalhamento.push({
      faixa: `R$ ${FAIXA1_LIMITE.toFixed(2)} a R$ ${FAIXA2_LIMITE.toFixed(2)}`,
      base: baseFaixa2,
      aliquota: "7,5%",
      imposto: parseFloat(impostoFaixa2.toFixed(2)),
    });
    detalhamento.push({
      faixa: `Acima de R$ ${FAIXA2_LIMITE.toFixed(2)}`,
      base: baseFaixa3,
      aliquota: "15%",
      imposto: parseFloat(impostoFaixa3.toFixed(2)),
    });
  }

  const impostoTotal = parseFloat(imposto.toFixed(2));
  const liquido = parseFloat((salario - impostoTotal).toFixed(2));

  return {
    salario,
    imposto: impostoTotal,
    liquido,
    detalhamento,
  };
}

module.exports = { calcularImposto };
