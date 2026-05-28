import React from 'react';
export default function Sobre() {
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
            Projeto academico para simulacao de preco de venda com base em tributacao de ICMS, PIS, COFINS,
            IPI e indicadores de margem.
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
