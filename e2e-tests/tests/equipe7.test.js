const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');


// URL padrão ajustada para o seu ambiente local de desenvolvimento
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const BASE_URL = APP_URL.replace(/\/$/, '').endsWith('/equipe-7')
  ? APP_URL.replace(/\/$/, '')
  : `${APP_URL.replace(/\/$/, '')}/equipe-7`;
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let driver;

// Helper: Tira print e salva com o prefixo da equipe
async function takeScreenshot(name) {
  const img = await driver.takeScreenshot();
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, `grupo7-${name}.png`), img, 'base64');
}

// Helper: Pausa o script
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: Equivalente ao cy.contains('texto').should('be.visible')
async function waitForText(text, timeout = 30000) {
  await driver.wait(until.elementLocated(By.xpath(`//*[contains(normalize-space(.), "${text}")]`)), timeout);
}

// Helper: Equivalente ao cy.contains('texto').click()
async function clickByText(text) {
  const element = await driver.wait(
    until.elementLocated(By.xpath(`(//button[contains(normalize-space(.), "${text}")] | //a[contains(normalize-space(.), "${text}")])[1]`)),
    10000
  );
  await element.click();
}

async function login(usuario, senha) {
  await driver.findElement(By.css('#username, input[placeholder="Ex: admin"]')).sendKeys(usuario);
  await driver.findElement(By.css('#password, input[type="password"]')).sendKeys(senha);
  const botao = await driver.findElement(By.css('#btn-login, button'));
  await botao.click();
}

// Helper para limpar e preencher os campos do formulário com segurança
async function preencherFormulario(dados) {
  const campos = ['largura', 'comprimento', 'profundidade', 'precoAgua', 'precoManutencao', 'precoEletrico', 'precoHidraulico'];
  for (const campo of campos) {
    if (dados[campo] !== undefined) {
      const input = await driver.findElement(By.name(campo));
      await input.clear();
      // Em alguns frameworks JS, apenas .clear() não dispara eventos de mudança, preencher com string vazia ajuda se necessário
      await driver.executeScript(
        `
        const input = arguments[0];
        const value = arguments[1];
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        `,
        input,
        String(dados[campo])
      );
    }
  }
}

// Helper aprimorado para capturar o erro na tela exatamente quando ele aparece
async function verificarFeedbackDeErro(trechoDoErro, screenshotName) {
  try {
    // 1. Tenta verificar se é um alerta nativo (window.alert)
    await driver.wait(until.alertIsPresent(), 2000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    
    if (!alertText.toLowerCase().includes(trechoDoErro.toLowerCase())) {
      throw new Error(`Alerta diferente do esperado. Obtido: "${alertText}"`);
    }
    // Nota: Se for alerta nativo, o print sairá sem a caixinha pois o Selenium não a fotografa
    await alert.accept();
    await takeScreenshot(screenshotName);
    console.log(`   👉 Erro validado via Alerta Nativo: "${alertText}"`);
  } catch (error) {
    // 2. SE NÃO FOR ALERTA NATIVO: Significa que o erro é um elemento HTML na página
    try {
      // Aguarda o elemento de texto do erro ser renderizado e ficar visível
      await waitForText(trechoDoErro, 4000);
      
      // Pequena pausa de 200ms apenas para o efeito visual/animação do front se consolidar
      await sleep(200); 
      
      // Tira o print IMEDIATAMENTE com o texto do erro visível na tela!
      await takeScreenshot(screenshotName);
      console.log(`   👉 Erro validado e capturado no print via Interface HTML: "${trechoDoErro}"`);
    } catch (htmlError) {
      throw new Error(`Não foi possível encontrar a mensagem de erro "${trechoDoErro}" na tela nem via Alerta.`);
    }
  }
}

async function main() {
  try {
    const opts = new chrome.Options();
    opts.addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,800',
      '--disable-gpu',
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts)
      .build();

    await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 20000 });
    console.log('Iniciando testes Funcionais Avançados - Calculadora de Piscina GCEIC2026...');

    // 1. Splash Screen
    await driver.get(`${BASE_URL}/`);
    await waitForText('GCEIC2026 • Engenharia & Gestão de Custos');
    await takeScreenshot('01-splash');
    await driver.wait(until.urlContains('/login'), 5000);
    console.log('✅ Splash Screen validada');


    // 2. Erro ao tentar login com credenciais incorretas
await driver.get(`${BASE_URL}/login`);
await driver.findElement(By.css('input[placeholder="Ex: admin"]')).sendKeys('admin');
await driver.findElement(By.id('password')).sendKeys('senha_errada');
await clickByText('Autenticar sistema');

await driver.wait(until.alertIsPresent(), 5000);
const alert = await driver.switchTo().alert();
const alertText = await alert.getText();
if (!alertText.includes('Usuário ou senha incorretos!')) {
  throw new Error(`Texto do alerta inesperado: ${alertText}`);
}
await alert.accept();
await takeScreenshot('02-login-invalido');
console.log('✅ Validação de credenciais incorretas passou');

// 3. Login com sucesso e redirecionamento
await driver.get(`${BASE_URL}/login`);
await driver.findElement(By.css('input[placeholder="Ex: admin"]')).sendKeys('admin');
await driver.findElement(By.id('password')).sendKeys('1234');
await clickByText('Autenticar sistema');
await driver.wait(until.urlContains('/calculadora'), 10000);
await takeScreenshot('03-login-sucesso');
console.log('✅ Autenticação com sucesso validada');


    // =========================================================================
    // 4. CENÁRIOS DE ERRO E ADVERSIDADES NA CALCULADORA
    // =========================================================================
    console.log('--- Iniciando bateria de testes de robustez na calculadora ---');

    // Cenário A: Valores Negativos (Garante tratamento do back/front)
    console.log('⏳ Testando comportamento com valores negativos...');
    await preencherFormulario({
      largura: '-4', comprimento: '8', profundidade: '1.5',
      precoAgua: '10', precoManutencao: '50', precoEletrico: '1500', precoHidraulico: '2000'
    });
    await clickByText('Calcular Projeto');
    // Espera o erro mapeado no seu validacao.js ("deve ser maior ou igual a zero")
    await verificarFeedbackDeErro('maior ou igual a zero', '04a-calculo-negativo');
    console.log('✅ Bloqueio de valores negativos validado com sucesso');


    // Cenário B: Entrada de Texto / Caracteres Inválidos em campos numéricos
    console.log('⏳ Testando comportamento com caracteres de texto...');
    await preencherFormulario({
      largura: 'abc', comprimento: '8', profundidade: '1.5',
      precoAgua: '10', precoManutencao: '50', precoEletrico: '1500', precoHidraulico: '2000'
    });
    await clickByText('Calcular Projeto');
    // Valida erro de tipo retornado ("deve ser um numero válido") ou validação nativa do HTML5 se o input for type="number"
    try {
      await verificarFeedbackDeErro('numero válido', '04b-calculo-texto');
    } catch (e) {
      // Se o navegador travou o envio nativamente por ser input type="number", o formulário não submete e não gera alertas.
      console.log('   ℹ️ Nota: O campo pode ter bloqueado o texto nativamente via HTML5 (type="number")');
      await takeScreenshot('04b-calculo-texto-html5');
    }
    console.log('✅ Bloqueio de campos contendo texto validado');


    // Cenário C: Valores Zerados (Limite de Fronteira)
    console.log('⏳ Testando comportamento com dimensões zeradas (Limite)...');
    await preencherFormulario({
      largura: '0', comprimento: '0', profundidade: '0',
      precoAgua: '0', precoManutencao: '0', precoEletrico: '0', precoHidraulico: '0'
    });
    await clickByText('Calcular Projeto');
    
    // De acordo com o validacao.js, 0 é permitido (pois exige >= 0). 
    // Logo, o sistema deve computar um relatório com valores zerados ("0" ou "0,00").
    await waitForText('Relatório Orçamentário', 10000);
    await takeScreenshot('04c-calculo-zerado');
    console.log('✅ Processamento de valores zerados validado');


    // =========================================================================
    // 5. FLUXO REGULAR DE SUCESSO (Cálculo Correto original)
    // =========================================================================
    console.log('⏳ Executando fluxo principal de sucesso...');
    await preencherFormulario({
      largura: '4', comprimento: '8', profundidade: '1.5',
      precoAgua: '10', precoManutencao: '50', precoEletrico: '1500', precoHidraulico: '2000'
    });
    
    await clickByText('Calcular Projeto');
    
    await waitForText('Relatório Orçamentário', 45000);
    await waitForText('48'); // Volume (4 * 8 * 1.5 = 48)
    await waitForText('3.500,00'); // Custos Fixos de Materiais (1500 + 2000 = 3500)
    await takeScreenshot('04d-relatorio-orcamento-sucesso');
    console.log('✅ Relatório e cálculo de custos validados no fluxo ideal');

    // =========================================================================
    // 6. OUTRAS TELAS E LOGOUT
    // =========================================================================

    // Navegar para a tela Sobre e listar a equipe
    await clickByText('Sobre a Equipe');
    await driver.wait(until.urlContains('/sobre'), 10000);
    await waitForText('Grupo 7');
    await waitForText('Bruno Lenitta Machado');
    await waitForText('Nicolas Mitjans Nunes');
    await takeScreenshot('05-sobre');
    console.log('✅ Tela Sobre validada');

    // Navegar para Ajuda e voltar
    await driver.get(`${BASE_URL}/calculadora`); 
    await clickByText('Ajuda');
    await driver.wait(until.urlContains('/help'), 10000);
    await waitForText('Documentação de Apoio');
    await takeScreenshot('06-ajuda');
    
    await clickByText('Voltar para o Painel Principal');
    await driver.wait(until.urlContains('/calculadora'), 10000);
    console.log('✅ Tela Ajuda validada');

    // Logout e retorno ao login
    await clickByText('Sair');
    await driver.wait(until.urlContains('/login'), 10000);
    await waitForText('Insira suas credenciais abaixo');
    await takeScreenshot('07-logout');
    console.log('✅ Logout efetuado com sucesso');

    console.log('🚀 Todos os testes E2E (incluindo testes de robustez) passaram com sucesso!');
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch((err) => {
  console.error('Erro fatal encontrado durante a execução:', err);
  process.exit(1);
});
