const {
  calcularConsumoDiario,
  calcularCustoMensal,
  calcularEconomia,
  calcular,
} = require('../src/funcoes');

// -------------------------------------------------------
// API 1 — ANA: calcularConsumoDiario
// -------------------------------------------------------
describe('calcularConsumoDiario (API 1 - Ana)', () => {
  test('deve calcular consumo para 1 pessoa com valores padrão', () => {
    const r = calcularConsumoDiario(10, 3, 1);
    expect(r.consumoDiarioLitros).toBe(70.5);
  });

  test('deve multiplicar pelo número de pessoas', () => {
    const r = calcularConsumoDiario(10, 3, 4);
    expect(r.consumoDiarioLitros).toBe(282.0);
    expect(r.pessoas).toBe(4);
  });

  test('deve lançar erro para tempo de banho negativo', () => {
    expect(() => calcularConsumoDiario(-1, 3, 1)).toThrow();
  });

  test('deve lançar erro para descargas negativas', () => {
    expect(() => calcularConsumoDiario(10, -1, 1)).toThrow();
  });

  test('deve lançar erro para 0 pessoas', () => {
    expect(() => calcularConsumoDiario(10, 3, 0)).toThrow('Número de pessoas deve ser maior que zero');
  });
});

// -------------------------------------------------------
// API 2 — HUGO: calcularCustoMensal
// -------------------------------------------------------
describe('calcularCustoMensal (API 2 - Hugo)', () => {
  test('deve retornar objeto com consumoMensalLitros, consumoMensalM3 e custoEstimado', () => {
    const r = calcularCustoMensal(282, 0.005, 30);
    expect(r).toHaveProperty('consumoMensalLitros');
    expect(r).toHaveProperty('consumoMensalM3');
    expect(r).toHaveProperty('custoEstimado');
  });

  test('deve calcular 30 dias corretamente', () => {
    const r = calcularCustoMensal(100, 0.005, 30);
    expect(r.consumoMensalLitros).toBe(3000);
    expect(r.custoEstimado).toBe(15.00);
  });

  test('deve lançar erro para consumo negativo', () => {
    expect(() => calcularCustoMensal(-1, 0.005, 30)).toThrow();
  });

  test('deve lançar erro para tarifa zero', () => {
    expect(() => calcularCustoMensal(100, 0, 30)).toThrow();
  });

  test('deve lançar erro para dias inválidos', () => {
    expect(() => calcularCustoMensal(100, 0.005, 0)).toThrow('Número de dias inválido');
  });
});

// -------------------------------------------------------
// API 3 — LETICIA: calcularEconomia
// -------------------------------------------------------
describe('calcularEconomia (API 3 - Leticia)', () => {
  test('deve retornar objeto completo com todos os campos', () => {
    const r = calcularEconomia(3000, 20, 0.005, 4);
    expect(r).toHaveProperty('economiaLitros');
    expect(r).toHaveProperty('novoConsumoLitros');
    expect(r).toHaveProperty('novoCusto');
    expect(r).toHaveProperty('economiaReais');
    expect(r).toHaveProperty('reducaoBanhoMinutos');
    expect(r).toHaveProperty('reducaoDescargas');
  });

  test('deve calcular 20% de economia corretamente', () => {
    const r = calcularEconomia(3000, 20, 0.005, 4);
    expect(r.economiaLitros).toBe(600);
    expect(r.novoConsumoLitros).toBe(2400);
  });

  test('deve calcular sugestao por pessoa corretamente', () => {
    // 600L economia / 30 dias / 4 pessoas = 5L/pessoa/dia
    // 5 / 4.5 = 1.11 min banho por pessoa
    const r = calcularEconomia(3000, 20, 0.005, 4);
    expect(r.reducaoBanhoMinutos).toBe(1.11);
  });

  test('deve lançar erro para consumo zero', () => {
    expect(() => calcularEconomia(0, 20, 0.005, 4)).toThrow();
  });

  test('deve lançar erro para redução 0%', () => {
    expect(() => calcularEconomia(3000, 0, 0.005, 4)).toThrow();
  });

  test('deve lançar erro para redução 100%', () => {
    expect(() => calcularEconomia(3000, 100, 0.005, 4)).toThrow();
  });

  test('deve lançar erro para tarifa zero', () => {
    expect(() => calcularEconomia(3000, 20, 0, 4)).toThrow();
  });

  test('deve lançar erro para pessoas zero', () => {
    expect(() => calcularEconomia(3000, 20, 0.005, 0)).toThrow('Número de pessoas deve ser maior que zero');
  });
});

// -------------------------------------------------------
// Função calcular (integração das 3 APIs)
// -------------------------------------------------------
describe('calcular (integracao das 3 APIs)', () => {
  test('deve retornar resultado completo para 4 pessoas', () => {
    const r = calcular({ pessoas: 4, tempoBanhoMin: 10, descargasDia: 3, tarifa: 0.005, dias: 30 });
    expect(r).toHaveProperty('consumoDiarioLitros');
    expect(r).toHaveProperty('custoEstimado');
    expect(r).toHaveProperty('economia');
  });
});