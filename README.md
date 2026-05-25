# HourlyCost 💸

> **Gerência de Configuração, Entrega e Integração Contínua (GCEIC26)**  
> *Atividade 2 – 1º Semestre de 2026*  
> **Equipe 25**

**HourlyCost** é uma calculadora financeira modular e avançada que ajuda freelancers, consultores e autônomos a gerenciarem a capacidade produtiva, estimarem despesas operacionais e precificarem suas horas de prestação de serviços com impostos e margem de lucro por dentro.

O projeto é constituído por uma **API em Node.js (Express)**, um **frontend moderno em React (Vite)**, uma **suíte de testes automatizados (unitários, integração e E2E)** e uma **esteira de CI/CD completa** integrada ao Render.com.

---

## 👥 Integrantes e Contribuições (Equipe 25)

Cada etapa do cálculo financeiro e das rotas de integração foi desenvolvida modularmente por um dos integrantes da equipe:

1. **Fernando Furlanetto** (Mão de Obra e Encargos)
   * Responsável pelo endpoint `POST /api/csh/labor-cost`.
   * Implementou os cálculos de custo anual da mão de obra (incluindo provisões de 13º salário e 1/3 de férias), horas úteis reais e capacidade faturável com base em metas de produtividade.
2. **Matheus Augusto** (Custos Fixos e Equilíbrio)
   * Responsável pelo endpoint `POST /api/csh/operating-cost`.
   * Implementou o rateio de custos fixos operacionais e despesas de segurança (*overhead*), bem como o cálculo da hora de equilíbrio do negócio (ponto de equilíbrio).
3. **Raul Antonio** (Markup e Impostos)
   * Responsável pelo endpoint `POST /api/csh/final-price`.
   * Implementou o embutimento da margem de lucro e o cálculo de impostos "por dentro" para chegar ao preço de venda sugerido final por hora, bem como projeções de faturamento e lucro líquido mensal.

---

## 🎨 Funcionalidades e Telas do App

O frontend foi desenvolvido com uma experiência rica, interativa e responsiva em React:

*   **Splash Screen:** Animação de carregamento elegante exibida na inicialização do sistema.
*   **Tela de Login:** Acesso restrito e seguro por meio de credenciais fixas (Usuário: `admin` / Senha: `admin`).
*   **Calculadora Financeira (Uso do App):** Painel interativo com 9 campos de entrada de fácil digitação e exibição detalhada de 17 métricas financeiras divididas em Mão de Obra, Custos Operacionais e Precificação.
*   **Sobre a Equipe:** Apresenta a foto dos desenvolvedores da equipe e a respectiva atribuição e papel de cada integrante na atividade.
*   **Ajuda:** Um guia de uso simplificado para orientar o usuário a alimentar os dados na ordem lógica ideal.

---

## 🏗️ Estrutura do Repositório

O projeto adota uma arquitetura em monorepo organizada e limpa:

```
├── .github/workflows/
│   └── deploy.yml          # Esteira de CI/CD (GitHub Actions)
├── api/                    # Backend Node.js / Express
│   ├── src/
│   │   ├── app.js          # Definição e roteamento das rotas Express
│   │   └── funcoes.js      # Lógica matemática modular das 3 partes do cálculo
│   └── tests/
│       ├── api.test.js     # Testes de integração da API com Supertest
│       └── funcoes.test.js # Testes unitários Jest das fórmulas de cálculo
├── app/                    # Frontend React / Vite
│   ├── src/
│   │   ├── App.jsx         # Componentes React e controle de estados do app
│   │   ├── App.test.jsx    # Testes unitários e Snapshots de UI em Vitest
│   │   └── styles.css      # Design e folha de estilos do app
│   └── public/
│       └── equipe.jpg      # Foto da equipe (adicione a foto real aqui!)
├── docs/                   # Documentações e relatórios de suporte
│   ├── cronograma.md       # Cronograma de planejamento e entrega de features
│   └── testes.md           # Relatório descritivo dos testes desenvolvidos
└── e2e-tests/              # Testes funcionais automatizados de ponta a ponta
    └── tests/
        └── base.test.js    # Teste de fluxo funcional Selenium (Login e navegação)
```

---

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
*   [Node.js](https://nodejs.org/) (versão 18 ou superior instalada)
*   [Google Chrome](https://www.google.com/chrome/) e Chrome Driver (para os testes E2E do Selenium)

### 2. Iniciando a API Backend
Abra um terminal na raiz e execute:
```bash
cd api
npm install
npm start
```
A API iniciará na porta `3001` (com um endpoint de monitoramento em `http://localhost:3001/health`).

### 3. Iniciando a Aplicação Web
Abra outro terminal na raiz e execute:
```bash
cd app
npm install
npm run dev
```
O app React estará disponível em `http://localhost:5173` ou `http://localhost:3000`.

---

## 🧪 Como Executar as Suítes de Testes

### Testes da API (Unitários & Integração)
```bash
cd api
# Conceda permissão ao executável caso necessário (Linux)
chmod +x node_modules/.bin/jest
# Roda a suíte completa de testes no Jest
npm test
```

### Testes do App React (Vitest & Snapshots)
```bash
cd app
# Conceda permissão ao executável caso necessário (Linux)
chmod +x node_modules/.bin/vitest
# Roda testes de renderização, simulações de fluxo e snapshots de UI
npm test
```

### Testes Funcionais E2E (Selenium Webdriver)
Certifique-se de que a API e o App estão rodando localmente nas portas padrões antes de executar:
```bash
cd e2e-tests
npm install
npm test
```
*Os testes funcionais geram evidências fotográficas em formato `.png` na pasta `e2e-tests/screenshots`.*

---

## 🚀 Integração e Entrega Contínua (CI/CD)

O pipeline do GitHub Actions em `.github/workflows/deploy.yml` é acionado automaticamente a cada `push` nas branches `main` e `dev`:

1.  **Validação de Mudanças:** Detecta em qual pasta houve alterações (api ou app) para otimizar as etapas.
2.  **Testes de CI:**
    *   Instala as dependências limpas (`npm ci`).
    *   Executa os testes unitários e gera relatórios de cobertura.
    *   Inicializa os servidores em segundo plano no runner virtual.
    *   Executa os testes funcionais E2E com Selenium/Headless Chrome, gerando capturas de tela.
3.  **Entrega e Deploy:**
    *   Realiza o deploy automático da API e da aplicação Web no Render.com via Webhooks dedicados.
    *   Consome a API do Render para monitorar a transição até o status de deploy estar `"live"`.
    *   Realiza testes funcionais pós-deploy diretamente nas URLs de produção (`gceic26.onrender.com` e `gceic26-app.onrender.com`).
4.  **Artefatos:** Armazena e disponibiliza as imagens em `.png` geradas durante os testes funcionais como artefatos da execução do workflow do Action.
