/**
 * Classe base abstrata para todos os tipos de financiamento.
 * Princípio de POO: Abstração e Herança.
 */
class Financiamento {
  /**
   * @param {number} valorImovel - Valor total do imóvel
   * @param {number} entrada - Valor da entrada
   * @param {number} taxaAnual - Taxa de juros anual (em %)
   * @param {number} prazoMeses - Prazo em meses
   */
  constructor(valorImovel, entrada, taxaAnual, prazoMeses) {
    if (new.target === Financiamento) {
      throw new Error('Financiamento é uma classe abstrata e não pode ser instanciada diretamente.');
    }
    this._validar(valorImovel, entrada, taxaAnual, prazoMeses);
    this.valorImovel = valorImovel;
    this.entrada = entrada;
    this.valorFinanciado = valorImovel - entrada;
    this.taxaAnual = taxaAnual;
    this.taxaMensal = taxaAnual / 100 / 12;
    this.prazoMeses = prazoMeses;
  }

  _validar(valorImovel, entrada, taxaAnual, prazoMeses) {
    if (valorImovel <= 0) throw new Error('Valor do imóvel deve ser maior que zero.');
    if (entrada < 0) throw new Error('Entrada não pode ser negativa.');
    if (entrada >= valorImovel) throw new Error('Entrada deve ser menor que o valor do imóvel.');
    if (taxaAnual <= 0) throw new Error('Taxa de juros deve ser maior que zero.');
    if (prazoMeses <= 0 || !Number.isInteger(prazoMeses)) throw new Error('Prazo deve ser um número inteiro positivo.');
  }

  /** Método abstrato — deve ser implementado nas subclasses */
  calcularParcelas() {
    throw new Error('calcularParcelas() deve ser implementado pela subclasse.');
  }

  /** Resumo geral do financiamento */
  resumo() {
    const parcelas = this.calcularParcelas();
    const totalPago = parcelas.reduce((acc, p) => acc + p.prestacao, 0);
    const totalJuros = totalPago - this.valorFinanciado;
    return {
      tipo: this.constructor.name,
      valorImovel: this.valorImovel,
      entrada: this.entrada,
      valorFinanciado: this.valorFinanciado,
      taxaAnual: this.taxaAnual,
      taxaMensal: parseFloat((this.taxaMensal * 100).toFixed(6)),
      prazoMeses: this.prazoMeses,
      totalPago: parseFloat(totalPago.toFixed(2)),
      totalJuros: parseFloat(totalJuros.toFixed(2)),
      primeiraParcelaValor: parseFloat(parcelas[0].prestacao.toFixed(2)),
      ultimaParcelaValor: parseFloat(parcelas[parcelas.length - 1].prestacao.toFixed(2)),
      parcelas,
    };
  }
}

module.exports = Financiamento;
