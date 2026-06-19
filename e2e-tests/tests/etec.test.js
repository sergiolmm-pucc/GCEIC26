const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let driver;

async function takeScreenshot(name) {
  const img = await driver.takeScreenshot();
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, `etec-${name}.png`), img, 'base64');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForText(text, timeout = 30000) {
  await driver.wait(until.elementLocated(By.xpath(`//*[contains(normalize-space(.), "${text}")]`)), timeout);
}

async function waitForTeamPhoto() {
  const photo = await driver.wait(until.elementLocated(By.css('img[alt="Equipe ETEC"]')), 10000);

  await driver.wait(
    () => driver.executeScript(
      'const img = arguments[0]; return img.complete && img.naturalWidth > 0;',
      photo,
    ),
    10000,
  );

  // Give Chrome a short moment to paint the decoded image before the evidence screenshot.
  await sleep(700);
}

async function login() {
  await driver.get(`${BASE_URL}/etec/login`);
  await driver.findElement(By.name('username')).sendKeys('admin');
  await driver.findElement(By.name('password')).sendKeys('admin');
  await takeScreenshot('02-login-preenchido');
  await driver.findElement(By.css('form')).submit();
  await driver.wait(until.urlContains('/etec'), 10000);
  await waitForText('ETEC - Encargos');
  await takeScreenshot('03-dashboard');
}

async function calculateMenu(menuText, expectedText, screenshotName) {
  await driver.findElement(By.linkText(menuText)).click();
  await driver.wait(until.urlContains(`/etec/${menuText.toLowerCase()}`), 10000);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await waitForText('Resultado', 45000);
  await waitForText(expectedText);
  await takeScreenshot(screenshotName);
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

    await driver.get(`${BASE_URL}/etec/splash`);
    await takeScreenshot('01-splash');
    await driver.wait(until.urlContains('/etec/login'), 10000);

    await login();
    await calculateMenu('Salario', 'salarioLiquido', '04-salario');
    await calculateMenu('Ferias', 'totalLiquido', '05-ferias');
    await calculateMenu('Rescisao', 'totalLiquidoEstimado', '06-rescisao');

    await driver.findElement(By.linkText('Sobre')).click();
    await waitForText('Integrantes');
    await waitForTeamPhoto();
    await takeScreenshot('07-sobre');

    await driver.findElement(By.linkText('Help')).click();
    await waitForText('Como usar');
    await takeScreenshot('08-help');

    await driver.get(`${BASE_URL}/etec/login`);
    await driver.findElement(By.name('username')).sendKeys('adm');
    await driver.findElement(By.name('password')).sendKeys('admin');
    await driver.findElement(By.css('form')).submit();
    await waitForText('Usuario ou senha invalidos');
    await takeScreenshot('09-login-invalido');

    console.log('ETEC e2e tests passed');
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
