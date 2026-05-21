const request = require('supertest');
const app     = require('../src/app');

describe('GET /health', () => {

  test('deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });

});

describe('GET /NF/tabelas', () => {

  test('deve retornar a tabela de alíquotas padrão', async () => {
    const res = await request(app).get('/NF/tabelas');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('icms');
    expect(res.body.data).toHaveProperty('ipi');
    expect(res.body.data).toHaveProperty('pis');
    expect(res.body.data).toHaveProperty('cofins');
    expect(res.body.data.icms).toBe(18);
  });

});

describe('POST /NF/calcular', () => {

  test('deve calcular NF corretamente', async () => {
    const res = await request(app)
      .post('/NF/calcular')
      .send({ valorProduto: 1000, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(1322.50);
    expect(res.body.data.valorICMS).toBe(180.00);
  });

  test('deve retornar erro com valorProduto inválido', async () => {
    const res = await request(app)
      .post('/NF/calcular')
      .send({ valorProduto: 0, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Valor do produto inválido');
  });

  test('deve retornar erro com imposto negativo', async () => {
    const res = await request(app)
      .post('/NF/calcular')
      .send({ valorProduto: 1000, icms: -5, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('deve retornar erro com corpo vazio', async () => {
    const res = await request(app)
      .post('/NF/calcular')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});
