const { calcular, calcularKit, calcularInstalacao, encontrarPotencia } = require('../src/funcoes');

// ────────────────────────────────────────────────
// encontrarPotencia
// ────────────────────────────────────────────────
describe('encontrarPotencia', () => {
  test('volume 5m³ retorna 6kW', () => {
    expect(encontrarPotencia(5)).toBe(6);
  });

  test('volume 10m³ retorna 9kW', () => {
    expect(encontrarPotencia(10)).toBe(9);
  });

  test('volume 15m³ retorna 12kW', () => {
    expect(encontrarPotencia(15)).toBe(12);
  });

  test('volume negativo lança erro', () => {
    expect(() => encontrarPotencia(-1)).toThrow('volumeM3 deve ser maior que zero');
  });
});

// ────────────────────────────────────────────────
// calcularKit (Pessoa 2)
// ────────────────────────────────────────────────
describe('calcularKit', () => {
  test('sauna seca 10m³ — custo do kit correto', () => {
    const r = calcularKit({ tipo: 'seca', volumeM3: 10 });
    expect(r.potenciaKW).toBe(9);
    expect(r.custoKit).toBe(2700); // 9kW * R$300
  });

  test('sauna vapor 10m³ — custo do kit correto', () => {
    const r = calcularKit({ tipo: 'vapor', volumeM3: 10 });
    expect(r.custoKit).toBe(3150); // 9kW * R$350
  });

  test('sauna infravermelha 10m³ — custo do kit correto', () => {
    const r = calcularKit({ tipo: 'infravermelha', volumeM3: 10 });
    expect(r.custoKit).toBe(2250); // 9kW * R$250
  });

  test('lança erro para tipo inválido', () => {
    expect(() => calcularKit({ tipo: 'banheira', volumeM3: 10 }))
      .toThrow('Tipo inválido');
  });

  test('lança erro quando tipo não informado', () => {
    expect(() => calcularKit({ volumeM3: 10 }))
      .toThrow('"tipo" é obrigatório');
  });

  test('lança erro quando volumeM3 não informado', () => {
    expect(() => calcularKit({ tipo: 'seca' }))
      .toThrow('"volumeM3" é obrigatório');
  });
});

// ────────────────────────────────────────────────
// calcularInstalacao (Pessoa 3)
// ────────────────────────────────────────────────
describe('calcularInstalacao', () => {
  test('vapor inclui custo hidráulico de R$2000', () => {
    const r = calcularInstalacao({ tipo: 'vapor', volumeM3: 10 });
    expect(r.instalacao.hidraulica).toBe(2000);
  });

  test('sauna seca não tem custo hidráulico', () => {
    const r = calcularInstalacao({ tipo: 'seca', volumeM3: 10 });
    expect(r.instalacao.hidraulica).toBe(0);
  });

  test('total de instalação soma corretamente', () => {
    const r = calcularInstalacao({ tipo: 'seca', volumeM3: 10 });
    // eletrica: 9*80=720 + hidraulica: 0 + maoDeObra: 4000 = 4720
    expect(r.instalacao.total).toBe(4720);
  });

  test('custo de energia mensal calculado corretamente', () => {
    const r = calcularInstalacao({
      tipo: 'seca', volumeM3: 10,
      horasPorDia: 2, diasPorMes: 30, tarifaKwh: 0.85,
    });
    // 9kW * 2h * 30d * 0.85 = 459
    expect(r.operacao.custoEnergia).toBeCloseTo(459, 1);
  });

  test('usa tarifa padrão quando não informada', () => {
    const r = calcularInstalacao({ tipo: 'seca', volumeM3: 10 });
    expect(r.operacao.custoEnergia).toBeGreaterThan(0);
  });
});

// ────────────────────────────────────────────────
// calcular — função principal (Pessoa 1)
// ────────────────────────────────────────────────
describe('calcular', () => {
  test('retorna objeto com kit, instalacao e operacao', () => {
    const r = calcular({ tipo: 'seca', volumeM3: 10 });
    expect(r).toHaveProperty('kit');
    expect(r).toHaveProperty('instalacao');
    expect(r).toHaveProperty('operacao');
  });

  test('simulação completa sauna vapor 15m³', () => {
    const r = calcular({
      tipo: 'vapor', volumeM3: 15,
      horasPorDia: 1, diasPorMes: 20, tarifaKwh: 0.85,
    });
    expect(r.potenciaKW).toBe(12);
    expect(r.kit.custoKit).toBe(4200);       // 12 * 350
    expect(r.instalacao.hidraulica).toBe(2000);
    expect(r.operacao.totalMensal).toBeGreaterThan(0);
  });

  test('lança erro para tipo inválido', () => {
    expect(() => calcular({ tipo: 'jacuzzi', volumeM3: 10 }))
      .toThrow('Tipo inválido');
  });

  test('lança erro quando tipo não informado', () => {
    expect(() => calcular({ volumeM3: 10 }))
      .toThrow('"tipo" é obrigatório');
  });

  test('lança erro quando volumeM3 não informado', () => {
    expect(() => calcular({ tipo: 'seca' }))
      .toThrow('"volumeM3" é obrigatório');
  });
});