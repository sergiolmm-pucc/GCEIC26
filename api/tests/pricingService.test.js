import { describe, expect, it } from 'vitest';
import {
  calcularLucroMargem,
  calcularPrecoBrutoNecessario,
  calcularPrecoLiquido
} from '../src/services/pricingService.js';

describe('pricingService', () => {
  it('reproduz o valor da planilha para preco bruto com liquido 10', () => {
    const resultado = calcularPrecoBrutoNecessario({
      precoLiquido: 10,
      icmsPercentual: 0.18,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0
    });

    expect(resultado.precoBruto).toBe(13.44);
    expect(resultado.precoBrutoComIpi).toBe(13.44);
  });

  it('reproduz o valor da planilha de compras para liquido 15', () => {
    const resultado = calcularPrecoBrutoNecessario({
      precoLiquido: 15,
      icmsPercentual: 0.18,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0
    });

    expect(resultado.precoBruto).toBe(20.16);
  });

  it('calcula preco bruto com cenario interestadual de ICMS 7%', () => {
    const resultado = calcularPrecoBrutoNecessario({
      precoLiquido: 10,
      icmsPercentual: 0.07,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0
    });

    expect(resultado.precoBruto).toBe(11.85);
  });

  it('faz round-trip de preco bruto para preco liquido no cenario base', () => {
    const bruto = calcularPrecoBrutoNecessario({
      precoLiquido: 10,
      icmsPercentual: 0.18,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0
    });
    const liquido = calcularPrecoLiquido({
      precoBruto: bruto.precoBruto,
      icmsPercentual: 0.18,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0
    });

    expect(liquido.precoLiquido).toBe(10);
  });

  it('faz round-trip com ICMS 12% e IPI 5%', () => {
    const bruto = calcularPrecoBrutoNecessario({
      precoLiquido: 25,
      icmsPercentual: 0.12,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0.05
    });
    const liquido = calcularPrecoLiquido({
      precoBruto: bruto.precoBruto,
      icmsPercentual: 0.12,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0.05
    });

    expect(bruto.precoBrutoComIpi).toBe(32.87);
    expect(liquido.precoLiquido).toBe(25);
  });

  it('faz round-trip com regime cumulativo e ICMS 7%', () => {
    const bruto = calcularPrecoBrutoNecessario({
      precoLiquido: 8.5,
      icmsPercentual: 0.07,
      pisPercentual: 0.0065,
      cofinsPercentual: 0.03,
      ipiPercentual: 0
    });
    const liquido = calcularPrecoLiquido({
      precoBruto: bruto.precoBruto,
      icmsPercentual: 0.07,
      pisPercentual: 0.0065,
      cofinsPercentual: 0.03,
      ipiPercentual: 0
    });

    expect(bruto.precoBruto).toBe(9.49);
    expect(liquido.precoLiquido).toBe(8.5);
  });

  it('calcula lucro, margem e markup com a nova formula tributaria', () => {
    const resultado = calcularLucroMargem({
      precoVenda: 120,
      custoUnitario: 70,
      quantidade: 1,
      icmsPercentual: 0.18,
      pisPercentual: 0.0165,
      cofinsPercentual: 0.076,
      ipiPercentual: 0
    });

    expect(resultado.totalLiquido).toBe(89.3);
    expect(resultado.lucro).toBe(19.3);
    expect(resultado.margemPercentual).toBe(21.61);
    expect(resultado.markupPercentual).toBe(27.57);
  });

  it('retorna erro 400 quando a carga tributaria inviabiliza o calculo', () => {
    expect(() =>
      calcularPrecoBrutoNecessario({
        precoLiquido: 10,
        icmsPercentual: 0.9,
        pisPercentual: 0.5,
        cofinsPercentual: 0.5,
        ipiPercentual: 0
      })
    ).toThrow(/carga tributaria/i);
  });
});
