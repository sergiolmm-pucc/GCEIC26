const request = require('supertest');
const app = require('../src/app');

describe('rotas IRP da Equipe 2', () => {

  test('salário isento (abaixo de R$ 2.500) deve retornar imposto 0', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: 2000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.salario).toBe(2000);
    expect(res.body.imposto).toBe(0);
    expect(res.body.liquido).toBe(2000);
  });

  test('salário exatamente no limite isento (R$ 2.500) deve retornar imposto 0', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: 2500 });
    expect(res.statusCode).toBe(200);
    expect(res.body.imposto).toBe(0);
    expect(res.body.liquido).toBe(2500);
  });

  test('salário na faixa de 7,5% deve calcular corretamente', async () => {
    // Isento até 2500, 7,5% sobre (4000-2500)=1500 → imposto = 112.5
    const res = await request(app).post('/IRP/calcular').send({ salario: 4000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.salario).toBe(4000);
    expect(res.body.imposto).toBe(112.5);
    expect(res.body.liquido).toBe(3887.5);
  });

  test('salário R$ 6.000 deve calcular imposto R$ 337,50', async () => {
    // Isento até 2500 / 7,5% sobre 2500 = 187.5 / 15% sobre 1000 = 150 → total = 337.5
    const res = await request(app).post('/IRP/calcular').send({ salario: 6000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.salario).toBe(6000);
    expect(res.body.imposto).toBe(337.5);
    expect(res.body.liquido).toBe(5662.5);
  });

  test('salário acima de R$ 5.000 deve aplicar as três faixas corretamente', async () => {
    // 10000: faixa1=0, faixa2=187.5, faixa3=750 → total = 937.5
    const res = await request(app).post('/IRP/calcular').send({ salario: 10000 });
    expect(res.statusCode).toBe(200);
    expect(res.body.imposto).toBe(937.5);
    expect(res.body.liquido).toBe(9062.5);
  });

  test('salário zero deve retornar imposto 0 e líquido 0', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: 0 });
    expect(res.statusCode).toBe(200);
    expect(res.body.imposto).toBe(0);
    expect(res.body.liquido).toBe(0);
  });

  test('resposta deve conter o campo detalhamento', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: 6000 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('detalhamento');
    expect(Array.isArray(res.body.detalhamento)).toBe(true);
    expect(res.body.detalhamento.length).toBeGreaterThan(0);
  });

  test('salário ausente deve retornar erro 400', async () => {
    const res = await request(app).post('/IRP/calcular').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  test('salário como string deve retornar erro 400', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: 'seis mil' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  test('salário como null deve retornar erro 400', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: null });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  test('salário negativo deve retornar erro 400', async () => {
    const res = await request(app).post('/IRP/calcular').send({ salario: -500 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erro');
    expect(res.body.erro).toMatch(/negativo/i);
  });

});
