import React from 'react';
import Navbar from '../components/Navbar';
import './Sobre.css';

const integrantes = [
  {
    nome: 'Vinicius',
    papel: 'Backend / API',
    descricao: 'Responsável pelo servidor Node.js, Express, lógica de cálculo e testes unitários.',
    foto: 'https://ui-avatars.com/api/?name=Vinicius&background=e2b96f&color=1a1a2e&size=100',
  },
  {
    nome: 'Caio',
    papel: 'Frontend / React',
    descricao: 'Responsável pelas telas React, integração com a API e navegação do sistema.',
    foto: 'https://ui-avatars.com/api/?name=Caio&background=0f3460&color=e2b96f&size=100',
  },
  {
    nome: 'Joao',
    papel: 'Auxilio em ambas as partes',
    descricao: 'Responsável por auxiliar em ambas as partes do projeto, garantindo a integração e o funcionamento correto do sistema.',
    foto: 'https://ui-avatars.com/api/?name=Joaobackground=0f3460&color=e2b96f&size=100',
  },

];

function Sobre() {
  return (
    <div className="sobre-page">
      <Navbar />
      <div className="sobre-container">
        <div className="sobre-header">
          <h2>ℹ️ Sobre o Projeto</h2>
          <p>
            O <strong>Simulador IRP</strong> é um sistema web desenvolvido para calcular
            o Imposto de Renda Progressivo com base no salário informado,
            aplicando as faixas de tributação vigentes de forma clara e transparente.
          </p>
        </div>

        <h3 className="integrantes-titulo">👥 Equipe</h3>
        <div className="integrantes-grid">
          {integrantes.map((p, i) => (
            <div key={i} className="integrante-card">
              <img src={p.foto} alt={p.nome} className="integrante-foto" />
              <h4>{p.nome}</h4>
              <span className="integrante-papel">{p.papel}</span>
              <p>{p.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sobre;