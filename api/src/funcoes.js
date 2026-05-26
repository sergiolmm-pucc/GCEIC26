const TABELA = {
  BASE_CALC: {
    faixas: [
      { ate: 15, alicota: 0.01 },
      { ate: 30, alicota: 0.03 },
    ],
  },
  REFERENCIA: 20 / 100,
};

function calcularArea(base, altura) {
  if (base <= 0) throw new Error("Base com valor errado");
  if (altura <= 0) throw new Error("Altura com valor errado");

  let resultado = 0;
  resultado = base * altura;

  return resultado.toFixed(2);
}

function calcular(dados) {
  console.log(dados);

  const { altura = 0, largura = 0 } = dados;

  if (altura <= 0) throw new Error("Base com valor errado");
  if (largura <= 0) throw new Error("Altura com valor errado");

  let resultado = 0;
  resultado = largura * altura;

  return resultado.toFixed(2);
}

function calcularMarkup(dados) {
  const { custoProduto, despesas, lucroDesejado } = dados;

  if (
    custoProduto === undefined ||
    despesas === undefined ||
    lucroDesejado === undefined
  ) {
    throw new Error("Informe custoProduto, despesas e lucroDesejado.");
  }

  const custo = Number(custoProduto);
  const percentualDespesas = Number(despesas);
  const percentualLucro = Number(lucroDesejado);

  if (
    custo <= 0 ||
    percentualDespesas < 0 ||
    percentualLucro < 0 ||
    percentualDespesas + percentualLucro >= 100
  ) {
    throw new Error(
      "Valores inválidos. A soma das despesas e do lucro deve ser menor que 100%."
    );
  }

  const markup = 100 / (100 - percentualDespesas - percentualLucro);
  const precoVenda = custo * markup;
  const valorDespesas = precoVenda * (percentualDespesas / 100);
  const valorLucro = precoVenda * (percentualLucro / 100);

  return {
    custoProduto: custo,
    despesas: percentualDespesas,
    lucroDesejado: percentualLucro,
    markup: Number(markup.toFixed(2)),
    precoVenda: Number(precoVenda.toFixed(2)),
    valorDespesas: Number(valorDespesas.toFixed(2)),
    valorLucro: Number(valorLucro.toFixed(2)),
  };
}

module.exports = {
  calcularArea,
  TABELA,
  calcular,
  calcularMarkup,
};
