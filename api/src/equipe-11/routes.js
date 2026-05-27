const express = require('express');
const { calculateField } = require('./calculator');

const router = express.Router();
const AUTH_TOKEN = 'campo-token-2026';
const DEFAULT_USER = { username: 'admin', password: 'admin' };

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
    maintenanceYears = 1,
    annualCareCost = 1200
  } = req.body;

  const numericLength = Number(length);
  const numericWidth = Number(width);
  const numericYears = Number(maintenanceYears);
  const numericAnnualCare = Number(annualCareCost);

  if (
    Number.isNaN(numericLength) || numericLength <= 0 ||
    Number.isNaN(numericWidth) || numericWidth <= 0 ||
    Number.isNaN(numericYears) || numericYears < 0 ||
    Number.isNaN(numericAnnualCare) || numericAnnualCare < 0
  ) {
    return res.status(400).json({ error: 'Valores inválidos para cálculo. Verifique comprimento, largura e custos.' });
  }

  try {
    const result = calculateField({
      length: numericLength,
      width: numericWidth,
      grassType,
      drainage,
      baseType,
      maintenanceYears: numericYears,
      annualCareCost: numericAnnualCare
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
