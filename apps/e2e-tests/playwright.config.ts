import { workspaceRoot } from "@nx/devkit";
import { nxE2EPreset } from "@nx/playwright/preset";
import { defineConfig, devices } from "@playwright/test";

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env["BASE_URL"] || "http://localhost:3000";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    ...nxE2EPreset(__filename, { testDir: "src" }),
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 10000,
    },
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        screenshot: "only-on-failure", // Capture screenshot after each test failure.
    },
    fullyParallel: false,
    /* Run your local dev server before starting the tests */
    webServer: {
        command: "pnpm run start",
        url: "http://localhost:3000",
        timeout: 300 * 1000,
        reuseExistingServer: !process.env.CI,
        cwd: workspaceRoot,
    },
    /* Opt out of parallel tests on CI. */
    workers: 1,
    timeout: 30 * 1000,
    projects: [{ name: "firefox", use: { ...devices["Desktop Firefox"] } }],
    reporter: "list",
    outputDir: "test-results/",
});
