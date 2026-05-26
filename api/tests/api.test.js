const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  test('deve retornar status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/tabelas', () => {
  test('deve retornar os campos e a formula do MarkUp', async () => {
    const res = await request(app).get('/api/tabelas');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('campos');
    expect(res.body.data).toHaveProperty('formula');
    expect(res.body.data.campos).toContain('custoProduto');
  });
});

describe('POST /api/calcular', () => {
  test('deve calcular o preco de venda', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({
        custoProduto: 100,
        despesasFixas: 10,
        despesasVariaveis: 5,
        impostos: 12,
        margemLucro: 20,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.precoVenda).toBe('188.68');
    expect(res.body.data.percentualTotal).toBe(0.47);
  });

  test('deve retornar erro para dados invalidos', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({
        custoProduto: 100,
        despesasFixas: 50,
        despesasVariaveis: 20,
        impostos: 20,
        margemLucro: 10,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('A soma dos percentuais deve ser menor que 100%');
  });
});
