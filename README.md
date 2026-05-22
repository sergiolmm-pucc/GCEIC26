# Simulador de Preco Bruto e Liquido

Projeto academico de Gerencia de Configuracao, Entrega e Integracao Continua.

## Estrutura

- `api`: API Node.js/Express com os calculos de preco, impostos, lucro e margem.
- `app`: frontend React/Vite para uso do simulador.
- `e2e-tests`: testes end-to-end com Selenium.

## Como executar

```bash
npm install
npm run dev:api
npm run dev:app
```

O app abre em `http://localhost:5173` e a API em `http://localhost:3001/PBL`.

Credenciais do app:

- Usuario: `admin`
- Senha: `123456`

## Validacao

```bash
npm test
npm run build
```

Para testar somente a API no formato usado pelo workflow:

```bash
cd api
npm ci
npm run test
```

Para rodar os testes e2e, deixe o app aberto em `http://localhost:5173` e execute:

```bash
cd e2e-tests
npm install
npm run test
```
