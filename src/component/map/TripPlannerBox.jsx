import { useState, useEffect } from "react";
import LinesDropdown from "./LinesDropdown";
import { useShortestPath } from "../../hooks/useShortestPath";
// import { ArrowDown } from "lucide-react"; // optional, for visual arrows

export default function TripPlannerBox({
  selectedStartStation,
  selectedTargetStation,
}) {
  const [startStation, setStartStation] = useState("");
  const [startStationCode, setStartStationCode] = useState("");
  const [targetStation, setTargetStation] = useState("");
  const [targetStationCode, setTargetStationCode] = useState("");
  const [showResult, setShowResult] = useState(false);

  const { pathData, isLoading, error, getShortestPath } = useShortestPath();

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
    await getShortestPath(startStationCode, targetStationCode);
  };

  useEffect(() => {
    if (pathData?.data) setShowResult(true);
  }, [pathData]);

  const handleBack = () => setShowResult(false);

  const data = pathData?.data;

  return (
    <div className="border border-white/10 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg w-full max-h-[80vh] text-white flex flex-col transition-all duration-300">
      {!showResult ? (
        // --- TRIP PLANNER VIEW ---
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-lg font-bold mb-3 mx-1">Trip Planner</h2>

          <label className="block mb-2 mx-1 text-sm">From</label>
          <input
            value={
              startStation + (startStationCode ? ` - ${startStationCode}` : "")
            }
            type="text"
            className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10"
            readOnly
          />

          <label className="block mx-1 mt-3 mb-2 text-sm">To</label>
          <input
            value={
              targetStation +
              (targetStationCode ? ` - ${targetStationCode}` : "")
            }
            type="text"
            className="w-full text-sm px-3 py-2 rounded-lg bg-black/30 border border-white/10"
            readOnly
          />

          <div className="flex flex-row space-x-3 justify-between my-3">
            <div className="flex-1">
              <label className="block mx-1 mb-2 text-sm">Preferences</label>
              <LinesDropdown />
            </div>
          </div>

          <div className="flex flex-wrap space-x-3 mt-4 justify-between text-sm">
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
          </div>

          {error && <p className="text-red-400 mt-3">{error}</p>}
        </div>
      ) : (
        // --- RESULT VIEW ---
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-lg font-bold">Route Summary</h2>
            <button
              onClick={handleBack}
              className="border border-white/10 px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
            >
              Back
            </button>
          </div>

          {data ? (
            <div className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
              <div className="space-y-1">
                <p>
                  <span className="text-gray-400">From:</span>{" "}
                  <strong>{data.start_station_code}</strong>
                </p>
                <p>
                  <span className="text-gray-400">To:</span>{" "}
                  <strong>{data.end_station_code}</strong>
                </p>
                <p className="text-gray-300 text-xs whitespace-pre-line mt-3">
                  {data.route_description || ""}
                </p>
              </div>

              <div className="border-t border-white/10 my-2"></div>

              <div className="flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Total Stations:</span>{" "}
                  {data.stats?.total_stations}
                </div>
                <div>
                  <span className="text-gray-400">Transfers:</span>{" "}
                  {data.stats?.total_transfers}
                </div>
                <div>
                  <span className="text-gray-400">Lines:</span>{" "}
                  {data.stats?.total_lines}
                </div>
              </div>

              <div className="border-t border-white/10 my-2"></div>

              <h3 className="font-semibold mb-2">Step-by-Step Route:</h3>

              <ul className="relative ml-3 border-l border-gray-600 space-y-4">
                {data.route_steps?.map((step, index) => (
                  <li key={index} className="pl-4 relative">
                    {/* timeline dot */}
                    <span className="absolute -left-[7px] top-1 w-3 h-3 bg-[#32B67A] rounded-full border border-gray-800"></span>

                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm">
                        {step.action}
                      </span>
                      <span className="text-gray-300 text-xs">
                        {step.station?.name} ({step.station?.code})
                      </span>
                      {step.line && (
                        <span className="inline-block mt-1 w-fit px-2 py-0.5 rounded bg-gray-700 text-[10px] text-gray-200">
                          Line: {step.line}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 p-4">No route data available.</p>
          )}
        </div>
      )}
    </div>
  );
}
