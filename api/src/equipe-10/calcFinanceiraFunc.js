function calcularJurosSimples(dados) {
  const { capital, taxa, tempo } = dados;
  if (!capital || capital <= 0) throw new Error('Capital deve ser maior que zero');
  if (!taxa || taxa < 0) throw new Error('Taxa deve ser um valor positivo');
  if (!tempo || tempo <= 0) throw new Error('Tempo deve ser maior que zero');

  const juros = capital * (taxa / 100) * tempo;
  const montante = capital + juros;
  return { capital, juros, montante: parseFloat(montante.toFixed(2)) };
}

function calcularJurosCompostos(dados) {
  const { capital, taxa, tempo } = dados;
  if (!capital || capital <= 0) throw new Error('Capital deve ser maior que zero');
  if (!taxa || taxa < 0) throw new Error('Taxa deve ser um valor positivo');
  if (!tempo || tempo <= 0) throw new Error('Tempo deve ser maior que zero');

  const montante = capital * Math.pow((1 + taxa / 100), tempo);
  const juros = montante - capital;
  return { capital, juros: parseFloat(juros.toFixed(2)), montante: parseFloat(montante.toFixed(2)) };
}

function simularInvestimento(dados) {
  const { aporteMensal, taxa, tempoMeses } = dados;
  if (!aporteMensal || aporteMensal <= 0) throw new Error('Aporte deve ser maior que zero');
  if (!taxa || taxa < 0) throw new Error('Taxa deve ser positiva');
  if (!tempoMeses || tempoMeses <= 0) throw new Error('Tempo deve ser maior que zero');

  let montante = 0;
  const taxaDecimal = taxa / 100;
  for (let i = 0; i < tempoMeses; i++) {
    montante = (montante + aporteMensal) * (1 + taxaDecimal);
  }
  const totalInvestido = aporteMensal * tempoMeses;
  const rendimento = montante - totalInvestido;

  return { 
    totalInvestido, 
    rendimento: parseFloat(rendimento.toFixed(2)), 
    montante: parseFloat(montante.toFixed(2)) 
  };
}

module.exports = {
  calcularJurosSimples,
  calcularJurosCompostos,
  simularInvestimento
};