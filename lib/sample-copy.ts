import { samplePlanner, type Planner } from "./trips.ts";

// Match original demo text exactly; never replace a person's edited text.
const previous = {
  title: "A long weekend in Lisbon",
  notes:
    "A few things to remember…\n\nKeep the mornings slow. Leave room for a good book, an unexpected café, and a second pastel de nata.\n\nBookings and travel details:\nAdd your own confirmation numbers and plans here.",
  activities: [
    {
      id: "coffee",
      title: "Coffee & pastéis",
      notes: "A slow start. Find a sunny table and order something sweet.",
    },
    {
      id: "alfama",
      title: "Get a little lost in Alfama",
      notes: "Winding streets, tiled houses, and no particular rush.",
    },
    {
      id: "lunch",
      title: "Lunch by the river",
      notes: "Leave time for a walk along the waterfront afterwards.",
    },
    {
      id: "sunset",
      title: "Catch the evening light",
      notes: "Bring the camera. Check sunset time closer to the trip.",
    },
    {
      id: "belem",
      title: "A morning in Belém",
      notes:
        "A riverside wander and a pastry stop. Check opening hours before booking.",
    },
    {
      id: "lx",
      title: "Browse the little shops",
      notes: "",
    },
    {
      id: "sintra",
      title: "Take the train to Sintra",
      notes: "Check train times and book any palace tickets separately.",
    },
    {
      id: "garden",
      title: "A day among gardens",
      notes: "Comfortable shoes and a light layer.",
    },
    {
      id: "brunch",
      title: "One last leisurely brunch",
      notes: "",
    },
  ],
  places: [
    {
      id: "tiles",
      title: "A little tile hunting",
      notes: "Look for a small keepsake to take home.",
    },
    {
      id: "picnic",
      title: "A picnic with a view",
      notes: "Pick up something good from a neighborhood bakery.",
    },
    {
      id: "ferry",
      title: "See the city from the water",
      notes: "Look up ferry routes and schedules before heading out.",
    },
  ],
};

export function refreshSampleCopy(planner: Planner): Planner {
  const current = samplePlanner().trips[0];
  function refresh<T extends { title: string; notes: string }>(
    value: T,
    old: { title: string; notes: string },
    next: { title: string; notes: string },
  ): T {
    return {
      ...value,
      title: value.title === old.title ? next.title : value.title,
      notes: value.notes === old.notes ? next.notes : value.notes,
    };
  }
  return {
    ...planner,
    trips: planner.trips.map((trip) => {
      if (trip.id !== current.id || trip.destination !== current.destination)
        return trip;
      return {
        ...refresh(trip, previous, current),
        activities: trip.activities.map((activity) => {
          const old = previous.activities.find(
            (item) => item.id === activity.id,
          );
          const next = current.activities.find(
            (item) => item.id === activity.id,
          );
          return old && next ? refresh(activity, old, next) : activity;
        }),
        places: trip.places.map((place) => {
          const old = previous.places.find((item) => item.id === place.id);
          const next = current.places.find((item) => item.id === place.id);
          return old && next ? refresh(place, old, next) : place;
        }),
      };
    }),
  };
}
