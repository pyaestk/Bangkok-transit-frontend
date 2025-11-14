import { useState, useEffect, useMemo } from "react";
import FiltersCard from "../component/stations/FiltersCard";
import { useStations } from "../hooks/useStations";
import { lineColors } from "../utils/lineColors";
import { useNavigate, useLocation } from "react-router-dom";

export default function Stations() {
  const location = useLocation();
  const lineName = location?.state?.lineName || "All";

  const selectedStation = useMemo(
    () => ({
      line: { name_en: lineName },
    }),
    [lineName]
  );

  const { stations = [], isLoading, error } = useStations();
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

    // Filter by station name or station ID
    if (searchValue.trim() !== "") {
      const query = searchValue.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name_en.toLowerCase().includes(query) ||
          s.station_code?.toLowerCase().includes(query)
      );
    }

    setFilteredStations(filtered);
  };

  useEffect(() => {
    if (!stations || stations.length === 0) return;

    // Apply default line filter if navigated from TrainRoutes
    if (lineName && lineName !== "All") {
      handleFilterChange(lineName, "");
    } else {
      setFilteredStations(stations);
    }
  }, [stations, lineName]);

  const nav = useNavigate();

  function openStartStation(station) {
    nav("/map", { state: { startStation: station.station_code || "" } });
  }
  function openTargetStation(station) {
    nav("/map", { state: { targetStation: station.station_code || "" } });
  }
  function openStationMap(station) {
    nav("/map", { state: { showStation: station.station_code || "" } });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-5 text-white w-full mx-auto max-w-7xl">
      {/* Left Filter Card */}
      <div className="w-full md:w-90">
        <FiltersCard
          selectedStation={selectedStation}
          onFilterChange={handleFilterChange}
        />

        {/* Button Guide */}
        <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/10">
          <p className="text-sm font-semibold text-gray-300 mb-2">
            Button Guide
          </p>

          <p className="text-gray-500 text-xs leading-relaxed">
            <span className="font-semibold text-gray-300">Map</span> - View
            station on the transit map.
            <br />
            <span className="font-semibold text-gray-300">From</span> - Set as
            your starting point.
            <br />
            <span className="font-semibold text-gray-300">To</span> - Set as
            your destination.
          </p>
        </div>
      </div>

      {/* Right Result Box */}
      <div className="
        flex-1 rounded-2xl bg-gray-900/40 border border-gray-800/60 shadow-lg 
        text-white flex flex-col p-2

        min-h-[70vh]
        h-[calc(100vh-160px)]
        md:h-[83vh]
      ">

        <h2 className="text-lg font-bold mb-4 px-3 pt-1">
          Stations <span>({filteredStations.length})</span>
        </h2>

        <div
          className="flex-1 overflow-y-auto pr-2 rounded-2xl bg-black/30 border border-gray-800/60 shadow-lg
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-700/40
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#32B67A]/70
            hover:[&::-webkit-scrollbar-thumb]:bg-[#32B67A"
        >
          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#32B67A] mb-4"></div>
              <p className="text-sm text-gray-300 opacity-80 flex items-center justify-center">
                Loading stations...
              </p>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] text-center">
              <p className="text-red-400 font-semibold flex items-center justify-center">
                Failed to load stations
              </p>
              <p className="text-gray-400 text-sm mt-1">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {filteredStations.length === 0 ? (
                <p className="text-gray-400 text-sm h-full w-full flex items-center justify-center">
                  No stations match your filter.
                </p>
              ) : (
                <ul className="">
                  {filteredStations.map((station) => (
                    <li
                      key={station.station_code}
                      className="flex ms-2 items-center justify-between py-3 transition rounded-lg px-1"
                    >
                      {/* Left side info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-3.5 h-2 rounded-full border border-white/20 flex-shrink-0"
                          style={{
                            backgroundColor:
                              lineColors[station.line?.name_en] || "#999",
                          }}
                        ></div>

                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">
                            {station.name_en}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {station.line?.name_en} ({station.station_code})
                          </p>
                        </div>
                      </div>

                      {/* Right action buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openStationMap(station)}
                          className="px-2 py-1 text-xs border border-gray-700 text-gray-200 hover:bg-gray-800 rounded"
                        >
                          Map
                        </button>
                        <button
                          onClick={() => openStartStation(station)}
                          className="px-2 py-1 text-xs border border-gray-700 text-gray-200 hover:bg-gray-800 rounded"
                        >
                          From
                        </button>
                        <button
                          onClick={() => openTargetStation(station)}
                          className="px-2 py-1 text-xs border border-gray-700 text-gray-200 hover:bg-gray-800 rounded"
                        >
                          To
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
