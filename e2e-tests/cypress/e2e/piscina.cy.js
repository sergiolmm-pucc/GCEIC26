describe('Testes Funcionais - Calculadora de Piscina GCEIC2026', () => {
  const baseUrl = 'http://localhost:5173';

  it('Deve exibir a Splash Screen e redirecionar automaticamente para o Login', () => {
    // Presumindo que a Splash Screen é a rota principal '/'
    cy.visit(`${baseUrl}/`); 
    cy.contains('Carregando projeto GCEIC2026...').should('be.visible');
    
    // A splash tem um setTimeout de 3000ms, damos até 4000ms para a URL mudar
    cy.url({ timeout: 4000 }).should('include', '/login');
  });

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

  it('Deve preencher os dados, chamar a API e exibir o orçamento completo', () => {
    cy.visit(`${baseUrl}/calculadora`);
    
    // Preenche as dimensões
    cy.get('input[name="largura"]').type('4');
    cy.get('input[name="comprimento"]').type('8');
    cy.get('input[name="profundidade"]').type('1.5');
    
    // Preenche os custos
    cy.get('input[name="precoAgua"]').type('10');
    cy.get('input[name="precoManutencao"]').type('50');
    cy.get('input[name="precoEletrico"]').type('1500');
    cy.get('input[name="precoHidraulico"]').type('2000');
    
    cy.contains('Calcular Projeto').click();

    // Aumentamos o timeout caso a API (Node.js na porta 3000) leve alguns segundos
    cy.contains('Resumo do Orçamento', { timeout: 10000 }).should('be.visible');
    
    // Asserções formatadas de acordo com a UI da Calculadora.jsx
    cy.contains('48 m³').should('be.visible'); 
    cy.contains('R$ 3.500,00').should('be.visible'); 
  });

  it('Deve navegar para a tela Sobre e listar os membros da equipe', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Sobre a Equipe').click();
    
    cy.url().should('include', '/sobre');
    cy.contains('Grupo 7').should('be.visible');
    
    // Valida se a lista de membros está sendo renderizada
    cy.contains('Bruno Lenitta Machado').should('be.visible');
    cy.contains('Nicolas Mitjans Nunes').should('be.visible');
  });

  it('Deve navegar para a tela de Ajuda e conseguir voltar para a Calculadora', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Ajuda').click();
    
    cy.url().should('include', '/help');
    cy.contains('Ajuda e Instruções').should('be.visible');
    
    // Testa o link de retorno
    cy.contains('Voltar para Calculadora').click();
    cy.url().should('include', '/calculadora');
  });

  it('Deve fazer logout com sucesso e voltar para a tela de login', () => {
    cy.visit(`${baseUrl}/calculadora`);
    cy.contains('Sair').click();
    
    cy.url().should('include', '/login');
    cy.contains('Faça login para acessar a calculadora').should('be.visible');
  });
});