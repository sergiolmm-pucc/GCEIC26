const { TABELA, calcularBurgcalc } = require('../src/equipe-21/funcoes');

const payloadValido = {
  pao: 10,
  carne: 40,
  queijo: 10,
  molho: 5,
  salada: 5,
  embalagem: 8,
  custoAdicional: 2,
  quantidade: 10,
  margemLucro: 30,
};

describe('Equipe 21 - BURGCALC funcoes', () => {
  test('deve expor os campos obrigatorios do calculo', () => {
    expect(TABELA.CAMPOS_OBRIGATORIOS).toEqual([
      'pao',
      'carne',
      'queijo',
      'molho',
      'salada',
      'embalagem',
      'custoAdicional',
      'quantidade',
      'margemLucro',
    ]);
  });

  test('deve calcular custo total, custo unitario, preco sugerido e lucro por unidade', () => {
    expect(calcularBurgcalc(payloadValido)).toEqual({
      custoTotal: 80,
      custoUnitario: 8,
      precoVendaSugerido: 10.4,
      lucroEstimadoPorUnidade: 2.4,
    });
  });

  test('deve rejeitar quantidade igual ou menor que zero', () => {
    expect(() => calcularBurgcalc({ ...payloadValido, quantidade: 0 }))
      .toThrow('quantidade deve ser maior que zero');
    expect(() => calcularBurgcalc({ ...payloadValido, quantidade: -1 }))
      .toThrow('quantidade deve ser maior que zero');
  });

  test('deve rejeitar entradas invalidas', () => {
    expect(() => calcularBurgcalc({ ...payloadValido, pao: 'abc' }))
      .toThrow('pao deve ser um numero valido');
  });

  test('deve rejeitar custos negativos', () => {
    expect(() => calcularBurgcalc({ ...payloadValido, carne: -1 }))
      .toThrow('carne nao pode ser negativo');
  });

  test('deve rejeitar margem de lucro negativa', () => {
    expect(() => calcularBurgcalc({ ...payloadValido, margemLucro: -10 }))
      .toThrow('margemLucro nao pode ser negativa');
  });
});
