/**
 * Controlador de Frequência Acadêmica da ETEC (Aluno B)
 * Habilidade: Cálculo de porcentagem de presença e validação do limite mínimo de faltas.
 */

/**
 * Calcula a porcentagem de frequência e valida se o aluno cumpre o critério de aprovação.
 * Na ETEC, a frequência mínima exigida por lei é de 75.0%.
 * 
 * Endpoint: POST /api/etec64/frequencia
 * Body Esperado:
 * {
 *   "aulasPrevistas": 80, // Total de horas/aulas ministradas na matéria
 *   "faltas": 12         // Total de faltas acumuladas pelo aluno
 * }
 */
exports.calcularFrequencia = (req, res) => {
  try {
    const { aulasPrevistas, faltas } = req.body;

    // Validações de entrada
    if (aulasPrevistas === undefined || faltas === undefined) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Os campos "aulasPrevistas" e "faltas" são obrigatórios.'
      });
    }

    const totalAulas = parseInt(aulasPrevistas);
    const totalFaltas = parseInt(faltas);

    if (isNaN(totalAulas) || totalAulas <= 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O campo "aulasPrevistas" deve ser um número inteiro maior que zero.'
      });
    }

    if (isNaN(totalFaltas) || totalFaltas < 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O campo "faltas" deve ser um número inteiro maior ou igual a zero.'
      });
    }

    if (totalFaltas > totalAulas) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O número de faltas não pode ser maior do que o total de aulas previstas.'
      });
    }

    // Cálculos
    const presencas = totalAulas - totalFaltas;
    const frequenciaPercentual = parseFloat(((presencas / totalAulas) * 100).toFixed(2));
    
    // Frequência mínima exigida na ETEC é 75.0%
    const frequenciaMinima = 75.0;
    const aprovado = frequenciaPercentual >= frequenciaMinima;

    // Faltas máximas permitidas para aprovação (25% do total de aulas)
    const faltasPermitidas = Math.floor(totalAulas * 0.25);
    const faltasRestantes = faltasPermitidas - totalFaltas;

    return res.status(200).json({
      sucesso: true,
      detalhes: {
        aulasPrevistas: totalAulas,
        faltas: totalFaltas,
        presencas: presencas,
        faltasMaximasPermitidas: faltasPermitidas
      },
      frequenciaPercentual,
      aprovado,
      faltasRestantes: faltasRestantes >= 0 ? faltasRestantes : 0,
      mensagem: aprovado
        ? `Aprovado por frequência com ${frequenciaPercentual}% de presença (${totalFaltas}/${totalAulas} faltas).`
        : `Reprovado por frequência com apenas ${frequenciaPercentual}% de presença (${totalFaltas}/${totalAulas} faltas). Limite de faltas excedido.`
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: 'Ocorreu um erro interno ao realizar o cálculo de frequência: ' + error.message
    });
  }
};

