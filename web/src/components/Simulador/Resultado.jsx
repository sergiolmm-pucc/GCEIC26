import React from 'react';
export default function Resultado({ data }) {
  if (!data) {
    return <p>Selecione um modo e execute um calculo para visualizar os resultados.</p>;
  }

  return (
    <dl className="result-list">
      {Object.entries(data).map(([chave, valor]) => (
        <div key={chave}>
          <dt>{formatarChave(chave)}</dt>
          <dd>{formatarValor(chave, valor)}</dd>
        </div>
      ))}
    </dl>
  );
}

function formatarChave(chave) {
  return chave.replace(/([A-Z])/g, ' $1').replace(/^./, (letra) => letra.toUpperCase());
}

function formatarValor(chave, valor) {
  if (typeof valor !== 'number') {
    return valor;
  }

  if (chave === 'quantidade') {
    return valor.toLocaleString('pt-BR');
  }

  if (chave.toLowerCase().includes('percentual') || chave === 'cargaTributaria') {
    return `${(valor * 100).toFixed(2)}%`;
  }

  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
