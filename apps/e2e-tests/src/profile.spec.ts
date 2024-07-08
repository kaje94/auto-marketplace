import { expect, Page, test } from "@playwright/test";
import { login, updateProfileForm } from "./util";

test.describe.configure({ mode: "serial", retries: process.env.CI ? 2 : 0 });

test.describe("update profile", () => {
    let page: Page;
    const newPostalCode = Math.round(Math.random() * (5000 - 1000) + 1000).toString();

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        await page.close();
    });

    // eslint-disable-next-line playwright/expect-expect
    test("login", async () => {
        await login(page);
    });

    test("view profile", async () => {
        await page.goto("/lk/dashboard/profile", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveTitle(/My Profile/, { timeout: 20000 });
        await expect(page.getByText(process.env.TEST_ADMIN_EMAIL!).first()).toBeVisible();
    });

    test("update profile", async () => {
        await page.getByRole("button", { name: "Update Profile" }).first().click();
        await expect(page).toHaveTitle(/Update Profile/, { timeout: 20000 });
        await updateProfileForm(page, newPostalCode);
    });
    test("verify updated profile", async () => {
        await expect(page).toHaveTitle(/My Profile/, { timeout: 20000 });
        await expect(page.getByText(`Postal Code${newPostalCode}`)).toBeVisible();
    });
});
