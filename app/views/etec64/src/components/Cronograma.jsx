import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function Cronograma() {
  const etapas = [
    {
      data: '24/04/2026',
      titulo: 'Concepção do Projeto',
      descricao: 'Divulgação do edital do projeto de Gerência de Configuração. Alinhamento inicial da equipe de 3 alunos e escolha do tema Cálculo ETEC.',
      concluida: true
    },
    {
      data: '12/05/2026',
      titulo: 'Estruturação do Repositório Git',
      descricao: 'Eleição do representante de git do grupo e criação do repositório no GitHub para integração contínua.',
      concluida: true
    },
    {
      data: '20/05/2026',
      titulo: 'Desenvolvimento do Backend & APIs',
      descricao: 'Construção das APIs em Node.js. Implementação dos endpoints de notas (Aluno A), frequência (Aluno B), simulador (Aluno C) e suite completa de 19 testes automatizados com Jest.',
      concluida: true
    },
    {
      data: '21/05/2026',
      titulo: 'Entrega Parcial (30%)',
      descricao: 'Amanhã! Entrega obrigatória da API funcional integrada ao App React e testes unitários no Canvas e GitHub.',
      concluida: false,
      destacada: true
    },
    {
      data: '25/05/2026',
      titulo: 'Integração de CI/CD e Qualidade',
      descricao: 'Implementação de workflows automáticos no GitHub Actions para rodar lints e testes unitários a cada commit.',
      concluida: false
    },
    {
      data: '28/05/2026',
      titulo: 'Entrega Final e Apresentação (40%)',
      descricao: 'Execução de testes funcionais integrados e apresentação oficial da plataforma web para o professor e alunos na Escola Politécnica.',
      concluida: false
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Cabeçalho */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Cronograma de Implantação</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Linha do tempo interativa detalhando o desenvolvimento, marcos de entrega e fases de testes do portal Cálculo ETEC.
        </p>
      </div>

      {/* Timeline Layout */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          paddingLeft: '32px',
          marginTop: '10px'
        }}
      >
        {/* Linha vertical tracejada */}
        <div 
          style={{
            position: 'absolute',
            left: '11px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--success) 45%, var(--primary) 60%, rgba(255,255,255,0.05) 100%)',
            zIndex: 1
          }}
        />

        {etapas.map((etapa, index) => (
          <div 
            key={index} 
            style={{
              position: 'relative',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {/* Indicador Circular */}
            <div 
              style={{
                position: 'absolute',
                left: '-32px',
                top: '4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: etapa.concluida 
                  ? 'var(--success)' 
                  : (etapa.destacada ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-secondary)'),
                border: etapa.concluida
                  ? 'none'
                  : `2px solid ${etapa.destacada ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                boxShadow: etapa.destacada 
                  ? '0 0 15px var(--primary-glow)' 
                  : (etapa.concluida ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              {etapa.concluida ? (
                <CheckCircle2 size={14} color="#fff" />
              ) : (
                <Clock size={12} color={etapa.destacada ? '#fff' : 'var(--text-muted)'} />
              )}
            </div>

            {/* Informações da Etapa */}
            <div 
              className="glass"
              style={{
                padding: '20px 24px',
                background: etapa.destacada 
                  ? 'rgba(30, 41, 73, 0.45)' 
                  : 'rgba(13, 20, 38, 0.45)',
                border: `1px solid ${etapa.destacada ? 'var(--border-glass-active)' : 'var(--border-glass)'}`,
                boxShadow: etapa.destacada ? '0 10px 30px rgba(99, 102, 241, 0.15)' : 'none'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '8px'
                }}
              >
                <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
                  {etapa.titulo}
                </h3>
                <span 
                  className={`badge ${etapa.concluida ? 'badge-success' : (etapa.destacada ? 'badge-info' : 'badge-warning')}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <Calendar size={12} />
                  {etapa.data}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {etapa.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
