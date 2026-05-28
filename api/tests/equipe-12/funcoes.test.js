const {
  calcular,
  calcularPrecoVenda,
  calcularMarkupDivisor,
  calcularMarkup,
  calcularMargem,
  calcularPontoEquilibrio,
} = require('../../src/equipe-12/funcoes');

describe('Equipe 12 - funcoes de MarkUp', () => {
  test('calcula preco de venda pelo MarkUp aditivo', () => {
    expect(calcularPrecoVenda(100, 50)).toEqual({
      custo: 100,
      markupPerc: 50,
      precoVenda: 150,
      lucro: 50,
    });
  });

  test('calcula MarkUp divisor e preco de venda', () => {
    const resultado = calcularMarkupDivisor(100, 0, 0, 30);

    expect(resultado.markupDivisor).toBe(0.7);
    expect(resultado.markupMultiplicador).toBe(1.4286);
    expect(resultado.precoVenda).toBe(142.86);
    expect(resultado.lucro).toBe(42.86);
  });

  test('calcula percentual de MarkUp a partir do preco de venda', () => {
    const resultado = calcularMarkup(100, 150);

    expect(resultado.markupPerc).toBe(50);
    expect(resultado.margemPerc).toBe(33.33);
  });

  test('calcula margem de lucro', () => {
    const resultado = calcularMargem(100, 150);

    expect(resultado.margemPerc).toBe(33.33);
    expect(resultado.markupPerc).toBe(50);
  });

  test('calcula ponto de equilibrio', () => {
    const resultado = calcularPontoEquilibrio(5000, 50, 30);

    expect(resultado.unidades).toBe(250);
    expect(resultado.receitaEquilibrio).toBe(12500);
  });

  test('usa dispatcher calcular para markupDivisor', () => {
    const resultado = calcular({
      tipo: 'markupDivisor',
      custo: 100,
      impostos: 0,
      despesas: 0,
      margemLucro: 30,
    });

    expect(resultado.precoVenda).toBe(142.86);
  });

  test('usa dispatcher calcular para precoVenda', () => {
    const resultado = calcular({
      tipo: 'precoVenda',
      custo: 100,
      markupPerc: 50,
    });

    expect(resultado.precoVenda).toBe(150);
    expect(resultado.lucro).toBe(50);
  });

  test('usa dispatcher calcular para markup', () => {
    const resultado = calcular({
      tipo: 'markup',
      custo: 100,
      precoVenda: 150,
    });

    expect(resultado.markupPerc).toBe(50);
    expect(resultado.margemPerc).toBe(33.33);
  });

  test('usa dispatcher calcular para margem', () => {
    const resultado = calcular({
      tipo: 'margem',
      custo: 100,
      precoVenda: 150,
    });

    expect(resultado.margemPerc).toBe(33.33);
    expect(resultado.markupPerc).toBe(50);
  });

  test('usa dispatcher calcular para pontoEquilibrio', () => {
    const resultado = calcular({
      tipo: 'pontoEquilibrio',
      custosFixos: 5000,
      precoVenda: 50,
      custoVariavelUnitario: 30,
    });

    expect(resultado.unidades).toBe(250);
    expect(resultado.receitaEquilibrio).toBe(12500);
  });

  test('rejeita custo invalido no preco de venda', () => {
    expect(() => calcularPrecoVenda(0, 50)).toThrow('Custo deve ser maior que zero');
  });

  test('rejeita markup negativo no preco de venda', () => {
    expect(() => calcularPrecoVenda(100, -1)).toThrow('MarkUp nao pode ser negativo');
  });

  test('rejeita custo invalido no MarkUp divisor', () => {
    expect(() => calcularMarkupDivisor(0, 0, 0, 30)).toThrow('Custo deve ser maior que zero');
  });

  test('rejeita soma percentual maior ou igual a 100', () => {
    expect(() => calcularMarkupDivisor(100, 40, 30, 30)).toThrow('>= 100%');
  });

  test('rejeita custo invalido no calculo de MarkUp', () => {
    expect(() => calcularMarkup(0, 150)).toThrow('Custo deve ser maior que zero');
  });

  test('rejeita preco menor ou igual ao custo no calculo de MarkUp', () => {
    expect(() => calcularMarkup(100, 100)).toThrow('Preco de venda deve ser maior que o custo');
  });

  test('rejeita custo invalido no calculo de margem', () => {
    expect(() => calcularMargem(0, 150)).toThrow('Custo deve ser maior que zero');
  });

  test('rejeita preco invalido no calculo de margem', () => {
    expect(() => calcularMargem(100, 0)).toThrow('Preco de venda deve ser maior que zero');
  });

  test('rejeita preco menor ou igual ao custo no calculo de margem', () => {
    expect(() => calcularMargem(100, 100)).toThrow('Preco de venda deve ser maior que o custo');
  });

  test('rejeita custos fixos negativos no ponto de equilibrio', () => {
    expect(() => calcularPontoEquilibrio(-1, 50, 30)).toThrow('Custos fixos nao podem ser negativos');
  });

  test('rejeita preco invalido no ponto de equilibrio', () => {
    expect(() => calcularPontoEquilibrio(5000, 0, 30)).toThrow('Preco de venda deve ser maior que zero');
  });

  test('rejeita custo variavel negativo no ponto de equilibrio', () => {
    expect(() => calcularPontoEquilibrio(5000, 50, -1)).toThrow('Custo variavel nao pode ser negativo');
  });

  test('rejeita preco menor ou igual ao custo variavel no ponto de equilibrio', () => {
    expect(() => calcularPontoEquilibrio(5000, 30, 30)).toThrow('custo variavel unitario');
  });

  test('rejeita dispatcher sem tipo', () => {
    expect(() => calcular({})).toThrow('Campo "tipo" obrigatorio');
  });

  test('rejeita tipo de calculo desconhecido', () => {
    expect(() => calcular({ tipo: 'nao-existe' })).toThrow('Tipo de calculo desconhecido');
  });
});
