
// Henrique Zaccarias - Cálculo de Autonomia
function calcularAutonomia(kmPercorridos, litrosAbastecidos) {
  if (!kmPercorridos || !litrosAbastecidos) {
    throw new Error('kmPercorridos e litrosAbastecidos são obrigatórios');
  }
  if (kmPercorridos <= 0 || litrosAbastecidos <= 0) {
    throw new Error('Os valores devem ser maiores que zero');
  }

  const autonomia = kmPercorridos / litrosAbastecidos;

  let classificacao;
  if (autonomia >= 15) classificacao = 'Excelente';
  else if (autonomia >= 12) classificacao = 'Boa';
  else if (autonomia >= 9) classificacao = 'Regular';
  else classificacao = 'Ruim';

  return {
    autonomia: parseFloat(autonomia.toFixed(2)),
    unidade: 'km/l',
    classificacao,
    kmPercorridos,
    litrosAbastecidos,
  };
}

// Rafael Tamura — Custo de Viagem
function calcularCustoViagem(distanciaKm, autonomiaKmL, precoCombustivel) {
  if (!distanciaKm || !autonomiaKmL || !precoCombustivel) {
    throw new Error('distanciaKm, autonomiaKmL e precoCombustivel são obrigatórios');
  }
  if (distanciaKm <= 0 || autonomiaKmL <= 0 || precoCombustivel <= 0) {
    throw new Error('Os valores devem ser maiores que zero');
  }

  const litrosNecessarios = distanciaKm / autonomiaKmL;
  const custoTotal = litrosNecessarios * precoCombustivel;
  const custoPorKm = custoTotal / distanciaKm;

  return {
    distanciaKm,
    autonomiaKmL,
    precoCombustivel,
    litrosNecessarios: parseFloat(litrosNecessarios.toFixed(2)),
    custoTotal: parseFloat(custoTotal.toFixed(2)),
    custoPorKm: parseFloat(custoPorKm.toFixed(4)),
  };
}

// Caio Adamo — Comparar Combustível (Regra dos 70%)
function compararCombustivel(precoGasolina, precoEtanol, autonomiaGasolina, autonomiaEtanol) {
  if (!precoGasolina || !precoEtanol || !autonomiaGasolina || !autonomiaEtanol) {
    throw new Error('Todos os campos são obrigatórios: precoGasolina, precoEtanol, autonomiaGasolina, autonomiaEtanol');
  }
  if (precoGasolina <= 0 || precoEtanol <= 0 || autonomiaGasolina <= 0 || autonomiaEtanol <= 0) {
    throw new Error('Os valores devem ser maiores que zero');
  }

  const custoPorKmGasolina = precoGasolina / autonomiaGasolina;
  const custoPorKmEtanol = precoEtanol / autonomiaEtanol;

  const relacaoEtanol = precoEtanol / precoGasolina;

  const etanolCompensa = relacaoEtanol < 0.7;
  const melhorOpcao = etanolCompensa ? 'Etanol' : 'Gasolina';

  const economiaPercentual = etanolCompensa
    ? ((custoPorKmGasolina - custoPorKmEtanol) / custoPorKmGasolina) * 100
    : ((custoPorKmEtanol - custoPorKmGasolina) / custoPorKmEtanol) * 100;

  return {
    melhorOpcao,
    relacaoEtanol: parseFloat(relacaoEtanol.toFixed(4)),
    etanolCompensa,
    custoPorKmGasolina: parseFloat(custoPorKmGasolina.toFixed(4)),
    custoPorKmEtanol: parseFloat(custoPorKmEtanol.toFixed(4)),
    economiaPercentual: parseFloat(economiaPercentual.toFixed(2)),
    dica: etanolCompensa
      ? `Etanol é ${economiaPercentual.toFixed(1)}% mais barato por km`
      : `Gasolina é ${economiaPercentual.toFixed(1)}% mais barata por km`,
  };
}

module.exports = { calcularAutonomia, calcularCustoViagem, compararCombustivel };
