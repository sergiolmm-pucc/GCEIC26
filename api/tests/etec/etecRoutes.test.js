const request = require('supertest');
const app = require('../../src/app');

describe('ETEC API routes', () => {
  test('GET /health retorna status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /ETEC retorna metadados da equipe', async () => {
    const res = await request(app).get('/ETEC');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.equipe).toBe('ETEC');
    expect(res.body.data.endpoints).toContain('POST /ETEC/salario');
  });

  test('GET /ETEC/tabelas retorna constantes oficiais usadas', async () => {
    const res = await request(app).get('/ETEC/tabelas');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('inssEmpregado2026');
    expect(res.body.data).toHaveProperty('irrfMensal2026');
    expect(res.body.data).toHaveProperty('encargosEmpregadorDomestico');
  });

  test('POST /ETEC/salario calcula folha mensal', async () => {
    const res = await request(app)
      .post('/ETEC/salario')
      .send({ salarioBruto: 1621, dependentes: 0 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      remuneracaoBruta: 1621,
      inssEmpregado: 121.58,
      irrf: 0,
      salarioLiquido: 1499.42,
      inssEmpregador: 129.68,
      fgts: 129.68,
      seguroAcidente: 12.97,
      reservaIndenizatoria: 51.87,
      custoTotalEmpregador: 1945.2,
    });
  });

  test('POST /ETEC/ferias calcula ferias de 30 dias', async () => {
    const res = await request(app)
      .post('/ETEC/ferias')
      .send({ salarioBruto: 3000, diasFerias: 30, dependentes: 0 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.valorFerias).toBe(3000);
    expect(res.body.data.tercoConstitucional).toBe(1000);
    expect(res.body.data.totalBruto).toBe(4000);
    expect(res.body.data.totalLiquido).toBeGreaterThan(0);
  });

  test('POST /ETEC/rescisao calcula rescisao sem justa causa', async () => {
    const res = await request(app).post('/ETEC/rescisao').send({
      salarioBruto: 2400,
      diasTrabalhadosMes: 15,
      mesesTrabalhadosAno: 6,
      mesesFeriasProporcionais: 6,
      feriasVencidas: false,
      avisoPrevioIndenizado: true,
      motivo: 'semJustaCausa',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      saldoSalario: 1200,
      decimoTerceiroProporcional: 1200,
      feriasProporcionaisComTerco: 1600,
      avisoPrevio: 2400,
      totalBruto: 6400,
    });
    expect(res.body.data.totalLiquidoEstimado).toBeLessThan(6400);
  });

  test('POST /ETEC/salario rejeita payload invalido', async () => {
    const res = await request(app)
      .post('/ETEC/salario')
      .send({ salarioBruto: -1 });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('salarioBruto');
  });
});
