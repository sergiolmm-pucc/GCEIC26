const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs   = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

async function tiraFoto(nome) {
  try {
    const img = await driver.takeScreenshot();
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${nome}.png`), img, 'base64');
    console.log(`📸 Foto tirada: ${nome}.png`);
  } catch (e) {
    console.warn('Erro ao tirar foto:', e.message);
  }
}

async function main() {
  const opts = new chrome.Options();
  opts.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1280,800',
    '--disable-gpu'
  );

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(opts)
    .build();
  await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });

  try {
    // ---- TESTE 1: Splash screen ----
    console.log('🧪 Teste 1: Splash screen');
    await driver.get(BASE_URL + '/');
    await tiraFoto('01-splash');
    const title = await driver.getTitle();
    if (!title.includes('Água') && !title.includes('Calc')) throw new Error(`Título inesperado: ${title}`);
    console.log('✅ Splash ok');

    // ---- TESTE 2: Redirect para login ----
    console.log('🧪 Teste 2: Redirect /calculo sem autenticação');
    await driver.get(BASE_URL + '/calculo');
    await new Promise(r => setTimeout(r, 800));
    const urlAtual = await driver.getCurrentUrl();
    await tiraFoto('02-redirect-login');
    if (!urlAtual.includes('/login')) throw new Error(`Deveria redirecionar para login, mas foi para: ${urlAtual}`);
    console.log('✅ Redirect ok');

    // ---- TESTE 3: Login com credenciais erradas ----
    console.log('🧪 Teste 3: Login com credenciais erradas');
    await driver.get(BASE_URL + '/login');
    await driver.findElement(By.id('username')).sendKeys('errado');
    await driver.findElement(By.id('password')).sendKeys('errado');
    await tiraFoto('03-credenciais-erradas');
    await driver.findElement(By.id('loginForm')).submit();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('04-erro-login');
    const errMsg = await driver.findElement(By.css('.erro')).getText();
    if (!errMsg.toLowerCase().includes('inv')) throw new Error(`Mensagem de erro não encontrada: ${errMsg}`);
    console.log('✅ Erro de login exibido ok');

    // ---- TESTE 4: Login com credenciais corretas ----
    console.log('🧪 Teste 4: Login com credenciais corretas');
    await driver.get(BASE_URL + '/login');
    await driver.findElement(By.id('username')).clear();
    await driver.findElement(By.id('username')).sendKeys('admin');
    await driver.findElement(By.id('password')).clear();
    await driver.findElement(By.id('password')).sendKeys('admin');
    await driver.findElement(By.id('loginForm')).submit();
    await new Promise(r => setTimeout(r, 1000));
    await tiraFoto('05-logado');
    const urlLogado = await driver.getCurrentUrl();
    if (!urlLogado.includes('/calculo')) throw new Error(`Deveria ir para /calculo, foi para: ${urlLogado}`);
    console.log('✅ Login ok, redirecionado para /calculo');

    console.log('\n✅ Todos os testes e2e passaram!');

  } finally {
    if (driver) await driver.quit();
  }
}

main().catch(err => {
  console.error('❌ Erro fatal nos testes e2e:', err.message);
  process.exit(1);
});