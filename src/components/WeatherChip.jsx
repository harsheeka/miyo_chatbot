export default function WeatherChip({ weather }) {
  const { city, temp, feelsLike, humidity, wind } = weather;

  return (
    <div className="inline-flex flex-wrap items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-sakura/60 shadow-sm text-xs">
      <span className="font-medium">📍 {city}</span>
      <span>🌡 {temp}°C (feels {feelsLike}°C)</span>
      <span>💧 {humidity}%</span>
      <span>🍃 {wind.toFixed(1)} m/s</span>
      {/* Later: small chips like "Frizz risk: High" */}
    </div>
  );
}
