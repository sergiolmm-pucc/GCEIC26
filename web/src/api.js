export const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/PBL' : 'http://localhost:3001/PBL');

export async function calcularPrecoLiquido(payload) {
  return postJson('/preco-liquido', payload);
}

export async function calcularPrecoBruto(payload) {
  return postJson('/preco-bruto', payload);
}

export async function calcularMargem(payload) {
  return postJson('/margem', payload);
}

async function postJson(path, payload) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? 'Erro ao consultar API');
  }

  return data;
}
