// ============================================
//  FreteCalc — Types
// ============================================

export type TipoEntrega = 'economico' | 'normal' | 'expresso';

export interface FreteInput {
  peso: number;
  distancia: number;
  tipo: TipoEntrega;
  origem: string;
  destino: string;
}

export interface FreteResultado {
  custoPeso: number;
  custoDistancia: number;
  multiplicadorTipo: number;
  valorFinal: number;
  prazoEntrega: string;
}

export interface HistoricoItem {
  id: string;
  input: FreteInput;
  resultado: FreteResultado;
  criadoEm: string;
}

export interface AuthUser {
  username: string;
}

// Distâncias fixas entre cidades (km)
export const DISTANCIAS_FIXAS: Record<string, Record<string, number>> = {
  'São Paulo':      { 'Rio de Janeiro': 430, 'Curitiba': 408, 'Belo Horizonte': 586, 'Brasília': 1015, 'Salvador': 1952, 'Fortaleza': 3103 },
  'Rio de Janeiro': { 'São Paulo': 430, 'Curitiba': 855, 'Belo Horizonte': 434, 'Brasília': 1148, 'Salvador': 1650, 'Fortaleza': 2806 },
  'Curitiba':       { 'São Paulo': 408, 'Rio de Janeiro': 855, 'Belo Horizonte': 1010, 'Brasília': 1388, 'Salvador': 2367, 'Fortaleza': 3560 },
  'Belo Horizonte': { 'São Paulo': 586, 'Rio de Janeiro': 434, 'Curitiba': 1010, 'Brasília': 716, 'Salvador': 1370, 'Fortaleza': 2583 },
  'Brasília':       { 'São Paulo': 1015, 'Rio de Janeiro': 1148, 'Curitiba': 1388, 'Belo Horizonte': 716, 'Salvador': 1444, 'Fortaleza': 2191 },
  'Salvador':       { 'São Paulo': 1952, 'Rio de Janeiro': 1650, 'Curitiba': 2367, 'Belo Horizonte': 1370, 'Brasília': 1444, 'Fortaleza': 1122 },
  'Fortaleza':      { 'São Paulo': 3103, 'Rio de Janeiro': 2806, 'Curitiba': 3560, 'Belo Horizonte': 2583, 'Brasília': 2191, 'Salvador': 1122 },
};

export const CIDADES = Object.keys(DISTANCIAS_FIXAS);

export const TIPO_CONFIG: Record<TipoEntrega, { label: string; icon: string; cor: string }> = {
  economico: { label: 'Econômico', icon: 'bi-box',         cor: 'fc-badge-economico' },
  normal:    { label: 'Normal',    icon: 'bi-truck',        cor: 'fc-badge-normal'    },
  expresso:  { label: 'Expresso',  icon: 'bi-lightning-fill', cor: 'fc-badge-expresso'  },
};
