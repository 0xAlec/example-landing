export const STORAGE_KEY = "roam.trips.v1";
export const categories = [
  "Explore",
  "Food & drink",
  "Stay",
  "Transport",
] as const;
export type Category = (typeof categories)[number];
export type Activity = {
  id: string;
  day: number;
  time: string;
  title: string;
  location: string;
  category: Category;
  notes: string;
  done: boolean;
};
export type Place = {
  id: string;
  title: string;
  location: string;
  category: Category;
  notes: string;
};
export type PackingItem = { id: string; title: string; done: boolean };
export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  days: number;
  activities: Activity[];
  places: Place[];
  notes: string;
  packingList?: PackingItem[];
  checklist: { id: string; title: string; done: boolean }[];
};
export type Planner = {
  version: 1;
  trips: Trip[];
  selectedTrip: string;
  selectedDay: number;
};
export function dayDate(start: string, day: number): Date {
  const d = new Date(start + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + day);
  return d;
}
export function dateLabel(
  start: string,
  day = 0,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
) {
  return new Intl.DateTimeFormat("en", { ...options, timeZone: "UTC" }).format(
    dayDate(start, day),
  );
}
export function dateRange(trip: Trip) {
  return `${dateLabel(trip.startDate)} – ${dateLabel(trip.startDate, trip.days - 1)}, ${dayDate(trip.startDate, trip.days - 1).getUTCFullYear()}`;
}
export function activitiesForDay(trip: Trip, day: number) {
  return trip.activities
    .filter((a) => a.day === day)
    .sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id));
}
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    value >= "2000-01-01" &&
    value <= "2099-12-31" &&
    Number.isFinite(new Date(value + "T12:00:00Z").getTime()) &&
    new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value
  );
}
const text = (value: unknown, max = 10000): value is string =>
  typeof value === "string" && value.length <= max;
const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
function validPlace(value: unknown): value is Place {
  return (
    record(value) &&
    text(value.id, 100) &&
    text(value.title, 100) &&
    value.title.trim().length > 0 &&
    text(value.location, 150) &&
    categories.includes(value.category as Category) &&
    text(value.notes)
  );
}
function validActivity(value: unknown): value is Activity {
  if (!record(value)) return false;
  const { day, done, time } = value;
  return (
    validPlace(value) &&
    Number.isInteger(day) &&
    Number(day) >= 0 &&
    typeof done === "boolean" &&
    typeof time === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  );
}
function validTrip(value: unknown): value is Trip {
  if (
    !record(value) ||
    !text(value.id, 100) ||
    !text(value.title, 100) ||
    !value.title.trim() ||
    !text(value.destination, 100) ||
    !value.destination.trim() ||
    !text(value.startDate, 10) ||
    !validDate(value.startDate) ||
    !Number.isInteger(value.days) ||
    Number(value.days) < 1 ||
    Number(value.days) > 14 ||
    !text(value.notes)
  )
    return false;
  if (
    !Array.isArray(value.activities) ||
    !value.activities.every(
      (a) => validActivity(a) && a.day < Number(value.days),
    )
  )
    return false;
  if (
    !Array.isArray(value.places) ||
    !value.places.every(validPlace) ||
    !Array.isArray(value.checklist) ||
    !value.checklist.every(
      (c) =>
        record(c) &&
        text(c.id, 100) &&
        text(c.title, 150) &&
        typeof c.done === "boolean",
    )
  )
    return false;
  if ("packingList" in value && (
    !Array.isArray(value.packingList) ||
    new Set(value.packingList.map((item) => record(item) ? item.id : undefined)).size !== value.packingList.length ||
    !value.packingList.every((item) =>
      record(item) && text(item.id, 100) && item.id.trim().length > 0 &&
      text(item.title, 150) && item.title.trim().length > 0 &&
      typeof item.done === "boolean"
    )
  )) return false;
  return [value.activities, value.places, value.checklist].every(
    (list) => new Set(list.map((item) => item.id)).size === list.length,
  );
}
export function parsePlanner(raw: string): Planner {
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    value.version !== 1 ||
    !Array.isArray(value.trips) ||
    value.trips.length < 1 ||
    !value.trips.every(validTrip) ||
    new Set(value.trips.map((t) => t.id)).size !== value.trips.length ||
    !text(value.selectedTrip)
  )
    throw new Error("This saved trip file is not valid.");
  const selected = value.trips.find((t) => t.id === value.selectedTrip);
  if (
    !selected ||
    !Number.isInteger(value.selectedDay) ||
    Number(value.selectedDay) < 0 ||
    Number(value.selectedDay) >= selected.days
  )
    throw new Error("This saved trip selection is not valid.");
  return value as Planner;
}
export function samplePlanner(): Planner {
  return {
    version: 1,
    selectedTrip: "lisbon",
    selectedDay: 0,
    trips: [
      {
        id: "lisbon",
        title: "Lisbon weekend",
        destination: "Lisbon, Portugal",
        startDate: "2026-10-15",
        days: 4,
        activities: [
          {
            id: "coffee",
            day: 0,
            time: "09:00",
            title: "Coffee & pastéis",
            location: "Baixa",
            category: "Food & drink",
            notes: "",
            done: false,
          },
          {
            id: "alfama",
            day: 0,
            time: "10:30",
            title: "Walk through Alfama",
            location: "Alfama",
            category: "Explore",
            notes: "",
            done: false,
          },
          {
            id: "lunch",
            day: 0,
            time: "13:00",
            title: "Lunch by the river",
            location: "Praça do Comércio",
            category: "Food & drink",
            notes: "Walk along the waterfront after lunch.",
            done: false,
          },
          {
            id: "sunset",
            day: 0,
            time: "17:30",
            title: "Santa Luzia viewpoint",
            location: "Miradouro de Santa Luzia",
            category: "Explore",
            notes: "Check sunset time before the trip.",
            done: false,
          },
          {
            id: "belem",
            day: 1,
            time: "10:00",
            title: "Visit Belém",
            location: "Belém",
            category: "Explore",
            notes: "Check opening hours before booking.",
            done: false,
          },
          {
            id: "lx",
            day: 1,
            time: "15:00",
            title: "Browse shops in Alcântara",
            location: "Alcântara",
            category: "Explore",
            notes: "",
            done: false,
          },
          {
            id: "sintra",
            day: 2,
            time: "09:00",
            title: "Take the train to Sintra",
            location: "Rossio station",
            category: "Transport",
            notes: "Check train times and book any palace tickets separately.",
            done: false,
          },
          {
            id: "garden",
            day: 2,
            time: "11:00",
            title: "Visit the gardens",
            location: "Sintra",
            category: "Explore",
            notes: "Bring walking shoes.",
            done: false,
          },
          {
            id: "brunch",
            day: 3,
            time: "10:00",
            title: "Brunch in Chiado",
            location: "Chiado",
            category: "Food & drink",
            notes: "",
            done: false,
          },
        ],
        places: [
          {
            id: "tiles",
            title: "Tile shops in Chiado",
            location: "Chiado",
            category: "Explore",
            notes: "",
          },
          {
            id: "picnic",
            title: "Picnic in Jardim da Estrela",
            location: "Jardim da Estrela",
            category: "Food & drink",
            notes: "Buy food before going to the park.",
          },
          {
            id: "ferry",
            title: "Ferry across the Tagus",
            location: "Cais do Sodré",
            category: "Transport",
            notes: "Check ferry routes and departure times.",
          },
        ],
        notes:
          "Bookings\nHotel confirmation:\nFlight details:\n\nCheck train times for Sintra.",
        checklist: [
          { id: "stay", title: "Book a place to stay", done: true },
          { id: "tickets", title: "Save travel tickets", done: false },
          { id: "shoes", title: "Pack comfortable shoes", done: false },
        ],
      },
    ],
  };
}
