"use client";

import React, { useState } from "react";
import { useNf } from "../../hooks/use-nf";
import { nfSchema } from "../../schemas/nf-schema";

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

export default function NfCompletaPage() {
  const { loading, result, error, calculateNf } = useNf();

  const [productValue, setProductValue] = useState<string>("1000.00");
  const [state, setState] = useState<string>("SP");
  const [ncm, setNcm] = useState<string>("2201.10.00");
  const [freightValue, setFreightValue] = useState<string>("50.00");
  const [additionalExpenses, setAdditionalExpenses] = useState<string>("20.00");
  const [pisRate, setPisRate] = useState<string>("");
  const [confinsRate, setConfinsRate] = useState<string>("");

  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [showCustomRates, setShowCustomRates] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "icms" | "ipi" | "pisCofins">("overview");

  const handleNcmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.substring(0, 8);

    let formatted = "";
    if (val.length > 0) {
      formatted += val.substring(0, Math.min(val.length, 4));
    }
    if (val.length > 4) {
      formatted += "." + val.substring(4, Math.min(val.length, 6));
    }
    if (val.length > 6) {
      formatted += "." + val.substring(6, Math.min(val.length, 8));
    }
    setNcm(formatted);
  };

  const formatBRL = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num)) return "R$ 0,00";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const applyPreset = async (preset: {
    productValue: string;
    state: string;
    ncm: string;
    freightValue: string;
    additionalExpenses: string;
    pisRate: string;
    confinsRate: string;
    customRatesActive: boolean;
  }) => {
    setProductValue(preset.productValue);
    setState(preset.state);
    setNcm(preset.ncm);
    setFreightValue(preset.freightValue);
    setAdditionalExpenses(preset.additionalExpenses);
    setPisRate(preset.pisRate);
    setConfinsRate(preset.confinsRate);
    setShowCustomRates(preset.customRatesActive);
    setFormErrors({});

    const rawData = {
      productValue: parseFloat(preset.productValue),
      state: preset.state,
      ncm: preset.ncm,
      freightValue: parseFloat(preset.freightValue) || 0,
      additionalExpenses: parseFloat(preset.additionalExpenses) || 0,
      ...(preset.customRatesActive && preset.pisRate ? { pisRate: parseFloat(preset.pisRate) } : {}),
      ...(preset.customRatesActive && preset.confinsRate ? { confinsRate: parseFloat(preset.confinsRate) } : {}),
    };

    const validationResult = nfSchema.safeParse(rawData);
    if (validationResult.success) {
      try {
        await calculateNf(validationResult.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const PRESETS = [
    {
      title: "SP - Padrão Bebidas",
      desc: "Águas minerais com frete e despesas em SP.",
      data: {
        productValue: "1000.00",
        state: "SP",
        ncm: "2201.10.00",
        freightValue: "50.00",
        additionalExpenses: "20.00",
        pisRate: "",
        confinsRate: "",
        customRatesActive: false,
      },
    },
    {
      title: "RJ - Alta Alíquota",
      desc: "Rio de Janeiro (ICMS 22%) e frete expresso.",
      data: {
        productValue: "2500.00",
        state: "RJ",
        ncm: "2201.10.00",
        freightValue: "120.00",
        additionalExpenses: "45.00",
        pisRate: "",
        confinsRate: "",
        customRatesActive: false,
      },
    },
    {
      title: "SC - Alíquotas Altas Custom.",
      desc: "Santa Catarina com overrides manuais de PIS/COFINS.",
      data: {
        productValue: "1500.00",
        state: "SC",
        ncm: "2201.10.00",
        freightValue: "80.00",
        additionalExpenses: "30.00",
        pisRate: "2.50",
        confinsRate: "9.20",
        customRatesActive: true,
      },
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsedProduct = parseFloat(productValue);
    const parsedFreight = parseFloat(freightValue) || 0;
    const parsedExpenses = parseFloat(additionalExpenses) || 0;
    const parsedPis = showCustomRates && pisRate ? parseFloat(pisRate) : undefined;
    const parsedCofins = showCustomRates && confinsRate ? parseFloat(confinsRate) : undefined;

    const rawData = {
      productValue: isNaN(parsedProduct) ? undefined : parsedProduct,
      state,
      ncm,
      freightValue: parsedFreight,
      additionalExpenses: parsedExpenses,
      ...(parsedPis !== undefined ? { pisRate: parsedPis } : {}),
      ...(parsedCofins !== undefined ? { confinsRate: parsedCofins } : {}),
    };

    const validationResult = nfSchema.safeParse(rawData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      await calculateNf(validationResult.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getProportions = () => {
    if (!result) return null;
    const prodVal = parseFloat(result.productValue) || 0;
    const freight = parseFloat(result.ipi.freightValue) || 0;
    const expenses = parseFloat(result.ipi.additionalExpenses) || 0;
    const icms = parseFloat(result.icms.amount) || 0;
    const ipi = parseFloat(result.ipi.amount) || 0;
    const pis = parseFloat(result.pisCofins.pisAmount) || 0;
    const cofins = parseFloat(result.pisCofins.confinsAmount) || 0;

    const total = prodVal + freight + expenses + icms + ipi + pis + cofins;
    if (total === 0) return null;

    return {
      product: (prodVal / total) * 100,
      extras: ((freight + expenses) / total) * 100,
      icms: (icms / total) * 100,
      ipi: (ipi / total) * 100,
      pisCofins: ((pis + cofins) / total) * 100,
    };
  };

  const proportions = getProportions();

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-7xl">
      {/* Dynamic SEO Meta Details */}
      <title>Nota Fiscal Completa - Simulador Tributário Premium</title>
      <meta name="description" content="Simulação integrada e consolidação de impostos incidentes na Nota Fiscal brasileira. ICMS, IPI, PIS e COFINS no mesmo lugar." />

      {/* Header section with modern dark green glow */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-950 to-green-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-green-800/40">
        {/* Modern glowing shapes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-green-500/15 rounded-full pointer-events-none"></div>
        <div className="absolute top-12 right-1/4 w-12 h-12 border-2 border-emerald-500/10 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider border border-green-500/25">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Simulador Integrado
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mt-4 bg-gradient-to-r from-white via-green-100 to-green-300 bg-clip-text text-transparent">
              Nota Fiscal Completa
            </h1>
            <p className="text-green-200/75 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
              Calcule e analise a carga tributária consolidada da sua operação de faturamento. 
              Integração em tempo real de impostos federais e estaduais (ICMS, IPI, PIS e COFINS).
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-green-900/60 p-3 rounded-xl border border-green-800/50 shadow-inner shrink-0 self-stretch md:self-auto justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
            <span className="text-xs text-green-300 font-mono font-bold tracking-wide">API Ativa & Online</span>
          </div>
        </div>
      </header>

      {/* Fast Preset Templates with Premium Hover Effects */}
      <section className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-5 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Presets de Simulação Rápida (Bebidas / Águas Minerais - NCM 2201.10.00)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset.data)}
              className="group text-left border border-green-100 hover:border-emerald-400 hover:bg-green-5/30 rounded-2xl p-5 transition-all duration-300 cursor-pointer shadow-xs relative overflow-hidden hover:shadow-md hover:-translate-y-0.5"
              id={`preset-btn-${index}`}
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FORM CONTAINER */}
        <div className="lg:col-span-5 bg-white border border-green-100 rounded-3xl shadow-md overflow-hidden">
          <div className="border-b border-green-100/50 bg-green-50/30 px-6 py-5 flex items-center justify-between">
            <h2 className="font-extrabold text-green-955 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Parâmetros da Operação
            </h2>
            <span className="text-[10px] bg-green-100 text-green-850 font-black px-3 py-1 rounded-lg font-mono">INTEGRADO</span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6" id="nf-completa-form">
            
            {/* VALOR DO PRODUTO */}
            <div className="flex flex-col gap-2">
              <label htmlFor="productValue" className="text-xs font-bold text-green-900 flex items-center justify-between">
                <span>VALOR DE VENDA DO PRODUTO (BASE)</span>
                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">* Requerido</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-green-600 font-extrabold text-sm">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="productValue"
                  id="productValue"
                  value={productValue}
                  onChange={(e) => setProductValue(e.target.value)}
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

            {/* ESTADO & NCM GRID */}
            <div className="grid grid-cols-2 gap-4">
              {/* ESTADO */}
              <div className="flex flex-col gap-2">
                <label htmlFor="state" className="text-xs font-bold text-green-900 flex items-center justify-between">
                  <span>ESTADO (UF)</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  name="state"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full px-3.5 py-3 border rounded-xl text-green-950 font-bold bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none ${
                    formErrors.state ? "border-red-400 bg-red-50/20" : "border-green-200"
                  }`}
                >
                  {ESTADOS_BRASILEIROS.map((est) => (
                    <option key={est.code} value={est.code}>
                      {est.code} - {est.name}
                    </option>
                  ))}
                </select>
                {formErrors.state && (
                  <p className="text-xs text-red-500 font-bold mt-1">{formErrors.state}</p>
                )}
              </div>

              {/* NCM */}
              <div className="flex flex-col gap-2">
                <label htmlFor="ncm" className="text-xs font-bold text-green-900 flex items-center justify-between">
                  <span>NCM DO PRODUTO</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="ncm"
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
            </div>
            
            {/* INFO MESSAGE ABOUT NCM */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong className="font-extrabold text-amber-950 block mb-0.5">Fundamentação Acadêmica:</strong>
                O backend calcula IPI especificamente para o código {" "}
                <code className="font-extrabold font-mono bg-amber-150 px-2 py-0.5 rounded text-amber-950 border border-amber-200">2201.10.00</code> 
                {" "}(Águas Minerais). Outras classificações fiscais podem ser simuladas no módulo de IPI direto.
              </div>
            </div>

            {/* EXPANDABLE SECTION: FREIGHT AND ACCESSORIES */}
            <div className="border border-green-100 rounded-2xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-5 py-4 bg-green-50/20 hover:bg-green-50/40 text-green-950 font-extrabold text-xs flex justify-between items-center transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 uppercase tracking-wider">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4m16 4h-2m-3 0h3m-3 0V6a1 1 0 00-1-1H9m1.5 4h.5m-3 0h3" />
                  </svg>
                  Frete e Despesas Adicionais
                </span>
                <svg className={`w-4 h-4 text-green-600 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAdvanced && (
                <div className="p-5 border-t border-green-100 bg-white grid grid-cols-2 gap-4 animate-fadeIn">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="freightValue" className="text-xs font-bold text-green-800">VALOR FRETE (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="freightValue"
                      id="freightValue"
                      value={freightValue}
                      onChange={(e) => setFreightValue(e.target.value)}
                      placeholder="0,00"
                      className="w-full px-3.5 py-2.5 border border-green-200 rounded-xl text-green-950 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    />
                    {formErrors.freightValue && (
                      <p className="text-xs text-red-500 font-bold">{formErrors.freightValue}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="additionalExpenses" className="text-xs font-bold text-green-800">DESPESAS ACESSÓRIAS (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="additionalExpenses"
                      id="additionalExpenses"
                      value={additionalExpenses}
                      onChange={(e) => setAdditionalExpenses(e.target.value)}
                      placeholder="0,00"
                      className="w-full px-3.5 py-2.5 border border-green-200 rounded-xl text-green-950 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                    />
                    {formErrors.additionalExpenses && (
                      <p className="text-xs text-red-500 font-bold">{formErrors.additionalExpenses}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* EXPANDABLE SECTION: CUSTOM PIS/COFINS RATES */}
            <div className="border border-green-100 rounded-2xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setShowCustomRates(!showCustomRates)}
                className="w-full px-5 py-4 bg-green-50/20 hover:bg-green-50/40 text-green-950 font-extrabold text-xs flex justify-between items-center transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 uppercase tracking-wider">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Alíquotas Customizadas (PIS/COFINS)
                </span>
                <svg className={`w-4 h-4 text-green-600 transition-transform duration-300 ${showCustomRates ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCustomRates && (
                <div className="p-5 border-t border-green-100 bg-white flex flex-col gap-4 animate-fadeIn">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed font-semibold">
                    Caso omitidas, o sistema aplicará os padrões do Regime Não-Cumulativo:
                    <strong className="text-emerald-900 block mt-1">
                      • PIS: 1,65% | COFINS: 7,60%
                    </strong>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pisRate" className="text-xs font-bold text-green-800">ALÍQUOTA PIS (%)</label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          name="pisRate"
                          id="pisRate"
                          value={pisRate}
                          onChange={(e) => setPisRate(e.target.value)}
                          placeholder="1.65"
                          className="w-full pr-8 pl-3.5 py-2.5 border border-green-200 rounded-xl text-green-955 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <span className="text-green-600 font-extrabold text-xs">%</span>
                        </div>
                      </div>
                      {formErrors.pisRate && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.pisRate}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="confinsRate" className="text-xs font-bold text-green-800">ALÍQUOTA COFINS (%)</label>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          name="confinsRate"
                          id="confinsRate"
                          value={confinsRate}
                          onChange={(e) => setConfinsRate(e.target.value)}
                          placeholder="7.60"
                          className="w-full pr-8 pl-3.5 py-2.5 border border-green-200 rounded-xl text-green-955 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <span className="text-green-600 font-extrabold text-xs">%</span>
                        </div>
                      </div>
                      {formErrors.confinsRate && (
                        <p className="text-xs text-red-500 font-bold">{formErrors.confinsRate}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-700/20 hover:shadow-emerald-500/30 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-3 text-sm disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/25"
              id="submit-calc-btn"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Estruturando Nota Fiscal...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Consolidar Nota Fiscal
                </>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS / INTERACTIVE SIMULATOR PANEL */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* ERROR DISPLAY */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 shadow-sm text-red-800 flex items-start gap-4 animate-slideIn">
              <div className="bg-red-100 p-3 rounded-2xl text-red-600 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-black text-red-950 text-base">Falha na Simulação</h4>
                <p className="text-xs md:text-sm text-red-750 mt-1.5 leading-relaxed">{error}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-red-600 font-extrabold bg-red-100/50 px-3 py-1.5 rounded-lg border border-red-200 w-fit">
                  <span>Recomendação:</span> Use o NCM <code className="font-mono bg-red-200/50 px-1.5 py-0.5 rounded font-black text-red-900 border border-red-300">2201.10.00</code>.
                </div>
              </div>
            </div>
          )}

          {/* SKELETON / LOADING LOADER */}
          {loading && (
            <div className="bg-white border border-green-150 rounded-3xl p-6 shadow-md flex flex-col gap-6 animate-pulse">
              <div className="h-6 bg-green-100 rounded w-1/4"></div>
              <div className="bg-green-950 h-32 rounded-2xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-green-50 rounded-xl"></div>
                <div className="h-12 bg-green-50 rounded-xl"></div>
              </div>
              <div className="h-40 bg-green-50 border border-green-100 rounded-2xl"></div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !result && !error && (
            <div className="bg-white border-2 border-green-100 border-dashed rounded-3xl p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="bg-green-50 p-6 rounded-full text-green-600 mb-6 ring-8 ring-green-50/40 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
                <svg className="w-12 h-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-green-950">Decomposição Detalhada</h3>
              <p className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed">
                Insira os valores de faturamento ao lado ou utilize um preset para gerar os gráficos interativos e demonstrativos tributários.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5 justify-center max-w-md">
                <span className="text-xs bg-emerald-50 text-emerald-850 px-3.5 py-1.5 rounded-full font-bold border border-emerald-100">ICMS Dinâmico</span>
                <span className="text-xs bg-teal-50 text-teal-850 px-3.5 py-1.5 rounded-full font-bold border border-teal-100">TIPI Federal</span>
                <span className="text-xs bg-lime-50 text-lime-850 px-3.5 py-1.5 rounded-full font-bold border border-lime-100">PIS/COFINS Custom</span>
              </div>
            </div>
          )}

          {/* CALCULATED SUCCESS RESULTS */}
          {!loading && result && !error && (
            <div className="bg-white border border-green-100 rounded-3xl shadow-xl overflow-hidden animate-slideIn">
              
              {/* TOP HEADER SECTION WITH THE TOTAL AMOUNT */}
              <div className="bg-gradient-to-br from-green-950 via-green-950 to-green-900 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-green-400 font-bold text-xs uppercase tracking-wider">Valor Bruto da Operação</h3>
                    <div className="text-4xl md:text-5xl font-black mt-2 text-white tracking-tight">
                      {formatBRL(result.totals.grandTotal)}
                    </div>
                    <p className="text-green-200/60 text-xs mt-2 leading-relaxed">
                      Montante Total da Nota Fiscal (Produto + Adicionais + Impostos)
                    </p>
                  </div>
                  
                  <div className="bg-green-900/50 border border-green-800/80 rounded-2xl p-4.5 shrink-0 flex flex-col items-center md:items-end shadow-inner">
                    <span className="text-[10px] text-green-300 font-bold uppercase tracking-wider">Carga Tributária</span>
                    <span className="text-2xl font-black text-green-200 mt-1">
                      {formatBRL(result.totals.taxesTotal)}
                    </span>
                    <span className="text-[10px] text-emerald-450 mt-1.5 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {( (parseFloat(result.totals.taxesTotal) / parseFloat(result.totals.grandTotal)) * 100 ).toFixed(1)}% do total geral
                    </span>
                  </div>
                </div>

                {/* VISUAL PROPORTIONAL CHART */}
                {proportions && (
                  <div className="mt-8 pt-6 border-t border-green-900/50">
                    <span className="text-[10px] text-green-300/80 font-bold uppercase tracking-wider block mb-3">
                      Composição Estrutural da Nota Fiscal
                    </span>
                    
                    {/* Glowing Bar Chart */}
                    <div className="h-5 w-full bg-green-950 rounded-full overflow-hidden flex shadow-inner p-[2px] border border-green-800/40">
                      <div style={{ width: `${proportions.product}%` }} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-opacity rounded-l-full relative group" title={`Produto: ${proportions.product.toFixed(1)}%`}></div>
                      <div style={{ width: `${proportions.extras}%` }} className="bg-amber-500 hover:opacity-90 transition-opacity relative group" title={`Despesas: ${proportions.extras.toFixed(1)}%`}></div>
                      <div style={{ width: `${proportions.icms}%` }} className="bg-emerald-400 hover:opacity-90 transition-opacity relative group" title={`ICMS: ${proportions.icms.toFixed(1)}%`}></div>
                      <div style={{ width: `${proportions.ipi}%` }} className="bg-teal-400 hover:opacity-90 transition-opacity relative group" title={`IPI: ${proportions.ipi.toFixed(1)}%`}></div>
                      <div style={{ width: `${proportions.pisCofins}%` }} className="bg-lime-400 hover:opacity-90 transition-opacity rounded-r-full relative group" title={`PIS/COFINS: ${proportions.pisCofins.toFixed(1)}%`}></div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4.5 text-[10px] font-bold text-green-255">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>Produto ({proportions.product.toFixed(0)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>Extras ({proportions.extras.toFixed(0)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>ICMS ({proportions.icms.toFixed(0)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-teal-400 rounded-full"></span>IPI ({proportions.ipi.toFixed(0)}%)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-lime-400 rounded-full"></span>PIS/COFINS ({proportions.pisCofins.toFixed(0)}%)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DETAILED TABS NAVIGATION */}
              <div className="border-b border-green-100 flex items-center bg-green-50/10 p-2 gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "overview"
                      ? "bg-green-950 text-white shadow-md shadow-green-950/20"
                      : "text-green-800 hover:bg-green-50"
                  }`}
                >
                  Geral
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("icms")}
                  className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "icms"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  ICMS ({result.icms.rate})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ipi")}
                  className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "ipi"
                      ? "bg-teal-600 text-white shadow-md shadow-teal-605/20"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-600"
                  }`}
                >
                  IPI ({result.ipi.rate})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pisCofins")}
                  className={`px-4.5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "pisCofins"
                      ? "bg-lime-500 text-green-955 shadow-md shadow-lime-500/20"
                      : "text-slate-600 hover:bg-lime-50 hover:text-lime-700"
                  }`}
                >
                  PIS/COFINS
                </button>
              </div>

              {/* TAB PANEL CONTENT */}
              <div className="p-6 md:p-8">
                
                {/* 1. OVERVIEW PANEL */}
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    
                    {/* KEY METRICS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-50/20 border border-green-100 rounded-2xl p-4 shadow-xs">
                        <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Valor Base</span>
                        <span className="text-base font-black text-green-950 block mt-1.5 font-mono">
                          {formatBRL(result.productValue)}
                        </span>
                      </div>
                      <div className="bg-green-50/20 border border-green-100 rounded-2xl p-4 shadow-xs">
                        <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Logística (Frete)</span>
                        <span className="text-base font-black text-green-950 block mt-1.5 font-mono">
                          {formatBRL(result.ipi.freightValue)}
                        </span>
                      </div>
                      <div className="bg-green-50/20 border border-green-100 rounded-2xl p-4 shadow-xs">
                        <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Acessórias</span>
                        <span className="text-base font-black text-green-955 block mt-1.5 font-mono">
                          {formatBRL(result.ipi.additionalExpenses)}
                        </span>
                      </div>
                      <div className="bg-green-50/20 border border-green-100 rounded-2xl p-4 shadow-xs">
                        <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">Alíquota Real</span>
                        <span className="text-base font-black text-emerald-700 block mt-1.5">
                          {( (parseFloat(result.totals.taxesTotal) / parseFloat(result.productValue)) * 100 ).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* TABLE BREAKDOWN */}
                    <div className="border border-green-100 rounded-2xl overflow-hidden shadow-2xs">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-green-50/40 text-green-905 text-[10px] font-bold uppercase tracking-wider border-b border-green-100">
                          <tr>
                            <th className="px-5 py-4">Tributo / Item de Linha</th>
                            <th className="px-5 py-4">Alíquota</th>
                            <th className="px-5 py-4 text-right">Base de Cálculo</th>
                            <th className="px-5 py-4 text-right">Valor Apurado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-green-50/80 text-green-950 font-bold">
                          <tr className="hover:bg-green-50/10 transition-colors">
                            <td className="px-5 py-4 flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                              <span>ICMS - Operação Interna ({result.state})</span>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{result.icms.rate}</td>
                            <td className="px-5 py-4 text-right font-mono text-xs text-slate-500">{formatBRL(result.productValue)}</td>
                            <td className="px-5 py-4 text-right font-bold text-green-955 font-mono">{formatBRL(result.icms.amount)}</td>
                          </tr>
                          <tr className="hover:bg-green-50/10 transition-colors">
                            <td className="px-5 py-4 flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                              <span>IPI - TIPI (NCM {result.ncm})</span>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{result.ipi.rate}</td>
                            <td className="px-5 py-4 text-right font-mono text-xs text-slate-500">{formatBRL(result.ipi.calculationBasis)}</td>
                            <td className="px-5 py-4 text-right font-bold text-green-955 font-mono">{formatBRL(result.ipi.amount)}</td>
                          </tr>
                          <tr className="hover:bg-green-50/10 transition-colors">
                            <td className="px-5 py-4 flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
                              <span>PIS - Federal</span>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{result.pisCofins.pisRate}</td>
                            <td className="px-5 py-4 text-right font-mono text-xs text-slate-500">{formatBRL(result.productValue)}</td>
                            <td className="px-5 py-4 text-right font-bold text-green-955 font-mono">{formatBRL(result.pisCofins.pisAmount)}</td>
                          </tr>
                          <tr className="hover:bg-green-50/10 transition-colors">
                            <td className="px-5 py-4 flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
                              <span>COFINS - Federal</span>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{result.pisCofins.confinsRate}</td>
                            <td className="px-5 py-4 text-right font-mono text-xs text-slate-500">{formatBRL(result.productValue)}</td>
                            <td className="px-5 py-4 text-right font-bold text-green-955 font-mono">{formatBRL(result.pisCofins.confinsAmount)}</td>
                          </tr>
                          {/* SUM OF TAXES */}
                          <tr className="bg-green-50/30 font-extrabold border-t border-green-150">
                            <td colSpan={3} className="px-5 py-4.5 text-green-900">Total de Impostos Retidos</td>
                            <td className="px-5 py-4.5 text-right text-emerald-800 font-black font-mono">{formatBRL(result.totals.taxesTotal)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-green-900 font-semibold">
                      <svg className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <strong>Regra de Integração:</strong> Conforme legislação federal, a base de cálculo do IPI incorpora o valor do frete e despesas acessórias adicionais. O ICMS, PIS e COFINS incidem diretamente sobre o preço de venda do produto, de acordo com o regime estabelecido de apuração.
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ICMS DETAIL PANEL */}
                {activeTab === "icms" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 shadow-xs">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">ICMS Estadual ({result.state})</span>
                        <h4 className="text-2xl font-black text-emerald-950 mt-1">{formatBRL(result.icms.amount)}</h4>
                      </div>
                      <span className="text-2xl font-black text-emerald-700 font-mono bg-emerald-100 px-4 py-2 rounded-xl">
                        {result.icms.rate}
                      </span>
                    </div>

                    {/* DETAILS CARD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-green-100 rounded-2xl p-5 flex flex-col gap-2 shadow-xs bg-white">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tipo de Fato Gerador</span>
                        <span className="text-sm font-black text-green-950 capitalize">
                          {result.icms.taxRule.operationType === "internal" ? "Operação Interna" : result.icms.taxRule.operationType}
                        </span>
                      </div>
                      <div className="border border-green-100 rounded-2xl p-5 flex flex-col gap-2 shadow-xs bg-white">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vigência Tributária</span>
                        <span className="text-sm font-black text-green-950 font-mono">
                          Desde {result.icms.taxRule.validFrom}
                        </span>
                      </div>
                    </div>

                    <div className="border border-green-100 rounded-2xl p-5 flex flex-col gap-3 shadow-xs bg-green-50/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Legislação Estadual Aplicável</span>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-xs text-green-900 leading-relaxed font-semibold">
                          {result.icms.taxRule.sourceName}
                        </p>
                        {result.icms.taxRule.sourceUrl && (
                          <a
                            href={`https://${result.icms.taxRule.sourceUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5 shrink-0"
                          >
                            <span>Visualizar Fonte</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. IPI DETAIL PANEL */}
                {activeTab === "ipi" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex justify-between items-center bg-teal-50/50 border border-teal-100 rounded-2xl p-5 shadow-xs">
                      <div>
                        <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">IPI Federal - NCM {result.ncm}</span>
                        <h4 className="text-2xl font-black text-teal-955 mt-1">{formatBRL(result.ipi.amount)}</h4>
                      </div>
                      <span className="text-2xl font-black text-teal-700 font-mono bg-teal-100 px-4 py-2 rounded-xl">
                        {result.ipi.rate}
                      </span>
                    </div>

                    <div className="border border-green-100 rounded-2xl p-5 shadow-xs flex flex-col gap-2 bg-white">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomenclatura Fiscal (TIPI)</span>
                      <p className="text-sm font-black text-green-950 leading-relaxed">
                        {result.ipi.description}
                      </p>
                    </div>

                    {/* DECOMPOSITION FOR BASES */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-green-100 rounded-2xl p-4 shadow-xs bg-white">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Produto</span>
                        <span className="text-sm font-extrabold text-green-950 block mt-1.5 font-mono">{formatBRL(result.productValue)}</span>
                      </div>
                      <div className="border border-green-100 rounded-2xl p-4 shadow-xs bg-white">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Logística</span>
                        <span className="text-sm font-extrabold text-green-955 block mt-1.5 font-mono">+{formatBRL(result.ipi.freightValue)}</span>
                      </div>
                      <div className="border border-green-100 rounded-2xl p-4 shadow-xs bg-white">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Despesas</span>
                        <span className="text-sm font-extrabold text-green-955 block mt-1.5 font-mono">+{formatBRL(result.ipi.additionalExpenses)}</span>
                      </div>
                      <div className="border border-teal-200 rounded-2xl p-4 bg-teal-50/30">
                        <span className="text-[10px] text-teal-850 font-bold uppercase">Base de Cálculo IPI</span>
                        <span className="text-sm font-black text-teal-950 block mt-1.5 font-mono">{formatBRL(result.ipi.calculationBasis)}</span>
                      </div>
                    </div>

                    <div className="border border-green-100 rounded-2xl p-5 bg-green-50/10 shadow-xs">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dispositivo Legal do IPI</span>
                      <p className="text-xs text-green-900 font-semibold mt-2 leading-relaxed">
                        {result.ipi.legalSource}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. PIS/COFINS DETAIL PANEL */}
                {activeTab === "pisCofins" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    
                    {/* OVERALL PIS/COFINS CARD */}
                    <div className="bg-lime-50/50 border border-lime-100 rounded-2xl p-5 shadow-xs flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-lime-800 font-bold uppercase tracking-wider block">Acumulado Geral PIS + COFINS</span>
                        <h4 className="text-2xl font-black text-lime-950 mt-1">{formatBRL(result.pisCofins.totalTax)}</h4>
                      </div>
                      <div className="bg-lime-100 px-4 py-2.5 rounded-xl text-lime-900 text-xs font-black font-mono text-right leading-relaxed border border-lime-200">
                        <span>PIS: {result.pisCofins.pisRate}</span>
                        <br />
                        <span>COFINS: {result.pisCofins.confinsRate}</span>
                      </div>
                    </div>

                    {/* SIDE BY SIDE BREAKDOWN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* PIS */}
                      <div className="border border-green-100 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 bg-white">
                        <div className="flex justify-between items-center border-b border-green-50 pb-2.5">
                          <span className="text-xs font-bold text-green-900">Contribuição PIS</span>
                          <span className="bg-green-50 text-green-800 text-[10px] font-mono px-2.5 py-0.5 rounded font-black border border-green-100">
                            {result.pisCofins.pisRate}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-500 font-semibold">Valor Apurado:</span>
                          <span className="text-lg font-black text-green-955 font-mono">{formatBRL(result.pisCofins.pisAmount)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold leading-relaxed font-mono">
                          Fórmula: Preço ({formatBRL(result.productValue)}) × taxa de {result.pisCofins.pisRate}
                        </div>
                      </div>

                      {/* COFINS */}
                      <div className="border border-green-100 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 bg-white">
                        <div className="flex justify-between items-center border-b border-green-50 pb-2.5">
                          <span className="text-xs font-bold text-green-900">Contribuição COFINS</span>
                          <span className="bg-green-50 text-green-800 text-[10px] font-mono px-2.5 py-0.5 rounded font-black border border-green-100">
                            {result.pisCofins.confinsRate}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-slate-500 font-semibold">Valor Apurado:</span>
                          <span className="text-lg font-black text-green-955 font-mono">{formatBRL(result.pisCofins.confinsAmount)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold leading-relaxed font-mono">
                          Fórmula: Preço ({formatBRL(result.productValue)}) × taxa de {result.pisCofins.confinsRate}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
