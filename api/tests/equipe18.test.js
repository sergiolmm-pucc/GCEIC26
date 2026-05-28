const request = require('supertest');
const app = require('../src/app');

describe('Testes de API - Equipe 18 - Cálculo de Impostos', () => {
  
  test('GET /equipe-18/health - Deve retornar status ok', async () => {
    const res = await request(app).get('/equipe-18/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('POST /equipe-18/impostos/icms - Deve calcular o ICMS corretamente', async () => {
    const payload = {
      productValue: 1000,
      state: 'SP'
    };
    const res = await request(app)
      .post('/equipe-18/impostos/icms')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.productValue).toBe('1000.00');
    expect(res.body.state).toBe('SP');
    expect(res.body.icmsRate).toBe('18.00%');
    expect(res.body.icmsAmount).toBe('180.00');
    expect(res.body.total).toBe('1180.00');
  });

  test('POST /equipe-18/impostos/ipi - Deve calcular o IPI corretamente para NCM suportado', async () => {
    const payload = {
      productValue: 1500,
      freightValue: 150,
      additionalExpenses: 50,
      ncm: '2201.10.00'
    };
    const res = await request(app)
      .post('/equipe-18/impostos/ipi')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.ncm).toBe('2201.10.00');
    expect(res.body.ipiRate).toBe('2.60%');
    expect(res.body.ipiAmount).toBe('44.20'); // (1500+150+50) * 0.026 = 1700 * 0.026 = 44.2
    expect(res.body.total).toBe('1744.20');
  });

  test('POST /equipe-18/impostos/pis-cofins - Deve calcular PIS/COFINS', async () => {
    const payload = {
      productValue: 2000,
      pisRate: 0.0165,
      confinsRate: 0.076
    };
    const res = await request(app)
      .post('/equipe-18/impostos/pis-cofins')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.productValue).toBe('2000.00');
    expect(res.body.pisAmount).toBe('33.00');
    expect(res.body.confinsAmount).toBe('152.00');
    expect(res.body.totalTax).toBe('185.00');
  });

  test('POST /equipe-18/impostos/nf-completa - Deve consolidar todos os calculos de impostos', async () => {
    const payload = {
      productValue: 5000,
      state: 'RJ',
      ncm: '2201.10.00',
      freightValue: 200,
      additionalExpenses: 100,
      pisRate: 0.0165,
      confinsRate: 0.076
    };
    const res = await request(app)
      .post('/equipe-18/impostos/nf-completa')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.productValue).toBe('5000.00');
    expect(res.body.state).toBe('RJ');
    expect(res.body.icms.rate).toBe('22.00%'); // RJ has 22% rate in the list
    expect(res.body.ipi.rate).toBe('2.60%');
    expect(res.body.totals.taxesTotal).toBe('1700.30'); // icms = 1100, ipi = 137.80, pis = 82.50, cofins = 380.00
  });

  test('POST /equipe-18/impostos/icms - Deve falhar se productValue for menor/igual a zero', async () => {
    const payload = {
      productValue: 0,
      state: 'SP'
    };
    const res = await request(app)
      .post('/equipe-18/impostos/icms')
      .send(payload);

    expect(res.statusCode).toBe(400);
  });
});
