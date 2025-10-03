import fetch from "node-fetch";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, lat, lon) {
  try {
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=5`;

    const res = await fetch(url, {
      headers: { Authorization: FOURSQUARE_API_KEY }
    });

    if (!res.ok) throw new Error("Foursquare API error");

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("❌ Error in Foursquare:", err.message);
    return [];
  }
}
