import React, { useState } from 'react';
import { Percent, Clock, AlertTriangle, CheckCircle, Calculator, RefreshCw } from 'lucide-react';

export default function CalcFrequencia() {
  const [aulasPrevistas, setAulasPrevistas] = useState('');
  const [faltas, setFaltas] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const limparForm = () => {
    setAulasPrevistas('');
    setFaltas('');
    setResultado(null);
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setLoading(true);

    const totalAulas = parseInt(aulasPrevistas);
    const totalFaltas = parseInt(faltas);

    if (isNaN(totalAulas) || totalAulas <= 0) {
      setErro('Aulas previstas devem ser um número positivo maior que zero.');
      setLoading(false);
      return;
    }

    if (isNaN(totalFaltas) || totalFaltas < 0) {
      setErro('O número de faltas não pode ser negativo.');
      setLoading(false);
      return;
    }

    if (totalFaltas > totalAulas) {
      setErro('O número de faltas não pode exceder o total de aulas previstas.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/etec64/frequencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aulasPrevistas: totalAulas,
          faltas: totalFaltas
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao processar o cálculo.');
      }

      setResultado(data);
    } catch (err) {
      setErro(err.message || 'Erro ao conectar-se ao servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Cabeçalho */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Cálculo de Frequência e Presença (Aluno B)</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Monitore o limite de presenças. O regulamento escolar exige a frequência mínima de 75.0% para aprovação.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '24px' }}>
        
        {/* Formulário */}
        <div className="glass" style={{ padding: '30px', flex: 1, background: 'rgba(13, 20, 38, 0.45)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="input-group">
              <label className="input-label" htmlFor="aulasPrevistas">Total de Aulas / Horas Previstas</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="aulasPrevistas"
                  type="number"
                  className="input-field"
                  placeholder="Ex: 80"
                  value={aulasPrevistas}
                  onChange={(e) => setAulasPrevistas(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                  required
                  min="1"
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carga horária total cadastrada no diário escolar</span>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="faltas">Quantidade de Faltas do Aluno</label>
              <div style={{ position: 'relative' }}>
                <AlertTriangle size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="faltas"
                  type="number"
                  className="input-field"
                  placeholder="Ex: 12"
                  value={faltas}
                  onChange={(e) => setFaltas(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                  required
                  min="0"
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ausências registradas em horas/aulas</span>
            </div>

            {/* Controle do formulário */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                <Calculator size={18} />
                {loading ? 'Calculando...' : 'Calcular Frequência'}
              </button>

              <button
                type="button"
                onClick={limparForm}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-glass)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <RefreshCw size={16} />
                Resetar
              </button>
            </div>

            {/* Alerta de erro */}
            {erro && (
              <div 
                className="badge badge-danger animate-fade-in" 
                style={{ width: '100%', padding: '12px', textTransform: 'none', letterSpacing: 'normal' }}
              >
                {erro}
              </div>
            )}

          </form>
        </div>

        {/* Resultados */}
        {resultado && (
          <div 
            className="glass animate-fade-in" 
            style={{ 
              padding: '30px', 
              flex: 1, 
              background: 'rgba(10, 16, 32, 0.5)', 
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              border: `1px solid ${resultado.aprovado ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              boxShadow: resultado.aprovado ? '0 10px 30px rgba(16, 185, 129, 0.05)' : '0 10px 30px rgba(239, 68, 68, 0.05)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              Resultado da Frequência
            </h3>

            {/* Painel da Barra Circular / Progresso */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', margin: '20px 0' }}>
              
              {/* Barra Circular Percentual */}
              <div 
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.02)',
                  border: `6px solid ${resultado.aprovado ? 'var(--success)' : 'var(--danger)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: resultado.aprovado ? '0 0 20px rgba(16, 185, 129, 0.25)' : '0 0 20px rgba(239, 68, 68, 0.25)'
                }}
              >
                <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', lineHeight: '1' }}>
                  {resultado.frequenciaPercentual}%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
                  Presenças
                </span>
              </div>

              {/* Status Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Status de Frequência
                </span>
                <span 
                  style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '800', 
                    color: resultado.aprovado ? 'var(--success)' : 'var(--danger)',
                    lineHeight: '1.2'
                  }}
                >
                  {resultado.aprovado ? 'Frequência Regular' : 'Frequência Insuficiente'}
                </span>
                <span 
                  className={`badge ${resultado.aprovado ? 'badge-success' : 'badge-danger'}`}
                  style={{ padding: '4px 10px', fontSize: '0.7rem', display: 'inline-flex', width: 'fit-content' }}
                >
                  {resultado.aprovado ? 'Aprovado por Presença' : 'Reprovado por Faltas'}
                </span>
              </div>
            </div>

            {/* Informações de Faltas Restantes */}
            <div 
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: resultado.aprovado ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                border: `1px solid ${resultado.aprovado ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                fontSize: '0.9rem',
                color: '#fff',
                lineHeight: '1.6',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {resultado.aprovado ? (
                <CheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
              ) : (
                <AlertTriangle size={24} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                {resultado.aprovado ? (
                  resultado.faltasRestantes > 0 ? (
                    <p>O aluno ainda pode ter até <b>{resultado.faltasRestantes} faltas</b> sem estourar o limite de 25% de ausências.</p>
                  ) : (
                    <p>Atenção: O aluno está <b>no limite exato</b> de faltas permitidas. Próxima ausência resultará em reprovação.</p>
                  )
                ) : (
                  <p>O aluno estourou o limite máximo de faltas permitido na disciplina. Reprovado diretamente.</p>
                )}
              </div>
            </div>

            {/* Ficha técnica detalhada */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                background: 'rgba(0,0,0,0.1)',
                padding: '16px',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Aulas Totais Previstas:</span>
                <strong style={{ color: '#fff' }}>{resultado.detalhes.aulasPrevistas} horas/aulas</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Aulas Presentes:</span>
                <strong style={{ color: '#fff' }}>{resultado.detalhes.presencas} horas/aulas</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Faltas Acumuladas:</span>
                <strong style={{ color: 'var(--warning)' }}>{resultado.detalhes.faltas} faltas</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Teto Máximo de Faltas (25%):</span>
                <strong style={{ color: 'var(--danger)' }}>{resultado.detalhes.faltasMaximasPermitidas} faltas</strong>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
