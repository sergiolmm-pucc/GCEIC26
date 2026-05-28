import { useEffect, useState } from 'react';
import { HistoricoItem, TIPO_CONFIG } from '../types/frete.types';

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function HistoricoPage() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('fc_historico') ?? '[]');
    setHistorico(h);
  }, []);

  const limpar = () => {
    localStorage.removeItem('fc_historico');
    setHistorico([]);
  };

  return (
    <div className="fc-page">
      <div className="container">
        <div className="d-flex align-items-start justify-content-between mb-4">
          <div>
            <h1 className="fc-page-title">
              <i className="bi bi-clock-history text-orange me-2" />Histórico
            </h1>
            <p className="fc-page-subtitle">Últimas simulações realizadas neste navegador</p>
          </div>
          {historico.length > 0 && (
            <button className="fc-btn-ghost" onClick={limpar}>
              <i className="bi bi-trash" /> Limpar
            </button>
          )}
        </div>

        {historico.length === 0 ? (
          <div className="fc-card text-center py-5" style={{ opacity: 0.5 }}>
            <i className="bi bi-inbox" style={{ fontSize: '2.5rem', color: 'var(--fc-muted)' }} />
            <p style={{ color: 'var(--fc-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>
              Nenhuma simulação encontrada.<br />Faça sua primeira cotação na tela de Simulação.
            </p>
          </div>
        ) : (
          historico.map((item) => (
            <div className="fc-history-item" key={item.id}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      {item.input.origem} <i className="bi bi-arrow-right text-orange mx-1" /> {item.input.destino}
                    </div>
                    <div style={{ color: 'var(--fc-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                      <span className="me-3"><i className="bi bi-box me-1" />{item.input.peso} kg</span>
                      <span className="me-3"><i className="bi bi-signpost me-1" />{item.resultado.custoDistancia > 0 ? Math.round(item.resultado.custoDistancia / 0.15) : '—'} km</span>
                      <span className={`fc-badge ${TIPO_CONFIG[item.input.tipo].cor}`}>
                        <i className={`bi ${TIPO_CONFIG[item.input.tipo].icon}`} />
                        {TIPO_CONFIG[item.input.tipo].label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-mono text-orange" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {fmtBRL(item.resultado.valorFinal)}
                  </div>
                  <div style={{ color: 'var(--fc-muted)', fontSize: '0.72rem' }}>
                    <i className="bi bi-clock me-1" />
                    {new Date(item.criadoEm).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}