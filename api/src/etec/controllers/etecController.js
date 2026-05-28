const { ValidationError } = require('../errors/ValidationError');
const {
  ENCARGOS_EMPREGADOR_DOMESTICO,
  INSS_EMPREGADO_2026,
  IRRF_MENSAL_2026,
  REFERENCIAS_OFICIAIS,
} = require('../constants/taxTables2026');
const { calculateSalary } = require('../services/salaryService');
const { calculateVacation } = require('../services/vacationService');
const { calculateTermination } = require('../services/terminationService');
const {
  validateSalaryPayload,
  validateVacationPayload,
  validateTerminationPayload,
} = require('../validators/calculationValidators');

function getMetadata(req, res) {
  res.json({
    success: true,
    data: {
      equipe: 'ETEC',
      tema: 'Calculos estimativos de encargos trabalhistas de empregada domestica',
      aviso:
        'Projeto academico. Os calculos nao substituem eSocial, contador ou orientacao oficial.',
      endpoints: [
        'GET /ETEC',
        'GET /ETEC/tabelas',
        'POST /ETEC/salario',
        'POST /ETEC/ferias',
        'POST /ETEC/rescisao',
      ],
      referencias: REFERENCIAS_OFICIAIS,
    },
  });
}

function getTables(req, res) {
  res.json({
    success: true,
    data: {
      inssEmpregado2026: INSS_EMPREGADO_2026,
      irrfMensal2026: IRRF_MENSAL_2026,
      encargosEmpregadorDomestico: ENCARGOS_EMPREGADOR_DOMESTICO,
      referencias: REFERENCIAS_OFICIAIS,
    },
  });
}

function postSalary(req, res) {
  const payload = validateSalaryPayload(req.body);
  const data = calculateSalary(payload);
  res.status(200).json({ success: true, data });
}

function postVacation(req, res) {
  const payload = validateVacationPayload(req.body);
  const data = calculateVacation(payload);
  res.status(200).json({ success: true, data });
}

function postTermination(req, res) {
  const payload = validateTerminationPayload(req.body);
  const data = calculateTermination(payload);
  res.status(200).json({ success: true, data });
}

function validateJsonBody(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw new ValidationError('Corpo da requisicao deve ser um objeto JSON');
  }

  next();
}

module.exports = {
  getMetadata,
  getTables,
  postSalary,
  postVacation,
  postTermination,
  validateJsonBody,
};
