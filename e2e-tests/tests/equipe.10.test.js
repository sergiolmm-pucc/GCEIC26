const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

async function tiraFoto(name) {
  const img = await driver.takeScreenshot();
  const filePath = path.join(SCREENSHOTS_DIR, `${name.replace(/\s+/g, '_')}.png`);
  fs.writeFileSync(filePath, img, 'base64');
}

async function aguardaCampoLogin(timeoutMs = 120000) {
  const limite = Date.now() + timeoutMs;

  while (Date.now() < limite) {
    await driver.get(`${BASE_URL}/equipe-10/login`);

    const campos = await driver.findElements(By.name('username'));
    if (campos.length > 0) {
      return;
    }

    await driver.sleep(5000);
  }

  const urlAtual = await driver.getCurrentUrl();
  throw new Error(`Campo username nao encontrado na tela de login. URL atual: ${urlAtual}`);
}

async function loginFinanceira() {
  await aguardaCampoLogin();

  const usuario = await driver.wait(until.elementLocated(By.name('username')), 10000);
  const senha = await driver.wait(until.elementLocated(By.name('password')), 10000);

  await usuario.clear();
  await usuario.sendKeys('admin');
  await senha.clear();
  await senha.sendKeys('1234');

  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/equipe-10/calculo'), 15000);
}

async function realizarCalculo(capital, taxa, tempo, tipo) {
  await driver.get(`${BASE_URL}/equipe-10/calculo`);

  const campoCapital = await driver.wait(until.elementLocated(By.name('capital')), 10000);
  const campoTaxa = await driver.wait(until.elementLocated(By.name('taxa')), 10000);
  const campoTempo = await driver.wait(until.elementLocated(By.name('tempo')), 10000);

  await campoCapital.clear();
  await campoCapital.sendKeys(capital);
  await campoTaxa.clear();
  await campoTaxa.sendKeys(taxa);
  await campoTempo.clear();
  await campoTempo.sendKeys(tempo);

  const select = await driver.findElement(By.name('tipo'));
  await select.sendKeys(tipo === 'simples' ? 'Juros Simples' : 'Juros Compostos');

  await driver.findElement(By.css('button[type="submit"]')).click();

  return await driver.wait(until.elementLocated(By.className('resultado-box')), 10000);
}

async function main() {
  try {
    const opts = new chrome.Options();
    opts.addArguments(
      '--headless=new',
      '--window-size=1280,720',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    );

    driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

    console.log('Teste 1: Acessando calculadora financeira...');
    await loginFinanceira();
    await tiraFoto('Equipe10_1_Login_Sucesso');

    console.log('Teste 2: Calculando Juros Simples...');
    await realizarCalculo('1000', '5', '12', 'simples');
    await tiraFoto('Equipe10_2_Resultado_Simples');

    console.log('Teste 3: Calculando Juros Compostos...');
    await realizarCalculo('1000', '5', '12', 'compostos');
    await tiraFoto('Equipe10_3_Resultado_Compostos');

    console.log('Teste 4: Navegando pelas telas financeiras...');
    await driver.get(`${BASE_URL}/equipe-10/sobre`);
    await tiraFoto('Equipe10_4_Tela_Sobre');

    await driver.get(`${BASE_URL}/equipe-10/help`);
    await tiraFoto('Equipe10_5_Tela_Help');

    console.log('Todos os testes da calculadora financeira concluídos.');
  } catch (error) {
    console.error('Falha nos testes da Financeira:', error.message);
    process.exit(1);
  } finally {
    if (driver) await driver.quit();
  }
}

main().catch((err) => console.error(err));
