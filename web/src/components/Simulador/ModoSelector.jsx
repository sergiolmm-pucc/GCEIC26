import React from 'react';
const modos = [
  {
    id: 'precoBruto',
    titulo: 'Preco Bruto',
    descricao: 'Calcula o bruto necessario para atingir um liquido alvo com tributacao e IPI.'
  },
  {
    id: 'precoLiquido',
    titulo: 'Preco Liquido',
    descricao: 'Aplica o inverso da formula tributaria para descobrir o liquido a partir do bruto.'
  },
  {
    id: 'margem',
    titulo: 'Margem',
    descricao: 'Usa o novo liquido tributario para calcular lucro, margem percentual e markup.'
  }
];

export default function ModoSelector({ modoSelecionado, onSelecionarModo }) {
  return (
    <section className="panel mode-panel">
      <p className="step-label">Step 1</p>
      <h3>Escolha o modo de calculo</h3>
      <div className="mode-grid">
        {modos.map((modo) => (
          <button
            key={modo.id}
            type="button"
            className={`mode-card ${modoSelecionado === modo.id ? 'selected' : ''}`}
            onClick={() => onSelecionarModo(modo.id)}
          >
            <strong>{modo.titulo}</strong>
            <span>{modo.descricao}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
