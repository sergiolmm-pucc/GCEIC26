function validarNumero(nome, valor, { obrigatorio = false, maximo } = {}) {
  if (obrigatorio && (valor === undefined || valor === null || valor === '')) {
    const error = new Error(`Campo obrigatorio ausente: ${nome}`);
    error.statusCode = 400;
    throw error;
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    const error = new Error(`Campo numerico invalido: ${nome}`);
    error.statusCode = 400;
    throw error;
  }

  if (numero < 0) {
    const error = new Error(`Campo nao pode ser negativo: ${nome}`);
    error.statusCode = 400;
    throw error;
  }

  if (typeof maximo === 'number' && numero > maximo) {
    const error = new Error(`Campo nao pode ser maior que ${maximo}: ${nome}`);
    error.statusCode = 400;
    throw error;
  }

  if (nome === 'quantidade' && numero <= 0) {
    const error = new Error('Quantidade deve ser maior que zero');
    error.statusCode = 400;
    throw error;
  }

  return numero;
}

module.exports = { validarNumero };
