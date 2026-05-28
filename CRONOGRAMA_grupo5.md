# Calculadora de MarkUp

Sistema para cálculo de MarkUp e definição do preço de venda de um produto.

**Equipe:**

* Gabriel Branco de Medeiros

---

## Tecnologias

| Camada        | Tecnologia                                  |
| ------------- | ------------------------------------------- |
| Runtime       | Node.js                                     |
| Linguagem     | JavaScript                                  |
| Backend/API   | Express.js                                  |
| Interface Web | Node.js + Express + EJS                     |
| Testes        | Jest + Supertest                            |
| CI/CD         | GitHub Actions do repositório da disciplina |
| Deploy        | Render disponibilizado pelo professor       |

---

## Como executar

### API

```bash
cd api
npm install
npm start
```

A API sobe em:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/health
```

### App Web

```bash
cd app
npm install
npm start
```

O app sobe em:

```text
http://localhost:3000
```

Página do Grupo 24:

```text
http://localhost:3000/equipe-24
```

### Testes

```bash
cd api
npm install
npm test
```

---

## Endpoints da API

| Método | Rota                   | Descrição                                                             |
| ------ | ---------------------- | --------------------------------------------------------------------- |
| `GET`  | `/health`              | Verifica se a API está no ar                                          |
| `GET`  | `/api/tabelas`         | Retorna constantes/tabelas do projeto base                            |
| `POST` | `/api/calcular`        | Endpoint original do projeto base                                     |
| `POST` | `/api/markup/calcular` | Calcula o MarkUp, preço de venda, valor das despesas e valor do lucro |

---

## Rotas do Aplicativo

| Método | Rota                  | Descrição                                               |
| ------ | --------------------- | ------------------------------------------------------- |
| `GET`  | `/`                   | Página inicial com listagem das equipes                 |
| `GET`  | `/equipe-24`          | Página da Calculadora de MarkUp do Grupo 24             |
| `POST` | `/equipe-24/calcular` | Rota intermediária do app para consumir a API de MarkUp |

---

## Telas do Aplicativo

* **Splash Screen** — tela inicial da Calculadora de MarkUp
* **Login** — autenticação com usuário e senha fixos
* **Calculadora de MarkUp** — tela principal para informar custo, despesas e lucro desejado
* **Sobre** — informações do projeto e foto
* **Help** — instruções de uso da calculadora

---

## Dados de Teste

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

## Cobertura de Testes

Foram implementados testes unitários para a função `calcularMarkup` e testes de integração para o endpoint da API.

| Arquivo                     | Descrição                        |
| --------------------------- | -------------------------------- |
| `api/src/funcoes.js`        | Contém a função `calcularMarkup` |
| `api/tests/funcoes.test.js` | Testes unitários da função       |
| `api/tests/api.test.js`     | Testes dos endpoints da API      |

Resultado local dos testes:

```text
Test Suites: 2 passed
Tests: 8 passed
```

---

## Cronograma de Implantação

### Fase 1 — Setup e Estrutura Inicial

| Feature                                    | Responsável | Data       |
| ------------------------------------------ | ----------- | ---------- |
| Definição do tema: Cálculo de MarkUp       | Gabriel     | 21/05/2026 |
| Configuração do ambiente Node.js           | Gabriel     | 21/05/2026 |
| Criação da branch `grupo24/markup`         | Gabriel     | 26/05/2026 |
| Integração com o repositório da disciplina | Gabriel     | 26/05/2026 |

### Fase 2 — Desenvolvimento da API

| Feature                                                       | Responsável | Data       |
| ------------------------------------------------------------- | ----------- | ---------- |
| Criação da função `calcularMarkup`                            | Gabriel     | 21/05/2026 |
| Endpoint `POST /api/markup/calcular`                          | Gabriel     | 21/05/2026 |
| Validação de dados inválidos                                  | Gabriel     | 21/05/2026 |
| Retorno do índice de MarkUp, preço de venda, despesas e lucro | Gabriel     | 21/05/2026 |
| Testes unitários da função                                    | Gabriel     | 21/05/2026 |
| Testes de integração do endpoint                              | Gabriel     | 21/05/2026 |

### Fase 3 — Desenvolvimento do App Web

| Feature                                       | Responsável | Data       |
| --------------------------------------------- | ----------- | ---------- |
| Criação da rota `/equipe-24`                  | Gabriel     | 26/05/2026 |
| Rota intermediária `POST /equipe-24/calcular` | Gabriel     | 26/05/2026 |
| Splash Screen                                 | Gabriel     | 26/05/2026 |
| Tela de Login com usuário e senha fixos       | Gabriel     | 26/05/2026 |
| Tela principal da calculadora                 | Gabriel     | 26/05/2026 |
| Tela Sobre com foto                           | Gabriel     | 26/05/2026 |
| Tela Help                                     | Gabriel     | 26/05/2026 |
| Integração da tela com a API                  | Gabriel     | 26/05/2026 |

### Fase 4 — Documentação e Entrega Final

| Entregável                          | Responsável | Data       |
| ----------------------------------- | ----------- | ---------- |
| Documento de testes unitários       | Gabriel     | 27/05/2026 |
| Documento de testes funcionais      | Gabriel     | 27/05/2026 |
| Relatório de atividade              | Gabriel     | 27/05/2026 |
| Cronograma de implantação           | Gabriel     | 27/05/2026 |
| Validação local do app e da API     | Gabriel     | 27/05/2026 |
| Validação no Render do professor    | Gabriel     | 28/05/2026 |
| Apresentação para professor e turma | Gabriel     | 28/05/2026 |

---

## Status Geral

| Item                    | Status                                      |
| ----------------------- | ------------------------------------------- |
| API Node.js             | ✅ Concluída                                 |
| App Web                 | ✅ Concluído                                 |
| Testes unitários        | ✅ Concluídos                                |
| Testes de endpoint      | ✅ Concluídos                                |
| Documentação            | ✅ Em preparação                             |
| Branch `grupo24/markup` | ✅ Criada e enviada                          |
| Render                  | 🔲 Aguardando validação/deploy do professor |
| Canvas                  | 🔲 Pendente                                 |
