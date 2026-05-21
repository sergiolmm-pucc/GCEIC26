export type Screen = 'splash' | 'login' | 'home' | 'sobre' | 'help'
export type Tab = 'consumo' | 'conta' | 'simular'
export type Flag = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2'

export interface Appliance {
  name: string
  watts: string
  hoursPerDay: string
}

export interface ConsumoResultItem {
  name: string
  watts: number
  hoursPerDay: number
  kwhMes: number
}

export interface ConsumoResult {
  items: ConsumoResultItem[]
  totalKwh: number
}

export interface ContaResult {
  subtotal: number
  adicionalBandeira: number
  total: number
  bandeira: string
  totalKwh: number
  tarifa: number
}

export interface SimularResult {
  cenarioA: { items: ConsumoResultItem[]; totalKwh: number; conta: ContaResult }
  cenarioB: { items: ConsumoResultItem[]; totalKwh: number; conta: ContaResult }
  diffKwh: number
  economiaReais: number
  cenarioMaisEconomico: 'A' | 'B'
}

export const FLAG_LABELS: Record<Flag, string> = {
  verde: 'Verde',
  amarela: 'Amarela',
  vermelha1: 'Vermelha 1',
  vermelha2: 'Vermelha 2',
}

export const emptyAppliance = (): Appliance => ({ name: '', watts: '', hoursPerDay: '' })