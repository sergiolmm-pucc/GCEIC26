import { useEffect, useMemo, useState } from 'react';
import { calculators } from '../data/calculators';
import { ResultPanel } from '../components/ResultPanel';

function getInitialValues(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue;
    return acc;
  }, {});
}

function normalizePayload(values, fields) {
  return fields.reduce((acc, field) => {
    const value = values[field.name];
    acc[field.name] = field.type === 'number' ? Number(value) : value;
    return acc;
  }, {});
}

export function CalculatorPage({ type }) {
  const calculator = calculators[type];
  const [values, setValues] = useState(() => getInitialValues(calculator.fields));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const payload = useMemo(
    () => normalizePayload(values, calculator.fields),
    [calculator.fields, values],
  );

  useEffect(() => {
    setValues(getInitialValues(calculator.fields));
    setResult(null);
    setError('');
    setLoading(false);
  }, [calculator]);

  function handleChange(field, event) {
    const value = field.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field.name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await calculator.action(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Equipe ETEC</p>
        <h1>{calculator.title}</h1>
        <p>{calculator.description}</p>
      </header>

      <div className="work-area">
        <form className="form-panel" onSubmit={handleSubmit}>
          {calculator.fields.map((field) => (
            <label className={field.type === 'checkbox' ? 'check-field' : 'field'} key={field.name}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={values[field.name]}
                  onChange={(event) => handleChange(field, event)}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  name={field.name}
                  type="checkbox"
                  checked={values[field.name]}
                  onChange={(event) => handleChange(field, event)}
                />
              ) : (
                <input
                  name={field.name}
                  type="number"
                  min="0"
                  step="0.01"
                  value={values[field.name]}
                  onChange={(event) => handleChange(field, event)}
                  required
                />
              )}
            </label>
          ))}
          {error ? <div className="alert">{error}</div> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </form>

        <ResultPanel result={result} />
      </div>
    </section>
  );
}
