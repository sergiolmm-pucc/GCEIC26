const API_URL = import.meta.env.VITE_API_URL || '/etec/api';

async function request(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Erro ao comunicar com a API');
  }

  return json.data;
}

export function calculateSalary(payload) {
  return request('/salario', payload);
}

export function calculateVacation(payload) {
  return request('/ferias', payload);
}

export function calculateTermination(payload) {
  return request('/rescisao', payload);
}
