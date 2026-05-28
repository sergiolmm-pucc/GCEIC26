const { Builder, By } = require('selenium-webdriver');
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
    const filePath = path.join(SCREENSHOTS_DIR, `grupo14-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`📸 Foto tirada: grupo14-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes E2E - Grupo 14 (PBL)');
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

    console.log('\n📋 Teste 1: Acessar página /equipe-14');
    await driver.get(BASE_URL + '/equipe-14');
    await new Promise(r => setTimeout(r, 2000));
    await tiraFoto('01-page-load');

    // Tentar pegar logs do console do navegador para achar o erro de JS!
    try {
      const logs = await driver.manage().logs().get('browser');
      console.log('--- Logs do Console do Navegador ---');
      logs.forEach(log => console.log(`[${log.level.name}] ${log.message}`));
      console.log('-------------------------------------');
    } catch (e) {
      console.log('Não foi possível obter logs do console:', e.message);
    }

    console.log('\n📋 Teste 2: Procurar elementos de Login');
    const usernameInput = await driver.findElements(By.id('username'));
    console.log(`   Inputs de usuário encontrados: ${usernameInput.length}`);
    
    if (usernameInput.length > 0) {
      console.log('   Enviando credenciais...');
      await driver.findElement(By.id('username')).sendKeys('admin');
      await driver.findElement(By.id('password')).sendKeys('123456');
      await tiraFoto('02-credentials-entered');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await new Promise(r => setTimeout(r, 2000));
      await tiraFoto('03-after-login-submit');
    } else {
      console.log('   ❌ Elemento de login não encontrado!');
    }

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
