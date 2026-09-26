"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  CloudOff,
  Coffee,
  Compass,
  Download,
  MapPin,
  NotebookPen,
  Pencil,
  Plus,
  Route,
  Search,
  TrainFront,
  Trash2,
  X,
  BedDouble,
} from "lucide-react";
import {
  activitiesForDay,
  categories,
  dateLabel,
  dateRange,
  parsePlanner,
  samplePlanner,
  STORAGE_KEY,
  validDate,
  type Activity,
  type Category,
  type Place,
  type Planner,
  type Trip,
} from "@/lib/trips";

import { IllustratedMap } from "./IllustratedMap";

import { refreshSampleCopy } from "@/lib/sample-copy";

type Tab = "Itinerary" | "Saved places" | "Notes";
type Modal =
  | { kind: "activity"; id?: string; place?: Place }
  | { kind: "trip"; create?: boolean }
  | { kind: "place" }
  | { kind: "deleteTrip" }
  | null;
const categoryIcons = {
  Explore: Compass,
  "Food & drink": Coffee,
  Stay: BedDouble,
  Transport: TrainFront,
};
function CategoryIcon({
  category,
  size = 19,
}: {
  category: Category;
  size?: number;
}) {
  const Icon = categoryIcons[category];
  return <Icon size={size} aria-hidden="true" />;
}
function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    dialog?.querySelector("input")?.focus();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-heading">
        <div>
          <h2 id="dialog-title">{title}</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function Empty({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="empty">
      <Compass size={35} strokeWidth={1.3} />
      <h3>{title}</h3>
      <p>{body}</p>
      <button className="primary" onClick={onAction}>
        <Plus size={17} />
        {action}
      </button>
    </div>
  );
}

export function TripPlanner() {
  const [planner, setPlanner] = useState<Planner>(samplePlanner);
  const [loaded, setLoaded] = useState(false);
  const [storageIssue, setStorageIssue] = useState("");
  const [canSave, setCanSave] = useState(true);
  const [tab, setTab] = useState<Tab>("Itinerary");
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [undo, setUndo] = useState<{
    tripId: string;
    activity: Activity;
  } | null>(null);
  const [formError, setFormError] = useState("");
  useEffect(() => {
    if (!notice || undo) return;
    const timeout = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timeout);
  }, [notice, undo]);
  const opener = useRef<HTMLElement | null>(null);
  function close() {
    setModal(null);
    requestAnimationFrame(() => {
      if (opener.current?.isConnected) opener.current.focus();
      else document.getElementById("trip-title")?.focus();
    });
  }
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlanner(refreshSampleCopy(parsePlanner(raw)));
    } catch {
      setCanSave(false);
      setStorageIssue(
        "Saved trips could not be opened. Your existing data has not been changed. New edits will only last for this session.",
      );
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded || !canSave) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(planner));
      setStorageIssue("");
    } catch {
      setStorageIssue(
        "Your browser could not save these changes. Export your trips to keep a copy.",
      );
    }
  }, [planner, loaded, canSave]);
  const trip =
    planner.trips.find((t) => t.id === planner.selectedTrip) ??
    planner.trips[0];
  const day = planner.selectedDay;
  const activities = activitiesForDay(trip, day);
  const complete = trip.activities.filter((a) => a.done).length;
  function updateTrip(change: (trip: Trip) => Trip) {
    setPlanner((p) => ({
      ...p,
      trips: p.trips.map((t) => (t.id === trip.id ? change(t) : t)),
    }));
  }
  function open(next: Modal) {
    setFormError("");
    setModal(next);
  }
  function switchTrip(id: string) {
    setPlanner((p) => ({ ...p, selectedTrip: id, selectedDay: 0 }));
    setTab("Itinerary");
    setQuery("");
    setUndo(null);
    setNotice("");
  }
  function switchDay(value: number) {
    setPlanner((p) => ({ ...p, selectedDay: value }));
  }
  function saveActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    if (!title) {
      setFormError("Give this activity a name.");
      return;
    }
    const existing =
      modal?.kind === "activity"
        ? trip.activities.find((a) => a.id === modal.id)
        : undefined;
    const activity: Activity = {
      id: existing?.id ?? crypto.randomUUID(),
      title,
      location: String(data.get("location") ?? "").trim(),
      time: String(data.get("time")),
      day: Number(data.get("day")),
      category: String(data.get("category")) as Category,
      notes: String(data.get("notes") ?? "").trim(),
      done: existing?.done ?? false,
    };
    updateTrip((t) => ({
      ...t,
      activities: existing
        ? t.activities.map((a) => (a.id === existing.id ? activity : a))
        : [...t.activities, activity],
    }));
    switchDay(activity.day);
    setTab("Itinerary");
    close();
    setNotice(existing ? "Activity updated." : "Activity added.");
    setUndo(null);
  }
  function saveTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const destination = String(data.get("destination") ?? "").trim();
    const startDate = String(data.get("startDate"));
    if (!title || !destination || !validDate(startDate)) {
      setFormError("Add a trip name, destination, and valid start date.");
      return;
    }
    if (modal?.kind === "trip" && modal.create) {
      const created: Trip = {
        id: crypto.randomUUID(),
        title,
        destination,
        startDate,
        days: Number(data.get("days")),
        activities: [],
        places: [],
        notes: "",
        checklist: [
          { id: "stay", title: "Book a place to stay", done: false },
          { id: "travel", title: "Save travel tickets", done: false },
          { id: "pack", title: "Make a packing list", done: false },
        ],
      };
      setPlanner((p) => ({
        ...p,
        trips: [...p.trips, created],
        selectedTrip: created.id,
        selectedDay: 0,
      }));
      setTab("Itinerary");
      setQuery("");
    } else updateTrip((t) => ({ ...t, title, destination, startDate }));
    close();
    setNotice("Trip saved.");
    setUndo(null);
  }
  function savePlace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    if (!title) {
      setFormError("Give this place a name.");
      return;
    }
    updateTrip((t) => ({
      ...t,
      places: [
        ...t.places,
        {
          id: crypto.randomUUID(),
          title,
          location: String(data.get("location") ?? "").trim(),
          category: String(data.get("category")) as Category,
          notes: String(data.get("notes") ?? "").trim(),
        },
      ],
    }));
    close();
    setQuery("");
    setNotice("Place saved for later.");
  }
  function removeActivity(activity: Activity) {
    updateTrip((t) => ({
      ...t,
      activities: t.activities.filter((a) => a.id !== activity.id),
    }));
    close();
    setUndo({ tripId: trip.id, activity });
    setNotice("Activity removed.");
  }
  function restoreActivity() {
    if (!undo) return;
    setPlanner((p) => ({
      ...p,
      trips: p.trips.map((t) =>
        t.id === undo.tripId
          ? { ...t, activities: [...t.activities, undo.activity] }
          : t,
      ),
    }));
    setUndo(null);
    setNotice("Activity restored.");
  }
  function exportTrips() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(planner, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "roam-trips.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Trips exported.");
  }
  async function importTrips(file?: File) {
    if (!file) return;
    try {
      if (file.size > 5000000) throw Error();
      const imported = parsePlanner(await file.text());
      setPlanner((p) => {
        const trips = imported.trips.map((t) => ({
          ...t,
          id: crypto.randomUUID(),
        }));
        return {
          ...p,
          trips: [...p.trips, ...trips],
          selectedTrip: trips[0].id,
          selectedDay: 0,
        };
      });
      setTab("Itinerary");
      setNotice("Trips imported. Existing trips were kept.");
    } catch {
      setNotice("This file could not be imported. Choose a Roam JSON export.");
    }
  }
  const editing =
    modal?.kind === "activity"
      ? trip.activities.find((a) => a.id === modal.id)
      : undefined;
  const suggestion = modal?.kind === "activity" ? modal.place : undefined;
  const filteredPlaces = trip.places.filter((p) =>
    `${p.title} ${p.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div
      className="app-shell"
      onClickCapture={(event) => {
        if (!modal)
          opener.current = (event.target as HTMLElement).closest("button");
      }}
    >
      <a href="#main-content" className="skip-link">
        Skip to trip planner
      </a>
      <aside className="sidebar">
        <a className="wordmark" href="/" aria-label="Roam home">
          <span className="brand-mark">
            <Compass size={24} />
          </span>
          roam<span className="brand-period">.</span>
        </a>
        <div className="sidebar-section">
          <span className="eyebrow">Trips</span>
        </div>
        <nav className="trip-list" aria-label="Your trips">
          {planner.trips.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTrip(t.id)}
              className={`trip-nav ${t.id === trip.id ? "active" : ""}`}
              aria-current={t.id === trip.id ? "page" : undefined}
            >
              <span className="trip-symbol">
                <Compass size={19} />
              </span>
              <span>
                <strong>{t.destination.split(",")[0]}</strong>
                <small>
                  {dateLabel(t.startDate)} · {t.days} days
                </small>
              </span>
              {t.id === trip.id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <button
          className="new-trip"
          onClick={() => open({ kind: "trip", create: true })}
        >
          <Plus size={17} />
          New trip
        </button>
        <div className="sidebar-bottom">
          <p className="storage-note">
            Trips are saved in this browser.
            <br />
            Export a backup to keep a copy.
          </p>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>My trips</span>
            <ChevronRight size={14} />
            <strong>{trip.destination.split(",")[0]}</strong>
          </div>
          <div className="topbar-actions">
            <span className="save-state" role="status">
              {storageIssue ? (
                <>
                  <CloudOff size={15} />
                  Not saved
                </>
              ) : loaded ? (
                <>
                  <CheckCheck size={15} />
                  Saved on this device
                </>
              ) : (
                "Opening your trips…"
              )}
            </span>
            <label className="import-button">
              <ArrowDownToLine size={15} />
              Import trips
              <input
                aria-label="Import trips"
                type="file"
                accept="application/json,.json"
                onChange={(e) => {
                  void importTrips(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <button className="button subtle" onClick={exportTrips}>
              <Download size={16} />
              <span>Export trips</span>
            </button>
          </div>
        </header>
        <main id="main-content" className={tab === "Itinerary" ? "map-workspace" : undefined}>
          {storageIssue && (
            <div role="alert" className="storage-alert">
              {storageIssue}
            </div>
          )}
          <div className="trip-heading">
            {trip.id === "lisbon" && (
              <img
                className="trip-thumbnail"
                src="/images/lisbon.webp"
                alt="Illustration of Lisbon rooftops and the Tagus river"
                fetchPriority="high"
              />
            )}
            <div className="trip-heading-text">
              <div className="eyebrow location-label">
                <MapPin size={13} />
                {trip.destination}
              </div>
              <h1 id="trip-title" tabIndex={-1}>
                {trip.title}
              </h1>
              <div className="trip-meta">
                <span>
                  <CalendarDays size={15} />
                  {dateRange(trip)}
                </span>
                <span className="meta-divider" />
                <span>{trip.days} days</span>
              </div>
            </div>
            <button className="button" onClick={() => open({ kind: "trip" })}>
              <Pencil size={15} />
              Edit trip
            </button>
          </div>
          <div className="tabs-row">
            <nav className="tabs" aria-label="Trip sections">
              {(["Itinerary", "Saved places", "Notes"] as Tab[]).map(
                (name, i) => {
                  const Icon = [Route, Bookmark, NotebookPen][i];
                  return (
                    <button
                      key={name}
                      onClick={() => setTab(name)}
                      aria-current={tab === name ? "page" : undefined}
                      className={tab === name ? "selected" : ""}
                    >
                      <Icon size={17} />
                      {name}
                      {name === "Saved places" && (
                        <span className="count-badge">
                          {trip.places.length}
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </nav>
          </div>
          {tab === "Itinerary" && (
            <div className="itinerary-layout">
                <div className="day-picker" aria-label="Trip days">
                  {Array.from({ length: trip.days }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => switchDay(i)}
                      className={day === i ? "active" : ""}
                      aria-pressed={day === i}
                    >
                      <span>Day {i + 1}</span>
                      <strong>
                        {dateLabel(trip.startDate, i, {
                          weekday: "short",
                          day: "numeric",
                        })}
                      </strong>
                      <span className="day-dots" aria-hidden="true">
                        {trip.activities.some((a) => a.day === i) && <i />}
                      </span>
                    </button>
                  ))}
                </div>
              <IllustratedMap
                key={`${trip.id}-${day}`}
                activities={activities}
                destination={trip.destination}
                day={day}
                onEdit={(activity) => open({ kind: "activity", id: activity.id })}
                onToggle={(activity) => updateTrip((t) => ({
                  ...t,
                  activities: t.activities.map((a) => a.id === activity.id ? { ...a, done: !a.done } : a),
                }))}
              />
              <section className="itinerary" aria-label="Daily itinerary">
                <div className="day-heading">
                  <div>
                    <h2>
                      {dateLabel(trip.startDate, day, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>
                    <p>
                      {activities.length
                        ? `${activities.length} ${activities.length === 1 ? "activity" : "activities"}`
                        : "No activities planned"}
                    </p>
                  </div>
                  <button
                    className="primary"
                    onClick={() => open({ kind: "activity" })}
                  >
                    <Plus size={17} />
                    Add activity
                  </button>
                </div>
                {!activities.length ? (
                  <Empty
                    title="No activities yet"
                    body="Add a place, meal, or travel time to this day."
                    action="Add your first activity"
                    onAction={() => open({ kind: "activity" })}
                  />
                ) : (
                  <ol className="timeline">
                    {activities.map((activity) => (
                      <li
                        key={activity.id}
                        className={activity.done ? "completed" : ""}
                      >
                        <div className="time-column">
                          <time>{activity.time}</time>
                        </div>
                        <article className="activity-card">
                          <div className="activity-category">
                            <CategoryIcon category={activity.category} />
                          </div>
                          <div className="activity-body">
                            <div className="activity-label">
                              {activity.category}
                            </div>
                            <h3>{activity.title}</h3>
                            {activity.location && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location + ", " + trip.destination)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="place-link"
                              >
                                <MapPin size={13} />
                                {activity.location}
                                <ArrowUpRight size={12} />
                              </a>
                            )}
                            {activity.notes && <p>{activity.notes}</p>}
                            <div className="activity-footer">
                              <button
                                className={`check-button ${activity.done ? "checked" : ""}`}
                                aria-pressed={activity.done}
                                onClick={() =>
                                  updateTrip((t) => ({
                                    ...t,
                                    activities: t.activities.map((a) =>
                                      a.id === activity.id
                                        ? { ...a, done: !a.done }
                                        : a,
                                    ),
                                  }))
                                }
                              >
                                <span>
                                  {activity.done && <Check size={11} />}
                                </span>
                                {activity.done ? "Visited" : "Mark as visited"}
                              </button>
                              <button
                                className="icon-button"
                                aria-label={`Edit ${activity.title}`}
                                onClick={() =>
                                  open({ kind: "activity", id: activity.id })
                                }
                              >
                                <Pencil size={15} />
                              </button>
                            </div>
                          </div>
                        </article>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="day-navigation">
                  <button
                    className="text-button"
                    disabled={day === 0}
                    onClick={() => switchDay(day - 1)}
                  >
                    <ArrowLeft size={15} />
                    Previous day
                  </button>
                  <span>
                    Day {day + 1} of {trip.days}
                  </span>
                  <button
                    className="text-button"
                    disabled={day === trip.days - 1}
                    onClick={() => switchDay(day + 1)}
                  >
                    Next day
                    <ArrowRight size={15} />
                  </button>
                </div>
              </section>
              <aside className="trip-aside">
                <div className="summary-card">
                  <h3>Trip overview</h3>
                  <p className="summary-count">
                    {complete} of {trip.activities.length} activities visited
                  </p>
                  <div
                    className="progress-track"
                    role="progressbar"
                    aria-label="Visited activities"
                    aria-valuemin={0}
                    aria-valuemax={Math.max(1, trip.activities.length)}
                    aria-valuenow={complete}
                  >
                    <div
                      style={{
                        width: `${trip.activities.length ? (complete / trip.activities.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="packing-card">
                  <h3>Checklist</h3>
                  {trip.checklist.map((item) => (
                    <label className="checklist-row" key={item.id}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() =>
                          updateTrip((t) => ({
                            ...t,
                            checklist: t.checklist.map((c) =>
                              c.id === item.id ? { ...c, done: !c.done } : c,
                            ),
                          }))
                        }
                      />
                      <span>{item.title}</span>
                    </label>
                  ))}
                </div>
                <p className="sample-note">
                  {trip.id === "lisbon" ? "Sample trip. " : ""}
                  Check opening hours and travel details before you go.
                </p>
              </aside>
            </div>
          )}
          {tab === "Saved places" && (
            <section className="places-section">
              <div className="section-heading">
                <div>
                  <h2>Saved places</h2>
                  <p>Add a saved place to any day of your trip.</p>
                </div>
                <button
                  className="primary"
                  onClick={() => open({ kind: "place" })}
                >
                  <Plus size={17} />
                  Save a place
                </button>
              </div>
              <label className="search-field">
                <Search size={18} />
                <input
                  aria-label="Search saved places"
                  placeholder="Find a place or neighborhood…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              {filteredPlaces.length ? (
                <div className="places-grid">
                  {filteredPlaces.map((place) => (
                    <article className="saved-place" key={place.id}>
                      <div className="saved-place-body">
                        <span className="place-category">
                          <CategoryIcon category={place.category} size={16} />
                          {place.category}
                        </span>
                        <h3>{place.title}</h3>
                        <p className="place-location">
                          <MapPin size={14} />
                          {place.location || trip.destination}
                        </p>
                        {place.notes && <p>{place.notes}</p>}
                        <div className="place-actions">
                          <button
                            className="text-button"
                            onClick={() => open({ kind: "activity", place })}
                          >
                            <Plus size={16} />
                            Add to itinerary
                          </button>
                          <button
                            className="icon-button"
                            aria-label={`Remove saved place ${place.title}`}
                            onClick={() => {
                              updateTrip((t) => ({
                                ...t,
                                places: t.places.filter(
                                  (p) => p.id !== place.id,
                                ),
                              }));
                              setNotice("Saved place removed.");
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty
                  title={query ? "No places found" : "No saved places"}
                  body={
                    query
                      ? "Try a different name or neighborhood."
                      : "Save places you want to add to your trip."
                  }
                  action={query ? "Clear search" : "Save your first place"}
                  onAction={() =>
                    query ? setQuery("") : open({ kind: "place" })
                  }
                />
              )}
            </section>
          )}
          {tab === "Notes" && (
            <section className="notes-section">
              <div className="section-heading">
                <div>
                  <h2>Trip notes</h2>
                  <p>Booking details, addresses, and reminders.</p>
                </div>
              </div>
              <label htmlFor="trip-notes" className="sr-only">
                Trip notes
              </label>
              <textarea
                id="trip-notes"
                className="notebook"
                placeholder="Add a note…"
                value={trip.notes}
                maxLength={10000}
                onChange={(e) =>
                  updateTrip((t) => ({ ...t, notes: e.target.value }))
                }
              />
              <div className="notes-footer">
                <span>
                  <CheckCheck size={14} />
                  {storageIssue
                    ? "Not saved — export to keep a copy"
                    : "Saved on this device as you write"}
                </span>
                <span>
                  {trip.notes.length.toLocaleString()} / 10,000 characters
                </span>
              </div>
            </section>
          )}
        </main>
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{notice}</span>
          {undo && <button onClick={restoreActivity}>Undo</button>}
          <button
            className="icon-button"
            onClick={() => {
              setNotice("");
              setUndo(null);
            }}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
      {modal && (
        <Dialog
          title={
            modal.kind === "activity"
              ? editing
                ? "Edit activity"
                : "Add activity"
              : modal.kind === "place"
                ? "Save a place"
                : modal.kind === "deleteTrip"
                  ? "Delete this trip?"
                  : modal.create
                    ? "New trip"
                    : "Edit trip"
          }
          onClose={close}
        >
          {modal.kind === "activity" && (
            <form onSubmit={saveActivity}>
              <label>
                Activity name
                <input
                  name="title"
                  required
                  maxLength={100}
                  defaultValue={editing?.title ?? suggestion?.title}
                  placeholder="Museum visit"
                />
              </label>
              <div className="form-row">
                <label>
                  Day
                  <select
                    aria-label="Day"
                    name="day"
                    defaultValue={editing?.day ?? day}
                  >
                    {Array.from({ length: trip.days }, (_, i) => (
                      <option value={i} key={i}>
                        Day {i + 1} · {dateLabel(trip.startDate, i)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Time
                  <input
                    type="time"
                    name="time"
                    required
                    defaultValue={editing?.time ?? "10:00"}
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Category
                  <select
                    aria-label="Category"
                    name="category"
                    defaultValue={
                      editing?.category ?? suggestion?.category ?? "Explore"
                    }
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Place or neighborhood
                  <input
                    name="location"
                    maxLength={150}
                    defaultValue={editing?.location ?? suggestion?.location}
                    placeholder="Place or address"
                  />
                </label>
              </div>
              <label>
                Notes
                <textarea
                  name="notes"
                  maxLength={10000}
                  rows={3}
                  defaultValue={editing?.notes ?? suggestion?.notes}
                  placeholder="Booking details or reminders"
                />
              </label>
              {formError && (
                <p role="alert" className="form-error">
                  {formError}
                </p>
              )}
              <div className="dialog-footer">
                {editing && (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => removeActivity(editing)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button type="button" className="button" onClick={close}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  {editing ? "Save changes" : "Add activity"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
          {modal.kind === "trip" && (
            <form onSubmit={saveTrip}>
              <label>
                Trip name
                <input
                  name="title"
                  maxLength={100}
                  required
                  defaultValue={modal.create ? "" : trip.title}
                  placeholder="Lisbon weekend"
                />
              </label>
              <label>
                Destination
                <input
                  name="destination"
                  maxLength={100}
                  required
                  defaultValue={modal.create ? "" : trip.destination}
                  placeholder="Kyoto, Japan"
                />
              </label>
              <div className="form-row">
                <label>
                  First day
                  <input
                    type="date"
                    name="startDate"
                    min="2000-01-01"
                    max="2099-12-31"
                    required
                    defaultValue={
                      modal.create
                        ? new Date().toISOString().slice(0, 10)
                        : trip.startDate
                    }
                  />
                </label>
                {modal.create ? (
                  <label>
                    Number of days
                    <input
                      type="number"
                      name="days"
                      min={1}
                      max={14}
                      required
                      defaultValue={4}
                    />
                  </label>
                ) : (
                  <div className="form-hint">
                    {trip.days} days
                    <br />
                    <small>Trip duration</small>
                  </div>
                )}
              </div>
              {formError && (
                <p role="alert" className="form-error">
                  {formError}
                </p>
              )}
              <div className="dialog-footer">
                {!modal.create && planner.trips.length > 1 && (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => open({ kind: "deleteTrip" })}
                  >
                    Delete trip
                  </button>
                )}
                <button type="button" className="button" onClick={close}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  {modal.create ? "Create trip" : "Save changes"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
          {modal.kind === "place" && (
            <form onSubmit={savePlace}>
              <label>
                Place name
                <input
                  name="title"
                  required
                  maxLength={100}
                  placeholder="Bookshop, restaurant, or museum"
                />
              </label>
              <div className="form-row">
                <label>
                  Neighborhood or address
                  <input
                    name="location"
                    maxLength={150}
                    placeholder="Where to find it"
                  />
                </label>
                <label>
                  Category
                  <select aria-label="Category" name="category">
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Notes
                <textarea
                  name="notes"
                  maxLength={10000}
                  rows={3}
                  placeholder="Opening hours or other details"
                />
              </label>
              {formError && (
                <p role="alert" className="form-error">
                  {formError}
                </p>
              )}
              <div className="dialog-footer">
                <button type="button" className="button" onClick={close}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Save place
                  <Bookmark size={16} />
                </button>
              </div>
            </form>
          )}
          {modal.kind === "deleteTrip" && (
            <>
              <p className="delete-description">
                “{trip.title}” and all its activities, saved places, and notes
                will be removed from this device. Export your trips first if you
                want a copy.
              </p>
              <div className="dialog-footer">
                <button className="button" onClick={close}>
                  Keep trip
                </button>
                <button
                  className="primary danger"
                  onClick={() => {
                    setPlanner((p) => {
                      const trips = p.trips.filter((t) => t.id !== trip.id);
                      return {
                        ...p,
                        trips,
                        selectedTrip: trips[0].id,
                        selectedDay: 0,
                      };
                    });
                    close();
                    setUndo(null);
                    setTab("Itinerary");
                    setNotice("Trip deleted.");
                  }}
                >
                  Delete trip
                </button>
              </div>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
