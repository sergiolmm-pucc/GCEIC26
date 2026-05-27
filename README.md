# GCEIC26 - Cálculo de Custo de Prestação de Serviços em Horas (CSH)

Este é o repositório do projeto final da disciplina de **Gerência de Configuração, Entrega e Integração Contínua** (GCEIC26). 

O projeto consiste em uma solução modular para calcular o custo e sugerir o preço final da prestação de serviços por hora, cobrindo mão de obra, custos operacionais fixos e margem de lucro/impostos.

---

## 👥 Integrantes da Equipe
* **Fernando Furlanetto** — Responsável pelo cálculo de Mão de Obra e Horas Faturáveis (`/api/csh/labor-cost`).
* **Matheus Augusto** — Responsável pelo cálculo de Custos Operacionais e Equilíbrio (`/api/csh/operating-cost`).
* **Raul Antonio** — Responsável pela Margem de Lucro e Precificação Final (`/api/csh/final-price`).

---

## 📂 Estrutura do Projeto

* 📁 **[api](file:///c:/Users/acfur/Desktop/Quinto-semestre/padroes/GCEIC26/api)**: Backend em **Node.js + Express** contendo as regras de negócio e endpoints REST da calculadora.
* 📁 **[app](file:///c:/Users/acfur/Desktop/Quinto-semestre/padroes/GCEIC26/app)**: Frontend em **React + Vite** com interface rica contendo splash screen, login de acesso, calculadora interativa e telas institucionais.
* 📁 **[e2e-tests](file:///c:/Users/acfur/Desktop/Quinto-semestre/padroes/GCEIC26/e2e-tests)**: Testes funcionais ponta a ponta com Selenium.
* 📁 **[docs](file:///c:/Users/acfur/Desktop/Quinto-semestre/padroes/GCEIC26/docs)**: Documentação de apoio do projeto.

---

## 📖 Documentação do Projeto

* 📅 **[Cronograma de Implantação](file:///c:/Users/acfur/Desktop/Quinto-semestre/padroes/GCEIC26/docs/cronograma.md)**: Planejamento temporal de entrega das features.
* 🧪 **[Documentação de Testes](file:///c:/Users/acfur/Desktop/Quinto-semestre/padroes/GCEIC26/docs/testes.md)**: Informações sobre os testes unitários (API/App) e testes funcionais (Selenium/Playwright).

---

## 🚀 Como Executar Localmente

### 1. Inicializar a API (Backend)
No diretório `api`:
```bash
cd api
npm install
npm start
```
A API rodará no endereço `http://localhost:3001`.

### 2. Inicializar o App (Frontend)
No diretório `app`:
```bash
cd app
npm install
npm run dev
```
O frontend do Vite rodará em desenvolvimento (geralmente em `http://localhost:5173`).
Para emular a build de produção na porta `3000`:
```bash
npm run build
npm run start
```
