import React from 'react';
import { icmsPorEstado } from '../../constants/icmsPorEstado.js';
import { regimesTributarios } from '../../constants/tributosFederais.js';

export default function ColaTributariaModal({
  aberto,
  onClose,
  onSelecionarAliquota,
  regimeTributario,
  onAlterarRegime,
  pisPercentual,
  cofinsPercentual
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cola-tributaria-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Cola Tributaria</p>
            <h3 id="cola-tributaria-title">Aliquotas de ICMS interestadual - origem SP</h3>
            <p className="modal-copy">
              Use a tabela abaixo para consultas com origem fixa em Sao Paulo. Clique em uma linha para preencher o
              ICMS automaticamente.
            </p>
          </div>
          <button type="button" className="secondary-button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="regime-switcher" role="group" aria-label="Regime tributario">
          {Object.values(regimesTributarios).map((regime) => (
            <button
              key={regime.id}
              type="button"
              className={`pill-button ${regimeTributario === regime.id ? 'selected' : ''}`}
              onClick={() => onAlterarRegime(regime.id)}
            >
              {regime.label}
            </button>
          ))}
        </div>

        <div className="tributos-federais">
          <div>
            <strong>PIS</strong>
            <span>{Number(pisPercentual).toFixed(2)}%</span>
          </div>
          <div>
            <strong>COFINS</strong>
            <span>{Number(cofinsPercentual).toFixed(2)}%</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Aliquota %</th>
              </tr>
            </thead>
            <tbody>
              {icmsPorEstado.map((item) => (
                <tr
                  key={item.sigla}
                  onClick={() => onSelecionarAliquota(item.aliquota)}
                  title={item.tooltip ?? `Aplicar ICMS de ${formatarAliquota(item.aliquota)} para ${item.sigla}`}
                >
                  <td>
                    <div className="uf-cell">
                      <strong>{item.sigla}</strong>
                      {item.badge ? <span className="uf-badge">{item.badge}</span> : null}
                    </div>
                  </td>
                  <td>{formatarAliquota(item.aliquota)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function formatarAliquota(aliquota) {
  return `${(aliquota * 100).toFixed(2)}%`;
}
