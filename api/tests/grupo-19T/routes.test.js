const request = require('supertest');
const app = require('../../src/grupo-19/server');

const BODY_VALIDO = {
  valorImovel: 500000,
  entrada: 100000,
  taxaAnual: 12,
  prazoMeses: 120,
};

afterAll(() => {
  if (app.closeServer) app.closeServer();
});

describe('GET /', () => {
  test('retorna 200 com informações da API', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nome');
    expect(res.body).toHaveProperty('endpoints');
  });
});

describe('GET /FIN/health', () => {
  test('retorna status ok', async () => {
    const res = await request(app).get('/FIN/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('POST /FIN/sac', () => {
  test('retorna 200 com dados do SAC para body válido', async () => {
    const res = await request(app).post('/FIN/sac').send(BODY_VALIDO);
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('parcelas');
    expect(res.body.dados.tipo).toBe('FinanciamentoSAC');
  });

  test('parcelas têm amortização constante', async () => {
    const res = await request(app).post('/FIN/sac').send(BODY_VALIDO);
    const { parcelas } = res.body.dados;
    const amortEsperada = 400000 / 120;
    parcelas.forEach(p => expect(p.amortizacao).toBeCloseTo(amortEsperada, 0));
  });

  test('retorna 400 para parâmetros inválidos', async () => {
    const res = await request(app).post('/FIN/sac').send({ valorImovel: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
    expect(res.body).toHaveProperty('erro');
  });

  test('retorna 400 quando entrada >= valor do imóvel', async () => {
    const res = await request(app)
      .post('/FIN/sac')
      .send({ ...BODY_VALIDO, entrada: 600000 });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para taxa de juros zero', async () => {
    const res = await request(app)
      .post('/FIN/sac')
      .send({ ...BODY_VALIDO, taxaAnual: 0 });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

describe('POST /FIN/price', () => {
  test('retorna 200 com dados do PRICE para body válido', async () => {
    const res = await request(app).post('/FIN/price').send(BODY_VALIDO);
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('parcelas');
    expect(res.body.dados.tipo).toBe('FinanciamentoPRICE');
  });

  test('parcelas PRICE têm prestação fixa', async () => {
    const res = await request(app).post('/FIN/price').send(BODY_VALIDO);
    const { parcelas } = res.body.dados;
    const pmt = parcelas[0].prestacao;
    parcelas.forEach(p => expect(p.prestacao).toBeCloseTo(pmt, 1));
  });

  test('retorna 400 para parâmetros inválidos', async () => {
    const res = await request(app).post('/FIN/price').send({ prazoMeses: -1 });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

describe('POST /FIN/comparar', () => {
  test('retorna 200 com comparação SAC x PRICE', async () => {
    const res = await request(app).post('/FIN/comparar').send(BODY_VALIDO);
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('sac');
    expect(res.body.dados).toHaveProperty('price');
    expect(res.body.dados).toHaveProperty('comparacao');
  });

  test('SAC tem total pago menor que PRICE', async () => {
    const res = await request(app).post('/FIN/comparar').send(BODY_VALIDO);
    const { comparacao } = res.body.dados;
    expect(comparacao.totalPagoSAC).toBeLessThan(comparacao.totalPagoPRICE);
  });

  test('sistema recomendado é SAC', async () => {
    const res = await request(app).post('/FIN/comparar').send(BODY_VALIDO);
    expect(res.body.dados.comparacao.sistemaRecomendado).toBe('SAC');
  });

  test('retorna 400 para parâmetros inválidos', async () => {
    const res = await request(app).post('/FIN/comparar').send({});
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

describe('POST /FIN/capacidade', () => {
  test('retorna 200 com cálculo de capacidade', async () => {
    const res = await request(app)
      .post('/FIN/capacidade')
      .send({ rendaMensal: 8000, taxaAnual: 10.5, prazoMeses: 360 });
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados).toHaveProperty('parcelaMaximaRecomendada');
    expect(res.body.dados).toHaveProperty('valorMaximoFinanciavel');
    expect(res.body.dados.percentualRenda).toBe(30);
  });

  test('parcela máxima é 30% da renda', async () => {
    const res = await request(app)
      .post('/FIN/capacidade')
      .send({ rendaMensal: 8000, taxaAnual: 10.5, prazoMeses: 360 });
    expect(res.body.dados.parcelaMaximaRecomendada).toBeCloseTo(2400, 0);
  });

  test('retorna 400 para renda menor ou igual a zero', async () => {
    const res = await request(app)
      .post('/FIN/capacidade')
      .send({ rendaMensal: 0, taxaAnual: 10.5, prazoMeses: 360 });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  test('retorna 400 para parâmetros ausentes', async () => {
    const res = await request(app).post('/FIN/capacidade').send({});
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});
