const FinanciamentoSAC = require('./FinanciamentoSAC');
const FinanciamentoPRICE = require('./FinanciamentoPRICE');

/**
 * Compara dois sistemas de financiamento (SAC x PRICE).
 * POO: Composição — usa instâncias das outras classes.
 */
class ComparadorFinanciamento {
  constructor(valorImovel, entrada, taxaAnual, prazoMeses) {
    this.sac = new FinanciamentoSAC(valorImovel, entrada, taxaAnual, prazoMeses);
    this.price = new FinanciamentoPRICE(valorImovel, entrada, taxaAnual, prazoMeses);
  }

  comparar() {
    const resumoSAC = this.sac.resumo();
    const resumoPRICE = this.price.resumo();
    const economiaSAC = resumoPRICE.totalPago - resumoSAC.totalPago;

    return {
      sac: resumoSAC,
      price: resumoPRICE,
      comparacao: {
        totalPagoSAC: resumoSAC.totalPago,
        totalPagoPRICE: resumoPRICE.totalPago,
        economiaSAC: parseFloat(economiaSAC.toFixed(2)),
        primeiraParcelaSAC: resumoSAC.primeiraParcelaValor,
        primeiraParcelaPRICE: resumoPRICE.primeiraParcelaValor,
        sistemaRecomendado: economiaSAC > 0 ? 'SAC' : 'PRICE',
      },
    };
  }
}

module.exports = ComparadorFinanciamento;
