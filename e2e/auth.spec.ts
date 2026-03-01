   import { test, expect } from '@playwright/test';

   test.describe('Authentication', () => {
     test('should allow a user to log in', async ({ page }) => {
       await page.goto('/login');

       // Use the credentials from the seed script
       await page.getByPlaceholder('Email').fill('test@example.com');
       await page.getByPlaceholder('Password').fill('password123');

       await page.getByTestId('login-submit').click();

       // Check for successful navigation and that the logout button is visible
       await expect(page).toHaveURL('/');
       await expect(page.getByTestId('logout-btn')).toBeVisible();
     });
   });
