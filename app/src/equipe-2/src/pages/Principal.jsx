import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { calcularImposto } from '../services/api';
import './Principal.css';

function Principal() {
  const [salario, setSalario] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCalcular = async (e) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    const valor = parseFloat(salario);
    if (!salario || isNaN(valor) || valor <= 0) {
      setErro('Informe um salário válido e positivo.');
      return;
    }

    setCarregando(true);
    try {
      const data = await calcularImposto(valor);
      setResultado(data);
    } catch (err) {
      setErro('Erro ao conectar com a API. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  const formatarMoeda = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getFaixa = (salario) => {
    if (salario <= 2500) return { faixa: 'Isento', aliquota: '0%', cor: '#68d391' };
    if (salario <= 5000) return { faixa: 'R$ 2.500 – R$ 5.000', aliquota: '7,5%', cor: '#f6e05e' };
    return { faixa: 'Acima de R$ 5.000', aliquota: '15%', cor: '#fc8181' };
  };

  return (
    <div className="principal-page">
      <Navbar />
      <div className="principal-container">
        <div className="principal-card">
          <h2 className="principal-title">💰 Calcular Imposto</h2>
          <form onSubmit={handleCalcular} className="principal-form">
            <div className="input-group">
              <label>Salário Bruto (R$)</label>
              <input
                type="number"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="Ex: 6000"
                min="0"
                step="0.01"
              />
            </div>
            {erro && <div className="erro-msg">{erro}</div>}
            <button type="submit" className="calcular-btn" disabled={carregando}>
              {carregando ? 'Calculando...' : 'Calcular Imposto'}
            </button>
          </form>
        </div>

        {resultado && (
          <div className="resultado-card">
            <h3 className="resultado-titulo">📋 Resultado do Cálculo</h3>

            <div className="resultado-grid">
              <div className="resultado-item salario">
                <span className="item-label">Salário Bruto</span>
                <span className="item-valor">{formatarMoeda(resultado.salario)}</span>
              </div>
              <div className="resultado-item imposto">
                <span className="item-label">Imposto Retido</span>
                <span className="item-valor negativo">{formatarMoeda(resultado.imposto)}</span>
              </div>
              <div className="resultado-item liquido">
                <span className="item-label">Salário Líquido</span>
                <span className="item-valor positivo">{formatarMoeda(resultado.liquido)}</span>
              </div>
            </div>

            <div className="detalhe-faixa">
              <h4>📊 Detalhamento da Faixa</h4>
              {(() => {
                const info = getFaixa(resultado.salario);
                return (
                  <div className="faixa-info" style={{ borderColor: info.cor }}>
                    <span className="faixa-label">Faixa: <strong>{info.faixa}</strong></span>
                    <span className="faixa-aliquota" style={{ color: info.cor }}>
                      Alíquota: {info.aliquota}
                    </span>
                  </div>
                );
              })()}
              <div className="tabela-faixas">
                <div className={`faixa-row ${resultado.salario <= 2500 ? 'ativa' : ''}`}>
                  <span>Até R$ 2.500</span><span className="verde">Isento</span>
                </div>
                <div className={`faixa-row ${resultado.salario > 2500 && resultado.salario <= 5000 ? 'ativa' : ''}`}>
                  <span>R$ 2.500 – R$ 5.000</span><span className="amarelo">7,5%</span>
                </div>
                <div className={`faixa-row ${resultado.salario > 5000 ? 'ativa' : ''}`}>
                  <span>Acima de R$ 5.000</span><span className="vermelho">15%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Principal;