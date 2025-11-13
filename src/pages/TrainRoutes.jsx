// src/pages/TrainRoutes.jsx
import { useNavigate } from "react-router-dom";
import { lineColors } from "../utils/lineColors"; 

const LINES = {
  BTS: [
    {
      key: "bts-sukhumvit",
      label: "BTS Sukhumvit Line",
      sub: "Khu Khot ⇄ Kheha",
      lineId: null,
      lineName: "BTS Sukhumvit Line",
    },
    {
      key: "bts-silom",
      label: "BTS Silom Line",
      sub: "National Stadium ⇄ Bang Wa",
      lineId: null,
      lineName: "BTS Silom Line",
    },
    {
      key: "bts-gold",
      label: "BTS Gold Line",
      sub: "Krung Thonburi ⇄ Khlong San",
      lineId: null,
      lineName: "BTS Gold Line",
    },
  ],

  MRT: [
    {
      key: "mrt-blue",
      label: "MRT Blue Line",
      sub: "Loop via Tao Poon",
      lineId: null,
      lineName: "MRT Blue Line",
    },
    {
      key: "mrt-purple",
      label: "MRT Purple Line",
      sub: "Khlong Bang Phai ⇄ Tao Poon",
      lineId: null,
      lineName: "MRT Purple Line",
    },
    {
      key: "mrt-yellow",
      label: "MRT Yellow Line Monorail",
      sub: "Lat Phrao ⇄ Samrong",
      lineId: null,
      lineName: "MRT Yellow Line Monorail",
    },
    {
      key: "mrt-pink",
      label: "MRT Pink Line Monorail",
      sub: "Khae Rai ⇄ Min Buri",
      lineId: null,
      lineName: "MRT Pink Line Monorail",
    },
    {
      key: "mrt-orange",
      label: "MRT Orange Line",
      sub: "Thailand Cultural Centre ⇄ Min Buri (partial)",
      lineId: null,
      lineName: "MRT Orange Line",
    },
  ],

  SRT: [
    {
      key: "srt-light-red",
      label: "SRT Light Red Line",
      sub: "Taling Chan ⇄ Bang Sue",
      lineId: null,
      lineName: "SRT Light Red Line",
    },
    {
      key: "srt-dark-red",
      label: "SRT Dark Red Line",
      sub: "Bang Sue ⇄ Rangsit",
      lineId: null,
      lineName: "SRT Dark Red Line",
    },
    {
      key: "arl",
      label: "Airport Rail Link",
      sub: "Phaya Thai ⇄ Suvarnabhumi",
      lineId: null,
      lineName: "Airport Rail Link",
    },
  ],
};

function LineCard({ title, items }) {
  const nav = useNavigate();

  function openStations(line) {
    nav("/stations", {
      state: { lineName: line.lineName || "All" },
    });
  }


  return (
    <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-3 shadow-lg">
      <h3 className="text-gray-200 font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map((ln) => (
          <div
            key={ln.key}
            className="flex items-center justify-between bg-black/30 border border-gray-800 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {/* Color indicator */}
              <div
                className="w-4.5 h-2.5 rounded-full border border-white/20"
                style={{
                  backgroundColor: lineColors[ln.lineName] || "#999",
                }}
                title={ln.lineName}
              ></div>

              {/* Line name + subtext */}
              <div>
                <div className="text-gray-100 text-sm">{ln.label}</div>
                <div className="text-gray-400 text-xs">{ln.sub}</div>
              </div>
            </div>
            <button
              onClick={() => openStations(ln)}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
            >
              View stations
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrainRoutes() {
  return (
    <div className="mx-auto w-full max-w-7xl ">
      {/* <h1 className="text-3xl font-bold text-gray-100 mb-6">Routes</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LineCard title="BTS" items={LINES.BTS} />
        <LineCard title="SRT & Airport" items={LINES.SRT} />
        <LineCard title="MRT" items={LINES.MRT} />
        
        <div className="rounded-2xl bg-black/30 border border-gray-800 p-4 shadow-lg">
          <h3 className="text-gray-200 font-semibold mb-3">Quick Actions</h3>
          <p className="text-gray-400 text-sm mb-4">
            Open a line to see station list and jump to the planner.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="/planner"
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Plan a trip
            </a>
            <a
              href="/map"
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              Open Map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
