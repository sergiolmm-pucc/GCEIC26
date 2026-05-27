function calculateField({ length, width, grassType, drainage, baseType, maintenanceYears, annualCareCost }) {
  const area = Number((length * width).toFixed(2));
  const perimeter = Number((2 * (length + width)).toFixed(2));

  const grassFactor = grassType === 'artificial' ? 35 : 25;
  const drainageFactor = drainage === 'advanced' ? 16 : 10;
  const baseFactor = baseType === 'reinforced' ? 18 : 12;

  const fieldPreparationCost = Number((area * (grassFactor + drainageFactor + baseFactor)).toFixed(2));
  const lineMarkingCost = Number((perimeter * 5).toFixed(2));

  const constructionCost = Number((fieldPreparationCost + lineMarkingCost).toFixed(2));
  const maintenanceCost = Number((maintenanceYears * annualCareCost).toFixed(2));
  const totalCost = Number((constructionCost + maintenanceCost).toFixed(2));

  return {
    length,
    width,
    area,
    perimeter,
    grassType,
    drainage,
    baseType,
    constructionCost,
    maintenanceCost,
    totalCost,
    maintenanceYears,
    annualCareCost
  };
}

module.exports = { calculateField };
