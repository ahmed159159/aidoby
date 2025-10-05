// services/foursquare.js
import fetch from "node-fetch";

const API_KEY = process.env.FOURSQUARE_API_KEY;

// ✅ استخدم دومين الجديد + هيدرات النسخة
const BASE_URL = "https://places-api.foursquare.com";

export async function searchPlaces(query, lat, lon, limit = 5) {
  try {
    const url = `${BASE_URL}/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=${limit}`;

    console.log("🌍 Fetching from URL:", url);
    console.log("🔑 Using API Key:", API_KEY?.slice(0, 10) + "...");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,   // ✅ Bearer token
        "Accept": "application/json",
        "X-Places-API-Version": "2025-06-17"    // ✅ لازم تحدد نسخة
      },
    });

    const raw = await res.text();

    if (!res.ok) {
      console.error("❌ Full Foursquare error:", raw);
      throw new Error(`Foursquare API error: ${res.status} - ${res.statusText}`);
    }

    const data = JSON.parse(raw);

    // ✅ رجّع البيانات بشكل مرتب
    return data.results?.map(place => ({
      id: place.fsq_place_id,
      name: place.name,
      address: place.location?.formatted_address,
      categories: place.categories?.map(c => c.name).join(", ")
    })) || [];

  } catch (err) {
    console.error("❌ Error in searchPlaces:", err.message);
    return [];
  }
}
