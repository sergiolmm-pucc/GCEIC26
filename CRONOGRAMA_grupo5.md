# Calculadora de Energia Elétrica

Sistema Full Stack para gerenciamento e simulação de consumo de energia elétrica.

**Equipe:**
- Enzo Garofalo Pampana — RA: 24008914
- Pedro Ximenes Costa — RA: 24000763
- Yuri Cardoso Balieiro — RA: 24011525

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js v20.x |
| Linguagem | JavaScript (CommonJS no backend, ESM no frontend) |
| Backend | Express.js |
| Frontend | React 19 + Vite 6 |
| Testes | Jest + Supertest |
| CI/CD | GitHub Actions |

---

## Como executar

### Backend (API)
```bash
cd backend
npm install
npm run dev
```
A API sobe em `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
O app sobe em `http://localhost:5173`

### Testes
```bash
cd backend
npm test
```

---

## Endpoints da API (`/ENRG`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Health check da API |
| `POST` | `/ENRG/consumo` | Calcula consumo mensal em kWh por aparelho |
| `POST` | `/ENRG/conta` | Calcula o valor da conta com bandeira tarifária |
| `POST` | `/ENRG/simular` | Compara dois cenários e aponta o mais econômico |

---

## Telas do Aplicativo

- **Splash Screen** — tela inicial com carregamento automático
- **Login** — autenticação com usuário e senha fixos (`admin` / `1234`)
- **Consumo** — cálculo de kWh por aparelhos cadastrados
- **Conta** — estimativa do valor da fatura com bandeiras tarifárias
- **Simulação** — comparação entre dois cenários de consumo
- **Sobre** — informações e foto da equipe
- **Ajuda** — tutorial de uso e perguntas frequentes

---

## Cobertura de Testes

| Arquivo | % Statements | % Branch | % Lines |
|---|---|---|---|
| `energyService.js` | 100% | 94.44% | 100% |
| `energyController.js` | 90.9% | 100% | 90.9% |
| **Total** | **95.38%** | **96.29%** | **95.16%** |

 23 testes — 100% de aprovação (2 suites: unitários + integração)

---

## Cronograma de Implantação

### Fase 1 — Setup e Estrutura Inicial

| Feature | Responsável | Data |
|---|---|---|
| Criação do repositório Git | Equipe | 24/04/2026 |
| Setup do backend (Node.js + JavaScript + Express) | Enzo | 25/04/2026 |
| Setup do frontend (React 19 + Vite + JavaScript) | Yuri | 26/04/2026 |
| Configuração do `.gitignore` | Pedro | 26/04/2026 |
| Configuração de CI/CD (GitHub Actions) | Pedro | 28/04/2026 |

### Fase 2 — Desenvolvimento das APIs

| Feature | Responsável | Data |
|---|---|---|
| Endpoint `POST /ENRG/consumo` (cálculo de kWh) | Enzo | 29/04/2026 |
| Endpoint `POST /ENRG/conta` (bandeiras tarifárias) | Pedro | 01/05/2026 |
| Endpoint `POST /ENRG/simular` (comparação de cenários) | Yuri | 01/05/2026 |
| Testes unitários do `energyService.js` | Enzo | 03/05/2026 |
| Testes de integração das rotas | Pedro | 05/05/2026 |

### Fase 3 — Desenvolvimento do Frontend

| Feature | Responsável | Data |
|---|---|---|
| Splash Screen e Tela de Login | Pedro | 05/05/2026 |
| Tela Home com navegação por abas | Yuri | 07/05/2026 |
| Aba de Consumo (kWh) | Enzo | 09/05/2026 |
| Aba de Conta (fatura) | Pedro | 11/05/2026 |
| Aba de Simulação (cenários) | Yuri | 11/05/2026 |
| Tela de Sobre com foto da equipe | Enzo | 10/05/2026 |
| Tela de Help/Tutorial | Yuri | 13/05/2026 |
| Correções e melhorias no backend | Equipe | 16/05/2026 |

### Fase 4 — Entrega Final

| Entregável | Responsável | Data |
|---|---|---|
| App React funcional | Equipe | 17/05/2026 |
| APIs Node.js funcionais | Equipe | 17/05/2026 |
| Testes unitários (23 testes, 100%) | Equipe | 18/05/2026 |
| Relatório de Atividade (inclui testes funcionais) | Equipe | 18/05/2026 |