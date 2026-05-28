const request = require('supertest');
const app = require('../src/app');

describe('rotas MKP do Grupo 13', () => {

  test('retorna mensagem de status da API', async () => {
    const response = await request(app).get('/MKP');
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Grupo 13');
  });

  test('calcula preco de venda via markup', async () => {
    const response = await request(app)
      .post('/MKP/markup')
      .send({ custo: 100, despesas: 20, lucro: 10 });
    expect(response.status).toBe(200);
    expect(response.body.preco_venda).toBeCloseTo(142.86, 1);
    expect(response.body.markup_multiplicador).toBeDefined();
  });

  test('retorna erro se faltar campos no markup', async () => {
    const response = await request(app)
      .post('/MKP/markup')
      .send({ custo: 100 });
    expect(response.status).toBe(400);
    expect(response.body.erro).toBeDefined();
  });

  test('retorna erro se despesas + lucro >= 100 no markup', async () => {
    const response = await request(app)
      .post('/MKP/markup')
      .send({ custo: 100, despesas: 60, lucro: 40 });
    expect(response.status).toBe(400);
  });

  test('calcula lucro real de uma venda', async () => {
    const response = await request(app)
      .post('/MKP/lucro')
      .send({ precoVenda: 200, custo: 100, despesas: 20 });
    expect(response.status).toBe(200);
    expect(response.body.lucro_valor).toBeCloseTo(60, 1);
    expect(response.body.margem_lucro_percentual).toBeCloseTo(30, 1);
  });

  test('retorna erro se preco de venda for menor que custo no lucro', async () => {
    const response = await request(app)
      .post('/MKP/lucro')
      .send({ precoVenda: 50, custo: 100, despesas: 10 });
    expect(response.status).toBe(400);
  });

  test('calcula ponto de equilibrio', async () => {
    const response = await request(app)
      .post('/MKP/equilibrio')
      .send({ custoFixo: 5000, precoVenda: 100, custoPorUnidade: 50 });
    expect(response.status).toBe(200);
    expect(response.body.ponto_equilibrio_unidades).toBe(100);
    expect(response.body.faturamento_equilibrio).toBeCloseTo(10000, 0);
  });

  test('retorna erro se preco de venda for menor que custo por unidade no equilibrio', async () => {
    const response = await request(app)
      .post('/MKP/equilibrio')
      .send({ custoFixo: 5000, precoVenda: 40, custoPorUnidade: 50 });
    expect(response.status).toBe(400);
  });

});
