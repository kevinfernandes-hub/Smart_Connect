import React, { useEffect, useState } from "react";

// Example API endpoint (replace with your actual weather API)
const WEATHER_API = "https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=YOUR_LOCATION&days=7";

export default function WeatherAgentCard() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(WEATHER_API)
      .then((res) => res.json())
      .then((data) => {
        setForecast(data.forecast?.forecastday || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to fetch weather data.");
        setLoading(false);
      });
  }, []);

  // Example spray window logic: avoid rain days
  const getSprayWindows = () => {
    return forecast.filter(day => day.day.daily_chance_of_rain < 30);
  };

  return (
    <div className="card weather-agent-card">
      <h2>7-Day Weather Forecast & Spray Windows</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <ul>
            {forecast.map((day) => (
              <li key={day.date}>
                <strong>{day.date}</strong>: {day.day.condition.text}, {day.day.avgtemp_c}°C, Rain Chance: {day.day.daily_chance_of_rain}%
              </li>
            ))}
          </ul>
          <h3>Recommended Spray Windows</h3>
          <ul>
            {getSprayWindows().map((day) => (
              <li key={day.date}>
                <strong>{day.date}</strong>: {day.day.condition.text}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
