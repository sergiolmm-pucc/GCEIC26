// ============================================================
//  SaunaCalc Elite — funções de cálculo
//  Padrão: TABELA de referência + função calcular(dados)
// ============================================================

const TABELA = {
  BASE_CALC: {
    // faixas de volume (m³) → potência recomendada (kW)
    faixas: [
      { ate: 6,   kw: 6  },
      { ate: 10,  kw: 9  },
      { ate: 15,  kw: 12 },
      { ate: 20,  kw: 15 },
      { ate: 999, kw: 18 },
    ],
  },
  TIPOS: {
    seca: {
      precoPorKw:       300,
      manutencaoMensal: 80,
      hidraulica:       0,
    },
    vapor: {
      precoPorKw:       350,
      manutencaoMensal: 50,
      hidraulica:       2000,
    },
    infravermelha: {
      precoPorKw:       250,
      manutencaoMensal: 40,
      hidraulica:       0,
    },
  },
  REFERENCIA: 0.85, // tarifa padrão kWh (Campinas/SP)
};

// ----------------------------------------------------------
// Pessoa 2 — encontrarPotencia
// Recebe volume em m³, devolve potência em kW
// ----------------------------------------------------------
function encontrarPotencia(volumeM3) {
  if (volumeM3 <= 0) throw new Error('volumeM3 deve ser maior que zero');
  const faixa = TABELA.BASE_CALC.faixas.find(f => volumeM3 <= f.ate);
  if (!faixa) throw new Error('Volume fora do intervalo suportado (máx 999 m³)');
  return faixa.kw;
}

// ----------------------------------------------------------
// Pessoa 2 — calcularKit
// Recebe { tipo, volumeM3 }
// Devolve potência recomendada e custo do kit
// ----------------------------------------------------------
function calcularKit({ tipo, volumeM3 }) {
  if (!tipo)           throw new Error('Campo "tipo" é obrigatório');
  if (!volumeM3)       throw new Error('Campo "volumeM3" é obrigatório');
  if (!TABELA.TIPOS[tipo]) throw new Error('Tipo inválido. Use: seca, vapor ou infravermelha');

  const potenciaKW = encontrarPotencia(Number(volumeM3));
  const config     = TABELA.TIPOS[tipo];
  const custoKit   = potenciaKW * config.precoPorKw;

  return {
    tipo,
    volumeM3: Number(volumeM3),
    potenciaKW,
    custoKit,
  };
}

// ----------------------------------------------------------
// Pessoa 3 — calcularInstalacao
// Recebe { tipo, volumeM3, horasPorDia, diasPorMes, tarifaKwh }
// Devolve custos de instalação e operação mensal
// ----------------------------------------------------------
function calcularInstalacao({ tipo, volumeM3, horasPorDia, diasPorMes, tarifaKwh }) {
  if (!tipo)     throw new Error('Campo "tipo" é obrigatório');
  if (!volumeM3) throw new Error('Campo "volumeM3" é obrigatório');
  if (!TABELA.TIPOS[tipo]) throw new Error('Tipo inválido. Use: seca, vapor ou infravermelha');

  const config     = TABELA.TIPOS[tipo];
  const potenciaKW = encontrarPotencia(Number(volumeM3));

  // instalação
  const eletrica        = potenciaKW * 80;
  const hidraulica      = config.hidraulica;
  const maoDeObra       = 4000;
  const totalInstalacao = eletrica + hidraulica + maoDeObra;

  // operação mensal
  const tarifa       = Number(tarifaKwh)   || TABELA.REFERENCIA;
  const horas        = Number(horasPorDia) || 2;
  const dias         = Number(diasPorMes)  || 20;
  const custoEnergia = potenciaKW * horas * dias * tarifa;
  const totalMensal  = custoEnergia + config.manutencaoMensal;

  return {
    instalacao: {
      eletrica,
      hidraulica,
      maoDeObra,
      total: totalInstalacao,
    },
    operacao: {
      custoEnergia:     Number(custoEnergia.toFixed(2)),
      manutencaoMensal: config.manutencaoMensal,
      totalMensal:      Number(totalMensal.toFixed(2)),
    },
  };
}

// ----------------------------------------------------------
// Pessoa 1 — calcular (função principal — padrão do professor)
// Recebe todos os dados, devolve simulação completa
// ----------------------------------------------------------
function calcular(dados) {
  const { tipo, volumeM3, horasPorDia, diasPorMes, tarifaKwh } = dados;

  if (!tipo)     throw new Error('Campo "tipo" é obrigatório');
  if (!volumeM3) throw new Error('Campo "volumeM3" é obrigatório');
  if (!TABELA.TIPOS[tipo]) throw new Error('Tipo inválido. Use: seca, vapor ou infravermelha');

  const kit         = calcularKit({ tipo, volumeM3 });
  const instalAndOp = calcularInstalacao({ tipo, volumeM3, horasPorDia, diasPorMes, tarifaKwh });

  return {
    tipo,
    potenciaKW: kit.potenciaKW,
    kit: {
      custoKit: kit.custoKit,
    },
    instalacao: instalAndOp.instalacao,
    operacao:   instalAndOp.operacao,
  };
}

module.exports = { TABELA, calcular, calcularKit, calcularInstalacao, encontrarPotencia };