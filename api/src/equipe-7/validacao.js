function lerNumero(campo, valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    const erro = new Error(`Campo ${campo} deve ser um numero maior ou igual a zero.`);
    erro.statusCode = 400;
    throw erro;
  }

  return numero;
}

function enviarErro(res, erro) {
  return res.status(erro.statusCode || 500).json({
    success: false,
    error: erro.message || 'Erro inesperado no calculo.',
  });
}

module.exports = {
  lerNumero,
  enviarErro,
};
