import PropTypes from 'prop-types';
import Campo from '../Campo.jsx';
import CamposTributarios from './CamposTributarios.jsx';
import Formulario from './Formulario.jsx';

export default function FormPrecoLiquido({ form, onChange, onSubmit, onTrocarModo, carregando, erro }) {
  return (
    <Formulario
      titulo="Formulario de Preco Liquido"
      textoBotao="Calcular preco liquido"
      carregando={carregando}
      erro={erro}
      onSubmit={onSubmit}
      onTrocarModo={onTrocarModo}
    >
      <Campo
        label="Preco bruto"
        value={form.precoBruto}
        onChange={(valor) => onChange('precoBruto', valor)}
        hint="Valor bruto sem IPI por unidade."
      />
      <CamposTributarios form={form} onChange={onChange} icmsHint="Use a Cola Tributaria para preencher pela origem SP." />
    </Formulario>
  );
}

FormPrecoLiquido.propTypes = {
  form: PropTypes.shape({
    precoBruto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onTrocarModo: PropTypes.func.isRequired,
  carregando: PropTypes.bool.isRequired,
  erro: PropTypes.string
};
