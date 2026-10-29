import { test, expect } from "@playwright/test";
import { dismissToasts, selectCombobox, stableRowCount, waitForSpinners } from "./lightning";

/**
 * 표준 Account 화면 예제. 계획: plans/account.plan.md
 * 저장 성공은 잠깐 떴다 사라지는 토스트 문구가 아니라, 화면에 남는 실제 값으로 확인한다.
 */
test.describe("account list", () => {
    test.skip(!process.env.SF_LOGIN_URL, "Salesforce credentials are not set.");

    test("list view loads with its columns", async ({ page }) => {
        await page.goto(`${process.env.SF_LOGIN_URL}/lightning/o/Account/list`);
        await waitForSpinners(page);
        const grid = page.getByRole("grid").first();
        await expect(grid.getByRole("columnheader", { name: /Account Name/ })).toBeVisible();
        expect(await stableRowCount(grid)).toBeGreaterThan(0);
    });

    test("new account is saved with the chosen rating", async ({ page }) => {
        const name = `E2E Account ${Date.now()}`;
        await page.goto(`${process.env.SF_LOGIN_URL}/lightning/o/Account/new`);
        const dialog = page.getByRole("dialog");
        await dialog.getByLabel("Account Name").fill(name);
        await selectCombobox(page, "Rating", "Hot");
        await dialog.getByRole("button", { name: "Save", exact: true }).click();

        await dismissToasts(page);
        await waitForSpinners(page);
        await expect(page.locator("lightning-formatted-text").filter({ hasText: name }).first()).toBeVisible();
        await expect(page.locator("records-record-layout-item[field-label='Rating']")).toContainText("Hot");
    });
});