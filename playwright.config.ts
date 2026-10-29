import { defineConfig, devices } from "@playwright/test";

/**
 * 두 묶음의 테스트를 실행한다.
 * - site: 공개된 포트폴리오 사이트. 계정 없이 누구나 실행할 수 있다.
 * - salesforce: Salesforce 화면. SF_LOGIN_URL · SF_USERNAME · SF_PASSWORD 가 있을 때만 로그인 후 실행한다.
 *
 * 로컬에서는 설치된 Edge 를 쓰고(PW_CHANNEL=msedge), CI 에서는 Playwright 의 Chromium 을 쓴다.
 */
const browser = { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL || undefined };

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        trace: "retain-on-failure",
        screenshot: "only-on-failure"
    },
    projects: [
        {
            name: "site",
            testDir: "./tests/site",
            use: { ...browser, baseURL: "https://leeyongha2006.github.io" }
        },
        {
            name: "salesforce-setup",
            testMatch: /auth\.setup\.ts/,
            testDir: "./tests/salesforce",
            use: browser
        },
        {
            name: "salesforce",
            testDir: "./tests/salesforce",
            testIgnore: /auth\.setup\.ts/,
            dependencies: ["salesforce-setup"],
            use: { ...browser, storageState: ".auth/salesforce.json" }
        }
    ]
});