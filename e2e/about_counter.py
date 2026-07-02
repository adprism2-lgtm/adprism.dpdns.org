"""End-to-end test: About section animated counters + labels.

Scrolls to the #about section on both mobile and desktop viewports and
verifies each stat counter animates up to its expected final value while
the labels render with the correct uppercase text and line breaks.

Run against the dev server:
    python3 e2e/about_counter.py            # defaults to http://localhost:8080
    BASE_URL=http://localhost:8080 python3 e2e/about_counter.py

Requires Playwright (Chromium). Exits non-zero on any assertion failure.
"""
import asyncio
import os
import sys
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")

# Expected final counter text (after animation) and label text.
EXPECTED = [
    {"value": "13+", "label": "YEARS BEHIND\nTHE LENS"},
    {"value": "300+", "label": "PROJECTS\nDELIVERED"},
    {"value": "60+", "label": "HAPPY BRANDS & CLIENTS"},
]

VIEWPORTS = [
    ("desktop", {"width": 1280, "height": 1800}),
    ("mobile", {"width": 390, "height": 1800}),
]


async def check(page, name):
    await page.goto(BASE_URL, wait_until="domcontentloaded")
    await page.locator("#about").scroll_into_view_if_needed()

    stats = page.locator("#about .grid.grid-cols-3 > div")
    await stats.first.wait_for(state="visible")
    count = await stats.count()
    assert count == len(EXPECTED), f"[{name}] expected {len(EXPECTED)} stats, got {count}"

    for i, exp in enumerate(EXPECTED):
        stat = stats.nth(i)
        counter = stat.locator("span[aria-label]")

        # aria-label always exposes the exact final value.
        aria = await counter.get_attribute("aria-label")
        assert aria == exp["value"], f"[{name}] stat {i} aria-label {aria!r} != {exp['value']!r}"

        # Counter animates up to the exact final value.
        await page.wait_for_function(
            "([el, want]) => el.textContent.trim() === want",
            arg=[await counter.element_handle(), exp["value"]],
            timeout=4000,
        )
        final = (await counter.inner_text()).strip()
        assert final == exp["value"], f"[{name}] stat {i} counter {final!r} != {exp['value']!r}"

        # Label matches exactly (uppercase + line breaks preserved).
        label = stat.locator("p").nth(1)
        label_text = await label.text_content()
        assert label_text == exp["label"], f"[{name}] stat {i} label {label_text!r} != {exp['label']!r}"
        assert label_text == label_text.upper(), f"[{name}] stat {i} label not uppercase"

    print(f"[{name}] OK - counters reached final values with correct labels")


async def main():
    failures = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for name, vp in VIEWPORTS:
            ctx = await browser.new_context(viewport=vp)
            page = await ctx.new_page()
            try:
                await check(page, name)
            except AssertionError as e:
                failures.append(str(e))
                print("FAIL:", e)
            finally:
                await ctx.close()
        await browser.close()

    if failures:
        print(f"\n{len(failures)} failure(s)")
        sys.exit(1)
    print("\nAll About counter e2e checks passed")


if __name__ == "__main__":
    asyncio.run(main())
