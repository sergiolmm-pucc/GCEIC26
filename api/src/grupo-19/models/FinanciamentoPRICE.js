const Financiamento = require('./Financiamento');

/**
 * Sistema PRICE (Sistema Francês de Amortização).
 * A prestação é fixa; a amortização cresce e os juros diminuem ao longo do tempo.
 * Herda de Financiamento (POO: Herança).
 */
class FinanciamentoPRICE extends Financiamento {
  constructor(valorImovel, entrada, taxaAnual, prazoMeses) {
    super(valorImovel, entrada, taxaAnual, prazoMeses);
  }

  /**
   * Calcula a prestação fixa pela Tabela PRICE (fórmula PMT).
   * @returns {number} Valor da prestação fixa
   */
  _calcularPMT() {
    const i = this.taxaMensal;
    const n = this.prazoMeses;
    const pv = this.valorFinanciado;
    return (pv * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  }

  /**
   * Calcula todas as parcelas pelo sistema PRICE.
   * @returns {Array} Array de objetos com detalhes de cada parcela
   */
  calcularParcelas() {
    const prestacaoFixa = this._calcularPMT();
    const parcelas = [];
    let saldoDevedor = this.valorFinanciado;

    for (let mes = 1; mes <= this.prazoMeses; mes++) {
      const juros = saldoDevedor * this.taxaMensal;
      const amortizacao = prestacaoFixa - juros;
      saldoDevedor -= amortizacao;

      parcelas.push({
        mes,
        amortizacao: parseFloat(amortizacao.toFixed(2)),
        juros: parseFloat(juros.toFixed(2)),
        prestacao: parseFloat(prestacaoFixa.toFixed(2)),
        saldoDevedor: parseFloat(Math.max(saldoDevedor, 0).toFixed(2)),
      });
    }
    return parcelas;
  }
}

module.exports = FinanciamentoPRICE;
