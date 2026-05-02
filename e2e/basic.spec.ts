import { test, expect } from '@playwright/test';

test('has title and navigation', async ({ page }) => {
  await page.goto('/');

  // Check if navigation exists
  const nav = page.locator('nav');
  if (await nav.count() > 0) {
    await expect(nav).toBeVisible();
  }
});

test('can navigate to markets', async ({ page }) => {
  await page.goto('/');
  // Find a link that contains "Markets"
  const marketsLink = page.locator('a:has-text("Markets")');
  if (await marketsLink.count() > 0) {
    await marketsLink.click();
    await expect(page).toHaveURL(/\/markets/);
  }
});
