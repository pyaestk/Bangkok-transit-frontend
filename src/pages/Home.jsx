import { useEffect, useMemo, useState } from "react";
import { useStations } from "../hooks/useStations";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [quickFrom, setQuickFrom] = useState("");
  const [quickTo, setQuickTo] = useState("");

  const { stations } = useStations();

  const [suggestStart, setSuggestStart] = useState([]);
  const [suggestEnd, setSuggestEnd] = useState([]);

  const getSuggestions = (value) => {
    const query = value.trim().toLowerCase();
    if (!query) return [];

    return stations
      .filter((station) => {
        const name = station.name_en.toLowerCase();
        const code = station.station_code.toLowerCase();
        return name.includes(query) || code.includes(query);
      })
      .slice(0, 8);
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto text-white flex flex-col">
      <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="col-span-3 bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Navigate Bangkok smarter
          </h1>

          <p className="text-gray-300 text-sm md:text-base mb-6 max-w-xl">
            Plan trips, explore lines, check fares and live alerts for BTS, MRT,
            Airport Rail Link and SRT lines.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "Real-time style UI",
              "Mobile-first",
              "Dark UI",
              "Keyboard friendly",
            ].map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/map")}
              className="px-5 py-2 rounded-lg bg-[#32B67A] hover:bg-[#2acc83] text-black font-semibold shadow-md"
            >
              View Network Map
            </button>
            <button
              onClick={() => navigate("/planner")}
              className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              View Trip Planner
            </button>
            <button
              onClick={() => navigate("/routes")}
              className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              View Routes
            </button>
          </div>
        </div>

        {/* Quick Planner */}
        <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-4">Quick Planner</h3>

          <div className="flex flex-col gap-4 justify-center">
            {/* FROM */}
            <label className="block mx-1 text-sm">From</label>
            <div className="relative">
              <input
                value={quickFrom}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuickFrom(value);
                  setSuggestStart(getSuggestions(value));
                }}
                placeholder="E.g., Siam"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-[#32B67A] disabled:cursor-not-allowed disabled:opacity-50"
              />

              {suggestStart.length > 0 && (
                <ul
                  className="absolute z-40 left-0 right-0 mt-1 max-h-56 overflow-y-auto
                    rounded-lg border border-white/10 bg-black shadow-2xl
                    transition-all duration-200 ease-out
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
                  {suggestStart.map((station) => (
                    <li
                      key={station.station_code}
                      onClick={() => {
                        setQuickFrom(station.name_en);
                        setSuggestStart([]);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-white/10 text-sm flex justify-between"
                    >
                      <span>{station.name_en}</span>
                      <span className="text-gray-400">
                        {station.station_code}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TO */}
            <label className="block mx-1 text-sm">To</label>
            <div className="relative">
              <input
                value={quickTo}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuickTo(value);
                  setSuggestEnd(getSuggestions(value));
                }}
                placeholder="E.g., Mo Chit"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-[#32B67A] disabled:cursor-not-allowed disabled:opacity-50"
              />

              {suggestEnd.length > 0 && (
                <ul
                  className="absolute z-40 left-0 right-0 mt-1 max-h-56 overflow-y-auto
                    rounded-2xl border border-white/10 bg-black shadow-2xl
                    transition-all duration-200 ease-out
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
                  {suggestEnd.map((station) => (
                    <li
                      key={station.station_code}
                      onClick={() => {
                        setQuickTo(station.name_en);
                        setSuggestEnd([]);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-white/10 text-sm flex justify-between"
                    >
                      <span>{station.name_en}</span>
                      <span className="text-gray-400">
                        {station.station_code}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6 text-sm">
            <button
              onClick={() =>
                navigate("/planner", {
                  state: {
                    from: quickFrom,
                    to: quickTo,
                  },
                })
              }
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Open in Planner
            </button>

            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
              Open in Map
            </button>
          </div>
        </div>
      </div>

      {/* ===================== Stats Section ===================== */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-5 mt-5 ">
        <StatBox label="Total Lines" value="10" />
        <StatBox label="Total Stations" value="240+ " />
        <StatBox label="Coverage" value="Citywide" />
        <StatBox label="Network" value="2025" />
      </div>

      {/* <div className="w-full grid md:grid-cols-2 gap-5 mt-5">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-6">
          <div className="space-y-4 mb-2">
            <LinePreview color="#3da5ff" />
            <LinePreview color="#34d399" />
            <LinePreview color="#ef4444" />
            <LinePreview color="#fbbf24" />
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Stylized preview of transit lines
          </p>
        </div>


        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Live Service Highlights
          </h3>

          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <b className="text-blue-400">MRT Blue:</b> Minor delays near Hua
              Lamphong
            </p>
            <p>
              <b className="text-[#2acc83]">BTS Sukhumvit:</b> Normal service
            </p>
            <p>
              <b className="text-yellow-300">Gold Line:</b> 10–12 min headways
            </p>
            <p>
              <b className="text-red-400">SRT Red:</b> Weekend timetable in
              effect
            </p>
          </div>

          <button className="mt-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
            View all alerts
          </button>
        </div>
      </div> */}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-4 ">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

function LinePreview({ color }) {
  return (
    <div className="w-full h-2 rounded-full bg-white/5 relative">
      <div
        className="absolute inset-y-0 flex items-center"
        style={{ width: "100%" }}
      >
        <div
          className="h-1 rounded-full"
          style={{ backgroundColor: color, width: "100%" }}
        ></div>
      </div>
    </div>
  );
}
