const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.APP_URL || 'http://localhost:3000') + '/equipe-19';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

// A splash navega para o login após 2500ms (App.js -> Splash setTimeout)
const SPLASH_MS = 3000;

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

async function tiraFoto(name) {
  try {
    const img = await driver.takeScreenshot();
    const filePath = path.join(SCREENSHOTS_DIR, `grupo19-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`📸 Foto tirada: grupo19-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

// Faz login (admin / 1234) a partir da splash e espera a home carregar
async function fazerLogin(usuario, senha) {
  await driver.get(BASE_URL);
  await new Promise(r => setTimeout(r, SPLASH_MS));
  const userInput = await driver.findElement(By.css('.login-card input[placeholder="admin"]'));
  const passInput = await driver.findElement(By.css('.login-card input[type="password"]'));
  await userInput.clear();
  await passInput.clear();
  await userInput.sendKeys(usuario);
  await passInput.sendKeys(senha);
  await driver.findElement(By.css('.login-card button.btn-primary')).click();
  await new Promise(r => setTimeout(r, 600));
}

async function main() {
  console.log('🚀 Iniciando testes E2E - FinanciApp (Financiamento Imobiliário)');
  console.log(`   APP_URL: ${BASE_URL}`);

  try {
    const opts = new chrome.Options();
    opts.addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,720',
      '--disable-gpu'
    );

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts)
      .build();

    await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });

    // ── Teste 1: Splash screen carrega ───────────────────────────────────
    console.log('\n📋 Teste 1: Splash screen do FinanciApp');
    await driver.get(BASE_URL);
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('01-splash');
    const splashLogo = await driver.findElements(By.css('.splash-logo'));
    if (splashLogo.length === 0) {
      throw new Error('Splash screen não carregou — elemento .splash-logo não encontrado');
    }
    console.log('   ✅ Splash screen carregou');

    // ── Teste 2: Auto-navega para login após a splash ─────────────────────
    console.log('\n📋 Teste 2: Tela de login aparece após splash');
    await new Promise(r => setTimeout(r, SPLASH_MS));
    await tiraFoto('02-login');
    const loginCard = await driver.findElements(By.css('.login-card'));
    if (loginCard.length === 0) {
      throw new Error('Tela de login não apareceu após a splash screen');
    }
    console.log('   ✅ Tela de login apareceu');

    // ── Teste 3: Login com credenciais inválidas ──────────────────────────
    console.log('\n📋 Teste 3: Login com credenciais inválidas');
    const userInput = await driver.findElement(By.css('.login-card input[placeholder="admin"]'));
    const passInput = await driver.findElement(By.css('.login-card input[type="password"]'));
    await userInput.sendKeys('errado');
    await passInput.sendKeys('errado');
    await tiraFoto('03-login-invalido-preenchido');
    await driver.findElement(By.css('.login-card button.btn-primary')).click();
    await new Promise(r => setTimeout(r, 600));
    await tiraFoto('04-login-invalido-erro');
    const erroEl = await driver.findElements(By.css('.login-card .erro'));
    if (erroEl.length === 0) {
      throw new Error('Mensagem de erro não apareceu para credenciais inválidas');
    }
    console.log('   ✅ Erro exibido para credenciais inválidas');

    // ── Teste 4: Login com credenciais corretas ───────────────────────────
    console.log('\n📋 Teste 4: Login com credenciais corretas (admin / 1234)');
    await fazerLogin('admin', '1234');
    await tiraFoto('05-home-calculadoras');
    const home = await driver.findElements(By.css('.app-shell .section-title'));
    if (home.length === 0) {
      throw new Error('Home screen não carregou após login (.section-title não encontrado)');
    }
    console.log('   ✅ Login realizado — home com calculadoras carregada');

    // ── Teste 5: Calculadora SAC ──────────────────────────────────────────
    console.log('\n📋 Teste 5: Calculadora SAC');
    const cardSAC = await driver.findElement(
      By.xpath("//div[contains(@class,'menu-card') and contains(.,'Sistema SAC')]")
    );
    await cardSAC.click();
    await new Promise(r => setTimeout(r, 400));
    await driver.findElement(
      By.xpath("//button[contains(@class,'btn-calc') and contains(.,'Calcular SAC')]")
    ).click();
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('06-calc-sac');
    const metricaSAC = await driver.findElements(By.css('.metric .m-value'));
    if (metricaSAC.length === 0) {
      throw new Error('Resultado do cálculo SAC não apareceu (.metric não encontrado)');
    }
    console.log('   ✅ Cálculo SAC gerou resultado');
    await driver.findElement(By.css('.btn-voltar')).click();
    await new Promise(r => setTimeout(r, 300));

    // ── Teste 6: Calculadora PRICE ────────────────────────────────────────
    console.log('\n📋 Teste 6: Calculadora PRICE');
    const cardPRICE = await driver.findElement(
      By.xpath("//div[contains(@class,'menu-card') and contains(.,'Tabela PRICE')]")
    );
    await cardPRICE.click();
    await new Promise(r => setTimeout(r, 400));
    await driver.findElement(
      By.xpath("//button[contains(@class,'btn-calc') and contains(.,'Calcular PRICE')]")
    ).click();
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('07-calc-price');
    const metricaPRICE = await driver.findElements(By.css('.metric .m-value'));
    if (metricaPRICE.length === 0) {
      throw new Error('Resultado do cálculo PRICE não apareceu (.metric não encontrado)');
    }
    console.log('   ✅ Cálculo PRICE gerou resultado');
    await driver.findElement(By.css('.btn-voltar')).click();
    await new Promise(r => setTimeout(r, 300));

    // ── Teste 7: Página Sobre ─────────────────────────────────────────────
    console.log('\n📋 Teste 7: Página Sobre a Equipe');
    const btnSobre = await driver.findElement(
      By.xpath("//nav[contains(@class,'bottomnav')]//button[contains(.,'Sobre')]")
    );
    await btnSobre.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('08-sobre');
    const sobre = await driver.findElements(By.css('.team-grid'));
    if (sobre.length === 0) {
      throw new Error('Página Sobre não carregou (.team-grid não encontrado)');
    }
    console.log('   ✅ Página Sobre carregou');

    // ── Teste 8: Página Ajuda ─────────────────────────────────────────────
    console.log('\n📋 Teste 8: Página Ajuda / Tutorial');
    const btnHelp = await driver.findElement(
      By.xpath("//nav[contains(@class,'bottomnav')]//button[contains(.,'Ajuda')]")
    );
    await btnHelp.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('09-help');
    const help = await driver.findElements(By.css('.help-item'));
    if (help.length === 0) {
      throw new Error('Página Ajuda não carregou (.help-item não encontrado)');
    }
    console.log('   ✅ Página Ajuda carregou');

    console.log('\n🎉 Todos os testes do FinanciApp passaram!\n');

  } catch (error) {
    console.error(`\n❌ Teste falhou: ${error.message}`);
    try { await tiraFoto('99-erro-fatal'); } catch (_) {}
    throw error;
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch(err => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
