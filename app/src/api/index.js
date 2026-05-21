const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const n = (v) => {
  if (v === '' || v == null) return 0;
  const num = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(num) ? num : 0;
};

async function post(tipo, body) {
  const res = await fetch(`${BASE_URL}/MKP/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, ...body }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Erro na requisicao.');
  return data.data;
}

export const MarkupAPI = {
  async sellPrice({ cost, markupPct }) {
    const data = await post('markupDivisor', {
      custo: n(cost), impostos: 0, despesas: 0, margemLucro: n(markupPct),
    });
    return { price: data.precoVenda, divisor: data.markupDivisor, profit: data.lucro };
  },

  async markupPct({ cost, price }) {
    const data = await post('markup', { custo: n(cost), precoVenda: n(price) });
    return { markupPct: data.margemPerc, margemSobreCusto: data.markupPerc };
  },

  async divisor({ cost, df, dv, lucro }) {
    const data = await post('markupDivisor', {
      custo: n(cost), impostos: n(df), despesas: n(dv), margemLucro: n(lucro),
    });
    return { divisor: data.markupDivisor, total: data.totalPercentual, price: data.precoVenda };
  },

  async profit({ cost, price, qty }) {
    const c = n(cost), p = n(price), q = n(qty);
    if (c <= 0 || p <= 0) throw new Error('Informe custo e preco validos.');
    if (p <= c) throw new Error('Preco deve ser maior que o custo.');
    await new Promise(r => setTimeout(r, 300));
    const unit = p - c;
    return { unit, total: unit * q, pct: (unit / c) * 100 };
  },

  async breakEven({ fixos, price, varCost }) {
    const data = await post('pontoEquilibrio', {
      custosFixos: n(fixos), precoVenda: n(price), custoVariavelUnitario: n(varCost),
    });
    return { units: data.unidades, revenue: data.receitaEquilibrio, margemCont: data.margemContribuicao };
  },
};
