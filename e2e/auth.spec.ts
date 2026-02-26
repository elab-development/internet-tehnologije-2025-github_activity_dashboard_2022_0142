import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should allow a user to log in', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill('test@test.com');
    await page.getByTestId('login-password').fill('test');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('logout-btn')).toBeVisible();
    });

    test('should show an error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill('wrong@example.com');
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();

    await expect(page.getByTestId('logout-btn')).not.toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    });
});
