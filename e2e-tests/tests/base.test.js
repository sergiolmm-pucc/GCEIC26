const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';

const SCREENSHOTS_DIR =
  path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let driver;

async function tiraFoto(name) {

  try {

    const img = await driver.takeScreenshot();

    const filePath =
      path.join(SCREENSHOTS_DIR, `${name}.png`);

    fs.writeFileSync(filePath, img, 'base64');

    console.log(`Foto tirada: ${name}.png`);

  } catch (e) {

    console.warn('Erro ao tirar foto');

  }

}

async function main() {

  try {

    const opts = new chrome.Options();

    opts.addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1200,800',
      '--disable-gpu'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts)
      .build();

    await driver.manage().setTimeouts({
      implicit: 5000,
      pageLoad: 15000
    });

    // abre login
    await driver.get(BASE_URL + '/login');

    await tiraFoto('01-login');

    // login válido
    await driver.findElement(By.id('username'))
      .sendKeys('admin');

    await driver.findElement(By.id('password'))
      .sendKeys('admin');

    await tiraFoto('02-credenciais');

    // envia login
    await driver.findElement(By.css('form[action="/login"]'))
      .submit();

    await new Promise(r => setTimeout(r, 1500));

    await tiraFoto('03-home');

    // preenche cálculo NF
    await driver.findElement(By.id('valorProduto'))
      .sendKeys('1000');

    await driver.findElement(By.id('icms'))
      .sendKeys('18');

    await driver.findElement(By.id('ipi'))
      .sendKeys('5');

    await driver.findElement(By.id('pis'))
      .sendKeys('1.65');

    await driver.findElement(By.id('cofins'))
      .sendKeys('7.6');

    await tiraFoto('04-valores');

    // clica calcular
    await driver.findElement(By.id('btnCalcular'))
      .click();

    await new Promise(r => setTimeout(r, 2000));

    await tiraFoto('05-resultado');

    // valida resultado
    const total =
      await driver.findElement(By.id('totalNF'))
      .getText();

    console.log('TOTAL:', total);

    if (!total.includes('1322,50')) {

      throw new Error(
        `Resultado incorreto: ${total}`
      );

    }

    console.log('Teste executado com sucesso');

  } finally {

    if (driver) {
      await driver.quit();
    }

  }

}

main().catch(err => {

  console.error('Erro fatal:', err);

  process.exit(1);

});