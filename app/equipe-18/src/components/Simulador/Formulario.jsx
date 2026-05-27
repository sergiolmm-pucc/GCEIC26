import PropTypes from 'prop-types';

export default function Formulario({
  titulo,
  textoBotao,
  carregando,
  erro,
  onSubmit,
  onTrocarModo,
  children
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="step-label">Step 2</p>
          <h3>{titulo}</h3>
        </div>
        <button type="button" className="secondary-button" onClick={onTrocarModo}>
          &larr; Trocar modo
        </button>
      </div>

      <div className="field-grid">{children}</div>

      {erro ? <p className="error">{erro}</p> : null}

      <div className="actions">
        <button type="button" onClick={onSubmit} disabled={carregando}>
          {carregando ? 'Calculando...' : textoBotao}
        </button>
      </div>
    </section>
  );
}

Formulario.propTypes = {
  titulo: PropTypes.string.isRequired,
  textoBotao: PropTypes.string.isRequired,
  carregando: PropTypes.bool.isRequired,
  erro: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onTrocarModo: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};
