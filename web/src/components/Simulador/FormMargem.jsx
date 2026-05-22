import React from 'react';
import Campo from '../Campo.jsx';

export default function FormMargem({ form, onChange, onSubmit, onTrocarModo, carregando, erro }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="step-label">Step 2</p>
          <h3>Formulario de Margem</h3>
        </div>
        <button type="button" className="secondary-button" onClick={onTrocarModo}>
          &larr; Trocar modo
        </button>
      </div>

      <div className="field-grid">
        <Campo label="Preco de venda" value={form.precoVenda} onChange={(valor) => onChange('precoVenda', valor)} />
        <Campo
          label="Custo unitario"
          value={form.custoUnitario}
          onChange={(valor) => onChange('custoUnitario', valor)}
        />
        <Campo
          label="Quantidade"
          value={form.quantidade}
          onChange={(valor) => onChange('quantidade', valor)}
          step="1"
          min="1"
        />
        <Campo
          label="ICMS %"
          value={form.icmsPercentual}
          onChange={(valor) => onChange('icmsPercentual', valor)}
          hint="Aliquota interestadual com origem em SP."
        />
        <Campo label="PIS %" value={form.pisPercentual} onChange={(valor) => onChange('pisPercentual', valor)} />
        <Campo
          label="COFINS %"
          value={form.cofinsPercentual}
          onChange={(valor) => onChange('cofinsPercentual', valor)}
        />
        <Campo label="IPI %" value={form.ipiPercentual} onChange={(valor) => onChange('ipiPercentual', valor)} />
      </div>

      {erro ? <p className="error">{erro}</p> : null}

      <div className="actions">
        <button type="button" onClick={onSubmit} disabled={carregando}>
          {carregando ? 'Calculando...' : 'Calcular margem'}
        </button>
      </div>
    </section>
  );
}
