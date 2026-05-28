import { useMemo, useState } from 'react';
import { calcularMargem, calcularPrecoBruto, calcularPrecoLiquido } from '../api.js';
import { regimeTributarioPadrao, regimesTributarios } from '../constants/tributosFederais.js';

const estadoInicial = {
  precoLiquido: 10,
  precoBruto: 13.44,
  precoVenda: 13.44,
  custoUnitario: 8,
  quantidade: 1,
  icmsPercentual: 18,
  pisPercentual: 1.65,
  cofinsPercentual: 7.6,
  ipiPercentual: 0
};

export function useSimulador() {
  const [modoSelecionado, setModoSelecionado] = useState('');
  const [form, setForm] = useState(estadoInicial);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [colaTributariaAberta, setColaTributariaAberta] = useState(false);
  const [regimeTributario, setRegimeTributario] = useState(regimeTributarioPadrao);

  const resumoTributario = useMemo(
    () => regimesTributarios[regimeTributario] ?? regimesTributarios[regimeTributarioPadrao],
    [regimeTributario]
  );

  function selecionarModo(modo) {
    setModoSelecionado(modo);
    setErro('');
  }

  function voltarSelecaoModo() {
    setModoSelecionado('');
    setErro('');
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor
    }));
  }

  function aplicarRegimeTributario(regimeId) {
    const regime = regimesTributarios[regimeId];

    if (!regime) {
      return;
    }

    setRegimeTributario(regimeId);
    setForm((atual) => ({
      ...atual,
      pisPercentual: regime.pisPercentual,
      cofinsPercentual: regime.cofinsPercentual
    }));
  }

  function abrirColaTributaria() {
    setColaTributariaAberta(true);
  }

  function fecharColaTributaria() {
    setColaTributariaAberta(false);
  }

  function aplicarAliquotaIcms(aliquota) {
    alterarCampo('icmsPercentual', formatarPercentualParaTela(aliquota));
    fecharColaTributaria();
  }

  async function executarCalculo() {
    if (!modoSelecionado) {
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const payload = montarPayload(modoSelecionado, form);
      const data = await calcularPorModo(modoSelecionado, payload);

      setResultado(data);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    modoSelecionado,
    form,
    resultado,
    erro,
    carregando,
    colaTributariaAberta,
    regimeTributario,
    resumoTributario,
    selecionarModo,
    voltarSelecaoModo,
    alterarCampo,
    aplicarRegimeTributario,
    abrirColaTributaria,
    fecharColaTributaria,
    aplicarAliquotaIcms,
    executarCalculo
  };
}

function calcularPorModo(modoSelecionado, payload) {
  if (modoSelecionado === 'precoBruto') {
    return calcularPrecoBruto(payload);
  }

  if (modoSelecionado === 'precoLiquido') {
    return calcularPrecoLiquido(payload);
  }

  return calcularMargem(payload);
}

function montarPayload(modoSelecionado, form) {
  const payloadBase = {
    quantidade: converterNumero(form.quantidade),
    icmsPercentual: converterPercentualParaFracao(form.icmsPercentual),
    pisPercentual: converterPercentualParaFracao(form.pisPercentual),
    cofinsPercentual: converterPercentualParaFracao(form.cofinsPercentual),
    ipiPercentual: converterPercentualParaFracao(form.ipiPercentual)
  };

  if (modoSelecionado === 'precoBruto') {
    return {
      ...payloadBase,
      precoLiquido: converterNumero(form.precoLiquido)
    };
  }

  if (modoSelecionado === 'precoLiquido') {
    return {
      ...payloadBase,
      precoBruto: converterNumero(form.precoBruto)
    };
  }

  return {
    ...payloadBase,
    precoVenda: converterNumero(form.precoVenda),
    custoUnitario: converterNumero(form.custoUnitario)
  };
}

function converterNumero(valor) {
  return Number(valor ?? 0);
}

function converterPercentualParaFracao(valor) {
  return Number(valor ?? 0) / 100;
}

function formatarPercentualParaTela(valor) {
  return Number((valor * 100).toFixed(2));
}
