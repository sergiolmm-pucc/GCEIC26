import React from 'react';
import Image from 'next/image';

interface ContributionArea {
  title: string;
  items: string[];
}

interface TeamMember {
  name: string;
  role: string;
  avatarSrc: string;
  areas: ContributionArea[];
  accentColor: string;
  badgeBg: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'João Gabriel (JG)',
    role: 'Front-end, Backend & DevOps Lead',
    avatarSrc: '/avatars/jg_img.jpg',
    accentColor: 'emerald',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    areas: [
      {
        title: 'Front-end & DevOps',
        items: [
          'DevOps: CI/CD (GitHub Actions), deploy na AWS e gestão do repositório',
          'Gestão: Code review, cronograma e Setup inicial do projeto',
        ],
      },
      {
        title: 'Backend',
        items: [
          'API: Estrutura base do projeto (Node.js + Fastify), rota /health e rota /nf-completa',
          'DevOps: CI/CD (GitHub Actions), deploy na AWS',
        ],
      },
    ],
  },
  {
    name: 'Pedro Daou (PD)',
    role: 'Front-end, Backend & Documentação',
    avatarSrc: '/avatars/pd_img.jpg',
    accentColor: 'teal',
    badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
    areas: [
      {
        title: 'Front-end',
        items: [
          'Telas de cálculo individual de ICMS e IPI',
          'Tela de Help',
        ],
      },
      {
        title: 'Backend',
        items: [
          'API: Rotas /icms (alíquota por estado) e /ipi (cálculo sobre produto)',
          'Testes unitários',
        ],
      },
    ],
  },
  {
    name: 'Gabriel Bonatto',
    role: 'Front-end, Backend & Documentação',
    avatarSrc: '/avatars/gb_img.jpg',
    accentColor: 'lime',
    badgeBg: 'bg-lime-500/15 text-lime-300 border-lime-500/25',
    areas: [
      {
        title: 'Front-end & Doc',
        items: [
          'Tela de cálculo individual de PIS/COFINS',
          'Tela "Sobre" (Equipe)',
          'Testes funcionais e documentação técnica (README)',
        ],
      },
      {
        title: 'Backend & Doc',
        items: [
          'API: Rota /pis-cofins (regimes cumulativo/não cumulativo)',
          'Testes unitários',
          'Documentação técnica (README)',
        ],
      },
    ],
  },
];

const TECH_STACK = [
  {
    category: 'Backend',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
      </svg>
    ),
    color: 'text-emerald-400',
    items: ['Node.js', 'Fastify', 'TypeScript', 'Vitest'],
  },
  {
    category: 'Frontend',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-teal-400',
    items: ['Next.js 15', 'React 19', 'TypeScript', 'TailwindCSS 4'],
  },
  {
    category: 'DevOps',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    color: 'text-lime-400',
    items: ['Git & GitHub', 'GitHub Actions', 'AWS Amplify', 'pnpm', 'ECR', 'ECS', 'Load Balancer', 'Cloudfront'],
  },
];

export default function SobrePage() {
  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-5xl">
      <title>Sobre o Projeto - Simulador Tributário</title>
      <meta name="description" content="Conheça a equipe de desenvolvimento do Simulador Tributário de Nota Fiscal e as tecnologias utilizadas no projeto." />

      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-green-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-green-500/25">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            PUC Campinas — GCEIC26
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4 bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent">
            Sobre o Projeto
          </h1>
          <p className="text-green-200/75 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
            Plataforma web para cálculo automático de tributos incidentes em Notas Fiscais de venda de produtos.
            Desenvolvida como projeto acadêmico integrando back-end, front-end e DevOps.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Disciplina', value: 'GCEIC26' },
              { label: 'Instituição', value: 'PUC Campinas' },
              { label: 'Tributos', value: 'ICMS, IPI, PIS, COFINS' },
              { label: 'Plataforma', value: 'Web + API REST' },
            ].map((item) => (
              <div key={item.label} className="bg-green-900/50 border border-green-800/50 rounded-xl p-3">
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider block">{item.label}</span>
                <span className="text-white text-xs font-bold mt-0.5 block leading-snug">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Team */}
      <section>
        <h2 className="text-xl font-extrabold text-green-950 mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Equipe de Desenvolvimento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              {/* Avatar header */}
              <div className="bg-gradient-to-br from-green-950 to-green-900 p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 rounded-full blur-3xl" />
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-green-500/30 shadow-lg shadow-green-900/50 mb-3">
                  <Image
                    src={member.avatarSrc}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-extrabold text-sm leading-tight">{member.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1.5 ${member.badgeBg}`}>
                  {member.role}
                </span>
              </div>
              {/* Contribution areas */}
              <div className="p-4 flex flex-col gap-3">
                {member.areas.map((area, i) => (
                  <div key={i}>
                    <span className="text-[10px] font-black text-green-800 uppercase tracking-wider block mb-1.5">{area.title}</span>
                    <ul className="flex flex-col gap-1">
                      {area.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs text-gray-600 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section>
        <h2 className="text-xl font-extrabold text-green-950 mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Stack Tecnológico
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TECH_STACK.map((stack) => (
            <div key={stack.category} className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
              <div className={`flex items-center gap-2 mb-4 ${stack.color}`}>
                {stack.icon}
                <span className="font-extrabold text-sm text-green-950">{stack.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {stack.items.map((tech) => (
                  <span key={tech} className="text-xs bg-green-50 text-green-800 border border-green-100 px-3 py-1 rounded-full font-bold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repository */}
      <section className="bg-gradient-to-r from-green-950 to-green-900 rounded-2xl p-6 border border-green-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider block">Código Aberto</span>
          <h3 className="text-white font-extrabold text-lg mt-0.5">Repositório GitHub</h3>
          <p className="text-green-200/60 text-xs mt-1">Acesse o código-fonte completo do projeto</p>
        </div>
        <a
          href="https://github.com/jgabrieldsl/impostos-nf-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Ver no GitHub
        </a>
      </section>
    </main>
  );
}