const FinanciamentoSAC = require('../../src/grupo-19/models/FinanciamentoSAC');
const FinanciamentoPRICE = require('../../src/grupo-19/models/FinanciamentoPRICE');
const ComparadorFinanciamento = require('../../src/grupo-19/models/ComparadorFinanciamento');
const Financiamento = require('../../src/grupo-19/models/Financiamento');

describe('Classe Abstrata Financiamento', () => {
  test('Não deve permitir instância direta', () => {
    expect(() => new Financiamento(500000, 100000, 10, 360)).toThrow(
      'Financiamento é uma classe abstrata'
    );
  });
});

describe('FinanciamentoSAC', () => {
  let financiamento;

  beforeEach(() => {
    financiamento = new FinanciamentoSAC(500000, 100000, 12, 120);
  });

  test('Deve calcular o valor financiado corretamente', () => {
    expect(financiamento.valorFinanciado).toBe(400000);
  });

  test('Deve retornar 120 parcelas', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas).toHaveLength(120);
  });

  test('Amortização deve ser constante', () => {
    const parcelas = financiamento.calcularParcelas();
    const amortizacaoEsperada = 400000 / 120;
    parcelas.forEach(p => {
      expect(p.amortizacao).toBeCloseTo(amortizacaoEsperada, 0);
    });
  });

  test('Primeira parcela deve ser maior que a última', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas[0].prestacao).toBeGreaterThan(parcelas[119].prestacao);
  });

  test('Saldo devedor final deve ser zero', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas[parcelas.length - 1].saldoDevedor).toBeCloseTo(0, 0);
  });

  test('Deve lançar erro para entrada maior que valor do imóvel', () => {
    expect(() => new FinanciamentoSAC(100000, 200000, 10, 120)).toThrow();
  });

  test('Deve lançar erro para taxa de juros zero', () => {
    expect(() => new FinanciamentoSAC(500000, 100000, 0, 120)).toThrow();
  });

  test('Resumo deve conter todos os campos esperados', () => {
    const resumo = financiamento.resumo();
    expect(resumo).toHaveProperty('totalPago');
    expect(resumo).toHaveProperty('totalJuros');
    expect(resumo).toHaveProperty('parcelas');
    expect(resumo.tipo).toBe('FinanciamentoSAC');
  });
});

describe('FinanciamentoPRICE', () => {
  let financiamento;

  beforeEach(() => {
    financiamento = new FinanciamentoPRICE(500000, 100000, 12, 120);
  });

  test('Todas as parcelas devem ter o mesmo valor (prestação fixa)', () => {
    const parcelas = financiamento.calcularParcelas();
    const primeiraParcelaValor = parcelas[0].prestacao;
    parcelas.forEach(p => {
      expect(p.prestacao).toBeCloseTo(primeiraParcelaValor, 1);
    });
  });

  test('Deve retornar 120 parcelas', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas).toHaveLength(120);
  });

  test('Saldo devedor final deve ser zero', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas[parcelas.length - 1].saldoDevedor).toBeCloseTo(0, 0);
  });

  test('Amortização deve crescer ao longo do tempo', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas[119].amortizacao).toBeGreaterThan(parcelas[0].amortizacao);
  });

  test('Juros devem diminuir ao longo do tempo', () => {
    const parcelas = financiamento.calcularParcelas();
    expect(parcelas[0].juros).toBeGreaterThan(parcelas[119].juros);
  });
});

describe('ComparadorFinanciamento', () => {
  let comparador;

  beforeEach(() => {
    comparador = new ComparadorFinanciamento(500000, 100000, 12, 120);
  });

  test('Deve retornar dados de SAC e PRICE', () => {
    const resultado = comparador.comparar();
    expect(resultado).toHaveProperty('sac');
    expect(resultado).toHaveProperty('price');
    expect(resultado).toHaveProperty('comparacao');
  });

  test('SAC deve ter total pago menor que PRICE', () => {
    const resultado = comparador.comparar();
    expect(resultado.comparacao.totalPagoSAC).toBeLessThan(resultado.comparacao.totalPagoPRICE);
  });

  test('Deve recomendar SAC quando mais barato', () => {
    const resultado = comparador.comparar();
    expect(resultado.comparacao.sistemaRecomendado).toBe('SAC');
  });

  test('Primeira parcela do SAC deve ser maior que do PRICE', () => {
    const resultado = comparador.comparar();
    expect(resultado.comparacao.primeiraParcelaSAC).toBeGreaterThan(
      resultado.comparacao.primeiraParcelaPRICE
    );
  });
});
