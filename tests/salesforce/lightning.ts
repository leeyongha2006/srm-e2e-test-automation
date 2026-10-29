import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Lightning 화면에서 반복되는 불안정 요소를 다루는 헬퍼.
 */

/** 스피너가 모두 사라질 때까지 기다린다. */
export async function waitForSpinners(page: Page): Promise<void> {
    await expect(page.locator("lightning-spinner, .slds-spinner_container")).toHaveCount(0, { timeout: 30_000 });
}

/**
 * 그리드는 행을 나눠 그리므로, 행 수가 두 번 연속 같아질 때까지 기다린 뒤 돌려준다.
 * 바로 count() 하면 덜 그려진 상태를 읽어 간헐적으로 실패한다.
 */
export async function stableRowCount(grid: Locator, settleMs = 500): Promise<number> {
    let previous = -1;
    for (let attempt = 0; attempt < 20; attempt++) {
        const current = await grid.getByRole("row").count();
        if (current === previous) {
            return current;
        }
        previous = current;
        await grid.page().waitForTimeout(settleMs);
    }
    return previous;
}

/** 떠 있는 토스트를 모두 닫는다. 토스트가 버튼을 가려 클릭이 빗나가는 문제를 막는다. */
export async function dismissToasts(page: Page): Promise<void> {
    const closeButtons = page.locator(".forceToastMessage button[title='Close'], .slds-notify_toast button.slds-notify__close");
    while ((await closeButtons.count()) > 0) {
        await closeButtons.first().click();
    }
}

/** lightning-combobox 에서 값을 고른다. */
export async function selectCombobox(page: Page, label: string, option: string): Promise<void> {
    await page.getByRole("combobox", { name: label }).click();
    await page.getByRole("option", { name: option, exact: true }).click();
}