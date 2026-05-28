import { FreteInput, FreteResultado, DistanciaOutput, PrazoOutput } from '../types/frete.types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Helper interno — faz o fetch e já trata o padrão { sucesso, dados, erro }
async function apiFetch<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body:    body ? JSON.stringify(body) : undefined,
    signal:  AbortSignal.timeout(5000),
  });

  const json = await res.json();

  if (!res.ok || !json.sucesso) {
    throw new Error(json.erro ?? `Erro ${res.status}`);
  }

  return json.dados as T;
}

// ══════════════════════════════════════════
//  ALUNO 2 — Busca cidades disponíveis
//  GET /frete/distancia/cidades
// ══════════════════════════════════════════
export async function getCidades(): Promise<string[]> {
  return apiFetch<string[]>('/equipe-15/frete/distancia/cidades');
}

// ══════════════════════════════════════════
//  ALUNO 2 — Busca distância entre duas cidades
//  POST /frete/distancia
// ══════════════════════════════════════════
export async function getDistancia(origem: string, destino: string): Promise<DistanciaOutput> {
  return apiFetch<DistanciaOutput>('/equipe-15/frete/distancia', { origem, destino });
}

// ══════════════════════════════════════════
//  ALUNO 3 — Busca prazo de entrega
//  POST /frete/prazo
// ══════════════════════════════════════════
export async function getPrazo(distanciaKm: number, tipo: string): Promise<PrazoOutput> {
  return apiFetch<PrazoOutput>('/equipe-15/frete/prazo', { distanciaKm, tipo });
}

// ══════════════════════════════════════════
//  ALUNO 1 — Cálculo do frete consolidado
//  POST /frete/calcular
// ══════════════════════════════════════════
export async function calcularFrete(input: FreteInput): Promise<FreteResultado> {
  return apiFetch<FreteResultado>('/equipe-15/frete/calcular', {
    peso:      input.peso,
    distancia: input.distancia,
    tipo:      input.tipo,
  });
}
