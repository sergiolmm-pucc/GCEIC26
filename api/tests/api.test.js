const request = require("supertest");
const app = require("../src/app");

describe("Teste de Saude -> GET /health", () => {
  test("deve retornar status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/tabelas", () => {
  test("deve retornar a tebela de constantes", async () => {
    const res = await request(app).get("/api/tabelas");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("base");
    expect(res.body.data).toHaveProperty("referencia");
  });
});

describe("POST /api/markup/calcular", () => {
  test("deve calcular corretamente o MarkUp", async () => {
    const res = await request(app)
      .post("/api/markup/calcular")
      .send({
        custoProduto: 50,
        despesas: 20,
        lucroDesejado: 30,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.markup).toBe(2);
    expect(res.body.data.precoVenda).toBe(100);
    expect(res.body.data.valorDespesas).toBe(20);
    expect(res.body.data.valorLucro).toBe(30);
  });

  test("deve retornar erro quando os dados forem invalidos", async () => {
    const res = await request(app)
      .post("/api/markup/calcular")
      .send({
        custoProduto: 50,
        despesas: 70,
        lucroDesejado: 40,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });
});