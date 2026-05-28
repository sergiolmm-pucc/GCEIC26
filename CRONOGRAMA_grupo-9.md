# Cronograma de Implantação — Cálculo de NF

**Disciplina:** Gerência de Configuração, Entrega e Integração Contínua (GCEIC26)  
**Professor:** Sérgio Marques  
**Equipe:** Daniel Henrique Inoue Jange · Igor Ribeiro Cunha · Lucas Anelli Bissi  
**Tema:** Cálculo de Impostos — Nota Fiscal (IPI, PIS/COFINS, ICMS)  
**Endpoint do grupo:** `/NF/`

---

## Sprint 1 — Entrega Parcial (21/05/2026) · 30% da nota

| Feature | Responsável | Status |
|---|---|---|
| API: `POST /NF/calcular` — Cálculo de NF com impostos | Daniel | ✅ Entregue |
| API: `POST /NF/calcular-inverso` — Cálculo inverso (total → produto) | Igor | ✅ Entregue |
| API: `POST /NF/comparar` — Comparação de dois cenários tributários | Lucas | ✅ Entregue |
| API: `GET /NF/tabelas` — Alíquotas padrão | Daniel | ✅ Entregue |
| App: Splash screen | Lucas | ✅ Entregue |
| App: Tela de login (usuário e senha fixo) | Daniel | ✅ Entregue |
| App: Tela Sobre com fotos da equipe | Igor | ✅ Entregue |
| App: Tela Help | Igor | ✅ Entregue |
| App: Calculadora de NF | Daniel | ✅ Entregue |
| App: Calculadora Inversa | Igor | ✅ Entregue |
| App: Comparador de Alíquotas | Lucas | ✅ Entregue |
| Testes unitários (funções puras) | Todos | ✅ Entregue |
| Testes de integração (endpoints da API) | Todos | ✅ Entregue |
| CI/CD — GitHub Actions (unit tests + pipeline) | Todos | ✅ Entregue |

---

## Sprint 2 — Entrega Final e Apresentação (28/05/2026) · 40% da nota

| Feature | Responsável | Status |
|---|---|---|
| Testes E2E: fluxo de cálculo inverso | Daniel | 🔲 Planejado |
| Testes E2E: fluxo de comparação de alíquotas | Igor | 🔲 Planejado |
| CI/CD: integração dos testes E2E no pipeline | Lucas | 🔲 Planejado |
| Apresentação para o professor e sala | Todos | 🔲 Planejado |

---

## Arquitetura

```
┌─────────────────────┐        ┌──────────────────────────┐
│   App (porta 3000)  │ ──────▶│   API (porta 3001)       │
│   Express + EJS     │  HTTP  │   Express REST           │
│   (interface web)   │        │   Endpoints: /NF/*       │
└─────────────────────┘        └──────────────────────────┘
```

| Camada | Tecnologia | Porta |
|---|---|---|
| Interface Web | Node.js + Express + EJS | 3000 |
| API REST | Node.js + Express | 3001 |
| Testes unitários | Jest + Supertest | — |
| Testes funcionais | Selenium WebDriver | — |
| CI/CD | GitHub Actions | — |

---

## Endpoints da API (`/NF/`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status da API |
| GET | `/NF/tabelas` | Alíquotas padrão |
| POST | `/NF/calcular` | Calcula impostos de uma NF |
| POST | `/NF/calcular-inverso` | Descobre valor do produto a partir do total |
| POST | `/NF/comparar` | Compara dois cenários tributários |
