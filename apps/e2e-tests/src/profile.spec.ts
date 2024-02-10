import { expect, Page, test } from "@playwright/test";
import { formInputText, login } from "./util";

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

    test("login", async () => {
        await login(page);
    });

    test("view profile", async () => {
        await page.goto("/LK/dashboard/profile");
        await expect(page).toHaveTitle(/My Profile/, { timeout: 20000 });
        await expect(page.getByText(process.env.TEST_ADMIN_EMAIL!).first()).toBeVisible();
    });

    test("update profile", async () => {
        await page.getByRole("button", { name: "Update Profile" }).click();
        await expect(page).toHaveTitle(/Update Profile/, { timeout: 20000 });
        formInputText(page, "address.postalCode", newPostalCode);
        page.getByRole("button", { name: "Update" }).click();
    });
    test("verify updated profile", async () => {
        await expect(page).toHaveTitle(/My Profile/, { timeout: 20000 });
        await expect(page.getByText(`Postal Code${newPostalCode}`)).toBeVisible();
    });
});
