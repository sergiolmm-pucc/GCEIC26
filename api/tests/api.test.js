const request = require('supertest');
const express = require('express');

// Importando as rotas
const volumeRoutes = require('../routes/volume');
const materiaisRoutes = require('../routes/materiais');
const custosRoutes = require('../routes/custos');

const app = express();
app.use(express.json());

// Vinculando as rotas para o ambiente de teste
app.use('/PISCINA/volume', volumeRoutes);
app.use('/PISCINA/materiais', materiaisRoutes);
app.use('/PISCINA/custos', custosRoutes);

describe('Testes Unitários do Sistema de Piscina - Grupo 7', () => {
  
  // 1. Teste da API de Volume
  it('Deve calcular o volume corretamente (Ex: 2m x 4m x 2m = 16m³)', async () => {
    const res = await request(app)
      .post('/PISCINA/volume/calcular')
      .send({
        largura: 2,
        comprimento: 4,
        profundidade: 2
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.volume).toBe("16.00");
  });

  // 2. Teste da API de Materiais
  it('Deve somar corretamente os custos de materiais elétricos e hidráulicos', async () => {
    const res = await request(app)
      .post('/PISCINA/materiais/calcular')
      .send({
        precoEletrico: 150.50,
        precoHidraulico: 200.00
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.custoMateriais).toBe("350.50");
  });

  // 3. Teste da API de Custos (Água e Manutenção)
  it('Deve calcular custo de água e manutenção baseado no volume', async () => {
    const res = await request(app)
      .post('/PISCINA/custos/calcular')
      .send({
        volume: 10,       // 10m³
        precoAgua: 5.00,  // R$ 5 por m³
        precoManutencao: 2.00 // R$ 2 por m³
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.custoAgua).toBe("50.00");
    expect(res.body.custoManutencao).toBe("20.00");
  });

});