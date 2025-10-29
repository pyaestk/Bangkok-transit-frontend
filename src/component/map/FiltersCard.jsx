import { useState, useEffect, useRef } from "react";
import LinesDropdown from "./LinesDropdown";
import { useStations } from "../../hooks/useStations";

export default function FiltersCard({ selectedStation, onSelectStation }) {
  const [selectedLine, setSelectedLine] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [filteredStations, setFilteredStations] = useState([]);
  const { stations } = useStations();
  const filterRef = useRef(null);

  // Close suggestion box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilteredStations([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofill from map selection
  useEffect(() => {
    if (selectedStation) {
      const lineName = selectedStation.line?.name_en || "All";
      const stationName = selectedStation.name_en || selectedStation.name || "";
      setSelectedLine(lineName);
      setSearchValue(stationName);
    }
  }, [selectedStation]);

  // Line dropdown handler
  const handleLineChange = (line) => {
    setSelectedLine(line);
    if (line === "All") {
      setFilteredStations([]);
      return;
    }
    const filtered = stations.filter((s) => s.line?.name_en === line);
    setFilteredStations(filtered);
  };

  // Search input handler (filters further)
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    let base = selectedLine === "All"
      ? stations
      : stations.filter((s) => s.line?.name_en === selectedLine);

    const filtered = base.filter((s) =>
      s.name_en.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStations(filtered.slice(0, 15));
  };

  // Select station handler
  const handleSelect = (station) => {
    setSearchValue(station.name_en);
    setFilteredStations([]);
    if (onSelectStation) onSelectStation(station);
  };

  return (
    <div className="border border-white/10 p-4 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
      <h2 className="text-lg font-bold mb-4 mx-1">Filter</h2>

      {/* Line selection */}
      <label className="block mb-2 mx-1">Line</label>
      <LinesDropdown onChange={handleLineChange} selectedLine={selectedLine} />

      {/* Search station input */}
      <label className="block mt-4 mb-2 mx-1">Search Station</label>
      <div className="relative" ref={filterRef}>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Type a station name..."
          className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 placeholder-gray-400 focus:outline-none"
        />
        {filteredStations.length > 0 && (
          <ul className="absolute z-10 w-full bg-gray-800 border border-white/10 rounded-lg mt-1 max-h-[250px] overflow-y-auto">
            {filteredStations.map((station) => (
              <li
                key={station.station_code}
                onClick={() => handleSelect(station)}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
              >
                {station.name_en} –{" "}
                <span className="text-gray-400">
                  {station.line?.name_en || "Unknown Line"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-2 mt-5 text-sm">
        <button
          onClick={() => handleLineChange(selectedLine)}
          className="border border-white/10 px-4 py-2 rounded-lg bg-[#32B67A] text-black font-semibold hover:bg-[#2acc83]"
        >
          Show Stations
        </button>
      </div>
    </div>
  );
}
