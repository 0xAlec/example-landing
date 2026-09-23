import assert from "node:assert/strict";
import test from "node:test";
import {
  activitiesForDay,
  dayDate,
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
