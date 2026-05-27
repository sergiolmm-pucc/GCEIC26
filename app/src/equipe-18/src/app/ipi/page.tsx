"use client";

import React, { useState } from "react";
import { useIpi } from "../../hooks/use-ipi";
import { ipiSchema } from "../../schemas/ipi-schema";

const PRESETS = [
  {
    title: "Águas minerais",
    desc: "Produto com NCM 2201.10.00 sem valores acessórios.",
    data: {
      productValue: "200.00",
      freightValue: "0.00",
      additionalExpenses: "0.00",
      ncm: "2201.10.00",
    },
  },
  {
    title: "Venda com frete",
    desc: "Inclui frete na base de cálculo do IPI.",
    data: {
      productValue: "1000.00",
      freightValue: "80.00",
      additionalExpenses: "0.00",
      ncm: "2201.10.00",
    },
  },
  {
    title: "Operação completa",
    desc: "Produto, frete e despesas acessórias na mesma simulação.",
    data: {
      productValue: "2500.00",
      freightValue: "120.00",
      additionalExpenses: "45.00",
      ncm: "2201.10.00",
    },
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

export default function IpiPage() {
  const { loading, result, error, calculateIpi } = useIpi();
  const [productValue, setProductValue] = useState("200.00");
  const [freightValue, setFreightValue] = useState("0.00");
  const [additionalExpenses, setAdditionalExpenses] = useState("0.00");
  const [ncm, setNcm] = useState("2201.10.00");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleNcmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
    const formatted = [
      digits.slice(0, 4),
      digits.slice(4, 6),
      digits.slice(6, 8),
    ].filter(Boolean).join(".");

    setNcm(formatted);
  };

  const submitCalculation = async (data: {
    productValue: string;
    freightValue: string;
    additionalExpenses: string;
    ncm: string;
  }) => {
    setFormErrors({});

    const parsedProductValue = Number(data.productValue);
    const parsedFreightValue = Number(data.freightValue);
    const parsedAdditionalExpenses = Number(data.additionalExpenses);
    const validation = ipiSchema.safeParse({
      productValue: Number.isNaN(parsedProductValue) ? undefined : parsedProductValue,
      freightValue: Number.isNaN(parsedFreightValue) ? undefined : parsedFreightValue,
      additionalExpenses: Number.isNaN(parsedAdditionalExpenses) ? undefined : parsedAdditionalExpenses,
      ncm: data.ncm,
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

    await calculateIpi(validation.data);
  };

  const applyPreset = async (preset: {
    productValue: string;
    freightValue: string;
    additionalExpenses: string;
    ncm: string;
  }) => {
    setProductValue(preset.productValue);
    setFreightValue(preset.freightValue);
    setAdditionalExpenses(preset.additionalExpenses);
    setNcm(preset.ncm);
    await submitCalculation(preset);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await submitCalculation({ productValue, freightValue, additionalExpenses, ncm });
  };

  const taxLoad = result
    ? (Number(result.ipiAmount) / Number(result.total)) * 100
    : 0;

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl">
      <title>IPI - Simulador Tributário</title>
      <meta name="description" content="Cálculo individual de IPI por NCM, valor do produto, frete e despesas acessórias." />

      <header className="relative overflow-hidden bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-green-800/40">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-green-500/15 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-green-500/25">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Simulador federal
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4 bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent">
              Cálculo de IPI
            </h1>
            <p className="text-green-200/75 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
              Calcule o imposto federal considerando produto, NCM, frete e despesas acessórias que compõem a base de cálculo.
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
          Simulações rápidas de IPI
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
              Parâmetros do produto
            </h2>
            <p className="text-xs text-slate-500 mt-1">Informe os dados do produto para calcular o imposto.</p>
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
              <label htmlFor="ncm" className="text-xs font-bold text-green-900 flex items-center justify-between">
                <span>NCM DO PRODUTO</span>
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">* Requerido</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                id="ncm"
                value={ncm}
                onChange={handleNcmChange}
                placeholder="0000.00.00"
                className={`w-full px-3.5 py-3 border rounded-xl text-green-950 font-bold font-mono focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none ${
                  formErrors.ncm ? "border-red-400 bg-red-50/20" : "border-green-200"
                }`}
              />
              {formErrors.ncm && (
                <p className="text-xs text-red-500 font-bold mt-1">{formErrors.ncm}</p>
              )}
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-amber-900 leading-relaxed font-medium">
                Para esta simulação, utilize o código <code className="font-extrabold font-mono bg-amber-100 px-2 py-0.5 rounded text-amber-950 border border-amber-200">2201.10.00</code>.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="freightValue" className="text-xs font-bold text-green-900">
                  FRETE
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  id="freightValue"
                  value={freightValue}
                  onChange={(event) => setFreightValue(event.target.value)}
                  placeholder="0,00"
                  className={`w-full px-3.5 py-3 border rounded-xl text-green-950 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none ${
                    formErrors.freightValue ? "border-red-400 bg-red-50/20" : "border-green-200"
                  }`}
                />
                {formErrors.freightValue && (
                  <p className="text-xs text-red-500 font-bold">{formErrors.freightValue}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="additionalExpenses" className="text-xs font-bold text-green-900">
                  DESPESAS
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  id="additionalExpenses"
                  value={additionalExpenses}
                  onChange={(event) => setAdditionalExpenses(event.target.value)}
                  placeholder="0,00"
                  className={`w-full px-3.5 py-3 border rounded-xl text-green-950 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none ${
                    formErrors.additionalExpenses ? "border-red-400 bg-red-50/20" : "border-green-200"
                  }`}
                />
                {formErrors.additionalExpenses && (
                  <p className="text-xs text-red-500 font-bold">{formErrors.additionalExpenses}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:hover:bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-600/20 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Calculando..." : "Calcular IPI"}
            </button>
          </form>
        </section>

        <section className="lg:col-span-7 bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden min-h-[620px]">
          <div className="border-b border-green-100/50 bg-green-50/30 px-6 py-5 flex items-center justify-between">
            <h2 className="font-extrabold text-green-950 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resultado da simulação
            </h2>
            {result && (
              <span className="text-[10px] bg-green-100 text-green-800 font-black px-3 py-1 rounded-lg font-mono">
                NCM {result.ncm}
              </span>
            )}
          </div>

          <div className="p-6 md:p-8">
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[420px] text-center">
                <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mb-4"></div>
                <p className="text-green-950 font-black">Calculando IPI</p>
                <p className="text-sm text-slate-500 mt-1">Aguarde enquanto a simulação é preparada.</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm font-semibold">
                {error}
              </div>
            )}

            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center min-h-[420px] text-center border border-dashed border-green-200 rounded-3xl bg-green-50/20">
                <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <p className="text-green-950 font-black">Nenhuma simulação realizada</p>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  Preencha os parâmetros ou selecione uma simulação rápida para visualizar o detalhamento do IPI.
                </p>
              </div>
            )}

            {!loading && result && !error && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-6 shadow-lg">
                    <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider block">
                      IPI apurado
                    </span>
                    <strong className="block text-4xl md:text-5xl font-black mt-2 font-mono">
                      {formatBRL(result.ipiAmount)}
                    </strong>
                    <p className="text-green-200/75 text-xs mt-3">
                      Valor calculado para o NCM {result.ncm}.
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col justify-between">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Alíquota</span>
                    <strong className="text-3xl font-black text-emerald-800 mt-2">{result.ipiRate}</strong>
                    <span className="text-xs text-slate-500 mt-3">{taxLoad.toFixed(1)}% do total</span>
                  </div>
                </div>

                <div className="border border-green-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-green-50/40 text-green-900 text-[10px] font-bold uppercase tracking-wider border-b border-green-100">
                      <tr>
                        <th className="px-5 py-4">Composição</th>
                        <th className="px-5 py-4 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-50/80 text-green-950 font-bold">
                      <tr>
                        <td className="px-5 py-4">Valor do produto</td>
                        <td className="px-5 py-4 text-right font-mono">{formatBRL(result.productValue)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4">Frete</td>
                        <td className="px-5 py-4 text-right font-mono">{formatBRL(result.freightValue)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4">Despesas acessórias</td>
                        <td className="px-5 py-4 text-right font-mono">{formatBRL(result.additionalExpenses)}</td>
                      </tr>
                      <tr className="bg-green-50/30">
                        <td className="px-5 py-4 font-extrabold">Base de cálculo</td>
                        <td className="px-5 py-4 text-right font-black font-mono">{formatBRL(result.calculationBasis)}</td>
                      </tr>
                      <tr className="bg-green-50/60">
                        <td className="px-5 py-4 font-extrabold">Total com IPI</td>
                        <td className="px-5 py-4 text-right font-black font-mono text-emerald-800">{formatBRL(result.total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border border-green-100 rounded-2xl p-5 flex flex-col gap-4 bg-green-50/10">
                  <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detalhamento TIPI</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 font-semibold block">Descrição do produto</span>
                      <strong className="text-green-950 block mt-1">{result.productDescription}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block">NCM</span>
                      <strong className="text-green-950 block mt-1 font-mono">{result.ncm}</strong>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500 font-semibold block">Fonte legal</span>
                      <strong className="text-green-950 block mt-1">{result.legalSource}</strong>
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
