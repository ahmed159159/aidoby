import fetch from "node-fetch";

const BASE_URL = "https://api.foursquare.com/v3/places/search";

export async function searchPlaces(query, lat, lon, limit = 5) {
  try {
    const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=${limit}`, {
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY
      }
    });

    const data = await res.json();

    return data.results.map(place => ({
      name: place.name,
      address: place.location?.formatted_address || "No address",
      distance: place.distance || "N/A",
      categories: place.categories?.map(c => c.name).join(", ") || "N/A"
    }));
  } catch (e) {
    console.error("❌ Foursquare error:", e);
    return [];
  }
}
