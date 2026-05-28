const { ValidationError } = require('../errors/ValidationError');

function readNumber(payload, field, options = {}) {
  const {
    required = true,
    defaultValue = undefined,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    integer = false,
  } = options;
  const rawValue = payload[field];

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    if (!required) return defaultValue;
    throw new ValidationError(`Campo ${field} e obrigatorio`);
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new ValidationError(`Campo ${field} deve ser numerico`);
  }

  if (integer && !Number.isInteger(value)) {
    throw new ValidationError(`Campo ${field} deve ser inteiro`);
  }

  if (value < min || value > max) {
    throw new ValidationError(`Campo ${field} deve estar entre ${min} e ${max}`);
  }

  return value;
}

function readBoolean(payload, field, defaultValue = false) {
  const rawValue = payload[field];

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return defaultValue;
  }

  if (typeof rawValue === 'boolean') return rawValue;

  if (rawValue === 'true') return true;
  if (rawValue === 'false') return false;

  throw new ValidationError(`Campo ${field} deve ser booleano`);
}

function readEnum(payload, field, values, defaultValue) {
  const rawValue = payload[field] || defaultValue;

  if (!values.includes(rawValue)) {
    throw new ValidationError(`Campo ${field} deve ser um destes valores: ${values.join(', ')}`);
  }

  return rawValue;
}

function validateSalaryPayload(payload) {
  return {
    salarioBruto: readNumber(payload, 'salarioBruto', { min: 1 }),
    dependentes: readNumber(payload, 'dependentes', {
      required: false,
      defaultValue: 0,
      min: 0,
      max: 20,
      integer: true,
    }),
    outrosProventos: readNumber(payload, 'outrosProventos', {
      required: false,
      defaultValue: 0,
      min: 0,
    }),
    outrosDescontos: readNumber(payload, 'outrosDescontos', {
      required: false,
      defaultValue: 0,
      min: 0,
    }),
  };
}

function validateVacationPayload(payload) {
  return {
    salarioBruto: readNumber(payload, 'salarioBruto', { min: 1 }),
    diasFerias: readNumber(payload, 'diasFerias', {
      required: false,
      defaultValue: 30,
      min: 1,
      max: 30,
      integer: true,
    }),
    dependentes: readNumber(payload, 'dependentes', {
      required: false,
      defaultValue: 0,
      min: 0,
      max: 20,
      integer: true,
    }),
  };
}

function validateTerminationPayload(payload) {
  return {
    salarioBruto: readNumber(payload, 'salarioBruto', { min: 1 }),
    diasTrabalhadosMes: readNumber(payload, 'diasTrabalhadosMes', {
      min: 0,
      max: 30,
      integer: true,
    }),
    mesesTrabalhadosAno: readNumber(payload, 'mesesTrabalhadosAno', {
      min: 0,
      max: 12,
      integer: true,
    }),
    mesesFeriasProporcionais: readNumber(payload, 'mesesFeriasProporcionais', {
      min: 0,
      max: 12,
      integer: true,
    }),
    feriasVencidas: readBoolean(payload, 'feriasVencidas', false),
    avisoPrevioIndenizado: readBoolean(payload, 'avisoPrevioIndenizado', false),
    motivo: readEnum(
      payload,
      'motivo',
      ['semJustaCausa', 'pedidoDemissao', 'justaCausa'],
      'semJustaCausa',
    ),
  };
}

module.exports = {
  validateSalaryPayload,
  validateVacationPayload,
  validateTerminationPayload,
};
