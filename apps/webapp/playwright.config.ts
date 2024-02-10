import { defineConfig, devices } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
import path from "path";

dotenvConfig();

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT ?? 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 10000,
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Run tests in files in parallel */
    fullyParallel: false,
    // Timeout per test
    timeout: 30 * 1000,
    // Test directory
    testDir: path.join(__dirname, "tests"),
    // Artifacts folder where screenshots, videos, and traces are stored.
    outputDir: "test-results/",
    // Run your local dev server before starting the tests:
    // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
    webServer: {
        command: "pnpm start",
        url: baseURL,
        timeout: 60 * 1000,
        reuseExistingServer: !process.env.CI,
    },
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL,
        trace: "retain-on-failure",
        screenshot: "only-on-failure", // Capture screenshot after each test failure.
    },
    /* Configure projects for major browsers */
    projects: [{ name: "firefox", use: { ...devices["Desktop Firefox"] } }],
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "list",
});
