const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs   = require('fs');
const path = require('path');

const BASE_URL        = process.env.APP_URL  || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function tiraFoto(name) {
  try {
    const img      = await driver.takeScreenshot();
    const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`Foto tirada: ${name}.png`);
  } catch (e) {
    console.warn('Erro ao tirar a foto:', e.message);
  }
}

async function main() {
  try {
    const opts = new chrome.Options();
    opts.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800', '--disable-gpu');

    driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();
    await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });

    // ── Teste 1: Página de login ──────────────────────────────────────────
    await driver.get(BASE_URL + '/login');
    await tiraFoto('Pagina Entrada');

    // ── Teste 2: Login com credenciais erradas ────────────────────────────
    await driver.findElement(By.id('username')).sendKeys('errado');
    await driver.findElement(By.id('password')).sendKeys('errado');
    await tiraFoto('Valores Digitados');

    await driver.findElement(By.id('loginForm')).submit();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('Submit form com erro');

    const errMsg = await driver.findElement(By.css('.erro')).getText();
    if (!errMsg.includes('inválidos')) throw new Error(`Esperava "inválidos", recebeu: ${errMsg}`);
    console.log('✅ Teste de login inválido passou');

    // ── Teste 3: Login correto → redireciona para /home ───────────────────
    await driver.get(BASE_URL + '/login');
    await driver.findElement(By.id('username')).sendKeys('admin');
    await driver.findElement(By.id('password')).sendKeys('admin');
    await driver.findElement(By.id('loginForm')).submit();
    await driver.wait(until.urlContains('/home'), 5000);
    await tiraFoto('Login Correto');

    const url = await driver.getCurrentUrl();
    if (!url.includes('/home')) throw new Error(`Esperava /home, recebeu: ${url}`);
    console.log('✅ Teste de login correto passou');

    // ── Teste 4: Navegar para /calculo ────────────────────────────────────
    await driver.get(BASE_URL + '/calculo');
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('Tela Calculo');
    console.log('✅ Tela de cálculo acessada');

    // ── Teste 5: Calculo de MarkUp na tela ────────────────────────────────
    await driver.findElement(By.id('f-cost')).sendKeys('100');
    await driver.findElement(By.id('f-mk')).sendKeys('30');
    await driver.findElement(By.xpath("//main//button[normalize-space()='Calcular']")).click();

    await driver.wait(async () => {
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      return bodyText.includes('R$ 142.86');
    }, 5000);
    await tiraFoto('Calculo MarkUp');
    console.log('✅ Calculo de MarkUp passou');

  } finally {
    if (driver) await driver.quit();
  }
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
