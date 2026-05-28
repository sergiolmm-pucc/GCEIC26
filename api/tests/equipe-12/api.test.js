const request = require('supertest');
const app = require('../../src/app');

describe('Equipe 12 - API MarkUp', () => {
  test('GET /api/equipe-12 retorna status da API', async () => {
    const res = await request(app).get('/api/equipe-12');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Grupo 12');
  });

  test('GET /api/equipe-12/tabelas retorna metadados', async () => {
    const res = await request(app).get('/api/equipe-12/tabelas');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.TIPOS_CALCULO).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tipo: 'markupDivisor' }),
        expect.objectContaining({ tipo: 'pontoEquilibrio' }),
      ]),
    );
  });

  test('POST /api/equipe-12/calcular calcula MarkUp divisor', async () => {
    const res = await request(app)
      .post('/api/equipe-12/calcular')
      .send({
        tipo: 'markupDivisor',
        custo: 100,
        impostos: 0,
        despesas: 0,
        margemLucro: 30,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.precoVenda).toBe(142.86);
  });

  test('POST /api/equipe-12/calcular retorna erro com payload invalido', async () => {
    const res = await request(app)
      .post('/api/equipe-12/calcular')
      .send({
        tipo: 'markupDivisor',
        custo: 100,
        impostos: 40,
        despesas: 30,
        margemLucro: 30,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('>= 100%');
  });

  test('POST /api/equipe-12/calcular retorna erro com corpo ausente', async () => {
    const res = await request(app)
      .post('/api/equipe-12/calcular')
      .set('Content-Type', 'text/plain')
      .send('sem-json');

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Corpo da requisicao invalido');
  });
});
