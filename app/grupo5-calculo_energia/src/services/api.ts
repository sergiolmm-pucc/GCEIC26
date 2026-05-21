import type { Appliance, ConsumoResult, ContaResult, Flag, SimularResult } from '../types'

const API = 'http://localhost:3001'

export async function fetchConsumo(appliances: Appliance[], days: number): Promise<ConsumoResult> {
  const payload = appliances.map(a => ({
    name: a.name || 'Aparelho',
    watts: parseFloat(a.watts),
    hoursPerDay: parseFloat(a.hoursPerDay),
  }))
  const r = await fetch(`${API}/ENRG/consumo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appliances: payload, days }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erro ao calcular consumo.')
  return data
}

export async function fetchConta(totalKwh: number, tarifa: number, bandeira: Flag): Promise<ContaResult> {
  const r = await fetch(`${API}/ENRG/conta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ totalKwh, tarifa, bandeira }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erro ao calcular conta.')
  return data
}

export async function fetchSimular(
  cenarioA: Appliance[],
  cenarioB: Appliance[],
  tarifa: number,
  bandeira: Flag
): Promise<SimularResult> {
  const toPayload = (arr: Appliance[]) => arr.map(a => ({
    name: a.name || 'Aparelho',
    watts: parseFloat(a.watts),
    hoursPerDay: parseFloat(a.hoursPerDay),
  }))
  const r = await fetch(`${API}/ENRG/simular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cenarioA: toPayload(cenarioA), cenarioB: toPayload(cenarioB), tarifa, bandeira }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erro ao simular.')
  return data
}