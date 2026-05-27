import { describe, expect, it } from "vitest";
import { pisCofinService } from "../services/pis-service";

describe("PIS/CONFINS Service", () => {
  it("calcula PIS/CONFINS corretamente", () => {
    const result = pisCofinService({ productValue: 100 });
    expect(parseFloat(result.pisAmount)).toBeCloseTo(1.65, 1);
    expect(parseFloat(result.confinsAmount)).toBeCloseTo(7.6, 1);
  });

  it("soma correta de PIS + CONFINS", () => {
    const result = pisCofinService({ productValue: 100 });
    const expected = 1.65 + 7.6;
    expect(parseFloat(result.totalTax)).toBeCloseTo(expected, 1);
  });
});
