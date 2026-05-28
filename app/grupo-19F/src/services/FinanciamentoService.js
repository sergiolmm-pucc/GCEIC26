const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/FIN';

/**
 * Classe de serviço para comunicação com a API de Financiamento.
 * POO: Encapsulamento da lógica de chamadas HTTP.
 */
class FinanciamentoService {
  async _post(endpoint, dados) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const json = await response.json();
    if (!json.sucesso) throw new Error(json.erro || 'Erro na API');
    return json.dados;
  }

  async calcularSAC(params) {
    return this._post('/sac', params);
  }

  async calcularPRICE(params) {
    return this._post('/price', params);
  }

  async comparar(params) {
    return this._post('/comparar', params);
  }

  async simularCapacidade(params) {
    return this._post('/capacidade', params);
  }
}

export default new FinanciamentoService();
