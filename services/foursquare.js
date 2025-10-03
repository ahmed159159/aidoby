import fetch from "node-fetch";

export async function searchPlaces(query) {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&near=Cairo&limit=5`,
    {
      headers: {
        "Authorization": process.env.FOURSQUARE_API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Foursquare API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}
