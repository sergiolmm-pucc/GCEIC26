import { calculateSalary, calculateVacation, calculateTermination } from '../services/apiClient';

export const calculators = {
  salario: {
    title: 'Calculo de salario mensal',
    description: 'Estima salario liquido e custo mensal do empregador domestico.',
    action: calculateSalary,
    fields: [
      { name: 'salarioBruto', label: 'Salario bruto', type: 'number', defaultValue: 1621 },
      { name: 'dependentes', label: 'Dependentes', type: 'number', defaultValue: 0 },
      { name: 'outrosProventos', label: 'Outros proventos', type: 'number', defaultValue: 0 },
      { name: 'outrosDescontos', label: 'Outros descontos', type: 'number', defaultValue: 0 },
    ],
  },
  ferias: {
    title: 'Calculo de ferias',
    description: 'Calcula ferias com um terco constitucional e descontos estimados.',
    action: calculateVacation,
    fields: [
      { name: 'salarioBruto', label: 'Salario bruto', type: 'number', defaultValue: 1621 },
      { name: 'diasFerias', label: 'Dias de ferias', type: 'number', defaultValue: 30 },
      { name: 'dependentes', label: 'Dependentes', type: 'number', defaultValue: 0 },
    ],
  },
  rescisao: {
    title: 'Calculo de rescisao',
    description: 'Estima verbas rescisorias em cenario simplificado.',
    action: calculateTermination,
    fields: [
      { name: 'salarioBruto', label: 'Salario bruto', type: 'number', defaultValue: 1621 },
      { name: 'diasTrabalhadosMes', label: 'Dias trabalhados no mes', type: 'number', defaultValue: 15 },
      { name: 'mesesTrabalhadosAno', label: 'Meses trabalhados no ano', type: 'number', defaultValue: 6 },
      { name: 'mesesFeriasProporcionais', label: 'Meses para ferias proporcionais', type: 'number', defaultValue: 6 },
      { name: 'feriasVencidas', label: 'Ferias vencidas', type: 'checkbox', defaultValue: false },
      { name: 'avisoPrevioIndenizado', label: 'Aviso previo indenizado', type: 'checkbox', defaultValue: true },
      {
        name: 'motivo',
        label: 'Motivo',
        type: 'select',
        defaultValue: 'semJustaCausa',
        options: [
          { value: 'semJustaCausa', label: 'Sem justa causa' },
          { value: 'pedidoDemissao', label: 'Pedido de demissao' },
          { value: 'justaCausa', label: 'Justa causa' },
        ],
      },
    ],
  },
};
