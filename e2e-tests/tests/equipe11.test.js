const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let driver;

async function shot(name) {
  const img = await driver.takeScreenshot();
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${name}.png`), img, 'base64');
}

async function main() {
  const opts = new chrome.Options();
  opts.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1200,800');

  driver = await new Builder().forBrowser('chrome').setChromeOptions(opts).build();
  await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });

  try {
    await driver.get(BASE_URL + '/equipe-11');
    await shot('01-splash-or-login');

    // login by name
    await driver.findElement(By.name('username')).sendKeys('admin');
    await driver.findElement(By.name('password')).sendKeys('admin');
    await shot('02-credentials');
    await driver.findElement(By.css('form')).submit();
    await new Promise(r => setTimeout(r, 1200));
    await shot('03-after-login');

    // fill calculate form
    await driver.findElement(By.name('length')).clear();
    await driver.findElement(By.name('length')).sendKeys('100');
    await driver.findElement(By.name('width')).clear();
    await driver.findElement(By.name('width')).sendKeys('50');
    await shot('04-filled');

    await driver.findElement(By.css('form')).submit();
    await new Promise(r => setTimeout(r, 1500));
    await shot('05-result');

    const totalEl = await driver.findElement(By.xpath("//div[contains(@class,'result-card')][.//strong/text()='Custo total' or .//strong='Custo total']//span"))
      .catch(() => null);

    if (totalEl) {
      const txt = await totalEl.getText();
      console.log('Custo total:', txt);
    } else {
      // fallback: read last result-card span
      const spans = await driver.findElements(By.css('.result-card span'));
      if (spans.length > 0) console.log('Custo total (fallback):', await spans[spans.length - 1].getText());
      else throw new Error('Resultado não encontrado');
    }

  } finally {
    if (driver) await driver.quit();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
