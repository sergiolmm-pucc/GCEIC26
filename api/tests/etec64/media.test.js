const request = require('supertest');
const app = require('../../src/app.js');

describe('Testes de Integração - Endpoint de Cálculo de Médias ETEC64 (/api/etec64/media)', () => {
  
  test('Deve calcular corretamente a média e aprovação para notas numéricas válidas', async () => {
    const response = await request(app)
      .post('/api/etec64/media')
      .send({
        notas: [8.5, 7.0, 9.0, 6.0],
        tipo: 'numerica'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.media).toBe(7.63);
    expect(response.body.mencaoFinal).toBe('B');
    expect(response.body.aprovado).toBe(true);
  });

  test('Deve calcular corretamente a média e aprovação para menções da ETEC (MB, B, R, I)', async () => {
    const response = await request(app)
      .post('/api/etec64/media')
      .send({
        notas: ['MB', 'B', 'I'], // 10, 8, 4 -> média 7.33 (B)
        tipo: 'mencao'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.media).toBe(7.33);
    expect(response.body.mencaoFinal).toBe('B');
    expect(response.body.aprovado).toBe(true);
  });

  test('Deve deduzir o tipo de nota automaticamente caso o tipo não seja enviado', async () => {
    const response = await request(app)
      .post('/api/etec64/media')
      .send({
        notas: ['R', 'I', 'R'] // 6, 4, 6 -> média 5.33 (I)
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.media).toBe(5.33);
    expect(response.body.mencaoFinal).toBe('I');
    expect(response.body.aprovado).toBe(false);
  });

  test('Deve retornar erro 400 se o array de notas estiver vazio', async () => {
    const response = await request(app)
      .post('/api/etec64/media')
      .send({
        notas: []
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('O campo "notas" deve ser um array preenchido');
  });

  test('Deve retornar erro 400 se houver nota numérica fora do intervalo de 0 a 10', async () => {
    const response = await request(app)
      .post('/api/etec64/media')
      .send({
        notas: [8.5, 12.0, 7.0]
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('inválida. Deve ser um número entre 0 e 10');
  });

  test('Deve retornar erro 400 se houver menção inválida no array', async () => {
    const response = await request(app)
      .post('/api/etec64/media')
      .send({
        notas: ['MB', 'EXCELENTE', 'I'],
        tipo: 'mencao'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('inválida. Use apenas MB, B, R ou I');
  });
});

