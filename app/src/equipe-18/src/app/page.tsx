import Link from "next/link";

const MODULES = [
  {
    title: "NF Completa",
    description:
      "Simulação consolidada de todos os tributos incidentes na Nota Fiscal: ICMS, IPI, PIS e COFINS integrados.",
    href: "/nf-completa",
    badge: "Consolidado",
    accent: "green",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "ICMS",
    description:
      "Cálculo individual de ICMS por estado (UF) com alíquotas internas. Suporte a todos os 27 estados.",
    href: "/icms",
    badge: "Estadual",
    accent: "emerald",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "IPI",
    description:
      "Imposto sobre Produtos Industrializados com base no código NCM e tabela TIPI da Receita Federal.",
    href: "/ipi",
    badge: "Federal",
    accent: "teal",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "PIS / COFINS",
    description:
      "Contribuições federais PIS e COFINS com suporte a regime cumulativo e não-cumulativo.",
    href: "/pis-cofins",
    badge: "Federal",
    accent: "lime",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const ACCENT_STYLES: Record<string, { iconBg: string; badgeBg: string; border: string; arrow: string }> = {
  green: {
    iconBg: "bg-green-100 text-green-700 group-hover:bg-green-500 group-hover:text-white",
    badgeBg: "bg-green-100 text-green-800 border border-green-200",
    border: "hover:border-green-400 hover:shadow-green-100/80",
    arrow: "text-green-600",
  },
  emerald: {
    iconBg: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white",
    badgeBg: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    border: "hover:border-emerald-400 hover:shadow-emerald-100/80",
    arrow: "text-emerald-600",
  },
  teal: {
    iconBg: "bg-teal-100 text-teal-700 group-hover:bg-teal-500 group-hover:text-white",
    badgeBg: "bg-teal-100 text-teal-800 border border-teal-200",
    border: "hover:border-teal-400 hover:shadow-teal-100/80",
    arrow: "text-teal-600",
  },
  lime: {
    iconBg: "bg-lime-100 text-lime-700 group-hover:bg-lime-500 group-hover:text-white",
    badgeBg: "bg-lime-100 text-lime-800 border border-lime-200",
    border: "hover:border-lime-400 hover:shadow-lime-100/80",
    arrow: "text-lime-600",
  },
};

const STATS = [
  { label: "Estados Suportados", value: "27", suffix: "UFs" },
  { label: "Tributos Integrados", value: "4", suffix: "tipos" },
  { label: "Tempo de Resposta", value: "<1s", suffix: "" },
  { label: "Precisão", value: "100%", suffix: "" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col gap-0">
      <title>Impostos NF - Dashboard de Cálculos Tributários</title>
      <meta
        name="description"
        content="Plataforma de simulação e cálculo de impostos incidentes na Nota Fiscal brasileira."
      />

      {/* Hero Section - Dark Green */}
      <section className="relative bg-green-950 text-white overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 border-[3px] border-green-700/30 rounded-full"></div>
          <div className="absolute top-24 right-24 w-48 h-48 border-[3px] border-green-600/20 rounded-full"></div>
          <div className="absolute -top-8 -right-8 w-40 h-80 bg-green-500/10 rotate-12 rounded-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl py-16 md:py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-green-500/25 mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Plataforma Acadêmica
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Simule seus{" "}
              <span className="text-green-400 underline decoration-green-500/40 decoration-4 underline-offset-4">
                Impostos
              </span>
              <br />
              de forma <span className="italic text-green-300">rápida</span> e sem burocracia.
            </h1>

            <p className="text-green-200/70 mt-5 text-base md:text-lg leading-relaxed max-w-xl">
              Com o <strong className="text-white">Impostos NF</strong>, você calcula ICMS, IPI, PIS e COFINS
              de forma integrada, na palma da sua mão.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/nf-completa"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-green-950 font-extrabold px-7 py-3.5 rounded-full shadow-lg shadow-green-500/25 hover:shadow-green-400/30 hover:scale-[1.02] transition-all text-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Simular NF Completa
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 border border-green-700/50 text-green-300 hover:bg-green-900/50 hover:text-white font-semibold px-6 py-3.5 rounded-full transition-all text-sm"
              >
                Como funciona?
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-green-900 border-t border-green-800/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-green-800/40">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-6 md:py-8 px-4 text-center">
                <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-green-300/70 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Cards Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl py-14 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-950 tracking-tight">
              Módulos de Cálculo
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              Selecione um módulo para iniciar a simulação tributária.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MODULES.map((mod) => {
              const styles = ACCENT_STYLES[mod.accent];
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  id={`module-card-${mod.href.replace("/", "")}`}
                  className={`group relative bg-white border-2 border-gray-100 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${styles.border}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl transition-all duration-200 ${styles.iconBg}`}>
                      {mod.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${styles.badgeBg}`}>
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-green-950 group-hover:text-green-800 transition-colors">
                    {mod.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* CTA */}
                  <div className={`mt-5 flex items-center gap-1.5 text-sm font-bold ${styles.arrow} opacity-70 group-hover:opacity-100 transition-all`}>
                    <span>Acessar módulo</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer quick links */}
      <section className="bg-green-50 border-t border-green-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl py-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/help"
            className="text-xs font-semibold text-green-700 hover:text-green-900 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ajuda
          </Link>
          <span className="text-green-300">·</span>
          <Link
            href="/sobre"
            className="text-xs font-semibold text-green-700 hover:text-green-900 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Sobre o Projeto
          </Link>
        </div>
      </section>
    </main>
  );
}
