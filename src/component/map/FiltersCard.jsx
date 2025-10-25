import { useState, useEffect } from "react";
import LinesDropdown from "./LinesDropdown"

export default function FiltersCard({selectedStation}) {
  const [selectedLine, setSelectedLine] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (selectedStation) {
      const lineName = selectedStation.line?.name_en || "All";
      const stationName = selectedStation.name_en || selectedStation.name || "";

      // auto-fill both fields
      setSelectedLine(lineName);
      setSearchValue(stationName);
    }
  }, [selectedStation]);

  const handleLineChange = (line) => {
    console.log("Selected Line:", line); 
    setSelectedLine(line);
  };

  return (
    <div className="border border-white/10 p-4 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
      <h2 className="text-lg font-bold mb-4 mx-1">Filters</h2>

      <label className="block mb-2 mx-1 my-4">Lines</label>
      <LinesDropdown onChange={handleLineChange} selectedLine={selectedLine} />

      {/* Search station */}
      <label className="block my-4 mx-1">Search station</label>
      <input
        type="text"
        value={searchValue} //controlled input
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Type a station…"
        className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 placeholder-gray-400 focus:outline-none"
      />

      {/* Buttons */}
      <div className="flex flex-col space-y-2 mt-4 text-sm">
        <button className="border border-white/10 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-white/10">
          Apply
        </button>
        <button className="border border-white/10 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-white/10">
          Show In Planner
        </button>
      </div>

      {/* Line Pills */}
      <div className="flex flex-wrap gap-2 mt-6 mb-4 text-sm">
        <span className="flex items-center px-3 py-1 rounded-full bg-white/10">
          <span className="w-4 h-2 rounded-full bg-blue-500 mr-2"></span>
          Blue
        </span>
        <span className="flex items-center px-3 py-1 rounded-full bg-white/10">
          <span className="w-4 h-2 rounded-full bg-green-500 mr-2"></span>
          Sukhumvit
        </span>
        <span className="flex items-center px-3 py-1 rounded-full bg-white/10">
          <span className="w-4 h-2 rounded-full bg-green-700 mr-2"></span>
          Silom
        </span>
        <span className="flex items-center px-3 py-1 rounded-full bg-white/10">
          <span className="w-4 h-2 rounded-full bg-red-500 mr-2"></span>
          Red
        </span>
        <span className="flex items-center px-3 py-1 rounded-full bg-white/10">
          <span className="w-4 h-2 rounded-full bg-yellow-500 mr-2"></span>
          Yellow
        </span>
        <span className="flex items-center px-3 py-1 rounded-full bg-white/10">
          <span className="w-4 h-2 rounded-full bg-pink-400 mr-2"></span>
          Pink
        </span>
      </div>
    </div>
  );
}
