import fetch from "node-fetch";

const FSQ_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, lat, lon) {
  try {
    // ✅ Debug: نشوف هل المفتاح واصل
    console.log("🔑 Using API Key:", FSQ_API_KEY ? FSQ_API_KEY.slice(0, 10) + "..." : "❌ NOT FOUND");

    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
      query
    )}&ll=${lat},${lon}&limit=5`;

    console.log("🌍 Fetching from URL:", url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: FSQ_API_KEY, // لازم يكون المفتاح كامل
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Full Foursquare error:", response.status, response.statusText, errText);
      throw new Error(`Foursquare API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Debug: نشوف الريسبونس جاي فيه إيه
    console.log("📦 Raw Foursquare response:", JSON.stringify(data, null, 2));

    return data.results?.map((place) => ({
      name: place.name,
      address: place.location?.formatted_address || "No address",
      category: place.categories?.[0]?.name || "Unknown",
      distance: place.distance,
    })) || [];

  } catch (error) {
    console.error("❌ Error in searchPlaces:", error.message);
    return [];
  }
}
