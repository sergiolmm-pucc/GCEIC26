const request = require('supertest');
const app     = require('../src/app');
const { calcularNFInverso } = require('../src/funcoes');

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

describe('API - POST /NF/calcular-inverso', () => {

  test('deve retornar o valor original do produto', async () => {
    const res = await request(app)
      .post('/NF/calcular-inverso')
      .send({ totalNF: 1322.50, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.valorProduto).toBe(1000.00);
  });

  test('deve retornar erro com totalNF inválido', async () => {
    const res = await request(app)
      .post('/NF/calcular-inverso')
      .send({ totalNF: 0, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});