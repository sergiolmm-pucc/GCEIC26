describe('Testes Funcionais - Calculadora de Piscina GCEIC2026', () => {
  const baseUrl = 'http://localhost:5173';

  it('Deve exibir a Splash Screen e redirecionar automaticamente para o Login', () => {
    cy.visit(`${baseUrl}/`); 
    // Atualizado para o novo subtítulo da Splash Screen Premium
    cy.contains('GCEIC2026 • Engenharia & Gestão de Custos').should('be.visible');
    
    cy.url({ timeout: 4000 }).should('include', '/login');
  });

  it('Deve mostrar erro ao tentar login com credenciais incorretas', () => {
    cy.visit(`${baseUrl}/login`);
    // Atualizado para os novos placeholders
    cy.get('input[placeholder="Ex: admin"]').type('admin');
    cy.get('input[placeholder="••••••••"]').type('senha_errada');
    // Atualizado para o novo texto do botão
    cy.contains('Autenticar sistema').click();
    
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Usuário ou senha incorretos!');
    });
  });

  it('Deve fazer login com sucesso e redirecionar para a calculadora', () => {
    cy.visit(`${baseUrl}/login`);
    cy.get('input[placeholder="Ex: admin"]').type('admin');
    cy.get('input[placeholder="••••••••"]').type('1234');
    cy.contains('Autenticar sistema').click();
    
    cy.url().should('include', '/calculadora');
  });

  it('Deve preencher os dados, chamar a API e exibir o orçamento completo', () => {
    cy.visit(`${baseUrl}/calculadora`);
    
    cy.get('input[name="largura"]').type('4');
    cy.get('input[name="comprimento"]').type('8');
    cy.get('input[name="profundidade"]').type('1.5');
    
    cy.get('input[name="precoAgua"]').type('10');
    cy.get('input[name="precoManutencao"]').type('50');
    cy.get('input[name="precoEletrico"]').type('1500');
    cy.get('input[name="precoHidraulico"]').type('2000');
    
    cy.contains('Calcular Projeto').click();

    // Atualizado para o novo título do card de resultado
    cy.contains('📋 Relatório Orçamentário', { timeout: 10000 }).should('be.visible');
    
    cy.contains('48 m³').should('be.visible'); 
    cy.contains('R$ 3.500,00').should('be.visible'); 
  });

  it('Deve navegar para a tela Sobre e listar os membros da equipe', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Sobre a Equipe').click();
    
    cy.url().should('include', '/sobre');
    cy.contains('Grupo 7').should('be.visible');
    
    cy.contains('Bruno Lenitta Machado').should('be.visible');
    cy.contains('Nicolas Mitjans Nunes').should('be.visible');
  });

  it('Deve navegar para a tela de Ajuda e conseguir voltar para a Calculadora', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Ajuda').click();
    
    cy.url().should('include', '/help');
    // Atualizado para o novo título da página de Ajuda
    cy.contains('Documentação de Apoio').should('be.visible');
    
    // Atualizado para o novo texto do botão de voltar
    cy.contains('Voltar para o Painel Principal').click();
    cy.url().should('include', '/calculadora');
  });

  it('Deve fazer logout com sucesso e voltar para a tela de login', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Sair').click();
    
    cy.url().should('include', '/login');
    // Atualizado para o novo subtítulo da tela de Login
    cy.contains('Insira suas credenciais corporativas abaixo').should('be.visible');
  });
});