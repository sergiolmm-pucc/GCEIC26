import { describe, expect, it } from "vitest";

import { buildApp } from "../app";
import { ipiService } from "../services/ipi-service";

describe("IPI Service", () => {
  it("calcula IPI usando aliquota da TIPI pelo NCM", () => {
    const result = ipiService({ productValue: 100, ncm: "2201.10.00" });

    expect(result.ncm).toBe("2201.10.00");
    expect(parseFloat(result.ipiAmount)).toBeCloseTo(2.6);
    expect(parseFloat(result.total)).toBeCloseTo(102.6);
    expect(result.ipiRate).toBe("2.60%");
  });

  it("inclui frete e despesas acessorias na base de calculo", () => {
    const result = ipiService({
      productValue: 100,
      freightValue: 10,
      additionalExpenses: 5,
      ncm: "2201.10.00",
    });

    expect(result.calculationBasis).toBe("115.00");
    expect(parseFloat(result.ipiAmount)).toBeCloseTo(2.99);
    expect(result.total).toBe("117.99");
  });

  it("rejeita NCM sem aliquota suportada", () => {
    expect(() => ipiService({ productValue: 100, ncm: "9999.99.99" })).toThrow(
      "NCM nao suportado para calculo de IPI",
    );
  });
});

describe("POST /ipi", () => {
  it("retorna o calculo do IPI", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/ipi",
      payload: {
        productValue: 200,
        ncm: "2201.10.00",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      ncm: "2201.10.00",
      productDescription: "Aguas minerais e aguas gaseificadas",
      productValue: "200.00",
      freightValue: "0.00",
      additionalExpenses: "0.00",
      calculationBasis: "200.00",
      ipiRate: "2.60%",
      ipiAmount: "5.20",
      total: "205.20",
      legalSource:
        "TIPI Receita Federal: NCM 2201.10.00 possui aliquota de IPI de 2,6%",
    });
  });

  it("retorna 400 para payload invalido", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/ipi",
      payload: {
        productValue: 100,
        ncm: "99999999",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: 'body/ncm must match pattern "^\\d{4}\\.\\d{2}\\.\\d{2}$"',
    });
  });

  it("retorna 400 quando campos obrigatorios nao sao enviados", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/ipi",
      payload: {
        productValue: 100,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "body must have required property 'ncm'",
    });
  });
});
