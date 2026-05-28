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
    const filePath = path.join(SCREENSHOTS_DIR, `grupo11-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`📸 Foto tirada: grupo11-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes E2E - Grupo 11 (Campo Calc)');
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

    console.log('\n📋 Teste 1: Splash page do Grupo 11');
    await driver.get(BASE_URL + '/equipe-11/splash');
    await tiraFoto('01-splash');
    const splashTitle = await driver.getTitle();
    console.log(`   Título da página: ${splashTitle}`);
    console.log('   ✅ Splash carregou');

    console.log('\n📋 Teste 2: Rota protegida redireciona para login');
    await driver.get(BASE_URL + '/equipe-11/dashboard');
    await new Promise((resolve) => setTimeout(resolve, 800));
    const urlAposRedirect = await driver.getCurrentUrl();
    await tiraFoto('02-redirect-login');
    if (!urlAposRedirect.includes('/login')) {
      throw new Error(`Esperado redirect para /login, mas URL é: ${urlAposRedirect}`);
    }
    console.log('   ✅ Redirecionou corretamente para login');

    console.log('\n📋 Teste 3: Login com credenciais inválidas');
    await driver.get(BASE_URL + '/equipe-11/login');
    await driver.findElement(By.name('username')).sendKeys('errado');
    await driver.findElement(By.name('password')).sendKeys('errado');
    await tiraFoto('03-login-invalido-preenchido');
    await driver.findElement(By.css('form')).submit();
    await new Promise((resolve) => setTimeout(resolve, 800));
    await tiraFoto('04-login-invalido-resultado');
    const erroEl = await driver.findElements(By.css('.error-message'));
    if (erroEl.length === 0) {
      throw new Error('Esperado mensagem de erro para credenciais inválidas, mas nenhuma foi encontrada');
    }
    console.log('   ✅ Erro exibido corretamente para credenciais inválidas');

    console.log('\n📋 Teste 4: Login com credenciais corretas (admin/admin)');
    await driver.get(BASE_URL + '/equipe-11/login');
    await driver.findElement(By.name('username')).sendKeys('admin');
    await driver.findElement(By.name('password')).sendKeys('admin');
    await tiraFoto('05-login-valido-preenchido');
    await driver.findElement(By.css('form')).submit();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await tiraFoto('06-pos-login');
    const urlPosLogin = await driver.getCurrentUrl();
    if (!urlPosLogin.includes('/equipe-11/dashboard')) {
      throw new Error(`Login falhou - URL inesperada: ${urlPosLogin}`);
    }
    console.log('   ✅ Login realizado com sucesso');

    console.log('\n📋 Teste 5: Página de dashboard carrega');
    await driver.get(BASE_URL + '/equipe-11/dashboard');
    await new Promise((resolve) => setTimeout(resolve, 500));
    await tiraFoto('07-dashboard');
    const btnConstrucao = await driver.findElements(By.partialLinkText('Abrir construcao'));
    if (btnConstrucao.length === 0) {
      throw new Error('Botão de construção não encontrado no dashboard');
    }
    console.log('   ✅ Dashboard carregou com os atalhos');

    console.log('\n📋 Teste 6: Página de construção');
    await driver.get(BASE_URL + '/equipe-11/construcao');
    await new Promise((resolve) => setTimeout(resolve, 500));
    await tiraFoto('08-construcao');
    const campoLength = await driver.findElements(By.name('length'));
    if (campoLength.length === 0) {
      throw new Error('Campo de comprimento não encontrado na página de construção');
    }
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const areaValue = await driver.findElement(By.id('result-area')).getText();
    if (!areaValue || areaValue === '-') {
      throw new Error('Resultado de construção não apareceu');
    }
    await tiraFoto('09-construcao-resultado');
    console.log('   ✅ Cálculo de construção exibido');

    console.log('\n📋 Teste 7: Página de manutenção');
    await driver.get(BASE_URL + '/equipe-11/manutencao');
    await new Promise((resolve) => setTimeout(resolve, 500));
    await tiraFoto('10-manutencao');
    const campoWater = await driver.findElements(By.name('waterCost'));
    if (campoWater.length === 0) {
      throw new Error('Campo de custo com água não encontrado na página de manutenção');
    }
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const maintenanceValue = await driver.findElement(By.id('result-maintenance-cost')).getText();
    if (!maintenanceValue || maintenanceValue === '-') {
      throw new Error('Resultado de manutenção não apareceu');
    }
    await tiraFoto('11-manutencao-resultado');
    console.log('   ✅ Cálculo de manutenção exibido');

    console.log('\n📋 Teste 8: Página de receita');
    await driver.get(BASE_URL + '/equipe-11/receita');
    await new Promise((resolve) => setTimeout(resolve, 500));
    await tiraFoto('12-receita');
    const campoTicketPrice = await driver.findElements(By.name('ticketPrice'));
    if (campoTicketPrice.length === 0) {
      throw new Error('Campo de preço do ingresso não encontrado na página de receita');
    }
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const revenueValue = await driver.findElement(By.id('result-revenue-value')).getText();
    if (!revenueValue || revenueValue === '-') {
      throw new Error('Resultado de receita não apareceu');
    }
    await tiraFoto('13-receita-resultado');
    console.log('   ✅ Cálculo de receita exibido');

    console.log('\n📋 Teste 9: Página Sobre');
    await driver.get(BASE_URL + '/equipe-11/sobre');
    await tiraFoto('14-sobre');
    const fotos = await driver.findElements(By.css('.about-image-card img'));
    if (fotos.length < 3) {
      throw new Error('As fotos da equipe não foram exibidas corretamente');
    }
    console.log('   ✅ Página Sobre carregou com as fotos');

    console.log('\n🎉 Todos os testes do Grupo 11 passaram!\n');
  } catch (error) {
    console.error(`\n❌ Teste falhou: ${error.message}`);
    try { await tiraFoto('99-erro-fatal'); } catch (_) {}
    throw error;
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch((err) => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});