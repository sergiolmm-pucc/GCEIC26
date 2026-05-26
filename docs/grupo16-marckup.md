# RELATÓRIO TÉCNICO — ATIVIDADE PRÁTICA

**Disciplina:** Gerência de Configuração, Entrega e Integração Contínua  
**Projeto:** MarkUp Calc — Calculadora de Preço de Venda por MarkUp  
**Branch:** `grupo16/markup`  
**Repositório:** `https://github.com/sergiolmm-pucc/GCEIC26`  
**Ambiente de Produção:**
- API: `https://gceic26.onrender.com`
- App: `https://gceic26-app.onrender.com/equipe-16`

**Integrantes:**
| Nome | Responsabilidade Principal |
|------|---------------------------|
| Douglas Monttozo 23904592 | API REST, CI/CD, Deploy, Integração |
| Fabio Su li 23027760 | Lógica de Negócio, Testes Unitários |
| Leo Correa 23028489 | Frontend, Testes Funcionais |

---

## 1. Introdução

Este relatório documenta as atividades realizadas pelo Grupo 16 na disciplina de Gerência de Configuração, Entrega e Integração Contínua. O trabalho contempla o desenvolvimento de uma aplicação web para cálculo de preço de venda utilizando a metodologia de MarkUp, com foco na implementação de uma pipeline de CI/CD completa, testes unitários automatizados, testes funcionais (E2E) e deploy contínuo em ambiente de nuvem.

A aplicação é composta por dois serviços independentes: uma API RESTful construída em Node.js/Express responsável pela lógica de negócio, e um aplicativo web construído também em Node.js/Express com templates EJS para a interface do usuário.

---

## 2. Objetivos

- Implementar uma API REST com lógica de cálculo de MarkUp validada por testes unitários;
- Desenvolver uma interface web funcional integrada à API;
- Configurar pipeline de Integração e Entrega Contínua (CI/CD) via GitHub Actions;
- Gerar relatórios automatizados de testes unitários em formato JUnit XML;
- Implementar testes funcionais (E2E) com Selenium WebDriver e Chrome headless;
- Realizar deploy automatizado dos serviços na plataforma Render.com;
- Integrar o projeto ao aplicativo central da turma em `/equipe-16`.

---

## 3. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                  branch: grupo16/markup                  │
├──────────────┬──────────────────┬───────────────────────┤
│   api/       │   app/           │   e2e-tests/          │
│  Node.js     │  Node.js + EJS   │  Selenium WebDriver   │
│  Express     │  Express         │  Chrome Headless      │
│  Port 3001   │  Port 3000       │                       │
└──────┬───────┴────────┬─────────┴───────────────────────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────────────────────────────┐
│ Render.com  │  │         Render.com                  │
│ API Service │  │  App Central (gceic26-app)          │
│ /api/calcul │  │  /equipe-16 → MarkUp Calc           │
└─────────────┘  └─────────────────────────────────────┘
```

### 3.1 Fórmula de Cálculo

```
preco_venda = custo_produto / (1 - percentual_total)

percentual_total = despesas_fixas + despesas_variaveis + impostos + margem_lucro
```

Os percentuais são informados como valores inteiros ou decimais (ex: `10` representa `10%`, convertido internamente para `0.10`).

---

## 4. Desenvolvimento por Integrante

### 4.1 Fabio — Lógica de Negócio e Testes Unitários

#### 4.1.1 Módulo de Cálculo (`api/src/funcoes.js`)

A lógica de negócio do MarkUp foi implementada de forma isolada no módulo `funcoes.js`, desacoplada do servidor HTTP. Essa separação permite testar a lógica de cálculo independentemente da camada de transporte.

O módulo expõe três elementos públicos:

```javascript
module.exports = { TABELA, calcular, calcularMarkup };
```

- **`TABELA`**: constante com os campos aceitos e a fórmula de cálculo, utilizada pelo endpoint `/api/tabelas`;
- **`calcularMarkup`**: função principal que recebe o objeto de dados, aplica validações e retorna o resultado;
- **`calcular`**: wrapper público que delega para `calcularMarkup`.

**Funções auxiliares internas:**

| Função | Responsabilidade |
|--------|-----------------|
| `lerNumero(dados, campo)` | Converte campo para `Number`, lança `TypeError` se não for finito |
| `lerPercentual(dados, campo)` | Chama `lerNumero` e converte para decimal (divide por 100), lança `Error` se negativo |

#### 4.1.2 Validações Implementadas

A função `lerNumero` realiza validação de tipo, lançando `TypeError` quando o valor informado não é numérico finito. As demais validações de regra de negócio lançam `Error`:

```javascript
function lerNumero(dados, campo) {
  const valor = Number(dados[campo]);
  if (!Number.isFinite(valor)) {
    throw new TypeError(`Campo ${campo} deve ser numerico`);
  }
  return valor;
}
```

Validações de domínio implementadas:
- Corpo da requisição deve ser um objeto válido (`TypeError`);
- Custo do produto deve ser maior que zero;
- Percentuais não podem ser negativos;
- Soma dos percentuais deve ser inferior a 100%.

O uso de `TypeError` para checagens de tipo (em vez do genérico `Error`) segue a recomendação da análise estática de código (SonarQube), diferenciando erros de tipo de erros de domínio.

#### 4.1.3 Testes Unitários

Os testes unitários foram desenvolvidos com Jest e organizados em dois arquivos:

**`tests/funcoes.test.js`** — testa a lógica de negócio isolada:

| Caso de Teste | Entrada | Resultado Esperado |
|---------------|---------|-------------------|
| Cálculo com dados válidos | custo=100, taxas=10/5/12/20% | precoVenda=188.68, percentualTotal=0.47 |
| Custo do produto inválido (zero) | custoProduto=0 | Lança `'Custo do produto deve ser maior que zero'` |
| Percentual negativo | despesasFixas=-1 | Lança `'Campo despesasFixas nao pode ser negativo'` |
| Soma de percentuais ≥ 100% | 30+20+20+30=100% | Lança `'A soma dos percentuais deve ser menor que 100%'` |

**`tests/api.test.js`** — testa os endpoints HTTP com `supertest`:

| Caso de Teste | Endpoint | Status Esperado |
|---------------|----------|----------------|
| Health check | `GET /health` | 200, `{ status: 'ok' }` |
| Tabela de campos | `GET /api/tabelas` | 200, contém `custoProduto` |
| Cálculo válido | `POST /api/calcular` | 200, precoVenda=188.68 |
| Dados inválidos | `POST /api/calcular` (soma ≥ 100%) | 400, `success: false` |

**Configuração do script de testes (`package.json`):**

```json
"test": "jest --coverage --verbose --ci --reporters=default --reporters=jest-junit"
```

A flag `--reporters=jest-junit` gera o arquivo `junit.xml` consumido pelo `dorny/test-reporter` na pipeline de CI/CD.

---

### 4.2 Leo — Frontend e Testes Funcionais

#### 4.2.1 Estrutura do Aplicativo Web

O frontend foi desenvolvido em Node.js/Express com template engine EJS. O aplicativo atua como intermediário entre o usuário e a API, encaminhando as requisições de cálculo via proxy interno.

**Telas implementadas:**

| Rota | Tela | Autenticação |
|------|------|-------------|
| `/equipe-16/splash` | Splash screen | Não |
| `/equipe-16/login` | Formulário de login | Não |
| `/equipe-16/calculo` | Calculadora MarkUp | Sim |
| `/equipe-16/sobre` | Informações da equipe | Sim |
| `/equipe-16/help` | Ajuda de uso | Sim |
| `/equipe-16/logout` | Encerramento de sessão | Sim |

**Autenticação por sessão:**

```javascript
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect(BASE_PATH + '/login');
}
```

**Proxy para a API:**

```javascript
router.post('/calcular', requireAuth, async (req, res) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`${API_URL}/api/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.status(response.status).json(data);
});
```

#### 4.2.2 Integração ao App Central da Turma

O aplicativo foi integrado ao servidor central da turma em `gceic26-app.onrender.com`. O roteador do grupo 16 é montado no prefixo `/equipe-16`, com suporte a `BASE_PATH` para compatibilidade com proxy reverso:

```javascript
const BASE_PATH = '/equipe-16';
app.use(BASE_PATH, grupo16);
```

O botão de acesso na página inicial da turma foi configurado:

```javascript
{ numero: 16, nome: 'G16 - MarkUp Calc', rota: '/equipe-16' }
```

#### 4.2.3 Testes Funcionais (E2E)

Os testes funcionais foram implementados com Selenium WebDriver e Chrome em modo headless. O suite executa dois cenários principais:

**Cenário 1 — Login com credenciais inválidas:**

```
1. Acessar /login
2. Captura de screenshot (estado inicial)
3. Preencher username='Adm', password='admin' (senha errada)
4. Captura de screenshot (campos preenchidos)
5. Submeter formulário
6. Verificar mensagem de erro 'invalidos'
7. Captura de screenshot (mensagem de erro)
```

As capturas de tela são armazenadas em `e2e-tests/screenshots/` e publicadas como artefatos no GitHub Actions.

**Configuração do Chrome headless:**

```javascript
opts.addArguments(
  '--headless=new',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=800,640',
  '--disable-gpu'
);
```

---

### 4.3 Douglas — API REST, CI/CD, Deploy e Integração

#### 4.3.1 Estrutura da API REST

A API foi projetada seguindo os princípios REST, com separação entre o servidor HTTP (`api/src/app.js`) e a lógica de negócio (`api/src/funcoes.js`). O servidor é inicializado em `api/index.js`, que define a porta via variável de ambiente `PORT`.

**Dependências de produção:**

```json
"dependencies": {
  "express": "^5.2.1",
  "cors":    "^2.8.6",
  "helmet":  "^8.1.0"
}
```

**Middlewares de segurança aplicados:**

```javascript
app.use(helmet());   // define cabeçalhos HTTP de segurança
app.use(cors());     // habilita Cross-Origin Resource Sharing
app.use(express.json());
```

O `helmet` aplica automaticamente cabeçalhos como `Content-Security-Policy`, `X-Frame-Options` e `Strict-Transport-Security`, mitigando classes comuns de vulnerabilidades web. O `cors` permite que o frontend consuma a API mesmo estando em origens distintas.

**Endpoints implementados:**

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/health` | Verificação de saúde da API | Não |
| `GET` | `/api/tabelas` | Retorna campos aceitos e fórmula | Não |
| `POST` | `/api/calcular` | Executa o cálculo de MarkUp | Não |

**Endpoint de saúde (`GET /health`):**

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

Utilizado pela pipeline de CI/CD para verificar disponibilidade do serviço antes de executar os testes funcionais (`npx wait-on http://localhost:3001/health`).

**Endpoint de cálculo (`POST /api/calcular`):**

```javascript
app.post('/api/calcular', (req, res) => {
  try {
    const resultado = calcular(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
```

O tratamento de erros captura tanto `TypeError` (campo não numérico) quanto `Error` (violação de regra de negócio), retornando HTTP 400 com a mensagem descritiva.

**Exemplo de requisição (`POST /api/calcular`):**

```json
{
  "custoProduto": 100,
  "despesasFixas": 10,
  "despesasVariaveis": 5,
  "impostos": 12,
  "margemLucro": 20
}
```

**Exemplo de resposta com sucesso (HTTP 200):**

```json
{
  "success": true,
  "data": {
    "custoProduto": "100.00",
    "percentualTotal": 0.47,
    "percentuais": {
      "despesasFixas": 0.1,
      "despesasVariaveis": 0.05,
      "impostos": 0.12,
      "margemLucro": 0.2
    },
    "precoVenda": "188.68"
  }
}
```

**Exemplo de resposta com erro (HTTP 400):**

```json
{
  "success": false,
  "error": "A soma dos percentuais deve ser menor que 100%"
}
```

#### 4.3.2 Pipeline de CI/CD

A pipeline foi configurada em `.github/workflows/deploy.yml` utilizando GitHub Actions. O workflow é acionado por push nas branches `main`, `dev` e `grupo16/markup`, e por pull requests direcionados à branch `grupo16/markup`.

**Diagrama de fluxo da pipeline:**

```
push → detect-changes
           │
    ┌──────┴──────┐
    ▼             ▼
api mudou?    app mudou?
    │             │
    ▼             ▼
unitTestApi   deploy-app
 (testes       (deploy
  + E2E)        direto)
    │             │
    ▼             ▼
deploy-api    ─────────┐
    │                  │
    └──────────────────┘
                │
                ▼
        teste_funcional
        (E2E em produção)
```

#### 4.3.3 Jobs da Pipeline

**Job: `detect-changes`**

Utiliza `dorny/paths-filter@v4` para detectar alterações em `api/` ou `app/`, evitando execuções desnecessárias:

```yaml
filters: |
  api:
    - 'api/**'
  app:
    - 'app/**'
```

**Job: `unitTestApi`** *(condicional: mudanças em `api/`)*

Executa em sequência:
1. Instalação de dependências da API (`npm ci`);
2. Execução dos testes unitários (`npm run test`);
3. Publicação do relatório JUnit via `dorny/test-reporter@v3`;
4. Inicialização da API e do App em background;
5. Aguarda disponibilidade dos serviços (`npx wait-on`);
6. Instalação do Chrome v149 via `browser-actions/setup-chrome@v1`;
7. Execução dos testes funcionais E2E;
8. Upload das capturas de tela como artefatos (`actions/upload-artifact@v4`).

**Job: `deploy-api`** *(depende de: `unitTestApi`)*

Aciona o deploy hook do Render para a API, aguarda conclusão verificando periodicamente o status via Render API:

```bash
STATUS=$(curl --request GET \
  --url https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID \
  --header "Authorization: Bearer $RENDER_API_KEY" \
  | jq -r '.status')
```

Considera deploy concluído com status `live` ou `null`. Falha com `build_failed`, `deactivated` ou `canceled`.

**Job: `deploy-app`** *(condicional: mudanças em `app/`)*

Aciona o deploy hook do App, com lógica de polling equivalente ao `deploy-api`.

**Job: `teste_funcional`** *(depende de: `deploy-api` e `deploy-app`)*

Executa os testes E2E contra os URLs de produção após ambos os deploys serem concluídos com sucesso:

```yaml
env:
  API_URL: https://gceic26.onrender.com
  APP_URL: https://gceic26-app.onrender.com
```

#### 4.3.4 Secrets Utilizados

| Secret | Uso |
|--------|-----|
| `DEPLOY_HOOK` | URL do deploy hook da API no Render |
| `DEPLOY_APP_HOOK` | URL do deploy hook do App no Render |
| `SERVICE_ID` | ID do serviço da API no Render |
| `SERVICE_ID_APP` | ID do serviço do App no Render |
| `RENDER_API_KEY` | Chave de autenticação da API REST do Render |

#### 4.3.5 Geração de Relatório de Testes

O relatório de testes unitários é gerado automaticamente em formato JUnit XML pelo `jest-junit` e publicado como check no GitHub via `dorny/test-reporter@v3`:

```yaml
- name: Gera relatorio de testes
  uses: dorny/test-reporter@v3
  if: success() || failure()
  with:
    name: JEST tests
    path: ./api/j*.xml
    reporter: jest-junit
```

A flag `if: success() || failure()` garante que o relatório seja sempre gerado, mesmo quando os testes falham, permitindo análise dos resultados.

#### 4.3.6 Gestão de Branches e Integração

O fluxo de trabalho adotado seguiu o modelo **Feature Branch**:

1. Desenvolvimento isolado na branch `grupo16/markup`;
2. Execução da pipeline a cada push para validação contínua;
3. Merge da branch `main` para a `grupo16/markup` para sincronização com as atualizações do professor;
4. Resolução de conflitos no `app/index.js` preservando as rotas do grupo;
5. Pull Request de `grupo16/markup` → `main` para entrega final.

---

## 5. Resultados

### 5.1 Testes Unitários

| Suite | Total | Passou | Falhou |
|-------|-------|--------|--------|
| `funcoes.test.js` | 4 | 4 | 0 |
| `api.test.js` | 4 | 4 | 0 |
| **Total** | **8** | **8** | **0** |

### 5.2 Cobertura de Código

A cobertura de código foi gerada com `--coverage` do Jest, abrangendo os módulos `src/funcoes.js` e `src/app.js`.

### 5.3 Pipeline

| Job | Status |
|-----|--------|
| detect-changes | ✅ Passou |
| unitTestApi (testes + E2E local) | ✅ Passou |
| deploy-api | ✅ Passou |
| deploy-app | ✅ Passou |
| teste_funcional | ✅ Executado |

---

## 6. Conclusão

O Grupo 16 implementou com sucesso a aplicação MarkUp Calc com pipeline de CI/CD completa. A separação entre API e frontend permitiu o desenvolvimento e teste independente de cada camada. Os testes unitários cobrem os cenários críticos de cálculo e validação, enquanto os testes funcionais E2E validam o fluxo de autenticação na interface.

A pipeline de CI/CD garante que nenhuma alteração é enviada ao ambiente de produção sem passar pelos testes automatizados, seguindo os princípios de Integração Contínua. O uso de `dorny/test-reporter` fornece visibilidade dos resultados diretamente na interface do GitHub, facilitando a análise por parte dos revisores e do professor avaliador.
