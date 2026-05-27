import PropTypes from 'prop-types';
import Campo from '../Campo.jsx';
import CamposTributarios from './CamposTributarios.jsx';
import Formulario from './Formulario.jsx';

export default function FormPrecoBruto({ form, onChange, onSubmit, onTrocarModo, carregando, erro }) {
  return (
    <Formulario
      titulo="Formulario de Preco Bruto"
      textoBotao="Calcular preco bruto"
      carregando={carregando}
      erro={erro}
      onSubmit={onSubmit}
      onTrocarModo={onTrocarModo}
    >
      <Campo
        label="Preco liquido"
        value={form.precoLiquido}
        onChange={(valor) => onChange('precoLiquido', valor)}
        hint="Valor liquido desejado por unidade."
      />
      <CamposTributarios form={form} onChange={onChange} icmsHint="Digite o percentual em formato humano. Ex.: 18" />
    </Formulario>
  );
}

FormPrecoBruto.propTypes = {
  form: PropTypes.shape({
    precoLiquido: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onTrocarModo: PropTypes.func.isRequired,
  carregando: PropTypes.bool.isRequired,
  erro: PropTypes.string
};
