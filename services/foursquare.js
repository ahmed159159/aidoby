// services/foursquare.js
import fetch from "node-fetch";

const API_KEY = process.env.FOURSQUARE_API_KEY;

// ✅ دومين الأساسي
const BASE_URL = "https://api.foursquare.com/v3";

export async function searchPlaces(query, lat, lon, limit = 5) {
  try {
    const url = `${BASE_URL}/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=${limit}`;

    console.log("🌍 Fetching from URL:", url);
    console.log("🔑 Using API Key:", API_KEY?.slice(0, 10) + "...");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": API_KEY, // ✅ Key مباشرة من غير Bearer
        "Accept": "application/json",
        "X-Places-API-Version": "20240301", // ✅ نسخة ثابتة ومعتمدة
      },
    });

    const raw = await res.text();

    if (!res.ok) {
      console.error("❌ Full Foursquare error:", raw);
      throw new Error(`Foursquare API error: ${res.status} - ${res.statusText}`);
    }

    const data = JSON.parse(raw);

    // ✅ رجّع البيانات بشكل مرتب
    return (
      data.results?.map((place) => ({
        id: place.fsq_id,
        name: place.name,
        address: place.location?.formatted_address,
        categories: place.categories?.map((c) => c.name).join(", "),
      })) || []
    );
  } catch (err) {
    console.error("❌ Error in searchPlaces:", err.message);
    return [];
  }
}
