const { calculateField } = require('../src/equipe-11/calculator');

describe('Unitário - calculateField (Equipe 11)', () => {

  test('calcula corretamente com valores padrão', () => {
    const resultado = calculateField({
      length: 105,
      width: 68,
      grassType: 'natural',
      drainage: 'standard',
      baseType: 'standard',
      maintenanceYears: 5,
      annualCareCost: 1200
    });

    expect(resultado.area).toBeCloseTo(7140.00, 2);
    expect(resultado.perimeter).toBeCloseTo(346.00, 2);
    expect(resultado.constructionCost).toBeGreaterThan(0);
    expect(resultado.maintenanceCost).toBe(6000.00);
    expect(resultado.totalCost).toBeCloseTo(resultado.constructionCost + 6000.00, 2);
  });

  test('calcula corretamente com grama artificial e base reforçada', () => {
    const resultado = calculateField({
      length: 90,
      width: 60,
      grassType: 'artificial',
      drainage: 'advanced',
      baseType: 'reinforced',
      maintenanceYears: 2,
      annualCareCost: 800
    });

    expect(resultado.area).toBeCloseTo(5400.00, 2);
    expect(resultado.perimeter).toBeCloseTo(300.00, 2);
    expect(resultado.maintenanceCost).toBe(1600.00);
    expect(resultado.totalCost).toBeCloseTo(resultado.constructionCost + 1600.00, 2);
  });

});
