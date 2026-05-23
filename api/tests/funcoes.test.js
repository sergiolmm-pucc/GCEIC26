const {
  calcularConsumoDiario,
  litrosParaM3,
  calcularConsumoMensal,
  calcularConta,
  calcular,
} = require('../src/funcoes');

describe('calcularConsumoDiario', () => {
  test('deve calcular corretamente com consumo padrão (150 L/dia)', () => {
    expect(calcularConsumoDiario(4)).toBe(600.00);
  });

  test('deve calcular corretamente com consumo customizado', () => {
    expect(calcularConsumoDiario(2, 200)).toBe(400.00);
  });

  test('deve lançar erro para 0 pessoas', () => {
    expect(() => calcularConsumoDiario(0)).toThrow('Número de pessoas deve ser maior que zero');
  });

  test('deve lançar erro para pessoas negativo', () => {
    expect(() => calcularConsumoDiario(-1)).toThrow();
  });

  test('deve lançar erro para litros por pessoa zero', () => {
    expect(() => calcularConsumoDiario(2, 0)).toThrow();
  });
});

describe('litrosParaM3', () => {
  test('deve converter 1000 litros para 1 m³', () => {
    expect(litrosParaM3(1000)).toBe(1.0);
  });

  test('deve converter 150 litros corretamente', () => {
    expect(litrosParaM3(150)).toBe(0.15);
  });

  test('deve lançar erro para valor negativo', () => {
    expect(() => litrosParaM3(-1)).toThrow('Litros não pode ser negativo');
  });
});

describe('calcularConsumoMensal', () => {
  test('deve retornar objeto com litrosDia, litrosMes e m3Mes', () => {
    const resultado = calcularConsumoMensal(4);
    expect(resultado).toHaveProperty('litrosDia');
    expect(resultado).toHaveProperty('litrosMes');
    expect(resultado).toHaveProperty('m3Mes');
  });

  test('deve calcular corretamente para 4 pessoas, 30 dias', () => {
    const r = calcularConsumoMensal(4, 150, 30);
    expect(r.litrosDia).toBe(600.00);
    expect(r.litrosMes).toBe(18000.00);
    expect(r.m3Mes).toBe(18.0);
  });

  test('deve lançar erro para dias inválidos', () => {
    expect(() => calcularConsumoMensal(4, 150, 0)).toThrow('Número de dias inválido');
    expect(() => calcularConsumoMensal(4, 150, 32)).toThrow('Número de dias inválido');
  });
});

describe('calcularConta', () => {
  test('deve retornar objeto completo com valorTotal', () => {
    const r = calcularConta(18);
    expect(r).toHaveProperty('consumoM3');
    expect(r).toHaveProperty('tarifaM3');
    expect(r).toHaveProperty('valorBase');
    expect(r).toHaveProperty('margemSeguranca');
    expect(r).toHaveProperty('valorTotal');
  });

  test('deve lançar erro para consumo negativo', () => {
    expect(() => calcularConta(-1)).toThrow('Consumo não pode ser negativo');
  });

  test('deve usar faixa correta para até 10m³', () => {
    const r = calcularConta(5);
    expect(r.tarifaM3).toBe(4.50);
  });

  test('deve usar faixa correta para acima de 50m³', () => {
    const r = calcularConta(60);
    expect(r.tarifaM3).toBe(25.70);
  });
});

describe('calcular (função principal)', () => {
  test('deve retornar resultado completo para 4 pessoas', () => {
    const r = calcular({ pessoas: 4, dias: 30 });
    expect(r).toHaveProperty('pessoas', 4);
    expect(r).toHaveProperty('litrosDia');
    expect(r).toHaveProperty('m3Mes');
    expect(r).toHaveProperty('valorTotal');
  });

  test('deve lançar erro para 0 pessoas', () => {
    expect(() => calcular({ pessoas: 0 })).toThrow();
  });
});