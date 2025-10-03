import axios from "axios";

export async function searchPlaces(query) {
  const url = "https://api.foursquare.com/v3/places/search";

  const resp = await axios.get(url, {
    params: {
      query: query,
      near: "Cairo",
      limit: 5
    },
    headers: {
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  });

  return resp.data.results.map((place) => ({
    name: place.name,
    address: place.location?.formatted_address || "No address",
    categories: place.categories?.map((c) => c.name).join(", ") || "Unknown"
  }));
}
