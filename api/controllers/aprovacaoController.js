/**
 * Controlador de Status e Simulação de Aprovação da ETEC (Aluno C)
 * Habilidade: Cruzar médias e frequências para determinar status final (Aprovado, Recuperação, Reprovado por Faltas)
 * e simular metas de notas/presenças necessárias para aprovação.
 */

// Mapeamento de Menções ETEC para notas numéricas correspondentes
const MENCAO_VALORES = {
  'MB': 10.0,
  'B': 8.0,
  'R': 6.0,
  'I': 4.0
};

// Conversão inversa de nota para menção
const obterMencaoPorNota = (nota) => {
  if (nota >= 9.0) return 'MB';
  if (nota >= 7.0) return 'B';
  if (nota >= 6.0) return 'R';
  return 'I';
};

/**
 * Cruza notas e frequências atuais para definir o status acadêmico
 * e simular notas/faltas necessárias para aprovação se o período não tiver encerrado.
 * 
 * Endpoint: POST /api/etec64/aprovacao
 * Body Esperado:
 * {
 *   "mediaAtual": 5.5 OU "R",         // Média de notas atual (numérica ou menção ETEC)
 *   "frequenciaAtual": 78.5,          // Porcentagem de frequência atual (0 a 100)
 *   "bimestresRestantes": 1           // Bimestres restantes (0 = Período final/Exame, 1 a 3 = em andamento)
 * }
 */
export const calcularAprovacao = (req, res) => {
  try {
    const { mediaAtual, frequenciaAtual, bimestresRestantes } = req.body;

    // Validações básicas de presença de campos
    if (mediaAtual === undefined || frequenciaAtual === undefined) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Os campos "mediaAtual" e "frequenciaAtual" são obrigatórios.'
      });
    }

    // 1. Processar e Validar Média Atual (suporta decimal e menção)
    let notaNumerica = 0;
    if (typeof mediaAtual === 'string') {
      const mencaoNorm = mediaAtual.toUpperCase().trim();
      if (!MENCAO_VALORES.hasOwnProperty(mencaoNorm)) {
        return res.status(400).json({
          sucesso: false,
          erro: `Menção '${mediaAtual}' inválida. Use MB, B, R ou I.`
        });
      }
      notaNumerica = MENCAO_VALORES[mencaoNorm];
    } else {
      notaNumerica = parseFloat(mediaAtual);
      if (isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
        return res.status(400).json({
          sucesso: false,
          erro: 'A "mediaAtual" deve ser um número decimal entre 0 e 10.'
        });
      }
    }

    // 2. Validar Frequência Atual
    const frequencia = parseFloat(frequenciaAtual);
    if (isNaN(frequencia) || frequencia < 0 || frequencia > 100) {
      return res.status(400).json({
        sucesso: false,
        erro: 'A "frequenciaAtual" deve ser uma porcentagem entre 0 e 100.'
      });
    }

    // 3. Validar Bimestres Restantes
    const restam = bimestresRestantes !== undefined ? parseInt(bimestresRestantes) : 0;
    if (isNaN(restam) || restam < 0 || restam > 3) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O campo "bimestresRestantes" deve ser um número inteiro entre 0 (período encerrado) e 3.'
      });
    }

    // --- REGRAS ACADÊMICAS DA ETEC ---
    // Média de aprovação é 6.0 (Menção R) e Frequência mínima é 75%
    const frequenciaMinima = 75.0;
    const mediaMinima = 6.0;

    let status = '';
    let aprovado = false;
    let simulação = {};

    // Situação A: Período Encerrado (Avaliação Final / Exames)
    if (restam === 0) {
      if (frequencia < frequenciaMinima) {
        status = 'Reprovado por Faltas';
        aprovado = false;
        simulação = {
          mensagem: 'A reprovação por faltas na ETEC é direta. Não há direito a exame de recuperação nesta condição.'
        };
      } else if (notaNumerica >= mediaMinima) {
        status = 'Aprovado';
        aprovado = true;
        simulação = {
          mensagem: 'Parabéns! Critérios de nota e frequência atingidos com sucesso.'
        };
      } else {
        status = 'Recuperação';
        aprovado = false;
        // Na ETEC, o exame de recuperação exige uma nota que, somada com a média atual e dividida por 2, seja >= 6.0
        // (MediaAtual + NotaExame) / 2 >= 6.0 => NotaExame >= 12.0 - MediaAtual
        const notaExameNecessaria = parseFloat((12.0 - notaNumerica).toFixed(2));
        const mencaoExameNecessaria = obterMencaoPorNota(notaExameNecessaria);

        simulação = {
          notaExameNecessaria: notaExameNecessaria > 10 ? 10 : (notaExameNecessaria < 0 ? 0 : notaExameNecessaria),
          mencaoExameNecessaria: mencaoExameNecessaria,
          mensagem: `Para ser aprovado no exame de recuperação final, você precisa obter nota mínima ${notaExameNecessaria} (${mencaoExameNecessaria}).`
        };
      }
    } 
    // Situação B: Período em Andamento (Simulação de metas para bimestres restantes)
    else {
      const bimestresTrabalhados = 4 - restam;
      const totalPontosNecessarios = mediaMinima * 4; // 24 pontos totais para média 6.0 no ano
      const pontosAtuais = notaNumerica * bimestresTrabalhados;
      const pontosFaltantes = totalPontosNecessarios - pontosAtuais;

      let notaNecessariaPorBimestre = 0;
      let possivelAprovar = true;

      if (pontosFaltantes <= 0) {
        notaNecessariaPorBimestre = 0; // Já atingiu os pontos necessários
      } else {
        notaNecessariaPorBimestre = parseFloat((pontosFaltantes / restam).toFixed(2));
        if (notaNecessariaPorBimestre > 10.0) {
          possivelAprovar = false; // Matematicamente impossível passar apenas com bimestres normais, exigirá exame
        }
      }

      // Projeção de Frequência necessária
      // Para manter a média global de frequência em 75.0%
      // frequenciaFinal = (frequenciaAtual * trabalhados + frequenciaFutura * restam) / 4 >= 75
      const freqTotalNecessaria = frequenciaMinima * 4; // 300 pontos de frequência
      const freqAtualAcumulada = frequencia * bimestresTrabalhados;
      const freqNecessariaRestante = freqTotalNecessaria - freqAtualAcumulada;
      let freqNecessariaPorBimestre = parseFloat((freqNecessariaRestante / restam).toFixed(2));
      
      let possivelAprovarFreq = true;
      if (freqNecessariaPorBimestre > 100.0) {
        possivelAprovarFreq = false; // Impossível recuperar a presença necessária
      }
      if (freqNecessariaPorBimestre < 0) {
        freqNecessariaPorBimestre = 0.0;
      }

      aprovado = notaNumerica >= mediaMinima && frequencia >= frequenciaMinima;
      status = aprovado ? 'Aprovado Provisório' : 'Abaixo da Média';

      simulação = {
        pontosFaltantes: pontosFaltantes > 0 ? pontosFaltantes : 0,
        notaNecessariaPorBimestre: notaNecessariaPorBimestre > 10 ? 10 : notaNecessariaPorBimestre,
        mencaoNecessariaPorBimestre: obterMencaoPorNota(notaNecessariaPorBimestre),
        freqNecessariaPorBimestre: freqNecessariaPorBimestre,
        passivelAprovacaoPorNota: possivelAprovar,
        passivelAprovacaoPorPresenca: possivelAprovarFreq,
        mensagem: possivelAprovar && possivelAprovarFreq
          ? `Para passar sem exame, você precisa manter uma média de ${notaNecessariaPorBimestre} (${obterMencaoPorNota(notaNecessariaPorBimestre)}) nas notas e ${freqNecessariaPorBimestre}% de frequência nos ${restam} bimestre(s) restante(s).`
          : `Atenção: A média necessária para aprovação direta (${notaNecessariaPorBimestre}) ou presença (${freqNecessariaPorBimestre}%) é maior que o teto permitido. Você provavelmente precisará de exames de recuperação ou corre risco de reprovação.`
      };
    }

    return res.status(200).json({
      sucesso: true,
      mediaAnalise: notaNumerica,
      mencaoAnalise: obterMencaoPorNota(notaNumerica),
      frequenciaAnalise: frequencia,
      bimestresRestantes: restam,
      status,
      aprovado,
      simulação
    });

  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      erro: 'Ocorreu um erro interno ao realizar a simulação de aprovação: ' + error.message
    });
  }
};
