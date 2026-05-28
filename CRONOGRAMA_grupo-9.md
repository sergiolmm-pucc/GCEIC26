# Cronograma de Implantação — Cálculo de MarkUp

**Disciplina:** Gerência de Configuração, Entrega e Integração Contínua (GCEIC26)
**Professor:** Sérgio Marques
**Equipe:** Grupo 24
**Integrante:** Gabriel Branco de Medeiros
**Tema:** Cálculo de MarkUp — Preço de venda de um produto
**Endpoint do grupo:** `/api/markup/calcular`
**Rota do App:** `/equipe-24`

---

## Sprint 1 — Entrega Parcial (21/05/2026) · 30% da nota

| Feature                                                                       | Responsável | Status     |
| ----------------------------------------------------------------------------- | ----------- | ---------- |
| Definição do tema: Cálculo de MarkUp                                          | Gabriel     | ✅ Entregue |
| Criação da branch `grupo24/markup`                                            | Gabriel     | ✅ Entregue |
| API: função `calcularMarkup`                                                  | Gabriel     | ✅ Entregue |
| API: `POST /api/markup/calcular` — cálculo de MarkUp e preço de venda         | Gabriel     | ✅ Entregue |
| App: criação da rota `/equipe-24`                                             | Gabriel     | ✅ Entregue |
| App: rota intermediária `POST /equipe-24/calcular` para comunicação com a API | Gabriel     | ✅ Entregue |
| App: Splash screen                                                            | Gabriel     | ✅ Entregue |
| App: Tela de login com usuário e senha fixos                                  | Gabriel     | ✅ Entregue |
| App: Tela Sobre com foto                                                      | Gabriel     | ✅ Entregue |
| App: Tela Help                                                                | Gabriel     | ✅ Entregue |
| App: Tela principal da calculadora de MarkUp                                  | Gabriel     | ✅ Entregue |
| Testes unitários da função `calcularMarkup`                                   | Gabriel     | ✅ Entregue |
| Testes de integração do endpoint da API                                       | Gabriel     | ✅ Entregue |
| Integração com o repositório da disciplina                                    | Gabriel     | ✅ Entregue |

---

## Sprint 2 — Entrega Final e Apresentação (28/05/2026) · 40% da nota

| Feature                                     | Responsável | Status       |
| ------------------------------------------- | ----------- | ------------ |
| Documento de testes unitários               | Gabriel     | ✅ Entregue   |
| Documento de testes funcionais              | Gabriel     | ✅ Entregue   |
| Relatório de atividade para o Canvas        | Gabriel     | ✅ Entregue   |
| Cronograma de implantação de features       | Gabriel     | ✅ Entregue   |
| Validação local da API                      | Gabriel     | ✅ Entregue   |
| Validação local do App na rota `/equipe-24` | Gabriel     | ✅ Entregue   |
| Validação do projeto no Render do professor | Gabriel     | 🔲 Pendente  |
| Inclusão dos links do Render no relatório   | Gabriel     | 🔲 Pendente  |
| Apresentação para o professor e sala        | Gabriel     | 🔲 Planejado |

---

## Arquitetura

```text
┌─────────────────────┐        ┌──────────────────────────┐
│   App (porta 3000)  │ ──────▶│   API (porta 3001)       │
│   Express + EJS     │  HTTP  │   Express REST           │
│   Rota: /equipe-24  │        │   Endpoint MarkUp        │
└─────────────────────┘        └──────────────────────────┘
```

| Camada            | Tecnologia                                  | Porta |
| ----------------- | ------------------------------------------- | ----- |
| Interface Web     | Node.js + Express + EJS                     | 3000  |
| API REST          | Node.js + Express                           | 3001  |
| Testes unitários  | Jest + Supertest                            | —     |
| Testes funcionais | Validação manual do fluxo da aplicação      | —     |
| CI/CD             | GitHub Actions do repositório da disciplina | —     |
| Deploy            | Render disponibilizado pelo professor       | —     |

---

## Endpoints da API

| Método | Rota                   | Descrição                                                    |
| ------ | ---------------------- | ------------------------------------------------------------ |
| GET    | `/health`              | Verifica se a API está no ar                                 |
| GET    | `/api/tabelas`         | Retorna constantes/tabelas do projeto base                   |
| POST   | `/api/calcular`        | Endpoint original do projeto base                            |
| POST   | `/api/markup/calcular` | Calcula o MarkUp, preço de venda, valor das despesas e lucro |

---

## Rotas do App

| Método | Rota                  | Descrição                                               |
| ------ | --------------------- | ------------------------------------------------------- |
| GET    | `/`                   | Página inicial com listagem das equipes                 |
| GET    | `/equipe-24`          | Página do Grupo 24 — Calculadora de MarkUp              |
| POST   | `/equipe-24/calcular` | Rota intermediária do App para consumir a API de MarkUp |

---

## Dados de Teste Utilizados

| Campo            | Valor |
| ---------------- | ----- |
| Custo do produto | 50    |
| Despesas         | 20%   |
| Lucro desejado   | 30%   |

Resultado esperado:

| Resultado          | Valor     |
| ------------------ | --------- |
| Índice de MarkUp   | 2         |
| Preço de venda     | R$ 100,00 |
| Valor das despesas | R$ 20,00  |
| Valor do lucro     | R$ 30,00  |

---

## Status Geral

| Item                           | Status                                        |
| ------------------------------ | --------------------------------------------- |
| API Node.js                    | ✅ Concluída                                   |
| App Web                        | ✅ Concluído                                   |
| Testes unitários               | ✅ Concluídos                                  |
| Testes funcionais documentados | ✅ Concluídos                                  |
| Branch `grupo24/markup`        | ✅ Criada e enviada                            |
| Render                         | 🔲 Aguardando deploy/validação pelo professor |
| Entrega no Canvas              | 🔲 Pendente                                   |
