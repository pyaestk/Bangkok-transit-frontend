import { useState, useEffect, useRef } from "react";
import { useStations } from "../../hooks/useStations";
import PreferencesDropdown from "./PreferencesDropDown";
import { useShortestPath } from "../../hooks/useShortestPath";
import { useCheapestPath } from "../../hooks/useCheapestPath";
import { useAllPaths } from "../../hooks/useAllPaths.jsx";
import ResultView from "./ResultBox.jsx";
import AllRoutesBox from "./AllRoutesBox.jsx";

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
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routes, setRoutes] = useState([]);

  const { stations } = useStations();
  const [filteredStart, setFilteredStart] = useState([]);
  const [filteredTarget, setFilteredTarget] = useState([]);

  const [hasPlannedRoute, setHasPlannedRoute] = useState(false);

  const startRef = useRef(null);
  const targetRef = useRef(null);

  // Hooks for each API
  const { 
    pathData: shortestData, 
    isLoading: isShortestLoading, 
    error: shortestError, 
    getShortestPath, 
    resetPath: shortestReset 
  } = useShortestPath();

  const { pathData: cheapestData, 
    isLoading: isCheapestLoading, 
    error: cheapestError, 
    getCheapestPath, 
    resetPath: cheapestReset 
  } = useCheapestPath();

  const { 
    pathData: allData, 
    isLoading: isAllLoading, 
    error: allError, 
    getAllPaths, 
    resetPath: allReset 
  } = useAllPaths();

  const isAllRoutesMode = preference === "All Routes";

  // Reset on external trigger
  useEffect(() => {
    setStartStation("");
    setStartStationCode("");
    setTargetStation("");
    setTargetStationCode("");
    setPreference("Shortest");
    setShowResult(false);
    setSelectedRoute(null);
    setRoutes([]);

    shortestReset?.();
    cheapestReset?.();
    allReset?.();
    onPathStations?.([]);
  }, [resetTrigger]);

  // Suggestion box
  const handleStartInput = (e) => {
    const value = e.target.value;
    setFilteredStart(
      value.trim()
        ? stations.filter(
            (s) =>
              s.name_en.trim().toLowerCase().includes(value.toLowerCase()) ||
              s.station_code.trim().toLowerCase().includes(value.toLowerCase())
          ).slice(0, 10)
        : []
    );
    setStartStation(value);
  };

  const handleTargetInput = (e) => {
    const value = e.target.value;
    setFilteredTarget(
      value.trim()
        ? stations.filter(
            (s) =>
              s.name_en.toLowerCase().includes(value.toLowerCase()) ||
              s.station_code.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 10)
        : []
    );
    setTargetStation(value);
  };

  const handleSelectStart = (station) => {
    setStartStation(station.name_en);
    setStartStationCode(station.station_code);
    setFilteredStart([]);
  };

  const handleSelectTarget = (station) => {
    setTargetStation(station.name_en);
    setTargetStationCode(station.station_code);
    setFilteredTarget([]);
  };

  // Sync map clicks
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

  // Plan route handler
  const handlePlanRoute = async () => {
    setHasPlannedRoute(true);
    if (!startStationCode || !targetStationCode) {
      alert("Please select both start and target stations.");
      return;
    }

    if (isAllRoutesMode) {
      await getAllPaths(startStationCode, targetStationCode);
    } else if (preference === "Cheapest") {
      await getCheapestPath(startStationCode, targetStationCode);
    } else {
      await getShortestPath(startStationCode, targetStationCode);
    }
  };

  // Watch data changes
  useEffect(() => {
    if (!hasPlannedRoute || isAllRoutesMode) return;

    let activeData = null;
    if (preference === "Shortest") activeData = shortestData?.data;
    else if (preference === "Cheapest") activeData = cheapestData?.data;

    if (activeData) {
      setShowResult(true);
      setSelectedRoute(activeData);
      onPathStations?.(activeData.stations || []);
    }
  }, [hasPlannedRoute, preference, shortestData, cheapestData, isAllRoutesMode]);



  useEffect(() => {
    if (isAllRoutesMode && allData?.data) {
      const list = Array.isArray(allData.data) ? allData.data : [allData.data];
      setRoutes(list);
      setShowResult(true);
    }
  }, [allData, isAllRoutesMode]);

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setShowResult(true); // switch to ResultView
    onPathStations?.(route.stations || []);
  };

  const handleBack = () => {
    if (isAllRoutesMode && selectedRoute) {
      // go back to All Routes list if coming from ResultView
      setSelectedRoute(null);
      onPathStations?.([]);
    } else {
      // go back to planner
      setShowResult(false);
      setSelectedRoute(null);
      onPathStations?.([]);
    }
  };


  const isLoading =
    isShortestLoading || isCheapestLoading || isAllLoading;
  const error =
    shortestError || cheapestError || allError;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg w-full max-h-[83vh] text-white flex flex-col transition-all duration-300">
      {!showResult ? (
        // === Trip Planner Form ===
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3 mx-1">Trip Planner</h2>
          <p className="text-gray-400 text-xs mx-1 mb-4 uppercase tracking-[0.2em]">
            Choose your stations
          </p>
          {/* From */}
          <label className="block mb-2 mx-1 text-sm">From</label>
          <div className="relative" ref={startRef}>
            <input
              value={startStation}
              onChange={handleStartInput}
              placeholder="Enter Start Station"
              type="text"
              className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 outline-none transition focus:border-[#32B67A] disabled:cursor-not-allowed disabled:opacity-50"
            />
            {filteredStart.length > 0 && (
              <ul
                className="absolute left-0 z-50 mt-2 w-full max-h-70 origin-top rounded-md bg-gray-800 border border-white/10 shadow-lg focus:outline-none
            overflow-y-auto transition-all duration-200 ease-out
            scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
            data-closed:scale-95 data-closed:opacity-0 data-closed:transform 
            data-enter:duration-100 data-enter:ease-out 
            data-leave:duration-75 data-leave:ease-in [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-[#32B67A]"
              >
                {filteredStart.map((s) => (
                  <li
                    key={s.station_code}
                    onClick={() => handleSelectStart(s)}
                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {s.name_en} –{" "}
                    <span className="text-gray-400">{s.station_code}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* To */}
          <label className="block mx-1 mt-3 mb-2 text-sm">To</label>
          <div className="relative" ref={targetRef}>
            <input
              value={targetStation}
              onChange={handleTargetInput}
              placeholder="Enter Target Station"
              type="text"
              className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10 outline-none transition focus:border-[#32B67A] disabled:cursor-not-allowed disabled:opacity-50"
            />
            {filteredTarget.length > 0 && (
              <ul
                className="absolute left-0 z-50 mt-2 w-full max-h-70 origin-top rounded-md bg-gray-800 border border-white/10 shadow-lg focus:outline-none
            overflow-y-auto transition-all duration-200 ease-out
            scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
            data-closed:scale-95 data-closed:opacity-0 data-closed:transform 
            data-enter:duration-100 data-enter:ease-out 
            data-leave:duration-75 data-leave:ease-in [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-[#32B67A]"
              >
                {filteredTarget.map((s) => (
                  <li
                    key={s.station_code}
                    onClick={() => handleSelectTarget(s)}
                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {s.name_en} –{" "}
                    <span className="text-gray-400">{s.station_code}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Preferences */}
          <div className="mt-4">
            <label className="block mx-1 mb-2 text-sm">Preference</label>
            <PreferencesDropdown
              selectedPreference={preference}
              onChange={setPreference}
            />
          </div>

          <button
            onClick={handlePlanRoute}
            disabled={isLoading}
            className="w-full mt-5 bg-[#32B67A] hover:bg-[#2acc83] text-black font-semibold rounded-lg py-2 transition disabled:opacity-50"
          >
            {isLoading ? "Planning..." : "Plan Route"}
          </button>

          <p className="text-gray-500 text-xs mt-6 mx-1">
            Tip: Type or click on stations to set your start and destination -
            suggestions appear as you type.
          </p>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      ) : selectedRoute ? (
        // Show route details when a route is selected (even from AllRoutesBox)
        <ResultView data={selectedRoute} onBack={handleBack} />
      ) : isAllRoutesMode ? (
        // Show all route options
        <AllRoutesBox
          routes={routes}
          onSelectRoute={handleSelectRoute}
          onBack={handleBack}
        />
      ) : null}
    </div>
  );
}
