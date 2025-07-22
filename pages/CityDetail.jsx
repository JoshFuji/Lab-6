import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const API_KEY = import.meta.env.VITE_WEATHERBIT_KEY;

export default function CityDetail() {
  const { cityName } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(
        cityName
      )}&days=8&units=M&key=${API_KEY}`
    )
      .then(r => r.json())
      .then(normaliseHistory)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cityName]);

  if (loading) return <p>Loading forecast …</p>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <h2>{cityName}</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="valid_date" />
          <YAxis unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" />
        </LineChart>
      </ResponsiveContainer>

      {history[0] && (
        <ul>
          <li>Humidity: {history[0].rh}%</li>
          <li>Wind: {history[0].wind_spd} m/s</li>
          <li>Condition: {history[0].weather.description}</li>
        </ul>
      )}
    </div>
  );
}

/* ---------- helper ---------- */
function normaliseHistory(raw) {
  return raw.data?.map(d => ({
    valid_date: d.valid_date,          // "2025-07-22"
    temp: d.temp,
    rh: d.rh,
    wind_spd: d.wind_spd,
    weather: { description: d.weather.description },
  })) ?? [];
}
