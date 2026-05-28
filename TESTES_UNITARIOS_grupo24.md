# Documento de Testes Unitários - Grupo 24

## 1. Objetivo

Este documento descreve os testes unitários implementados para a API do projeto de **Cálculo de MarkUp - Preço de venda de um produto**.

O objetivo é garantir o funcionamento correto da função responsável pelo cálculo do MarkUp e do endpoint da API utilizado pela aplicação web.

A função principal testada é:

```text
calcularMarkup
```

Localizada em:

```text
api/src/funcoes.js
```

O endpoint testado é:

```text
POST /api/markup/calcular
```

---

## 2. Ferramentas Utilizadas

* **Jest:** framework de testes em JavaScript utilizado para criação e execução da suíte de testes.
* **Supertest:** biblioteca utilizada para testar requisições HTTP da API Node.js/Express.

---

## 3. Arquivos de Teste

Os testes foram implementados nos seguintes arquivos:

```text
api/tests/funcoes.test.js
api/tests/api.test.js
```

---

## 4. Casos de Teste Implementados

### 4.1. Função: `calcularMarkup`

#### Caso Positivo: cálculo correto do MarkUp

* **Entrada:**

```json
{
  "custoProduto": 50,
  "despesas": 20,
  "lucroDesejado": 30
}
```

* **Resultado Esperado:**

```json
{
  "markup": 2,
  "precoVenda": 100,
  "valorDespesas": 20,
  "valorLucro": 30
}
```

* **Status:** APROVADO.

---

#### Caso Negativo: despesas + lucro maior ou igual a 100%

* **Entrada:**

```json
{
  "custoProduto": 50,
  "despesas": 70,
  "lucroDesejado": 40
}
```

* **Resultado Esperado:**
  A função deve lançar erro, pois a soma das despesas e do lucro desejado é maior ou igual a 100%.

* **Status:** APROVADO.

---

#### Caso Negativo: campo obrigatório ausente

* **Entrada:**

```json
{
  "custoProduto": 50,
  "despesas": 20
}
```

* **Resultado Esperado:**
  A função deve lançar erro informando que os campos obrigatórios devem ser preenchidos.

* **Status:** APROVADO.

---

## 5. Testes de Endpoint da API

### 5.1. Endpoint: `POST /api/markup/calcular`

#### Caso Positivo: envio de dados válidos

* **Ação:** Enviar uma requisição POST para o endpoint com custo, despesas e lucro desejado válidos.

* **Entrada:**

```json
{
  "custoProduto": 50,
  "despesas": 20,
  "lucroDesejado": 30
}
```

* **Resultado Esperado:**
  Retorno com status HTTP 200, `success: true` e os dados calculados corretamente.

* **Status:** APROVADO.

---

#### Caso Negativo: envio de dados inválidos

* **Ação:** Enviar uma requisição POST com despesas e lucro cuja soma seja maior ou igual a 100%.

* **Entrada:**

```json
{
  "custoProduto": 50,
  "despesas": 70,
  "lucroDesejado": 40
}
```

* **Resultado Esperado:**
  Retorno com status HTTP 400, `success: false` e mensagem de erro.

* **Status:** APROVADO.

---

## 6. Resultado da Execução dos Testes

Os testes foram executados localmente com sucesso.

Comando utilizado:

```bash
npm test
```

Resultado obtido:

```text
Test Suites: 2 passed
Tests: 8 passed
```

---

## 7. Como Executar os Testes

No terminal, dentro da pasta `api`, execute:

```bash
npm install
npm test
```

O fluxo de CI/CD do repositório da disciplina também é responsável por executar os testes automatizados conforme a configuração definida pelo professor.
