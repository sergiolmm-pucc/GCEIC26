import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Calculator, HelpCircle, Info, LogOut, UserRound } from 'lucide-react';
import { calcularMargem, calcularPrecoBruto, calcularPrecoLiquido } from './api.js';

const credenciais = {
  usuario: 'admin',
  senha: '123456'
};

const estadoInicial = {
  precoBruto: 100,
  precoLiquidoDesejado: 85,
  precoVenda: 120,
  custoUnitario: 70,
  quantidade: 1,
  descontoPercentual: 10,
  impostoPercentual: 5,
  taxaFixa: 2
};

export default function App() {
  const [splash, setSplash] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [tela, setTela] = useState('simulador');
  const [form, setForm] = useState(estadoInicial);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (splash) {
    return <SplashScreen />;
  }

  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />;
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">PBL</p>
          <h1>Preco Bruto e Liquido</h1>
        </div>
        <nav aria-label="Navegacao principal">
          <button className={tela === 'simulador' ? 'active' : ''} onClick={() => setTela('simulador')}>
            <Calculator size={18} />
            Simulador
          </button>
          <button className={tela === 'sobre' ? 'active' : ''} onClick={() => setTela('sobre')}>
            <Info size={18} />
            Sobre
          </button>
          <button className={tela === 'help' ? 'active' : ''} onClick={() => setTela('help')}>
            <HelpCircle size={18} />
            Help
          </button>
        </nav>
        <button className="logout" onClick={() => setAutenticado(false)}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <section className="content">
        {tela === 'simulador' && <Simulador form={form} setForm={setForm} />}
        {tela === 'sobre' && <Sobre />}
        {tela === 'help' && <Help />}
      </section>
    </main>
  );
}

function SplashScreen() {
  return (
    <section className="splash">
      <div className="splash-mark">PBL</div>
      <h1>Simulador de Preco</h1>
      <p>Calculando preco bruto, liquido, lucro e margem.</p>
    </section>
  );
}

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function submit(event) {
    event.preventDefault();
    if (usuario.trim() === credenciais.usuario && senha === credenciais.senha) {
      setErro('');
      onLogin();
      return;
    }
    setErro('Usuario ou senha invalido.');
  }

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={submit}>
        <UserRound size={34} />
        <h1>Entrar</h1>
        <label>
          Usuario
          <input value={usuario} onChange={(event) => setUsuario(event.target.value)} autoComplete="username" />
        </label>
        <label>
          Senha
          <input
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </label>
        {erro && <p className="error">{erro}</p>}
        <button type="submit">Acessar</button>
        <p className="test-credentials">
          Acesso para teste: usuario <strong>{credenciais.usuario}</strong> / senha{' '}
          <strong>{credenciais.senha}</strong>
        </p>
      </form>
    </section>
  );
}

function Simulador({ form, setForm }) {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const camposBase = useMemo(
    () => [
      ['quantidade', 'Quantidade'],
      ['descontoPercentual', 'Desconto %'],
      ['impostoPercentual', 'Imposto %'],
      ['taxaFixa', 'Taxa fixa un.']
    ],
    []
  );

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function executar(calculo) {
    setCarregando(true);
    setErro('');
    try {
      const payload = converterNumeros(form);
      const data =
        calculo === 'liquido'
          ? await calcularPrecoLiquido(payload)
          : calculo === 'bruto'
            ? await calcularPrecoBruto(payload)
            : await calcularMargem(payload);
      setResultado(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="workspace">
      <header>
        <p className="eyebrow">Uso do aplicativo</p>
        <h2>Simulador financeiro de venda</h2>
      </header>

      <div className="calculator-grid">
        <section className="panel">
          <h3>Entradas</h3>
          <div className="field-grid">
            <Campo label="Preco bruto" value={form.precoBruto} onChange={(v) => alterar('precoBruto', v)} />
            <Campo
              label="Liquido desejado"
              value={form.precoLiquidoDesejado}
              onChange={(v) => alterar('precoLiquidoDesejado', v)}
            />
            <Campo label="Preco venda" value={form.precoVenda} onChange={(v) => alterar('precoVenda', v)} />
            <Campo label="Custo unitario" value={form.custoUnitario} onChange={(v) => alterar('custoUnitario', v)} />
            {camposBase.map(([campo, label]) => (
              <Campo key={campo} label={label} value={form[campo]} onChange={(v) => alterar(campo, v)} />
            ))}
          </div>
          {erro && <p className="error">{erro}</p>}
          <div className="actions">
            <button onClick={() => executar('liquido')} disabled={carregando}>Preco liquido</button>
            <button onClick={() => executar('bruto')} disabled={carregando}>Preco bruto</button>
            <button onClick={() => executar('margem')} disabled={carregando}>Margem</button>
          </div>
        </section>

        <section className="panel result-panel" aria-live="polite">
          <h3>Resultado</h3>
          {resultado ? <Resultado data={resultado} /> : <p>Execute um calculo para visualizar os valores.</p>}
        </section>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input type="number" min="0" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Resultado({ data }) {
  return (
    <dl className="result-list">
      {Object.entries(data).map(([chave, valor]) => (
        <div key={chave}>
          <dt>{formatarChave(chave)}</dt>
          <dd>{typeof valor === 'number' ? formatarMoedaOuPercentual(chave, valor) : valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Sobre() {
  return (
    <div className="workspace">
      <header>
        <p className="eyebrow">Sobre</p>
        <h2>Equipe do projeto</h2>
      </header>
      <section className="about-layout">
        <img src="/foto equipe.jpeg" alt="Foto da equipe" />
        <div>
          <h3>Simulador de Preco Bruto e Liquido</h3>
          <p>
            Projeto desenvolvido para calcular valores de venda considerando desconto, imposto, taxa fixa,
            preco liquido, preco bruto necessario e margem de lucro.
          </p>
          <ul>
            <li>Bruno Cruz: API de preco liquido e app React</li>
            <li>Felipe Pretoni: API de preco bruto e app React</li>
            <li>Victor Palma: API de margem</li>
            <li>Todos: design, testes e documentacao</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Help() {
  return (
    <div className="workspace">
      <header>
        <p className="eyebrow">Help</p>
        <h2>Como usar</h2>
      </header>
      <section className="panel help-panel">
        <p>Informe os valores de entrada e escolha o tipo de calculo desejado.</p>
        <p>O botao Preco liquido usa o preco bruto informado e desconta impostos, descontos e taxas.</p>
        <p>O botao Preco bruto calcula qual valor bruto precisa ser cobrado para atingir o liquido desejado.</p>
        <p>O botao Margem calcula lucro, margem percentual e markup usando o custo unitario.</p>
      </section>
    </div>
  );
}

function converterNumeros(objeto) {
  return Object.fromEntries(Object.entries(objeto).map(([chave, valor]) => [chave, Number(valor)]));
}

function formatarChave(chave) {
  return chave.replace(/([A-Z])/g, ' $1').replace(/^./, (letra) => letra.toUpperCase());
}

function formatarMoedaOuPercentual(chave, valor) {
  if (chave.toLowerCase().includes('percentual')) {
    return `${valor.toFixed(2)}%`;
  }
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
