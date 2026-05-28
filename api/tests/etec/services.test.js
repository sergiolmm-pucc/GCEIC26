const {
  calculateInssEmpregado,
  calculateIrrf,
  calculateProgressiveTax,
} = require('../../src/etec/services/taxService');
const { calculateSalary } = require('../../src/etec/services/salaryService');
const { calculateVacation } = require('../../src/etec/services/vacationService');
const { calculateTermination } = require('../../src/etec/services/terminationService');

describe('taxService', () => {
  test('calcula imposto progressivo por faixa', () => {
    const total = calculateProgressiveTax(2000, [
      { ate: 1000, aliquota: 0.1 },
      { ate: 2000, aliquota: 0.2 },
    ]);

    expect(total).toBe(300);
  });

  test('calcula INSS do empregado domestico com teto', () => {
    expect(calculateInssEmpregado(1621)).toBe(121.58);
    expect(calculateInssEmpregado(10000)).toBe(988.09);
  });

  test('calcula IRRF pela tabela mensal simplificada', () => {
    const irrf = calculateIrrf({
      baseBruta: 5000,
      inssEmpregado: 518.82,
      dependentes: 0,
    });

    expect(irrf).toBe(332.78);
  });
});

describe('calculation services', () => {
  test('calcula salario mensal com encargos do empregador', () => {
    const result = calculateSalary({
      salarioBruto: 1621,
      dependentes: 0,
      outrosProventos: 0,
      outrosDescontos: 0,
    });

    expect(result.salarioLiquido).toBe(1499.42);
    expect(result.totalEncargosEmpregador).toBe(324.2);
  });

  test('calcula ferias proporcionais', () => {
    const result = calculateVacation({
      salarioBruto: 3000,
      diasFerias: 15,
      dependentes: 0,
    });

    expect(result.valorFerias).toBe(1500);
    expect(result.tercoConstitucional).toBe(500);
    expect(result.totalBruto).toBe(2000);
  });

  test('calcula rescisao com ferias vencidas e aviso previo', () => {
    const result = calculateTermination({
      salarioBruto: 2400,
      diasTrabalhadosMes: 15,
      mesesTrabalhadosAno: 6,
      mesesFeriasProporcionais: 6,
      feriasVencidas: true,
      avisoPrevioIndenizado: true,
      motivo: 'semJustaCausa',
    });

    expect(result.feriasVencidasComTerco).toBe(3200);
    expect(result.avisoPrevio).toBe(2400);
    expect(result.totalBruto).toBe(9600);
  });

  test('nao paga aviso previo indenizado em pedido de demissao', () => {
    const result = calculateTermination({
      salarioBruto: 2400,
      diasTrabalhadosMes: 15,
      mesesTrabalhadosAno: 6,
      mesesFeriasProporcionais: 6,
      feriasVencidas: false,
      avisoPrevioIndenizado: true,
      motivo: 'pedidoDemissao',
    });

    expect(result.avisoPrevio).toBe(0);
  });
});
