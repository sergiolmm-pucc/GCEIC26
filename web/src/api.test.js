import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_URL, calcularPrecoLiquido } from './api.js';

describe('api client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('usa o endpoint configurado para calcular preco liquido', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalLiquido: 90 })
    });

    const resultado = await calcularPrecoLiquido({ precoBruto: 100 });

    expect(resultado.totalLiquido).toBe(90);
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/preco-liquido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ precoBruto: 100 })
    });
  });

  it('retorna a mensagem de erro enviada pela API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Campo nao pode ser negativo: precoBruto' })
    });

    await expect(calcularPrecoLiquido({ precoBruto: -1 })).rejects.toThrow('Campo nao pode ser negativo');
  });
});
