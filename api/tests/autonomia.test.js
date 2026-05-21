const request = require('supertest');
const app = require('../src/index');
const {
  calcularAutonomia,
  calcularCustoViagem,
  compararCombustivel,
} = require('../src/controllers/autonomiaController');

// TESTES UNITÁRIOS
describe('Unidade: calcularAutonomia', () => {
  test('deve calcular autonomia corretamente', () => {
    const resultado = calcularAutonomia(500, 40);
    expect(resultado.autonomia).toBe(12.5);
    expect(resultado.unidade).toBe('km/l');
    expect(resultado.classificacao).toBe('Boa');
  });

  test('deve classificar como Excelente acima de 15 km/l', () => {
    const resultado = calcularAutonomia(600, 35);
    expect(resultado.classificacao).toBe('Excelente');
  });

  test('deve classificar como Ruim abaixo de 9 km/l', () => {
    const resultado = calcularAutonomia(200, 30);
    expect(resultado.classificacao).toBe('Ruim');
  });

  test('deve lançar erro para valores ausentes', () => {
    expect(() => calcularAutonomia(null, 40)).toThrow();
  });

  test('deve lançar erro para valores negativos', () => {
    expect(() => calcularAutonomia(-100, 40)).toThrow();
  });

  test('deve lançar erro para zero', () => {
    expect(() => calcularAutonomia(0, 40)).toThrow();
  });
});

describe('Unidade: calcularCustoViagem', () => {
  test('deve calcular custo de viagem corretamente', () => {
    const resultado = calcularCustoViagem(300, 12, 6.0);
    expect(resultado.litrosNecessarios).toBe(25);
    expect(resultado.custoTotal).toBe(150);
    expect(resultado.custoPorKm).toBe(0.5);
  });

  test('deve lançar erro para campos faltando', () => {
    expect(() => calcularCustoViagem(300, null, 6.0)).toThrow();
  });

  test('deve lançar erro para valores negativos', () => {
    expect(() => calcularCustoViagem(-300, 12, 6.0)).toThrow();
  });
});

describe('Unidade: compararCombustivel', () => {
  test('deve recomendar etanol quando relação < 0.7', () => {
    const resultado = compararCombustivel(5.5, 3.5, 12, 8.5);
    expect(resultado.melhorOpcao).toBe('Etanol');
    expect(resultado.etanolCompensa).toBe(true);
  });

  test('deve recomendar gasolina quando relação >= 0.7', () => {
    const resultado = compararCombustivel(5.5, 4.5, 12, 8.5);
    expect(resultado.melhorOpcao).toBe('Gasolina');
    expect(resultado.etanolCompensa).toBe(false);
  });

  test('deve retornar relacaoEtanol corretamente', () => {
    const resultado = compararCombustivel(6.0, 4.0, 12, 9);
    expect(resultado.relacaoEtanol).toBeCloseTo(0.6667, 3);
  });

  test('deve lançar erro para campos faltando', () => {
    expect(() => compararCombustivel(null, 3.5, 12, 8.5)).toThrow();
  });

  test('deve lançar erro para valores zero', () => {
    expect(() => compararCombustivel(0, 3.5, 12, 8.5)).toThrow();
  });
});

// TESTES DE INTEGRAÇÃO — Endpoints 
describe('Integração: POST /autonomia/calcular', () => {
  test('deve retornar 200 com dados corretos', async () => {
    const res = await request(app)
      .post('/autonomia/calcular')
      .send({ kmPercorridos: 500, litrosAbastecidos: 40 });
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.autonomia).toBe(12.5);
  });

  test('deve retornar 400 para dados inválidos', async () => {
    const res = await request(app)
      .post('/autonomia/calcular')
      .send({ kmPercorridos: -10, litrosAbastecidos: 40 });
    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });
});

describe('Integração: POST /autonomia/custo-viagem', () => {
  test('deve retornar 200 com custos calculados', async () => {
    const res = await request(app)
      .post('/autonomia/custo-viagem')
      .send({ distanciaKm: 300, autonomiaKmL: 12, precoCombustivel: 6.0 });
    expect(res.status).toBe(200);
    expect(res.body.dados.custoTotal).toBe(150);
  });

  test('deve retornar 400 para campo ausente', async () => {
    const res = await request(app)
      .post('/autonomia/custo-viagem')
      .send({ distanciaKm: 300 });
    expect(res.status).toBe(400);
  });
});

describe('Integração: POST /autonomia/comparar-combustivel', () => {
  test('deve retornar 200 com comparação correta', async () => {
    const res = await request(app)
      .post('/autonomia/comparar-combustivel')
      .send({ precoGasolina: 5.5, precoEtanol: 3.5, autonomiaGasolina: 12, autonomiaEtanol: 8.5 });
    expect(res.status).toBe(200);
    expect(res.body.dados.melhorOpcao).toBe('Etanol');
  });

  test('deve retornar 400 para dados ausentes', async () => {
    const res = await request(app)
      .post('/autonomia/comparar-combustivel')
      .send({ precoGasolina: 5.5 });
    expect(res.status).toBe(400);
  });
});
