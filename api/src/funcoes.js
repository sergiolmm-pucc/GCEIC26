function calcularParcela(valorVeiculo, entrada, taxaMensal, numParcelas) {
  if (valorVeiculo <= 0) throw new Error('Valor do veículo inválido');
  if (entrada < 0) throw new Error('Entrada inválida');
  if (taxaMensal < 0) throw new Error('Taxa mensal inválida');
  if (numParcelas <= 0) throw new Error('Número de parcelas inválido');

  const valorFinanciado = valorVeiculo - entrada;
  if (valorFinanciado <= 0) throw new Error('Entrada maior que o valor do veículo');

  const i = taxaMensal / 100;
  let parcela;

  if (i === 0) {
    parcela = valorFinanciado / numParcelas;
  } else {
    parcela = valorFinanciado * (i * Math.pow(1 + i, numParcelas)) / (Math.pow(1 + i, numParcelas) - 1);
  }

  const totalPago = parcela * numParcelas;
  const jurosTotais = totalPago - valorFinanciado;

  return {
    valorFinanciado: parseFloat(valorFinanciado.toFixed(2)),
    parcela: parseFloat(parcela.toFixed(2)),
    totalPago: parseFloat(totalPago.toFixed(2)),
    jurosTotais: parseFloat(jurosTotais.toFixed(2)),
    numParcelas,
    taxaMensal,
  };
}

function calcularCapacidade(rendaMensal, taxaMensal, numParcelas, entradaPercent) {
  if (rendaMensal <= 0) throw new Error('Renda mensal inválida');
  if (entradaPercent < 0 || entradaPercent >= 100) throw new Error('Percentual de entrada inválido');

  const parcelaMaxima = rendaMensal * 0.30;
  const i = taxaMensal / 100;

  let valorFinanciadoMax;
  if (i === 0) {
    valorFinanciadoMax = parcelaMaxima * numParcelas;
  } else {
    valorFinanciadoMax = parcelaMaxima * (Math.pow(1 + i, numParcelas) - 1) / (i * Math.pow(1 + i, numParcelas));
  }

  const valorVeiculoMax = valorFinanciadoMax / (1 - entradaPercent / 100);

  return {
    parcelaMaxima: parseFloat(parcelaMaxima.toFixed(2)),
    valorFinanciadoMax: parseFloat(valorFinanciadoMax.toFixed(2)),
    valorVeiculoMax: parseFloat(valorVeiculoMax.toFixed(2)),
    entradaPercent,
  };
}

module.exports = { calcularParcela, calcularCapacidade };