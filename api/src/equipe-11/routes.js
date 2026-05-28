const express = require('express');
const {
  AUTH_TOKEN,
  DEFAULT_USER,
  calculateField,
  calculateMaintenance,
  calculateRevenue,
} = require('./funcoes');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    return res.json({ token: AUTH_TOKEN, username });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (token === AUTH_TOKEN) {
    return next();
  }

  return res.status(401).json({ error: 'Não autorizado' });
}

router.post('/calculate', checkAuth, (req, res) => {
  const {
    length,
    width,
    grassType = 'natural',
    drainage = 'standard',
    baseType = 'standard',
  } = req.body;

  const numericLength = Number(length);
  const numericWidth = Number(width);

  if (
    Number.isNaN(numericLength) || numericLength <= 0 ||
    Number.isNaN(numericWidth) || numericWidth <= 0
  ) {
    return res.status(400).json({ error: 'Valores inválidos para cálculo. Verifique comprimento e largura.' });
  }

  try {
    const result = calculateField({
      length: numericLength,
      width: numericWidth,
      grassType,
      drainage,
      baseType,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/maintenance', checkAuth, (req, res) => {
  const {
    waterCost = 0,
    electricityCost = 0,
    repairCost = 0,
    usesPerYear = 0,
    cleaningCost = 0,
  } = req.body;

  const numericWater = Number(waterCost);
  const numericElectricity = Number(electricityCost);
  const numericRepair = Number(repairCost);
  const numericUses = Number(usesPerYear);
  const numericCleaning = Number(cleaningCost);

  if (
    Number.isNaN(numericWater) || numericWater < 0 ||
    Number.isNaN(numericElectricity) || numericElectricity < 0 ||
    Number.isNaN(numericRepair) || numericRepair < 0 ||
    Number.isNaN(numericUses) || numericUses < 0 ||
    Number.isNaN(numericCleaning) || numericCleaning < 0
  ) {
    return res.status(400).json({ error: 'Valores invalidos para manutencao.' });
  }

  try {
    const result = calculateMaintenance({
      waterCost: numericWater,
      electricityCost: numericElectricity,
      repairCost: numericRepair,
      usesPerYear: numericUses,
      cleaningCost: numericCleaning,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/revenue', checkAuth, (req, res) => {
  const {
    ticketPrice = 0,
    averageAttendance = 0,
    eventsPerYear = 0,
    rentalFees = 0,
  } = req.body;

  const numericTicketPrice = Number(ticketPrice);
  const numericAverageAttendance = Number(averageAttendance);
  const numericEventsPerYear = Number(eventsPerYear);
  const numericRentalFees = Number(rentalFees);

  if (
    Number.isNaN(numericTicketPrice) || numericTicketPrice < 0 ||
    Number.isNaN(numericAverageAttendance) || numericAverageAttendance < 0 ||
    Number.isNaN(numericEventsPerYear) || numericEventsPerYear < 0 ||
    Number.isNaN(numericRentalFees) || numericRentalFees < 0
  ) {
    return res.status(400).json({ error: 'Valores invalidos para receita.' });
  }

  try {
    const result = calculateRevenue({
      ticketPrice: numericTicketPrice,
      averageAttendance: numericAverageAttendance,
      eventsPerYear: numericEventsPerYear,
      rentalFees: numericRentalFees,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;