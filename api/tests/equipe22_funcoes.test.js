const { calcular, calcularKit, calcularInstalacao, encontrarPotencia } = require('../../src/equipe-22/funcoes');

describe('encontrarPotencia', () => {
  test('volume 5m3 retorna 6kW', () => {
    expect(encontrarPotencia(5)).toBe(6);
  });
  test('volume 10m3 retorna 9kW', () => {
    expect(encontrarPotencia(10)).toBe(9);
  });
  test('volume 15m3 retorna 12kW', () => {
    expect(encontrarPotencia(15)).toBe(12);
  });
  test('volume negativo lanca erro', () => {
    expect(() => encontrarPotencia(-1)).toThrow('volumeM3 deve ser maior que zero');
  });
});

describe('calcularKit', () => {
  test('sauna seca 10m3 custo do kit correto', () => {
    const r = calcularKit({ tipo: 'seca', volumeM3: 10 });
    expect(r.potenciaKW).toBe(9);
    expect(r.custoKit).toBe(2700);
  });
  test('sauna vapor 10m3 custo do kit correto', () => {
    const r = calcularKit({ tipo: 'vapor', volumeM3: 10 });
    expect(r.custoKit).toBe(3150);
  });
  test('lanca erro para tipo invalido', () => {
    expect(() => calcularKit({ tipo: 'banheira', volumeM3: 10 })).toThrow('Tipo inválido');
  });
  test('lanca erro quando tipo nao informado', () => {
    expect(() => calcularKit({ volumeM3: 10 })).toThrow('"tipo"');
  });
  test('lanca erro quando volumeM3 nao informado', () => {
    expect(() => calcularKit({ tipo: 'seca' })).toThrow('"volumeM3"');
  });
});

describe('calcularInstalacao', () => {
  test('vapor inclui custo hidraulico de R$2000', () => {
    const r = calcularInstalacao({ tipo: 'vapor', volumeM3: 10 });
    expect(r.instalacao.hidraulica).toBe(2000);
  });
  test('sauna seca nao tem custo hidraulico', () => {
    const r = calcularInstalacao({ tipo: 'seca', volumeM3: 10 });
    expect(r.instalacao.hidraulica).toBe(0);
  });
  test('total de instalacao soma corretamente', () => {
    const r = calcularInstalacao({ tipo: 'seca', volumeM3: 10 });
    expect(r.instalacao.total).toBe(4720);
  });
  test('custo de energia mensal calculado corretamente', () => {
    const r = calcularInstalacao({ tipo: 'seca', volumeM3: 10, horasPorDia: 2, diasPorMes: 30, tarifaKwh: 0.85 });
    expect(r.operacao.custoEnergia).toBeCloseTo(459, 1);
  });
});

describe('calcular', () => {
  test('retorna objeto com kit, instalacao e operacao', () => {
    const r = calcular({ tipo: 'seca', volumeM3: 10 });
    expect(r).toHaveProperty('kit');
    expect(r).toHaveProperty('instalacao');
    expect(r).toHaveProperty('operacao');
  });
  test('simulacao completa sauna vapor 15m3', () => {
    const r = calcular({ tipo: 'vapor', volumeM3: 15, horasPorDia: 1, diasPorMes: 20, tarifaKwh: 0.85 });
    expect(r.potenciaKW).toBe(12);
    expect(r.kit.custoKit).toBe(4200);
    expect(r.instalacao.hidraulica).toBe(2000);
    expect(r.operacao.totalMensal).toBeGreaterThan(0);
  });
  test('lanca erro para tipo invalido', () => {
    expect(() => calcular({ tipo: 'jacuzzi', volumeM3: 10 })).toThrow('Tipo inválido');
  });
  test('lanca erro quando tipo nao informado', () => {
    expect(() => calcular({ volumeM3: 10 })).toThrow('"tipo"');
  });
  test('lanca erro quando volumeM3 nao informado', () => {
    expect(() => calcular({ tipo: 'seca' })).toThrow('"volumeM3"');
  });
});