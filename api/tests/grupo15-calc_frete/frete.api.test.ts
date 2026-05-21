import request from 'supertest';
import app from '../src/index';

// ══════════════════════════════════════════
//  POST /frete/calcular
// ══════════════════════════════════════════
describe('POST /frete/calcular', () => {
  it('200 — retorna frete correto', async () => {
    const res = await request(app).post('/frete/calcular').send({ peso: 10, distancia: 100, tipo: 'normal' });
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.valorFinal).toBe(40.00);
  });

  it('400 — peso ausente', async () => {
    const res = await request(app).post('/frete/calcular').send({ distancia: 100, tipo: 'normal' });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it('400 — tipo inválido', async () => {
    const res = await request(app).post('/frete/calcular').send({ peso: 10, distancia: 100, tipo: 'drone' });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

// ══════════════════════════════════════════
//  POST /frete/distancia
// ══════════════════════════════════════════
describe('POST /frete/distancia', () => {
  it('200 — retorna distância SP → RJ', async () => {
    const res = await request(app).post('/frete/distancia').send({ origem: 'São Paulo', destino: 'Rio de Janeiro' });
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.distanciaKm).toBe(430);
  });

  it('400 — origem ausente', async () => {
    const res = await request(app).post('/frete/distancia').send({ destino: 'Rio de Janeiro' });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it('400 — rota não encontrada', async () => {
    const res = await request(app).post('/frete/distancia').send({ origem: 'São Paulo', destino: 'CidadeX' });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

// ══════════════════════════════════════════
//  GET /frete/distancia/cidades
// ══════════════════════════════════════════
describe('GET /frete/distancia/cidades', () => {
  it('200 — retorna lista de cidades', async () => {
    const res = await request(app).get('/frete/distancia/cidades');
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
  });
});

// ══════════════════════════════════════════
//  POST /frete/prazo
// ══════════════════════════════════════════
describe('POST /frete/prazo', () => {
  it('200 — retorna prazo para tipo normal', async () => {
    const res = await request(app).post('/frete/prazo').send({ distanciaKm: 100, tipo: 'normal' });
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.diasUteisMin).toBe(3);
  });

  it('400 — tipo inválido', async () => {
    const res = await request(app).post('/frete/prazo').send({ distanciaKm: 100, tipo: 'drone' });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});
