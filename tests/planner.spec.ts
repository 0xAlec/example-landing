import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
const key = "roam.trips.v1";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("status").filter({ hasText: "Saved on this device" }),
  ).toBeVisible();
});
test("sample trip, image, tabs, checklist, and notes persist", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await expect(
    page.getByRole("heading", { name: "Lisbon weekend" }),
  ).toBeVisible();
  await expect(page.locator(".activity-card")).toHaveCount(4);
  await page
    .locator(".trip-thumbnail")
    .evaluate((image: HTMLImageElement) => image.decode());
  await expect(
    page.getByRole("button", { name: "Previous day" }),
  ).toBeDisabled();
  await page.getByRole("checkbox", { name: "Save travel tickets" }).check();
  await page.getByRole("button", { name: "Notes", exact: true }).click();
  await page
    .getByLabel("Trip notes", { exact: true })
    .fill("Train booking: sample-123. Remember the camera.");
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Save travel tickets" }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Notes", exact: true }).click();
  await expect(page.getByLabel("Trip notes", { exact: true })).toHaveValue(
    "Train booking: sample-123. Remember the camera.",
  );
  await page.getByRole("button", { name: "Itinerary", exact: true }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("itinerary.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("add, visit, edit, move, delete, and restore an activity", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add activity", exact: true }).click();
  await page.getByLabel("Activity name").fill("Tea & a book");
  await page.getByLabel("Day", { exact: true }).selectOption("1");
  await page.getByLabel("Time", { exact: true }).fill("08:15");
  await page.getByLabel("Place or neighborhood").fill("A sunny café");
  await page.getByLabel("Notes").fill("Bring the paperback.");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add activity", exact: true })
    .click();
  await expect(page.locator(".activity-card").first()).toContainText(
    "Tea & a book",
  );
  await page
    .locator(".activity-card")
    .filter({ hasText: "Tea & a book" })
    .getByRole("button", { name: "Mark as visited" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Visited", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Edit Tea & a book", exact: true })
    .click();
  await page.getByLabel("Activity name").fill("Tea and two books");
  await page.getByLabel("Day", { exact: true }).selectOption("2");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tea and two books" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit Tea and two books" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tea and two books" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tea and two books" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Tea and two books" }),
  ).toBeVisible();
});
test("new trips and saved places remain independent", async ({
  page,
}, info) => {
  await page.getByRole("button", { name: "New trip" }).click();
  await page.getByLabel("Trip name").fill("Kyoto for New Year");
  await page.getByLabel("Destination", { exact: true }).fill("Kyoto, Japan");
  await page.getByLabel("First day").fill("2026-12-31");
  await page.getByLabel("Number of days").fill("2");
  await page.getByRole("button", { name: "Create trip", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kyoto for New Year" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "No activities yet" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Saved places", exact: false })
    .click();
  await page.getByRole("button", { name: "Save a place", exact: true }).click();
  await page.getByLabel("Place name").fill("A quiet garden");
  await page.getByLabel("Neighborhood or address").fill("Higashiyama");
  await page.getByRole("button", { name: "Save place", exact: true }).click();
  await page.getByLabel("Search saved places").fill("no match");
  await expect(
    page.getByRole("heading", { name: "No places found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: "Add to itinerary" }).click();
  await page.getByLabel("Day", { exact: true }).selectOption("1");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add activity", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Daily itinerary" })
      .getByRole("heading", { name: "A quiet garden" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Next day" })).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("new-trip.png"),
    fullPage: true,
  });
  await page
    .getByRole("navigation", { name: "Your trips" })
    .getByRole("button", { name: /Lisbon/ })
    .click();
  await expect(page.locator(".activity-card")).toHaveCount(4);
  await expect(
    page
      .getByRole("region", { name: "Daily itinerary" })
      .getByRole("heading", { name: "A quiet garden" }),
  ).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Your trips" })
    .getByRole("button", { name: /Kyoto/ })
    .click();
  await page.getByRole("button", { name: "Edit trip", exact: true }).click();
  await page.getByRole("button", { name: "Delete trip", exact: true }).click();
  await page.getByRole("button", { name: "Keep trip" }).click();
  await expect(
    page.getByRole("heading", { name: "Kyoto for New Year" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit trip", exact: true }).click();
  await page.getByRole("button", { name: "Delete trip", exact: true }).click();
  await page.getByRole("button", { name: "Delete trip", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Lisbon weekend" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("navigation", { name: "Your trips" }).getByRole("button"),
  ).toHaveCount(1);
});
test("export can be imported without losing existing trips", async ({
  page,
}) => {
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export trips" }).click();
  const download = await downloadEvent;
  const bytes = await readFile((await download.path())!);
  expect(JSON.parse(bytes.toString()).trips[0].destination).toBe(
    "Lisbon, Portugal",
  );
  await page.getByLabel("Import trips", { exact: true }).setInputFiles({
    name: "roam-trips.json",
    mimeType: "application/json",
    buffer: bytes,
  });
  await expect(
    page.getByRole("navigation", { name: "Your trips" }).getByRole("button"),
  ).toHaveCount(2);
  await page.reload();
  await expect(
    page.getByRole("navigation", { name: "Your trips" }).getByRole("button"),
  ).toHaveCount(2);
});
test("invalid saved data is kept intact instead of silently overwritten", async ({
  page,
}) => {
  await page.evaluate((key) => localStorage.setItem(key, "{broken-data"), key);
  await page.reload();
  await expect(
    page.getByRole("alert").filter({ hasText: "Saved trips" }),
  ).toContainText("existing data has not been changed");
  await page.getByRole("button", { name: "Notes", exact: true }).click();
  await page
    .getByLabel("Trip notes", { exact: true })
    .fill("Only in this session");
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
    "{broken-data",
  );
});
test("dialog supports Escape and browser validation", async ({ page }) => {
  const add = page.getByRole("button", { name: "Add activity", exact: true });
  await add.click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Add activity", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page
      .getByLabel("Activity name")
      .evaluate((input: HTMLInputElement) => input.validity.valueMissing),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(add).toBeFocused();
});

async function setBudget(page: import("@playwright/test").Page, value: string) {
  await page.getByRole("button", { name: /^(Set|Edit) budget$/ }).click();
  await page.getByLabel(/Budget for day/).fill(value);
  await page.getByRole("button", { name: "Save budget", exact: true }).click();
}
async function setCost(page: import("@playwright/test").Page, title: string, value: string, day?: string) {
  await page.getByRole("button", { name: `Edit ${title}`, exact: true }).click();
  await page.getByLabel("Planned cost", { exact: true }).fill(value);
  if (day !== undefined) await page.getByLabel("Day", { exact: true }).selectOption(day);
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
}

test("daily budget follows costs, visits, moves, deletion, undo, and reload", async ({ page }, info) => {
  const summary = page.getByRole("region", { name: "Daily budget", exact: true });
  await expect(summary).toContainText("No budget set");
  await expect(summary).toContainText("4 activities have no planned cost");
  await setBudget(page, "50.50");
  await setCost(page, "Coffee & pastéis", "10.25");
  await setCost(page, "Walk through Alfama", "0");
  await expect(summary).toContainText("40.25 remaining");
  await page.locator(".activity-card").first().getByRole("button", { name: "Mark as visited" }).click();
  await expect(summary).toContainText("Planned 10.25 / 50.50 budget");
  await page.reload();
  await expect(summary).toContainText("40.25 remaining");
  await page.screenshot({ path: info.outputPath("daily-budget.png"), fullPage: true });
  await setCost(page, "Coffee & pastéis", "60.75");
  await expect(summary).toContainText("10.25 over budget");
  await setCost(page, "Coffee & pastéis", "60.75", "1");
  await expect(summary).toContainText("Planned 60.75 · No budget set");
  await setBudget(page, "0");
  await expect(summary).toContainText("60.75 over budget");
  await page.getByRole("button", { name: "Edit Coffee & pastéis", exact: true }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(summary).toContainText("Planned 0.00 / 0.00 budget");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(summary).toContainText("60.75 over budget");
  await setCost(page, "Coffee & pastéis", "");
  await expect(summary).toContainText("3 activities have no planned cost");
  await setBudget(page, "");
  await page.reload();
  await expect(summary).toContainText("No budget set");
  await page.getByRole("button", { name: "Previous day" }).click();
  await expect(summary).toContainText("Planned 0.00 / 50.50 budget");
});

test("budget validation and cancel preserve existing values", async ({ page }) => {
  await setBudget(page, "20");
  await page.getByRole("button", { name: "Edit budget", exact: true }).click();
  const input = page.getByLabel("Budget for day 1", { exact: true });
  for (const invalid of ["-1", "1.001", "1000000"]) {
    await input.fill(invalid);
    await page.getByRole("button", { name: "Save budget", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(await input.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  }
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("region", { name: "Daily budget", exact: true })).toContainText("20.00 budget");
  await page.getByRole("button", { name: "Edit Coffee & pastéis", exact: true }).click();
  await page.getByLabel("Planned cost", { exact: true }).fill("-2");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("region", { name: "Daily budget", exact: true })).toContainText("Planned 0.00");
});

test("budget legacy load and export/import preserve data and trip independence", async ({ page }) => {
  const legacy = await page.evaluate(key => localStorage.getItem(key)!, key);
  await page.reload();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(legacy);
  await setBudget(page, "80");
  await setCost(page, "Coffee & pastéis", "12.34");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export trips" }).click();
  const bytes = await readFile((await (await downloadEvent).path())!);
  const exported = JSON.parse(bytes.toString());
  expect(exported.trips[0].dailyBudgetsCents).toEqual({ 0: 8000 });
  expect(exported.trips[0].activities[0].plannedCostCents).toBe(1234);
  await page.getByLabel("Import trips", { exact: true }).setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: bytes });
  await setBudget(page, "5");
  await page.getByRole("navigation", { name: "Your trips" }).getByRole("button").first().click();
  await expect(page.getByRole("region", { name: "Daily budget", exact: true })).toContainText("Planned 12.34 / 80.00 budget");
  await page.reload();
  const saved = JSON.parse(await page.evaluate(key => localStorage.getItem(key)!, key));
  expect(saved.trips[0]).toEqual(exported.trips[0]);
  expect(saved.trips[1].dailyBudgetsCents).toEqual({ 0: 500 });
  expect(saved.trips[0].notes).toBe(JSON.parse(legacy).trips[0].notes);
});

test("budget malformed storage and imports never replace existing data", async ({ page }) => {
  const original = await page.evaluate(key => localStorage.getItem(key)!, key);
  const invalid = JSON.parse(original);
  invalid.trips[0].dailyBudgetsCents = { 0: -1 };
  const raw = JSON.stringify(invalid);
  await page.getByLabel("Import trips", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(raw) });
  await expect(page.getByRole("status").filter({ hasText: "could not be imported" })).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(original);
  for (const damaged of [raw, ""]) {
    await page.evaluate(({ key, damaged }) => localStorage.setItem(key, damaged), { key, damaged });
    await page.reload();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("existing data has not been changed");
    await setBudget(page, "100");
    expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(damaged);
  }
});

test("budget storage conflicts and write failures stay visible", async ({ page }) => {
  const raw = await page.evaluate(key => localStorage.getItem(key)!, key);
  const other = JSON.parse(raw);
  other.trips[0].notes = "Changed in another tab";
  const changed = JSON.stringify(other);
  await page.evaluate(({ key, changed }) => localStorage.setItem(key, changed), { key, changed });
  await setBudget(page, "30");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("changed in another tab");
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(changed);
  await page.reload();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException("Quota exceeded", "QuotaExceededError"); }; });
  await setBudget(page, "40");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("could not save these changes");
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(changed);
});
