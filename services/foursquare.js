// services/foursquare.js
import fetch from "node-fetch";

const API_KEY = process.env.FOURSQUARE_API_KEY; // ضع هنا service key بالضبط من الـ Console
const BASE = "https://places-api.foursquare.com"; // host الجديد حسب الـ Migration Guide
const API_VERSION = "2025-06-17"; // استخدم تاريخ نسخة متوافق (يمكن تغييره لاحقاً)

export async function searchPlaces(query, lat, lon, limit = 5) {
  try {
    if (!API_KEY) {
      console.error("❌ FOURSQUARE_API_KEY is missing from env");
      return [];
    }

    const url = `${BASE}/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=${limit}`;

    console.log("🌍 Fetch URL:", url);
    console.log("🔑 API key present (prefix):", API_KEY.slice(0, 6) + "...");

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,            // مهم: Bearer + service key
        "X-Places-Api-Version": API_VERSION,          // مهم: version header
      },
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error("❌ Full Foursquare error:", resp.status, text);
      // If 401 => invalid token; if 410 => deprecated endpoint/host; etc.
      throw new Error(`Foursquare API error: ${resp.status}`);
    }

    const data = JSON.parse(text);
    // Normalize and return friendly result
    return (data.results || []).map(p => ({
      id: p.fsq_place_id || p.fsq_id || p.id,
      name: p.name,
      address: p.location?.formatted_address || p.location?.address || "—",
      categories: (p.categories || []).map(c => c.name).join(", "),
      distance: p.distance ?? null,
      raw: p
    }));
  } catch (err) {
    console.error("❌ Error in searchPlaces:", err.message);
    return [];
  }
}
