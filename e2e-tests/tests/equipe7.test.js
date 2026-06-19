const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// URL padrão ajustada para o seu ambiente local de desenvolvimento
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
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
    console.log('Iniciando testes Funcionais - Calculadora de Piscina GCEIC2026...');

    // 1. Splash Screen
    await driver.get(`${BASE_URL}/`);
    await waitForText('GCEIC2026 • Engenharia & Gestão de Custos');
    await takeScreenshot('01-splash');
    await driver.wait(until.urlContains('/login'), 5000);
    console.log('✅ Splash Screen validada');

    // 2. Erro ao tentar login com credenciais incorretas
    await driver.get(`${BASE_URL}/login`);
    await driver.findElement(By.css('input[placeholder="Ex: admin"]')).sendKeys('admin');
    await driver.findElement(By.css('input[placeholder="••••••••"]')).sendKeys('senha_errada');
    await clickByText('Autenticar sistema');
    
    // Tratamento de window.alert() no Selenium
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
    await driver.findElement(By.css('input[placeholder="••••••••"]')).sendKeys('1234');
    await clickByText('Autenticar sistema');
    await driver.wait(until.urlContains('/calculadora'), 10000);
    await takeScreenshot('03-login-sucesso');
    console.log('✅ Autenticação com sucesso validada');

    // 4. Preencher os dados, chamar a API e exibir o orçamento completo
    await driver.findElement(By.name('largura')).sendKeys('4');
    await driver.findElement(By.name('comprimento')).sendKeys('8');
    await driver.findElement(By.name('profundidade')).sendKeys('1.5');
    
    await driver.findElement(By.name('precoAgua')).sendKeys('10');
    await driver.findElement(By.name('precoManutencao')).sendKeys('50');
    await driver.findElement(By.name('precoEletrico')).sendKeys('1500');
    await driver.findElement(By.name('precoHidraulico')).sendKeys('2000');
    
    await clickByText('Calcular Projeto');
    
    await waitForText('Relatório Orçamentário', 45000);
    await waitForText('48');
    await waitForText('3.500,00');
    await takeScreenshot('04-relatorio-orcamento');
    console.log('✅ Relatório e cálculo de custos validados');

    // 5. Navegar para a tela Sobre e listar a equipe
    await clickByText('Sobre a Equipe');
    await driver.wait(until.urlContains('/sobre'), 10000);
    await waitForText('Grupo 7');
    await waitForText('Bruno Lenitta Machado');
    await waitForText('Nicolas Mitjans Nunes');
    await takeScreenshot('05-sobre');
    console.log('✅ Tela Sobre validada');

    // 6. Navegar para Ajuda e voltar
    await driver.get(`${BASE_URL}/calculadora`); 
    await clickByText('Ajuda');
    await driver.wait(until.urlContains('/help'), 10000);
    await waitForText('Documentação de Apoio');
    await takeScreenshot('06-ajuda');
    
    await clickByText('Voltar para o Painel Principal');
    await driver.wait(until.urlContains('/calculadora'), 10000);
    console.log('✅ Tela Ajuda validada');

    // 7. Logout e retorno ao login
    await clickByText('Sair');
    await driver.wait(until.urlContains('/login'), 10000);
    await waitForText('Insira suas credenciais corporativas abaixo');
    await takeScreenshot('07-logout');
    console.log('✅ Logout efetuado com sucesso');

    console.log('🚀 Todos os testes E2E passaram com sucesso!');
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
