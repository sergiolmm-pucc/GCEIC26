// ─────────────────────────────────────────
//  Tipos compartilhados — Frete API
// ─────────────────────────────────────────

export type TipoEntrega = 'economico' | 'normal' | 'expresso';

// Resposta padrão da API
export interface ApiResponse<T> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
}

// ══════════════════════════════════════════
//  ALUNO 1 — Cálculo do Frete
// ══════════════════════════════════════════
export interface FreteInput {
  peso: number;
  distancia: number;
  tipo: TipoEntrega;
}

export interface FreteOutput {
  peso: number;
  distancia: number;
  tipo: TipoEntrega;
  custoPeso: number;
  custoDistancia: number;
  valorBase: number;
  multiplicadorTipo: number;
  valorFinal: number;
  prazoEntrega: string;
}

// ══════════════════════════════════════════
//  ALUNO 2 — Cálculo de Distância
// ══════════════════════════════════════════
export interface DistanciaInput {
  origem: string;
  destino: string;
}

export interface DistanciaOutput {
  origem: string;
  destino: string;
  distanciaKm: number;
  custoDistancia: number;
  faixaRegiao: 'local' | 'estadual' | 'interestadual' | 'longa_distancia';
  descricaoFaixa: string;
}

// ══════════════════════════════════════════
//  ALUNO 3 — Prazo de Entrega
// ══════════════════════════════════════════
export interface PrazoInput {
  distanciaKm: number;
  tipo: TipoEntrega;
}

export interface PrazoOutput {
  distanciaKm: number;
  tipo: TipoEntrega;
  diasUteisMin: number;
  diasUteisMax: number;
  prazoEntrega: string;
  dataEstimada: string;
}
