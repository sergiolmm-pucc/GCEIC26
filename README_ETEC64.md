# Calculadora de MarkUp - Grupo 24

Aplicação web desenvolvida para realizar o cálculo de MarkUp e definir o preço de venda de um produto com base no custo, percentual de despesas e percentual de lucro desejado.

O projeto foi desenvolvido para a disciplina de **Gerência de Configuração, Entrega e Integração Contínua (GCEIC26)** e integrado ao repositório base da disciplina por meio da branch:

```text
grupo24/markup
```

---

## Funcionalidades Principais

O sistema permite ao usuário calcular o preço de venda recomendado de um produto utilizando o método de MarkUp.

### 1. Cálculo de MarkUp

O usuário informa:

* Custo do produto
* Percentual de despesas
* Percentual de lucro desejado

A partir desses dados, o sistema retorna:

* Índice de MarkUp
* Preço de venda recomendado
* Valor das despesas
* Valor do lucro

### 2. Tela de Login

O sistema possui tela de login com usuário e senha fixos, conforme requisito da atividade.

### 3. Tela Sobre

Tela contendo informações sobre o projeto e foto.

### 4. Tela Help

Tela com instruções de uso da calculadora.

### 5. Tela Principal

Tela de uso do aplicativo, onde o usuário informa os dados necessários e visualiza o resultado do cálculo.

---

## Tecnologias Utilizadas

### API

* Node.js
* Express.js
* CORS
* Helmet
* Jest
* Supertest

### App Web

* Node.js
* Express.js
* EJS
* HTML
* CSS
* JavaScript

### Integração e Entrega

* Git
* GitHub
* GitHub Actions do repositório da disciplina
* Render disponibilizado pelo professor

---

## Estrutura do Projeto

O projeto está integrado ao repositório base da disciplina:

```text
GCEIC26/
├── api/
│   ├── src/
│   │   ├── app.js
│   │   └── funcoes.js
│   └── tests/
│       ├── api.test.js
│       └── funcoes.test.js
│
├── app/
│   ├── index.js
│   ├── public/
│   │   └── equipe.jpg
│   └── views/
│       └── markup.ejs
│
└── README_grupo24.md
```

---

## Rotas do App

| Método | Rota                  | Descrição                                            |
| ------ | --------------------- | ---------------------------------------------------- |
| GET    | `/`                   | Página inicial com listagem das equipes              |
| GET    | `/equipe-24`          | Página da Calculadora de MarkUp do Grupo 24          |
| POST   | `/equipe-24/calcular` | Rota intermediária do app para comunicação com a API |

---

## Endpoints da API

| Método | Rota                   | Descrição                                        |
| ------ | ---------------------- | ------------------------------------------------ |
| GET    | `/health`              | Verifica se a API está funcionando               |
| GET    | `/api/tabelas`         | Retorna constantes/tabelas do projeto base       |
| POST   | `/api/calcular`        | Endpoint original do projeto base                |
| POST   | `/api/markup/calcular` | Calcula MarkUp, preço de venda, despesas e lucro |

---

## Como Rodar Localmente

### Pré-requisitos

Ter o Node.js e o npm instalados.

---

### 1. Executando a API

Abra um terminal na pasta do projeto e execute:

```bash
cd api
npm install
npm start
```

A API será executada em:

```text
http://localhost:3001
```

Para verificar se a API está no ar, acesse:

```text
http://localhost:3001/health
```

---

### 2. Executando o App Web

Abra outro terminal e execute:

```bash
cd app
npm install
npm start
```

O app será executado em:

```text
http://localhost:3000
```

A página do Grupo 24 pode ser acessada em:

```text
http://localhost:3000/equipe-24
```

---

## Como Utilizar

1. Acesse a rota `/equipe-24`.
2. Clique em **Entrar**.
3. Realize o login com usuário e senha fixos.
4. Informe o custo do produto, percentual de despesas e percentual de lucro desejado.
5. Clique em **Calcular**.
6. Visualize o índice de MarkUp e o preço de venda recomendado.

---

## Exemplo de Teste Manual

Dados de entrada:

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

## Como Executar os Testes

Os testes automatizados da API foram implementados com Jest e Supertest.

Para executar:

```bash
cd api
npm install
npm test
```

Resultado obtido localmente:

```text
Test Suites: 2 passed
Tests: 8 passed
```

---

## Testes Implementados

Foram implementados testes para:

* Cálculo correto do índice de MarkUp
* Cálculo correto do preço de venda
* Cálculo correto do valor das despesas
* Cálculo correto do valor do lucro
* Validação de erro quando despesas + lucro são maiores ou iguais a 100%
* Validação de erro quando campos obrigatórios não são informados
* Teste do endpoint `POST /api/markup/calcular`

---

## Branch do Projeto

```text
grupo24/markup
```

---

## Status do Projeto

| Item                                     | Status                                     |
| ---------------------------------------- | ------------------------------------------ |
| API Node.js                              | Concluída                                  |
| App Web                                  | Concluído                                  |
| Tela Splash Screen                       | Concluída                                  |
| Tela Login                               | Concluída                                  |
| Tela Sobre com foto                      | Concluída                                  |
| Tela Help                                | Concluída                                  |
| Tela principal de cálculo                | Concluída                                  |
| Testes unitários                         | Concluídos                                 |
| Testes de endpoint                       | Concluídos                                 |
| Integração com repositório da disciplina | Concluída                                  |
| Validação no Render                      | Aguardando disponibilização pelo professor |

---

## Conclusão

O projeto do Grupo 24 atende aos requisitos da atividade ao implementar uma API em Node.js para cálculo de MarkUp e uma interface web integrada ao projeto base da disciplina. A aplicação possui as telas obrigatórias, realiza comunicação com a API, possui testes automatizados e está organizada em branch própria no repositório da disciplina.
