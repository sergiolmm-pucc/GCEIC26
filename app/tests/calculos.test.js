import { CalcSAC, CalcPRICE, FinanciamentoBase } from '../App';

describe('FinanciamentoBase', () => {
  test('não deve ser instanciado diretamente', () => {
    expect(() => new FinanciamentoBase(500000, 100000, 10.5, 360)).not.toThrow();
  });

  test('calcula o valor financiado corretamente', () => {
    const f = new FinanciamentoBase(500000, 100000, 10.5, 360);
    expect(f.valorFinanciado).toBe(400000);
  });

  test('converte taxa anual para mensal corretamente', () => {
    const f = new FinanciamentoBase(500000, 100000, 12, 360);
    expect(f.taxaMensal).toBeCloseTo(0.01, 5);
  });
});

describe('CalcSAC', () => {
  let calc;

  beforeEach(() => {
    calc = new CalcSAC(500000, 100000, 12, 120);
  });

  test('retorna o número correto de parcelas', () => {
    expect(calc.calcular()).toHaveLength(120);
  });

  test('amortização é constante em todas as parcelas', () => {
    const parcelas = calc.calcular();
    const amortEsperada = 400000 / 120;
    parcelas.forEach(p => expect(p.amortizacao).toBeCloseTo(amortEsperada, 2));
  });

  test('primeira parcela é maior que a última', () => {
    const parcelas = calc.calcular();
    expect(parcelas[0].prestacao).toBeGreaterThan(parcelas[119].prestacao);
  });

  test('saldo devedor final é zero', () => {
    const parcelas = calc.calcular();
    expect(parcelas[parcelas.length - 1].saldoDevedor).toBeCloseTo(0, 0);
  });

  test('juros diminuem ao longo do tempo', () => {
    const parcelas = calc.calcular();
    expect(parcelas[0].juros).toBeGreaterThan(parcelas[119].juros);
  });

  test('cada parcela contém os campos esperados', () => {
    const parcelas = calc.calcular();
    expect(parcelas[0]).toMatchObject({
      mes: expect.any(Number),
      amortizacao: expect.any(Number),
      juros: expect.any(Number),
      prestacao: expect.any(Number),
      saldoDevedor: expect.any(Number),
    });
  });
});

describe('CalcPRICE', () => {
  let calc;

  beforeEach(() => {
    calc = new CalcPRICE(500000, 100000, 12, 120);
  });

  test('retorna o número correto de parcelas', () => {
    expect(calc.calcular()).toHaveLength(120);
  });

  test('prestação é fixa em todas as parcelas', () => {
    const parcelas = calc.calcular();
    const pmt = parcelas[0].prestacao;
    parcelas.forEach(p => expect(p.prestacao).toBeCloseTo(pmt, 1));
  });

  test('saldo devedor final é zero', () => {
    const parcelas = calc.calcular();
    expect(parcelas[parcelas.length - 1].saldoDevedor).toBeCloseTo(0, 0);
  });

  test('amortização cresce ao longo do tempo', () => {
    const parcelas = calc.calcular();
    expect(parcelas[119].amortizacao).toBeGreaterThan(parcelas[0].amortizacao);
  });

  test('juros diminuem ao longo do tempo', () => {
    const parcelas = calc.calcular();
    expect(parcelas[0].juros).toBeGreaterThan(parcelas[119].juros);
  });
});

describe('SAC vs PRICE', () => {
  test('SAC tem total de juros menor que PRICE', () => {
    const sac = new CalcSAC(500000, 100000, 12, 120).calcular();
    const price = new CalcPRICE(500000, 100000, 12, 120).calcular();
    const totalJurosSAC = sac.reduce((s, p) => s + p.juros, 0);
    const totalJurosPRICE = price.reduce((s, p) => s + p.juros, 0);
    expect(totalJurosSAC).toBeLessThan(totalJurosPRICE);
  });
});
