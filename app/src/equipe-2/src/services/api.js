import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const calcularImposto = async (salario) => {
  const response = await api.post('/IRP/calcular', { salario });
  return response.data;
};

export default api;