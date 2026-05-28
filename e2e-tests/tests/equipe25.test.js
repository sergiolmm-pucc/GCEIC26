const { Builder, By, Key } = require('selenium-webdriver');
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
    const filePath = path.join(SCREENSHOTS_DIR, `grupo25-${name}.png`);
    fs.writeFileSync(filePath, img, 'base64');
    console.log(`📸 Foto tirada: grupo25-${name}.png`);
  } catch (e) {
    console.warn('Aviso: erro ao tirar foto:', e.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes E2E - Grupo 25 (CSH / HourlyCost)');
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

    // ── Teste 1: Tela de Login renderizada ──────────────────────────────────
    console.log('\n📋 Teste 1: Tela de Login do Grupo 25');
    await driver.get(BASE_URL + '/equipe-25');
    await new Promise(r => setTimeout(r, 1000));
    await tiraFoto('01-login');
    const loginButton = await driver.findElements(By.id('btnLogin'));
    if (loginButton.length === 0) {
      throw new Error('Botão de login não encontrado na página inicial');
    }
    console.log('   ✅ Tela de login carregou');

    // ── Teste 2: Login inválido mostra mensagem de erro ─────────────────────
    console.log('\n📋 Teste 2: Login inválido');
    await driver.findElement(By.id('username')).sendKeys('Adm');
    await driver.findElement(By.id('password')).sendKeys('wrong');
    await tiraFoto('02-login-invalido-preenchido');
    await driver.findElement(By.id('loginForm')).submit();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('03-login-invalido-resultado');
    const erroEl = await driver.findElements(By.css('.alert.erro'));
    if (erroEl.length === 0) {
      throw new Error('Esperado mensagem de erro para login inválido');
    }
    const errMsg = await erroEl[0].getText();
    if (!errMsg.toLowerCase().includes('invalido') && !errMsg.toLowerCase().includes('inválido')) {
      throw new Error(`Mensagem de erro inesperada: ${errMsg}`);
    }
    console.log('   ✅ Mensagem de erro exibida corretamente');

    // Limpa os campos de input
    const usernameInput = await driver.findElement(By.id('username'));
    const passwordInput = await driver.findElement(By.id('password'));

    await usernameInput.sendKeys(Key.CONTROL, 'a');
    await usernameInput.sendKeys(Key.BACK_SPACE);
    await usernameInput.clear();

    await passwordInput.sendKeys(Key.CONTROL, 'a');
    await passwordInput.sendKeys(Key.BACK_SPACE);
    await passwordInput.clear();

    // ── Teste 3: Login com credenciais válidas abre a calculadora ───────────
    console.log('\n📋 Teste 3: Login válido (admin/admin)');
    await driver.findElement(By.id('username')).sendKeys('admin');
    await driver.findElement(By.id('password')).sendKeys('admin');
    await tiraFoto('04-login-valido-preenchido');
    await driver.findElement(By.id('loginForm')).submit();
    await new Promise(r => setTimeout(r, 1000));
    await tiraFoto('05-calculadora-carregada');
    const heading = await driver.findElements(By.css('h1'));
    let foundHeading = false;
    for (const h of heading) {
      const text = await h.getText();
      if (text.toLowerCase().includes('custo de servicos') || text.toLowerCase().includes('custo de serviços')) {
        foundHeading = true;
        break;
      }
    }
    if (!foundHeading) {
      throw new Error('Título da calculadora não encontrado após login bem-sucedido');
    }
    console.log('   ✅ Login realizado e calculadora exibida');

    // ── Teste 4: Calcula e exibe os 17 campos em 3 seções ───────────────────
    console.log('\n📋 Teste 4: Executar cálculo e verificar resultados');
    const btnCalcular = await driver.findElement(By.id('btnCalcular'));
    await btnCalcular.click();
    await new Promise(r => setTimeout(r, 1500));
    await tiraFoto('06-resultado-calculo');

    const precoHoraFinal = await driver.findElement(By.css('[data-testid="preco-hora-final"]'));
    const precoText = await precoHoraFinal.getText();
    console.log(`   Preço final sugerido calculado: ${precoText}`);
    if (!precoText.includes('R$')) {
      throw new Error(`Formato de preço final inválido: ${precoText}`);
    }

    const secaoMaoObra = await driver.findElements(By.css('[data-testid="secao-mao-de-obra"]'));
    const secaoOperacional = await driver.findElements(By.css('[data-testid="secao-operacional"]'));
    const secaoPrecificacao = await driver.findElements(By.css('[data-testid="secao-precificacao"]'));

    if (secaoMaoObra.length === 0 || secaoOperacional.length === 0 || secaoPrecificacao.length === 0) {
      throw new Error('As três seções de resultado (Mão de Obra, Operacional, Precificação) devem ser exibidas');
    }
    console.log('   ✅ Cálculo executado e todas as 3 seções exibidas');

    // ── Teste 5: Tela Sobre exibe membros da equipe ─────────────────────────
    console.log('\n📋 Teste 5: Tela Sobre');
    const navButtons = await driver.findElements(By.css('.topbar nav button'));
    let btnSobre;
    for (const btn of navButtons) {
      const text = await btn.getText();
      if (text.toLowerCase().includes('sobre')) {
        btnSobre = btn;
        break;
      }
    }
    if (!btnSobre) throw new Error('Botão "Sobre" não encontrado na navegação');
    await btnSobre.click();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('07-sobre');
    const sobreHeading = await driver.findElements(By.css('h1'));
    let foundSobre = false;
    for (const h of sobreHeading) {
      const text = await h.getText();
      if (text.toLowerCase().includes('equipe desenvolvedora')) {
        foundSobre = true;
        break;
      }
    }
    if (!foundSobre) throw new Error('Título "Equipe desenvolvedora" não encontrado na tela Sobre');
    console.log('   ✅ Tela Sobre carregou com sucesso');

    // ── Teste 6: Tela Ajuda exibe instruções ────────────────────────────────
    console.log('\n📋 Teste 6: Tela Ajuda');
    let btnAjuda;
    for (const btn of navButtons) {
      const text = await btn.getText();
      if (text.toLowerCase().includes('ajuda')) {
        btnAjuda = btn;
        break;
      }
    }
    if (!btnAjuda) throw new Error('Botão "Ajuda" não encontrado na navegação');
    await btnAjuda.click();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('08-ajuda');
    const ajudaHeading = await driver.findElements(By.css('h1'));
    let foundAjuda = false;
    for (const h of ajudaHeading) {
      const text = await h.getText();
      if (text.toLowerCase().includes('como usar o hourlycost')) {
        foundAjuda = true;
        break;
      }
    }
    if (!foundAjuda) throw new Error('Título "Como usar o HourlyCost" não encontrado na tela Ajuda');
    console.log('   ✅ Tela Ajuda carregou com sucesso');

    // ── Teste 7: Logout retorna para a tela de login ───────────────────────
    console.log('\n📋 Teste 7: Logout');
    let btnSair;
    for (const btn of navButtons) {
      const text = await btn.getText();
      if (text.toLowerCase().includes('sair')) {
        btnSair = btn;
        break;
      }
    }
    if (!btnSair) throw new Error('Botão "Sair" não encontrado na navegação');
    await btnSair.click();
    await new Promise(r => setTimeout(r, 800));
    await tiraFoto('09-logout');
    const loginBtnAfterLogout = await driver.findElements(By.id('btnLogin'));
    if (loginBtnAfterLogout.length === 0) {
      throw new Error('Botão de login não encontrado após logout');
    }
    console.log('   ✅ Logout realizado com sucesso');

    console.log('\n🎉 Todos os testes do Grupo 25 passaram!\n');

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
