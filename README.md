# Simulador de Preço Bruto e Líquido

> Projeto acadêmico — Gerência de Configuração, Entrega e Integração Contínua

## O que faz

- Calcula o preço líquido a partir do preço bruto
- Determina o preço bruto necessário para atingir um líquido desejado
- Estima margem e lucro a partir do custo do produto

## Stack

| Camada | Tecnologias |
|--------|-------------|
| API    | Node.js · Express · Vitest |
| Web    | React · Vite · Vitest |
| CI/CD  | GitHub Actions |

## Como executar

```bash
npm install
npm run dev:api
npm run dev:web
```

## Credenciais de acesso

| Campo   | Valor    |
|---------|----------|
| Usuário | `admin`  |
| Senha   | `123456` |

## Endpoint base

```
/PBL
```

> Se outra equipe usar o mesmo tema, altere o prefixo para `/PBL2` em `api/src/routes/pricingRoutes.js`.

## Comandos úteis

```bash
npm test        # executa os testes
npm run build   # gera os artefatos de produção
```

## Deploy na Vercel

Use a raiz do repositorio como projeto da Vercel. O arquivo `vercel.json` da raiz publica o app React em `web/dist` e envia as chamadas `/PBL` para a API Express serverless em `api/api/index.js`.

Em producao, o app usa `/PBL` automaticamente. Para apontar para outra API, configure `VITE_API_URL`.
