# GCEIC26 - Cálculo de MarkUp

Projeto da disciplina **Gerência de Configuração, Entrega e Integração Contínua**.

O tema escolhido é **Cálculo de MarkUp**, usado para calcular o preço de venda de um produto a partir do custo, despesas, impostos e margem de lucro desejada.

## Estrutura do Projeto

```text
api/        API Node.js com Express
app/        Aplicação web com Express e EJS
e2e-tests/  Testes funcionais
docs/       Documentação do projeto
```

## Regra de Cálculo

```text
preco_venda = custo_produto / (1 - percentual_total)
```

```text
percentual_total = despesas_fixas + despesas_variaveis + impostos + margem_lucro
```

Os percentuais são informados como número inteiro ou decimal em porcentagem.

Exemplo:

```text
10% deve ser informado como 10
```

## Como Rodar a API

Em um terminal:

```bash
cd api
npm install
npm start
```

A API roda por padrão em:

```text
http://localhost:3001
```

Endpoint de saúde:

```text
GET http://localhost:3001/health
```

Endpoint de cálculo:

```text
POST http://localhost:3001/api/calcular
```

Exemplo de corpo da requisição:

```json
{
  "custoProduto": 100,
  "despesasFixas": 10,
  "despesasVariaveis": 5,
  "impostos": 12,
  "margemLucro": 20
}
```

Exemplo de resposta:

```json
{
  "success": true,
  "data": {
    "custoProduto": "100.00",
    "percentualTotal": 0.47,
    "percentuais": {
      "despesasFixas": 0.1,
      "despesasVariaveis": 0.05,
      "impostos": 0.12,
      "margemLucro": 0.2
    },
    "precoVenda": "188.68"
  }
}
```

## Como Rodar o App

Em outro terminal:

```bash
cd app
npm install
npm start
```

O app roda por padrão em:

```text
http://localhost:3000
```

Credenciais de acesso:

```text
Usuário: admin
Senha: admin
```

Telas disponíveis:

- `http://localhost:3000/splash`
- `http://localhost:3000/login`
- `http://localhost:3000/calculo`
- `http://localhost:3000/sobre`
- `http://localhost:3000/help`

## Como Rodar os Testes da API

```bash
cd api
npm install
npm run test
```

Os testes cobrem:

- saúde da API;
- endpoint de tabela/fórmula;
- cálculo de MarkUp com dados válidos;
- validação de custo inválido;
- validação de percentual negativo;
- validação de soma de percentuais maior ou igual a 100%.

## Documentação

Arquivos principais:

- `docs/requirements.md`
- `docs/design.md`
- `docs/tasks.md`

## Status da Primeira Entrega

- API de MarkUp implementada.
- App com splash screen, login, tela de cálculo, sobre e help implementado.
- Testes unitários e testes da API implementados.
- Pipeline de CI/CD existente em `.github/workflows/deploy.yml`.
