const TABELA = {
  IMPOSTOS_REFERENCIA: { MEI: 0, SIMPLES_NACIONAL: 0.06 },
  PRODUTIVIDADE_PADRAO: 0.75, // 75% faturável por padrão
};

/**
 * PARTE 1 (Fernando Furlanetto) — Custo de Mão de Obra e Horas Disponíveis
 * Calcula o custo bruto anual/mensal da mão de obra e as horas faturáveis.
 */
function calcularMaoDeObra(dados) {
  const salarioDesejado = parseFloat(dados.salarioDesejado);
  const diasTrabalhadosSemana = (dados.diasTrabalhadosSemana !== undefined && dados.diasTrabalhadosSemana !== '') ? parseInt(dados.diasTrabalhadosSemana) : 5;
  const horasTrabalhadasDia = (dados.horasTrabalhadasDia !== undefined && dados.horasTrabalhadasDia !== '') ? parseFloat(dados.horasTrabalhadasDia) : 8;
  const semanasFeriasAno = (dados.semanasFeriasAno !== undefined && dados.semanasFeriasAno !== '') ? parseInt(dados.semanasFeriasAno) : 4;
  const percentualProdutivo = (dados.percentualProdutivo !== undefined && dados.percentualProdutivo !== '') ? parseFloat(dados.percentualProdutivo) : 75;

  if (isNaN(salarioDesejado) || salarioDesejado <= 0) {
    throw new Error('Salário desejado deve ser um número maior que zero');
  }
  if (diasTrabalhadosSemana <= 0 || diasTrabalhadosSemana > 7) {
    throw new Error('Dias trabalhados na semana deve ser entre 1 e 7');
  }
  if (horasTrabalhadasDia <= 0 || horasTrabalhadasDia > 24) {
    throw new Error('Horas trabalhadas por dia deve ser entre 1 e 24');
  }
  if (semanasFeriasAno < 0 || semanasFeriasAno > 52) {
    throw new Error('Semanas de férias no ano deve ser entre 0 e 52');
  }
  if (percentualProdutivo <= 0 || percentualProdutivo > 100) {
    throw new Error('Percentual de produtividade deve ser entre 1 e 100');
  }

  // Horas brutas em 52 semanas
  const horasBrutasAno = diasTrabalhadosSemana * horasTrabalhadasDia * 52;
  // Horas de férias (não trabalhadas)
  const horasFeriasAno = semanasFeriasAno * diasTrabalhadosSemana * horasTrabalhadasDia;
  // Horas disponíveis de fato
  const horasDisponiveisAno = Math.max(0, horasBrutasAno - horasFeriasAno);
  // Horas faturáveis de fato (aplicando produtividade)
  const horasFaturaveisAno = horasDisponiveisAno * (percentualProdutivo / 100);
  const horasFaturaveisMes = horasFaturaveisAno / 12;

  // Custo de mão de obra anual considerando 12 meses + 13º salário + 1/3 de férias
  // Custo anual = (salario * 12) + salario (13º) + (salario * 1/3) (adicional de férias)
  const custoMaoDeObraAnual = salarioDesejado * 13 + (salarioDesejado / 3) * (semanasFeriasAno / 4);
  const custoMaoDeObraMensal = custoMaoDeObraAnual / 12;

  // Valor hora base da mão de obra pura
  const valorHoraBase = custoMaoDeObraMensal / horasFaturaveisMes;

  return {
    horasBrutasAno: Math.round(horasBrutasAno),
    horasFeriasAno: Math.round(horasFeriasAno),
    horasDisponiveisAno: Math.round(horasDisponiveisAno),
    horasFaturaveisAno: Math.round(horasFaturaveisAno),
    horasFaturaveisMes: parseFloat(horasFaturaveisMes.toFixed(2)),
    custoMaoDeObraAnual: parseFloat(custoMaoDeObraAnual.toFixed(2)),
    custoMaoDeObraMensal: parseFloat(custoMaoDeObraMensal.toFixed(2)),
    valorHoraBase: parseFloat(valorHoraBase.toFixed(2))
  };
}

/**
 * PARTE 2 (Matheus Augusto) — Custos Operacionais e Despesas (Overhead)
 * Calcula as despesas operacionais totais e o custo operacional por hora.
 */
function calcularCustosOperacionais(dados) {
  const despesasFixasMensais = parseFloat(dados.despesasFixasMensais) || 0;
  const reservaSeguranca = parseFloat(dados.reservaSeguranca) || 0;
  const valorHoraBase = parseFloat(dados.valorHoraBase);
  const horasFaturaveisMes = parseFloat(dados.horasFaturaveisMes);

  if (isNaN(despesasFixasMensais) || despesasFixasMensais < 0) {
    throw new Error('Despesas fixas mensais não podem ser negativas');
  }
  if (isNaN(reservaSeguranca) || reservaSeguranca < 0) {
    throw new Error('Reserva de segurança não pode ser negativa');
  }
  if (isNaN(valorHoraBase) || valorHoraBase <= 0) {
    throw new Error('Valor hora base de mão de obra inválido');
  }
  if (isNaN(horasFaturaveisMes) || horasFaturaveisMes <= 0) {
    throw new Error('Horas faturáveis por mês inválidas');
  }

  const despesaMensalTotal = despesasFixasMensais + reservaSeguranca;
  const custoOperacionalHora = despesaMensalTotal / horasFaturaveisMes;
  const custoHoraEquilibrio = valorHoraBase + custoOperacionalHora;

  return {
    despesaMensalTotal: parseFloat(despesaMensalTotal.toFixed(2)),
    custoOperacionalHora: parseFloat(custoOperacionalHora.toFixed(2)),
    custoHoraEquilibrio: parseFloat(custoHoraEquilibrio.toFixed(2))
  };
}

/**
 * PARTE 3 (Raul Antonio) — Margem de Lucro e Precificação Final
 * Aplica margem de lucro e embutimento de impostos "por dentro" para chegar ao preço final.
 */
function calcularPrecoFinal(dados) {
  const custoHoraEquilibrio = parseFloat(dados.custoHoraEquilibrio);
  const horasFaturaveisMes = parseFloat(dados.horasFaturaveisMes);
  const margemLucroDesejada = parseFloat(dados.margemLucroDesejada) || 0;
  const percentualImpostos = parseFloat(dados.percentualImpostos) || 0;
  const custoMaoDeObraMensal = parseFloat(dados.custoMaoDeObraMensal);
  const despesaMensalTotal = parseFloat(dados.despesaMensalTotal);

  if (isNaN(custoHoraEquilibrio) || custoHoraEquilibrio <= 0) {
    throw new Error('Custo hora de equilíbrio inválido');
  }
  if (isNaN(margemLucroDesejada) || margemLucroDesejada < 0) {
    throw new Error('Margem de lucro não pode ser negativa');
  }
  if (isNaN(percentualImpostos) || percentualImpostos < 0 || percentualImpostos >= 100) {
    throw new Error('Percentual de impostos deve ser entre 0% e 99.9%');
  }

  // Preço da hora com a margem de lucro (sem impostos)
  const precoHoraLimpo = custoHoraEquilibrio * (1 + margemLucroDesejada / 100);

  // Preço da hora final incluindo impostos "por dentro"
  // preço_final = preco_limpo / (1 - percentual_imposto)
  const precoHoraFinal = percentualImpostos === 100 ? precoHoraLimpo : precoHoraLimpo / (1 - percentualImpostos / 100);

  // Projeções mensais baseadas na hora cobrada
  const faturamentoMensalProjetado = precoHoraFinal * horasFaturaveisMes;
  const impostoMensalProjetado = faturamentoMensalProjetado * (percentualImpostos / 100);
  
  const custosMensaisTotais = custoMaoDeObraMensal + despesaMensalTotal + impostoMensalProjetado;
  const lucroMensalLiquido = faturamentoMensalProjetado - custosMensaisTotais;

  return {
    precoHoraLimpo: parseFloat(precoHoraLimpo.toFixed(2)),
    precoHoraFinal: parseFloat(precoHoraFinal.toFixed(2)),
    faturamentoMensalProjetado: parseFloat(faturamentoMensalProjetado.toFixed(2)),
    impostoMensalProjetado: parseFloat(impostoMensalProjetado.toFixed(2)),
    custosMensaisTotais: parseFloat(custosMensaisTotais.toFixed(2)),
    lucroMensalLiquido: parseFloat(lucroMensalLiquido.toFixed(2))
  };
}

/**
 * FUNÇÃO AGREGADORA (Executada ao chamar o cálculo unificado)
 */
function calcular(dados) {
  // Executa o passo 1 (Fernando Furlanetto)
  const passo1 = calcularMaoDeObra(dados);

  // Executa o passo 2 (Matheus Augusto)
  const passo2 = calcularCustosOperacionais({
    despesasFixasMensais: dados.despesasFixasMensais,
    reservaSeguranca: dados.reservaSeguranca,
    valorHoraBase: passo1.valorHoraBase,
    horasFaturaveisMes: passo1.horasFaturaveisMes
  });

  // Executa o passo 3 (Raul Antonio)
  const passo3 = calcularPrecoFinal({
    custoHoraEquilibrio: passo2.custoHoraEquilibrio,
    horasFaturaveisMes: passo1.horasFaturaveisMes,
    margemLucroDesejada: dados.margemLucroDesejada,
    percentualImpostos: dados.percentualImpostos,
    custoMaoDeObraMensal: passo1.custoMaoDeObraMensal,
    despesaMensalTotal: passo2.despesaMensalTotal
  });

  // Retorna o consolidado completo
  return {
    precoHoraFinal: passo3.precoHoraFinal, // Para compatibilidade direta
    ...passo1,
    ...passo2,
    ...passo3
  };
}

module.exports = {
  TABELA,
  calcularMaoDeObra,
  calcularCustosOperacionais,
  calcularPrecoFinal,
  calcular
};
