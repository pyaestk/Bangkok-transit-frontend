// src/component/map/AllRoutesBox.jsx
import { lineColors } from "../../utils/lineColors";

export default function AllRoutesBox({ routes, onSelectRoute, onBack }) {

  if (!routes || routes.length === 0)
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        No routes found yet.
      </div>
    );

  return (
    <div className="p-4 h-full flex flex-col min-h-0">
      <div className="flex px-1 pb-4 flex-row justify-between items-center">
        <h3 className="text-base font-semibold">
          All Route Options ({routes.length})
        </h3>
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white"
        >
          Back to Planner
        </button>

      </div>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Scrollable area */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 rounded-xl
          border border-white/10 bg-black/20
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-[#32B67A]"
        >
          {routes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => onSelectRoute(route)}
              className="rounded-xl bg-gray-800/40 border border-white/10 hover:border-[#32B67A] 
              transition cursor-pointer p-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm text-white">
                  {route.path_type || "Route"} #{idx + 1}
                </h3>
                <span className="text-xs text-[#32B67A] font-medium">
                  {route.fare_total} THB
                </span>
              </div>

              {/* Description */}
              {/* <p className="text-xs text-gray-400 mb-2">
                {route.route_description || "No description"}
              </p> */}

              {/* Stats */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-300 my-4">
                <span>Total Stations: {route.stats?.total_stations} </span>
                <span>Transfers: {route.stats?.total_transfers} </span>
                <span>Lines: {route.stats?.total_lines}</span>
              </div>

              {/* Line color badges */}
              <div className="flex flex-wrap gap-1 mt-1">
                {route.route_steps?.slice(0, 4).map((step, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      step.line === "MRT Yellow Line Monorail" || step.line == "MRT Pink Line Monorail" || step.line == "BTS Gold Line" || step.line == "BTS Sukhumvit Line" ? "text-black" : "text-white"
                    }`}
                    style={{
                      backgroundColor:
                        lineColors[step.line] || "rgba(255,255,255,0.1)",
                    }}
                  >
                    {step.line?.split(" ")[1] || step.line}
                  </span>
                ))}
                {route.route_steps?.length > 4 && (
                  <span className="text-gray-400 text-[10px]">+ more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
