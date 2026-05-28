// Em produção usa URL relativa (o portal faz proxy /IRP → API server)
// Em desenvolvimento aponta direto para o servidor API
const BASE_URL = import.meta.env.PROD
  ? '/IRP'
  : 'http://localhost:3001/IRP';

export const calcularImposto = async (salario) => {
  const response = await fetch(`${BASE_URL}/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salario }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro ?? data.error ?? 'Erro ao calcular imposto');
  }

  return data;
};

export default { calcularImposto };
