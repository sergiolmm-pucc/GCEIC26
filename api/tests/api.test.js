const request = require('supertest');
const app     = require('../src/app');

describe('GET /health', () => {
  test('deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/tabelas', () => {
  test('deve retornar tabelas de referência', async () => {
    const res = await request(app).get('/api/tabelas');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('faixasTarifa');
  });
});

// API 1 — ANA
describe('POST /AGUA/consumoDiario (Ana)', () => {
  test('deve calcular consumo para 4 pessoas', async () => {
    const res = await request(app)
      .post('/AGUA/consumoDiario')
      .send({ tempoBanhoMin: 10, descargasDia: 3, pessoas: 4 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('consumoDiarioLitros');
    expect(res.body.data.pessoas).toBe(4);
  });

  test('deve retornar erro 400 para pessoas inválidas', async () => {
    const res = await request(app)
      .post('/AGUA/consumoDiario')
      .send({ tempoBanhoMin: 10, descargasDia: 3, pessoas: 0 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// API 2 — HUGO
describe('POST /AGUA/custoMensal (Hugo)', () => {
  test('deve calcular custo mensal corretamente', async () => {
    const res = await request(app)
      .post('/AGUA/custoMensal')
      .send({ consumoDiarioLitros: 282, tarifa: 0.005, dias: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('custoEstimado');
    expect(res.body.data).toHaveProperty('consumoMensalM3');
  });

  test('deve retornar erro 400 para tarifa zero', async () => {
    const res = await request(app)
      .post('/AGUA/custoMensal')
      .send({ consumoDiarioLitros: 282, tarifa: 0, dias: 30 });
    expect(res.statusCode).toBe(400);
  });
});

// API 3 — LETICIA
describe('POST /AGUA/economia (Leticia)', () => {
  test('deve calcular projeção de economia com pessoas', async () => {
    const res = await request(app)
      .post('/AGUA/economia')
      .send({ litrosAtuais: 8460, reducaoPercentual: 20, tarifa: 0.005, pessoas: 4 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('economiaLitros');
    expect(res.body.data).toHaveProperty('reducaoBanhoMinutos');
    expect(res.body.data).toHaveProperty('reducaoDescargas');
  });

  test('deve retornar erro 400 para redução inválida', async () => {
    const res = await request(app)
      .post('/AGUA/economia')
      .send({ litrosAtuais: 8460, reducaoPercentual: 0, tarifa: 0.005, pessoas: 4 });
    expect(res.statusCode).toBe(400);
  });

  test('deve retornar erro 400 para pessoas inválidas', async () => {
    const res = await request(app)
      .post('/AGUA/economia')
      .send({ litrosAtuais: 8460, reducaoPercentual: 20, tarifa: 0.005, pessoas: 0 });
    expect(res.statusCode).toBe(400);
  });
});