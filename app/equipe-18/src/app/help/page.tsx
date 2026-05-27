import Link from "next/link";

const TAX_MODULES = [
  {
    title: "ICMS",
    subtitle: "Imposto estadual",
    href: "/icms",
    description:
      "Use quando quiser calcular o imposto estadual de uma operação interna a partir do valor do produto e da UF.",
    formula: "Valor do produto × alíquota interna da UF",
    details: ["Suporta as 27 UFs brasileiras.", "O total considera valor do produto + ICMS.", "A alíquota muda conforme o estado selecionado."],
  },
  {
    title: "IPI",
    subtitle: "Imposto federal",
    href: "/ipi",
    description:
      "Use quando quiser calcular o imposto sobre produtos industrializados considerando NCM, frete e despesas acessórias.",
    formula: "(Produto + frete + despesas) × alíquota do NCM",
    details: ["A simulação atual usa o NCM 2201.10.00.", "Frete e despesas acessórias entram na base de cálculo.", "O total considera base de cálculo + IPI."],
  },
  {
    title: "PIS/COFINS",
    subtitle: "Contribuições federais",
    href: "/pis-cofins",
    description:
      "Use para estimar as contribuições federais incidentes sobre o valor do produto ou faturamento informado.",
    formula: "Valor informado × alíquotas de PIS e COFINS",
    details: ["PIS padrão: 1,65%.", "COFINS padrão: 7,60%.", "Na NF Completa, essas alíquotas podem ser ajustadas quando necessário."],
  },
  {
    title: "NF Completa",
    subtitle: "Simulação consolidada",
    href: "/nf-completa",
    description:
      "Use para visualizar a carga tributária consolidada da nota, reunindo ICMS, IPI, PIS e COFINS no mesmo fluxo.",
    formula: "Produto + frete + despesas + todos os impostos calculados",
    details: ["Mostra resumo geral e detalhamento por tributo.", "Permite comparar a participação de cada imposto.", "É o melhor ponto de partida para uma visão completa da operação."],
  },
];

const FLOW_STEPS = [
  {
    title: "Informe os dados",
    text: "Digite valor do produto, UF, NCM, frete ou despesas conforme o módulo escolhido.",
  },
  {
    title: "Confira a validação",
    text: "Campos obrigatórios e formatos esperados são verificados antes da simulação.",
  },
  {
    title: "Analise o resultado",
    text: "A tela mostra alíquota, base de cálculo, imposto apurado e total da operação.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Qual NCM devo usar na simulação de IPI?",
    answer: "Use o NCM 2201.10.00 para a simulação disponível no projeto.",
  },
  {
    question: "Frete e despesas entram em todos os cálculos?",
    answer: "Eles entram na base de cálculo do IPI e também compõem o total geral da NF Completa.",
  },
  {
    question: "As alíquotas são oficiais em tempo real?",
    answer: "Não. O projeto usa uma tabela simplificada para fins acadêmicos e de demonstração.",
  },
  {
    question: "Quando usar a NF Completa?",
    answer: "Use quando quiser enxergar todos os tributos juntos e comparar o impacto total na operação.",
  },
];

export default function HelpPage() {
  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl">
      <title>Ajuda - Impostos NF</title>
      <meta
        name="description"
        content="Guia de uso dos módulos de cálculo tributário do Impostos NF."
      />

      <header className="relative overflow-hidden bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-green-800/40">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-green-500/15 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-green-500/25">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Central de ajuda
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4 bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent">
              Como usar o Impostos NF
            </h1>
            <p className="text-green-200/75 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
              Entenda quando usar cada módulo, quais dados informar e como interpretar os resultados das simulações tributárias.
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-green-900/60 p-3 rounded-xl border border-green-800/50 shadow-inner shrink-0 self-stretch md:self-auto justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <span className="text-xs text-green-300 font-mono font-bold tracking-wide">Guia prático</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FLOW_STEPS.map((step, index) => (
          <div key={step.title} className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
            <span className="w-9 h-9 rounded-xl bg-green-100 text-green-800 font-black flex items-center justify-center">
              {index + 1}
            </span>
            <h2 className="text-lg font-black text-green-950 mt-4">{step.title}</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden">
        <div className="border-b border-green-100/50 bg-green-50/30 px-6 py-5">
          <h2 className="font-extrabold text-green-950 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Módulos de cálculo
          </h2>
          <p className="text-xs text-slate-500 mt-1">Escolha o módulo conforme a pergunta que você quer responder.</p>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {TAX_MODULES.map((module) => (
            <article key={module.title} className="border border-green-100 rounded-2xl p-5 bg-green-50/10 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    {module.subtitle}
                  </span>
                  <h3 className="text-xl font-black text-green-950 mt-1">{module.title}</h3>
                </div>
                <Link
                  href={module.href}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md shadow-green-600/20 transition-all shrink-0"
                >
                  Abrir
                </Link>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{module.description}</p>

              <div className="bg-white border border-green-100 rounded-2xl p-4">
                <span className="text-[10px] text-green-800 font-bold uppercase tracking-wider">Fórmula base</span>
                <p className="text-sm font-black text-green-950 mt-1">{module.formula}</p>
              </div>

              <ul className="flex flex-col gap-2">
                {module.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-green-950 text-white rounded-3xl p-7 shadow-xl border border-green-900">
          <span className="text-xs text-green-300 font-bold uppercase tracking-wider">Leitura dos resultados</span>
          <h2 className="text-2xl font-black mt-3">O que observar depois do cálculo</h2>
          <p className="text-green-100/75 text-sm leading-relaxed mt-3">
            O valor do imposto não deve ser lido isoladamente. Compare sempre a alíquota, a base de cálculo e o total final para entender o peso real da operação.
          </p>
          <div className="grid grid-cols-1 gap-3 mt-6">
            <div className="bg-green-900/70 border border-green-800 rounded-2xl p-4">
              <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider">Base de cálculo</span>
              <p className="text-sm text-green-50 mt-1">Valor sobre o qual a alíquota é aplicada.</p>
            </div>
            <div className="bg-green-900/70 border border-green-800 rounded-2xl p-4">
              <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider">Alíquota</span>
              <p className="text-sm text-green-50 mt-1">Percentual usado para calcular o imposto.</p>
            </div>
            <div className="bg-green-900/70 border border-green-800 rounded-2xl p-4">
              <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider">Total</span>
              <p className="text-sm text-green-50 mt-1">Soma final após considerar impostos e valores acessórios.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden">
          <div className="border-b border-green-100/50 bg-green-50/30 px-6 py-5">
            <h2 className="font-extrabold text-green-950">Dúvidas frequentes</h2>
            <p className="text-xs text-slate-500 mt-1">Respostas rápidas para evitar interpretações erradas na simulação.</p>
          </div>
          <div className="p-6 divide-y divide-green-100">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="text-sm font-black text-green-950">{item.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
