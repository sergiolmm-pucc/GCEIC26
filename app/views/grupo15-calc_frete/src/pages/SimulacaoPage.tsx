import { useState, useEffect } from 'react';
import { FreteInput, FreteResultado, PrazoOutput, TipoEntrega, TIPO_CONFIG } from '../types/frete.types';
import { getCidades, getDistancia, getPrazo, calcularFrete } from '../services/freteService';

const TIPO_OPCOES: { value: TipoEntrega; label: string; icon: string; desc: string }[] = [
  { value: 'economico', label: 'Econômico', icon: 'bi-box',            desc: '7–10 dias úteis' },
  { value: 'normal',    label: 'Normal',    icon: 'bi-truck',           desc: '3–5 dias úteis'  },
  { value: 'expresso',  label: 'Expresso',  icon: 'bi-lightning-fill',  desc: '1–2 dias úteis'  },
];

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function SimulacaoPage() {
  const [cidades,    setCidades]    = useState<string[]>([]);
  const [origem,     setOrigem]     = useState('');
  const [destino,    setDestino]    = useState('');
  const [distanciaKm, setDistanciaKm] = useState<number>(0);
  const [peso,       setPeso]       = useState('');
  const [tipo,       setTipo]       = useState<TipoEntrega>('normal');
  const [resultado,  setResultado]  = useState<FreteResultado | null>(null);
  const [prazo,      setPrazo]      = useState<PrazoOutput | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [erro,       setErro]       = useState('');

  // ── Carrega lista de cidades da API ao montar a página (ALUNO 2)
  useEffect(() => {
    getCidades()
      .then(setCidades)
      .catch(() => setErro('Não foi possível carregar as cidades. Verifique se a API está rodando.'));
  }, []);

  // ── Busca distância da API ao selecionar origem + destino (ALUNO 2)
  useEffect(() => {
    if (!origem || !destino) { setDistanciaKm(0); return; }

    setLoadingDist(true);
    setErro('');
    getDistancia(origem, destino)
      .then(d => setDistanciaKm(d.distanciaKm))
      .catch(() => setErro(`Rota ${origem} → ${destino} não encontrada na API.`))
      .finally(() => setLoadingDist(false));
  }, [origem, destino]);

  const handleCalcular = async () => {
    setErro('');
    if (!origem || !destino)       { setErro('Selecione origem e destino.'); return; }
    if (!peso || Number(peso) <= 0) { setErro('Informe um peso válido.'); return; }
    if (distanciaKm === 0)         { setErro('Distância não carregada. Tente selecionar as cidades novamente.'); return; }

    setLoading(true);
    try {
      const input: FreteInput = { peso: Number(peso), distancia: distanciaKm, tipo, origem, destino };

      // ALUNO 1 — cálculo do frete
      // ALUNO 3 — prazo de entrega (chamadas em paralelo)
      const [res, prazoRes] = await Promise.all([
        calcularFrete(input),
        getPrazo(distanciaKm, tipo),
      ]);
      setResultado(res);
      setPrazo(prazoRes);

      // Salva no histórico local
      const hist = JSON.parse(localStorage.getItem('fc_historico') ?? '[]');
      hist.unshift({ id: Date.now().toString(), input, resultado: res, criadoEm: new Date().toISOString() });
      localStorage.setItem('fc_historico', JSON.stringify(hist.slice(0, 20)));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado ao calcular. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setOrigem(''); setDestino(''); setPeso('');
    setTipo('normal'); setResultado(null); setPrazo(null); setErro(''); setDistanciaKm(0);
  };

  return (
    <div className="fc-page">
      <div className="container">

        {/* Header */}
        <div className="mb-4">
          <h1 className="fc-page-title">
            <i className="bi bi-calculator text-orange me-2" />Simulação de Frete
          </h1>
          <p className="fc-page-subtitle">Calcule o valor e prazo de entrega entre cidades brasileiras</p>
        </div>

        <div className="row g-4">

          {/* ── FORMULÁRIO ── */}
          <div className="col-lg-7">
            <div className="fc-card">

              {/* Step 1 — Rota */}
              <div className="fc-step">
                <div className="fc-step-num">1</div>
                <div className="fc-step-title">Origem e Destino</div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <label className="fc-label"><i className="bi bi-geo-alt me-1" />Cidade de Origem</label>
                  <select
                    className="fc-select"
                    value={origem}
                    onChange={e => { setOrigem(e.target.value); setDestino(''); setResultado(null); }}
                    disabled={cidades.length === 0}
                  >
                    <option value="">{cidades.length === 0 ? 'Carregando...' : 'Selecione...'}</option>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="fc-label"><i className="bi bi-geo me-1" />Cidade de Destino</label>
                  <select
                    className="fc-select"
                    value={destino}
                    onChange={e => { setDestino(e.target.value); setResultado(null); }}
                    disabled={!origem}
                  >
                    <option value="">{origem ? 'Selecione...' : 'Escolha a origem primeiro'}</option>
                    {cidades.filter(c => c !== origem).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Preview de distância (vem da API) */}
              {loadingDist && (
                <div className="fc-card-sm d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.85rem' }}>
                  <span className="spinner-border spinner-border-sm text-orange" />
                  <span style={{ color: 'var(--fc-muted)' }}>Buscando distância...</span>
                </div>
              )}
              {!loadingDist && distanciaKm > 0 && (
                <div className="fc-card-sm d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-arrow-left-right text-orange" />
                  <span style={{ color: 'var(--fc-muted)' }}>Distância:</span>
                  <span className="font-mono" style={{ color: 'var(--fc-text)', fontWeight: 700 }}>{distanciaKm} km</span>
                  <span style={{ color: 'var(--fc-muted)', fontSize: '0.75rem' }}>· via API</span>
                </div>
              )}

              {/* Step 2 — Peso */}
              <div className="fc-step">
                <div className="fc-step-num">2</div>
                <div className="fc-step-title">Peso da encomenda</div>
              </div>

              <div className="mb-4">
                <label className="fc-label"><i className="bi bi-box me-1" />Peso (kg)</label>
                <input
                  type="number"
                  className="fc-input"
                  placeholder="Ex: 5.5"
                  min="0.1"
                  step="0.1"
                  value={peso}
                  onChange={e => { setPeso(e.target.value); setResultado(null); }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--fc-muted)', marginTop: '0.4rem' }}>
                  Tarifa: R$ 2,50/kg
                </div>
              </div>

              {/* Step 3 — Tipo */}
              <div className="fc-step">
                <div className="fc-step-num">3</div>
                <div className="fc-step-title">Tipo de entrega</div>
              </div>

              <div className="row g-2 mb-4">
                {TIPO_OPCOES.map(op => (
                  <div className="col-4" key={op.value}>
                    <div
                      className="fc-card-sm text-center"
                      style={{
                        cursor: 'pointer',
                        borderColor: tipo === op.value ? 'var(--fc-primary)' : 'var(--fc-border)',
                        transition: 'all 0.15s',
                      }}
                      onClick={() => { setTipo(op.value); setResultado(null); }}
                    >
                      <i className={`bi ${op.icon} ${tipo === op.value ? 'text-orange' : ''}`}
                         style={{ fontSize: '1.3rem', display: 'block', marginBottom: '0.4rem' }} />
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{op.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--fc-muted)', marginTop: '0.2rem' }}>{op.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Erro */}
              {erro && (
                <div className="fc-alert mb-3">
                  <i className="bi bi-exclamation-triangle me-2" />{erro}
                </div>
              )}

              {/* Botões */}
              <div className="d-flex gap-2">
                <button className="fc-btn" onClick={handleCalcular} disabled={loading || loadingDist}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm" /> Calculando...</>
                    : <><i className="bi bi-calculator" /> Calcular Frete</>
                  }
                </button>
                <button className="fc-btn-ghost" onClick={handleLimpar}>
                  <i className="bi bi-arrow-counterclockwise" /> Limpar
                </button>
              </div>

            </div>
          </div>

          {/* ── RESULTADO ── */}
          <div className="col-lg-5">
            {resultado ? (
              <div className="fc-result">

                <div className="mb-2">
                  <span className="fc-badge fc-badge-normal">
                    <i className="bi bi-plug-fill" /> Via API
                  </span>
                </div>

                <div className="mb-3">
                  <div className="fc-result-label">Valor Total do Frete</div>
                  <div className="fc-result-value">{fmtBRL(resultado.valorFinal)}</div>
                </div>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className={`fc-badge ${TIPO_CONFIG[tipo].cor}`}>
                    <i className={`bi ${TIPO_CONFIG[tipo].icon}`} />
                    {TIPO_CONFIG[tipo].label}
                  </span>
                  {/* Prazo sempre vem da API do Aluno 3, ajustado pela distância */}
                  <span style={{ fontSize: '0.82rem', color: 'var(--fc-muted)' }}>
                    <i className="bi bi-clock me-1" />
                    {prazo ? prazo.prazoEntrega : resultado.prazoEntrega}
                  </span>
                </div>

                {/* Data estimada — ALUNO 3 */}
                {prazo && (
                  <div className="fc-card-sm mb-3 d-flex align-items-center gap-3" style={{ fontSize: '0.82rem' }}>
                    <i className="bi bi-calendar-check text-orange" style={{ fontSize: '1.1rem' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{prazo.prazoEntrega}</div>
                      <div style={{ color: 'var(--fc-muted)', fontSize: '0.75rem' }}>
                        Previsão: <strong>{prazo.dataEstimada}</strong>
                        <span style={{ marginLeft: '0.4rem', opacity: 0.6 }}>· via API</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detalhamento */}
                <div style={{ borderTop: '1px solid var(--fc-border)', paddingTop: '0.75rem' }}>
                  <div className="fc-result-label mb-2">Detalhamento</div>

                  <div className="fc-breakdown-item">
                    <span style={{ color: 'var(--fc-muted)' }}><i className="bi bi-box me-2" />Custo por peso</span>
                    <span className="value">{fmtBRL(resultado.custoPeso)}</span>
                  </div>
                  <div className="fc-breakdown-item">
                    <span style={{ color: 'var(--fc-muted)' }}><i className="bi bi-signpost me-2" />Custo por distância</span>
                    <span className="value">{fmtBRL(resultado.custoDistancia)}</span>
                  </div>
                  <div className="fc-breakdown-item">
<span style={{ color: 'var(--fc-muted)' }}><i className="bi bi-percent me-2" />Multiplicador tipo</span>
                    <span className="value">×{resultado.multiplicadorTipo}</span>
                  </div>
                  <div className="fc-breakdown-item" style={{ fontWeight: 700 }}>
                    <span><i className="bi bi-check2-circle text-orange me-2" />Total</span>
                    <span className="value text-orange">{fmtBRL(resultado.valorFinal)}</span>
                  </div>
                </div>

                {/* Rota */}
                <div className="fc-card-sm mt-3" style={{ fontSize: '0.82rem' }}>
                  <div style={{ color: 'var(--fc-muted)', marginBottom: '0.35rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Rota
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span>{origem}</span>
                    <i className="bi bi-arrow-right text-orange" />
                    <span>{destino}</span>
                    <span className="font-mono ms-auto" style={{ color: 'var(--fc-muted)' }}>{distanciaKm} km</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="fc-card h-100 d-flex flex-column align-items-center justify-content-center text-center"
                   style={{ minHeight: '320px', opacity: 0.5 }}>
                <i className="bi bi-truck" style={{ fontSize: '2.5rem', color: 'var(--fc-muted)', marginBottom: '1rem' }} />
                <div style={{ fontSize: '0.88rem', color: 'var(--fc-muted)' }}>
                  Preencha os dados ao lado<br />e clique em <strong>Calcular Frete</strong>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
