const request = require('supertest');
const app = require('../src/app');
const { compararAliquotas } = require('../src/funcoes');

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

describe('API - POST /NF/comparar', () => {

  test('deve comparar dois cenários e retornar o mais vantajoso', async () => {
    const res = await request(app)
      .post('/NF/comparar')
      .send({
        valorProduto: 1000,
        cenarioA: { icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 },
        cenarioB: { icms: 12, ipi: 3, pis: 0.65, cofins: 3 },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.comparacao.maisVantajoso).toBe('B');
    expect(res.body.data.comparacao.diferencaTotal).toBe(-136.00);
  });

  test('deve retornar empate quando alíquotas são iguais', async () => {
    const aliquotas = { icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 };
    const res = await request(app)
      .post('/NF/comparar')
      .send({ valorProduto: 2000, cenarioA: aliquotas, cenarioB: aliquotas });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.comparacao.maisVantajoso).toBe('empate');
  });

  test('deve retornar erro com valorProduto inválido', async () => {
    const res = await request(app)
      .post('/NF/comparar')
      .send({
        valorProduto: 0,
        cenarioA: { icms: 18 },
        cenarioB: { icms: 12 },
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Valor do produto inválido');
  });

  test('deve retornar erro com alíquota negativa', async () => {
    const res = await request(app)
      .post('/NF/comparar')
      .send({
        valorProduto: 1000,
        cenarioA: { icms: -5 },
        cenarioB: { icms: 12 },
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('deve retornar erro com corpo vazio', async () => {
    const res = await request(app)
      .post('/NF/comparar')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});
