const TABELA = {
  CAMPOS: [
    "custoProduto",
    "despesasFixas",
    "despesasVariaveis",
    "impostos",
    "margemLucro",
  ],
  FORMULA: "preco_venda = custo_produto / (1 - percentual_total)",
};

function lerNumero(dados, campo) {
  const valor = Number(dados[campo]);

  if (!Number.isFinite(valor)) {
    throw new TypeError(`Campo ${campo} deve ser numerico`);
  }

  return valor;
}

function lerPercentual(dados, campo) {
  const valor = lerNumero(dados, campo);

  if (valor < 0) {
    throw new Error(`Campo ${campo} nao pode ser negativo`);
  }

  return valor / 100;
}

function calcularMarkup(dados) {
  if (!dados || typeof dados !== "object") {
    throw new TypeError("Corpo da requisicao invalido");
  }

  const custoProduto = lerNumero(dados, "custoProduto");

  if (custoProduto <= 0) {
    throw new Error("Custo do produto deve ser maior que zero");
  }

  const despesasFixas = lerPercentual(dados, "despesasFixas");
  const despesasVariaveis = lerPercentual(dados, "despesasVariaveis");
  const impostos = lerPercentual(dados, "impostos");
  const margemLucro = lerPercentual(dados, "margemLucro");
  const percentualTotal = Number(
    (despesasFixas + despesasVariaveis + impostos + margemLucro).toFixed(10),
  );

  if (percentualTotal >= 1) {
    throw new Error("A soma dos percentuais deve ser menor que 100%");
  }

  const precoVenda = custoProduto / (1 - percentualTotal);

  return {
    custoProduto: custoProduto.toFixed(2),
    percentualTotal: Number(percentualTotal.toFixed(4)),
    percentuais: {
      despesasFixas: Number(despesasFixas.toFixed(4)),
      despesasVariaveis: Number(despesasVariaveis.toFixed(4)),
      impostos: Number(impostos.toFixed(4)),
      margemLucro: Number(margemLucro.toFixed(4)),
    },
    precoVenda: precoVenda.toFixed(2),
  };
}

function calcular(dados) {
  return calcularMarkup(dados);
}

module.exports = {
  TABELA,
  calcular,
  calcularMarkup,
};
