const financeFuncs = require('../../src/equipe-10/calcFinanceiraFunc');

describe('FinanceService - Lógica Matemática', () => {
  
  test('Juros Simples: deve calcular corretamente', () => {
    const res = financeFuncs.calcularJurosSimples({ capital: 1000, taxa: 10, tempo: 1 });
    expect(res.montante).toBe(1100);
    expect(res.juros).toBe(100);
  });

  test('Juros Simples: deve lançar erro com capital zero', () => {
    expect(() => financeFuncs.calcularJurosSimples({ capital: 0, taxa: 10, tempo: 1 }))
      .toThrow('Capital deve ser maior que zero');
  });

  test('Juros Compostos: deve calcular corretamente', () => {
    // 1000 * (1 + 0.1)^2 = 1210
    const res = financeFuncs.calcularJurosCompostos({ capital: 1000, taxa: 10, tempo: 2 });
    expect(res.montante).toBe(1210);
    expect(res.juros).toBe(210);
  });

  test('Investimento: deve calcular aporte', () => {
    const res = financeFuncs.simularInvestimento({ aporteMensal: 100, taxa: 1, tempoMeses: 1 });
    // (0 + 100) * 1.01 = 101
    expect(res.montante).toBe(101);
  });
});