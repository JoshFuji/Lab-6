const SearchBar = ({ searchQuery, setSearchQuery, selectedCondition, setSelectedCondition }) => (
  <div className="filter-bar-fixed">
    <div className="search-filter-bar">
      <input
        type="text"
        placeholder="Search by city name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        value={selectedCondition}
        onChange={(e) => setSelectedCondition(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Clear">Clear</option>
        <option value="Clouds">Clouds</option>
        <option value="Rain">Rain</option>
        <option value="Snow">Snow</option>
        <option value="Mist">Mist</option>
      </select>
    </div>
  </div>
);

export default SearchBar;
