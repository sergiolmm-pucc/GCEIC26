const request = require('supertest');
const app = require('../src/app');

describe('Teste de API - health', () => {

  test('GET /health deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

});

describe('Teste de API - /api/parcela', () => {

  test('deve retornar parcela para dados válidos', async () => {
    const res = await request(app).post('/api/parcela').send({
      valorVeiculo: 30000,
      entrada: 6000,
      taxaMensal: 1.29,
      numParcelas: 48,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.parcela).toBeGreaterThan(0);
  });

  test('deve retornar erro 400 para dados inválidos', async () => {
    const res = await request(app).post('/api/parcela').send({
      valorVeiculo: 0,
      entrada: 0,
      taxaMensal: 1,
      numParcelas: 12,
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

});

describe('Teste de API - /api/capacidade', () => {

  test('deve retornar capacidade para dados válidos', async () => {
    const res = await request(app).post('/api/capacidade').send({
      rendaMensal: 5000,
      taxaMensal: 1,
      numParcelas: 48,
      entradaPercent: 20,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.parcelaMaxima).toBe(1500);
  });

  test('deve retornar erro 400 para renda inválida', async () => {
    const res = await request(app).post('/api/capacidade').send({
      rendaMensal: 0,
      taxaMensal: 1,
      numParcelas: 48,
      entradaPercent: 20,
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

});