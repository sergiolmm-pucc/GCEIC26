// =============================================
// CÁLCULO 1: Preço de Venda (MarkUp)
// Fórmula: Preço = Custo / (1 - (Despesas% + Lucro%) / 100)
// =============================================
const calcularMarkup = (req, res) => {
  const { custo, despesas, lucro } = req.body;

  if (custo === undefined || despesas === undefined || lucro === undefined) {
    return res.status(400).json({ erro: 'Informe custo, despesas (%) e lucro (%).' });
  }

  if (custo <= 0) {
    return res.status(400).json({ erro: 'O custo deve ser maior que zero.' });
  }

  const totalPercentual = despesas + lucro;

  if (totalPercentual >= 100) {
    return res.status(400).json({ erro: 'A soma de despesas e lucro não pode ser 100% ou mais.' });
  }

  const precoVenda = custo / (1 - totalPercentual / 100);
  const markupDivisor = 1 - totalPercentual / 100;
  const markupMultiplicador = 1 / markupDivisor;

  return res.json({
    custo: parseFloat(custo.toFixed(2)),
    despesas_percentual: despesas,
    lucro_percentual: lucro,
    markup_multiplicador: parseFloat(markupMultiplicador.toFixed(4)),
    preco_venda: parseFloat(precoVenda.toFixed(2)),
    lucro_valor: parseFloat((precoVenda - custo).toFixed(2))
  });
};

// =============================================
// CÁLCULO 2: Lucro Real de uma venda
// Dado o preço de venda e o custo, calcula o lucro e a margem
// =============================================
const calcularLucro = (req, res) => {
  const { precoVenda, custo, despesas } = req.body;

  if (precoVenda === undefined || custo === undefined || despesas === undefined) {
    return res.status(400).json({ erro: 'Informe precoVenda, custo e despesas (%).' });
  }

  if (precoVenda <= 0 || custo <= 0) {
    return res.status(400).json({ erro: 'Preço de venda e custo devem ser maiores que zero.' });
  }

  if (precoVenda <= custo) {
    return res.status(400).json({ erro: 'Preço de venda deve ser maior que o custo.' });
  }

  const valorDespesas = (despesas / 100) * precoVenda;
  const lucroValor = precoVenda - custo - valorDespesas;
  const margemLucro = (lucroValor / precoVenda) * 100;

  return res.json({
    preco_venda: parseFloat(precoVenda.toFixed(2)),
    custo: parseFloat(custo.toFixed(2)),
    despesas_percentual: despesas,
    despesas_valor: parseFloat(valorDespesas.toFixed(2)),
    lucro_valor: parseFloat(lucroValor.toFixed(2)),
    margem_lucro_percentual: parseFloat(margemLucro.toFixed(2))
  });
};

// =============================================
// CÁLCULO 3: Ponto de Equilíbrio
// Quantas unidades vender para cobrir os custos fixos
// =============================================
const calcularPontoEquilibrio = (req, res) => {
  const { custoFixo, precoVenda, custoPorUnidade } = req.body;

  if (custoFixo === undefined || precoVenda === undefined || custoPorUnidade === undefined) {
    return res.status(400).json({ erro: 'Informe custoFixo, precoVenda e custoPorUnidade.' });
  }

  if (precoVenda <= custoPorUnidade) {
    return res.status(400).json({ erro: 'Preço de venda deve ser maior que o custo por unidade.' });
  }

  const margemContribuicao = precoVenda - custoPorUnidade;
  const pontoEquilibrio = custoFixo / margemContribuicao;
  const faturamentoEquilibrio = pontoEquilibrio * precoVenda;

  return res.json({
    custo_fixo: parseFloat(custoFixo.toFixed(2)),
    preco_venda: parseFloat(precoVenda.toFixed(2)),
    custo_por_unidade: parseFloat(custoPorUnidade.toFixed(2)),
    margem_contribuicao: parseFloat(margemContribuicao.toFixed(2)),
    ponto_equilibrio_unidades: Math.ceil(pontoEquilibrio),
    faturamento_equilibrio: parseFloat(faturamentoEquilibrio.toFixed(2))
  });
};

module.exports = { calcularMarkup, calcularLucro, calcularPontoEquilibrio };