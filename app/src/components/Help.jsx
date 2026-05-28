import React from 'react';
export default function Help() {
  return (
    <div className="workspace">
      <header>
        <p className="eyebrow">Help</p>
        <h2>Como usar</h2>
      </header>
      <section className="panel help-panel">
        <p>Escolha um modo no passo 1 e preencha apenas o formulario necessario no passo 2.</p>
        <p>Preco Bruto faz o gross-up do preco liquido com ICMS, PIS, COFINS e IPI.</p>
        <p>Preco Liquido aplica o inverso matematico da formula tributaria para descobrir o liquido.</p>
        <p>Margem reaproveita o novo calculo do preco liquido para estimar lucro, margem e markup.</p>
        <p>Use a Cola Tributaria para consultar ICMS interestadual com origem em SP e preencher o ICMS com um clique.</p>
      </section>
    </div>
  );
}
