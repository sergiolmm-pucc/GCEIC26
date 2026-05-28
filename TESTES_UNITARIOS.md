# Documento de Testes Unitários

## 1. Objetivo
Este documento descreve os testes unitários implementados para a API do projeto de Cálculo de Custo de Construção de Piscina. O objetivo é garantir o funcionamento correto das rotas e do controller responsável pelas lógicas matemáticas da aplicação.

## 2. Ferramentas Utilizadas
* **Jest**: Framework de testes em JavaScript para criação da suíte de testes.
* **Supertest**: Biblioteca para testar as requisições HTTP da API Node.js/Express.

## 3. Casos de Teste Implementados

### 3.1. Endpoint: `/PISCINA/volume`
* **Caso Positivo**: Envio de largura, comprimento e profundidade válidos.
  * **Resultado Esperado**: Retorno com status HTTP 200, contendo `volumeMetrosCubicos` e `volumeLitros` calculados corretamente.
* **Caso Negativo (Erro 400)**: Envio com parâmetros faltando (ex: sem profundidade).
  * **Resultado Esperado**: Status HTTP 400 com mensagem de erro de validação.

### 3.2. Endpoint: `/PISCINA/agua`
* **Caso Positivo**: Envio de `volumeMetrosCubicos` e `precoMetroCubico`.
  * **Resultado Esperado**: Status 200 com a propriedade `custoAgua` calculada.
* **Caso Negativo (Erro 400)**: Envio sem os parâmetros obrigatórios.
  * **Resultado Esperado**: Status HTTP 400 informando o erro.

### 3.3. Endpoint: `/PISCINA/materiais`
* **Caso Positivo**: Envio do volume e o `tipoAcabamento` (vinil, fibra ou alvenaria).
  * **Resultado Esperado**: Status 200 com o `custoMateriais` calculado com base na tabela fictícia de preços e margem da hidráulica/elétrica.

### 3.4. Endpoint: `/PISCINA/manutencao`
* **Caso Positivo**: Envio do volume e a quantidade de `meses`.
  * **Resultado Esperado**: Status 200 com o `custoManutencao` final gerado.

### 3.5. Endpoint: `/PISCINA/mao-de-obra`
* **Caso Positivo**: Envio de `diasEstimados`, `trabalhadores` e `valorDiaria`.
  * **Resultado Esperado**: Status 200 com a multiplicação dos valores em `custoMaoDeObra`.

## 4. Como Executar os Testes
No terminal, dentro da pasta `api`, execute o seguinte comando:
```bash
npm install
npm test
```
O CI/CD (GitHub Actions) também executa estes testes automaticamente a cada alteração na branch principal (push/pull request).
