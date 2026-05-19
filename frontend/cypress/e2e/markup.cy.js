describe('Testes Funcionais - Sistema de MarkUp', () => {
  
  beforeEach(() => {
    // Acessa o site local antes de cada teste
    cy.visit('http://localhost:5173')
  })

  it('Deve realizar o login com sucesso usando credenciais fixas', () => {
    // Simula a digitação nos campos da tela de Login.jsx
    // Troque 'admin' pelos valores fixos que vocês usaram!
    cy.get('input[type="text"]').type('admin') 
    cy.get('input[type="password"]').type('1234')
    
    // Simula o clique no botão de entrar
    cy.get('button').contains('Entrar').click()

    // Verifica se foi redirecionado para a tela principal (Dashboard/Home)
    cy.contains('MarkUp').should('be.visible')
  })

  it('Deve calcular o preço de venda via MarkUp corretamente', () => {
    // Primeiro faz o login para acessar a tela de cálculo
    cy.get('input[type="text"]').type('admin') 
    cy.get('input[type="password"]').type('1234')
    cy.get('button').contains('Entrar').click()

    // Navega para a tela de cálculo (caso haja um menu)
    // cy.contains('Calcular MarkUp').click()

    // Preenche os inputs da tela CalculoMarkup.jsx
    cy.get('input[name="custo"]').type('100')
    cy.get('input[name="despesas"]').type('20')
    cy.get('input[name="lucro"]').type('10')

    // Clica em calcular
    cy.get('button').contains('Calcular').click()

    // Verifica se o resultado apareceu na tela (ex: 142.86 que está no backend)
    cy.contains('142.86').should('be.visible')
  })
})