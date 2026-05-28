import React from 'react';
import Navbar from '../components/Navbar';
import './Help.css';

const topicos = [
  {
    icone: '📌',
    titulo: 'O que é o Simulador IRP?',
    conteudo:
      'É um sistema que calcula automaticamente o Imposto de Renda Progressivo com base no seu salário bruto, mostrando o valor descontado e o salário líquido final.',
  },
  {
    icone: '🔢',
    titulo: 'Como usar o sistema?',
    conteudo:
      '1. Faça login com as credenciais fornecidas.\n2. Na tela principal, informe seu salário bruto no campo indicado.\n3. Clique em "Calcular Imposto".\n4. O sistema exibirá o imposto retido, o salário líquido e a faixa tributária aplicada.',
  },
  {
    icone: '📊',
    titulo: 'O que é o Imposto Progressivo?',
    conteudo:
      'É um modelo de tributação em que quem ganha mais paga uma alíquota maior. Salários menores são isentos ou pagam menos imposto, garantindo mais justiça fiscal.',
  },
  {
    icone: '📋',
    titulo: 'Tabela de Faixas',
    conteudo: 'tabela',
  },
];

function Help() {
  return (
    <div className="help-page">
      <Navbar />
      <div className="help-container">
        <h2 className="help-titulo">❓ Ajuda & Documentação</h2>
        <div className="topicos-list">
          {topicos.map((t, i) => (
            <div key={i} className="topico-card">
              <div className="topico-header">
                <span className="topico-icone">{t.icone}</span>
                <h3>{t.titulo}</h3>
              </div>
              {t.conteudo === 'tabela' ? (
                <table className="help-tabela">
                  <thead>
                    <tr>
                      <th>Faixa Salarial</th>
                      <th>Alíquota</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Até R$ 2.500</td>
                      <td className="verde">Isento (0%)</td>
                    </tr>
                    <tr>
                      <td>R$ 2.500 – R$ 5.000</td>
                      <td className="amarelo">7,5%</td>
                    </tr>
                    <tr>
                      <td>Acima de R$ 5.000</td>
                      <td className="vermelho">15%</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="topico-conteudo" style={{ whiteSpace: 'pre-line' }}>
                  {t.conteudo}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Help;