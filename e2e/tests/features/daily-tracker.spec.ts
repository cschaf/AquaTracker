import { test, expect } from '@playwright/test';
import { MainPage } from '../../page-objects/MainPage';

test.describe('Daily Tracker Feature', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    // Clear local storage before each test to ensure a clean state
    await page.evaluate(() => localStorage.clear());
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('should allow a user to add and delete a water intake entry', async ({ page }) => {
    const customAmount = 123;

    // 1. Add a custom amount
    await mainPage.addCustomAmount(customAmount);

    // 2. Verify the entry appears in the list
    // We need a way to get the ID of the new entry. Since we can't get it from the UI,
    // we'll just look for an entry with the correct amount. This is a limitation
    // of testing without access to the application's internal state.
    const newEntry = mainPage.todaysEntriesList.getByText(`${customAmount} ml`);
    await expect(newEntry).toBeVisible();

    // 3. Delete the entry
    // We need to find the parent entry item to find the delete button.
    const entryItem = page.locator('[data-testid^="entry-item-"]').filter({ has: newEntry });
    const deleteButton = mainPage.getEntryDeleteButton(entryItem);
    await deleteButton.click();

    // 4. Verify the entry is removed
    await expect(newEntry).not.toBeVisible();
    await expect(page.getByText('No entries yet.')).toBeVisible();
  });
});
