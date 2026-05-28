const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs   = require('fs');
const path = require('path');

const BASE_URL        = process.env.APP_URL || 'http://localhost:3000';
const BASE22          = BASE_URL + '/equipe-22';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

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

async function espera(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  try {
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

    await driver.manage().setTimeouts({ implicit: 8000, pageLoad: 20000 });

    // ── TESTE 1: Splash Screen ──────────────────────────────────
    console.log('Teste 1: Splash Screen');
    await driver.get(BASE22 + '/splash');
    await espera(1000);
    await tiraFoto('01_splash_screen');
    console.log('OK: Splash screen carregou');

    // ── TESTE 2: Tela de Login ──────────────────────────────────
    console.log('Teste 2: Tela de login');
    await driver.get(BASE22 + '/login');
    await driver.wait(until.elementLocated(By.name('usuario')), 8000);
    await espera(500);
    await tiraFoto('02_tela_login');
    console.log('OK: Tela de login carregou');

    // ── TESTE 3: Login com credenciais erradas ──────────────────
    console.log('Teste 3: Login com credenciais invalidas');
    await driver.findElement(By.name('usuario')).sendKeys('errado');
    await driver.findElement(By.name('senha')).sendKeys('errada');
    await tiraFoto('03_login_campos_errados');

    await driver.findElement(By.css('button[type="submit"]')).click();
    await espera(1000);
    await tiraFoto('04_login_erro');

    // ⚠️ ATENÇÃO: Troque '.alert-danger' pela classe ou '#id' que os seus colegas usaram!
    const errMsg = await driver.findElement(By.css('.erro')).getText();
    if (!errMsg.toLowerCase().includes('invalido') && !errMsg.toLowerCase().includes('inválido')) {
      throw new Error(`Mensagem de erro inesperada: "${errMsg}"`);
    }
    console.log('OK: Mensagem de erro exibida corretamente');

    // ── TESTE 4: Login com credenciais corretas ─────────────────
    console.log('Teste 4: Login com credenciais validas');
    await driver.get(BASE22 + '/login');
    await driver.wait(until.elementLocated(By.name('usuario')), 8000);
    await driver.findElement(By.name('usuario')).sendKeys('admin');
    await driver.findElement(By.name('senha')).sendKeys('123');
    await tiraFoto('05_login_credenciais_corretas');

    await driver.findElement(By.css('button[type="submit"]')).click();
    await espera(1500);
    await tiraFoto('06_apos_login_sucesso');

    const urlAtual = await driver.getCurrentUrl();
    if (!urlAtual.includes('/simulacao')) throw new Error(`Login nao redirecionou: ${urlAtual}`);
    console.log('OK: Login bem-sucedido, redirecionou para simulacao');

    // ── TESTE 5: Tela de Simulação ──────────────────────────────
    console.log('Teste 5: Tela de simulacao');
    await driver.wait(until.elementLocated(By.id('tipo')), 8000);
    await tiraFoto('07_tela_simulacao');

    const selectTipo = await driver.findElement(By.id('tipo'));
    await selectTipo.click();
    await driver.findElement(By.css('#tipo option[value="vapor"]')).click();

    const inputVolume = await driver.findElement(By.id('volumeM3'));
    await inputVolume.clear();
    await inputVolume.sendKeys('10');

    await tiraFoto('08_formulario_preenchido');
    console.log('OK: Formulario preenchido');

    // ── TESTE 6: Calcular e ver resultado ───────────────────────
    console.log('Teste 6: Calcular resultado');
    await driver.findElement(By.id('btnCalcular')).click();
    await espera(2000);
    await tiraFoto('09_resultado_calculo');

    const tabela      = await driver.findElement(By.id('tabelaResultado'));
    const textoTabela = await tabela.getText();
    if (!textoTabela.includes('R$')) throw new Error('Resultado nao exibiu valores em reais');
    console.log('OK: Resultado exibido com valores corretos');

    // ── TESTE 7: Tela Sobre ─────────────────────────────────────
    console.log('Teste 7: Tela Sobre');
    await driver.get(BASE22 + '/sobre');
    await driver.wait(until.elementLocated(By.css('h2')), 8000);
    await espera(500);
    await tiraFoto('10_tela_sobre');
    console.log('OK: Tela sobre carregou');

    // ── TESTE 8: Tela Help ──────────────────────────────────────
    console.log('Teste 8: Tela Help');
    await driver.get(BASE22 + '/help');
    await driver.wait(until.elementLocated(By.css('h2')), 8000);
    await espera(500);
    await tiraFoto('11_tela_help');
    console.log('OK: Tela help carregou');

    console.log('\n✅ Todos os testes funcionais passaram!');

  } finally {
    if (driver) await driver.quit();
  }
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});