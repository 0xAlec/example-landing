import { refreshSampleCopy } from "./sample-copy.ts";
import assert from "node:assert/strict";
import test from "node:test";
import {
  activitiesForDay,
  dayDate,
  dailyCosts,
  parseAmount,
  formatAmount,
  parsePlanner,
  samplePlanner,
  validDate,
} from "./trips.ts";
test("dates cross month and leap-year boundaries in UTC", () => {
  assert.equal(
    dayDate("2028-02-28", 2).toISOString().slice(0, 10),
    "2028-03-01",
  );
  assert.equal(
    dayDate("2026-12-31", 1).toISOString().slice(0, 10),
    "2027-01-01",
  );
  for (const value of ["2026-02-30", "2026-99-01", "yesterday", ""])
    assert.equal(validDate(value), false);
});
test("saved trips round-trip with notes, visits, and selected day intact", () => {
  const planner = samplePlanner();
  planner.selectedDay = 2;
  planner.trips[0].notes = "Meet at 10";
  planner.trips[0].activities[0].done = true;
  assert.deepEqual(parsePlanner(JSON.stringify(planner)), planner);
});
test("corrupt or unsupported records cannot replace saved data", () => {
  for (const transform of [
    (p: any) => {
      p.version = 9;
    },
    (p: any) => {
      p.trips = [];
    },
    (p: any) => {
      p.selectedDay = 14;
    },
    (p: any) => {
      p.trips[0].activities[0].time = "28:00";
    },
    (p: any) => {
      p.trips[0].activities[0].day = -1;
    },
    (p: any) => {
      p.trips[0].activities[0].done = "yes";
    },
    (p: any) => {
      p.trips[0].places[0].title = "";
    },
    (p: any) => {
      p.trips.push(p.trips[0]);
    },
    (p: any) => {
      p.trips[0].activities.push(p.trips[0].activities[0]);
    },
  ]) {
    const planner = samplePlanner();
    transform(planner);
    assert.throws(() => parsePlanner(JSON.stringify(planner)));
  }
});
test("day view sorts by time without changing saved order or other days", () => {
  const trip = samplePlanner().trips[0];
  trip.activities.reverse();
  const original = trip.activities.map((a) => a.id);
  assert.deepEqual(
    activitiesForDay(trip, 0).map((a) => a.time),
    ["09:00", "10:30", "13:00", "17:30"],
  );
  assert.deepEqual(
    trip.activities.map((a) => a.id),
    original,
  );
});

test("demo copy updates preserve personal text, activity state, and other trips", () => {
  const planner = samplePlanner();
  const trip = planner.trips[0];
  trip.title = "A long weekend in Lisbon";
  trip.activities[0].notes = "My booking number: abc";
  trip.activities[1].title = "Get a little lost in Alfama";
  trip.activities[1].notes =
    "Winding streets, tiled houses, and no particular rush.";
  trip.activities[1].time = "11:45";
  trip.activities[1].done = true;
  trip.activities[2].title = "Lunch with Sam";
  trip.places[0].title = "A little tile hunting";
  trip.notes = "Meet Sam on Thursday.";
  planner.selectedDay = 2;
  const custom = structuredClone(trip);
  custom.id = "my-own-trip";
  planner.trips.push(custom);
  const original = structuredClone(planner);
  const updated = refreshSampleCopy(planner);
  assert.equal(updated.trips[0].title, "Lisbon weekend");
  assert.equal(updated.trips[0].activities[1].title, "Walk through Alfama");
  assert.equal(updated.trips[0].activities[1].notes, "");
  assert.equal(updated.trips[0].activities[1].time, "11:45");
  assert.equal(updated.trips[0].activities[1].done, true);
  assert.equal(updated.trips[0].activities[0].notes, "My booking number: abc");
  assert.equal(updated.trips[0].activities[2].title, "Lunch with Sam");
  assert.equal(updated.trips[0].places[0].title, "Tile shops in Chiado");
  assert.equal(updated.trips[0].notes, "Meet Sam on Thursday.");
  assert.equal(updated.selectedDay, 2);
  assert.deepEqual(updated.trips[1], custom);
  assert.deepEqual(planner, original);
  assert.deepEqual(refreshSampleCopy(updated), updated);
  updated.trips[0].title = "My Lisbon visit";
  assert.equal(refreshSampleCopy(updated).trips[0].title, "My Lisbon visit");
});


test("budget amounts accept zero and cents and reject unsafe values", () => {
  assert.equal(parseAmount(""), undefined);
  assert.equal(parseAmount("0"), 0);
  assert.equal(parseAmount("0.10"), 10);
  assert.equal(parseAmount("12.34"), 1234);
  assert.equal(parseAmount("999999.99"), 99999999);
  assert.equal(formatAmount(1234), "12.34");
  for (const invalid of ["-1", "NaN", "Infinity", "1e3", "1.001", "1000000", " "])
    assert.throws(() => parseAmount(invalid));
});
test("budget totals include visited activities and follow activity moves and deletions", () => {
  const trip = samplePlanner().trips[0];
  const [first, second] = trip.activities;
  first.plannedCostCents = 10;
  second.plannedCostCents = 20;
  second.done = true;
  trip.dailyBudgetsCents = { 0: 30, 1: 0 };
  assert.deepEqual(dailyCosts(trip, 0), { planned: 30, unpriced: 2, budget: 30 });
  first.day = 1;
  assert.equal(dailyCosts(trip, 0).planned, 20);
  assert.equal(dailyCosts(trip, 1).planned, 10);
  trip.activities = trip.activities.filter(a => a.id !== second.id);
  assert.equal(dailyCosts(trip, 0).planned, 0);
  assert.equal(dailyCosts(trip, 3).budget, undefined);
});
test("budget legacy records load without adding fields or mutating data", () => {
  const legacy = samplePlanner();
  const raw = JSON.stringify(legacy);
  const restored = parsePlanner(raw);
  assert.equal(JSON.stringify(restored), raw);
  assert.deepEqual(dailyCosts(restored.trips[0], 0), { planned: 0, unpriced: 4, budget: undefined });
});
test("budget values round-trip independently per day and trip", () => {
  const planner = samplePlanner();
  planner.trips[0].dailyBudgetsCents = { 0: 0, 1: 12050 };
  planner.trips[0].activities[0].plannedCostCents = 0;
  planner.trips[0].activities[1].plannedCostCents = 1550;
  const other = structuredClone(planner.trips[0]);
  other.id = "other";
  other.dailyBudgetsCents = { 0: 10000 };
  planner.trips.push(other);
  assert.deepEqual(parsePlanner(JSON.stringify(planner)), planner);
});
test("budget malformed saved fields are rejected without normalizing them", () => {
  for (const value of [-1, 0.1, "20", null, 100000000]) {
    const planner = samplePlanner();
    (planner.trips[0] as any).dailyBudgetsCents = { 0: value };
    assert.throws(() => parsePlanner(JSON.stringify(planner)));
    delete planner.trips[0].dailyBudgetsCents;
    (planner.trips[0].activities[0] as any).plannedCostCents = value;
    assert.throws(() => parsePlanner(JSON.stringify(planner)));
  }
  for (const budgets of [[], null, { "-1": 0 }, { "4": 0 }, { "01": 0 }, { invalid: 0 }]) {
    const planner = samplePlanner();
    (planner.trips[0] as any).dailyBudgetsCents = budgets;
    assert.throws(() => parsePlanner(JSON.stringify(planner)));
  }
});
