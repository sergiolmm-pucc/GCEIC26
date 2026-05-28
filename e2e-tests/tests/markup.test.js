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
    const filePath = path.join(SCREENSHOTS_DIR, `grupo13-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`📸 Foto tirada: grupo13-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes E2E - Grupo 13 (MarkUp)');
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

    // ── Teste 1: Splash page carrega ──────────────────────────────────
    console.log('\n📋 Teste 1: Splash page do Grupo 13');
    await driver.get(BASE_URL + '/equipe-13/splash');
    await tiraFoto('01-splash');
    const splashTitle = await driver.getTitle();
    console.log(`   Título da página: ${splashTitle}`);
    console.log('   ✅ Splash carregou');

    // ── Teste 2: Redireciona para login ao acessar calculo sem auth ───
    console.log('\n📋 Teste 2: Rota protegida redireciona para login');
    await driver.get(BASE_URL + '/equipe-13/calculo');
    await new Promise(r => setTimeout(r, 800));
    const urlAposRedirect = await driver.getCurrentUrl();
    await tiraFoto('02-redirect-login');
    if (!urlAposRedirect.includes('/login')) {
      throw new Error(`Esperado redirect para /login, mas URL é: ${urlAposRedirect}`);
    }
    console.log('   ✅ Redirecionou corretamente para login');

    // ── Teste 3: Login com credenciais inválidas mostra erro ──────────
    console.log('\n📋 Teste 3: Login com credenciais inválidas');
    await driver.get(BASE_URL + '/equipe-13/login');
    await driver.findElement(By.id('username')).sendKeys('errado');
    await driver.findElement(By.id('password')).sendKeys('errado');
    await tiraFoto('03-login-invalido-preenchido');
    await driver.findElement(By.css('form')).submit();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('04-login-invalido-resultado');
    const erroEl = await driver.findElements(By.css('.erro'));
    if (erroEl.length === 0) {
      throw new Error('Esperado mensagem de erro para credenciais inválidas, mas nenhuma foi encontrada');
    }
    console.log('   ✅ Erro exibido corretamente para credenciais inválidas');

    // ── Teste 4: Login com credenciais corretas ────────────────────────
    console.log('\n📋 Teste 4: Login com credenciais corretas (admin/123)');
    await driver.get(BASE_URL + '/equipe-13/login');
    await driver.findElement(By.id('username')).sendKeys('admin');
    await driver.findElement(By.id('password')).sendKeys('123');
    await tiraFoto('05-login-valido-preenchido');
    await driver.findElement(By.css('form')).submit();
    await new Promise(r => setTimeout(r, 1000));
    await tiraFoto('06-pos-login');
    const urlPosLogin = await driver.getCurrentUrl();
    if (!urlPosLogin.includes('/equipe-13')) {
      throw new Error(`Login falhou - URL inesperada: ${urlPosLogin}`);
    }
    console.log('   ✅ Login realizado com sucesso');

    // ── Teste 5: Página de cálculo carrega com as abas ────────────────
    console.log('\n📋 Teste 5: Página de cálculo - abas visíveis');
    await driver.get(BASE_URL + '/equipe-13/calculo');
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('07-calculo');
    const tabs = await driver.findElements(By.css('.tab'));
    if (tabs.length < 3) {
      throw new Error(`Esperado 3 abas na calculadora, encontrado: ${tabs.length}`);
    }
    console.log(`   ✅ ${tabs.length} abas encontradas (Preço de Venda, Lucro Real, Ponto de Equilíbrio)`);

    // ── Teste 6: Página Sobre carrega ─────────────────────────────────
    console.log('\n📋 Teste 6: Página Sobre');
    await driver.get(BASE_URL + '/equipe-13/sobre');
    await tiraFoto('08-sobre');
    console.log('   ✅ Página Sobre carregou');

    console.log('\n🎉 Todos os testes do Grupo 13 passaram!\n');

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
