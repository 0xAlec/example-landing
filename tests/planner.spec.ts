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
    page.getByRole("heading", { name: "A long weekend in Lisbon" }),
  ).toBeVisible();
  await expect(page.locator(".activity-card")).toHaveCount(4);
  await page
    .locator(".trip-banner img")
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
  await page.getByLabel("A note for later").fill("Bring the paperback.");
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
    page.getByRole("button", { name: "Been there, loved that" }),
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
  await page.getByRole("button", { name: "Plan a new trip" }).click();
  await page.getByLabel("Trip name").fill("Kyoto for New Year");
  await page.getByLabel("Destination", { exact: true }).fill("Kyoto, Japan");
  await page.getByLabel("First day").fill("2026-12-31");
  await page.getByLabel("Number of days").fill("2");
  await page.getByRole("button", { name: "Create trip", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kyoto for New Year" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "See where the day takes you" }),
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
    page.getByRole("heading", { name: "A long weekend in Lisbon" }),
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
  await page
    .getByLabel("Import trips", { exact: true })
    .setInputFiles({
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
