const request = require('supertest');
const app = require('../../src/app');

describe('API de Finanças - Endpoints (Validação)', () => {

  // Testando sucesso
  describe('POST /api/calc-financeira/juros-simples (Sucesso)', () => {
    it('deve retornar status 200 e resultado correto', async () => {
      const res = await request(app)
        .post('/api/calc-financeira/juros-simples')
        .send({ capital: 1000, taxa: 10, tempo: 1 });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual({ capital: 1000, juros: 100, montante: 1100 });
    });
  });

  // Testando validação de erro (Faltando campos)
  describe('POST /api/calc-financeira/juros-simples (Erros)', () => {
    it('deve retornar 400 se faltar campo capital', async () => {
      const res = await request(app)
        .post('/api/calc-financeira/juros-simples')
        .send({ taxa: 10, tempo: 1 }); // Sem capital
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined(); // Verifica se a mensagem de erro veio
    });

    it('deve retornar 400 para capital zero ou negativo', async () => {
      const res = await request(app)
        .post('/api/calc-financeira/juros-simples')
        .send({ capital: -100, taxa: 10, tempo: 1 });
      
      expect(res.status).toBe(400);
    });
  });
});
