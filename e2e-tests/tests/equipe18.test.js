const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let driver;

async function tiraFoto(name) {
  try {
    const img = await driver.takeScreenshot();
    const filePath = path.join(SCREENSHOTS_DIR, `grupo18-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`Foto tirada: grupo18-${name}.png`);
  } catch (e) {
    console.warn('Erro ao tirar foto:', e.message);
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
      '--window-size=1200,800',
      '--disable-gpu'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts)
      .build();

    await driver.manage().setTimeouts({
      implicit: 15000,
      pageLoad: 45000
    });

    console.log('Acessando página da Equipe 18...');
    await driver.get(BASE_URL + '/equipe-18');
    await new Promise(r => setTimeout(r, 2000));
    await tiraFoto('01-login-screen');

    console.log('Realizando login (admin/admin)...');
    const userInp = await driver.findElement(By.id('username'));
    await userInp.sendKeys('admin');
    const passInp = await driver.findElement(By.id('password'));
    await passInp.sendKeys('admin');
    const submitLogin = await driver.findElement(By.css('button[type="submit"]'));
    await submitLogin.click();

    console.log('Aguardando carregamento do dashboard...');
    await new Promise(r => setTimeout(r, 3000));
    await tiraFoto('01-dashboard');

    console.log('Navegando para NF Completa...');
    await driver.get(BASE_URL + '/equipe-18/nf-completa.html');
    await new Promise(r => setTimeout(r, 3000));
    await tiraFoto('02-nf-completa-form');

    // Preencher formulário
    console.log('Preenchendo valores no formulário...');
    const productValInput = await driver.findElement(By.id('productValue'));
    await productValInput.clear();
    await productValInput.sendKeys('1000.00');

    const stateSelect = await driver.findElement(By.id('state'));
    await stateSelect.sendKeys('SP');

    const ncmInput = await driver.findElement(By.id('ncm'));
    await ncmInput.clear();
    await ncmInput.sendKeys('2201.10.00');

    const freightInput = await driver.findElement(By.id('freightValue'));
    await freightInput.clear();
    await freightInput.sendKeys('150.00');

    const expensesInput = await driver.findElement(By.id('additionalExpenses'));
    await expensesInput.clear();
    await expensesInput.sendKeys('50.00');

    await tiraFoto('03-valores-preenchidos');

    console.log('Enviando cálculo...');
    const submitBtn = await driver.findElement(By.id('submit-calc-btn'));
    await submitBtn.click();

    await new Promise(r => setTimeout(r, 3000));
    await tiraFoto('04-resultado-calculo');

    console.log('Teste E2E executado com sucesso para a Equipe 18!');

  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

main().catch(err => {
  console.error('Erro fatal no E2E da Equipe 18:', err);
  process.exit(1);
});
