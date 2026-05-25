describe('Testes Funcionais - Calculadora de Piscina Grupo 7', () => {
  const baseUrl = 'http://localhost:5173';

  it('Deve mostrar erro ao tentar login com credenciais incorretas', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Usuário"]').type('admin');
    cy.get('input[placeholder="Senha"]').type('senha_errada');
    cy.contains('Entrar').click();
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Usuário ou senha incorretos!');
    });
  });

  it('Deve fazer login com sucesso e redirecionar para a calculadora', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Usuário"]').type('admin');
    cy.get('input[placeholder="Senha"]').type('1234');
    cy.contains('Entrar').click();
    cy.url().should('include', '/calculadora');
  });

  it('Deve preencher os dados, chamar a API e exibir o orçamento', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.get('input[name="largura"]').type('4');
    cy.get('input[name="comprimento"]').type('8');
    cy.get('input[name="profundidade"]').type('1.5');
    cy.get('input[name="precoAgua"]').type('10');
    cy.get('input[name="precoManutencao"]').type('50');
    cy.get('input[name="precoEletrico"]').type('1500');
    cy.get('input[name="precoHidraulico"]').type('2000');
    cy.contains('Calcular Projeto').click();

    cy.contains('Resumo do Orçamento').should('be.visible');
    cy.contains('48').should('be.visible'); 
    cy.contains('R$ 3.500,00').should('be.visible'); 
  });

  it('Deve navegar para o ecrã Sobre e ver os membros da equipa', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Sobre a Equipe').click();
    cy.url().should('include', '/sobre');
    cy.contains('Grupo 7').should('be.visible');
  });
});