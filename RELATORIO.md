# Relatório de Atividade - Desenvolvimento de API e App (Cálculo de MarkUp)

## 1. Informações da Equipe

* **Tema Escolhido:** Cálculo de MarkUp - Preço de venda de um produto.

* **Integrantes:**

  1. Gabriel Branco de Medeiros

## 2. Visão Geral do Projeto

Foi desenvolvido um sistema composto por:

* **API em Node.js:** Responsável por realizar o cálculo de MarkUp com base no custo do produto, percentual de despesas e percentual de lucro desejado. A API retorna o índice de MarkUp, o preço de venda recomendado, o valor das despesas e o valor do lucro.

* **App Web:** Aplicação web integrada ao projeto base da disciplina, contendo as telas solicitadas: Splash Screen, Login com usuário e senha fixos, tela Sobre com foto, tela Help e tela principal para uso do aplicativo.

A aplicação foi integrada ao projeto principal da disciplina por meio da rota:

```text
/equipe-24
```

## 3. Entregas Realizadas

* **Desenvolvimento da API:** Foi implementado o endpoint responsável pelo cálculo de MarkUp:

```text
POST /api/markup/calcular
```

* **Integração com o App:** Foi criada a página da Equipe 24 no app, acessada pela rota:

```text
GET /equipe-24
```

Também foi criada a rota intermediária do app para comunicação com a API:

```text
POST /equipe-24/calcular
```

* **Testes:** Foram implementados testes unitários para a função de cálculo de MarkUp e testes do endpoint da API. Os testes foram executados localmente com sucesso.

Resultado dos testes:

```text
Test Suites: 2 passed
Tests: 8 passed
```

* **Integração Contínua (CI/CD):** O projeto foi integrado ao repositório principal da disciplina por meio da branch `grupo24/markup`. O repositório possui configuração de GitHub Actions para validação dos testes e deploy, conforme estrutura definida pelo professor.

* **Cronograma:** Foi definido um cronograma de implantação das features do projeto, contemplando o desenvolvimento da API, integração com o app, testes e preparação para apresentação.

## 4. Link do Repositório

* **Repositório GitHub:** https://github.com/sergiolmm-pucc/GCEIC26

* **Branch do Grupo 24:** `grupo24/markup`

* **Pull Request:** adicionar o link do Pull Request, caso seja utilizado.

* **Link do App no Render:** adicionar o link disponibilizado pelo professor.

* **Link da API no Render:** adicionar o link disponibilizado pelo professor.

## 5. Conclusões

O projeto atendeu aos requisitos da disciplina, implementando uma API em Node.js para cálculo de MarkUp e uma aplicação web integrada ao projeto base. Foram desenvolvidas as telas solicitadas, incluindo splash screen, login com usuário e senha fixos, tela Sobre com foto, tela Help e tela principal de cálculo.

Além disso, foram implementados testes unitários e testes do endpoint da API, garantindo que o cálculo do preço de venda funcione corretamente. O projeto foi versionado em branch própria no repositório da disciplina, seguindo o fluxo de entrega por Git e integração contínua.
