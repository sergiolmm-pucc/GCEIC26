const AUTH_TOKEN = 'campo-token-2026';
const DEFAULT_USER = { username: 'admin', password: 'admin' };

function calculateField({ length, width, grassType, drainage, baseType }) {
  const area = Number((length * width).toFixed(2));
  const perimeter = Number((2 * (length + width)).toFixed(2));

  const grassFactor = grassType === 'artificial' ? 35 : 25;
  const drainageFactor = drainage === 'advanced' ? 16 : 10;
  const baseFactor = baseType === 'reinforced' ? 18 : 12;

  const fieldPreparationCost = Number((area * (grassFactor + drainageFactor + baseFactor)).toFixed(2));
  const lineMarkingCost = Number((perimeter * 5).toFixed(2));
  const constructionCost = Number((fieldPreparationCost + lineMarkingCost).toFixed(2));

  return {
    length,
    width,
    area,
    perimeter,
    grassType,
    drainage,
    baseType,
    constructionCost,
  };
}

function calculateMaintenance({ waterCost, electricityCost, repairCost, usesPerYear, cleaningCost }) {
  const monthlyMaintenanceCost = Number((
    waterCost + electricityCost + (repairCost * usesPerYear) + cleaningCost
  ).toFixed(2));

  return {
    waterCost,
    electricityCost,
    repairCost,
    usesPerYear,
    cleaningCost,
    monthlyMaintenanceCost,
  };
}

function calculateRevenue({ ticketPrice, averageAttendance, eventsPerYear, rentalFees }) {
  const annualRevenue = Number((
    (ticketPrice * averageAttendance * eventsPerYear) + rentalFees
  ).toFixed(2));

  return {
    ticketPrice,
    averageAttendance,
    eventsPerYear,
    rentalFees,
    annualRevenue,
  };
}

module.exports = {
  AUTH_TOKEN,
  DEFAULT_USER,
  calculateField,
  calculateMaintenance,
  calculateRevenue,
};