const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

describe('E2E — Fluxo de Capacidade de Financiamento', () => {
  let driver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800'
    );
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  async function fazerLogin() {
    const inputUsuario = await driver.wait(
      until.elementLocated(By.css('input[placeholder="Digite seu usuário"]')),
      8000
    );
    await inputUsuario.sendKeys('admin');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('1234');
    await driver.findElement(By.xpath("//button[text()='ENTRAR']")).click();
  }

  test('deve exibir o resultado após calcular a capacidade de financiamento', async () => {
    await driver.get(APP_URL);

    // Aguarda o splash (2500ms) e a tela de login aparecer
    await fazerLogin();

    // Aguarda a tela Home e clica no card Capacidade
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Capacidade']")), 5000);
    await driver.findElement(By.xpath("//*[text()='Capacidade']")).click();

    // Aguarda a tela Capacidade carregar
    await driver.wait(until.elementLocated(By.css('input[placeholder="Ex: 8000"]')), 5000);

    // Preenche a renda mensal
    const inputRenda = await driver.findElement(By.css('input[placeholder="Ex: 8000"]'));
    await inputRenda.clear();
    await inputRenda.sendKeys('5000');

    // Clica em CALCULAR
    await driver.findElement(By.xpath("//button[text()='CALCULAR']")).click();

    // Verifica que o resultado apareceu com a parcela máxima
    const resultadoEl = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Parcela Máxima')]")),
      8000
    );
    const texto = await resultadoEl.getText();
    expect(texto).toContain('Parcela Máxima');
  }, 60000);

  test('deve exibir erro ao calcular sem informar a renda mensal', async () => {
    await driver.get(APP_URL);
    await fazerLogin();

    // Navega para Capacidade sem preencher a renda
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Capacidade']")), 5000);
    await driver.findElement(By.xpath("//*[text()='Capacidade']")).click();

    await driver.wait(until.elementLocated(By.css('input[placeholder="Ex: 8000"]')), 5000);

    // Clica em CALCULAR sem preencher nenhum campo
    await driver.findElement(By.xpath("//button[text()='CALCULAR']")).click();

    // Verifica a mensagem de erro
    const erroEl = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Informe sua renda mensal')]")),
      5000
    );
    const erroTexto = await erroEl.getText();
    expect(erroTexto).toContain('Informe sua renda mensal');
  }, 60000);
});
