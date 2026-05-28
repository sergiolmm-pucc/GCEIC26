const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function fetchConsumo(appliances, days) {
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

export async function fetchConta(totalKwh, tarifa, bandeira) {
  const r = await fetch(`${API}/ENRG/conta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ totalKwh, tarifa, bandeira }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erro ao calcular conta.')
  return data
}

export async function fetchSimular(cenarioA, cenarioB, tarifa, bandeira) {
  const toPayload = arr => arr.map(a => ({
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
