import React from "react";
import { lineColors } from "../../utils/lineColors";

export default function ResultView({ data, onBack }) {
  if (!data) {
    return <p className="text-gray-400 p-4">No route data available.</p>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-lg font-bold">Route Summary</h2>
        <button
          onClick={onBack}
          className="border border-white/10 px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
        >
          Back
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 text-sm space-y-3 [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-[#32B67A]"
      >
        <div className="space-y-1">
          <p>
            <span className="text-gray-400">From:</span>{" "}
            <strong>{data.start_station_code}</strong>
          </p>
          <p>
            <span className="text-gray-400">To:</span>{" "}
            <strong>{data.end_station_code}</strong>
          </p>
          {(data.route_description || "").split(/\n|\\n/).map((line, i) => (
            <p key={i} className="text-gray-300 text-xs mt-3">
              {line}
            </p>
          ))}
        </div>

        <div className="border-t border-white/10 my-2"></div>

        <div className="flex flex-wrap gap-4 text-xs justify-center">
          <div>
            <span className="text-gray-400">Total Stations:</span>{" "}
            {data.stats?.total_stations}
          </div>
          <div>
            <span className="text-gray-400">Fare:</span>{" "}
            {data.fare_total} THB
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
              {/* <span
                className="absolute -left-[7px] top-1 w-3 h-3 rounded-full border border-gray-800"
                style={{
                  backgroundColor: lineColors[step.line] || "#32B67A",
                }}
              ></span> */}

              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">
                  {step.action}
                </span>
                <span className="text-gray-300 text-xs">
                  {step.station?.name} ({step.station?.code})
                </span>
                {step.line && (
                  <span
                    className={`inline-block mt-1 w-fit px-2 py-0.5 rounded bg-gray-700 text-[10px] ${
                      step.line === "MRT Yellow Line Monorail" || step.line == "MRT Pink Line Monorail" || step.line == "BTS Gold Line" ? "text-black" : "text-white"
                    }`}
                    style={{
                      backgroundColor: lineColors[step.line] || "#32B67A",
                    }}
                  >
                    Line: {step.line}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
