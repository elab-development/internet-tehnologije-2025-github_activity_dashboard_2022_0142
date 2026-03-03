import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
    await page.goto('/');
    });

    test('should allow searching for a repository', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    const searchType = page.getByTestId('search-type');

    await expect(searchInput).toHaveAttribute('placeholder', 'Search repositories...');

    await searchInput.fill('react');
    await page.getByTestId('search-submit').click();
    await expect(page.getByRole('link', { name: 'facebook/react' })).toBeVisible({timeout: 15000});
    });

    test('should change placeholder when switching to user search', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    const searchType = page.getByTestId('search-type');

    await searchType.selectOption('user');
    await expect(searchInput).toHaveAttribute('placeholder', 'Enter username...');
    });

    test('should allow searching for a user', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');
    const searchType = page.getByTestId('search-type');

    await searchType.selectOption('user');
    await searchInput.fill('torvalds');
    await page.getByTestId('search-submit').click();
    await expect(page.getByRole('link', { name: /torvalds\/linux/i })).toBeVisible();
    });
});

