/**
 * Controlador de Médias Acadêmicas da ETEC (Aluno A)
 * Habilidade: Cálculo de médias bimestrais e conversão de notas/menções.
 */

// Mapeamento de Menções ETEC para notas numéricas correspondentes
const MENCAO_VALORES = {
  'MB': 10.0,
  'B': 8.0,
  'R': 6.0,
  'I': 4.0
};

// Conversão inversa: nota numérica média para a Menção ETEC resultante
const obterMencaoPorNota = (nota) => {
  if (nota >= 9.0) return 'MB';
  if (nota >= 7.0) return 'B';
  if (nota >= 6.0) return 'R';
  return 'I';
};

/**
 * Calcula a média das notas e retorna a menção final.
 * Suporta tanto formato numérico quanto menções típicas da ETEC (MB, B, R, I).
 * 
 * Endpoint: POST /api/etec64/media
 * Body Esperado: 
 * {
 *   "notas": [8.5, 7.0, 9.0, 6.0] OU ["MB", "B", "R", "I"],
 *   "tipo": "numerica" OU "mencao" (opcional, deduzido automaticamente se não informado)
 * }
 */
exports.calcularMedia = (req, res) => {
  try {
    const { notas, tipo } = req.body;

    if (!notas || !Array.isArray(notas) || notas.length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O campo "notas" deve ser um array preenchido com notas ou menções.'
      });
    }

    let notasNumericas = [];
    let tipoDetectado = tipo || (typeof notas[0] === 'string' ? 'mencao' : 'numerica');

    // Validação e conversão das notas
    for (let i = 0; i < notas.length; i++) {
      let notaOriginal = notas[i];

      if (tipoDetectado === 'mencao') {
        if (typeof notaOriginal !== 'string') {
          return res.status(400).json({
            sucesso: false,
            erro: `Nota na posição ${i} inválida para o tipo 'mencao'. Deve ser uma string.`
          });
        }

        const mencaoNorm = notaOriginal.toUpperCase().trim();
        if (!MENCAO_VALORES.hasOwnProperty(mencaoNorm)) {
          return res.status(400).json({
            sucesso: false,
            erro: `Menção '${notaOriginal}' na posição ${i} inválida. Use apenas MB, B, R ou I.`
          });
        }
        notasNumericas.push(MENCAO_VALORES[mencaoNorm]);
      } else {
        // Tipo numérica
        const notaNum = parseFloat(notaOriginal);
        if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
          return res.status(400).json({
            sucesso: false,
            erro: `Nota '${notaOriginal}' na posição ${i} inválida. Deve ser um número entre 0 e 10.`
          });
        }
        notasNumericas.push(notaNum);
      }
    }

    // Cálculo da média aritmética
    const soma = notasNumericas.reduce((acc, curr) => acc + curr, 0);
    const media = parseFloat((soma / notasNumericas.length).toFixed(2));
    const mencaoFinal = obterMencaoPorNota(media);
    const aprovado = media >= 6.0; // Na ETEC, média >= 6 (ou menção R, B, MB) é aprovado

    return res.status(200).json({
      sucesso: true,
      detalhes: {
        tipoCalculado: tipoDetectado,
        notasProcessadas: notasNumericas,
        quantidadeNotas: notasNumericas.length
      },
      media,
      mencaoFinal,
      aprovado,
      mensagem: aprovado 
        ? `Aprovado por nota com média ${media} (${mencaoFinal})!` 
        : `Reprovado por nota com média ${media} (${mencaoFinal}). Necessária recuperação.`
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: 'Ocorreu um erro interno ao realizar o cálculo de médias: ' + error.message
    });
  }
};

