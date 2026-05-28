const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

describe('E2E — Fluxo de Simulação de Parcelas', () => {
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

  test('deve exibir o resultado após simular um financiamento', async () => {
    await driver.get(APP_URL);

    // Aguarda o splash (2500ms) e a tela de login aparecer
    await fazerLogin();

    // Aguarda a tela Home e clica no card Simulador
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Simulador']")), 5000);
    await driver.findElement(By.xpath("//*[text()='Simulador']")).click();

    // Aguarda a tela Simulador carregar
    await driver.wait(until.elementLocated(By.css('input[placeholder="Ex: 60000"]')), 5000);

    // Preenche os campos do formulário
    const inputVeiculo = await driver.findElement(By.css('input[placeholder="Ex: 60000"]'));
    await inputVeiculo.clear();
    await inputVeiculo.sendKeys('30000');

    const inputEntrada = await driver.findElement(By.css('input[placeholder="Ex: 12000"]'));
    await inputEntrada.clear();
    await inputEntrada.sendKeys('6000');

    // Clica em CALCULAR
    await driver.findElement(By.xpath("//button[text()='CALCULAR']")).click();

    // Verifica que o card de resultado apareceu com "Parcela Mensal"
    const resultadoEl = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Parcela Mensal')]")),
      8000
    );
    const texto = await resultadoEl.getText();
    expect(texto).toContain('Parcela Mensal');
  }, 60000);

  test('deve exibir erro ao calcular sem informar o valor do veículo', async () => {
    await driver.get(APP_URL);
    await fazerLogin();

    // Navega para Simulador sem preencher o valor do veículo
    await driver.wait(until.elementLocated(By.xpath("//*[text()='Simulador']")), 5000);
    await driver.findElement(By.xpath("//*[text()='Simulador']")).click();

    await driver.wait(until.elementLocated(By.css('input[placeholder="Ex: 60000"]')), 5000);

    // Clica em CALCULAR sem preencher nenhum campo
    await driver.findElement(By.xpath("//button[text()='CALCULAR']")).click();

    // Verifica a mensagem de erro
    const erroEl = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Informe o valor do veículo')]")),
      5000
    );
    const erroTexto = await erroEl.getText();
    expect(erroTexto).toContain('Informe o valor do veículo');
  }, 60000);
});
