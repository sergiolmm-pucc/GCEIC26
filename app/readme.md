# HourlyCost - App Frontend (React)

Interface web em React para a calculadora financeira de custo de prestação de serviços em horas (CSH). Consome a API REST desenvolvida em Node.js.

## Tecnologias Utilizadas
* **React** (v18.3.1)
* **Vite** como empacotador e servidor de desenvolvimento
* **Vitest** + **React Testing Library** para testes unitários
* **Playwright** para testes e2e/funcionais locais
* **CSS Vanilla** para estilização flexível e customizada

## Estrutura de Diretórios
* `src/App.jsx`: Componente principal contendo as telas de Splash, Login, Calculadora, Sobre e Ajuda.
* `src/styles.css`: Estilização principal do projeto.
* `src/App.test.jsx`: Testes unitários do frontend utilizando Vitest.
* `e2e/app.spec.js`: Testes funcionais automatizados de ponta a ponta com Playwright.

## Instalação e Execução Local

No diretório `app`, instale as dependências:
```bash
npm install
```

### Scripts Disponíveis

* **Desenvolvimento**: Inicia o servidor local do Vite.
  ```bash
  npm run dev
  ```
* **Build**: Gera a versão de produção otimizada na pasta `dist`.
  ```bash
  npm run build
  ```
* **Preview**: Inicia um servidor local para visualizar a build de produção na porta 3000.
  ```bash
  npm run start
  ```
* **Testes Unitários**: Executa os testes do Vitest.
  ```bash
  npm run test
  ```
* **Testes de Cobertura**: Exibe relatório de cobertura dos testes unitários.
  ```bash
  npm run test:coverage
  ```
* **Testes E2E (Playwright)**: Roda os testes de ponta a ponta e salva evidências em screenshot.
  ```bash
  npm run test:e2e
  ```