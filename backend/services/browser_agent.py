from playwright.sync_api import sync_playwright

def open_google():

    with sync_playwright() as p:

        browser=p.chromium.launch()

        page=browser.new_page()

        page.goto(
            "https://google.com"
        )

        page.screenshot(
            path="screen.png"
        )

def browser_agent_run():
    print("[Browser Agent] Initializing Playwright and navigating target web content.")
    try:
        open_google()
        return "Browser action completed successfully."
    except Exception as e:
        print(f"[Browser Agent Error] {e}")
        return f"Browser operation halted: {e}"
