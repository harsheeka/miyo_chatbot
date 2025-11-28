export async function fetchWeather(lat, lon, cityName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,temperature_2m,wind_speed_10m`;

  const res = await fetch(url);
  const data = await res.json();

  const w = data.current_weather;
  const humidity = data.hourly.relativehumidity_2m[0];

  return {
    city: cityName,
    temp: w.temperature,
    feelsLike: w.temperature,
    humidity,
    wind: w.windspeed,
  };
}
