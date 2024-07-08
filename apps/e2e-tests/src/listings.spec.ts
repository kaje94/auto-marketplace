import { expect, Page, test } from "@playwright/test";
import { newListingItem } from "./constants";
import {
    formInputText,
    formSelectAutocomplete,
    formSelectOption,
    formTagSelectOptions,
    formTextareaText,
    formUploadImage,
    login,
    numberWithCommas,
    unCamelCase,
    updateIncompleteProfile,
} from "./util";

test.describe.configure({ mode: "serial", retries: process.env.CI ? 2 : 0 });

test.describe("create and manage listing", () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        await cleanupMyAdverts(page);
        await page.close();
    });

    // eslint-disable-next-line playwright/expect-expect
    test("login", async () => {
        await login(page);
    });

    // eslint-disable-next-line playwright/expect-expect
    test("cleanup my existing listings", async () => {
        await cleanupMyAdverts(page);
    });

    test("create a new listing", async () => {
        await page.getByRole("button", { name: "Post your Advert" }).click();
        await expect(page).toHaveTitle(/Create a New Listing/);
        await updateIncompleteProfile(page);
        await expect(page.locator(`select[name="vehicle.type"]`)).toBeEnabled();
        await formUploadImage(page, newListingItem.image);
        await formSelectOption(page, "vehicle.type", newListingItem.type);
        await formSelectAutocomplete(page, "vehicle.brand", newListingItem.brand);
        await formInputText(page, "vehicle.model", newListingItem.model);
        await formInputText(page, "vehicle.trim", newListingItem.trim);
        await formSelectAutocomplete(page, "vehicle.yearOfManufacture", newListingItem.yearOfManufacture);
        await formSelectAutocomplete(page, "vehicle.yearOfRegistration", newListingItem.yearOfRegistration);
        await formInputText(page, "vehicle.millage.distance", newListingItem.millage);
        await formSelectOption(page, "vehicle.condition", newListingItem.condition);
        await formSelectOption(page, "vehicle.transmission", newListingItem.transmission);
        await formSelectOption(page, "vehicle.fuelType", newListingItem.fuelType);
        await formInputText(page, "vehicle.engineCapacity", newListingItem.engineCapacity);
        await formTextareaText(page, "description", newListingItem.description);
        await formInputText(page, "price.amount", newListingItem.price);
        await page.locator("label").filter({ hasText: "Is the price negotiable?" }).click();
        await formTagSelectOptions(page, newListingItem.features);
        await page.waitForTimeout(500);
        const formFieldErrors = await page.locator('[data-testid^="form-field-error-"]').all();
        expect(formFieldErrors.length).toBe(0);
        await page.getByRole("button", { name: "Create" }).click();
        await expect(page).toHaveTitle(/My Advert Details/, { timeout: 30000 });
    });

    test("verify dashboard listing details page", async () => {
        await expect(page).toHaveTitle(/My Advert Details/, { timeout: 20000 });
        await expect(page.getByRole("heading", { name: "Under Review" })).toBeVisible();
        await verifyCreatedListingDetails(page);
    });

    test("approve new listing", async () => {
        await page.getByRole("button", { name: "Review", exact: true }).click();
        await page.getByRole("button", { name: "Submit Review" }).click();
        await expect(page.getByRole("heading", { name: "Posted" })).toBeVisible();
    });

    test("view posted listing details page", async () => {
        await page.getByRole("button", { name: "View", exact: true }).click();
        await expect(page).toHaveTitle(new RegExp(`.*${newListingItem.trim}.*`));
        await expect(page.getByRole("link", { name: `Email: ${process.env.TEST_ADMIN_EMAIL}` })).toBeVisible();
        await verifyCreatedListingDetails(page);
    });

    test("view and filter my list", async () => {
        await page.goto("/lk/dashboard/my-listings", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveTitle(/My Adverts/);
        await expect(page.getByText(newListingItem.model)).toBeVisible();
        await page.getByTestId("dashboard-filter").click();
        await page.locator("form[test-id='dashboard-filter']").locator('select[name="status"]').selectOption("Declined");
        await page.getByRole("button", { name: "Apply Filters" }).click({ force: true });
        await expect(page.getByText(newListingItem.model)).not.toBeVisible({ timeout: 15000 });

        await page.getByLabel("Filters Applied").click();
        await page.getByRole("button", { name: "Reset Applied Filters" }).click({ force: true });
        await expect(page.getByLabel("Filters Applied")).toBeHidden();
        await expect(page.getByText(newListingItem.model)).toBeVisible();
    });

    test("view and filter all list", async () => {
        await page.goto("/lk/dashboard/listings", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveTitle(/Manage Listing Adverts/);
        await page.getByTestId("dashboard-filter").click();
        await formInputText(page, "model", "some random value");
        await page.getByRole("button", { name: "Apply Filters" }).click();
        await expect(page.getByText(newListingItem.model)).toBeHidden();
        await page.getByTestId("dashboard-filter").click();
        await formInputText(page, "model", newListingItem.model);
        await page.getByRole("button", { name: "Apply Filters" }).click();
        await expect(page.getByText(newListingItem.model)).toBeVisible();
        await page.getByTestId("dashboard-filter").click();
        await formSelectOption(page, "fuelType", "Diesel");
        await page.getByRole("button", { name: "Apply Filters" }).click();
        await expect(page.getByText(newListingItem.model)).toBeHidden();
        await page.getByLabel("Filters Applied").click();
        await page.getByRole("button", { name: "Reset Applied Filters" }).click();
        await expect(page.getByLabel("Filters Applied")).toBeHidden();
        await expect(page.getByText(newListingItem.model)).toBeVisible();
    });

    // eslint-disable-next-line playwright/expect-expect
    test("revalidate posted listing list cache", async () => {
        await page.goto("/lk/dashboard/cache-manage", { waitUntil: "domcontentloaded" });
        await page.getByRole("button", { name: "Revalidate posted listings by country" }).click();
        await page.getByRole("button", { name: "Proceed" }).first().click();
    });

    test("search & view newly posted listing", async () => {
        await page.goto("/lk", { waitUntil: "domcontentloaded" });
        await formInputText(page, "query", newListingItem.brand);
        await formSelectOption(page, "vehicleType", "Van");
        await page.getByRole("link", { name: "Search" }).click({ force: true });
        await expect(page.getByRole("button", { name: "Filters Applied" })).toBeVisible({ timeout: 20000 });
        await expect(page.getByText(`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`)).toBeHidden();
        await page.getByRole("button", { name: "Filters Applied" }).click();
        await formSelectOption(page, "condition", "Registered");
        await page.getByRole("link", { name: "Search" }).click();
        await expect(page.getByText(`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`)).toBeHidden();
        await page.getByRole("button", { name: "Filters" }).click();
        await page.getByRole("button", { name: "Reset Applied Filters" }).click();
        await expect(page.getByText(`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`)).toBeVisible({ timeout: 20000 });
        await page.getByRole("button", { name: "Filters" }).click();
        await formSelectOption(page, "fuelType", "Diesel");
        await page.getByRole("button", { name: "Apply Filters" }).click();
        await expect(page.getByText(`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`)).toBeHidden();
        await page.getByRole("button", { name: "Filters" }).click();
        await formSelectOption(page, "fuelType", "Petrol");
        await page.getByRole("button", { name: "Apply Filters" }).click();
        await expect(page.getByText(`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`)).toBeVisible();
        await page.getByText(`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`).click();

        await expect(page).toHaveTitle(new RegExp(`.*${`${newListingItem.brand} ${newListingItem.model} ${newListingItem.trim}`}.*`));
        await verifyCreatedListingDetails(page);
    });

    test("view related adverts", async () => {
        await page.getByText("View More").click();
        await expect(page.getByRole("button", { name: "Filters" })).toBeVisible();
        const url = page.url();
        expect(url).toContain(newListingItem.brand);
        expect(url).toContain(newListingItem.type);
    });

    test("update & delete listing", async () => {
        await page.goto("/lk/dashboard/my-listings", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveTitle(/My Adverts/);
        await page.getByText(newListingItem.model).click();
        await expect(page).toHaveTitle(/My Advert Details/);
        await page.getByRole("button", { name: "Edit" }).first().click();
        await formInputText(page, "vehicle.model", `${newListingItem.model} updated`);
        await page.getByTestId("listing-form-submit-btn").click();
        await expect(page).toHaveTitle(/My Advert Details/);
        await expect(page.getByText(`${newListingItem.model} updated`).first()).toBeVisible();
        await page.getByRole("button", { name: "Delete" }).first().click();
        await page.getByTestId("confirm-delete-btn").click();
        await expect(page).toHaveTitle(/My Adverts/);
    });
});

const verifyCreatedListingDetails = async (page: Page) => {
    await expect(page.getByText(`Trim / Edition${newListingItem.trim}`)).toBeVisible();
    await expect(page.getByText(`Manufactured Year${newListingItem.yearOfManufacture}`)).toBeVisible();
    await expect(page.getByText(`Registered Year${newListingItem.yearOfRegistration}`)).toBeVisible();
    await expect(page.getByText(`Condition${unCamelCase(newListingItem.condition)}`)).toBeVisible();
    await expect(page.getByText(`Transmission${newListingItem.transmission}`)).toBeVisible();
    await expect(page.getByText(`Fuel Type${newListingItem.fuelType}`)).toBeVisible();
    await expect(page.getByText(`Engine Capacity${numberWithCommas(newListingItem?.engineCapacity)} CC`)).toBeVisible();
    await expect(page.getByText(`Listing description`)).toBeVisible();
    for (const feature of newListingItem.features) {
        await expect(page.getByText(feature)).toBeVisible();
    }
};

const cleanupMyAdverts = async (page: Page) => {
    await page.goto("/lk/dashboard/my-listings", { waitUntil: "domcontentloaded" });
    while (true) {
        await expect(page).toHaveTitle(/My Adverts/, { timeout: 20000 });
        await expect(page.getByText("results found")).toBeVisible({ timeout: 20000 });
        const allItemsCount = await page.getByTestId("dashboard-listing-item").count();
        if (allItemsCount > 0) {
            await page.getByTestId("context-menu").first().click();
            await page.getByTestId("context-menu-Delete").first().click();
            await page.getByTestId("confirm-delete-btn").click();
            if (allItemsCount === 1) {
                break;
            }
            await page.waitForTimeout(3000);
        } else {
            break;
        }
    }
};
