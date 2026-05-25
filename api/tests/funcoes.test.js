/**
 * Testes Unitários da API - Lógica Financeira de Custo de Serviços em Horas (CSH)
 * Executa testes em múltiplos cenários para garantir a precisão e robustez do sistema.
 */

const {
  calcularMaoDeObra,
  calcularCustosOperacionais,
  calcularPrecoFinal,
  calcular
} = require('../src/funcoes');

describe('CUSTO DE SERVIÇOS EM HORAS (CSH) - TESTES UNITÁRIOS', () => {

  // ==========================================================================
  // CENÁRIO 1: Freelancer Padrão (Valores normais de mercado)
  // ==========================================================================
  describe('Cenário 1: Freelancer de TI Padrão', () => {
    const dadosFreelancer = {
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

    test('Passo 1: Deve calcular mão de obra e horas faturáveis corretamente', () => {
      const res = calcularMaoDeObra(dadosFreelancer);
      
      // Horas: 5 dias/sem * 8h/dia * 52 sem = 2080h brutas/ano
      expect(res.horasBrutasAno).toBe(2080);
      // Férias: 4 semanas * 5 dias * 8h = 160h não trabalhadas
      expect(res.horasFeriasAno).toBe(160);
      // Disponíveis: 2080 - 160 = 1920h
      expect(res.horasDisponiveisAno).toBe(1920);
      // Faturáveis (75%): 1920 * 0.75 = 1440h faturáveis por ano
      expect(res.horasFaturaveisAno).toBe(1440);
      // Faturáveis por mês: 1440 / 12 = 120h/mês
      expect(res.horasFaturaveisMes).toBe(120);

      // Custo anual = (8000 * 13) + (8000 / 3) * (4 / 4) = 104000 + 2666.67 = 106666.67
      expect(res.custoMaoDeObraAnual).toBeCloseTo(106666.67, 1);
      // Custo mensal = 106666.67 / 12 = 8888.89
      expect(res.custoMaoDeObraMensal).toBeCloseTo(8888.89, 1);
      // Valor Hora Base = 8888.89 / 120 = 74.07
      expect(res.valorHoraBase).toBeCloseTo(74.07, 1);
    });

    test('Passo 2: Deve calcular rateio operacional e ponto de equilíbrio corretamente', () => {
      const res1 = calcularMaoDeObra(dadosFreelancer);
      const res2 = calcularCustosOperacionais({
        despesasFixasMensais: dadosFreelancer.despesasFixasMensais,
        reservaSeguranca: dadosFreelancer.reservaSeguranca,
        valorHoraBase: res1.valorHoraBase,
        horasFaturaveisMes: res1.horasFaturaveisMes
      });

      // Despesa total = 1500 + 500 = 2000
      expect(res2.despesaMensalTotal).toBe(2000);
      // Custo operacional/hora = 2000 / 120 = 16.67
      expect(res2.custoOperacionalHora).toBeCloseTo(16.67, 1);
      // Equilíbrio = 74.07 (mão de obra) + 16.67 (operacional) = 90.74
      expect(res2.custoHoraEquilibrio).toBeCloseTo(90.74, 1);
    });

    test('Passo 3: Deve calcular margem de lucro e preço final por dentro corretamente', () => {
      const res1 = calcularMaoDeObra(dadosFreelancer);
      const res2 = calcularCustosOperacionais({
        despesasFixasMensais: dadosFreelancer.despesasFixasMensais,
        reservaSeguranca: dadosFreelancer.reservaSeguranca,
        valorHoraBase: res1.valorHoraBase,
        horasFaturaveisMes: res1.horasFaturaveisMes
      });
      const res3 = calcularPrecoFinal({
        custoHoraEquilibrio: res2.custoHoraEquilibrio,
        horasFaturaveisMes: res1.horasFaturaveisMes,
        margemLucroDesejada: dadosFreelancer.margemLucroDesejada,
        percentualImpostos: dadosFreelancer.percentualImpostos,
        custoMaoDeObraMensal: res1.custoMaoDeObraMensal,
        despesaMensalTotal: res2.despesaMensalTotal
      });

      // Preço hora limpo (20% markup) = 90.74 * 1.2 = 108.89
      expect(res3.precoHoraLimpo).toBeCloseTo(108.89, 1);
      // Preço final (imposto 6% por dentro) = 108.89 / (1 - 0.06) = 108.89 / 0.94 = 115.84
      expect(res3.precoHoraFinal).toBeCloseTo(115.84, 1);
      // Faturamento mensal projetado (precisão interna exata) = 13900.60
      expect(res3.faturamentoMensalProjetado).toBeCloseTo(13900.60, 1);
      // Imposto mensal (precisão interna exata) = 834.04
      expect(res3.impostoMensalProjetado).toBeCloseTo(834.04, 1);
      // Custos totais = 8888.89 (mão obra) + 2000 (operac) + 834.04 (impostos) = 11722.93
      expect(res3.custosMensaisTotais).toBeCloseTo(11722.93, 1);
      // Lucro líquido = 13900.60 - 11722.93 = 2177.67
      expect(res3.lucroMensalLiquido).toBeCloseTo(2177.67, 1);
    });

    test('Agregador: Deve calcular o consolidado unificado perfeitamente', () => {
      const res = calcular(dadosFreelancer);
      
      expect(res.precoHoraFinal).toBeCloseTo(115.84, 1);
      expect(res.horasFaturaveisMes).toBe(120);
      expect(res.custoHoraEquilibrio).toBeCloseTo(90.74, 1);
      expect(res.lucroMensalLiquido).toBeCloseTo(2177.67, 1);
    });
  });

  // ==========================================================================
  // CENÁRIO 2: Consultor Part-time (Altas despesas, baixa carga horária faturável)
  // ==========================================================================
  describe('Cenário 2: Consultor Estratégico Part-time', () => {
    const dadosConsultor = {
      salarioDesejado: 15000,
      diasTrabalhadosSemana: 3, // trabalha 3 dias por semana
      horasTrabalhadasDia: 6,   // 6 horas por dia
      semanasFeriasAno: 6,      // 6 semanas de férias no ano
      percentualProdutivo: 50,  // apenas 50% das horas são faturáveis
      despesasFixasMensais: 3500, // software caro, coworking premium
      reservaSeguranca: 1500,
      margemLucroDesejada: 40,   // margem alta de consultoria
      percentualImpostos: 15     // enquadrado no Simples Anexo V
    };

    test('Deve calcular o consolidado da consultoria com valor-hora elevado', () => {
      const res = calcular(dadosConsultor);

      // Horas brutas = 3 dias * 6 horas * 52 sem = 936h
      // Férias = 6 sem * 3 dias * 6h = 108h
      // Disponíveis = 936 - 108 = 828h
      // Faturáveis (50%) = 414h por ano / 12 = 34.5 horas/mês
      expect(res.horasFaturaveisMes).toBe(34.5);

      // Valor da hora final deve ser substancialmente alto
      expect(res.precoHoraFinal).toBeGreaterThan(500);
      expect(res.lucroMensalLiquido).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // CENÁRIO 3: Autônomo MEI (Baixo custo, imposto fixo de 0% na NF)
  // ==========================================================================
  describe('Cenário 3: Autônomo MEI (Microempreendedor Individual)', () => {
    const dadosMEI = {
      salarioDesejado: 4000,
      diasTrabalhadosSemana: 5,
      horasTrabalhadasDia: 8,
      semanasFeriasAno: 2,
      percentualProdutivo: 85,
      despesasFixasMensais: 100, // apenas licença de software básica
      reservaSeguranca: 0,       // sem reserva
      margemLucroDesejada: 10,
      percentualImpostos: 0      // tributação fixa não percentual na NF
    };

    test('Deve calcular o consolidado de MEI com impostos zerados na precificação', () => {
      const res = calcular(dadosMEI);
      
      // Imposto projetado mensal deve ser exatamente zero
      expect(res.impostoMensalProjetado).toBe(0);
      // Preço final da hora deve ser igual ao preço hora limpo (já que imposto = 0%)
      expect(res.precoHoraFinal).toBe(res.precoHoraLimpo);
    });
  });

  // ==========================================================================
  // CENÁRIO 4: Validações de Erro e Casos Limite
  // ==========================================================================
  describe('Cenário 4: Validação de Parâmetros e Exceções', () => {
    
    test('Deve falhar se o salário for menor ou igual a zero', () => {
      expect(() => calcularMaoDeObra({ salarioDesejado: 0 })).toThrow();
      expect(() => calcularMaoDeObra({ salarioDesejado: -100 })).toThrow();
    });

    test('Deve falhar se dias trabalhados por semana for fora de 1-7', () => {
      expect(() => calcularMaoDeObra({ salarioDesejado: 5000, diasTrabalhadosSemana: 0 })).toThrow();
      expect(() => calcularMaoDeObra({ salarioDesejado: 5000, diasTrabalhadosSemana: 9 })).toThrow();
    });

    test('Deve falhar se horas trabalhadas por dia for fora de 1-24', () => {
      expect(() => calcularMaoDeObra({ salarioDesejado: 5000, horasTrabalhadasDia: 0 })).toThrow();
      expect(() => calcularMaoDeObra({ salarioDesejado: 5000, horasTrabalhadasDia: 25 })).toThrow();
    });

    test('Deve falhar se produtividade for fora de 1-100', () => {
      expect(() => calcularMaoDeObra({ salarioDesejado: 5000, percentualProdutivo: -5 })).toThrow();
      expect(() => calcularMaoDeObra({ salarioDesejado: 5000, percentualProdutivo: 101 })).toThrow();
    });

    test('Deve falhar se custos fixos ou reserva forem negativos', () => {
      expect(() => calcularCustosOperacionais({
        despesasFixasMensais: -100,
        reservaSeguranca: 100,
        valorHoraBase: 50,
        horasFaturaveisMes: 100
      })).toThrow();

      expect(() => calcularCustosOperacionais({
        despesasFixasMensais: 100,
        reservaSeguranca: -50,
        valorHoraBase: 50,
        horasFaturaveisMes: 100
      })).toThrow();
    });

    test('Deve falhar se alíquota de impostos for maior ou igual a 100%', () => {
      expect(() => calcularPrecoFinal({
        custoHoraEquilibrio: 100,
        horasFaturaveisMes: 100,
        margemLucroDesejada: 20,
        percentualImpostos: 100, // Impossível imposto por dentro ser >= 100%
        custoMaoDeObraMensal: 5000,
        despesaMensalTotal: 1000
      })).toThrow();
    });
  });

});