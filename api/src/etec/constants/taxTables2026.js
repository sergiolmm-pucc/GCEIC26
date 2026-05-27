const INSS_EMPREGADO_2026 = {
  teto: 8475.55,
  faixas: [
    { ate: 1621.0, aliquota: 0.075 },
    { ate: 2902.84, aliquota: 0.09 },
    { ate: 4354.27, aliquota: 0.12 },
    { ate: 8475.55, aliquota: 0.14 },
  ],
};

const IRRF_MENSAL_2026 = {
  deducaoPorDependente: 189.59,
  faixas: [
    { ate: 2428.8, aliquota: 0, deducao: 0 },
    { ate: 2826.65, aliquota: 0.075, deducao: 182.16 },
    { ate: 3751.05, aliquota: 0.15, deducao: 394.16 },
    { ate: 4664.68, aliquota: 0.225, deducao: 675.49 },
    { ate: Number.POSITIVE_INFINITY, aliquota: 0.275, deducao: 908.73 },
  ],
};

const ENCARGOS_EMPREGADOR_DOMESTICO = {
  inssEmpregador: 0.08,
  fgts: 0.08,
  seguroAcidente: 0.008,
  reservaIndenizatoria: 0.032,
};

const REFERENCIAS_OFICIAIS = [
  'https://www.gov.br/esocial/pt-br/empregador-domestico/perguntas-frequentes',
  'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026',
  'https://www.gov.br/inss/pt-br/assuntos/com-reajuste-de-3-9-teto-do-inss-chega-a-r-8-475-55-em-2026',
];

module.exports = {
  INSS_EMPREGADO_2026,
  IRRF_MENSAL_2026,
  ENCARGOS_EMPREGADOR_DOMESTICO,
  REFERENCIAS_OFICIAIS,
};
