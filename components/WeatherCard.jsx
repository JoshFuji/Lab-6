import { Link } from "react-router-dom";

const WeatherCard = ({ city }) => (
  <Link to={`/city/${city.city_name}`} className="weather-row">
    <div className="city-name">{city.city_name}</div>
    <div>{city.weather.description}</div>
    <div>{city.temp.toFixed(1)}°C</div>
    <div>{city.rh}%</div>
    <div>{city.wind_spd} m/s</div>
  </Link>
);

export default WeatherCard;
