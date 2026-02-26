import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
    test('should load the homepage and show the search box', async ({ page }) =>
{
    await page.goto('/');

    await expect(page.getByTestId('search-input')).toBeVisible();

    await expect(page.getByTestId('search-input')).toBeVisible();
    await expect(page.getByTestId('search-submit')).toBeVisible();
    });

    test('should show a login button for unauthenticated users', async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('login-btn')).toBeVisible();
    });

    test('clicking login button should navigate to the login page', async ({ page}) => {
    await page.goto('/');
    await page.getByTestId('login-btn').click();

    await expect(page).toHaveURL(/login/);
    await expect(page.getByTestId('login-submit')).toBeVisible();
    });
});
