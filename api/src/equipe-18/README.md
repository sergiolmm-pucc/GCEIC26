# Impostos NF

API para cálculo de impostos (ICMS, IPI, PIS/COFINS) para Notas Fiscais.

## Estrutura do Projeto e Responsabilidades

Abaixo estão as responsabilidades de cada pasta e arquivo na estrutura do projeto:

### `src/`
Pasta raiz do código fonte da aplicação.

*   **`server.ts`**: Ponto de entrada da aplicação. Responsável apenas por iniciar o servidor HTTP.
*   **`app.ts`**: Configuração principal do Fastify. Registra rotas, plugins e configurações globais.

#### `routes/` (Camada HTTP - Endpoints da API)
Recebe requests e envia responses. NÃO deve conter regra de negócio complexa.
*   **`health.ts`**: Endpoint de health check (Ex: `GET /INFP/health`).
*   **`icms.ts`**: Rotas relacionadas ao cálculo de ICMS.
*   **`ipi.ts`**: Rotas relacionadas ao cálculo de IPI.
*   **`pis-cofins.ts`**: Rotas relacionadas ao cálculo de PIS/COFINS.
*   **`nf-completa.ts`**: Rota consolidada que junta todos os cálculos em uma única chamada.

#### `schemas/` (Schemas de Validação)
Define o formato esperado do request utilizando Zod.
*   **`icms-schema.ts`**: Validação de entrada do ICMS.
*   **`ipi-schema.ts`**: Validação de entrada do IPI.
*   **`pis-schema.ts`**: Validação de entrada do PIS/COFINS.

#### `services/` (Regras de Negócio)
Contém os cálculos e lógicas principais. Não depende de Fastify ou HTTP.
*   **`icms-service.ts`**: Lógica de cálculo do ICMS.
*   **`ipi-service.ts`**: Lógica de cálculo do IPI.
*   **`pis-service.ts`**: Lógica de cálculo do PIS/COFINS.

#### `tests/` (Testes Automatizados)
Contém testes unitários e funcionais.
*   **`icms.spec.ts`**: Testes do cálculo/rota de ICMS.
*   **`ipi.spec.ts`**: Testes do cálculo/rota de IPI.
*   **`pis-cofins.spec.ts`**: Testes do cálculo/rota de PIS/COFINS.
*   **`nf-completa.spec.ts`**: Testes da integração de todos os cálculos.

#### `plugins/` (Plugins e Configurações Globais)
Centraliza integrações reutilizáveis do Fastify.
*   **`swagger.ts`**: Configuração da documentação Swagger/OpenAPI.

#### `utils/` (Utilidades)
Funções auxiliares reutilizáveis, helpers, constantes e formatadores.

---

## Equipe e Atribuições

### 👨‍💻 João Gabriel (JG)
**Backend & DevOps**
*   **API:** Estrutura base do projeto (Node.js + Fastify), rota `/health` e rota `/nf-completa` (consolidação de impostos).
*   **DevOps:** CI/CD (GitHub Actions), deploy na AWS e gestão do repositório.
*   **Gestão:** Code review, cronograma e Setup inicial do projeto.

### 👨‍💻 Pedro Daou (PD)
**Backend**
*   **API:** Rotas `/icms` (alíquota por estado) e `/ipi` (cálculo sobre produto) + Testes unitários.

### 👨‍💻 Gabriel Bonatto (GB)
**Backend & Doc**
*   **API:** Rota `/pis-cofins` (regimes cumulativo/não cumulativo) + Testes unitários.
*   **Doc:** Testes funcionais e documentação técnica (README).

---
