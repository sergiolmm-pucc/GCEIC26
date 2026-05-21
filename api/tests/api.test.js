const request = require('supertest');
const app     = require('../src/app');

describe('GET /health', () => {
  test('deve retornar status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /MKP/tabelas', () => {
  test('deve retornar a tabela de constantes', async () => {
    const res = await request(app).get('/MKP/tabelas');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('tiposCalculo');
    expect(res.body.data).toHaveProperty('exemplos');
  });
});

describe('POST /MKP/calcular - precoVenda', () => {
  test('deve retornar preco de venda correto', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'precoVenda', custo: 100, markupPerc: 50 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.precoVenda).toBe(150);
  });
  test('deve retornar 400 se custo for zero', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'precoVenda', custo: 0, markupPerc: 50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /MKP/calcular - markupDivisor', () => {
  test('deve retornar PV pelo metodo divisor', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'markupDivisor', custo: 100, impostos: 10, despesas: 5, margemLucro: 15 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.precoVenda).toBe(142.86);
  });
  test('deve retornar 400 se soma >= 100%', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'markupDivisor', custo: 100, impostos: 50, despesas: 30, margemLucro: 25 });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /MKP/calcular - markup', () => {
  test('deve calcular markup 50%', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'markup', custo: 100, precoVenda: 150 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.markupPerc).toBe(50);
  });
});

describe('POST /MKP/calcular - margem', () => {
  test('deve calcular margem 33.33%', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'margem', custo: 100, precoVenda: 150 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.margemPerc).toBeCloseTo(33.33, 1);
  });
});

describe('POST /MKP/calcular - pontoEquilibrio', () => {
  test('deve calcular 250 unidades', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'pontoEquilibrio', custosFixos: 5000, precoVenda: 50, custoVariavelUnitario: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.unidades).toBe(250);
  });
});

describe('POST /MKP/calcular - erros gerais', () => {
  test('deve retornar 400 sem campo tipo', async () => {
    const res = await request(app).post('/MKP/calcular').send({ custo: 100 });
    expect(res.statusCode).toBe(400);
  });
  test('deve retornar 400 com tipo desconhecido', async () => {
    const res = await request(app).post('/MKP/calcular').send({ tipo: 'invalido' });
    expect(res.statusCode).toBe(400);
  });
});
