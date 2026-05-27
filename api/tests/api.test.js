
const request = require('supertest');
const app     = require('../src/app');

describe('Teste de Saude -> GET /health', () => {

	test('deve retornar status ok', async () => {

		const res = await request(app).get('/health');
		expect(res.statusCode).toBe(200);
		expect(res.body.status).toBe('ok');

	});

});

describe('GET /api/tabelas', () => {
  test('deve retornar a tebela de constantes ', async () => {
    const res = await request(app).get('/api/tabelas');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('base');
    expect(res.body.data).toHaveProperty('referencia');

  });
});

// ────────────────────────────────────────────────────────────
//  GRUPO 17 — Testes de API NF de Venda
// ────────────────────────────────────────────────────────────

// Chave real de NF-e para testes (SP, NF-e modelo 55)
const CHAVE_TESTE = '35260312345678000195550010000000011234567890';

describe('GET /nfvenda/tabelas', () => {
  test('deve retornar tabelas de impostos NF venda', async () => {
    const res = await request(app).get('/nfvenda/tabelas');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('estados');
    expect(res.body.data).toHaveProperty('regimes');
  });
});

describe('POST /nfvenda/decodificar', () => {
  test('deve decodificar chave NF-e válida', async () => {
    const res = await request(app)
      .post('/nfvenda/decodificar')
      .send({ chave: CHAVE_TESTE });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('estado');
    expect(res.body.data).toHaveProperty('cnpjFormatado');
    expect(res.body.data.estadoSigla).toBe('SP');
    expect(res.body.data.modelo).toBe('55');
  });

  test('deve retornar erro para chave sem 44 dígitos', async () => {
    const res = await request(app)
      .post('/nfvenda/decodificar')
      .send({ chave: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('deve retornar erro quando chave não é enviada', async () => {
    const res = await request(app)
      .post('/nfvenda/decodificar')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /nfvenda/calcular', () => {
  test('deve calcular impostos NF venda corretamente', async () => {
    const res = await request(app)
      .post('/nfvenda/calcular')
      .send({ chave: CHAVE_TESTE, valorProduto: 1000, ipi: 5, regime: 'lucroReal' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const d = res.body.data;
    expect(d).toHaveProperty('impostos');
    expect(d.impostos.icms.valor).toBeCloseTo(180, 1);
    expect(d.impostos.ipi.valor).toBeCloseTo(50, 1);
    expect(d.impostos.pis.valor).toBeCloseTo(16.5, 1);
    expect(d.impostos.cofins.valor).toBeCloseTo(76, 1);
    expect(d.totalImpostos).toBeCloseTo(322.5, 1);
  });

  test('deve calcular impostos com regime Simples Nacional (PIS/COFINS zerados)', async () => {
    const res = await request(app)
      .post('/nfvenda/calcular')
      .send({ chave: CHAVE_TESTE, valorProduto: 500, ipi: 0, regime: 'simplesNacional' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.impostos.pis.valor).toBe(0);
    expect(res.body.data.impostos.cofins.valor).toBe(0);
  });

  test('deve retornar erro para valor do produto inválido', async () => {
    const res = await request(app)
      .post('/nfvenda/calcular')
      .send({ chave: CHAVE_TESTE, valorProduto: -100 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('deve retornar erro para chave inválida', async () => {
    const res = await request(app)
      .post('/nfvenda/calcular')
      .send({ chave: 'invalida', valorProduto: 1000 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
