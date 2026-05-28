const Financiamento = require('./Financiamento');

/**
 * Sistema de Amortização Constante (SAC).
 * A amortização é fixa; os juros e a prestação diminuem ao longo do tempo.
 * Herda de Financiamento (POO: Herança).
 */
class FinanciamentoSAC extends Financiamento {
  constructor(valorImovel, entrada, taxaAnual, prazoMeses) {
    super(valorImovel, entrada, taxaAnual, prazoMeses);
  }

  /**
   * Calcula todas as parcelas pelo sistema SAC.
   * @returns {Array} Array de objetos com detalhes de cada parcela
   */
  calcularParcelas() {
    const amortizacao = this.valorFinanciado / this.prazoMeses;
    const parcelas = [];
    let saldoDevedor = this.valorFinanciado;

    for (let mes = 1; mes <= this.prazoMeses; mes++) {
      const juros = saldoDevedor * this.taxaMensal;
      const prestacao = amortizacao + juros;
      saldoDevedor -= amortizacao;

      parcelas.push({
        mes,
        amortizacao: parseFloat(amortizacao.toFixed(2)),
        juros: parseFloat(juros.toFixed(2)),
        prestacao: parseFloat(prestacao.toFixed(2)),
        saldoDevedor: parseFloat(Math.max(saldoDevedor, 0).toFixed(2)),
      });
    }
    return parcelas;
  }
}

module.exports = FinanciamentoSAC;
