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

describe('GET /api/tabelas', () => {
  test('deve retornar tabela de tarifas e constantes', async () => {
    const res = await request(app).get('/api/tabelas');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('faixasTarifa');
    expect(res.body.data).toHaveProperty('consumoMedioPorPessoa');
    expect(res.body.data).toHaveProperty('margemSeguranca');
    expect(Array.isArray(res.body.data.faixasTarifa)).toBe(true);
  });
});

describe('POST /api/calcular', () => {
  test('deve calcular consumo para 4 pessoas', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ pessoas: 4, dias: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('pessoas', 4);
    expect(res.body.data).toHaveProperty('m3Mes');
    expect(res.body.data).toHaveProperty('valorTotal');
  });

  test('deve calcular consumo com consumo customizado', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ pessoas: 2, litrosPorPessoa: 200, dias: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.litrosDia).toBe(400);
  });

  test('deve retornar erro 400 para 0 pessoas', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ pessoas: 0 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('error');
  });

  test('deve retornar erro 400 para body inválido', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send('string invalida')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(400);
  });
});