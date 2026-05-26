# 💧 AguaCalc — Calculadora de Consumo de Água

Projeto da disciplina **GCEIC26 — Gerência de Configuração, Entrega e Integração Contínua**  
Escola Politécnica PUC-Campinas — 1º Semestre 2026  
**Grupo 20**

---

## 👥 Equipe e Divisão

| Integrante | RA | Responsabilidade |
|---|---|---|
| Ana Julia Matozo Rodrigues | 23027461 | API 1 — Consumo Diário |
| Hugo Daniel Bosada Rodrigues | 23909526 | API 2 — Custo Mensal |
| Letícia Lima da Silva | 23918691 | API 3 — Projeção de Economia |

---

## 📋 Sobre o projeto

O AguaCalc calcula o consumo de água de uma residência com base nos hábitos dos moradores (tempo de banho e número de descargas por dia), gerando:

- Consumo diário e mensal em litros e m³
- Valor estimado da conta de água por tarifa informada
- Projeção de economia com sugestões práticas por pessoa

### Valores de referência (fonte: CAESB)
- Banho: **~4,5 litros por minuto**
- Descarga: **~8,5 litros por acionamento**

---

## 🗂️ Estrutura do projeto

```
.
├── api/                        # Backend Node.js + Express
│   ├── src/
│   │   ├── app.js              # Express + rotas
│   │   └── funcoes.js          # Lógica de cálculo
│   ├── tests/
│   │   ├── api.test.js         # Testes de integração (supertest)
│   │   └── funcoes.test.js     # Testes unitários (jest)
│   ├── index.js
│   └── package.json
├── app/                        # Frontend Node.js + EJS
│   ├── views/
│   │   ├── splash.ejs          # Tela inicial com animação
│   │   ├── login.ejs           # Login
│   │   ├── calculo.ejs         # Cálculo em 3 etapas
│   │   ├── sobre.ejs           # Sobre a equipe
│   │   └── help.ejs            # Ajuda e documentação
│   ├── public/                 # Fotos da equipe
│   ├── index.js                # Express + rotas + proxy + rota equipe-20
│   └── package.json
├── e2e-tests/
│   ├── tests/base.test.js      # Testes funcionais Selenium
│   └── package.json
└── .github/workflows/deploy.yml
```

---

## 🔌 Endpoints da API

| Método | Rota | Responsável | Descrição |
|---|---|---|---|
| GET | /health | — | Status da API |
| GET | /api/tabelas | — | Constantes e faixas de tarifação |
| POST | /AGUA/consumoDiario | Ana | Calcula consumo diário da residência |
| POST | /AGUA/custoMensal | Hugo | Calcula custo mensal |
| POST | /AGUA/economia | Letícia | Projeta economia e sugestões por pessoa |

### POST /AGUA/consumoDiario
```json
{
  "tempoBanhoMin": 10,
  "descargasDia": 3,
  "pessoas": 4
}
```

### POST /AGUA/custoMensal
```json
{
  "consumoDiarioLitros": 282,
  "tarifa": 0.005,
  "dias": 30
}
```

### POST /AGUA/economia
```json
{
  "litrosAtuais": 8460,
  "reducaoPercentual": 20,
  "tarifa": 0.005,
  "pessoas": 4
}
```

---

## 🚀 Como rodar localmente

### Pré-requisito
Node.js instalado na máquina.

### API (porta 3001)
```bash
cd api
npm install
npm start
```
Acesse: `http://localhost:3001/health`

### App (porta 3000)
```bash
cd app
npm install
API_URL=http://localhost:3001 npm start
```
Acesse: `http://localhost:3000`  
Login: **admin / admin**

---

## 🧪 Testes

### Unitários e de integração
```bash
cd api
npm run test
```
- 28 testes passando
- Cobertura: ~94%

### Funcionais (e2e)
Com a API e o app rodando:
```bash
cd e2e-tests
npm test
```
Cenários testados:
- Splash screen carrega corretamente
- Redirect para login sem autenticação
- Login com credenciais erradas exibe erro
- Login correto redireciona para /calculo

---

## ⚙️ CI/CD

Pipeline configurado via GitHub Actions em `.github/workflows/deploy.yml`:

1. Detecta mudanças nas pastas `api/` e `app/`
2. Instala dependências com `npm ci`
3. Roda os 28 testes unitários com relatório Jest-JUnit
4. Sobe API e app em background e roda testes e2e com Selenium
5. Salva screenshots dos testes como artefato
6. Deploy automático da API no Render após testes passarem
7. Deploy automático do app no Render
8. Roda testes e2e novamente apontando para as URLs do Render

**Branch:** `grupo20/calc_consumo_agua`  
**Repositório:** https://github.com/sergiolmm-pucc/GCEIC26

---

## 🌐 URLs em produção

| Serviço | URL |
|---|---|
| API | https://gceic26.onrender.com |
| App | https://gceic26-app.onrender.com |
| Rota do grupo | https://gceic26-app.onrender.com/equipe-20 |
