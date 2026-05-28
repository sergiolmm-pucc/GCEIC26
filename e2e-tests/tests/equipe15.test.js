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
    const filePath = path.join(SCREENSHOTS_DIR, `grupo15-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`Foto tirada: grupo15-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

async function main() {
  console.log('Iniciando testes E2E — Grupo 15 (FreteCalc)');
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
    console.log('\nTeste 1: Splash screen do FreteCalc');
    await driver.get(BASE_URL);
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('01-splash');

    const splash = await driver.findElements(By.css('.fc-splash'));
    if (splash.length === 0) {
      throw new Error('Splash screen não carregou — elemento .fc-splash não encontrado');
    }
    console.log('Splash screen carregou');

    // ── Teste 2: Splash some e redireciona para login após ~3s ────────────
    console.log('\nTeste 2: Redirecionamento para tela de login após splash');
    await new Promise(r => setTimeout(r, 3200));
    await tiraFoto('02-login');

    const loginCard = await driver.findElements(By.css('.fc-login-card'));
    if (loginCard.length === 0) {
      throw new Error('Tela de login não apareceu após a splash screen');
    }
    console.log('Tela de login apareceu');

    // ── Teste 3: Login com credenciais inválidas ──────────────────────────
    console.log('\nTeste 3: Login com credenciais inválidas');
    const userInput = await driver.findElement(By.css('input.fc-input[type="text"]'));
    const passInput = await driver.findElement(By.css('input.fc-input[type="password"]'));
    await userInput.sendKeys('errado');
    await passInput.sendKeys('errado');
    await tiraFoto('03-login-invalido-preenchido');

    await driver.findElement(By.css('button.fc-btn[type="submit"]')).click();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('04-login-invalido-erro');

    const erroEl = await driver.findElements(By.css('.fc-alert'));
    if (erroEl.length === 0) {
      throw new Error('Mensagem de erro não apareceu para credenciais inválidas');
    }
    console.log('Erro exibido para credenciais inválidas');

    // ── Teste 4: Login com credenciais corretas (admin / 1234) ────────────
    console.log('\nTeste 4: Login com credenciais corretas (admin / 1234)');
    await driver.get(BASE_URL + '/login');
    await new Promise(r => setTimeout(r, 500));

    const userInput2 = await driver.findElement(By.css('input.fc-input[type="text"]'));
    const passInput2 = await driver.findElement(By.css('input.fc-input[type="password"]'));
    await userInput2.sendKeys('admin');
    await passInput2.sendKeys('1234');
    await tiraFoto('05-login-valido-preenchido');

    await driver.findElement(By.css('button.fc-btn[type="submit"]')).click();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('06-simulacao');

    const navbar = await driver.findElements(By.css('.fc-navbar'));
    if (navbar.length === 0) {
      throw new Error('Navbar não apareceu após login — página de simulação não carregou');
    }
    console.log('Login realizado — página de simulação carregada');

    // ── Teste 5: Navegar para Histórico ───────────────────────────────────
    console.log('\nTeste 5: Página Histórico');
    const linkHistorico = await driver.findElement(
      By.xpath("//a[contains(@class,'nav-link') and contains(.,'Histórico')]")
    );
    await linkHistorico.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('07-historico');

    await driver.wait(until.urlContains('/historico'), 3000);
    console.log('Página Histórico carregou');

    // ── Teste 6: Navegar para Sobre ───────────────────────────────────────
    console.log('\nTeste 6: Página Sobre');
    const linkSobre = await driver.findElement(
      By.xpath("//a[contains(@class,'nav-link') and contains(.,'Sobre')]")
    );
    await linkSobre.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('08-sobre');

    await driver.wait(until.urlContains('/sobre'), 3000);
    console.log('Página Sobre carregou');

    // ── Teste 7: Navegar para Help ────────────────────────────────────────
    console.log('\nTeste 7: Página Help');
    const linkHelp = await driver.findElement(
      By.xpath("//a[contains(@class,'nav-link') and contains(.,'Help')]")
    );
    await linkHelp.click();
    await new Promise(r => setTimeout(r, 400));
    await tiraFoto('09-help');

    await driver.wait(until.urlContains('/help'), 3000);
    console.log('Página Help carregou');

    // ── Teste 8: Simulação — preencher formulário e calcular ──────────────
    console.log('\nTeste 8: Simulação de frete');
    const linkSimulacao = await driver.findElement(
      By.xpath("//a[contains(@class,'nav-link') and contains(.,'Simulação')]")
    );
    await linkSimulacao.click();
    await new Promise(r => setTimeout(r, 600));

    // Seleciona origem
    const selects = await driver.findElements(By.css('select'));
    if (selects.length >= 2) {
      const { Select } = require('selenium-webdriver/lib/select');
      const selectOrigem  = new Select(selects[0]);
      const selectDestino = new Select(selects[1]);
      await selectOrigem.selectByVisibleText('São Paulo');
      await new Promise(r => setTimeout(r, 400));
      await selectDestino.selectByVisibleText('Rio de Janeiro');
      await new Promise(r => setTimeout(r, 600)); // aguarda busca de distância

      // Preenche o peso
      const inputPeso = await driver.findElement(By.css('input[type="number"]'));
      await inputPeso.clear();
      await inputPeso.sendKeys('10');

      await tiraFoto('10-simulacao-preenchida');

      // Clica em Calcular
      const btnCalcular = await driver.findElement(
        By.xpath("//button[contains(.,'Calcular') or contains(.,'calcular')]")
      );
      await btnCalcular.click();
      await new Promise(r => setTimeout(r, 800));
      await tiraFoto('11-simulacao-resultado');
      console.log('Formulário preenchido e cálculo executado');
    } else {
      console.log('Selects de cidade não encontrados — pulando preenchimento');
    }

    // ── Teste 9: Logout ───────────────────────────────────────────────────
    console.log('\nTeste 9: Logout');
    const btnLogout = await driver.findElement(By.css('button.fc-btn-ghost'));
    await btnLogout.click();
    await new Promise(r => setTimeout(r, 500));
    await tiraFoto('12-logout');

    await driver.wait(until.urlContains('/login'), 3000);
    console.log('Logout realizado — redirecionado para login');

    console.log('\n🎉 Todos os testes do Grupo 15 passaram!\n');

  } catch (error) {
    console.error(`\nTeste falhou: ${error.message}`);
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
