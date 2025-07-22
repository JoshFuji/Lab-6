const SummaryStats = ({ totalCities, averageTemp, hottestCity }) => (
  <div className="summary-stats">
    <div className="stat-box">
      <h3>Total Cities</h3>
      <p>{totalCities}</p>
    </div>
    <div className="stat-box">
      <h3>Average Temp</h3>
      <p>{averageTemp}°C</p>
    </div>
    <div className="stat-box">
      <h3>Hottest City</h3>
      <p>{hottestCity.city_name} ({hottestCity.temp}°C)</p>
    </div>
  </div>
);

export default SummaryStats;
