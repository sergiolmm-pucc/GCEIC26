const request = require('supertest');
const app = require('../../src/app');

describe('API de Finanças - Endpoints', () => {

  test('POST /api/calc-financeira/juros-simples - Deve retornar status 200 com dados válidos', async () => {
    const response = await request(app)
      .post('/api/calc-financeira/juros-simples')
      .send({ capital: 1000, taxa: 10, tempo: 1 });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.montante).toBe(1100);
  });

  test('POST /api/calc-financeira/juros-simples - Deve retornar 400 com dados inválidos', async () => {
    const response = await request(app)
      .post('/api/calc-financeira/juros-simples')
      .send({ capital: 0, taxa: 10, tempo: 1 }); // Capital inválido
    
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/calc-financeira/juros-compostos - Deve calcular corretamente', async () => {
    const response = await request(app)
      .post('/api/calc-financeira/juros-compostos')
      .send({ capital: 1000, taxa: 10, tempo: 2 });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data.montante).toBe(1210);
  });

  test('POST /api/calc-financeira/investimento - Deve retornar 200', async () => {
    const response = await request(app)
      .post('/api/calc-financeira/investimento')
      .send({ aporteMensal: 100, taxa: 1, tempoMeses: 1 });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data.montante).toBe(101);
  });
});