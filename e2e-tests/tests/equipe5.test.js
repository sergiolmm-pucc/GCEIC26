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
    const filePath = path.join(SCREENSHOTS_DIR, `grupo5-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`📸 Foto tirada: grupo5-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes E2E - Equipe 5 (Calculadora de Energia)');
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
    console.log('\n📋 Teste 1: Splash screen da Equipe 5');
    await driver.get(BASE_URL + '/equipe-5');
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('01-splash');
    const splashText = await driver.findElements(By.css('.splash-logo'));
    if (splashText.length === 0) {
      throw new Error('Splash screen não carregou — elemento .splash-logo não encontrado');
    }
    console.log('   ✅ Splash screen carregou');

    // ── Teste 2: Auto-navega para login após 3s ───────────────────────────
    console.log('\n📋 Teste 2: Tela de login aparece após splash');
    await new Promise(r => setTimeout(r, 3500));
    await tiraFoto('02-login');
    const loginForm = await driver.findElements(By.css('.login-form-box'));
    if (loginForm.length === 0) {
      throw new Error('Tela de login não apareceu após a splash screen');
    }
    console.log('   ✅ Tela de login apareceu');

    // ── Teste 3: Login com credenciais inválidas ──────────────────────────
    console.log('\n📋 Teste 3: Login com credenciais inválidas');
    const userInput = await driver.findElement(By.css('input[type="text"]'));
    const passInput = await driver.findElement(By.css('input[type="password"]'));
    await userInput.sendKeys('errado');
    await passInput.sendKeys('errado');
    await tiraFoto('03-login-invalido-preenchido');
    await driver.findElement(By.css('button.btn-login')).click();
    await new Promise(r => setTimeout(r, 600));
    await tiraFoto('04-login-invalido-erro');
    const erroEl = await driver.findElements(By.css('.login-error'));
    if (erroEl.length === 0) {
      throw new Error('Mensagem de erro não apareceu para credenciais inválidas');
    }
    console.log('   ✅ Erro exibido para credenciais inválidas');

    // ── Teste 4: Login com credenciais corretas ────────────────────────────
    console.log('\n📋 Teste 4: Login com credenciais corretas (admin / 1234)');
    await driver.get(BASE_URL + '/equipe-5');
    await new Promise(r => setTimeout(r, 3500));
    const userInput2 = await driver.findElement(By.css('input[type="text"]'));
    const passInput2 = await driver.findElement(By.css('input[type="password"]'));
    await userInput2.sendKeys('admin');
    await passInput2.sendKeys('1234');
    await tiraFoto('05-login-valido-preenchido');
    await driver.findElement(By.css('button.btn-login')).click();
    await new Promise(r => setTimeout(r, 600));
    await tiraFoto('06-home-consumo');
    const sidebar = await driver.findElements(By.css('.sidebar-brand-name'));
    if (sidebar.length === 0) {
      throw new Error('Home screen não carregou após login');
    }
    console.log('   ✅ Login realizado — home screen carregada');

    // ── Teste 5: Aba "Valor da Conta" ─────────────────────────────────────
    console.log('\n📋 Teste 5: Aba Valor da Conta');
    const tabConta = await driver.findElement(
      By.xpath("//button[contains(@class,'sidebar-nav-item') and contains(.,'Valor da Conta')]")
    );
    await tabConta.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('07-tab-conta');
    console.log('   ✅ Aba Valor da Conta carregou');

    // ── Teste 6: Aba "Simulador" ──────────────────────────────────────────
    console.log('\n📋 Teste 6: Aba Simulador');
    const tabSimular = await driver.findElement(
      By.xpath("//button[contains(@class,'sidebar-nav-item') and contains(.,'Simulador')]")
    );
    await tabSimular.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('08-tab-simular');
    console.log('   ✅ Aba Simulador carregou');

    // ── Teste 7: Página Sobre ─────────────────────────────────────────────
    console.log('\n📋 Teste 7: Página Sobre a Equipe');
    const btnSobre = await driver.findElement(
      By.xpath("//button[contains(@class,'sidebar-nav-item') and contains(.,'Sobre')]")
    );
    await btnSobre.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('09-sobre');
    console.log('   ✅ Página Sobre carregou');

    console.log('\n🎉 Todos os testes da Equipe 5 passaram!\n');

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
