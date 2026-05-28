const request = require('supertest');
const app = require('../src/app');

describe('rotas PBL do Grupo 14', () => {
  test('responde health check', async () => {
    const response = await request(app).get('/PBL/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  test('calcula preco liquido', async () => {
    const response = await request(app)
      .post('/PBL/preco-liquido')
      .send({
        precoBruto: 13.44,
        quantidade: 1,
        icmsPercentual: 0.18,
        pisPercentual: 0.0165,
        cofinsPercentual: 0.076,
        ipiPercentual: 0
      });

    expect(response.status).toBe(200);
    expect(response.body.precoLiquido).toBe(10);
  });

  test('retorna erro para percentual invalido', async () => {
    const response = await request(app)
      .post('/PBL/preco-liquido')
      .send({ precoBruto: 10, icmsPercentual: 101 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('maior que 100');
  });
});
