const request = require('supertest');
const app = require('../src/app');

describe('API - Equipe 11', () => {

  test('POST /api/equipe-11/login deve retornar token com credenciais corretas', async () => {
    const res = await request(app)
      .post('/equipe-11/login')
      .send({ username: 'admin', password: 'admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('admin');
  });

  test('POST /api/equipe-11/calculate deve retornar 401 sem token', async () => {
    const res = await request(app)
      .post('/equipe-11/calculate')
      .send({ length: 100, width: 50 });

    expect(res.statusCode).toBe(401);
  });

  test('POST /api/equipe-11/calculate deve calcular com token válido', async () => {
    const login = await request(app)
      .post('/equipe-11/login')
      .send({ username: 'admin', password: 'admin' });

    const token = login.body.token;

    const res = await request(app)
      .post('/equipe-11/calculate')
      .set('Authorization', `Bearer ${token}`)
      .send({ length: 100, width: 50, maintenanceYears: 1, annualCareCost: 1000 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('area');
    expect(res.body).toHaveProperty('totalCost');
  });

  test('POST /api/equipe-11/calculate deve retornar 400 com valores inválidos', async () => {
    const login = await request(app)
      .post('/equipe-11/login')
      .send({ username: 'admin', password: 'admin' });
    const token = login.body.token;

    const res = await request(app)
      .post('/equipe-11/calculate')
      .set('Authorization', `Bearer ${token}`)
      .send({ length: 0, width: -5 });

    expect(res.statusCode).toBe(400);
  });

});
