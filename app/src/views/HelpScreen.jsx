import { useState } from 'react';
import Navbar from '../components/Navbar';

const faqs = [
  { q: 'O que e MarkUp?',
    a: 'MarkUp e o indice aplicado sobre o custo de um produto para chegar ao preco de venda, cobrindo despesas e o lucro desejado. E diferente de margem: margem mede o lucro sobre o preco; markup mede sobre o custo.' },
  { q: 'Como uso o Divisor?',
    a: 'Informe o custo, suas despesas fixas e variaveis (em %) e o lucro desejado. O app calcula o divisor (1 - total%) e divide o custo por ele para sugerir o preco.' },
  { q: 'O que e Ponto de Equilibrio?',
    a: 'E a quantidade minima de unidades a vender para cobrir todos os custos fixos. Abaixo dele voce tem prejuizo; acima, comeca o lucro.' },
  { q: 'Os dados ficam salvos?',
    a: 'Nao. Este e um app de calculo, sem cadastro. Cada calculo e independente, basta atualizar os valores nos campos.' },
  { q: 'Como atualizar a senha?',
    a: 'A versao atual usa credenciais fixas, conforme requisito da disciplina (admin / admin). Uma versao futura permitira cadastro de usuarios.' },
  { q: 'Posso usar offline?',
    a: 'O modo Lucro e calculado localmente no navegador, sem conexao. Os demais modos requerem conexao com a API.' },
];

const steps = [
  ['01', 'Escolha',  'Selecione o tipo de calculo na barra lateral.'],
  ['02', 'Informe',  'Preencha os valores nos campos sublinhados.'],
  ['03', 'Calcule',  'Clique em Calcular — o resultado aparece no card destacado.'],
];

function HelpItem({ q, a, open, onClick }) {
  return (
    <div style={{ borderBottom: '1px solid var(--hair)' }}>
      <button onClick={onClick} style={{
        width: '100%', padding: '18px 0', background: 'none', border: 'none',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', textAlign: 'left',
      }}>
        <span style={{ fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink)', fontWeight: 500, flex: 1, paddingRight: 12 }}>{q}</span>
        <span style={{
          width: 22, height: 22, borderRadius: 11, border: '1px solid var(--hair)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none',
          color: 'var(--muted)', fontFamily: 'var(--font)', fontSize: 16, fontWeight: 300, flexShrink: 0,
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 0 18px 0', fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{a}</div>
      )}
    </div>
  );
}

export default function HelpScreen() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 80px' }}>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6, color: 'var(--muted)', marginBottom: 10 }}>
          DUVIDAS FREQUENTES
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--font)', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500,
          letterSpacing: -1.2, color: 'var(--ink)', lineHeight: 1.05, maxWidth: 720,
        }}>Ajuda & Inicio rapido.</h1>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
          {steps.map(([num, title, desc], i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--hair)', borderRadius: 14, padding: '24px 22px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1.4, color: 'var(--accent)', marginBottom: 16 }}>{num}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 18, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.2 }}>{title}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--muted)', marginTop: 8, lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase' }}>
            Perguntas
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--hair)', borderRadius: 14, padding: '4px 24px' }}>
            {faqs.map((f, i) => (
              <HelpItem key={i} q={f.q} a={f.a} open={open === i} onClick={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 40, padding: '24px 28px', borderRadius: 14, border: '1px solid var(--hair)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.4, color: 'var(--muted)', textTransform: 'uppercase' }}>Contato</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 16, color: 'var(--ink)', marginTop: 4 }}>suporte@markup.app</div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 0.5 }}>Respondemos em ate 48h uteis.</div>
        </div>
      </div>
    </div>
  );
}
