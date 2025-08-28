from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:5173")

        # Set a daily goal
        goal_input = page.locator('input[type="number"].goal-input')
        goal_input.fill("2000")

        # Add water intake
        custom_amount_input = page.locator('input[placeholder="Enter amount in ml"]')
        custom_amount_input.fill("4000")
        page.get_by_role("button", name="Add").click()

        # Wait for the text to be updated
        expect(page.get_by_text("200%")).to_be_visible()

        # Take a screenshot of the daily intake card
        daily_intake_card = page.locator(".bg-white.rounded-2xl.shadow-xl")
        daily_intake_card.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
