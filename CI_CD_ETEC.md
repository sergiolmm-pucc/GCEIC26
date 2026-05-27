# CI/CD ETEC

## Branch

A entrega do time ETEC fica na branch `grupo4`. A branch nao deve ser mergeada em `main` sem autorizacao do professor ou representante do repositorio.

## GitHub Actions

O arquivo `.github/workflows/deploy.yml` possui o job `e2e-etec-local`, executado somente na branch `grupo4` quando houver mudancas em `api/**`, `app/**` ou `e2e-tests/**`.

O job executa:

- `npm ci` e `npm test` em `api`.
- `npm ci` em `app`.
- `npm ci` e `npm run build` em `app/views/etec`.
- API local em `http://localhost:3001`.
- App local em `http://localhost:3000`.
- `npm run test:etec` em `e2e-tests`.
- Upload dos screenshots `etec-*.png`.

## Render

O Render oficial usa:

- API: `https://gceic26.onrender.com`
- App: `https://gceic26-app.onrender.com`

Enquanto a ETEC estiver apenas na branch `grupo4`, o Render oficial nao refletira a aplicacao. Para a entrega final rodar publicamente, sera necessario merge autorizado em `main` e deploy oficial verde.
