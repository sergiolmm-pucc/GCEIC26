const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const BASE_PATH = '/equipe-12';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

let driver;

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function tiraFoto(name) {
  try {
    const img = await driver.takeScreenshot();
    const filePath = path.join(SCREENSHOTS_DIR, `grupo12-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`Foto tirada: grupo12-${name}.png`);
  } catch (e) {
    console.warn('Erro ao tirar a foto:', e.message);
  }
}

async function main() {
  try {
    const opts = new chrome.Options();
    opts.addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,800',
      '--disable-gpu',
    );

    driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();
    await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });

    await driver.get(BASE_URL + BASE_PATH + '/login');
    await tiraFoto('login');

    await driver.findElement(By.id('username')).sendKeys('errado');
    await driver.findElement(By.id('password')).sendKeys('errado');
    await driver.findElement(By.id('loginForm')).submit();

    const errMsg = await driver.findElement(By.css('.erro')).getText();
    if (!errMsg.includes('invalidos')) {
      throw new Error(`Esperava "invalidos", recebeu: ${errMsg}`);
    }
    console.log('Teste de login invalido passou');

    await driver.get(BASE_URL + BASE_PATH + '/login');
    await driver.findElement(By.id('username')).sendKeys('admin');
    await driver.findElement(By.id('password')).sendKeys('admin');
    await driver.findElement(By.id('loginForm')).submit();
    await driver.wait(until.urlContains(BASE_PATH + '/home'), 5000);
    await tiraFoto('home');

    const url = await driver.getCurrentUrl();
    if (!url.includes(BASE_PATH + '/home')) {
      throw new Error(`Esperava ${BASE_PATH}/home, recebeu: ${url}`);
    }
    console.log('Teste de login correto passou');

    await driver.get(BASE_URL + BASE_PATH + '/calculo');
    await tiraFoto('calculo');

    await driver.findElement(By.id('f-cost')).sendKeys('100');
    await driver.findElement(By.id('f-mk')).sendKeys('30');
    await driver.findElement(By.xpath("//main//button[normalize-space()='Calcular']")).click();

    await driver.wait(async () => {
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      return bodyText.includes('R$ 142.86');
    }, 5000);

    await tiraFoto('resultado');
    console.log('Calculo de MarkUp passou');
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
