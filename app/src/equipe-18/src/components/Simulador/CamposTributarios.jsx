import PropTypes from 'prop-types';
import Campo from '../Campo.jsx';

export default function CamposTributarios({ form, onChange, icmsHint }) {
  return (
    <>
      <Campo
        label="Quantidade"
        value={form.quantidade}
        onChange={(valor) => onChange('quantidade', valor)}
        step="1"
        min="1"
      />
      <Campo label="ICMS %" value={form.icmsPercentual} onChange={(valor) => onChange('icmsPercentual', valor)} hint={icmsHint} />
      <Campo label="PIS %" value={form.pisPercentual} onChange={(valor) => onChange('pisPercentual', valor)} />
      <Campo label="COFINS %" value={form.cofinsPercentual} onChange={(valor) => onChange('cofinsPercentual', valor)} />
      <Campo label="IPI %" value={form.ipiPercentual} onChange={(valor) => onChange('ipiPercentual', valor)} />
    </>
  );
}

CamposTributarios.propTypes = {
  form: PropTypes.shape({
    quantidade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icmsPercentual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    pisPercentual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    cofinsPercentual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ipiPercentual: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  icmsHint: PropTypes.string.isRequired
};
