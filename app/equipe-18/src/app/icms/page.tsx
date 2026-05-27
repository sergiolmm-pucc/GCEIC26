"use client";

import React, { useState } from "react";
import { useIcms } from "../../hooks/use-icms";
import { icmsSchema } from "../../schemas/icms-schema";

const ESTADOS_BRASILEIROS = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

const PRESETS = [
  {
    title: "SP - Venda padrão",
    desc: "Produto de R$ 1.000,00 com alíquota interna de São Paulo.",
    data: { productValue: "1000.00", state: "SP" },
  },
  {
    title: "RJ - Maior carga",
    desc: "Simulação rápida com alíquota interna do Rio de Janeiro.",
    data: { productValue: "2500.00", state: "RJ" },
  },
  {
    title: "SC - Operação enxuta",
    desc: "Produto de R$ 750,00 com alíquota interna de Santa Catarina.",
    data: { productValue: "750.00", state: "SC" },
  },
];

function formatBRL(value: string | number) {
  const numberValue = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numberValue)) {
    return "R$ 0,00";
  }

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function IcmsPage() {
  const { loading, result, error, calculateIcms } = useIcms();
  const [productValue, setProductValue] = useState("1000.00");
  const [state, setState] = useState("SP");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const submitCalculation = async (data: { productValue: string; state: string }) => {
    setFormErrors({});

    const parsedValue = Number(data.productValue);
    const validation = icmsSchema.safeParse({
      productValue: Number.isNaN(parsedValue) ? undefined : parsedValue,
      state: data.state,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = String(issue.path[0]);
        errors[path] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    await calculateIcms(validation.data);
  };

  const applyPreset = async (preset: { productValue: string; state: string }) => {
    setProductValue(preset.productValue);
    setState(preset.state);
    await submitCalculation(preset);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitCalculation({ productValue, state });
  };

  const taxLoad = result
    ? (Number(result.icmsAmount) / Number(result.total)) * 100
    : 0;

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl">
      <title>ICMS - Simulador Tributário</title>
      <meta name="description" content="Cálculo individual de ICMS por UF e valor de produto." />

      <header className="relative overflow-hidden bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-green-800/40">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-green-500/15 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-green-500/25">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Simulador estadual
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4 bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent">
              Cálculo de ICMS
            </h1>
            <p className="text-green-200/75 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
              Simule o imposto estadual a partir do valor do produto e da UF da operação interna, com o detalhamento da alíquota aplicada.
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-green-900/60 p-3 rounded-xl border border-green-800/50 shadow-inner shrink-0 self-stretch md:self-auto justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <span className="text-xs text-green-300 font-mono font-bold tracking-wide">Pronto para simular</span>
          </div>
        </div>
      </header>

      <section className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-5 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Simulações rápidas de ICMS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="group text-left border border-green-100 hover:border-emerald-400 hover:bg-green-50/30 rounded-2xl p-5 transition-all duration-300 cursor-pointer relative overflow-hidden hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-green-100/50 group-hover:bg-emerald-500 transition-colors"></div>
              <div className="font-extrabold text-sm text-green-950 group-hover:text-emerald-700 flex items-center justify-between transition-colors">
                <span>{preset.title}</span>
                <svg className="w-4 h-4 text-green-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{preset.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-5 bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden">
          <div className="border-b border-green-100/50 bg-green-50/30 px-6 py-5">
            <h2 className="font-extrabold text-green-950 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Parâmetros da operação
            </h2>
            <p className="text-xs text-slate-500 mt-1">Informe os dados da operação para simular o imposto.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="productValue" className="text-xs font-bold text-green-900 flex items-center justify-between">
                <span>VALOR DO PRODUTO</span>
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">* Requerido</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-green-600 font-extrabold text-sm">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="productValue"
                  value={productValue}
                  onChange={(event) => setProductValue(event.target.value)}
                  placeholder="0,00"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-green-950 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none ${
                    formErrors.productValue ? "border-red-400 bg-red-50/20" : "border-green-200"
                  }`}
                />
              </div>
              {formErrors.productValue && (
                <p className="text-xs text-red-500 font-bold mt-1">{formErrors.productValue}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="state" className="text-xs font-bold text-green-900 flex items-center justify-between">
                <span>ESTADO (UF)</span>
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">* Requerido</span>
              </label>
              <select
                id="state"
                value={state}
                onChange={(event) => setState(event.target.value)}
                className={`w-full px-3.5 py-3 border rounded-xl text-green-950 font-bold bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none ${
                  formErrors.state ? "border-red-400 bg-red-50/20" : "border-green-200"
                }`}
              >
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <option key={estado.code} value={estado.code}>
                    {estado.code} - {estado.name}
                  </option>
                ))}
              </select>
              {formErrors.state && (
                <p className="text-xs text-red-500 font-bold mt-1">{formErrors.state}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:hover:bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-600/20 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Calculando..." : "Calcular ICMS"}
            </button>
          </form>
        </section>

        <section className="lg:col-span-7 bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden min-h-[520px]">
          <div className="border-b border-green-100/50 bg-green-50/30 px-6 py-5 flex items-center justify-between">
            <h2 className="font-extrabold text-green-950 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resultado da simulação
            </h2>
            {result && (
              <span className="text-[10px] bg-green-100 text-green-800 font-black px-3 py-1 rounded-lg font-mono">
                {result.state}
              </span>
            )}
          </div>

          <div className="p-6 md:p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[360px] text-center">
                <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mb-4"></div>
                <p className="text-green-950 font-black">Calculando ICMS</p>
                <p className="text-sm text-slate-500 mt-1">Aguarde enquanto a simulação é preparada.</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm font-semibold">
                {error}
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center min-h-[360px] text-center border border-dashed border-green-200 rounded-3xl bg-green-50/20">
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-green-950 font-black">Nenhuma simulação realizada</p>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  Preencha os parâmetros ou selecione uma simulação rápida para visualizar o detalhamento do ICMS.
                </p>
              </div>
            )}

            {!loading && result && !error && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-6 shadow-lg">
                    <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider block">
                      ICMS apurado
                    </span>
                    <strong className="block text-4xl md:text-5xl font-black mt-2 font-mono">
                      {formatBRL(result.icmsAmount)}
                    </strong>
                    <p className="text-green-200/75 text-xs mt-3">
                      Valor calculado para operação interna em {result.state}.
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col justify-between">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Alíquota</span>
                    <strong className="text-3xl font-black text-emerald-800 mt-2">{result.icmsRate}</strong>
                    <span className="text-xs text-slate-500 mt-3">{taxLoad.toFixed(1)}% do total</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50/20 border border-green-100 rounded-2xl p-4">
                    <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Valor base</span>
                    <span className="text-base font-black text-green-950 block mt-1.5 font-mono">
                      {formatBRL(result.productValue)}
                    </span>
                  </div>
                  <div className="bg-green-50/20 border border-green-100 rounded-2xl p-4">
                    <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Imposto</span>
                    <span className="text-base font-black text-green-950 block mt-1.5 font-mono">
                      {formatBRL(result.icmsAmount)}
                    </span>
                  </div>
                  <div className="bg-green-50/50 border border-green-200 rounded-2xl p-4">
                    <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Total</span>
                    <span className="text-base font-black text-green-950 block mt-1.5 font-mono">
                      {formatBRL(result.total)}
                    </span>
                  </div>
                </div>

                <div className="border border-green-100 rounded-2xl p-5 flex flex-col gap-4 bg-green-50/10">
                  <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Regra tributária utilizada</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 font-semibold block">Tipo de operação</span>
                      <strong className="text-green-950 block mt-1">Operação interna</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">Vigência</span>
                      <strong className="text-green-950 block mt-1 font-mono">{result.taxRule.validFrom}</strong>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500 font-semibold block">Fonte</span>
                      <strong className="text-green-950 block mt-1">{result.taxRule.sourceName}</strong>
                      <span className="text-xs text-slate-500 font-mono block mt-1">{result.taxRule.sourceUrl}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
