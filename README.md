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

## CI/CD

O workflow `.github/workflows/deploy.yml`, baseado no fluxo do Grupo 20, executa em
`push` e `pull_request` para `grupo14/PBL` e tambem pode ser disparado manualmente.

- Detecta alteracoes em `api`, `app` e `e2e-tests` para executar somente as validacoes afetadas.
- Roda os testes da API com relatorio JUnit publicado no GitHub Actions.
- Roda os testes e o build do frontend e armazena `app/dist` como artefato.
- Sobe API e frontend no runner e executa os testes Selenium, armazenando screenshots e logs.
- Em `push` para `grupo14/PBL`, dispara o deploy apos os testes passarem quando os hooks estiverem configurados.

Para habilitar os deploys, configure os secrets do repositorio:

- `DEPLOY_HOOK`: URL do deploy hook da API.
- `DEPLOY_APP_HOOK`: URL do deploy hook do frontend.
