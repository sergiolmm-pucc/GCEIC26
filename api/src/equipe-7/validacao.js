function lerNumero(campo, valor) {


  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {

    const erro = new Error(
      `Campo ${campo} não pode ser nulo ou vazio.`
    );

    erro.statusCode = 400;

    throw erro;

  }



  const numero = Number(valor);



  if (!Number.isFinite(numero)) {

    const erro = new Error(
      `Campo ${campo} deve ser um numero válido.`
    );

    erro.statusCode = 400;

    throw erro;

  }



  if (numero < 0) {

    const erro = new Error(
      `Campo ${campo} deve ser maior ou igual a zero.`
    );

    erro.statusCode = 400;

    throw erro;

  }



  return numero;

}




function enviarErro(res, erro) {

  return res.status(
    erro.statusCode || 500
  ).json({

    success:false,

    error:
      erro.message ||
      'Erro inesperado no calculo.'

  });

}




module.exports = {

  lerNumero,

  enviarErro,

};