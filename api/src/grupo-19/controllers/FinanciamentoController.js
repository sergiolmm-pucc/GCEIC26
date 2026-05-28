const FinanciamentoSAC = require('../models/FinanciamentoSAC');
const FinanciamentoPRICE = require('../models/FinanciamentoPRICE');
const ComparadorFinanciamento = require('../models/ComparadorFinanciamento');

/**
 * Controller de Financiamento.
 * POO: Separação de responsabilidades (MVC).
 */
class FinanciamentoController {
  /**
   * Extrai e valida parâmetros comuns do body da requisição.
   */
  _extrairParams(body) {
    const valorImovel = parseFloat(body.valorImovel);
    const entrada = parseFloat(body.entrada);
    const taxaAnual = parseFloat(body.taxaAnual);
    const prazoMeses = parseInt(body.prazoMeses, 10);

    if ([valorImovel, entrada, taxaAnual, prazoMeses].some(isNaN)) {
      throw new Error('Parâmetros inválidos. Verifique os campos enviados.');
    }
    return { valorImovel, entrada, taxaAnual, prazoMeses };
  }

  calcularSAC(req, res) {
    try {
      const { valorImovel, entrada, taxaAnual, prazoMeses } = this._extrairParams(req.body);
      const financiamento = new FinanciamentoSAC(valorImovel, entrada, taxaAnual, prazoMeses);
      return res.status(200).json({ sucesso: true, dados: financiamento.resumo() });
    } catch (err) {
      return res.status(400).json({ sucesso: false, erro: err.message });
    }
  }

  calcularPRICE(req, res) {
    try {
      const { valorImovel, entrada, taxaAnual, prazoMeses } = this._extrairParams(req.body);
      const financiamento = new FinanciamentoPRICE(valorImovel, entrada, taxaAnual, prazoMeses);
      return res.status(200).json({ sucesso: true, dados: financiamento.resumo() });
    } catch (err) {
      return res.status(400).json({ sucesso: false, erro: err.message });
    }
  }

  comparar(req, res) {
    try {
      const { valorImovel, entrada, taxaAnual, prazoMeses } = this._extrairParams(req.body);
      const comparador = new ComparadorFinanciamento(valorImovel, entrada, taxaAnual, prazoMeses);
      return res.status(200).json({ sucesso: true, dados: comparador.comparar() });
    } catch (err) {
      return res.status(400).json({ sucesso: false, erro: err.message });
    }
  }

  simularCapacidade(req, res) {
    try {
      const rendaMensal = parseFloat(req.body.rendaMensal);
      const taxaAnual = parseFloat(req.body.taxaAnual);
      const prazoMeses = parseInt(req.body.prazoMeses, 10);

      if ([rendaMensal, taxaAnual, prazoMeses].some(isNaN)) {
        throw new Error('Parâmetros inválidos.');
      }
      if (rendaMensal <= 0) throw new Error('Renda mensal deve ser maior que zero.');

      // Regra: parcela não pode ultrapassar 30% da renda (recomendação do Banco Central)
      const parcelaMaxima = rendaMensal * 0.30;
      const i = taxaAnual / 100 / 12;
      const n = prazoMeses;

      // Valor máximo financiável pela PRICE com a parcela máxima
      const valorMaxPRICE = (parcelaMaxima * (Math.pow(1 + i, n) - 1)) / (i * Math.pow(1 + i, n));

      return res.status(200).json({
        sucesso: true,
        dados: {
          rendaMensal,
          parcelaMaximaRecomendada: parseFloat(parcelaMaxima.toFixed(2)),
          valorMaximoFinanciavel: parseFloat(valorMaxPRICE.toFixed(2)),
          percentualRenda: 30,
          observacao: 'Recomendação do Banco Central: parcela máxima de 30% da renda mensal bruta.',
        },
      });
    } catch (err) {
      return res.status(400).json({ sucesso: false, erro: err.message });
    }
  }
}

module.exports = new FinanciamentoController();
