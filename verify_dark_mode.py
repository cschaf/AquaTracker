import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5173")

        # Wait for the page to load
        await expect(page.get_by_role("heading", name="AquaTracker")).to_be_visible()

        # Take a screenshot of the light mode
        await page.screenshot(path="light-mode.png")

        # Switch to dark mode
        await page.get_by_role("button", name="Settings").click()
        await page.get_by_role("button", name="Dark").click()
        await page.get_by_role("button", name="Home").click()

        # Wait for the dark mode to be applied
        await expect(page.locator("html")).to_have_class("dark")

        # Take a screenshot of the dark mode
        await page.screenshot(path="dark-mode.png")

        await browser.close()

asyncio.run(main())
