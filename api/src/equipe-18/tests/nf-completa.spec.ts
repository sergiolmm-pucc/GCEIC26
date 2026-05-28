import { describe, expect, it } from "vitest";
import { buildApp } from "../app";
import { nfCompletaService } from "../services/nf-completa-service";

describe("NF Completa Service (Unit Tests)", () => {
  it("calcula e consolida todos os impostos com sucesso", () => {
    const result = nfCompletaService({
      productValue: 100,
      state: "SP",
      ncm: "2201.10.00",
      freightValue: 10,
      additionalExpenses: 5,
    });

    // Check basic headers
    expect(result.productValue).toBe("100.00");
    expect(result.state).toBe("SP");
    expect(result.ncm).toBe("2201.10.00");

    // Check ICMS portion
    expect(result.icms.rate).toBe("18.00%");
    expect(result.icms.amount).toBe("18.00");

    // Check IPI portion
    expect(result.ipi.rate).toBe("2.60%");
    expect(result.ipi.calculationBasis).toBe("115.00");
    expect(result.ipi.amount).toBe("2.99");

    // Check PIS/COFINS portion
    expect(result.pisCofins.pisRate).toBe("1.65%");
    expect(result.pisCofins.pisAmount).toBe("1.65");
    expect(result.pisCofins.confinsRate).toBe("7.60%");
    expect(result.pisCofins.confinsAmount).toBe("7.60");
    expect(result.pisCofins.totalTax).toBe("9.25");

    // Check overall totals
    // taxesTotal = 18.00 (ICMS) + 2.99 (IPI) + 1.65 (PIS) + 7.60 (COFINS) = 30.24
    // grandTotal = 100.00 (product) + 10.00 (freight) + 5.00 (additional) + 30.24 (taxes) = 145.24
    expect(result.totals.taxesTotal).toBe("30.24");
    expect(result.totals.grandTotal).toBe("145.24");
  });

  it("permite customizar as aliquotas de PIS/COFINS", () => {
    const result = nfCompletaService({
      productValue: 100,
      state: "SP",
      ncm: "2201.10.00",
      pisRate: 0.02,
      confinsRate: 0.08,
    });

    expect(result.pisCofins.pisRate).toBe("2.00%");
    expect(result.pisCofins.pisAmount).toBe("2.00");
    expect(result.pisCofins.confinsRate).toBe("8.00%");
    expect(result.pisCofins.confinsAmount).toBe("8.00");
  });
});

describe("POST /impostos/nf-completa (Integration Tests)", () => {
  it("retorna a resposta consolidada de todos os impostos calculados", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/nf-completa",
      payload: {
        productValue: 100,
        state: "SP",
        ncm: "2201.10.00",
        freightValue: 10,
        additionalExpenses: 5,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      productValue: "100.00",
      state: "SP",
      ncm: "2201.10.00",
      icms: {
        rate: "18.00%",
        amount: "18.00",
        taxRule: {
          operationType: "internal",
          validFrom: "2026-01-01",
          sourceName:
            "Tabela simplificada de aliquotas internas de ICMS do projeto academico",
          sourceUrl: "docs/icms-rules.md",
        },
      },
      ipi: {
        description: "Aguas minerais e aguas gaseificadas",
        freightValue: "10.00",
        additionalExpenses: "5.00",
        calculationBasis: "115.00",
        rate: "2.60%",
        amount: "2.99",
        legalSource:
          "TIPI Receita Federal: NCM 2201.10.00 possui aliquota de IPI de 2,6%",
      },
      pisCofins: {
        pisRate: "1.65%",
        pisAmount: "1.65",
        confinsRate: "7.60%",
        confinsAmount: "7.60",
        totalTax: "9.25",
      },
      totals: {
        taxesTotal: "30.24",
        grandTotal: "145.24",
      },
    });
  });

  it("retorna 400 para UF invalida", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/nf-completa",
      payload: {
        productValue: 100,
        state: "XX",
        ncm: "2201.10.00",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe(
      "state deve ser uma UF brasileira valida",
    );
  });

  it("retorna 400 para NCM nao suportado", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/nf-completa",
      payload: {
        productValue: 100,
        state: "SP",
        ncm: "9999.99.99",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe(
      "NCM nao suportado para calculo de IPI",
    );
  });

  it("retorna 400 para payload invalido (formato de campos incorretos)", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/impostos/nf-completa",
      payload: {
        productValue: -50,
        state: "SP",
        ncm: "2201.10.00",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toContain("productValue");
  });
});
