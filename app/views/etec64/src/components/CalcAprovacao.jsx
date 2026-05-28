import React, { useState } from 'react';
import { Award, Compass, HelpCircle, CheckCircle, AlertTriangle, XCircle, Calculator, RefreshCw } from 'lucide-react';

export default function CalcAprovacao() {
  const [mediaAtual, setMediaAtual] = useState('');
  const [tipoMedia, setTipoMedia] = useState('numerica'); // 'numerica' ou 'mencao'
  const [frequenciaAtual, setFrequenciaAtual] = useState('');
  const [bimestresRestantes, setBimestresRestantes] = useState('0'); // '0' = Avaliação Final/Exame
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const limparForm = () => {
    setMediaAtual('');
    setFrequenciaAtual('');
    setBimestresRestantes('0');
    setResultado(null);
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setLoading(true);

    // Validações locais rápidas
    const freqVal = parseFloat(frequenciaAtual);
    if (isNaN(freqVal) || freqVal < 0 || freqVal > 100) {
      setErro('A frequência atual deve ser um número entre 0 e 100.');
      setLoading(false);
      return;
    }

    let mediaEnvio = mediaAtual;
    if (tipoMedia === 'numerica') {
      const mediaVal = parseFloat(mediaAtual.toString().replace(',', '.'));
      if (isNaN(mediaVal) || mediaVal < 0 || mediaVal > 10) {
        setErro('A média atual deve ser um número entre 0.00 e 10.00.');
        setLoading(false);
        return;
      }
      mediaEnvio = mediaVal;
    } else {
      mediaEnvio = mediaAtual.toUpperCase().trim();
      if (!mediaEnvio) {
        setErro('Selecione uma menção atual.');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/etec64/aprovacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mediaAtual: mediaEnvio,
          frequenciaAtual: freqVal,
          bimestresRestantes: parseInt(bimestresRestantes)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao processar simulação.');
      }

      setResultado(data);
    } catch (err) {
      setErro(err.message || 'Erro de conexão com o servidor do backend.');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para determinar cor e ícone do status
  const obterDetalhesStatus = (status) => {
    switch (status) {
      case 'Aprovado':
      case 'Aprovado Provisório':
        return {
          cor: 'var(--success)',
          glow: 'rgba(16, 185, 129, 0.25)',
          icone: <CheckCircle size={28} style={{ color: 'var(--success)' }} />,
          classeBadge: 'badge-success'
        };
      case 'Recuperação':
      case 'Abaixo da Média':
        return {
          cor: 'var(--warning)',
          glow: 'rgba(245, 158, 11, 0.25)',
          icone: <AlertTriangle size={28} style={{ color: 'var(--warning)' }} />,
          classeBadge: 'badge-warning'
        };
      case 'Reprovado por Faltas':
      default:
        return {
          cor: 'var(--danger)',
          glow: 'rgba(239, 68, 68, 0.25)',
          icone: <XCircle size={28} style={{ color: 'var(--danger)' }} />,
          classeBadge: 'badge-danger'
        };
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Cabeçalho */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Simulador e Metas de Aprovação (Aluno C)</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Cruze suas médias e frequência atuais, escolha quantos bimestres faltam e projete suas metas para passar sem exames!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '24px' }}>
        
        {/* Formulário */}
        <div className="glass" style={{ padding: '30px', flex: 1, background: 'rgba(13, 20, 38, 0.45)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Escolha do tipo de Média Atual */}
            <div className="input-group">
              <label className="input-label">Formato da Média Atual</label>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '6px', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <button
                  type="button"
                  onClick={() => { setTipoMedia('numerica'); setMediaAtual(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: tipoMedia === 'numerica' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                    color: '#fff',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Média Decimal (0 a 10)
                </button>
                <button
                  type="button"
                  onClick={() => { setTipoMedia('mencao'); setMediaAtual(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: tipoMedia === 'mencao' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                    color: '#fff',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Menção Atual ETEC
                </button>
              </div>
            </div>

            {/* Inputs de Média e Frequência */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div className="input-group">
                <label className="input-label" htmlFor="mediaAtual">Média / Conceito</label>
                {tipoMedia === 'numerica' ? (
                  <input
                    id="mediaAtual"
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="Ex: 5.50"
                    value={mediaAtual}
                    onChange={(e) => setMediaAtual(e.target.value)}
                    required
                    min="0"
                    max="10"
                  />
                ) : (
                  <select
                    id="mediaAtual"
                    className="input-field"
                    value={mediaAtual}
                    onChange={(e) => setMediaAtual(e.target.value)}
                    required
                    style={{ background: 'rgba(10, 16, 32, 0.8)' }}
                  >
                    <option value="">Selecione...</option>
                    <option value="MB">MB (Muito Bom)</option>
                    <option value="B">B (Bom)</option>
                    <option value="R">R (Regular)</option>
                    <option value="I">I (Insatisfatório)</option>
                  </select>
                )}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="frequenciaAtual">Frequência Atual (%)</label>
                <input
                  id="frequenciaAtual"
                  type="number"
                  step="0.1"
                  className="input-field"
                  placeholder="Ex: 78.5"
                  value={frequenciaAtual}
                  onChange={(e) => setFrequenciaAtual(e.target.value)}
                  required
                  min="0"
                  max="100"
                />
              </div>

            </div>

            {/* Período / Bimestres Restantes */}
            <div className="input-group">
              <label className="input-label" htmlFor="bimestresRestantes">Momento Acadêmico / Bimestres Restantes</label>
              <select
                id="bimestresRestantes"
                className="input-field"
                value={bimestresRestantes}
                onChange={(e) => setBimestresRestantes(e.target.value)}
                required
                style={{ background: 'rgba(10, 16, 32, 0.8)' }}
              >
                <option value="0">Fim do Período (Avaliação Final / Exames)</option>
                <option value="1">1 Bimestre Restante (Restando o 4º Bimestre)</option>
                <option value="2">2 Bimestres Restantes (Faltando o 3º e 4º Bimestre)</option>
                <option value="3">3 Bimestres Restantes (Faltando o 2º, 3º e 4º Bimestre)</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Selecione quantos períodos regulares de avaliação ainda restam no ano
              </span>
            </div>

            {/* Controles de Envio */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                <Compass size={18} />
                {loading ? 'Simulando...' : 'Rodar Simulação'}
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

            {/* Alerta Erro */}
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

        {/* Resultados e Metas */}
        {resultado && (
          <div 
            className="glass animate-fade-in" 
            style={{ 
              padding: '30px', 
              flex: 1, 
              background: 'rgba(10, 16, 32, 0.5)', 
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* Cabeçalho do Resultado */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                paddingBottom: '16px'
              }}
            >
              {obterDetalhesStatus(resultado.status).icone}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Status Acadêmico Analisado
                </span>
                <h3 
                  style={{ 
                    fontSize: '1.5rem', 
                    color: obterDetalhesStatus(resultado.status).cor,
                    lineHeight: '1.2'
                  }}
                >
                  {resultado.status}
                </h3>
              </div>
            </div>

            {/* Cartão de Resumo e Mensagem Principal */}
            <div 
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${resultado.aprovado ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <Award size={20} style={{ color: obterDetalhesStatus(resultado.status).cor, flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.92rem', color: '#fff', lineHeight: '1.6' }}>
                {resultado.simulação.mensagem}
              </p>
            </div>

            {/* Metas Projetadas se bimestresRestantes > 0 */}
            {resultado.bimestresRestantes > 0 && resultado.simulação.passivelAprovacaoPorNota && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ color: '#fff', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
                  Metas para Aprov. Direta (Restando {resultado.bimestresRestantes} Bim.):
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  {/* Meta de Nota */}
                  <div 
                    className="glass" 
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(0,0,0,0.15)', 
                      textAlign: 'center', 
                      border: '1px solid rgba(255,255,255,0.03)' 
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Nota Mínima / Bimestre
                    </span>
                    <h5 style={{ fontSize: '2rem', color: '#fff', margin: '4px 0 2px 0' }}>
                      {resultado.simulação.notaNecessariaPorBimestre}
                    </h5>
                    <span 
                      className="badge badge-info" 
                      style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px' }}
                    >
                      Menção: {resultado.simulação.mencaoNecessariaPorBimestre}
                    </span>
                  </div>

                  {/* Meta de Frequência */}
                  <div 
                    className="glass" 
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(0,0,0,0.15)', 
                      textAlign: 'center', 
                      border: '1px solid rgba(255,255,255,0.03)' 
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Frequência Mínima / Bimestre
                    </span>
                    <h5 style={{ fontSize: '2rem', color: '#fff', margin: '4px 0 2px 0' }}>
                      {resultado.simulação.freqNecessariaPorBimestre}%
                    </h5>
                    <span 
                      className="badge badge-success" 
                      style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px' }}
                    >
                      Presença Exigida
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* Metas de Exame se bimestresRestantes === 0 e em Recuperação */}
            {resultado.bimestresRestantes === 0 && resultado.status === 'Recuperação' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ color: 'var(--warning)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Meta para o Exame de Recuperação Final:
                </h4>

                <div 
                  className="glass"
                  style={{ 
                    padding: '20px', 
                    background: 'rgba(245, 158, 11, 0.03)', 
                    border: '1px solid rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Nota Exigida no Exame
                    </span>
                    <h5 style={{ fontSize: '2.5rem', color: '#fff', margin: '4px 0 0 0' }}>
                      {resultado.simulação.notaExameNecessaria}
                    </h5>
                  </div>
                  <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Menção Equivalente
                    </span>
                    <h5 style={{ fontSize: '2.5rem', color: 'var(--warning)', margin: '4px 0 0 0', fontWeight: '800' }}>
                      {resultado.simulação.mencaoExameNecessaria}
                    </h5>
                  </div>
                </div>
              </div>
            )}

            {/* Ficha técnica da Simulação */}
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
                <span>Média Acadêmica Analisada:</span>
                <strong style={{ color: '#fff' }}>{resultado.mediaAnalise} ({resultado.mencaoAnalise})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Frequência Analisada:</span>
                <strong style={{ color: '#fff' }}>{resultado.frequenciaAnalise}% de presença</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Bimestres Restantes:</span>
                <strong style={{ color: '#fff' }}>{resultado.bimestresRestantes} bimestre(s)</strong>
              </div>
              {resultado.bimestresRestantes > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pontos Faltantes (Meta 24):</span>
                  <strong style={{ color: 'var(--warning)' }}>{resultado.simulação.pontosFaltantes} pontos</strong>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
