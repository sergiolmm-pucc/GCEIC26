const request = require('supertest');
const app = require('../src/app');

// ══════════════════════════════════════════
//  GET /equipe-15/health
// ══════════════════════════════════════════
describe('GET /equipe-15/health', () => {
  test('deve retornar status ok', async () => {
    const res = await request(app).get('/equipe-15/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ══════════════════════════════════════════
//  POST /equipe-15/frete/calcular
// ══════════════════════════════════════════
describe('POST /equipe-15/frete/calcular', () => {
  test('retorna frete correto para tipo normal', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/calcular')
      .send({ peso: 10, distancia: 100, tipo: 'normal' });
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.valorFinal).toBe(40.00);
    expect(res.body.dados.custoPeso).toBe(25.00);
    expect(res.body.dados.custoDistancia).toBe(15.00);
  });

  test('aplica multiplicador expresso corretamente', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/calcular')
      .send({ peso: 10, distancia: 100, tipo: 'expresso' });
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.valorFinal).toBe(72.00);
  });

  test('aplica multiplicador economico corretamente', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/calcular')
      .send({ peso: 10, distancia: 100, tipo: 'economico' });
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.valorFinal).toBe(32.00);
  });

  test('retorna 400 para peso ausente', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/calcular')
      .send({ distancia: 100, tipo: 'normal' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para tipo inválido', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/calcular')
      .send({ peso: 10, distancia: 100, tipo: 'drone' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para peso negativo', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/calcular')
      .send({ peso: -5, distancia: 100, tipo: 'normal' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

// ══════════════════════════════════════════
//  POST /equipe-15/frete/distancia
// ══════════════════════════════════════════
describe('POST /equipe-15/frete/distancia', () => {
  test('retorna distância correta entre São Paulo e Rio de Janeiro', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/distancia')
      .send({ origem: 'São Paulo', destino: 'Rio de Janeiro' });
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.distanciaKm).toBe(430);
    expect(res.body.dados.custoDistancia).toBe(64.50);
  });

  test('funciona nos dois sentidos (RJ → SP)', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/distancia')
      .send({ origem: 'Rio de Janeiro', destino: 'São Paulo' });
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.distanciaKm).toBe(430);
  });

  test('retorna 400 para origem ausente', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/distancia')
      .send({ destino: 'Rio de Janeiro' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para rota não cadastrada', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/distancia')
      .send({ origem: 'São Paulo', destino: 'CidadeX' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para origem igual ao destino', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/distancia')
      .send({ origem: 'São Paulo', destino: 'São Paulo' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

// ══════════════════════════════════════════
//  GET /equipe-15/frete/distancia/cidades
// ══════════════════════════════════════════
describe('GET /equipe-15/frete/distancia/cidades', () => {
  test('retorna lista de cidades disponíveis', async () => {
    const res = await request(app).get('/equipe-15/frete/distancia/cidades');
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
    expect(res.body.dados).toContain('São Paulo');
  });
});

// ══════════════════════════════════════════
//  POST /equipe-15/frete/prazo
// ══════════════════════════════════════════
describe('POST /equipe-15/frete/prazo', () => {
  test('retorna prazo correto para tipo normal e 100km', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/prazo')
      .send({ distanciaKm: 100, tipo: 'normal' });
    expect(res.statusCode).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.diasUteisMin).toBe(3);
    expect(res.body.dados.diasUteisMax).toBe(5);
  });

  test('retorna prazo correto para tipo expresso', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/prazo')
      .send({ distanciaKm: 100, tipo: 'expresso' });
    expect(res.statusCode).toBe(200);
    expect(res.body.dados.diasUteisMin).toBe(1);
    expect(res.body.dados.diasUteisMax).toBe(2);
  });

  test('retorna 400 para tipo inválido', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/prazo')
      .send({ distanciaKm: 100, tipo: 'drone' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para distanciaKm ausente', async () => {
    const res = await request(app)
      .post('/equipe-15/frete/prazo')
      .send({ tipo: 'normal' });
    expect(res.statusCode).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});
