import { formatCurrency } from '../utils/formatters';

function renderValue(value) {
  if (typeof value === 'number') {
    return formatCurrency(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Nao';
  }

  return String(value);
}

export function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <section className="result-panel" aria-label="Resultado">
      <h2>Resultado</h2>
      <dl>
        {Object.entries(result).map(([key, value]) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return (
              <div className="result-group" key={key}>
                <dt>{key}</dt>
                <dd>
                  {Object.entries(value).map(([nestedKey, nestedValue]) => (
                    <span key={nestedKey}>
                      {nestedKey}: <strong>{renderValue(nestedValue)}</strong>
                    </span>
                  ))}
                </dd>
              </div>
            );
          }

          return (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{renderValue(value)}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
