const request = require('supertest');
const app     = require('../src/app');

// ────────────────────────────────────────────────
// health check
// ────────────────────────────────────────────────
describe('GET /health', () => {
  test('retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ────────────────────────────────────────────────
// POST /api/calcular
// ────────────────────────────────────────────────
describe('POST /api/calcular', () => {
  test('calcula simulação completa com sucesso', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ tipo: 'seca', volumeM3: 10, horasPorDia: 2, diasPorMes: 20, tarifaKwh: 0.85 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('kit');
    expect(res.body.data).toHaveProperty('instalacao');
    expect(res.body.data).toHaveProperty('operacao');
  });

  test('retorna erro 400 para tipo inválido', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ tipo: 'banheira', volumeM3: 10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('retorna erro 400 quando tipo não informado', async () => {
    const res = await request(app)
      .post('/api/calcular')
      .send({ volumeM3: 10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ────────────────────────────────────────────────
// POST /api/calcularKit
// ────────────────────────────────────────────────
describe('POST /api/calcularKit', () => {
  test('retorna custo do kit corretamente', async () => {
    const res = await request(app)
      .post('/api/calcularKit')
      .send({ tipo: 'seca', volumeM3: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.custoKit).toBe(2700);
  });

  test('retorna erro para volume zero', async () => {
    const res = await request(app)
      .post('/api/calcularKit')
      .send({ tipo: 'seca', volumeM3: 0 });

    expect(res.statusCode).toBe(400);
  });
});

// ────────────────────────────────────────────────
// POST /api/calcularInstalacao
// ────────────────────────────────────────────────
describe('POST /api/calcularInstalacao', () => {
  test('vapor inclui custo hidráulico', async () => {
    const res = await request(app)
      .post('/api/calcularInstalacao')
      .send({ tipo: 'vapor', volumeM3: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.instalacao.hidraulica).toBe(2000);
  });
});