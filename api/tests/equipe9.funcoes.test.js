const { calcularNF, calcularNFInverso, compararAliquotas, TABELA } = require('../src/equipe-9/funcoes');

// UNITÁRIOS - calcularNF
describe('Unitário - calcularNF', () => {

  test('deve calcular corretamente com alíquotas padrão', () => {
    const resultado = calcularNF({
      valorProduto: 1000,
      icms: 18,
      ipi: 5,
      pis: 1.65,
      cofins: 7.6,
    });

    expect(resultado.valorICMS).toBe(180.00);
    expect(resultado.valorIPI).toBe(50.00);
    expect(resultado.valorPIS).toBe(16.50);
    expect(resultado.valorCOFINS).toBe(76.00);
    expect(resultado.total).toBe(1322.50);
  });

  test('deve calcular corretamente com valor diferente', () => {
    const resultado = calcularNF({
      valorProduto: 500,
      icms: 10,
      ipi: 0,
      pis: 0,
      cofins: 0,
    });

    expect(resultado.valorICMS).toBe(50.00);
    expect(resultado.total).toBe(550.00);
  });

  test('deve lançar erro se valorProduto for zero', () => {
    expect(() => calcularNF({ valorProduto: 0, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 }))
      .toThrow('Valor do produto inválido');
  });

  test('deve lançar erro se valorProduto for negativo', () => {
    expect(() => calcularNF({ valorProduto: -100, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 }))
      .toThrow('Valor do produto inválido');
  });

  test('deve lançar erro se algum imposto for negativo', () => {
    expect(() => calcularNF({ valorProduto: 1000, icms: -1, ipi: 5, pis: 1.65, cofins: 7.6 }))
      .toThrow('Impostos inválidos');
  });

  test('deve funcionar com impostos zerados', () => {
    const resultado = calcularNF({ valorProduto: 1000, icms: 0, ipi: 0, pis: 0, cofins: 0 });
    expect(resultado.total).toBe(1000.00);
  });

  test('TABELA deve ter as alíquotas padrão corretas', () => {
    expect(TABELA.IMPOSTOS_PADRAO.icms).toBe(18);
    expect(TABELA.IMPOSTOS_PADRAO.ipi).toBe(5);
    expect(TABELA.IMPOSTOS_PADRAO.pis).toBe(1.65);
    expect(TABELA.IMPOSTOS_PADRAO.cofins).toBe(7.6);
  });

});

// UNITÁRIOS - calcularNFInverso
describe('Unitário - calcularNFInverso', () => {

  test('deve calcular o valor original corretamente', () => {
    const resultado = calcularNFInverso({
      totalNF: 1322.50,
      icms: 18,
      ipi: 5,
      pis: 1.65,
      cofins: 7.6,
    });
    expect(resultado.valorProduto).toBe(1000.00);
    expect(resultado.totalNF).toBe(1322.50);
  });

  test('deve lançar erro se totalNF for zero', () => {
    expect(() => calcularNFInverso({ totalNF: 0, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 }))
      .toThrow('Total da NF inválido');
  });

  test('deve lançar erro se totalNF for negativo', () => {
    expect(() => calcularNFInverso({ totalNF: -100, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 }))
      .toThrow('Total da NF inválido');
  });

  test('deve lançar erro se imposto for negativo', () => {
    expect(() => calcularNFInverso({ totalNF: 1000, icms: -1, ipi: 5, pis: 1.65, cofins: 7.6 }))
      .toThrow('Impostos inválidos');
  });

  test('deve funcionar com impostos zerados', () => {
    const resultado = calcularNFInverso({ totalNF: 1000, icms: 0, ipi: 0, pis: 0, cofins: 0 });
    expect(resultado.valorProduto).toBe(1000.00);
  });

});

// UNITÁRIOS - compararAliquotas
describe('Unitário - compararAliquotas', () => {

  test('deve identificar cenário B como mais vantajoso quando tem menor carga tributária', () => {
    const resultado = compararAliquotas({
      valorProduto: 1000,
      cenarioA: { icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 },
      cenarioB: { icms: 12, ipi: 3, pis: 0.65, cofins: 3 },
    });

    expect(resultado.cenarioA.total).toBe(1322.50);
    expect(resultado.cenarioB.total).toBe(1186.50);
    expect(resultado.comparacao.diferencaTotal).toBe(-136.00);
    expect(resultado.comparacao.maisVantajoso).toBe('B');
  });

  test('deve identificar cenário A como mais vantajoso quando tem menor carga tributária', () => {
    const resultado = compararAliquotas({
      valorProduto: 1000,
      cenarioA: { icms: 5, ipi: 0, pis: 0, cofins: 0 },
      cenarioB: { icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 },
    });

    expect(resultado.comparacao.diferencaTotal).toBe(272.50);
    expect(resultado.comparacao.maisVantajoso).toBe('A');
  });

  test('deve retornar empate quando cenários têm mesmas alíquotas', () => {
    const aliquotas = { icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 };
    const resultado = compararAliquotas({
      valorProduto: 1000,
      cenarioA: aliquotas,
      cenarioB: aliquotas,
    });

    expect(resultado.comparacao.diferencaTotal).toBe(0);
    expect(resultado.comparacao.maisVantajoso).toBe('empate');
  });

  test('deve retornar diferencaPercentual correta', () => {
    const resultado = compararAliquotas({
      valorProduto: 1000,
      cenarioA: { icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 },
      cenarioB: { icms: 12, ipi: 3, pis: 0.65, cofins: 3 },
    });

    // -136 / 1322.50 * 100 = -10.28%
    expect(resultado.comparacao.diferencaPercentual).toBe(-10.28);
  });

  test('deve lançar erro se valorProduto for zero', () => {
    expect(() => compararAliquotas({
      valorProduto: 0,
      cenarioA: { icms: 18 },
      cenarioB: { icms: 12 },
    })).toThrow('Valor do produto inválido');
  });

  test('deve lançar erro se valorProduto for negativo', () => {
    expect(() => compararAliquotas({
      valorProduto: -500,
      cenarioA: { icms: 18 },
      cenarioB: { icms: 12 },
    })).toThrow('Valor do produto inválido');
  });

  test('deve lançar erro se alguma alíquota do cenário A for negativa', () => {
    expect(() => compararAliquotas({
      valorProduto: 1000,
      cenarioA: { icms: -1, ipi: 0, pis: 0, cofins: 0 },
      cenarioB: { icms: 12 },
    })).toThrow('Impostos inválidos');
  });

  test('deve lançar erro se alguma alíquota do cenário B for negativa', () => {
    expect(() => compararAliquotas({
      valorProduto: 1000,
      cenarioA: { icms: 18 },
      cenarioB: { icms: 12, ipi: -2 },
    })).toThrow('Impostos inválidos');
  });

  test('deve funcionar com cenários sem alíquotas (tudo zero)', () => {
    const resultado = compararAliquotas({
      valorProduto: 1000,
      cenarioA: {},
      cenarioB: {},
    });

    expect(resultado.cenarioA.total).toBe(1000.00);
    expect(resultado.cenarioB.total).toBe(1000.00);
    expect(resultado.comparacao.maisVantajoso).toBe('empate');
  });

});