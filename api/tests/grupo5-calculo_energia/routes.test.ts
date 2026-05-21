import request from 'supertest';
import { app } from '../src/server.js' 
import { Appliance } from '../src/services/energyService.js'; 

const aparelhos: Appliance[] = [
  { name: 'Geladeira', watts: 150, hoursPerDay: 24 },
  { name: 'TV', watts: 100, hoursPerDay: 6 },
];

// ─── POST /ENRG/consumo ───────────────────────────────────────────────────────

describe('POST /ENRG/consumo', () => {
  it('retorna 200 com resultado correto', async () => {
    const response = await request(app)
    .post('/ENRG/consumo')
    .send({ appliances: aparelhos });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalKwh');
  });

  it('retorna 400 sem corpo', async () => {
    const res = await request(app)
      .post('/ENRG/consumo')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── POST /ENRG/conta ────────────────────────────────────────────────────────

describe('POST /ENRG/conta', () => {
  test('retorna 200 com valor da conta', async () => {
    const res = await request(app)
      .post('/ENRG/conta')
      .send({ totalKwh: 200, tarifa: 0.75, bandeira: 'verde' });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(150);
    expect(res.body.adicionalBandeira).toBe(0);
  });

  test('retorna 400 sem tarifa', async () => {
    const res = await request(app)
      .post('/ENRG/conta')
      .send({ totalKwh: 100 });

    expect(res.status).toBe(400);
  });
});

// ─── POST /ENRG/simular ───────────────────────────────────────────────────────

describe('POST /ENRG/simular', () => {
  const cenarioA: Appliance[] = [{ name: 'Ar 8h', watts: 1500, hoursPerDay: 8 }];
  const cenarioB: Appliance[] = [{ name: 'Ar 4h', watts: 1500, hoursPerDay: 4 }];

  test('retorna 200 com comparação', async () => {
    const res = await request(app)
      .post('/ENRG/simular')
      .send({ cenarioA, cenarioB, tarifa: 0.75 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('diffKwh');
    expect(res.body).toHaveProperty('economiaReais');
    expect(res.body.cenarioMaisEconomico).toBe('B');
  });

  test('retorna 400 sem cenários', async () => {
    const res = await request(app)
      .post('/ENRG/simular')
      .send({ tarifa: 0.75 });

    expect(res.status).toBe(400);
  });
});