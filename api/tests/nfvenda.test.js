const request = require('supertest');
const app = require('../src/app');
const { decodificarChaveNF, calcularImpostosNFVenda } = require('../src/equipe-17/funcoes');

const CHAVE_SP = '35260312345678000195550010000000011234567890';
const CHAVE_RJ = '33260312345678000195550010000000011234567891';

describe('decodificarChaveNF', () => {

  test('decodifica estado SP', () => {
    const info = decodificarChaveNF(CHAVE_SP);
    expect(info.estadoSigla).toBe('SP');
    expect(info.icmsPadrao).toBe(18);
    expect(info.modeloDescricao).toContain('NF-e');
  });

  test('decodifica estado RJ', () => {
    const info = decodificarChaveNF(CHAVE_RJ);
    expect(info.estadoSigla).toBe('RJ');
    expect(info.icmsPadrao).toBe(20);
  });

  test('formata CNPJ corretamente', () => {
    const info = decodificarChaveNF(CHAVE_SP);
    expect(info.cnpjFormatado).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  });

  test('lança erro para chave com menos de 44 dígitos', () => {
    expect(() => decodificarChaveNF('123')).toThrow();
  });

  test('lança erro para chave com mais de 44 dígitos', () => {
    expect(() => decodificarChaveNF('1'.repeat(45))).toThrow();
  });

  test('ignora caracteres não numéricos', () => {
    const chaveComEspacos = CHAVE_SP.replace(/(.{4})/g, '$1 ').trim();
    expect(decodificarChaveNF(chaveComEspacos).estadoSigla).toBe('SP');
  });

});

describe('calcularImpostosNFVenda', () => {

  test('calcula ICMS, IPI, PIS e COFINS no Lucro Real', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 5, regime: 'lucroReal' });
    expect(r.impostos.icms.valor).toBeCloseTo(180, 2);
    expect(r.impostos.ipi.valor).toBeCloseTo(50, 2);
    expect(r.impostos.pis.valor).toBeCloseTo(16.5, 2);
    expect(r.impostos.cofins.valor).toBeCloseTo(76, 2);
    expect(r.totalImpostos).toBeCloseTo(322.5, 2);
  });

  test('calcula carga tributária', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 0, regime: 'lucroReal' });
    expect(r.cargaTributaria).toBeCloseTo(27.25, 1);
  });

  test('Lucro Presumido usa alíquotas corretas', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, regime: 'lucroPresumido' });
    expect(r.impostos.pis.alicota).toBe(0.65);
    expect(r.impostos.cofins.alicota).toBe(3);
  });

  test('Simples Nacional zera PIS e COFINS', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, regime: 'simplesNacional' });
    expect(r.impostos.pis.valor).toBe(0);
    expect(r.impostos.cofins.valor).toBe(0);
  });

  test('aceita ICMS personalizado', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, icmsPersonalizado: 12 });
    expect(r.impostos.icms.alicota).toBe(12);
    expect(r.impostos.icms.valor).toBeCloseTo(120, 2);
  });

  test('lança erro para valor do produto zero', () => {
    expect(() => calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 0 })).toThrow();
  });

  test('lança erro para IPI negativo', () => {
    expect(() => calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 100, ipi: -1 })).toThrow();
  });

  test('lança erro sem chave', () => {
    expect(() => calcularImpostosNFVenda({ valorProduto: 100 })).toThrow();
  });

});

describe('POST /nfvenda/decodificar', () => {

  test('decodifica chave válida', async () => {
    const res = await request(app).post('/nfvenda/decodificar').send({ chave: CHAVE_SP });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.estadoSigla).toBe('SP');
  });

  test('retorna erro para chave inválida', async () => {
    const res = await request(app).post('/nfvenda/decodificar').send({ chave: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('retorna erro sem chave', async () => {
    const res = await request(app).post('/nfvenda/decodificar').send({});
    expect(res.status).toBe(400);
  });

});

describe('POST /nfvenda/calcular', () => {

  test('calcula impostos corretamente', async () => {
    const res = await request(app).post('/nfvenda/calcular').send({
      chave: CHAVE_SP, valorProduto: 1000, ipi: 5, regime: 'lucroReal',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalImpostos).toBeCloseTo(322.5, 2);
  });

  test('calcula com Simples Nacional', async () => {
    const res = await request(app).post('/nfvenda/calcular').send({
      chave: CHAVE_SP, valorProduto: 1000, regime: 'simplesNacional',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.impostos.pis.valor).toBe(0);
  });

  test('retorna erro para valor inválido', async () => {
    const res = await request(app).post('/nfvenda/calcular').send({ chave: CHAVE_SP, valorProduto: 0 });
    expect(res.status).toBe(400);
  });

  test('retorna erro para chave inválida', async () => {
    const res = await request(app).post('/nfvenda/calcular').send({ chave: '000', valorProduto: 100 });
    expect(res.status).toBe(400);
  });

});

describe('GET /nfvenda/tabelas', () => {

  test('retorna tabelas de impostos', async () => {
    const res = await request(app).get('/nfvenda/tabelas');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.estados).toBeDefined();
    expect(res.body.data.regimes).toBeDefined();
  });

});
