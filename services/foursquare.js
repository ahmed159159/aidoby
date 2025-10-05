import fetch from "node-fetch";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

export async function searchPlaces(query, lat, lon) {
  try {
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=5`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `${FOURSQUARE_API_KEY}`, // ✅ مفتاح Legacy fsq_
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Foursquare API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    console.log("✅ Raw Foursquare Response:", JSON.stringify(data, null, 2));

    return data.results?.map((place) => ({
      name: place.name,
      address: place.location?.formatted_address,
      category: place.categories?.[0]?.name || "Unknown",
      distance: place.distance,
    })) || [];
  } catch (error) {
    console.error("❌ Error in searchPlaces:", error.message);
    return [];
  }
}
