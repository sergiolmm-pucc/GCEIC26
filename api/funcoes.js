function calcularParcela(valorVeiculo, entrada, taxaMensal, numParcelas) {
  if (!valorVeiculo || valorVeiculo <= 0) throw new Error('Valor do veículo inválido');
  if (entrada >= valorVeiculo) throw new Error('Entrada maior que o valor do veículo');
  if (taxaMensal < 0) throw new Error('Taxa não pode ser negativa');
  if (!numParcelas || numParcelas <= 0) throw new Error('Número de parcelas inválido');

  const valorFinanciado = valorVeiculo - entrada;
  const taxa = taxaMensal / 100;

  if (taxa === 0) return valorFinanciado / numParcelas;

  const parcela = valorFinanciado * (taxa * Math.pow(1 + taxa, numParcelas)) / (Math.pow(1 + taxa, numParcelas) - 1);
  return parseFloat(parcela.toFixed(2));
}

function calcularCapacidade(rendaMensal, percentualEntrada) {
  if (!rendaMensal || rendaMensal <= 0) throw new Error('Renda inválida');
  if (percentualEntrada >= 100) throw new Error('Percentual de entrada não pode ser 100%');

  const capacidade = rendaMensal * 0.3 * 48;
  return parseFloat(capacidade.toFixed(2));
}

module.exports = { calcularParcela, calcularCapacidade };
