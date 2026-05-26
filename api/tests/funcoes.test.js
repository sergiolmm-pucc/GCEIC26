const app = require("../src/funcoes");

describe("Teste de unitario", () => {
  test("deve retornar calculos", async () => {
    expect(app.calcularArea(2, 3)).toBe("6.00");
    expect(() => app.calcularArea(0, 3)).toThrow();
    expect(() => app.calcularArea(3, 0)).toThrow();
    expect(() => app.calcularArea(-10, 3)).toThrow();
  });
});

describe("Teste unitario do calculo de MarkUp", () => {
  test("deve calcular corretamente o preco de venda", () => {
    const resultado = app.calcularMarkup({
      custoProduto: 50,
      despesas: 20,
      lucroDesejado: 30,
    });

    expect(resultado.markup).toBe(2);
    expect(resultado.precoVenda).toBe(100);
    expect(resultado.valorDespesas).toBe(20);
    expect(resultado.valorLucro).toBe(30);
  });

  test("deve retornar erro quando os valores forem invalidos", () => {
    expect(() =>
      app.calcularMarkup({
        custoProduto: 50,
        despesas: 70,
        lucroDesejado: 40,
      })
    ).toThrow();
  });

  test("deve retornar erro quando faltar algum campo", () => {
    expect(() =>
      app.calcularMarkup({
        custoProduto: 50,
        despesas: 20,
      })
    ).toThrow();
  });
});