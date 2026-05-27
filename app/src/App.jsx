import { useEffect, useMemo, useState } from 'react';

function resolveApiUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location.hostname.includes('gceic26-app.onrender.com')) {
    return 'https://gceic26.onrender.com';
  }
  return 'http://localhost:3001';
}

const API_URL = resolveApiUrl();
const SESSION_KEY = 'hourlycost-authenticated';

const initialForm = {
  salarioDesejado: '8000',
  diasTrabalhadosSemana: '5',
  horasTrabalhadasDia: '8',
  semanasFeriasAno: '4',
  percentualProdutivo: '75',
  despesasFixasMensais: '1500',
  reservaSeguranca: '500',
  margemLucroDesejada: '20',
  percentualImpostos: '6'
};

const team = [
  {
    name: 'Fernando Furlanetto',
    role: 'Mao de Obra e Encargos',
    contribution: 'Responsavel pelo endpoint POST /api/csh/labor-cost e pelos calculos de salario, ferias, 13o e horas faturaveis.'
  },
  {
    name: 'Matheus Augusto',
    role: 'Custos Fixos e Equilibrio',
    contribution: 'Responsavel pelo endpoint POST /api/csh/operating-cost e pelo rateio de despesas, reserva e ponto de equilibrio.'
  },
  {
    name: 'Raul Antonio',
    role: 'Markup e Impostos',
    contribution: 'Responsavel pelo endpoint POST /api/csh/final-price e pela margem de lucro, impostos por dentro e preco final.'
  }
];

function currency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function Splash() {
  return (
    <section className="splash" data-testid="splash-screen">
      <div className="splash-card">
        <strong>HourlyCost</strong>
        <span>Calculadora financeira de servicos</span>
        <div className="loader" aria-hidden="true"><span /></div>
      </div>
    </section>
  );
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    if (form.username === 'admin' && form.password === 'admin') {
      setError('');
      onLogin();
      return;
    }
    setError('Usuario ou senha invalidos');
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="eyebrow">GCEIC26 - Equipe 25</p>
        <h1>HourlyCost</h1>
        <p className="muted">Gestao de custo de servicos em horas.</p>
        {error && <div className="alert erro" role="alert">{error}</div>}
        <form id="loginForm" onSubmit={submit}>
          <label htmlFor="username">Usuario</label>
          <input id="username" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button id="btnLogin" type="submit">Entrar</button>
        </form>
        <p className="hint">Credenciais: <strong>admin</strong> / <strong>admin</strong></p>
      </section>
    </main>
  );
}

function Nav({ page, setPage, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <strong>HourlyCost</strong>
        <span>Equipe 25</span>
      </div>
      <nav aria-label="Navegacao principal">
        <button className={page === 'calculo' ? 'active' : ''} onClick={() => setPage('calculo')}>Calculadora</button>
        <button className={page === 'sobre' ? 'active' : ''} onClick={() => setPage('sobre')}>Sobre</button>
        <button className={page === 'ajuda' ? 'active' : ''} onClick={() => setPage('ajuda')}>Ajuda</button>
        <button onClick={onLogout}>Sair</button>
      </nav>
    </header>
  );
}

function Calculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const payload = useMemo(() => Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, Number(value)])
  ), [form]);

  async function calculate(event) {
    event?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/calcular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || 'Falha ao calcular');
      setResult(json.data);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-grid">
      <section className="panel">
        <p className="eyebrow">Calculadora</p>
        <h1>Custo de servicos em horas</h1>
        <p className="muted">Informe os dados para calcular o valor minimo e o preco sugerido da hora.</p>
        {error && <div className="alert" role="alert">{error}</div>}
        <form className="calc-form" onSubmit={calculate}>
          <Field label="Salario desejado" id="salarioDesejado" form={form} setForm={setForm} />
          <Field label="Dias trabalhados/semana" id="diasTrabalhadosSemana" form={form} setForm={setForm} />
          <Field label="Horas trabalhadas/dia" id="horasTrabalhadasDia" form={form} setForm={setForm} />
          <Field label="Semanas de ferias/ano" id="semanasFeriasAno" form={form} setForm={setForm} />
          <Field label="% produtivo" id="percentualProdutivo" form={form} setForm={setForm} />
          <Field label="Despesas fixas mensais" id="despesasFixasMensais" form={form} setForm={setForm} />
          <Field label="Reserva de seguranca" id="reservaSeguranca" form={form} setForm={setForm} />
          <Field label="Margem de lucro %" id="margemLucroDesejada" form={form} setForm={setForm} />
          <Field label="Impostos %" id="percentualImpostos" form={form} setForm={setForm} />
          <button id="btnCalcular" type="submit" disabled={loading}>{loading ? 'Calculando...' : 'Calcular'}</button>
        </form>
      </section>
      <section className="panel result-panel" aria-live="polite">
        <p className="eyebrow">Resultado</p>
        {result ? (
          <>
            <div className="hero-number" data-testid="preco-hora-final">{currency(result.precoHoraFinal)}</div>
            <p className="muted">Preco final sugerido por hora</p>
            <div className="result-sections">
              <section className="result-section" data-testid="secao-mao-de-obra">
                <h3>Mao de Obra</h3>
                <dl className="metrics">
                  <Metric label="Horas brutas/ano"      value={result.horasBrutasAno} />
                  <Metric label="Horas ferias/ano"       value={result.horasFeriasAno} />
                  <Metric label="Horas disponiveis/ano"  value={result.horasDisponiveisAno} />
                  <Metric label="Horas faturaveis/ano"   value={result.horasFaturaveisAno} />
                  <Metric label="Horas faturaveis/mes"   value={result.horasFaturaveisMes} />
                  <Metric label="Custo mao obra anual"   value={currency(result.custoMaoDeObraAnual)} />
                  <Metric label="Custo mao obra mensal"  value={currency(result.custoMaoDeObraMensal)} />
                  <Metric label="Valor hora base"        value={currency(result.valorHoraBase)} />
                </dl>
              </section>
              <section className="result-section" data-testid="secao-operacional">
                <h3>Custos Operacionais</h3>
                <dl className="metrics">
                  <Metric label="Despesa mensal total"   value={currency(result.despesaMensalTotal)} />
                  <Metric label="Custo operacional/hora" value={currency(result.custoOperacionalHora)} />
                  <Metric label="Custo hora equilibrio"  value={currency(result.custoHoraEquilibrio)} />
                </dl>
              </section>
              <section className="result-section" data-testid="secao-precificacao">
                <h3>Precificacao Final</h3>
                <dl className="metrics">
                  <Metric label="Preco hora limpo"       value={currency(result.precoHoraLimpo)} />
                  <Metric label="Faturamento mensal"     value={currency(result.faturamentoMensalProjetado)} />
                  <Metric label="Impostos mensais"       value={currency(result.impostoMensalProjetado)} />
                  <Metric label="Custos mensais totais"  value={currency(result.custosMensaisTotais)} />
                  <Metric label="Lucro liquido"          value={currency(result.lucroMensalLiquido)} />
                </dl>
              </section>
            </div>
          </>
        ) : (
          <p className="empty">Preencha os campos e clique em calcular para ver o preco da hora.</p>
        )}
      </section>
    </main>
  );
}

function Field({ id, label, form, setForm }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={id} type="number" step="0.01" min="0" value={form[id]} onChange={(e) => setForm({ ...form, [id]: e.target.value })} required />
    </label>
  );
}

function Metric({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

function About() {
  const [photoError, setPhotoError] = useState(false);

  return (
    <main className="content-page">
      <section className="panel">
        <p className="eyebrow">Sobre a equipe</p>
        <h1>Equipe desenvolvedora</h1>
        <div className="team-photo">
          {!photoError ? (
            <img src="/equipe.jpg" alt="Foto da equipe" onError={() => setPhotoError(true)} />
          ) : (
            <span>Foto da equipe pendente: adicionar app/public/equipe.jpg</span>
          )}
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <article className="member" key={member.name}>
              <h2>{member.name}</h2>
              <strong>{member.role}</strong>
              <p>{member.contribution}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Help() {
  return (
    <main className="content-page">
      <section className="panel">
        <p className="eyebrow">Ajuda</p>
        <h1>Como usar o HourlyCost</h1>
        <div className="help-list">
          <article>
            <h2>1. Informe a capacidade de trabalho</h2>
            <p>Preencha salario desejado, dias por semana, horas por dia, ferias e percentual produtivo para descobrir quantas horas realmente podem ser faturadas.</p>
          </article>
          <article>
            <h2>2. Informe custos do negocio</h2>
            <p>Adicione despesas fixas e reserva de seguranca para ratear o custo operacional dentro da hora cobrada.</p>
          </article>
          <article>
            <h2>3. Defina margem e impostos</h2>
            <p>A margem de lucro e a aliquota de impostos sao aplicadas para chegar ao preco final sugerido por hora.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const shouldShowSplash = import.meta.env.MODE !== 'test' && !navigator.webdriver;
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem(SESSION_KEY) === 'true');
  const [page, setPage] = useState('calculo');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), shouldShowSplash ? 1300 : 0);
    return () => clearTimeout(timer);
  }, [shouldShowSplash]);

  function login() {
    localStorage.setItem(SESSION_KEY, 'true');
    setAuthenticated(true);
    setPage('calculo');
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setPage('calculo');
  }

  if (showSplash) return <Splash />;
  if (!authenticated) return <Login onLogin={login} />;

  return (
    <>
      <Nav page={page} setPage={setPage} onLogout={logout} />
      {page === 'calculo' && <Calculator />}
      {page === 'sobre' && <About />}
      {page === 'ajuda' && <Help />}
    </>
  );
}
