import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MarkupAPI } from '../api';

/* ── design tokens (inline) ── */
const T = {
  font:  'var(--font)',
  mono:  'var(--mono)',
  ink:   'var(--ink)',
  muted: 'var(--muted)',
  hair:  'var(--hair)',
  acc:   'var(--accent)',
  bg:    'var(--bg)',
};

/* ── Field ── */
function Field({ label, id, value, onChange, placeholder = '0', unit = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted, textTransform: 'uppercase' }}>
        {label}{unit ? ` (${unit})` : ''}
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: 'none', borderBottom: `1px solid ${T.ink}`, outline: 'none',
          background: 'transparent', fontFamily: T.font, fontSize: 20,
          fontWeight: 400, color: T.ink, padding: '4px 0 8px', width: '100%',
        }}
      />
    </div>
  );
}

/* ── ResultBlock ── */
function ResultBlock({ label, value, variant = 'empty' }) {
  const styles = {
    empty:  { background: 'transparent', border: `1px dashed ${T.hair}`, color: T.muted },
    accent: { background: T.ink,         border: `1px solid ${T.ink}`,   color: '#fff'  },
    soft:   { background: '#F1F1ED',     border: `1px solid ${T.hair}`,  color: T.ink   },
  };
  const s = styles[variant] || styles.empty;
  return (
    <div style={{ borderRadius: 12, padding: '18px 20px', ...s }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.6 }}>{label}</div>
      <div style={{ fontFamily: T.font, fontSize: 26, fontWeight: 500, letterSpacing: -0.5, marginTop: 6 }}>
        {value ?? '—'}
      </div>
    </div>
  );
}

/* ── FormulaNote ── */
function FormulaNote({ text }) {
  return (
    <div style={{
      border: `1px dashed ${T.hair}`, borderRadius: 8, padding: '10px 14px',
      fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: 0.3, lineHeight: 1.55,
    }}>{text}</div>
  );
}

/* ── ErrorBanner ── */
function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      fontFamily: T.font, fontSize: 13, color: '#A8302C',
      background: '#FBEAE8', padding: '10px 14px', borderRadius: 8,
    }}>{msg}</div>
  );
}

/* ── CalcActions ── */
function CalcActions({ onCalc, onClear, loading }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
      <button onClick={onCalc} disabled={loading} style={{
        flex: 1, padding: '14px 20px', borderRadius: 10, border: 'none',
        background: loading ? '#7A8C85' : T.acc, color: '#fff',
        fontFamily: T.font, fontSize: 14, fontWeight: 500, cursor: loading ? 'wait' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        {loading && (
          <span style={{
            width: 12, height: 12, borderRadius: 6,
            border: '1.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff',
            animation: 'mk-spin 0.7s linear infinite', display: 'inline-block',
          }} />
        )}
        {loading ? 'Calculando...' : 'Calcular'}
      </button>
      <button onClick={onClear} style={{
        padding: '14px 20px', borderRadius: 10, border: `1px solid ${T.hair}`,
        background: 'none', color: T.ink, fontFamily: T.font, fontSize: 14, cursor: 'pointer',
      }}>Limpar</button>
    </div>
  );
}

/* ══════════════════════════════
   MODE COMPONENTS
══════════════════════════════ */

/* 01 — Preco de Venda */
function SellPriceMode() {
  const [cost, setCost]   = useState('');
  const [mk,   setMk]     = useState('');
  const [res,  setRes]    = useState(null);
  const [err,  setErr]    = useState('');
  const [load, setLoad]   = useState(false);

  async function calc() {
    setErr(''); setLoad(true);
    try {
      const r = await MarkupAPI.sellPrice({ cost, markupPct: mk });
      setRes(r);
    } catch (e) { setErr(e.message); }
    setLoad(false);
  }
  function clear() { setCost(''); setMk(''); setRes(null); setErr(''); }

  const fmt = (v, pre = 'R$ ') => v != null ? `${pre}${Number(v).toFixed(2)}` : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormulaNote text="PV = Custo / (1 - MarkUp%)" />
      <Field label="Custo"    id="f-cost" value={cost} onChange={setCost} unit="R$" placeholder="0,00" />
      <Field label="MarkUp"   id="f-mk"   value={mk}   onChange={setMk}   unit="%"  placeholder="0" />
      <ErrorBanner msg={err} />
      <CalcActions onCalc={calc} onClear={clear} loading={load} />
      <div style={{ display: 'grid', gap: 10 }}>
        <ResultBlock label="Preco de Venda"  value={fmt(res?.price)}   variant={res ? 'accent' : 'empty'} />
        <ResultBlock label="Divisor"         value={res?.divisor != null ? Number(res.divisor).toFixed(4) : null} variant={res ? 'soft' : 'empty'} />
        <ResultBlock label="Lucro Unitario"  value={fmt(res?.profit)}  variant={res ? 'soft'  : 'empty'} />
      </div>
    </div>
  );
}

/* 02 — MarkUp % */
function MarkupPctMode() {
  const [cost,  setCost]  = useState('');
  const [price, setPrice] = useState('');
  const [res,   setRes]   = useState(null);
  const [err,   setErr]   = useState('');
  const [load,  setLoad]  = useState(false);

  async function calc() {
    setErr(''); setLoad(true);
    try { setRes(await MarkupAPI.markupPct({ cost, price })); }
    catch (e) { setErr(e.message); }
    setLoad(false);
  }
  function clear() { setCost(''); setPrice(''); setRes(null); setErr(''); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormulaNote text="MarkUp = ((PV - Custo) / PV) x 100" />
      <Field label="Custo"          id="f-cost"  value={cost}  onChange={setCost}  unit="R$" placeholder="0,00" />
      <Field label="Preco de Venda" id="f-price" value={price} onChange={setPrice} unit="R$" placeholder="0,00" />
      <ErrorBanner msg={err} />
      <CalcActions onCalc={calc} onClear={clear} loading={load} />
      <div style={{ display: 'grid', gap: 10 }}>
        <ResultBlock label="MarkUp %"           value={res ? `${Number(res.markupPct).toFixed(2)}%` : null} variant={res ? 'accent' : 'empty'} />
        <ResultBlock label="Margem sobre Custo" value={res ? `${Number(res.margemSobreCusto).toFixed(2)}%` : null} variant={res ? 'soft' : 'empty'} />
      </div>
    </div>
  );
}

/* 03 — MarkUp Divisor */
function DivisorMode() {
  const [cost, setCost] = useState('');
  const [df,   setDf]   = useState('');
  const [dv,   setDv]   = useState('');
  const [lc,   setLc]   = useState('');
  const [res,  setRes]  = useState(null);
  const [err,  setErr]  = useState('');
  const [load, setLoad] = useState(false);

  async function calc() {
    setErr(''); setLoad(true);
    try { setRes(await MarkupAPI.divisor({ cost, df, dv, lucro: lc })); }
    catch (e) { setErr(e.message); }
    setLoad(false);
  }
  function clear() { setCost(''); setDf(''); setDv(''); setLc(''); setRes(null); setErr(''); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormulaNote text="Divisor = 1 - (DF + DV + L) / 100" />
      <Field label="Custo"             id="f-cost" value={cost} onChange={setCost} unit="R$" placeholder="0,00" />
      <Field label="Despesas Fixas"    id="f-df"   value={df}   onChange={setDf}   unit="%"  placeholder="0" />
      <Field label="Despesas Variaveis"id="f-dv"   value={dv}   onChange={setDv}   unit="%"  placeholder="0" />
      <Field label="Lucro Desejado"    id="f-lc"   value={lc}   onChange={setLc}   unit="%"  placeholder="0" />
      <ErrorBanner msg={err} />
      <CalcActions onCalc={calc} onClear={clear} loading={load} />
      <div style={{ display: 'grid', gap: 10 }}>
        <ResultBlock label="Divisor"        value={res ? Number(res.divisor).toFixed(4) : null} variant={res ? 'accent' : 'empty'} />
        <ResultBlock label="Total %"        value={res ? `${Number(res.total).toFixed(2)}%` : null} variant={res ? 'soft' : 'empty'} />
        <ResultBlock label="Preco de Venda" value={res ? `R$ ${Number(res.price).toFixed(2)}` : null} variant={res ? 'soft' : 'empty'} />
      </div>
    </div>
  );
}

/* 04 — Lucro */
function ProfitMode() {
  const [cost,  setCost]  = useState('');
  const [price, setPrice] = useState('');
  const [qty,   setQty]   = useState('');
  const [res,   setRes]   = useState(null);
  const [err,   setErr]   = useState('');
  const [load,  setLoad]  = useState(false);

  async function calc() {
    setErr(''); setLoad(true);
    try { setRes(await MarkupAPI.profit({ cost, price, qty })); }
    catch (e) { setErr(e.message); }
    setLoad(false);
  }
  function clear() { setCost(''); setPrice(''); setQty(''); setRes(null); setErr(''); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormulaNote text="Lucro unitario, total e margem" />
      <Field label="Custo Unitario"   id="f-cost"  value={cost}  onChange={setCost}  unit="R$" placeholder="0,00" />
      <Field label="Preco de Venda"   id="f-price" value={price} onChange={setPrice} unit="R$" placeholder="0,00" />
      <Field label="Quantidade"       id="f-qty"   value={qty}   onChange={setQty}   placeholder="1" />
      <ErrorBanner msg={err} />
      <CalcActions onCalc={calc} onClear={clear} loading={load} />
      <div style={{ display: 'grid', gap: 10 }}>
        <ResultBlock label="Lucro Unitario" value={res ? `R$ ${Number(res.unit).toFixed(2)}` : null}   variant={res ? 'accent' : 'empty'} />
        <ResultBlock label="Lucro Total"    value={res ? `R$ ${Number(res.total).toFixed(2)}` : null}  variant={res ? 'soft'  : 'empty'} />
        <ResultBlock label="Margem %"       value={res ? `${Number(res.margin).toFixed(2)}%` : null}   variant={res ? 'soft'  : 'empty'} />
      </div>
    </div>
  );
}

/* 05 — Ponto de Equilibrio */
function BreakEvenMode() {
  const [fixos,    setFixos]    = useState('');
  const [price,    setPrice]    = useState('');
  const [varCost,  setVarCost]  = useState('');
  const [res,      setRes]      = useState(null);
  const [err,      setErr]      = useState('');
  const [load,     setLoad]     = useState(false);

  async function calc() {
    setErr(''); setLoad(true);
    try { setRes(await MarkupAPI.breakEven({ fixos, price, varCost })); }
    catch (e) { setErr(e.message); }
    setLoad(false);
  }
  function clear() { setFixos(''); setPrice(''); setVarCost(''); setRes(null); setErr(''); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormulaNote text="PE = Custos Fixos / (PV - Custo Var.)" />
      <Field label="Custos Fixos"    id="f-fixos"   value={fixos}   onChange={setFixos}   unit="R$" placeholder="0,00" />
      <Field label="Preco de Venda"  id="f-price"   value={price}   onChange={setPrice}   unit="R$" placeholder="0,00" />
      <Field label="Custo Variavel"  id="f-varcost" value={varCost} onChange={setVarCost} unit="R$" placeholder="0,00" />
      <ErrorBanner msg={err} />
      <CalcActions onCalc={calc} onClear={clear} loading={load} />
      <div style={{ display: 'grid', gap: 10 }}>
        <ResultBlock label="Unidades (PE)"       value={res ? Math.ceil(res.units) : null}                              variant={res ? 'accent' : 'empty'} />
        <ResultBlock label="Receita de Equil."   value={res ? `R$ ${Number(res.revenue).toFixed(2)}` : null}           variant={res ? 'soft'  : 'empty'} />
        <ResultBlock label="Margem Contribuicao" value={res ? `R$ ${Number(res.margemCont).toFixed(2)}` : null}        variant={res ? 'soft'  : 'empty'} />
      </div>
    </div>
  );
}

/* ══════════════════════════════
   MODE REGISTRY
══════════════════════════════ */
const MODES = [
  { id: 'sell',   label: 'Preco de Venda',     short: '01', desc: 'PV = Custo / (1 - MarkUp%)',            component: SellPriceMode },
  { id: 'mkup',   label: 'MarkUp %',            short: '02', desc: 'MarkUp = ((PV - Custo) / PV) x 100',   component: MarkupPctMode },
  { id: 'div',    label: 'MarkUp Divisor',      short: '03', desc: 'Divisor = 1 - (DF + DV + L) / 100',   component: DivisorMode   },
  { id: 'profit', label: 'Lucro',               short: '04', desc: 'Lucro unitario, total e margem',        component: ProfitMode    },
  { id: 'be',     label: 'Ponto de Equilibrio', short: '05', desc: 'PE = Custos Fixos / (PV - Custo Var.)', component: BreakEvenMode },
];

const TIPO_TO_MODE = { sell: 'sell', mkup: 'mkup', div: 'div', profit: 'profit', be: 'be' };

/* ══════════════════════════════
   MAIN SCREEN
══════════════════════════════ */
export default function CalculoScreen() {
  const [params, setParams] = useSearchParams();
  const tipo = params.get('tipo') || 'sell';
  const activeId = TIPO_TO_MODE[tipo] || 'sell';
  const active = MODES.find(m => m.id === activeId) || MODES[0];
  const ActiveComponent = active.component;

  function selectMode(id) { setParams({ tipo: id }); }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Navbar />
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '48px 32px 80px',
        display: 'grid', gridTemplateColumns: '260px minmax(0,1fr)', gap: 32,
        alignItems: 'start',
      }} className="calc-grid">
        <style>{`@media(max-width:720px){.calc-grid{grid-template-columns:1fr!important}}`}</style>

        {/* SIDEBAR */}
        <aside style={{ position: 'sticky', top: 80 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.muted, marginBottom: 12, textTransform: 'uppercase' }}>
            Calculos
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MODES.map(m => {
              const isActive = m.id === activeId;
              return (
                <button key={m.id} onClick={() => selectMode(m.id)} style={{
                  width: '100%', textAlign: 'left', border: 'none', borderRadius: 10, cursor: 'pointer',
                  padding: '12px 14px', background: isActive ? T.ink : 'transparent',
                  transition: 'background .15s',
                }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1.2, color: isActive ? T.acc : T.muted, textTransform: 'uppercase', marginBottom: 3 }}>{m.short}</div>
                  <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, color: isActive ? '#fff' : T.ink }}>{m.label}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN */}
        <main>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.muted, marginBottom: 10, textTransform: 'uppercase' }}>
            {active.short} — {active.id.toUpperCase()}
          </div>
          <h1 style={{
            margin: '0 0 6px', fontFamily: T.font, fontSize: 'clamp(26px, 3.5vw, 44px)',
            fontWeight: 500, letterSpacing: -1, color: T.ink, lineHeight: 1.1,
          }}>{active.label}</h1>
          <p style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, marginBottom: 28, lineHeight: 1.5 }}>{active.desc}</p>

          <div style={{ background: '#fff', border: `1px solid ${T.hair}`, borderRadius: 16, padding: '28px 28px' }}>
            <ActiveComponent key={activeId} />
          </div>
        </main>
      </div>
    </div>
  );
}
