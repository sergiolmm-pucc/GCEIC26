describe('Testes Funcionais - AutoCalc - Grupo 11', () => {

  const fazerLogin = () => {
    cy.visit('/');
    cy.wait(3000); // aguarda splash screen
    cy.get('input[placeholder="usuário"]', { timeout: 8000 }).type('aluno');
    cy.get('input[placeholder="••••••"]').type('123456');
    cy.contains('Entrar').click();
    cy.contains('Bem-vindo ao', { timeout: 8000 }).should('be.visible');
  };

  it('Deve exibir a splash screen e ir para login automaticamente', () => {
    cy.visit('/');
    cy.contains('AutoCalc', { timeout: 5000 }).should('be.visible');
  });

  it('Deve mostrar erro ao tentar login com credenciais incorretas', () => {
    cy.visit('/');
    cy.wait(3000);
    cy.get('input[placeholder="usuário"]', { timeout: 8000 }).type('errado');
    cy.get('input[placeholder="••••••"]').type('errado');
    cy.contains('Entrar').click();
    cy.contains('Usuário ou senha incorretos', { timeout: 8000 }).should('be.visible');
  });

  it('Deve fazer login com sucesso e exibir a Home', () => {
    fazerLogin();
    cy.contains('AutoCalc').should('be.visible');
  });

  it('Deve calcular autonomia e exibir o resultado', () => {
    fazerLogin();

    cy.contains('Calcular Autonomia').click();
    cy.get('input[placeholder="Ex: 500"]', { timeout: 5000 }).type('500');
    cy.get('input[placeholder="Ex: 40"]').type('40');
    cy.contains('Calcular →').click();
    cy.wait(2000); // aguarda resposta da API

    cy.contains('12.5', { timeout: 8000 }).should('be.visible');
    cy.contains('Boa').should('be.visible');
  });

  it('Deve calcular custo de viagem e exibir resultado', () => {
    fazerLogin();

    cy.contains('Viagem').click();
    cy.get('input[placeholder="Ex: 300"]', { timeout: 5000 }).type('300');
    cy.get('input[placeholder="Ex: 12"]').type('12');
    cy.get('input[placeholder="Ex: 6.50"]').type('6.00');
    cy.contains('Calcular →').click();
    cy.wait(2000);

    cy.contains('150', { timeout: 8000 }).should('be.visible');
  });

  it('Deve comparar combustíveis e recomendar o melhor', () => {
    fazerLogin();

    cy.contains('Comparar').click();
    cy.get('input[placeholder="Ex: 5.80"]', { timeout: 5000 }).type('5.50');
    cy.get('input[placeholder="Ex: 3.90"]').type('3.50');
    cy.get('input[placeholder="Ex: 12"]').type('12');
    cy.get('input[placeholder="Ex: 8.5"]').type('8.5');
    cy.contains('Calcular →').click();
    cy.wait(2000);

    cy.contains('Etanol', { timeout: 8000 }).should('be.visible');
  });

  it('Deve navegar para Sobre e ver os membros da equipe', () => {
    fazerLogin();

    cy.contains('Sobre').click();
    cy.contains('Henrique Zacarrias', { timeout: 5000 }).should('be.visible');
    cy.contains('Rafael Tamura').should('be.visible');
    cy.contains('Caio Adamo').should('be.visible');
  });
});
