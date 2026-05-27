const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'financeira');

// Garante diretório de evidências
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

async function tiraFoto(name) {
    const img = await driver.takeScreenshot();
    const filePath = path.join(SCREENSHOTS_DIR, `${name.replace(/\s+/g, '_')}.png`);
    fs.writeFileSync(filePath, img, 'base64');
}

async function loginFinanceira() {
    await driver.get(`${BASE_URL}/equipe-10/login`);
    await driver.findElement(By.name('username')).sendKeys('admin');
    await driver.findElement(By.name('password')).sendKeys('1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/equipe-10/calculo'), 3000);
}

async function realizarCalculo(capital, taxa, tempo, tipo) {
    // Navega para a calculadora se não estiver nela
    await driver.get(`${BASE_URL}/equipe-10/calculo`);
    
    // Preenchimento dos campos conforme o seu EJS
    await driver.findElement(By.name('capital')).clear();
    await driver.findElement(By.name('capital')).sendKeys(capital);
    await driver.findElement(By.name('taxa')).clear();
    await driver.findElement(By.name('taxa')).sendKeys(taxa);
    await driver.findElement(By.name('tempo')).clear();
    await driver.findElement(By.name('tempo')).sendKeys(tempo);
    
    // Seleciona tipo (Simples ou Compostos)
    const select = await driver.findElement(By.name('tipo'));
    await select.sendKeys(tipo === 'simples' ? 'Juros Simples' : 'Juros Compostos');
    
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Aguarda o resultado aparecer na tela
    return await driver.wait(until.elementLocated(By.className('resultado-box')), 5000);
}

async function main() {
    try {
        const opts = new chrome.Options();
        opts.addArguments('--headless=new', '--window-size=1280,720');
        
        driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();

        // 1. Teste de Acesso (Login da Equipe 10)
        console.log("Teste 1: Acessando calculadora financeira...");
        await loginFinanceira();
        await tiraFoto("1_Login_Sucesso");

        // 2. Teste Cálculo Juros Simples
        console.log("Teste 2: Calculando Juros Simples...");
        await realizarCalculo('1000', '5', '12', 'simples');
        await tiraFoto("2_Resultado_Simples");

        // 3. Teste Cálculo Juros Compostos
        console.log("Teste 3: Calculando Juros Compostos...");
        await realizarCalculo('1000', '5', '12', 'compostos');
        await tiraFoto("3_Resultado_Compostos");

        // 4. Teste de Navegação Interna
        console.log("Teste 4: Navegando pelas telas financeiras...");
        await driver.get(`${BASE_URL}/equipe-10/sobre`);
        await tiraFoto("4_Tela_Sobre");
        
        await driver.get(`${BASE_URL}/equipe-10/help`);
        await tiraFoto("5_Tela_Help");

        console.log("✅ Todos os testes da calculadora financeira concluídos.");

    } catch (error) {
        console.error('❌ Falha nos testes da Financeira:', error.message);
        process.exit(1);
    } finally {
        if (driver) await driver.quit();
    }
}

main().catch(err => console.error(err));
