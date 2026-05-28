import { ReceiptText } from 'lucide-react';
import { useSimulador } from '../../hooks/useSimulador.js';
import ColaTributariaModal from './ColaTributariaModal.jsx';
import FormMargem from './FormMargem.jsx';
import FormPrecoBruto from './FormPrecoBruto.jsx';
import FormPrecoLiquido from './FormPrecoLiquido.jsx';
import ModoSelector from './ModoSelector.jsx';
import Resultado from './Resultado.jsx';

export default function Simulador() {
  const simulador = useSimulador();

  return (
    <div className="workspace">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Uso do aplicativo</p>
          <h2>Simulador financeiro de venda</h2>
          <p className="workspace-copy">
            Fluxo guiado em 3 passos com base tributaria validada pela planilha de referencia.
          </p>
        </div>
        <button type="button" className="secondary-button header-button" onClick={simulador.abrirColaTributaria}>
          <ReceiptText size={18} />
          Cola Tributaria
        </button>
      </header>

      <div className="calculator-grid guided-grid">
        <div className="guided-stack">
          <ModoSelector modoSelecionado={simulador.modoSelecionado} onSelecionarModo={simulador.selecionarModo} />
          {renderFormulario(simulador)}
        </div>

        <section className="panel result-panel" aria-live="polite">
          <p className="step-label">Step 3</p>
          <h3>Resultado</h3>
          <Resultado data={simulador.resultado} />
        </section>
      </div>

      <ColaTributariaModal
        aberto={simulador.colaTributariaAberta}
        onClose={simulador.fecharColaTributaria}
        onSelecionarAliquota={simulador.aplicarAliquotaIcms}
        regimeTributario={simulador.regimeTributario}
        onAlterarRegime={simulador.aplicarRegimeTributario}
        pisPercentual={simulador.form.pisPercentual}
        cofinsPercentual={simulador.form.cofinsPercentual}
      />
    </div>
  );
}

function renderFormulario(simulador) {
  if (simulador.modoSelecionado === 'precoBruto') {
    return (
      <FormPrecoBruto
        form={simulador.form}
        onChange={simulador.alterarCampo}
        onSubmit={simulador.executarCalculo}
        onTrocarModo={simulador.voltarSelecaoModo}
        carregando={simulador.carregando}
        erro={simulador.erro}
      />
    );
  }

  if (simulador.modoSelecionado === 'precoLiquido') {
    return (
      <FormPrecoLiquido
        form={simulador.form}
        onChange={simulador.alterarCampo}
        onSubmit={simulador.executarCalculo}
        onTrocarModo={simulador.voltarSelecaoModo}
        carregando={simulador.carregando}
        erro={simulador.erro}
      />
    );
  }

  if (simulador.modoSelecionado === 'margem') {
    return (
      <FormMargem
        form={simulador.form}
        onChange={simulador.alterarCampo}
        onSubmit={simulador.executarCalculo}
        onTrocarModo={simulador.voltarSelecaoModo}
        carregando={simulador.carregando}
        erro={simulador.erro}
      />
    );
  }

  return null;
}
