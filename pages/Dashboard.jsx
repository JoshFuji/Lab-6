// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import WeatherCard from "../components/WeatherCard";
import SummaryStats from "../components/SummaryStats";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_KEY   = import.meta.env.VITE_WEATHERBIT_KEY;
const CITY_LIST = [
  "New York","London","Tokyo","Sydney","Cairo",
  "Paris","Toronto","São Paulo","Mumbai"
];

export default function Dashboard() {
  /* ---------- hooks ---------- */
  const [cities,  setCities]  = useState([]);
  const [loading, setLoading] = useState(true);

  const [query,   setQuery]   = useState("");      // free-text search
  const [cond,    setCond]    = useState("All");   // weather condition filter

  /* ---------- data fetch ---------- */
  useEffect(() => {
    Promise.all(
      CITY_LIST.map(name =>
        fetch(
          `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(
            name
          )}&units=M&key=${API_KEY}`
        )
          .then(r => r.json())
          .then(j => j.data?.[0])
          .then(normaliseCity)
      )
    )
      .then(setCities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ---------- unique condition list ---------- */
  const allConditions = useMemo(() => {
    const set = new Set(cities.map(c => c.weather.description));
    return ["All", ...Array.from(set).sort()];
  }, [cities]);

  /* ---------- filter pipeline ---------- */
  const visibleCities = useMemo(() => {
    if (loading) return [];

    return cities
      .filter(c =>
        c.city_name.toLowerCase().includes(query.toLowerCase())
      )
      .filter(c =>
        cond === "All" ? true : c.weather.description === cond
      );
  }, [cities, query, cond, loading]);

  /* ---------- chart data ---------- */
  const tempByCondition = useMemo(() => {
    return Object.entries(
      visibleCities.reduce((m, c) => {
        m[c.weather.description] = (m[c.weather.description] || 0) + 1;
        return m;
      }, {})
    ).map(([name, value]) => ({ name, value }));
  }, [visibleCities]);

  const top10Temps = useMemo(
    () => [...visibleCities].sort((a, b) => b.temp - a.temp).slice(0, 10),
    [visibleCities]
  );

  /* ---------- render ---------- */
  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading weather…</p>;
  }

  return (
    <>
      {/* search & filter bar */}
      <div className="filter-bar-fixed">
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search city…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select value={cond} onChange={e => setCond(e.target.value)}>
            {allConditions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <SummaryStats
        totalCities={visibleCities.length}
        averageTemp={(
          visibleCities.reduce((s, c) => s + c.temp, 0) / visibleCities.length
        ).toFixed(1)}
        hottestCity={top10Temps[0]}
      />

      {/* charts */}
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <ResponsiveContainer width={400} height={300}>
          <PieChart>
            <Pie data={tempByCondition} dataKey="value" nameKey="name" outerRadius={120} label>
              {tempByCondition.map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width={500} height={300}>
          <BarChart data={top10Temps}>
            <XAxis dataKey="city_name" />
            <YAxis unit="°C" />
            <Tooltip />
            <Bar dataKey="temp" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* list */}
      <div className="header-row">
        <div>City</div><div>Condition</div><div>Temp</div><div>RH</div><div>Wind</div>
      </div>
      <div className="weather-list-scroll">
        {visibleCities.map(c => <WeatherCard key={c.city_name} city={c} />)}
      </div>
    </>
  );
}

/* ---------- helpers ---------- */
function normaliseCity(raw) {
  if (!raw) return {};
  return {
    city_name: raw.city_name,
    temp:      raw.temp,
    rh:        raw.rh,
    wind_spd:  raw.wind_spd,
    weather:   { description: raw.weather.description },
  };
}
