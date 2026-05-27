// ============================================================
// TABELA DE REFERÊNCIA
// Baseada em médias de consumo residencial (fonte: CAESB)
// ============================================================
const TABELA = {
  LITROS_POR_MIN_BANHO: 4.5,   // média entre 3L e 6L por minuto
  LITROS_POR_DESCARGA: 8.5,    // média entre 7L e 10L por descarga
  TARIFA: {
    faixas: [
      { ate: 10,       tarifa: 4.50 },
      { ate: 15,       tarifa: 8.20 },
      { ate: 20,       tarifa: 12.50 },
      { ate: 50,       tarifa: 18.90 },
      { ate: Infinity, tarifa: 25.70 },
    ],
  },
  LITROS_POR_M3: 1000,
  MARGEM_SEGURANCA: 0.30,
};

// ============================================================
// API 1 — ANA: Consumo Diário
// ============================================================
function calcularConsumoDiario(tempoBanhoMin, descargasDia, pessoas = 1) {
  if (tempoBanhoMin < 0) throw new Error('Tempo de banho não pode ser negativo');
  if (descargasDia < 0)  throw new Error('Número de descargas não pode ser negativo');
  if (pessoas <= 0)      throw new Error('Número de pessoas deve ser maior que zero');

  const consumoPorPessoa    = (tempoBanhoMin * TABELA.LITROS_POR_MIN_BANHO)
                            + (descargasDia  * TABELA.LITROS_POR_DESCARGA);
  const consumoDiarioLitros = consumoPorPessoa * pessoas;

  return {
    consumoPorPessoa:     parseFloat(consumoPorPessoa.toFixed(2)),
    consumoDiarioLitros:  parseFloat(consumoDiarioLitros.toFixed(2)),
    pessoas,
  };
}

// ============================================================
// API 2 — HUGO: Custo Mensal
// ============================================================
function calcularCustoMensal(consumoDiarioLitros, tarifa, dias = 30) {
  if (consumoDiarioLitros < 0) throw new Error('Consumo não pode ser negativo');
  if (tarifa <= 0)             throw new Error('Tarifa deve ser maior que zero');
  if (dias <= 0 || dias > 31)  throw new Error('Número de dias inválido');

  const consumoMensalLitros = consumoDiarioLitros * dias;
  const consumoMensalM3     = consumoMensalLitros / TABELA.LITROS_POR_M3;

  const faixa = TABELA.TARIFA.faixas.find(f => consumoMensalM3 <= f.ate)
             || TABELA.TARIFA.faixas[TABELA.TARIFA.faixas.length - 1];

  const custoEstimado = parseFloat((consumoMensalLitros * tarifa).toFixed(2));

  return {
    consumoMensalLitros: parseFloat(consumoMensalLitros.toFixed(2)),
    consumoMensalM3:     parseFloat(consumoMensalM3.toFixed(4)),
    faixaTarifa:         faixa.tarifa,
    custoEstimado,
    dias,
  };
}

// ============================================================
// API 3 — LETÍCIA: Projeção de Economia
// pessoas agora é parâmetro para calcular sugestão por pessoa
// ============================================================
function calcularEconomia(litrosAtuais, reducaoPercentual, tarifa, pessoas = 1) {
  if (litrosAtuais <= 0)                              throw new Error('Consumo atual deve ser maior que zero');
  if (reducaoPercentual <= 0 || reducaoPercentual >= 100) throw new Error('Redução deve estar entre 1% e 99%');
  if (tarifa <= 0)                                    throw new Error('Tarifa deve ser maior que zero');
  if (pessoas <= 0)                                   throw new Error('Número de pessoas deve ser maior que zero');

  const economiaLitros    = litrosAtuais * (reducaoPercentual / 100);
  const novoConsumoLitros = litrosAtuais - economiaLitros;
  const novoCusto         = novoConsumoLitros * tarifa;
  const economiaReais     = economiaLitros * tarifa;

  // Sugestão por pessoa por dia
  const economiaDiariaPorPessoa = (economiaLitros / 30) / pessoas;
  const reducaoBanhoMinutos     = economiaDiariaPorPessoa / TABELA.LITROS_POR_MIN_BANHO;
  const reducaoDescargas        = economiaDiariaPorPessoa / TABELA.LITROS_POR_DESCARGA;

  return {
    economiaLitros:       parseFloat(economiaLitros.toFixed(2)),
    novoConsumoLitros:    parseFloat(novoConsumoLitros.toFixed(2)),
    novoCusto:            parseFloat(novoCusto.toFixed(2)),
    economiaReais:        parseFloat(economiaReais.toFixed(2)),
    reducaoBanhoMinutos:  parseFloat(reducaoBanhoMinutos.toFixed(2)),
    reducaoDescargas:     parseFloat(reducaoDescargas.toFixed(2)),
  };
}

// ============================================================
// Função auxiliar usada pelos testes
// ============================================================
function calcular(dados) {
  const { pessoas = 1, tempoBanhoMin = 0, descargasDia = 0, tarifa = 0.005, dias = 30, reducaoPercentual = 10 } = dados;
  const diario  = calcularConsumoDiario(tempoBanhoMin, descargasDia, pessoas);
  const mensal  = calcularCustoMensal(diario.consumoDiarioLitros, tarifa, dias);
  const economia = calcularEconomia(mensal.consumoMensalLitros, reducaoPercentual, tarifa, pessoas);
  return { ...diario, ...mensal, economia };
}

module.exports = {
  TABELA,
  calcularConsumoDiario,
  calcularCustoMensal,
  calcularEconomia,
  calcular,
};
