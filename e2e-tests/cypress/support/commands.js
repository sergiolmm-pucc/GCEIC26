// commands.js — comandos customizados do Cypress

// Comando para fazer login rapidamente nos testes
Cypress.Commands.add('login', () => {
  cy.visit('/');
  cy.wait(3000); // aguarda splash screen
  cy.get('input[placeholder="usuário"]').type('aluno');
  cy.get('input[placeholder="••••••"]').type('123456');
  cy.contains('Entrar').click();
  cy.contains('Bem-vindo ao').should('be.visible');
});
