import { test, expect } from "@playwright/test";

/**
 * 포트폴리오 사이트 회귀 테스트. 계획: plans/site.plan.md
 */
test.describe("portfolio site", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("shows the headline and core skills", async ({ page }) => {
        await expect(page).toHaveTitle(/Salesforce & Web Developer/);
        await expect(page.getByRole("heading", { level: 1 })).toContainText("Salesforce");
        await expect(page.locator(".stats .stat")).toHaveCount(4);
    });

    test("navigation jumps to each section", async ({ page }) => {
        for (const [link, section] of [
            ["About", "#about"],
            ["Work", "#projects"],
            ["Contact", "#contact"]
        ]) {
            await page.getByRole("navigation").getByRole("link", { name: link, exact: true }).click();
            await expect(page).toHaveURL(new RegExp(`${section}$`));
            await expect(page.locator(section)).toBeInViewport();
        }
    });

    test("project filter hides cards from other categories", async ({ page }) => {
        const cards = page.locator("#projects details.card");
        const total = await cards.count();
        expect(total).toBeGreaterThan(3);

        await page.locator(".filters").getByRole("button", { name: "AI" }).click();
        const visibleAi = await page.locator("#projects details.card:not(.hidden)").count();
        expect(visibleAi).toBeGreaterThan(0);
        expect(visibleAi).toBeLessThan(total);

        await page.locator(".filters").getByRole("button", { name: "전체" }).click();
        await expect(page.locator("#projects details.card:not(.hidden)")).toHaveCount(total);
    });

    test("project cards expand and link to their repositories", async ({ page }) => {
        const card = page.locator("#projects details.card").first();
        await card.locator("summary").click();
        await expect(card).toHaveAttribute("open", "");
        await expect(card.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", /github\.com\/leeyongha2006\//);
    });

    test("contact links are usable", async ({ page }) => {
        const contact = page.locator("#contact");
        await expect(contact.getByRole("link", { name: /Email/ })).toHaveAttribute("href", /^mailto:/);
        await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/leeyongha2006");
    });
});