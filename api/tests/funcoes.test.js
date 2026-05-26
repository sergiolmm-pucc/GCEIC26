const { calcularMarkup } = require('../src/equipe-16/funcoes');

describe('Calculo de MarkUp', () => {
  test('deve calcular o preco de venda com dados validos', () => {
    const resultado = calcularMarkup({
      custoProduto: 100,
      despesasFixas: 10,
      despesasVariaveis: 5,
      impostos: 12,
      margemLucro: 20,
    });

    expect(resultado.precoVenda).toBe('188.68');
    expect(resultado.custoProduto).toBe('100.00');
    expect(resultado.percentualTotal).toBe(0.47);
  });

  test('deve rejeitar custo do produto invalido', () => {
    expect(() => calcularMarkup({
      custoProduto: 0,
      despesasFixas: 10,
      despesasVariaveis: 5,
      impostos: 12,
      margemLucro: 20,
    })).toThrow('Custo do produto deve ser maior que zero');
  });

  test('deve rejeitar percentual negativo', () => {
    expect(() => calcularMarkup({
      custoProduto: 100,
      despesasFixas: -1,
      despesasVariaveis: 5,
      impostos: 12,
      margemLucro: 20,
    })).toThrow('Campo despesasFixas nao pode ser negativo');
  });

  test('deve rejeitar soma de percentuais maior ou igual a 100%', () => {
    expect(() => calcularMarkup({
      custoProduto: 100,
      despesasFixas: 30,
      despesasVariaveis: 20,
      impostos: 20,
      margemLucro: 30,
    })).toThrow('A soma dos percentuais deve ser menor que 100%');
  });
});
