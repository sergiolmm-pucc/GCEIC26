const { calcularPrecoVenda, calcularMarkupDivisor, calcularMarkup, calcularMargem, calcularPontoEquilibrio } = require('../src/funcoes');

describe('Testes unitarios - calcularPrecoVenda', () => {
  test('deve calcular corretamente com custo 100 e markup 50%', () => {
    expect(calcularPrecoVenda(100, 50).precoVenda).toBe(150);
    expect(calcularPrecoVenda(100, 50).lucro).toBe(50);
  });
  test('deve calcular com markup 0%', () => {
    expect(calcularPrecoVenda(200, 0).precoVenda).toBe(200);
  });
  test('deve calcular com casas decimais', () => {
    expect(calcularPrecoVenda(49.9, 30).precoVenda).toBe(64.87);
  });
  test('deve lancar erro se custo for zero', () => {
    expect(() => calcularPrecoVenda(0, 50)).toThrow();
  });
  test('deve lancar erro se custo for negativo', () => {
    expect(() => calcularPrecoVenda(-10, 50)).toThrow();
  });
  test('deve lancar erro se markup for negativo', () => {
    expect(() => calcularPrecoVenda(100, -10)).toThrow();
  });
});

describe('Testes unitarios - calcularMarkupDivisor', () => {
  test('deve calcular PV corretamente', () => {
    expect(calcularMarkupDivisor(100, 10, 5, 15).precoVenda).toBe(142.86);
  });
  test('deve lancar erro se totalPercentual >= 100', () => {
    expect(() => calcularMarkupDivisor(100, 50, 30, 25)).toThrow();
  });
  test('deve lancar erro se custo for zero', () => {
    expect(() => calcularMarkupDivisor(0, 10, 5, 15)).toThrow();
  });
});

describe('Testes unitarios - calcularMarkup', () => {
  test('deve calcular markup 50% e margem 33.33%', () => {
    expect(calcularMarkup(100, 150).markupPerc).toBe(50);
    expect(calcularMarkup(100, 150).margemPerc).toBeCloseTo(33.33, 1);
  });
  test('deve lancar erro se precoVenda <= custo', () => {
    expect(() => calcularMarkup(100, 80)).toThrow();
  });
});

describe('Testes unitarios - calcularMargem', () => {
  test('deve calcular margem de 33.33%', () => {
    expect(calcularMargem(100, 150).margemPerc).toBeCloseTo(33.33, 1);
  });
  test('deve lancar erro se custo maior que PV', () => {
    expect(() => calcularMargem(200, 100)).toThrow();
  });
});

describe('Testes unitarios - calcularPontoEquilibrio', () => {
  test('deve calcular 250 unidades de PE', () => {
    expect(calcularPontoEquilibrio(5000, 50, 30).unidades).toBe(250);
    expect(calcularPontoEquilibrio(5000, 50, 30).receitaEquilibrio).toBe(12500);
  });
  test('deve arredondar unidades para cima', () => {
    expect(calcularPontoEquilibrio(5001, 50, 30).unidades).toBe(251);
  });
  test('deve lancar erro se PV <= custo variavel', () => {
    expect(() => calcularPontoEquilibrio(5000, 30, 30)).toThrow();
  });
  test('deve lancar erro se custos fixos negativos', () => {
    expect(() => calcularPontoEquilibrio(-1000, 50, 30)).toThrow();
  });
});
