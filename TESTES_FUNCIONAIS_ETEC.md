# Testes Funcionais ETEC

O teste funcional fica em `e2e-tests/tests/etec.test.js`.

## Cenarios

- Splash redireciona para login.
- Login valido com `admin / admin`.
- Calculo de salario.
- Calculo de ferias.
- Calculo de rescisao.
- Tela Sobre.
- Tela Help.
- Login invalido.

## Execucao

```bash
cd e2e-tests
npm run test:etec
```

O teste usa `APP_URL` para escolher o site alvo. Localmente, o valor padrao e `http://localhost:3000`.
