const { calcularNF, TABELA } = require('../src/funcoes');

describe('Testes unitários - calcularNF', () => {

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
