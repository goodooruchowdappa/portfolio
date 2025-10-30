from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()

    # Desktop
    page = browser.new_page()
    page.set_viewport_size({"width": 1280, "height": 800})
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/desktop_before_click.png")
    page.get_by_test_id("desktop-filter-button").click()
    page.screenshot(path="jules-scratch/verification/desktop_after_click.png")

    # Mobile
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/mobile_before_click.png")
    page.get_by_role("button", name="Filters").click()
    page.screenshot(path="jules-scratch/verification/mobile_after_click.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
