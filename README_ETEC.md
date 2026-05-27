# ETEC - Encargos de Empregada Domestica

Projeto do grupo 4 integrado ao monorepo GCEIC26.

## Rotas

- App: `/etec`
- API: `/ETEC`
- Branch de entrega: `grupo4`

## Funcionalidades

- Splash screen.
- Login fixo `admin / admin`.
- Dashboard com calculos de salario, ferias e rescisao.
- Tela Sobre com placeholders dos integrantes.
- Tela Help.
- API Node com calculos isolados em servicos.

## Validacao local

```bash
cd api && npm test
cd app/views/etec && npm test && npm run build
cd e2e-tests && npm run test:etec
```

Para o e2e local, subir a API em `http://localhost:3001` e o app em `http://localhost:3000`.
O app deve receber `API_URL=http://localhost:3001`.

## Aviso

Os calculos sao estimativas academicas para a atividade. Eles nao substituem eSocial, contador, advogado ou orientacao oficial.
