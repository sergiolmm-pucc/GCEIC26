const request = require('supertest');
const app = require('../src/app');

describe('Testes da API - SaunaCalc Elite', () => {
  it('GET /health deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/calcular deve calcular sauna seca corretamente', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ tipo: 'seca', volumeM3: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('kit');
    expect(res.body.data).toHaveProperty('instalacao');
    expect(res.body.data).toHaveProperty('operacao');
  });

  it('POST /api/calcular deve retornar erro para tipo invalido', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ tipo: 'banheira', volumeM3: 10 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/calcularKit deve retornar custo do kit', async () => {
    const res = await request(app)
      .post('/api/calcularKit')
      .send({ tipo: 'seca', volumeM3: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.custoKit).toBe(2700);
  });

  it('POST /api/calcularInstalacao vapor inclui hidraulica', async () => {
    const res = await request(app)
      .post('/api/calcularInstalacao')
      .send({ tipo: 'vapor', volumeM3: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.instalacao.hidraulica).toBe(2000);
  });
});