import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Search repositories...' }).click();
  await page.getByRole('combobox').selectOption('user');
  await page.getByRole('textbox', { name: 'Enter username...' }).click();
  await page.getByRole('textbox', { name: 'Enter username...' }).fill('lalkee');
  await page.getByRole('textbox', { name: 'Enter username...' }).press('Enter');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'lalkee/river-crossing-problem' }).click();
});