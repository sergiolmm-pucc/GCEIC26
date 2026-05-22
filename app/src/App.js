import React, { useState, useEffect } from 'react';
import './App.css';

// =====================
// POO: Classe de Usuário
// =====================
class Usuario {
  constructor(login, nome) {
    this.login = login;
    this.nome = nome;
    this.autenticadoEm = new Date().toISOString();
  }
}

// =====================
// POO: Calculadoras (espelham o backend)
// =====================
class FinanciamentoBase {
  constructor(valorImovel, entrada, taxaAnual, prazoMeses) {
    this.valorFinanciado = valorImovel - entrada;
    this.taxaMensal = taxaAnual / 100 / 12;
    this.prazoMeses = prazoMeses;
  }
}

class CalcSAC extends FinanciamentoBase {
  calcular() {
    const amort = this.valorFinanciado / this.prazoMeses;
    const parcelas = [];
    let saldo = this.valorFinanciado;
    for (let m = 1; m <= this.prazoMeses; m++) {
      const juros = saldo * this.taxaMensal;
      const prestacao = amort + juros;
      saldo -= amort;
      parcelas.push({ mes: m, amortizacao: amort, juros, prestacao, saldoDevedor: Math.max(saldo, 0) });
    }
    return parcelas;
  }
}

class CalcPRICE extends FinanciamentoBase {
  calcular() {
    const i = this.taxaMensal;
    const n = this.prazoMeses;
    const pv = this.valorFinanciado;
    const pmt = (pv * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const parcelas = [];
    let saldo = pv;
    for (let m = 1; m <= n; m++) {
      const juros = saldo * i;
      const amort = pmt - juros;
      saldo -= amort;
      parcelas.push({ mes: m, amortizacao: amort, juros, prestacao: pmt, saldoDevedor: Math.max(saldo, 0) });
    }
    return parcelas;
  }
}

// =====================
// Utilitários
// =====================
const fmt = (v) =>
  'R$ ' + parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CREDENCIAIS = { login: 'admin', senha: '1234' };

// =====================
// COMPONENTE: Splash
// =====================
function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splash">
      <div className="splash-logo"></div>
      <h1>FinanciApp</h1>
      <p>Cálculo de Financiamento Imobiliário</p>
      <div className="splash-bar"><div className="splash-fill" /></div>
    </div>
  );
}

// =====================
// COMPONENTE: Login
// =====================
function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = () => {
    if (user === CREDENCIAIS.login && pass === CREDENCIAIS.senha) {
      onLogin(new Usuario(user, 'Administrador'));
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-icon"></div>
        <h2>Entrar</h2>
        <p className="login-sub">Acesse o FinanciApp</p>
        <div className="field">
          <label>Usuário</label>
          <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        {erro && <p className="erro">{erro}</p>}
        <button className="btn-primary" onClick={handleLogin}>Entrar</button>
        <p className="hint">user: admin · senha: 1234</p>
      </div>
    </div>
  );
}

// =====================
// COMPONENTE: Tabela de Parcelas
// =====================
function TabelaParcelas({ parcelas }) {
  const [mostrar, setMostrar] = useState(12);
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Mês</th><th>Amortização</th><th>Juros</th><th>Prestação</th><th>Saldo Devedor</th></tr>
        </thead>
        <tbody>
          {parcelas.slice(0, mostrar).map(p => (
            <tr key={p.mes}>
              <td>{p.mes}</td>
              <td>{fmt(p.amortizacao)}</td>
              <td>{fmt(p.juros)}</td>
              <td>{fmt(p.prestacao)}</td>
              <td>{fmt(p.saldoDevedor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {mostrar < parcelas.length && (
        <button className="btn-sec" onClick={() => setMostrar(parcelas.length)}>
          Ver todas as {parcelas.length} parcelas
        </button>
      )}
    </div>
  );
}

// =====================
// COMPONENTE: Calculadora SAC
// =====================
function CalcSACPage() {
  const [form, setForm] = useState({ valorImovel: 500000, entrada: 100000, taxaAnual: 10.5, prazoMeses: 360 });
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const c = new CalcSAC(+form.valorImovel, +form.entrada, +form.taxaAnual, +form.prazoMeses);
    const parcelas = c.calcular();
    const totalJuros = parcelas.reduce((s, p) => s + p.juros, 0);
    setResultado({ parcelas, totalJuros, valorFinanciado: +form.valorImovel - +form.entrada });
  };

  return (
    <div className="page">
      <h2 className="page-title">Sistema SAC</h2>
      <div className="card">
        <div className="form-grid">
          {[['valorImovel','Valor do Imóvel (R$)'], ['entrada','Entrada (R$)'],
            ['taxaAnual','Taxa Anual (%)'], ['prazoMeses','Prazo (meses)']].map(([k, l]) => (
            <div className="form-field" key={k}>
              <label>{l}</label>
              <input type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button className="btn-primary btn-calc" onClick={calcular}>Calcular SAC</button>
      </div>
      {resultado && <>
        <div className="metric-grid">
          <div className="metric"><div className="m-label">Valor Financiado</div><div className="m-value blue">{fmt(resultado.valorFinanciado)}</div></div>
          <div className="metric"><div className="m-label">1ª Parcela</div><div className="m-value">{fmt(resultado.parcelas[0].prestacao)}</div></div>
          <div className="metric"><div className="m-label">Última Parcela</div><div className="m-value green">{fmt(resultado.parcelas[resultado.parcelas.length - 1].prestacao)}</div></div>
          <div className="metric"><div className="m-label">Total de Juros</div><div className="m-value amber">{fmt(resultado.totalJuros)}</div></div>
        </div>
        <div className="card">
          <h3>Tabela de parcelas</h3>
          <TabelaParcelas parcelas={resultado.parcelas} />
        </div>
      </>}
    </div>
  );
}

// =====================
// COMPONENTE: Calculadora PRICE
// =====================
function CalcPRICEPage() {
  const [form, setForm] = useState({ valorImovel: 500000, entrada: 100000, taxaAnual: 10.5, prazoMeses: 360 });
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const c = new CalcPRICE(+form.valorImovel, +form.entrada, +form.taxaAnual, +form.prazoMeses);
    const parcelas = c.calcular();
    const totalPago = parcelas.reduce((s, p) => s + p.prestacao, 0);
    const totalJuros = parcelas.reduce((s, p) => s + p.juros, 0);
    setResultado({ parcelas, totalPago, totalJuros, valorFinanciado: +form.valorImovel - +form.entrada });
  };

  return (
    <div className="page">
      <h2 className="page-title">Tabela PRICE</h2>
      <div className="card">
        <div className="form-grid">
          {[['valorImovel','Valor do Imóvel (R$)'], ['entrada','Entrada (R$)'],
            ['taxaAnual','Taxa Anual (%)'], ['prazoMeses','Prazo (meses)']].map(([k, l]) => (
            <div className="form-field" key={k}>
              <label>{l}</label>
              <input type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button className="btn-primary btn-calc" onClick={calcular}>Calcular PRICE</button>
      </div>
      {resultado && <>
        <div className="metric-grid">
          <div className="metric"><div className="m-label">Valor Financiado</div><div className="m-value blue">{fmt(resultado.valorFinanciado)}</div></div>
          <div className="metric"><div className="m-label">Parcela Fixa</div><div className="m-value">{fmt(resultado.parcelas[0].prestacao)}</div></div>
          <div className="metric"><div className="m-label">Total Pago</div><div className="m-value amber">{fmt(resultado.totalPago)}</div></div>
          <div className="metric"><div className="m-label">Total de Juros</div><div className="m-value amber">{fmt(resultado.totalJuros)}</div></div>
        </div>
        <div className="card">
          <h3>Tabela de parcelas</h3>
          <TabelaParcelas parcelas={resultado.parcelas} />
        </div>
      </>}
    </div>
  );
}

// =====================
// COMPONENTE: Comparação
// =====================
function CompararPage() {
  const [form, setForm] = useState({ valorImovel: 500000, entrada: 100000, taxaAnual: 10.5, prazoMeses: 360 });
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const sac = new CalcSAC(+form.valorImovel, +form.entrada, +form.taxaAnual, +form.prazoMeses).calcular();
    const price = new CalcPRICE(+form.valorImovel, +form.entrada, +form.taxaAnual, +form.prazoMeses).calcular();
    const tSAC = sac.reduce((s, p) => s + p.prestacao, 0);
    const tPRC = price.reduce((s, p) => s + p.prestacao, 0);
    setResultado({ tSAC, tPRC, p1SAC: sac[0].prestacao, p1PRC: price[0].prestacao, economia: Math.abs(tPRC - tSAC) });
  };

  return (
    <div className="page">
      <h2 className="page-title">Comparar SAC × PRICE</h2>
      <div className="card">
        <div className="form-grid">
          {[['valorImovel','Valor do Imóvel (R$)'], ['entrada','Entrada (R$)'],
            ['taxaAnual','Taxa Anual (%)'], ['prazoMeses','Prazo (meses)']].map(([k, l]) => (
            <div className="form-field" key={k}>
              <label>{l}</label>
              <input type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button className="btn-primary btn-calc" onClick={calcular}>Comparar</button>
      </div>
      {resultado && <>
        <div className="compare-grid">
          <div className="compare-sac">
            <div className="comp-title">SAC</div>
            <div className="comp-val">{fmt(resultado.tSAC)}</div>
            <div className="comp-sub">total pago</div>
            <div className="comp-extra">1ª parcela: {fmt(resultado.p1SAC)}</div>
          </div>
          <div className="compare-price">
            <div className="comp-title">PRICE</div>
            <div className="comp-val">{fmt(resultado.tPRC)}</div>
            <div className="comp-sub">total pago</div>
            <div className="comp-extra">parcela fixa: {fmt(resultado.p1PRC)}</div>
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', marginTop: 12 }}>
          <p className="rec-label">Sistema recomendado</p>
          <span className="rec-badge">{resultado.tSAC < resultado.tPRC ? 'SAC' : 'PRICE'} — recomendado</span>
          <p className="rec-eco">Economia de <strong>{fmt(resultado.economia)}</strong> no total</p>
        </div>
      </>}
    </div>
  );
}

// =====================
// COMPONENTE: Capacidade
// =====================
function CapacidadePage() {
  const [form, setForm] = useState({ rendaMensal: 8000, taxaAnual: 10.5, prazoMeses: 360 });
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const parcelaMax = +form.rendaMensal * 0.30;
    const i = +form.taxaAnual / 100 / 12;
    const n = +form.prazoMeses;
    const maxFin = (parcelaMax * (Math.pow(1 + i, n) - 1)) / (i * Math.pow(1 + i, n));
    setResultado({ parcelaMax, maxFin });
  };

  return (
    <div className="page">
      <h2 className="page-title">Capacidade de Compra</h2>
      <div className="card">
        <div className="form-grid">
          {[['rendaMensal','Renda Mensal Bruta (R$)'], ['taxaAnual','Taxa Anual (%)'],
            ['prazoMeses','Prazo (meses)']].map(([k, l]) => (
            <div className="form-field" key={k}>
              <label>{l}</label>
              <input type="number" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button className="btn-primary btn-calc" onClick={calcular}>Simular</button>
      </div>
      {resultado && <>
        <div className="metric-grid">
          <div className="metric"><div className="m-label">Parcela Máx. (30%)</div><div className="m-value blue">{fmt(resultado.parcelaMax)}</div></div>
          <div className="metric"><div className="m-label">Valor Máx. Financiável</div><div className="m-value green">{fmt(resultado.maxFin)}</div></div>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
            Recomendação do Banco Central: a parcela não deve ultrapassar <strong>30%</strong> da renda mensal bruta.
          </p>
        </div>
      </>}
    </div>
  );
}

// =====================
// COMPONENTE: Sobre
// =====================
function SobrePage() {
  const equipe = [
    { foto: '/gabriel.jpg', nome: 'Gabriel M Campos', papel: 'Fullstack' },
  ];
  return (
    <div className="page">
      <h2 className="page-title">Sobre</h2>
      <div className="team-grid">
        {equipe.map(m => (
          <div
            className={`member-card${m.foto ? ' member-card--foto' : ''}`}
            key={m.nome}
            style={m.foto ? { backgroundImage: `url(${m.foto})` } : {}}
          >
            {!m.foto && <div className="avatar" style={{ background: m.cor, color: m.txt }}>{m.iniciais}</div>}
            <div className="member-info">
              <p className="member-nome">{m.nome}</p>
              <span className="member-papel">{m.papel}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Sobre o projeto</h3>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginTop: 8 }}>
          FinanciApp calcula juros e parcelas de financiamento imobiliário pelos sistemas SAC e PRICE.
          Desenvolvido em Node.js (backend) e React (frontend) com princípios de POO.
        </p>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>Integrante</h3>
        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginTop: 8 }}>
          Gabriel Medeia de Campos: Realizei sozinho o projeto.
        </p>
      </div>
    </div>
  );
}

// =====================
// COMPONENTE: Help
// =====================
function HelpPage() {
  const itens = [
    { icon: '', titulo: 'O que é o Sistema SAC?', texto: 'No SAC (Sistema de Amortização Constante), a amortização é sempre igual. Os juros e a prestação diminuem mês a mês. A primeira parcela é mais alta, mas o total pago é menor.' },
    { icon: '', titulo: 'O que é a Tabela PRICE?', texto: 'Na Tabela PRICE (Sistema Francês), a prestação é fixa durante todo o contrato. Os juros são maiores no início e a amortização cresce. Mais fácil de planejar, porém o total pago costuma ser maior.' },
    { icon: '', titulo: 'Como usar a capacidade de compra?', texto: 'Informe sua renda mensal bruta. O app calcula a parcela máxima recomendada (30% da renda, conforme Banco Central) e o maior valor que você pode financiar.' },
  ];
  return (
    <div className="page">
      <h2 className="page-title">Ajuda</h2>
      {itens.map(item => (
        <div className="help-item" key={item.titulo}>
          <h4><span>{item.icon}</span> {item.titulo}</h4>
          <p>{item.texto}</p>
        </div>
      ))}
    </div>
  );
}

// =====================
// COMPONENTE: App principal
// =====================
const MENUS = [
  { id: 'sac', label: 'SAC', icon: '' },
  { id: 'price', label: 'PRICE', icon: '' },
  { id: 'comparar', label: 'Comparar', icon: '' },
  { id: 'capacidade', label: 'Capacidade', icon: '' },
];

const TITULOS = { sac: 'Sistema SAC', price: 'Tabela PRICE', comparar: 'SAC × PRICE', capacidade: 'Capacidade', sobre: 'Sobre', help: 'Ajuda' };

export default function App() {
  const [tela, setTela] = useState('splash');
  const [usuario, setUsuario] = useState(null);
  const [aba, setAba] = useState('home');
  const [calcAtivo, setCalcAtivo] = useState(null);

  const handleLogin = (u) => { setUsuario(u); setTela('app'); };
  const handleLogout = () => { setUsuario(null); setTela('login'); };

  const navTo = (p) => { setAba(p); setCalcAtivo(null); };
  const abrirCalc = (id) => { setCalcAtivo(id); setAba('calc'); };

  if (tela === 'splash') return <Splash onDone={() => setTela('login')} />;
  if (tela === 'login') return <Login onLogin={handleLogin} />;

  const titulo = calcAtivo ? TITULOS[calcAtivo] : (aba === 'home' ? 'Financiamentos' : TITULOS[aba] || '');

  return (
    <div className="app-shell">
      <div className="topbar">
        <span className="topbar-title">{titulo}</span>
        <button className="topbar-logout" onClick={handleLogout} title="Sair">Sair</button>
      </div>

      <div className="content">
        {aba === 'home' && !calcAtivo && (
          <div className="page">
            <p className="section-title">Calculadoras</p>
            {MENUS.map(m => (
              <div className="menu-card" key={m.id} onClick={() => abrirCalc(m.id)}>
                <span className="menu-icon">{m.icon}</span>
                <div>
                  <p className="menu-nome">{TITULOS[m.id]}</p>
                  <p className="menu-desc">
                    {m.id === 'sac' && 'Amortização constante, parcelas decrescentes'}
                    {m.id === 'price' && 'Parcelas fixas, sistema francês'}
                    {m.id === 'comparar' && 'Encontre o melhor sistema para você'}
                    {m.id === 'capacidade' && 'Quanto posso financiar pela minha renda?'}
                  </p>
                </div>
                <span className="menu-arrow">›</span>
              </div>
            ))}
          </div>
        )}

        {aba === 'calc' && calcAtivo && (
          <>
            <button className="btn-voltar" onClick={() => navTo('home')}>← Voltar</button>
            {calcAtivo === 'sac' && <CalcSACPage />}
            {calcAtivo === 'price' && <CalcPRICEPage />}
            {calcAtivo === 'comparar' && <CompararPage />}
            {calcAtivo === 'capacidade' && <CapacidadePage />}
          </>
        )}

        {aba === 'sobre' && <SobrePage />}
        {aba === 'help' && <HelpPage />}
      </div>

      <nav className="bottomnav">
        {[['home','','Início'], ['sobre','','Sobre'], ['help','','Ajuda']].map(([id, ic, lb]) => (
          <button key={id} className={`nav-item ${aba === id && !calcAtivo ? 'active' : ''}`} onClick={() => navTo(id)}>
            <span>{ic}</span>{lb}
          </button>
        ))}
      </nav>
    </div>
  );
}

export { FinanciamentoBase, CalcSAC, CalcPRICE };
