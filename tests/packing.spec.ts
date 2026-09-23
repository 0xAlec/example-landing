import { test, expect } from "@playwright/test";
import { samplePlanner, STORAGE_KEY } from "../lib/trips";

async function add(page: import("@playwright/test").Page, title: string) {
  await page.getByLabel("Item to pack").fill(title);
  await page.getByRole("button", { name: "Add packing item", exact: true }).click();
}

test("packing operations persist and stay separate for each trip", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.getByText("Saved on this device")).toBeVisible();
  await add(page, "   ");
  await expect(page.locator(".packing-row")).toHaveCount(0);
  await add(page, "  Camera  ");
  await add(page, "Charger");
  await page.getByRole("checkbox", { name: "Camera", exact: true }).check();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Camera", exact: true })).toBeChecked();
  await page.getByRole("checkbox", { name: "Camera", exact: true }).uncheck();
  await page.getByRole("button", { name: "Remove packing item: Charger", exact: true }).click();
  await page.getByRole("button", { name: "New trip", exact: true }).click();
  await page.getByLabel("Trip name").fill("Kyoto visit");
  await page.getByLabel("Destination", { exact: true }).fill("Kyoto");
  await page.getByLabel("First day").fill("2026-12-31");
  await page.getByRole("button", { name: "Create trip", exact: true }).click();
  await expect(page.locator(".packing-row")).toHaveCount(0);
  await add(page, "Passport");
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Passport", exact: true })).not.toBeChecked();
  await page.getByRole("navigation", { name: "Your trips" }).getByRole("button", { name: /Lisbon/ }).click();
  await expect(page.locator(".packing-row")).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: "Camera", exact: true })).not.toBeChecked();
  await page.reload();
  await expect(page.locator(".packing-row")).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: "Camera", exact: true })).not.toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("packing.png"), fullPage: true });
});

test("legacy storage is unchanged on load and preserved when adding packing items", async ({ page }) => {
  const legacy = samplePlanner();
  legacy.trips[0].notes = "Personal booking";
  const raw = JSON.stringify(legacy);
  await page.addInitScript(({ raw, key }) => {
    if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
  }, { raw, key: STORAGE_KEY });
  await page.goto("/");
  await expect(page.getByText("Saved on this device")).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(raw);
  await add(page, "Camera");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).trips[0].packingList?.length, STORAGE_KEY)).toBe(1);
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  delete stored.trips[0].packingList;
  expect(stored).toEqual(legacy);
});

// Scope storage alerts to the planner; Next.js also creates a route alert.
for (const raw of ["", "{broken", JSON.stringify({ ...samplePlanner(), trips: [{ ...samplePlanner().trips[0], packingList: null }] })]) {
  test(`invalid storage stays intact: ${raw.slice(0, 20) || "empty"}`, async ({ page }) => {
    await page.addInitScript(({ raw, key }) => localStorage.setItem(key, raw), { raw, key: STORAGE_KEY });
    await page.goto("/");
    await expect(page.getByRole("main").getByRole("alert")).toContainText("existing data has not been changed");
    await add(page, "Camera");
    await page.getByRole("checkbox", { name: "Camera", exact: true }).check();
    await page.getByRole("button", { name: "Remove packing item: Camera", exact: true }).click();
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(raw);
  });
}

test("unreadable storage never attempts a write", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Read blocked"); };
    Storage.prototype.setItem = () => {
      document.documentElement.dataset.storageWriteAttempted = "true";
      throw new Error("Unexpected write");
    };
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("existing data has not been changed");
  await add(page, "Camera");
  await expect(page.getByRole("checkbox", { name: "Camera", exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("only last for this session");
  expect(await page.locator("html").getAttribute("data-storage-write-attempted")).toBeNull();
  expect(errors).toEqual([]);
});

test("write failures and changes from another window stay visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Saved on this device")).toBeVisible();
  const raw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Quota exceeded"); }; });
  await add(page, "Camera");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not save");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(raw);
  await page.reload();
  await expect(page.getByText("Saved on this device")).toBeVisible();
  await page.evaluate((key) => localStorage.setItem(key, "external change"), STORAGE_KEY);
  await add(page, "Passport");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("changed in another window");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe("external change");
});
