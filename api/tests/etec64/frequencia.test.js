const request = require('supertest');
const app = require('../../src/app.js');

describe('Testes de Integração - Endpoint de Cálculo de Frequência ETEC64 (/api/etec64/frequencia)', () => {
  
  test('Deve aprovar o aluno com 100% de frequência (zero faltas)', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 80,
        faltas: 0
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.frequenciaPercentual).toBe(100.0);
    expect(response.body.aprovado).toBe(true);
    expect(response.body.faltasRestantes).toBe(20); // 25% de 80 é 20 faltas permitidas
  });

  test('Deve aprovar o aluno com exatamente o limite de 75% de frequência', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 80,
        faltas: 20
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.frequenciaPercentual).toBe(75.0);
    expect(response.body.aprovado).toBe(true);
    expect(response.body.faltasRestantes).toBe(0); // Limite atingido
  });

  test('Deve reprovar o aluno abaixo de 75% de frequência', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 80,
        faltas: 21
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.frequenciaPercentual).toBe(73.75);
    expect(response.body.aprovado).toBe(false);
  });

  test('Deve retornar erro 400 se faltarem parâmetros obrigatórios', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 80
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('são obrigatórios');
  });

  test('Deve retornar erro 400 se o número de aulas previstas for menor ou igual a zero', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 0,
        faltas: 5
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('maior que zero');
  });

  test('Deve retornar erro 400 se as faltas forem negativas', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 80,
        faltas: -3
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('maior ou igual a zero');
  });

  test('Deve retornar erro 400 se as faltas forem superiores às aulas previstas', async () => {
    const response = await request(app)
      .post('/api/etec64/frequencia')
      .send({
        aulasPrevistas: 80,
        faltas: 85
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('não pode ser maior do que o total de aulas previstas');
  });
});

