import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";

const AUTH_FILE = ".auth/salesforce.json";

/**
 * 한 번 로그인해서 세션을 저장하고, 나머지 Salesforce 테스트는 저장한 세션으로 바로 시작한다.
 * 계정 정보는 환경 변수로만 받는다. 저장소에는 절대 넣지 않는다 (.auth/ 는 .gitignore).
 */
setup("log in to Salesforce", async ({ page }) => {
    const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD } = process.env;
    if (!SF_LOGIN_URL || !SF_USERNAME || !SF_PASSWORD) {
        fs.mkdirSync(".auth", { recursive: true });
        fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
        setup.skip(true, "Salesforce credentials are not set.");
        return;
    }
    await page.goto(SF_LOGIN_URL);
    await page.locator("#username").fill(SF_USERNAME);
    await page.locator("#password").fill(SF_PASSWORD);
    await page.locator("#Login").click();
    await expect(page.locator("one-appnav, .slds-global-header")).toBeVisible({ timeout: 60_000 });
    await page.context().storageState({ path: AUTH_FILE });
});