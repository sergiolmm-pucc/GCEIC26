function calcularArea(a, b) {
  if (!a || a <= 0) throw new Error('Valor inválido');
  if (!b || b <= 0) throw new Error('Valor inválido');

  return (a * b).toFixed(2);
}

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

  return parseFloat(parcela.toFixed(2));
}

module.exports = { calcularArea, calcularParcela };