const request = require('supertest');
const app = require('../src/app');

// =============================================
// TESTES: /MKP/markup
// =============================================
describe('POST /MKP/markup', () => {
  test('Deve calcular o preço de venda corretamente', async () => {
    const res = await request(app).post('/MKP/markup').send({
      custo: 100,
      despesas: 20,
      lucro: 10
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.preco_venda).toBeCloseTo(142.86, 1);
    expect(res.body.markup_multiplicador).toBeDefined();
  });

  test('Deve retornar erro se faltar campos', async () => {
    const res = await request(app).post('/MKP/markup').send({ custo: 100 });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBeDefined();
  });

  test('Deve retornar erro se despesas + lucro >= 100%', async () => {
    const res = await request(app).post('/MKP/markup').send({
      custo: 100,
      despesas: 60,
      lucro: 40
    });
    expect(res.statusCode).toBe(400);
  });

  test('Deve retornar erro se custo for zero ou negativo', async () => {
    const res = await request(app).post('/MKP/markup').send({
      custo: 0,
      despesas: 20,
      lucro: 10
    });
    expect(res.statusCode).toBe(400);
  });
});

// =============================================
// TESTES: /MKP/lucro
// =============================================
describe('POST /MKP/lucro', () => {
  test('Deve calcular o lucro real corretamente', async () => {
    const res = await request(app).post('/MKP/lucro').send({
      precoVenda: 200,
      custo: 100,
      despesas: 20
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.lucro_valor).toBeCloseTo(60, 1);
    expect(res.body.margem_lucro_percentual).toBeCloseTo(30, 1);
  });

  test('Deve retornar erro se preço de venda for menor que o custo', async () => {
    const res = await request(app).post('/MKP/lucro').send({
      precoVenda: 50,
      custo: 100,
      despesas: 10
    });
    expect(res.statusCode).toBe(400);
  });

  test('Deve retornar erro se faltar campos', async () => {
    const res = await request(app).post('/MKP/lucro').send({ precoVenda: 200 });
    expect(res.statusCode).toBe(400);
  });
});

// =============================================
// TESTES: /MKP/equilibrio
// =============================================
describe('POST /MKP/equilibrio', () => {
  test('Deve calcular o ponto de equilíbrio corretamente', async () => {
    const res = await request(app).post('/MKP/equilibrio').send({
      custoFixo: 5000,
      precoVenda: 100,
      custoPorUnidade: 50
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.ponto_equilibrio_unidades).toBe(100);
    expect(res.body.faturamento_equilibrio).toBeCloseTo(10000, 0);
  });

  test('Deve retornar erro se preço de venda for menor que custo por unidade', async () => {
    const res = await request(app).post('/MKP/equilibrio').send({
      custoFixo: 5000,
      precoVenda: 40,
      custoPorUnidade: 50
    });
    expect(res.statusCode).toBe(400);
  });

  test('Deve retornar erro se faltar campos', async () => {
    const res = await request(app).post('/MKP/equilibrio').send({ custoFixo: 5000 });
    expect(res.statusCode).toBe(400);
  });
});