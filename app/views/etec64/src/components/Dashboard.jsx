import React, { useState } from 'react';
import { Award, Activity, Compass, Calendar, Users, HelpCircle, LogOut } from 'lucide-react';
import CalcMedia from './CalcMedia';
import CalcFrequencia from './CalcFrequencia';
import CalcAprovacao from './CalcAprovacao';
import Cronograma from './Cronograma';
import Sobre from './Sobre';
import Help from './Help';

export default function Dashboard({ onLogout }) {
  const [abaAtiva, setAbaAtiva] = useState('calc_media');

  const abas = [
    { id: 'calc_media', label: 'Cálculo de Média', icone: <Award size={18} /> },
    { id: 'calc_frequencia', label: 'Cálculo de Frequência', icone: <Activity size={18} /> },
    { id: 'calc_aprovacao', label: 'Simulador ETEC', icone: <Compass size={18} /> },
    { id: 'cronograma', label: 'Cronograma', icone: <Calendar size={18} /> },
    { id: 'sobre', label: 'Sobre a Equipe', icone: <Users size={18} /> },
    { id: 'help', label: 'Ajuda', icone: <HelpCircle size={18} /> },
  ];

  const renderizarAba = () => {
    switch (abaAtiva) {
      case 'calc_media':
        return <CalcMedia />;
      case 'calc_frequencia':
        return <CalcFrequencia />;
      case 'calc_aprovacao':
        return <CalcAprovacao />;
      case 'cronograma':
        return <Cronograma />;
      case 'sobre':
        return <Sobre />;
      case 'help':
        return <Help />;
      default:
        return <CalcMedia />;
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        position: 'relative'
      }}
    >
      {/* Barra Lateral (Sidebar) */}
      <aside 
        className="glass"
        style={{
          width: '260px',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          gap: '30px',
          borderRadius: '0',
          borderRight: '1px solid var(--border-glass)',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          background: 'rgba(10, 15, 30, 0.75)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100
        }}
      >
        {/* Logo / Header da Sidebar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '10px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              color: '#fff',
              fontSize: '1.1rem'
            }}
          >
            E
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', color: '#fff', lineHeight: '1.1' }}>Cálculo ETEC</h1>
            <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Dashboard
            </span>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid transparent',
                borderRadius: '12px',
                background: abaAtiva === aba.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderColor: abaAtiva === aba.id ? 'var(--border-glass-active)' : 'transparent',
                color: abaAtiva === aba.id ? '#fff' : 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (abaAtiva !== aba.id) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                }
              }}
              onMouseLeave={(e) => {
                if (abaAtiva !== aba.id) {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ color: abaAtiva === aba.id ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                {aba.icone}
              </span>
              {aba.label}
            </button>
          ))}
        </nav>

        {/* Botão de Logout */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.02)',
            color: 'var(--danger)',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.02)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          <LogOut size={18} />
          Sair do Painel
        </button>
      </aside>

      {/* Conteúdo Principal (Central) */}
      <main 
        style={{
          flexGrow: 1,
          marginLeft: '260px', // Abre espaço para a sidebar fixa
          padding: '40px 50px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
          {renderizarAba()}
        </div>
      </main>
    </div>
  );
}
