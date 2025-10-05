import fetch from "node-fetch";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

// دالة البحث في Foursquare (API الجديد)
export async function searchPlaces(query, lat, lon) {
  try {
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
      query
    )}&ll=${lat},${lon}&limit=5`;

    console.log("🔑 Using API Key:", FOURSQUARE_API_KEY?.substring(0, 10) + "...");
    console.log("🌍 Fetching from URL:", url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: FOURSQUARE_API_KEY, // لازم يكون fsq3...
      },
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("❌ Full Foursquare error:", response.status, text);
      throw new Error(`Foursquare API error: ${response.status} - ${response.statusText}`);
    }

    const data = JSON.parse(text);

    // ✅ لو مفيش نتائج
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // ✅ نرجع الأماكن
    return data.results.map((place) => ({
      name: place.name,
      address: place.location?.formatted_address || "—",
      category: place.categories?.[0]?.name || "Unknown",
      distance: place.distance,
    }));
  } catch (error) {
    console.error("❌ Error in searchPlaces:", error.message);
    return [];
  }
}
