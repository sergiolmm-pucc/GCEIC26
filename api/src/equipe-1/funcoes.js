function calcularParcela(valorVeiculo, entrada, taxaMensal, numParcelas) {
  if (!valorVeiculo || valorVeiculo <= 0) throw new Error('Valor do veículo inválido');
  if (entrada >= valorVeiculo) throw new Error('Entrada maior que o valor do veículo');
  if (taxaMensal < 0) throw new Error('Taxa não pode ser negativa');
  if (!numParcelas || numParcelas <= 0) throw new Error('Número de parcelas inválido');

  const valorFinanciado = valorVeiculo - entrada;
  const taxa = taxaMensal / 100;

  let parcela;
  if (taxa === 0) {
    parcela = valorFinanciado / numParcelas;
  } else {
    parcela = valorFinanciado * (taxa * Math.pow(1 + taxa, numParcelas)) / (Math.pow(1 + taxa, numParcelas) - 1);
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
  if (!rendaMensal || rendaMensal <= 0) throw new Error('Renda inválida');
  if (entradaPercent >= 100) throw new Error('Percentual de entrada não pode ser 100%');

  const parcelaMaxima = rendaMensal * 0.30;
  const taxa = taxaMensal / 100;

  let valorFinanciadoMax;
  if (taxa === 0) {
    valorFinanciadoMax = parcelaMaxima * numParcelas;
  } else {
    valorFinanciadoMax = parcelaMaxima * (Math.pow(1 + taxa, numParcelas) - 1) / (taxa * Math.pow(1 + taxa, numParcelas));
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