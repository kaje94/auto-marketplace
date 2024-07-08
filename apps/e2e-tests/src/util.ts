import { expect, Page } from "@playwright/test";
import path from "path";

export const formSelectOption = async (page: Page, fieldName: string, optionToSelect: string) => {
    await page.locator(`select[name="${fieldName}"]`).selectOption(optionToSelect);
};

export const formSelectAutocomplete = async (page: Page, fieldName: string, optionToSelect: string) => {
    await page.locator(`input[name="${fieldName}"]`).click();
    await page.getByText(optionToSelect).click();
};

export const formInputText = async (page: Page, fieldName: string, text: string) => {
    await page.locator(`input[name="${fieldName}"]`).click();
    await page.locator(`input[name="${fieldName}"]`).fill(text);
};

export const formTextareaText = async (page: Page, fieldName: string, text: string) => {
    await page.locator(`textarea[name="${fieldName}"]`).click();
    await page.locator(`textarea[name="${fieldName}"]`).fill(text);
};

export const formTagSelectOptions = async (page: Page, options: string[]) => {
    for (const option of options) {
        await page.getByText(option, { exact: true }).click();
    }
};

export const formUploadImage = async (page: Page, imageName: string) => {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByTestId("image-upload-dropzone").getByRole("img").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, "sample-images", imageName));
};

export const formSelectDate = async (page: Page, fieldName: string) => {
    await page.locator(`input[name="${fieldName}"]`).click();
    await page.keyboard.press("Enter");
};

export const login = async (page: Page) => {
    expect(process.env.TEST_ADMIN_EMAIL!).toBeTruthy();
    expect(process.env.TEST_ADMIN_PASSWORD!).toBeTruthy();
    await page.goto("/lk/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/Targabay/);
    const profilePicVisible = await page.getByTestId("profile-image").isVisible();
    if (!profilePicVisible) {
        await page.getByRole("link", { name: "Login" }).click();

        await expect(page).toHaveTitle(/Log in/);
        await page.getByLabel("Email address").fill(process.env.TEST_ADMIN_EMAIL!);
        await page.getByLabel("Password").fill(process.env.TEST_ADMIN_PASSWORD!);
        await page.getByRole("button", { name: "Continue", exact: true }).click();

        const acceptButtonVisible = await page.getByRole("button", { name: "Accept" }).isVisible();
        if (acceptButtonVisible) {
            await page.getByRole("button", { name: "Accept" }).click();
        }

        await expect(page).toHaveTitle(/Targabay/);
        // eslint-disable-next-line playwright/no-wait-for-selector
        await page.waitForSelector('img[alt="profile-image"]', { timeout: 30000 });
    }
};

export const numberWithCommas = (x: number | string) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const unCamelCase = (str: string = "") => {
    if (typeof str === "string") {
        return str
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
                return str.toUpperCase();
            })
            ?.trim();
    }
    return str;
};

export const updateIncompleteProfile = async (page: Page) => {
    const isIncompleteProfile = await page.getByText("Incomplete Profile").isVisible();
    if (isIncompleteProfile) {
        await page.getByRole("button", { name: "Update Profile" }).first().click();
        await updateProfileForm(page);
        await expect(page.getByText("Incomplete Profile")).toHaveCount(0);
    }
};

export const updateProfileForm = async (page: Page, newPostalCode = Math.round(Math.random() * (5000 - 1000) + 1000).toString()) => {
    await formSelectAutocomplete(page, "address.state", "Jaffna District");
    await formInputText(page, "address.city", "Jaffna City");
    await formInputText(page, "phoneNumber", "1234567");
    await formInputText(page, "address.postalCode", newPostalCode);
    await page.getByRole("button", { name: "Update" }).last().click();
};
