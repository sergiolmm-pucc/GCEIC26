const { calcularParcela, calcularCapacidade } = require('../src/funcoes');

describe('Teste unitário - calcularParcela', () => {

  test('deve calcular parcela corretamente', () => {
    const resultado = calcularParcela(30000, 6000, 1.29, 48);
    expect(resultado.parcela).toBe(673.79);
  });

  test('deve lançar erro se valor do veículo for inválido', () => {
    expect(() => calcularParcela(0, 0, 1, 12)).toThrow();
  });

  test('deve lançar erro se entrada for maior que valor do veículo', () => {
    expect(() => calcularParcela(10000, 10000, 1, 12)).toThrow();
  });

  test('deve lançar erro se taxa for negativa', () => {
    expect(() => calcularParcela(10000, 0, -1, 12)).toThrow();
  });

  test('deve lançar erro se parcelas for inválido', () => {
    expect(() => calcularParcela(10000, 0, 1, 0)).toThrow();
  });

});

describe('Teste unitário - calcularCapacidade', () => {

  test('deve calcular capacidade corretamente', () => {
    const resultado = calcularCapacidade(5000, 1, 48, 20);
    expect(resultado.parcelaMaxima).toBe(1500);
  });

  test('deve lançar erro se renda for inválida', () => {
    expect(() => calcularCapacidade(0, 1, 48, 20)).toThrow();
  });

  test('deve lançar erro se entrada for 100%', () => {
    expect(() => calcularCapacidade(5000, 1, 48, 100)).toThrow();
  });

});