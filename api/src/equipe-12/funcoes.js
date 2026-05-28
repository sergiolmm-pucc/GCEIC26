const TABELA = {
  TIPOS_CALCULO: [
    { tipo: 'precoVenda', descricao: 'Preco de Venda (Aditivo)', campos: ['custo', 'markupPerc'] },
    { tipo: 'markupDivisor', descricao: 'MarkUp Divisor', campos: ['custo', 'impostos', 'despesas', 'margemLucro'] },
    { tipo: 'markup', descricao: 'Calcular MarkUp %', campos: ['custo', 'precoVenda'] },
    { tipo: 'margem', descricao: 'Margem de Lucro %', campos: ['custo', 'precoVenda'] },
    {
      tipo: 'pontoEquilibrio',
      descricao: 'Ponto de Equilibrio',
      campos: ['custosFixos', 'precoVenda', 'custoVariavelUnitario'],
    },
  ],
  EXEMPLOS: {
    precoVenda: { custo: 100, markupPerc: 50 },
    markupDivisor: { custo: 100, impostos: 10, despesas: 5, margemLucro: 15 },
    markup: { custo: 100, precoVenda: 150 },
    margem: { custo: 100, precoVenda: 150 },
    pontoEquilibrio: { custosFixos: 5000, precoVenda: 50, custoVariavelUnitario: 30 },
  },
};

function calcularPrecoVenda(custo, markupPerc) {
  if (custo <= 0) throw new Error('Custo deve ser maior que zero.');
  if (markupPerc < 0) throw new Error('MarkUp nao pode ser negativo.');

  const precoVenda = custo * (1 + markupPerc / 100);
  const lucro = precoVenda - custo;

  return {
    custo: arred(custo),
    markupPerc: arred(markupPerc),
    precoVenda: arred(precoVenda),
    lucro: arred(lucro),
  };
}

function calcularMarkupDivisor(custo, impostos, despesas, margemLucro) {
  if (custo <= 0) throw new Error('Custo deve ser maior que zero.');

  const totalPercentual = impostos + despesas + margemLucro;
  if (totalPercentual >= 100) {
    throw new Error('Soma de impostos, despesas e margem nao pode ser >= 100%.');
  }

  const markupDivisor = 1 - totalPercentual / 100;
  const markupMultiplicador = 1 / markupDivisor;
  const precoVenda = custo / markupDivisor;
  const lucro = precoVenda * (margemLucro / 100);

  return {
    custo: arred(custo),
    impostos: arred(impostos),
    despesas: arred(despesas),
    margemLucro: arred(margemLucro),
    totalPercentual: arred(totalPercentual),
    markupDivisor: arred4(markupDivisor),
    markupMultiplicador: arred4(markupMultiplicador),
    precoVenda: arred(precoVenda),
    lucro: arred(lucro),
  };
}

function calcularMarkup(custo, precoVenda) {
  if (custo <= 0) throw new Error('Custo deve ser maior que zero.');
  if (precoVenda <= custo) throw new Error('Preco de venda deve ser maior que o custo.');

  const lucro = precoVenda - custo;
  const markupPerc = (lucro / custo) * 100;
  const margemPerc = (lucro / precoVenda) * 100;

  return {
    custo: arred(custo),
    precoVenda: arred(precoVenda),
    lucro: arred(lucro),
    markupPerc: arred(markupPerc),
    margemPerc: arred(margemPerc),
  };
}

function calcularMargem(custo, precoVenda) {
  if (custo <= 0) throw new Error('Custo deve ser maior que zero.');
  if (precoVenda <= 0) throw new Error('Preco de venda deve ser maior que zero.');
  if (precoVenda <= custo) throw new Error('Preco de venda deve ser maior que o custo.');

  const lucro = precoVenda - custo;
  const margemPerc = (lucro / precoVenda) * 100;
  const markupPerc = (lucro / custo) * 100;

  return {
    custo: arred(custo),
    precoVenda: arred(precoVenda),
    lucro: arred(lucro),
    margemPerc: arred(margemPerc),
    markupPerc: arred(markupPerc),
  };
}

function calcularPontoEquilibrio(custosFixos, precoVenda, custoVariavelUnitario) {
  if (custosFixos < 0) throw new Error('Custos fixos nao podem ser negativos.');
  if (precoVenda <= 0) throw new Error('Preco de venda deve ser maior que zero.');
  if (custoVariavelUnitario < 0) throw new Error('Custo variavel nao pode ser negativo.');
  if (precoVenda <= custoVariavelUnitario) {
    throw new Error('Preco de venda deve ser maior que o custo variavel unitario.');
  }

  const margemContribuicao = precoVenda - custoVariavelUnitario;
  const margemContribuicaoPerc = (margemContribuicao / precoVenda) * 100;
  const unidades = custosFixos / margemContribuicao;
  const receitaEquilibrio = custosFixos / (margemContribuicaoPerc / 100);

  return {
    custosFixos: arred(custosFixos),
    precoVenda: arred(precoVenda),
    custoVariavelUnitario: arred(custoVariavelUnitario),
    margemContribuicao: arred(margemContribuicao),
    margemContribuicaoPerc: arred(margemContribuicaoPerc),
    unidades: Math.ceil(unidades),
    unidadesExato: arred4(unidades),
    receitaEquilibrio: arred(receitaEquilibrio),
  };
}

function calcular(dados) {
  const { tipo } = dados;
  if (!tipo) {
    throw new Error('Campo "tipo" obrigatorio. Ex: precoVenda, markup, margem, markupDivisor, pontoEquilibrio');
  }

  switch (tipo) {
    case 'precoVenda':
      return calcularPrecoVenda(Number(dados.custo), Number(dados.markupPerc));
    case 'markupDivisor':
      return calcularMarkupDivisor(
        Number(dados.custo),
        Number(dados.impostos),
        Number(dados.despesas),
        Number(dados.margemLucro),
      );
    case 'markup':
      return calcularMarkup(Number(dados.custo), Number(dados.precoVenda));
    case 'margem':
      return calcularMargem(Number(dados.custo), Number(dados.precoVenda));
    case 'pontoEquilibrio':
      return calcularPontoEquilibrio(
        Number(dados.custosFixos),
        Number(dados.precoVenda),
        Number(dados.custoVariavelUnitario),
      );
    default:
      throw new Error(`Tipo de calculo desconhecido: "${tipo}"`);
  }
}

function arred(valor) {
  return Math.round(valor * 100) / 100;
}

function arred4(valor) {
  return Math.round(valor * 10000) / 10000;
}

module.exports = {
  TABELA,
  calcular,
  calcularPrecoVenda,
  calcularMarkupDivisor,
  calcularMarkup,
  calcularMargem,
  calcularPontoEquilibrio,
};
