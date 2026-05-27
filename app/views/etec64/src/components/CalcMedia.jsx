import React, { useState } from 'react';
import { Award, Plus, Trash2, Calculator, RefreshCw } from 'lucide-react';

export default function CalcMedia() {
  const [tipo, setTipo] = useState('numerica'); // 'numerica' ou 'mencao'
  const [notas, setNotas] = useState(['', '']); // Inicia com dois campos vazios
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Adicionar novo campo de nota
  const adicionarCampo = () => {
    setNotas([...notas, '']);
  };

  // Remover um campo de nota específico
  const removerCampo = (index) => {
    if (notas.length <= 1) return; // Mantém pelo menos um campo
    const novasNotas = notas.filter((_, i) => i !== index);
    setNotas(novasNotas);
  };

  // Alterar valor de uma nota específica
  const handleChangeNota = (index, valor) => {
    const novasNotas = [...notas];
    novasNotas[index] = valor;
    setNotas(novasNotas);
  };

  // Limpar formulário e resultado
  const limparForm = () => {
    setNotas(['', '']);
    setResultado(null);
    setErro('');
  };

  // Enviar dados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setLoading(true);

    // Validação local rápida
    const notasFiltradas = notas.map(n => n.toString().trim()).filter(n => n !== '');
    if (notasFiltradas.length === 0) {
      setErro('Insira pelo menos uma nota para calcular.');
      setLoading(false);
      return;
    }

    // Preparar dados para envio
    let notasEnvio = [];
    if (tipo === 'numerica') {
      notasEnvio = notasFiltradas.map(n => parseFloat(n.replace(',', '.')));
      if (notasEnvio.some(isNaN)) {
        setErro('Certifique-se de que todas as notas inseridas são números válidos.');
        setLoading(false);
        return;
      }
    } else {
      notasEnvio = notasFiltradas.map(n => n.toUpperCase());
    }

    try {
      const response = await fetch('http://localhost:3001/api/etec64/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notas: notasEnvio,
          tipo: tipo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao realizar o cálculo.');
      }

      setResultado(data);
    } catch (err) {
      setErro(err.message || 'Erro de conexão com o servidor do backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Cabeçalho da Aba */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Cálculo de Médias (Aluno A)</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Insira notas bimestrais ou menções da ETEC para processar a média final e o status provisório.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '24px' }}>
        
        {/* Formulário */}
        <div className="glass" style={{ padding: '30px', flex: 1, background: 'rgba(13, 20, 38, 0.45)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Seletor de Tipo de Nota */}
            <div className="input-group">
              <label className="input-label">Tipo de Nota</label>
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
                  onClick={() => { setTipo('numerica'); limparForm(); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: tipo === 'numerica' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                    color: '#fff',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Decimal (0 a 10)
                </button>
                <button
                  type="button"
                  onClick={() => { setTipo('mencao'); limparForm(); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: tipo === 'mencao' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                    color: '#fff',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Menção ETEC (MB, B, R, I)
                </button>
              </div>
            </div>

            {/* Listagem de Notas Dinâmica */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label className="input-label">Notas / Avaliações</label>
              
              {notas.map((nota, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: '0.88rem', 
                      color: 'var(--text-muted)', 
                      fontWeight: '700',
                      minWidth: '45px' 
                    }}
                  >
                    {index + 1}ª Aval.
                  </span>

                  {tipo === 'numerica' ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      className="input-field"
                      placeholder="Nota (0.00 a 10.00)"
                      value={nota}
                      onChange={(e) => handleChangeNota(index, e.target.value)}
                      required
                    />
                  ) : (
                    <select
                      className="input-field"
                      value={nota}
                      onChange={(e) => handleChangeNota(index, e.target.value)}
                      required
                      style={{ background: 'rgba(10, 16, 32, 0.8)' }}
                    >
                      <option value="">Selecione Menção...</option>
                      <option value="MB">MB (Muito Bom)</option>
                      <option value="B">B (Bom)</option>
                      <option value="R">R (Regular)</option>
                      <option value="I">I (Insatisfatório)</option>
                    </select>
                  )}

                  {notas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerCampo(index)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        background: 'rgba(239, 68, 68, 0.05)',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Controle de Linhas */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={adicionarCampo}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.01)',
                  color: '#fff',
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
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                <Plus size={16} />
                Adicionar Nota
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

            {/* Erro */}
            {erro && (
              <div 
                className="badge badge-danger animate-fade-in" 
                style={{ width: '100%', padding: '12px', textTransform: 'none', letterSpacing: 'normal' }}
              >
                {erro}
              </div>
            )}

            {/* Submissão */}
            <button type="submit" className="btn-primary" disabled={loading}>
              <Calculator size={18} />
              {loading ? 'Calculando...' : 'Calcular Média Final'}
            </button>
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
              Resultado do Processamento
            </h3>

            {/* Painel Central de Notas */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', margin: '20px 0' }}>
              
              {/* Círculo Médio */}
              <div 
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.02)',
                  border: `4px solid ${resultado.aprovado ? 'var(--success)' : 'var(--danger)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: resultado.aprovado ? '0 0 20px rgba(16, 185, 129, 0.25)' : '0 0 20px rgba(239, 68, 68, 0.25)'
                }}
              >
                <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', lineHeight: '1' }}>
                  {resultado.media}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
                  Média Final
                </span>
              </div>

              {/* Menção */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Menção Obtida
                </span>
                <span 
                  style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    color: resultado.aprovado ? 'var(--success)' : 'var(--danger)',
                    lineHeight: '1'
                  }}
                >
                  {resultado.mencaoFinal}
                </span>
                <span 
                  className={`badge ${resultado.aprovado ? 'badge-success' : 'badge-danger'}`}
                  style={{ padding: '4px 10px', fontSize: '0.7rem', display: 'inline-flex' }}
                >
                  {resultado.aprovado ? 'Aprovado' : 'Reprovado por Nota'}
                </span>
              </div>
            </div>

            {/* Caixa Informativa */}
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
              <Award size={20} style={{ color: resultado.aprovado ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }} />
              <p>{resultado.mensagem}</p>
            </div>

            {/* Detalhes de Entrada */}
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
                <span>Tipo Processado:</span>
                <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{resultado.detalhes.tipoCalculado}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Notas Avaliadas:</span>
                <strong style={{ color: '#fff' }}>[{resultado.detalhes.notasProcessadas.join('; ')}]</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Quantidade total:</span>
                <strong style={{ color: '#fff' }}>{resultado.detalhes.quantidadeNotas} avaliações</strong>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
