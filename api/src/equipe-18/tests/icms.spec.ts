import Fastify from "fastify";
import { describe, expect, it } from "vitest";

import { icmsRoutes } from "../routes/icms";
import { ICMS_RULES_BY_STATE, icmsService } from "../services/icms-service";

describe("ICMS Service", () => {
  it("calcula ICMS pela aliquota do estado", () => {
    const result = icmsService({ productValue: 100, state: "SP" });

    expect(result).toEqual({
      productValue: "100.00",
      state: "SP",
      icmsRate: "18.00%",
      icmsAmount: "18.00",
      total: "118.00",
      taxRule: {
        operationType: "internal",
        validFrom: "2026-01-01",
        sourceName:
          "Tabela simplificada de aliquotas internas de ICMS do projeto academico",
        sourceUrl: "docs/icms-rules.md",
      },
    });
  });

  it("normaliza UF informada em minusculo ou com espacos", () => {
    const result = icmsService({ productValue: 200, state: " rj " });

    expect(result.state).toBe("RJ");
    expect(result.icmsRate).toBe("22.00%");
    expect(result.icmsAmount).toBe("44.00");
  });

  it("rejeita UF inexistente", () => {
    expect(() => icmsService({ productValue: 100, state: "XX" })).toThrow(
      "state deve ser uma UF brasileira valida",
    );
  });

  it("mantem regra tributaria rastreavel para todas as UFs", () => {
    for (const taxRule of Object.values(ICMS_RULES_BY_STATE)) {
      expect(taxRule.rate).toBeGreaterThan(0);
      expect(taxRule.validFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(taxRule.operationType).toBe("internal");
      expect(taxRule.sourceName).not.toHaveLength(0);
      expect(taxRule.sourceUrl).not.toHaveLength(0);
    }
  });
});

describe("POST /icms", () => {
  it("retorna o calculo do ICMS", async () => {
    const app = Fastify();
    await app.register(icmsRoutes);

    const response = await app.inject({
      method: "POST",
      url: "/impostos/icms",
      payload: {
        productValue: 150,
        state: "SC",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      productValue: "150.00",
      state: "SC",
      icmsRate: "17.00%",
      icmsAmount: "25.50",
      total: "175.50",
      taxRule: {
        operationType: "internal",
        validFrom: "2026-01-01",
        sourceName:
          "Tabela simplificada de aliquotas internas de ICMS do projeto academico",
        sourceUrl: "docs/icms-rules.md",
      },
    });
  });

  it("retorna 400 para estado invalido", async () => {
    const app = Fastify();
    await app.register(icmsRoutes);

    const response = await app.inject({
      method: "POST",
      url: "/impostos/icms",
      payload: {
        productValue: 100,
        state: "ZZ",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "state deve ser uma UF brasileira valida",
    });
  });

  it("retorna 400 quando campos obrigatorios nao sao enviados", async () => {
    const app = Fastify();
    await app.register(icmsRoutes);

    const response = await app.inject({
      method: "POST",
      url: "/impostos/icms",
      payload: {
        state: "SP",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "body must have required property 'productValue'",
    });
  });
});
