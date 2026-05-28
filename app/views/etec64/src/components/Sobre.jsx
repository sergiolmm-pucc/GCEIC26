import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';
import photoA from '../assets/aluno_a.jpeg';
import photoB from '../assets/aluno_b.jpeg';
import photoC from '../assets/aluno_c.jpeg';

export default function Sobre() {
  const equipe = [
    {
      nome: 'Eduardo Ferreira Gomes',
      funcao: 'Desenvolvedor Fullstack',
      atribuicao: 'Responsável pelo desenvolvimento da API de Cálculos de Médias, conversão automática de menções típicas da ETEC (MB, B, R, I) e testes unitários de nota.',
      foto: photoA,
      github: '#EduFGomes',
      email: 'eduardo.fg1@puccampinas.edu.br'
    },
    {
      nome: 'Laura Akemi Suzuki',
      funcao: 'Desenvolvedor Fullstack',
      atribuicao: 'Responsável pelo desenvolvimento da API de Frequência, cálculo de presenças, definição do teto de faltas (25%) e projeção de faltas restantes.',
      foto: photoB,
      github: '#lasuzukii',
      email: 'laura.as3@puccampinas.edu.br'
    },
    {
      nome: 'Murilo Euphrasio Brito',
      funcao: 'Desenvolvedor Fullstack',
      atribuicao: 'Responsável pelo Simulador de Status Acadêmico, projeção de metas bimestrais, integração geral do frontend em React e estilização premium em CSS Vanilla.',
      foto: photoC,
      github: '#murilobrito',
      email: 'murilo.eb1@puccampinas.edu.br'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Título da Aba */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Sobre a Equipe</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Conheça os integrantes do grupo e suas respectivas atribuições no desenvolvimento da Atividade 2.
        </p>
      </div>

      {/* Grid de Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '10px'
        }}
      >
        {equipe.map((membro, index) => (
          <div 
            key={index} 
            className="glass glass-hover" 
            style={{
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '20px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Foto de Perfil com Borda Gradiente */}
            <div 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                padding: '4px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={membro.foto} 
                alt={`Foto de ${membro.nome}`}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              />
            </div>

            {/* Detalhes do Integrante */}
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '4px' }}>
                {membro.nome}
              </h3>
              <span 
                className="badge badge-info"
                style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px' }}
              >
                {membro.funcao}
              </span>
            </div>

            <p 
              style={{ 
                fontSize: '0.88rem', 
                color: 'var(--text-muted)', 
                lineHeight: '1.6',
                flexGrow: 1 
              }}
            >
              {membro.atribuicao}
            </p>

            {/* Informações de Contato / Links */}
            <div 
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '16px',
                marginTop: '10px'
              }}
            >
              <a 
                href={`mailto:${membro.email}`} 
                title={membro.email}
                style={{ 
                  color: 'var(--text-muted)', 
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Mail size={16} />
                <span>Contato</span>
              </a>

              <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.1)' }} />

              <div 
                style={{ 
                  color: 'var(--text-muted)', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem'
                }}
              >
                <GraduationCap size={16} />
                <span>PUC-Campinas</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
