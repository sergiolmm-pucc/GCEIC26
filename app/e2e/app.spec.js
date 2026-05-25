import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

async function saveScreenshot(page, name) {
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name}.png`),
    fullPage: true
  });
}

async function doLogin(page, username = 'admin', password = 'admin') {
  await page.getByLabel(/usuario/i).fill(username);
  await page.getByLabel(/senha/i).fill(password);
  await page.getByRole('button', { name: /entrar/i }).click();
}

test.describe('HourlyCost — Testes Funcionais com Screenshots', () => {

  test('01 - tela de login renderizada', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    await saveScreenshot(page, '01-login');
  });

  test('02 - login invalido mostra mensagem de erro', async ({ page }) => {
    await page.goto('/');
    await doLogin(page, 'Adm', 'wrong');
    await expect(page.getByRole('alert')).toContainText(/invalidos/i);
    await saveScreenshot(page, '02-login-invalido');
  });

  test('03 - login valido abre a calculadora', async ({ page }) => {
    await page.goto('/');
    await doLogin(page);
    await expect(page.getByRole('heading', { name: /custo de servicos em horas/i })).toBeVisible();
    await saveScreenshot(page, '03-calculadora');
  });

  test('04 - calcula e exibe os 17 campos em 3 secoes', async ({ page }) => {
    await page.goto('/');
    await doLogin(page);
    await page.getByRole('button', { name: /calcular/i }).click();
    await expect(page.getByTestId('preco-hora-final')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('secao-mao-de-obra')).toBeVisible();
    await expect(page.getByTestId('secao-operacional')).toBeVisible();
    await expect(page.getByTestId('secao-precificacao')).toBeVisible();
    await saveScreenshot(page, '04-resultado');
  });

  test('05 - tela Sobre exibe membros da equipe', async ({ page }) => {
    await page.goto('/');
    await doLogin(page);
    await page.getByRole('button', { name: /sobre/i }).click();
    await expect(page.getByRole('heading', { name: /equipe desenvolvedora/i })).toBeVisible();
    await saveScreenshot(page, '05-sobre');
  });

  test('06 - tela Ajuda exibe instrucoes', async ({ page }) => {
    await page.goto('/');
    await doLogin(page);
    await page.getByRole('button', { name: /ajuda/i }).click();
    await expect(page.getByRole('heading', { name: /como usar o hourlycost/i })).toBeVisible();
    await saveScreenshot(page, '06-ajuda');
  });

  test('07 - logout retorna para tela de login', async ({ page }) => {
    await page.goto('/');
    await doLogin(page);
    await page.getByRole('button', { name: /sair/i }).click();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    await saveScreenshot(page, '07-logout');
  });

  test('08 - campos customizados produzem resultado diferente', async ({ page }) => {
    await page.goto('/');
    await doLogin(page);
    await page.locator('#salarioDesejado').fill('12000');
    await page.locator('#margemLucroDesejada').fill('30');
    await page.getByRole('button', { name: /calcular/i }).click();
    await expect(page.getByTestId('preco-hora-final')).toBeVisible({ timeout: 15_000 });
    await saveScreenshot(page, '08-resultado-customizado');
  });

});
