import { useState, useEffect } from "react";
import FiltersCard from "../component/stations/FiltersCard";
import { useStations } from "../hooks/useStations";

export default function Stations() {
  const { stations } = useStations();
  const [filteredStations, setFilteredStations] = useState([]);

  // Handle filter updates
  const handleFilterChange = (selectedLine, searchValue) => {
    let filtered = stations;

    // Filter by line
    if (selectedLine !== "All") {
      filtered = filtered.filter(
        (s) => s.line?.name_en?.toLowerCase() === selectedLine.toLowerCase()
      );
    }

    // Filter by station name
    if (searchValue.trim() !== "") {
      filtered = filtered.filter((s) =>
        s.name_en.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredStations(filtered);
  };

  useEffect(() => {
    setFilteredStations(stations); // Show all initially
  }, [stations]);

  return (
    <div className="flex flex-col sm:flex-row gap-5 text-white w-full">
      {/* Left Filter Card */}
      <div className="w-full md:w-90">
        <FiltersCard selectedStation={null} onFilterChange={handleFilterChange} />
      </div>

      {/* Right Result Box */}
      <div className="flex-1 border border-white/10 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg h-[80vh] p-4 text-white flex flex-col">
        <h2 className="text-lg font-bold mb-3">Stations</h2>

        <div
          className="flex-1 overflow-y-auto rounded-xl border border-white/10 p-3 bg-black/25 backdrop-blur-sm 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-700/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#32B67A]/70
          hover:[&::-webkit-scrollbar-thumb]:bg-[#32B67A]"
        >
          {filteredStations.length === 0 ? (
            <p className="text-gray-400 text-sm mt-2">
              No stations match your filter.
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredStations.map((station) => (
                <li
                  key={station.station_code}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/10 hover:bg-black/40 transition"
                >
                  <div>
                    <p className="font-medium text-white">{station.name_en}</p>
                    <p className="text-xs text-gray-400">
                      {station.line?.name_en} – {station.station_code}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">
                      Map
                    </button>
                    <button className="px-2 py-1 text-xs   bg-gray-700 hover:bg-gray-600 rounded">
                      From
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">
                      To
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
