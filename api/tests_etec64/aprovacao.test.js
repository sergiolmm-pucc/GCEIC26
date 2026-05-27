import request from 'supertest';
import app from '../server.js';

describe('Testes de Integração - Endpoint de Simulação de Aprovação ETEC64 (/api/etec64/aprovacao)', () => {
  
  test('Deve aprovar o aluno no final do período com notas e presenças suficientes', async () => {
    const response = await request(app)
      .post('/api/etec64/aprovacao')
      .send({
        mediaAtual: 7.5,
        frequenciaAtual: 82.0,
        bimestresRestantes: 0
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.status).toBe('Aprovado');
    expect(response.body.aprovado).toBe(true);
    expect(response.body.mencaoAnalise).toBe('B');
  });

  test('Deve colocar o aluno em Recuperação no final do período se a média for < 6.0 mas a presença for >= 75%', async () => {
    const response = await request(app)
      .post('/api/etec64/aprovacao')
      .send({
        mediaAtual: 5.0,
        frequenciaAtual: 78.0,
        bimestresRestantes: 0
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.status).toBe('Recuperação');
    expect(response.body.aprovado).toBe(false);
    expect(response.body.simulação.notaExameNecessaria).toBe(7.0); // (5 + 7) / 2 = 6
    expect(response.body.simulação.mencaoExameNecessaria).toBe('B');
  });

  test('Deve reprovar direto por faltas se a presença for < 75% no final do período, mesmo com nota alta', async () => {
    const response = await request(app)
      .post('/api/etec64/aprovacao')
      .send({
        mediaAtual: 'MB', // Equivale a 10.0
        frequenciaAtual: 72.5,
        bimestresRestantes: 0
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.status).toBe('Reprovado por Faltas');
    expect(response.body.aprovado).toBe(false);
    expect(response.body.simulação.mensagem).toContain('Não há direito a exame de recuperação');
  });

  test('Deve simular corretamente as notas necessárias no período em andamento', async () => {
    const response = await request(app)
      .post('/api/etec64/aprovacao')
      .send({
        mediaAtual: 5.0, // 3 bimestres com média 5.0 = 15 pontos acumulados
        frequenciaAtual: 80.0,
        bimestresRestantes: 1 // Resta 1 bimestre. Faltam 9 pontos para atingir 24 pontos totais.
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.status).toBe('Abaixo da Média');
    expect(response.body.simulação.notaNecessariaPorBimestre).toBe(9.0); // Precisa tirar 9.0 no último bimestre
    expect(response.body.simulação.mencaoNecessariaPorBimestre).toBe('MB');
  });

  test('Deve retornar erro 400 se faltarem parâmetros obrigatórios', async () => {
    const response = await request(app)
      .post('/api/etec64/aprovacao')
      .send({
        mediaAtual: 8.0
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('são obrigatórios');
  });

  test('Deve retornar erro 400 se a média ou a menção atual for inválida', async () => {
    const response = await request(app)
      .post('/api/etec64/aprovacao')
      .send({
        mediaAtual: 'EXCELENTE',
        frequenciaAtual: 80.0
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toContain('inválida. Use MB, B, R ou I');
  });
});
