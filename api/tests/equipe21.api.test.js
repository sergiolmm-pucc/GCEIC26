const request = require('supertest');
const app = require('../src/app');

const payloadValido = {
  pao: 10,
  carne: 40,
  queijo: 10,
  molho: 5,
  salada: 5,
  embalagem: 8,
  custoAdicional: 2,
  quantidade: 10,
  margemLucro: 30,
};

describe('Equipe 21 - BURGCALC API', () => {
  test('GET /api/equipe-21/health deve retornar status ok', async () => {
    const res = await request(app).get('/api/equipe-21/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.equipe).toBe(21);
  });

  test('GET /api/equipe-21/tabelas deve retornar metadados do calculo', async () => {
    const res = await request(app).get('/api/equipe-21/tabelas');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.camposObrigatorios).toContain('pao');
    expect(res.body.data.camposObrigatorios).toContain('margemLucro');
    expect(res.body.data).toHaveProperty('formula');
  });

  test('POST /api/equipe-21/calcular deve retornar dados calculados com payload correto', async () => {
    const res = await request(app)
      .post('/api/equipe-21/calcular')
      .send(payloadValido);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({
      custoTotal: 80,
      custoUnitario: 8,
      precoVendaSugerido: 10.4,
      lucroEstimadoPorUnidade: 2.4,
    });
  });

  test('POST /api/equipe-21/calcular deve retornar erro com quantidade invalida', async () => {
    const res = await request(app)
      .post('/api/equipe-21/calcular')
      .send({ ...payloadValido, quantidade: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('quantidade deve ser maior que zero');
  });

  test('POST /api/equipe-21/calcular deve retornar erro com campo nao numerico', async () => {
    const res = await request(app)
      .post('/api/equipe-21/calcular')
      .send({ ...payloadValido, pao: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('pao deve ser um numero valido');
  });
});
