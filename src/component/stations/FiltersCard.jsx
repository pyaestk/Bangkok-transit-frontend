import { useState, useEffect, useRef } from "react";
import LinesDropdown from "./LinesDropDown";

export default function FiltersCard({ onFilterChange, selectedStation }) {
  const [selectedLine, setSelectedLine] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const hasUserChanged = useRef(false); // 👈 track manual interaction

  // Line selection (manual)
  const handleLineChange = (line) => {
    hasUserChanged.current = true; // 👈 user interacted
    setSelectedLine(line);
    if (onFilterChange) onFilterChange(line, searchValue);
  };

  // Text input (manual)
  const handleSearch = (e) => {
    hasUserChanged.current = true;
    const value = e.target.value;
    setSearchValue(value);
    if (onFilterChange) onFilterChange(selectedLine, value);
  };

  // Autofill only once, unless user has changed something
  useEffect(() => {
    if (selectedStation && !hasUserChanged.current) {
      const lineName = selectedStation.line?.name_en || "All";
      const stationName =
        selectedStation.name_en || selectedStation.name || "";
      setSelectedLine(lineName);
      setSearchValue(stationName);
      if (onFilterChange) onFilterChange(lineName, stationName);
    }
  }, [selectedStation]);

  return (
    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl shadow-lg text-white">
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
        placeholder="Enter station name or code"
        className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 placeholder-gray-400 focus:outline-none"
      />

      {/* Filter Tip */}
      <p className="text-gray-500 text-xs mt-3 mx-1 leading-relaxed">
        Tip: Use the Line dropdown to
        filter by transit line, or search by name or station code.
      </p>
    </div>
  );
}
