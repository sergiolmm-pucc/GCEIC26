import PropTypes from 'prop-types';
import Campo from '../Campo.jsx';
import CamposTributarios from './CamposTributarios.jsx';
import Formulario from './Formulario.jsx';

export default function FormMargem({ form, onChange, onSubmit, onTrocarModo, carregando, erro }) {
  return (
    <Formulario
      titulo="Formulario de Margem"
      textoBotao="Calcular margem"
      carregando={carregando}
      erro={erro}
      onSubmit={onSubmit}
      onTrocarModo={onTrocarModo}
    >
      <Campo label="Preco de venda" value={form.precoVenda} onChange={(valor) => onChange('precoVenda', valor)} />
      <Campo label="Custo unitario" value={form.custoUnitario} onChange={(valor) => onChange('custoUnitario', valor)} />
      <CamposTributarios form={form} onChange={onChange} icmsHint="Aliquota interestadual com origem em SP." />
    </Formulario>
  );
}

FormMargem.propTypes = {
  form: PropTypes.shape({
    precoVenda: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    custoUnitario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onTrocarModo: PropTypes.func.isRequired,
  carregando: PropTypes.bool.isRequired,
  erro: PropTypes.string
};
