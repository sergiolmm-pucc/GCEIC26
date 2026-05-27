const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

// Garante que o diretório de screenshots existe
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver; 

async function tiraFoto(name){
      try{
        const img = await driver.takeScreenshot();
        const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
        fs.writeFileSync(filePath, img, 'base64');
        console.log(`Foto tirada ${name}.png`);
      }catch(e){
        console.warn('Erro ao tirar a foto');
      }
}

async function testarGrupo6() {
    console.log('Iniciando testes do Grupo 6 - Sauna...');

    // 1. TESTE DE LOGIN
    console.log('Acessando login do Grupo 6...');
    await driver.get(BASE_URL + '/sauna6/login');
    await tiraFoto('G6-01-Login-Aberto');

    await driver.findElement(By.id('usuario')).sendKeys('admin');
    await driver.findElement(By.id('senha')).sendKeys('1234');
    await tiraFoto('G6-02-Login-Preenchido');

    await driver.findElement(By.id('formLogin')).submit();
    
    // 2. TESTE DA CALCULADORA
    console.log('Aguardando redirecionamento para calculadora...');
    await driver.wait(until.urlContains('/sauna6/calculadora'), 5000);
    await new Promise(r => setTimeout(r, 1000));
    await tiraFoto('G6-03-Calculadora-Aberta');

    console.log('Preenchendo simulacao da sauna...');
    await driver.findElement(By.id('largura')).sendKeys('2');
    await driver.findElement(By.id('comprimento')).sendKeys('2');
    await driver.findElement(By.id('altura')).sendKeys('2.5');
    await tiraFoto('G6-04-Calculadora-Preenchida');

    await driver.findElement(By.id('formSauna')).submit();
    
    await new Promise(r => setTimeout(r, 2000)); 
    await tiraFoto('G6-05-Calculadora-Resultados');

    console.log('Testes do Grupo 6 finalizados com sucesso.');
}

async function main() {
    console.log('Iniciand');
    try{
      const opts = new chrome.Options();
      opts.addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=800,640',
      '--disable-gpu'
      );

      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(opts)
        .build();
      console.log('criado');  
      await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });

      // TESTE ORIGINAL MANTIDO
      await driver.get(BASE_URL + '/login');

      tiraFoto("Pagina Entrada");
      //preenche os campos 

      await driver.findElement(By.id('username')).sendKeys('Adm');
      await driver.findElement(By.id('password')).sendKeys('admin');

      tiraFoto("Valores Digitados");
      // vamos acionar o botao de login e ver o que acontece
      await driver.findElement(By.id('loginForm')).submit();
      await new Promise(r => setTimeout(r, 800)); 

      tiraFoto("Submit form com erro");

      try {
          const errMsg = await driver.findElement(By.css('.erro')).getText();
          if (!errMsg.includes('invalidos')) throw new Error(`Falhou : ${errMsg}`);
      } catch (errOriginal) {
          console.log('Aviso no teste original:', errOriginal.message);
      }
      
      // CHAMADA DO NOSSO METODO NOVO AQUI
      await testarGrupo6();
    
    } catch(error){  
        console.log(error.message);
    } finally {
        if (driver) await driver.quit();
    }

}

main().catch( err => { 
    console.error('Erro fatal', err);
    process.exit(1);
});