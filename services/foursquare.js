import fetch from "node-fetch";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, lat, lon) {
  try {
    // 🟢 تأكد الكلمة المفتاحية بالإنجليزية
    const keyword = encodeURIComponent(query);

    const url = `https://api.foursquare.com/v3/places/search?query=${keyword}&ll=${lat},${lon}&limit=5`;

    console.log("🔎 Foursquare URL:", url);

    const res = await fetch(url, {
      headers: { Authorization: FOURSQUARE_API_KEY }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Foursquare API error: ${errText}`);
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("❌ Error in Foursquare:", err.message);
    return [];
  }
}
