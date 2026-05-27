const request = require('supertest');
const app     = require('../src/app');

// API - GET /api/equipe-9/health  e  GET /api/equipe-9/tabelas
describe('GET /api/equipe-9/health', () => {

  test('deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });

});

describe('GET /api/equipe-9/tabelas', () => {

  test('deve retornar a tabela de alíquotas padrão', async () => {
    const res = await request(app).get('/api/equipe-9/tabelas');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('icms');
    expect(res.body.data).toHaveProperty('ipi');
    expect(res.body.data).toHaveProperty('pis');
    expect(res.body.data).toHaveProperty('cofins');
    expect(res.body.data.icms).toBe(18);
  });

});

// API - POST /api/equipe-9/calcular
describe('API - POST /api/equipe-9/calcular', () => {

  test('deve calcular NF corretamente', async () => {
    const res = await request(app)
      .post('/api/equipe-9/calcular')
      .send({ valorProduto: 1000, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(1322.50);
    expect(res.body.data.valorICMS).toBe(180.00);
  });

  test('deve retornar erro com valorProduto inválido', async () => {
    const res = await request(app)
      .post('/api/equipe-9/calcular')
      .send({ valorProduto: 0, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Valor do produto inválido');
  });

  test('deve retornar erro com imposto negativo', async () => {
    const res = await request(app)
      .post('/api/equipe-9/calcular')
      .send({ valorProduto: 1000, icms: -5, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('deve retornar erro com corpo vazio', async () => {
    const res = await request(app)
      .post('/api/equipe-9/calcular')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});

// API - POST /api/equipe-9/calcular-inverso
describe('API - POST /api/equipe-9/calcular-inverso', () => {

  test('deve retornar o valor original do produto', async () => {
    const res = await request(app)
      .post('/api/equipe-9/calcular-inverso')
      .send({ totalNF: 1322.50, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.valorProduto).toBe(1000.00);
  });

  test('deve retornar erro com totalNF inválido', async () => {
    const res = await request(app)
      .post('/api/equipe-9/calcular-inverso')
      .send({ totalNF: 0, icms: 18, ipi: 5, pis: 1.65, cofins: 7.6 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});

// API - POST /api/equipe-9/comparar
describe('API - POST /api/equipe-9/comparar', () => {

  test('deve comparar dois cenários e retornar o mais vantajoso', async () => {
    const res = await request(app)
      .post('/api/equipe-9/comparar')
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
    // CORRIGIDO: Caminho alinhado com o app.js
    const res = await request(app)
      .post('/api/equipe-9/comparar')
      .send({ valorProduto: 2000, cenarioA: aliquotas, cenarioB: aliquotas });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.comparacao.maisVantajoso).toBe('empate');
  });

  test('deve retornar erro com valorProduto inválido', async () => {
    const res = await request(app)
      .post('/api/equipe-9/comparar')
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
      .post('/api/equipe-9/comparar')
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
      .post('/api/equipe-9/comparar')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});