const request = require('supertest');
const app = require('../src/app');

describe('Testes da API - Calculadora de Sauna', () => {

    // Rota de materiais
  it('Deve calcular os materiais da sauna úmida corretamente', async () => {
    const res = await request(app)
      .post('/api/SAUNA/materiais')
      .send({ largura: 2.0, comprimento: 2.0, altura: 2.5, tipo: 'umida' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('areaTotalM2', 24);
    expect(res.body).toHaveProperty('totalMateriais');
  });

  it('Deve retornar erro 400 se faltarem parâmetros no POST de materiais', async () => {
    const res = await request(app)
      .post('/api/SAUNA/materiais')
      .send({ largura: 2.0 });

    expect(res.statusCode).toEqual(400);
  });

  // Rota de equipamentos
  it('Deve calcular os equipamentos da sauna seca corretamente para volume médio', async () => {
    const res = await request(app)
      .post('/api/SAUNA/equipamentos')
      .send({ volumeM3: 15.0, tipo: 'seca' });

    expect(res.statusCode).toEqual(200);
    // Para 15m3, a regra define gerador de 12kW (que custa 3200)
    expect(res.body).toHaveProperty('potenciaGeradorKW', 12.0);
    expect(res.body).toHaveProperty('custoGerador', 3200.00);
    expect(res.body).toHaveProperty('custoAcessorios', 600.00); // Seca é mais cara
    expect(res.body).toHaveProperty('totalEquipamentos', 4150.00); // 3200 + 350 + 600
  });

  it('Deve retornar erro 400 se faltarem parâmetros em equipamentos', async () => {
    const res = await request(app)
      .post('/api/SAUNA/equipamentos')
      .send({ volumeM3: 10.0 }); // Faltando o "tipo"

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('erro');
  });

  // Rota de manutencao
  it('Deve calcular os custos de manutenção mensal corretamente', async () => {
    const res = await request(app)
      .post('/api/SAUNA/manutencao')
      .send({ potenciaGeradorKW: 9.0, horasUsoMes: 20, precoKWh: 0.95 });

    expect(res.statusCode).toEqual(200);
    // 9kW * 20h = 180kWh
    expect(res.body).toHaveProperty('consumoMensalKWh', 180.0);
    // 180kWh * R$0.95 = R$171.00
    expect(res.body).toHaveProperty('custoEnergiaMensal', 171.00);
    // 171.00 + 50.00 (taxa fixa de essências) = R$221.00
    expect(res.body).toHaveProperty('totalManutencaoMensal', 221.00);
  });

  it('Deve retornar erro 400 se faltarem parâmetros em manutenção', async () => {
    const res = await request(app)
      .post('/api/SAUNA/manutencao')
      .send({ potenciaGeradorKW: 9.0, horasUsoMes: 20 }); // Faltando o precoKWh

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('erro');
  });

});