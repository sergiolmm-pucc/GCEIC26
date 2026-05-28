// ─────────────────────────────────────────
//  Constantes compartilhadas
// ─────────────────────────────────────────
const TARIFA_POR_KG = 2.50;
const TARIFA_POR_KM = 0.15;

const TIPO_CONFIG = {
  economico: { multiplicador: 0.8, prazo: '7 a 10 dias úteis', diasMin: 7,  diasMax: 10 },
  normal:    { multiplicador: 1.0, prazo: '3 a 5 dias úteis',  diasMin: 3,  diasMax: 5  },
  expresso:  { multiplicador: 1.8, prazo: '1 a 2 dias úteis',  diasMin: 1,  diasMax: 2  },
};

// Tabela de distâncias rodoviárias aproximadas entre capitais (km)
const DISTANCIAS = {
  'São Paulo':       { 'Rio de Janeiro': 430, 'Curitiba': 408, 'Belo Horizonte': 586, 'Brasília': 1015, 'Salvador': 1950, 'Fortaleza': 3138, 'Manaus': 4168, 'Porto Alegre': 1109 },
  'Rio de Janeiro':  { 'São Paulo': 430, 'Curitiba': 851, 'Belo Horizonte': 434, 'Brasília': 1148, 'Salvador': 1650, 'Fortaleza': 2808, 'Manaus': 4598, 'Porto Alegre': 1539 },
  'Curitiba':        { 'São Paulo': 408, 'Rio de Janeiro': 851, 'Belo Horizonte': 994, 'Brasília': 1423, 'Salvador': 2358, 'Porto Alegre': 710 },
  'Belo Horizonte':  { 'São Paulo': 586, 'Rio de Janeiro': 434, 'Curitiba': 994, 'Brasília': 716, 'Salvador': 1368, 'Fortaleza': 2604 },
  'Brasília':        { 'São Paulo': 1015, 'Rio de Janeiro': 1148, 'Belo Horizonte': 716, 'Salvador': 1450, 'Fortaleza': 2207, 'Manaus': 3522 },
  'Salvador':        { 'São Paulo': 1950, 'Rio de Janeiro': 1650, 'Brasília': 1450, 'Fortaleza': 1116, 'Recife': 839 },
  'Fortaleza':       { 'São Paulo': 3138, 'Rio de Janeiro': 2808, 'Brasília': 2207, 'Salvador': 1116, 'Recife': 800, 'Manaus': 4222 },
  'Recife':          { 'Salvador': 839, 'Fortaleza': 800, 'São Paulo': 2660, 'Rio de Janeiro': 2310 },
  'Manaus':          { 'São Paulo': 4168, 'Brasília': 3522, 'Fortaleza': 4222, 'Porto Alegre': 5277 },
  'Porto Alegre':    { 'São Paulo': 1109, 'Rio de Janeiro': 1539, 'Curitiba': 710, 'Manaus': 5277 },
};

// ══════════════════════════════════════════
//  ALUNO 1 — Cálculo do Frete (consolidado)
// ══════════════════════════════════════════
function calcularFrete({ peso, distancia, tipo }) {
  if (peso <= 0)      throw new Error('Peso deve ser maior que zero');
  if (distancia <= 0) throw new Error('Distância deve ser maior que zero');

  const config = TIPO_CONFIG[tipo];
  if (!config) throw new Error(`Tipo inválido: ${tipo}`);

  const custoPeso      = parseFloat((peso * TARIFA_POR_KG).toFixed(2));
  const custoDistancia = parseFloat((distancia * TARIFA_POR_KM).toFixed(2));
  const valorBase      = parseFloat((custoPeso + custoDistancia).toFixed(2));
  const valorFinal     = parseFloat((valorBase * config.multiplicador).toFixed(2));

  return {
    peso,
    distancia,
    tipo,
    custoPeso,
    custoDistancia,
    valorBase,
    multiplicadorTipo: config.multiplicador,
    valorFinal,
    prazoEntrega: config.prazo,
  };
}

// ══════════════════════════════════════════
//  ALUNO 2 — Cálculo de Distância por cidade
// ══════════════════════════════════════════
function calcularDistancia({ origem, destino }) {
  if (!origem || !destino) throw new Error('Origem e destino são obrigatórios');
  if (origem === destino)  throw new Error('Origem e destino não podem ser iguais');

  const distanciaKm =
    (DISTANCIAS[origem] && DISTANCIAS[origem][destino]) ??
    (DISTANCIAS[destino] && DISTANCIAS[destino][origem]) ??
    null;

  if (distanciaKm === null) {
    throw new Error(`Rota não encontrada: ${origem} → ${destino}`);
  }

  const custoDistancia = parseFloat((distanciaKm * TARIFA_POR_KM).toFixed(2));

  let faixaRegiao;
  let descricaoFaixa;

  if (distanciaKm <= 100) {
    faixaRegiao    = 'local';
    descricaoFaixa = 'Entrega local (até 100 km)';
  } else if (distanciaKm <= 500) {
    faixaRegiao    = 'estadual';
    descricaoFaixa = 'Entrega estadual (100 a 500 km)';
  } else if (distanciaKm <= 1500) {
    faixaRegiao    = 'interestadual';
    descricaoFaixa = 'Entrega interestadual (500 a 1500 km)';
  } else {
    faixaRegiao    = 'longa_distancia';
    descricaoFaixa = 'Longa distância (acima de 1500 km)';
  }

  return { origem, destino, distanciaKm, custoDistancia, faixaRegiao, descricaoFaixa };
}

function listarCidades() {
  return Object.keys(DISTANCIAS).sort();
}

// ══════════════════════════════════════════
//  ALUNO 3 — Cálculo de Prazo de Entrega
// ══════════════════════════════════════════
function calcularPrazo({ distanciaKm, tipo }) {
  if (distanciaKm <= 0) throw new Error('Distância deve ser maior que zero');

  const config = TIPO_CONFIG[tipo];
  if (!config) throw new Error(`Tipo inválido: ${tipo}`);

  const ajuste       = Math.min(Math.floor(Math.max(0, distanciaKm - 500) / 500), 4);
  const diasUteisMin = config.diasMin + ajuste;
  const diasUteisMax = config.diasMax + ajuste;
  const prazoEntrega = `${diasUteisMin} a ${diasUteisMax} dias úteis`;
  const dataEstimada = calcularDataUtil(diasUteisMax);

  return { distanciaKm, tipo, diasUteisMin, diasUteisMax, prazoEntrega, dataEstimada };
}

function calcularDataUtil(diasUteis) {
  const data = new Date();
  let contagem = 0;
  while (contagem < diasUteis) {
    data.setDate(data.getDate() + 1);
    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) contagem++;
  }
  return data.toLocaleDateString('pt-BR');
}

module.exports = { calcularFrete, calcularDistancia, listarCidades, calcularPrazo };
