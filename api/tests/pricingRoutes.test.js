import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('pricingRoutes', () => {
  const app = createApp();

  it('responde health check', async () => {
    const response = await request(app).get('/PBL/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('retorna erro para valor invalido', async () => {
    const response = await request(app)
      .post('/PBL/preco-liquido')
      .send({ precoBruto: 10, icmsPercentual: 101 });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('maior que 100');
  });

  it('calcula preco liquido pela API com os novos campos tributarios', async () => {
    const response = await request(app)
      .post('/PBL/preco-liquido')
      .send({
        precoBruto: 13.44,
        quantidade: 1,
        icmsPercentual: 0.18,
        pisPercentual: 0.0165,
        cofinsPercentual: 0.076,
        ipiPercentual: 0
      });

    expect(response.status).toBe(200);
    expect(response.body.precoLiquido).toBe(10);
  });

  it('calcula preco bruto pela API com gross-up da planilha', async () => {
    const response = await request(app)
      .post('/PBL/preco-bruto')
      .send({
        precoLiquido: 10,
        quantidade: 1,
        icmsPercentual: 0.18,
        pisPercentual: 0.0165,
        cofinsPercentual: 0.076,
        ipiPercentual: 0.05
      });

    expect(response.status).toBe(200);
    expect(response.body.precoBruto).toBe(13.44);
    expect(response.body.precoBrutoComIpi).toBe(14.11);
  });

  it('calcula margem pela API com o novo preco liquido', async () => {
    const response = await request(app)
      .post('/PBL/margem')
      .send({
        precoVenda: 120,
        custoUnitario: 70,
        quantidade: 1,
        icmsPercentual: 0.18,
        pisPercentual: 0.0165,
        cofinsPercentual: 0.076,
        ipiPercentual: 0
      });

    expect(response.status).toBe(200);
    expect(response.body.lucro).toBe(19.3);
  });
});
