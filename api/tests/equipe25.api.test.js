/**
 * Testes de Integração da API - Servidor Express (Supertest)
 * Valida a saúde, endpoints exclusivos por aluno, rota agregadora e retrocompatibilidade de área.
 */

const request = require('supertest');
const app     = require('../src/app');

describe('CUSTO DE SERVIÇOS EM HORAS (CSH) - TESTES DE INTEGRAÇÃO API EQUIPE 25', () => {

  // GET /health
  describe('GET /health', () => {
    test('Deve retornar status HTTP 200 e status "ok"', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // GET /api/equipe-25/tabelas
  describe('GET /api/equipe-25/tabelas', () => {
    test('Deve retornar constantes financeiras e tabelas com sucesso', async () => {
      const res = await request(app).get('/api/equipe-25/tabelas');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('base'); // Retrocompatibilidade
      expect(res.body.data).toHaveProperty('referencia'); // Retrocompatibilidade
      expect(res.body.data).toHaveProperty('referenciaImpostos');
      expect(res.body.data).toHaveProperty('produtividadePadrao');
    });
  });

  // POST /api/equipe-25/csh/labor-cost (Fernando Furlanetto)
  describe('POST /api/equipe-25/csh/labor-cost (Mão de Obra)', () => {
    test('Deve calcular custo de mão de obra com sucesso', async () => {
      const payload = {
        salarioDesejado: 8000,
        diasTrabalhadosSemana: 5,
        horasTrabalhadasDia: 8,
        semanasFeriasAno: 4,
        percentualProdutivo: 75
      };

      const res = await request(app)
        .post('/api/equipe-25/csh/labor-cost')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('horasFaturaveisMes');
      expect(res.body.data).toHaveProperty('valorHoraBase');
      expect(res.body.data.horasFaturaveisMes).toBe(120);
    });

    test('Deve retornar erro 400 para parâmetros inválidos', async () => {
      const res = await request(app)
        .post('/api/equipe-25/csh/labor-cost')
        .send({ salarioDesejado: -100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });

  // POST /api/equipe-25/csh/operating-cost (Matheus Augusto)
  describe('POST /api/equipe-25/csh/operating-cost (Custos Operacionais)', () => {
    test('Deve calcular custos operacionais com sucesso', async () => {
      const payload = {
        despesasFixasMensais: 1500,
        reservaSeguranca: 500,
        valorHoraBase: 74.07,
        horasFaturaveisMes: 120
      };

      const res = await request(app)
        .post('/api/equipe-25/csh/operating-cost')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('custoHoraEquilibrio');
      expect(res.body.data.despesaMensalTotal).toBe(2000);
    });
  });

  // POST /api/equipe-25/csh/final-price (Raul Antonio)
  describe('POST /api/equipe-25/csh/final-price (Precificação Final)', () => {
    test('Deve calcular preço final e impostos com sucesso', async () => {
      const payload = {
        custoHoraEquilibrio: 90.74,
        horasFaturaveisMes: 120,
        margemLucroDesejada: 20,
        percentualImpostos: 6,
        custoMaoDeObraMensal: 8888.89,
        despesaMensalTotal: 2000
      };

      const res = await request(app)
        .post('/api/equipe-25/csh/final-price')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('precoHoraFinal');
      expect(res.body.data.precoHoraFinal).toBeCloseTo(115.84, 1);
    });
  });

  // POST /api/equipe-25/calcular (Agregador)
  describe('POST /api/equipe-25/calcular (Agregador Consolidado)', () => {
    test('Deve calcular o relatório consolidado completo de CSH', async () => {
      const payload = {
        salarioDesejado: 8000,
        diasTrabalhadosSemana: 5,
        horasTrabalhadasDia: 8,
        semanasFeriasAno: 4,
        percentualProdutivo: 75,
        despesasFixasMensais: 1500,
        reservaSeguranca: 500,
        margemLucroDesejada: 20,
        percentualImpostos: 6
      };

      const res = await request(app)
        .post('/api/equipe-25/calcular')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('precoHoraFinal');
      expect(res.body.data).toHaveProperty('horasFaturaveisMes');
      expect(res.body.data).toHaveProperty('lucroMensalLiquido');
      expect(res.body.data.precoHoraFinal).toBeCloseTo(115.84, 1);
    });

    test('Deve manter retrocompatibilidade com cálculo de área (altura/largura)', async () => {
      const payloadArea = {
        altura: 10,
        largura: 20
      };

      const res = await request(app)
        .post('/api/equipe-25/calcular')
        .send(payloadArea);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBe("200.00"); // Retorna a área formatada
    });
  });

});
