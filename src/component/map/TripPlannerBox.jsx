import { useState, useEffect } from "react";
import LinesDropDown from "./LinesDropdown";
import PreferencesDropdown from "./PreferencesDropDown";
import { useShortestPath } from "../../hooks/useShortestPath";
import { useLongestPath } from "../../hooks/useLongestPath";
import ResultView from "./ResultBox.jsx";
// import { ArrowDown } from "lucide-react"; // optional, for visual arrows

export default function TripPlannerBox({
  selectedStartStation,
  selectedTargetStation,
  resetTrigger,
  onPathStations,
}) {
  const [startStation, setStartStation] = useState("");
  const [startStationCode, setStartStationCode] = useState("");
  const [targetStation, setTargetStation] = useState("");
  const [targetStationCode, setTargetStationCode] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [preference, setPreference] = useState("Shortest");

  const {
    pathData: shortestData,
    isLoading: isShortestLoading,
    error: shortestError,
    getShortestPath,
    resetPath: shortestReset,
  } = useShortestPath();

  const {
    pathData: longestData,
    isLoading: isLongestLoading,
    error: longestError,
    getLongestPath,
    resetPath: longestReset,
  } = useLongestPath();

  useEffect(() => {
    setStartStation("");
    setStartStationCode("");
    setTargetStation("");
    setTargetStationCode("");
    setPreference("Shortest");
    setShowResult(false);

    // reset path data from hooks
    if (typeof shortestReset === "function") shortestReset();
    if (typeof longestReset === "function") longestReset();

    // clear parent map route
    if (onPathStations) onPathStations([]);
  }, [resetTrigger]);

  // Unified state selection
  const isLoading = isShortestLoading || isLongestLoading;
  const error = shortestError || longestError;
  const pathData = preference === "Longest" ? longestData : shortestData;

  // Sync with map clicks
  useEffect(() => {
    if (selectedStartStation) {
      setStartStation(selectedStartStation.name_en || "");
      setStartStationCode(selectedStartStation.station_code || "");
    }
  }, [selectedStartStation]);

  useEffect(() => {
    if (selectedTargetStation) {
      setTargetStation(selectedTargetStation.name_en || "");
      setTargetStationCode(selectedTargetStation.station_code || "");
    }
  }, [selectedTargetStation]);

  const handlePlanRoute = async () => {
    if (!startStationCode || !targetStationCode) {
      alert("Please select both start and target stations.");
      return;
    }
    if (preference === "Longest") {
      await getLongestPath(startStationCode, targetStationCode);
    } else {
      await getShortestPath(startStationCode, targetStationCode);
    }
  };

  // useEffect(() => {
  //   if (pathData?.data) setShowResult(true);
  // }, [pathData]);

  useEffect(() => {
    if (pathData?.data) {
      setShowResult(true);
      if (onPathStations) {
        onPathStations(pathData.data.stations || []); // send stations to parent
      }
    }
  }, [pathData]);
  const handleBack = () => setShowResult(false);

  const data = pathData?.data;

  return (
    <div className="border border-white/10 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg w-full max-h-[80vh] text-white flex flex-col transition-all duration-300">
      {!showResult ? (
        // --- TRIP PLANNER VIEW ---
        <div className="flex-1 overflow-visible p-4">
          <h2 className="text-lg font-bold mb-3 mx-1">Trip Planner</h2>

          <label className="block mb-2 mx-1 text-sm">From</label>
          <input
            value={
              startStation + (startStationCode ? ` - ${startStationCode}` : "")
            }
            placeholder="Enter Start Station"
            type="text"
            className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none"
          />

          <label className="block mx-1 mt-3 mb-2 text-sm">To</label>
          <input
            value={
              targetStation +
              (targetStationCode ? ` - ${targetStationCode}` : "")
            }
            placeholder="Enter Target Station"
            type="text"
            className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none"
            // readOnly
          />

          <div className="flex flex-row space-x-3 justify-between my-3">
            <div className="flex-1">
              <label className="block mx-1 mb-2 text-sm">Preferences</label>
              {/* <LinesDropdown /> */}
              <PreferencesDropdown
                selectedPreference={preference}
                onChange={(value) => setPreference(value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap space-x-3 mt-7 justify-between text-sm">
            <button
              onClick={handlePlanRoute}
              disabled={isLoading}
              className="flex-1 border border-white/10 px-4 py-2 rounded-lg bg-[#32B67A] text-black font-semibold hover:bg-[#2acc83] disabled:opacity-60"
            >
              {isLoading ? "Planning..." : "Plan Route"}
            </button>
            <button className="flex-1 border border-white/10 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-white/10">
              Fare Estimate
            </button>
            
            {/* <div className="p-3 rounded-lg bg-black/20 border border-white/10 text-xs text-gray-300 leading-relaxed w-full">
              <p className="font-semibold text-white mb-1">💡 How to Use:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Click on a station on the map to set your <span className="text-[#32B67A] font-medium">start</span> and <span className="text-red-400 font-medium">destination</span>.</li>
                <li>After selecting both, choose your <span className="text-white font-medium">preference</span> — <span className="text-[#32B67A] font-medium">Shortest</span> or <span className="text-blue-400 font-medium">Longest</span> route.</li>
                <li>Press <span className="text-white font-medium">Plan Route</span> to calculate the path between stations.</li>
                <li>Use <span className="text-white font-medium">Reset Station</span> on the map to start over.</li>
                <li>Use <span className="text-white font-medium">Zoom</span> (+ / −) and <span className="text-white font-medium">⟳ Reset View</span> to explore the map easily.</li>
              </ul>
            </div> */}
          </div>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      ) : (
        // --- RESULT VIEW ---
        <ResultView data={data} onBack={handleBack} />
      )}
    </div>
  );
}
