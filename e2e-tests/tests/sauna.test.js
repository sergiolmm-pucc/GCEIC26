const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

async function tiraFoto(name) {
  try {
    const img = await driver.takeScreenshot();
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${name}.png`), img, 'base64');
    console.log(`Foto tirada: ${name}.png`);
  } catch (e) { console.warn('Erro foto:', e.message); }
}

async function espera(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  try {
    const opts = new chrome.Options();
    opts.addArguments('--headless=new','--no-sandbox','--disable-dev-shm-usage','--window-size=1280,800','--disable-gpu');
    driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();
    await driver.manage().setTimeouts({ implicit: 8000, pageLoad: 20000 });

    // TESTE 1: Splash Screen
    console.log('Teste 1: Splash Screen');
    await driver.get(BASE_URL + '/');
    await espera(1000);
    await tiraFoto('01_splash_screen');
    console.log('OK: Splash screen carregou');

    // TESTE 2: Tela de Login
    console.log('Teste 2: Tela de login');
    await driver.get(BASE_URL + '/login');
    await driver.wait(until.elementLocated(By.name('usuario')), 8000);
    await espera(500);
    await tiraFoto('02_tela_login');
    console.log('OK: Tela de login carregou');

    // TESTE 3: Login com credenciais erradas
    console.log('Teste 3: Login invalido');
    await driver.findElement(By.name('usuario')).sendKeys('errado');
    await driver.findElement(By.name('senha')).sendKeys('errada');
    await driver.findElement(By.css('button')).click();
    await espera(1000);
    await tiraFoto('03_login_erro');
    const errMsg = await driver.findElement(By.css('.erro')).getText();
    if (!errMsg) throw new Error('Mensagem de erro nao apareceu');
    console.log('OK: Erro de login exibido:', errMsg);

    // TESTE 4: Login correto
    console.log('Teste 4: Login valido');
    await driver.get(BASE_URL + '/login');
    await driver.wait(until.elementLocated(By.name('usuario')), 8000);
    await driver.findElement(By.name('usuario')).sendKeys('admin');
    await driver.findElement(By.name('senha')).sendKeys('123');
    await tiraFoto('04_login_correto');
    await driver.findElement(By.css('button')).click();
    await espera(1500);
    await tiraFoto('05_apos_login');
    const url = await driver.getCurrentUrl();
    if (!url.includes('/simulacao')) throw new Error(`Nao redirecionou: ${url}`);
    console.log('OK: Login bem-sucedido');

    // TESTE 5: Formulario de simulacao
    console.log('Teste 5: Simulacao');
    await driver.wait(until.elementLocated(By.id('tipo')), 8000);
    await tiraFoto('06_tela_simulacao');
    await driver.findElement(By.css('#tipo option[value="vapor"]')).click();
    const vol = await driver.findElement(By.id('volumeM3'));
    await vol.clear();
    await vol.sendKeys('10');
    await tiraFoto('07_formulario_preenchido');
    console.log('OK: Formulario preenchido');

    // TESTE 6: Calcular
    console.log('Teste 6: Calcular');
    await driver.findElement(By.id('btnCalcular')).click();
    await espera(2500);
    await tiraFoto('08_resultado');
    const tabela = await driver.findElement(By.id('tabelaResultado'));
    const texto = await tabela.getText();
    if (!texto.includes('R$')) throw new Error('Resultado sem valores');
    console.log('OK: Resultado exibido');

    // TESTE 7: Sobre
    console.log('Teste 7: Tela Sobre');
    await driver.get(BASE_URL + '/sobre');
    await driver.wait(until.elementLocated(By.css('h2')), 8000);
    await espera(500);
    await tiraFoto('09_sobre');
    console.log('OK: Tela sobre carregou');

    // TESTE 8: Help
    console.log('Teste 8: Tela Help');
    await driver.get(BASE_URL + '/help');
    await driver.wait(until.elementLocated(By.css('h2')), 8000);
    await espera(500);
    await tiraFoto('10_help');
    console.log('OK: Tela help carregou');

    console.log('\n✅ Todos os testes funcionais passaram!');
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch(err => { console.error('Erro fatal:', err.message); process.exit(1); });
