import PropTypes from 'prop-types';

export default function Campo({ label, value, onChange, step = '0.01', min = '0', hint, ...props }) {
  return (
    <label className="campo">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

Campo.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.string,
  min: PropTypes.string,
  hint: PropTypes.string
};
