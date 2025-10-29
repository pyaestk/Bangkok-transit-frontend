import { useState, useEffect } from "react";
import LinesDropdown from "./LinesDropDown";

export default function FiltersCard({
  onFilterChange,
  selectedStation,
}) {
  const [selectedLine, setSelectedLine] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  // Line selection
  const handleLineChange = (line) => {
    setSelectedLine(line);
    if (onFilterChange) onFilterChange(line, searchValue);
  };

  // Text input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onFilterChange) onFilterChange(selectedLine, value);
  };

  // Autofill when map selects station
  useEffect(() => {
    if (selectedStation) {
      const lineName = selectedStation.line?.name_en || "All";
      const stationName = selectedStation.name_en || selectedStation.name || "";
      setSelectedLine(lineName);
      setSearchValue(stationName);
      if (onFilterChange) onFilterChange(lineName, stationName);
    }
  }, [selectedStation]);

  return (
    <div className="border border-white/10 p-4 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
      <h2 className="text-lg font-bold mb-4 mx-1">Filter</h2>

      {/* Line Filter */}
      <label className="block mb-2 mx-1">Line</label>
      <LinesDropdown onChange={handleLineChange} selectedLine={selectedLine} />

      {/* Search Input */}
      <label className="block mt-4 mb-2 mx-1">Search Station</label>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        placeholder="Type a station name..."
        className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
}
