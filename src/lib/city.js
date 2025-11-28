import { extractCityFromMessage as llmExtract } from "./llm.js";

export async function extractCityFromMessage(text, language) {
  return await llmExtract(text, language);
}

export async function geocodeCity(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=1&language=en&format=json`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const c = data.results[0];

    return {
      name: c.name,
      country: c.country,
      lat: c.latitude,
      lon: c.longitude,
    };
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
  }
}
