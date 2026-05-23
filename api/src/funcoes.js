// Tabela de referência para cálculo de consumo de água
const TABELA = {
  CONSUMO_MEDIO_POR_PESSOA: 150, // litros/dia 
  TARIFA: {
    faixas: [
      { ate: 10,  tarifa: 4.50 },   // até 10m³ - tarifa mínima
      { ate: 15,  tarifa: 8.20 },   // até 15m³
      { ate: 20,  tarifa: 12.50 },  // até 20m³
      { ate: 50,  tarifa: 18.90 },  // até 50m³
      { ate: Infinity, tarifa: 25.70 }, // acima de 50m³
    ],
    unidade: 'm³',
  },
  LITROS_POR_M3: 1000,
  REFERENCIA: 30 / 100, // 30% de margem de segurança sugerida
};

/**
 * Calcula o consumo diário de água de uma residência em litros
 * @param {number} pessoas - número de moradores
 * @param {number} litrosPorPessoa - litros por pessoa por dia 
 */
function calcularConsumoDiario(pessoas, litrosPorPessoa = TABELA.CONSUMO_MEDIO_POR_PESSOA) {
  if (!pessoas || pessoas <= 0) throw new Error('Número de pessoas deve ser maior que zero');
  if (litrosPorPessoa <= 0) throw new Error('Consumo por pessoa deve ser maior que zero');
  const totalLitros = pessoas * litrosPorPessoa;
  return parseFloat(totalLitros.toFixed(2));
}

/**
 * Converte litros para m³
 */
function litrosParaM3(litros) {
  if (litros < 0) throw new Error('Litros não pode ser negativo');
  return parseFloat((litros / TABELA.LITROS_POR_M3).toFixed(4));
}

/**
 * Calcula o consumo mensal em m³
 * @param {number} pessoas - número de moradores
 * @param {number} litrosPorPessoa - litros por pessoa por dia
 * @param {number} dias - dias do mês 
 */
function calcularConsumoMensal(pessoas, litrosPorPessoa = TABELA.CONSUMO_MEDIO_POR_PESSOA, dias = 30) {
  if (!pessoas || pessoas <= 0) throw new Error('Número de pessoas deve ser maior que zero');
  if (dias <= 0 || dias > 31) throw new Error('Número de dias inválido');
  const litrosDia = calcularConsumoDiario(pessoas, litrosPorPessoa);
  const litrosMes = litrosDia * dias;
  const m3Mes = litrosParaM3(litrosMes);
  return {
    litrosDia: parseFloat(litrosDia.toFixed(2)),
    litrosMes: parseFloat(litrosMes.toFixed(2)),
    m3Mes: parseFloat(m3Mes.toFixed(4)),
  };
}

/**
 * Calcula o valor da conta de água baseado no consumo em m³
 * @param {number} m3 - consumo em metros cúbicos
 */
function calcularConta(m3) {
  if (m3 < 0) throw new Error('Consumo não pode ser negativo');
  const faixas = TABELA.TARIFA.faixas;
  let faixaAtual = faixas.find(f => m3 <= f.ate);
  if (!faixaAtual) faixaAtual = faixas[faixas.length - 1];
  const valorBase = m3 * faixaAtual.tarifa;
  const margem = valorBase * TABELA.REFERENCIA;
  return {
    consumoM3: parseFloat(m3.toFixed(4)),
    tarifaM3: faixaAtual.tarifa,
    valorBase: parseFloat(valorBase.toFixed(2)),
    margemSeguranca: parseFloat(margem.toFixed(2)),
    valorTotal: parseFloat((valorBase + margem).toFixed(2)),
  };
}

/**
 * Função principal: calcula tudo a partir dos dados da requisição
 * Compatível com o endpoint POST /api/calcular
 */
function calcular(dados) {
  const { pessoas = 0, litrosPorPessoa = TABELA.CONSUMO_MEDIO_POR_PESSOA, dias = 30 } = dados;
  if (!pessoas || pessoas <= 0) throw new Error('Número de pessoas deve ser maior que zero');

  const consumo = calcularConsumoMensal(pessoas, litrosPorPessoa, dias);
  const conta = calcularConta(consumo.m3Mes);

  return {
    pessoas,
    litrosPorPessoa,
    dias,
    ...consumo,
    ...conta,
  };
}

module.exports = {
  TABELA,
  calcularConsumoDiario,
  litrosParaM3,
  calcularConsumoMensal,
  calcularConta,
  calcular,
};