const CAMPOS_CUSTO_BURGCALC = [
  'pao',
  'carne',
  'queijo',
  'molho',
  'salada',
  'embalagem',
  'custoAdicional',
];

const TABELA = {
  CAMPOS_CUSTO: CAMPOS_CUSTO_BURGCALC,
  CAMPOS_OBRIGATORIOS: [
    ...CAMPOS_CUSTO_BURGCALC,
    'quantidade',
    'margemLucro',
  ],
  FORMULA: 'precoVendaSugerido = (custoTotal / quantidade) * (1 + margemLucro / 100)',
};

function converterNumero(valor, campo) {
  if (typeof valor === 'string' && valor.trim() === '') {
    throw new Error(`${campo} deve ser um numero valido`);
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    throw new Error(`${campo} deve ser um numero valido`);
  }

  return numero;
}

function arredondarMoeda(valor) {
  return Number(valor.toFixed(2));
}

function calcularBurgcalc(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new Error('Dados invalidos para BURGCALC');
  }

  const custos = CAMPOS_CUSTO_BURGCALC.reduce((total, campo) => {
    const valor = converterNumero(dados[campo], campo);

    if (valor < 0) {
      throw new Error(`${campo} nao pode ser negativo`);
    }

    return total + valor;
  }, 0);

  const quantidade = converterNumero(dados.quantidade, 'quantidade');
  const margemLucro = converterNumero(dados.margemLucro, 'margemLucro');

  if (quantidade <= 0) {
    throw new Error('quantidade deve ser maior que zero');
  }

  if (margemLucro < 0) {
    throw new Error('margemLucro nao pode ser negativa');
  }

  const custoTotal = custos;
  const custoUnitario = custoTotal / quantidade;
  const precoVendaSugerido = custoUnitario * (1 + (margemLucro / 100));
  const lucroEstimadoPorUnidade = precoVendaSugerido - custoUnitario;

  return {
    custoTotal: arredondarMoeda(custoTotal),
    custoUnitario: arredondarMoeda(custoUnitario),
    precoVendaSugerido: arredondarMoeda(precoVendaSugerido),
    lucroEstimadoPorUnidade: arredondarMoeda(lucroEstimadoPorUnidade),
  };
}

module.exports = {
  TABELA,
  calcularBurgcalc,
};
