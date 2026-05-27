const CASAS_DECIMAIS = 2;

function calcularPrecoLiquido({
  precoBruto,
  quantidade = 1,
  icmsPercentual = 0,
  pisPercentual = 0,
  cofinsPercentual = 0,
  ipiPercentual = 0
}) {
  const totalBruto = precoBruto * quantidade;
  const cargaTributaria = calcularCargaTributaria({
    icmsPercentual,
    pisPercentual,
    cofinsPercentual
  });

  validarCargaTributaria(cargaTributaria);

  const totalLiquido = totalBruto * (1 - cargaTributaria);
  const valorIpi = percentual(totalBruto, ipiPercentual);
  const totalBrutoComIpi = totalBruto + valorIpi;

  return arredondarResultado({
    precoBruto,
    quantidade,
    totalBruto,
    icmsPercentual,
    pisPercentual,
    cofinsPercentual,
    ipiPercentual,
    cargaTributaria,
    totalLiquido,
    precoLiquido: totalLiquido / quantidade,
    valorIpi,
    totalBrutoComIpi,
    precoBrutoComIpi: totalBrutoComIpi / quantidade
  });
}

function calcularPrecoBrutoNecessario({
  precoLiquido,
  quantidade = 1,
  icmsPercentual = 0,
  pisPercentual = 0,
  cofinsPercentual = 0,
  ipiPercentual = 0
}) {
  const cargaTributaria = calcularCargaTributaria({
    icmsPercentual,
    pisPercentual,
    cofinsPercentual
  });

  validarCargaTributaria(cargaTributaria);

  const totalLiquido = precoLiquido * quantidade;
  const totalBruto = totalLiquido / (1 - cargaTributaria);
  const valorIpi = percentual(totalBruto, ipiPercentual);
  const totalBrutoComIpi = totalBruto + valorIpi;

  return arredondarResultado({
    precoLiquido,
    quantidade,
    icmsPercentual,
    pisPercentual,
    cofinsPercentual,
    ipiPercentual,
    cargaTributaria,
    totalLiquido,
    totalBruto,
    precoBruto: totalBruto / quantidade,
    valorIpi,
    totalBrutoComIpi,
    precoBrutoComIpi: totalBrutoComIpi / quantidade
  });
}

function calcularLucroMargem({
  precoVenda,
  custoUnitario,
  quantidade = 1,
  icmsPercentual = 0,
  pisPercentual = 0,
  cofinsPercentual = 0,
  ipiPercentual = 0
}) {
  const venda = calcularPrecoLiquido({
    precoBruto: precoVenda,
    quantidade,
    icmsPercentual,
    pisPercentual,
    cofinsPercentual,
    ipiPercentual
  });
  const custoTotal = custoUnitario * quantidade;
  const lucro = venda.totalLiquido - custoTotal;
  const margemPercentual = venda.totalLiquido === 0 ? 0 : (lucro / venda.totalLiquido) * 100;
  const markupPercentual = custoTotal === 0 ? 0 : (lucro / custoTotal) * 100;

  return arredondarResultado({
    ...venda,
    custoUnitario,
    custoTotal,
    lucro,
    margemPercentual,
    markupPercentual
  });
}

function percentual(valor, taxa) {
  return valor * taxa;
}

function calcularCargaTributaria({ icmsPercentual, pisPercentual, cofinsPercentual }) {
  return icmsPercentual + pisPercentual * (1 - icmsPercentual) + cofinsPercentual * (1 - icmsPercentual);
}

function validarCargaTributaria(cargaTributaria) {
  if (cargaTributaria >= 1) {
    const error = new Error('A carga tributaria informada inviabiliza o calculo.');
    error.statusCode = 400;
    throw error;
  }
}

function arredondarResultado(resultado) {
  return Object.fromEntries(
    Object.entries(resultado).map(([chave, valor]) => [
      chave,
      typeof valor === 'number' ? Number(valor.toFixed(CASAS_DECIMAIS)) : valor
    ])
  );
}

module.exports = {
  calcularLucroMargem,
  calcularPrecoBrutoNecessario,
  calcularPrecoLiquido
};
