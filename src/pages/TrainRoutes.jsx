// export default function TrainRoutes() {
//   return (
//     <div className="min-h-screen">
//       <h1 className="text-white">Routes</h1>
//     </div>
//   )
// }

// pages/TrainRoutes.jsx
// import { useNavigate } from "react-router-dom";

// // Map your real DB line IDs here (lineId). Adjust numbers to match backend.
// const LINES = {
//   BTS: [
//     { key: "bts-sukhumvit", label: "Sukhumvit Line", sub: "Khu Khot ⇄ Kheha", lineId: 1 },
//     { key: "bts-silom",     label: "Silom Line",     sub: "National Stadium ⇄ Bang Wa", lineId: 2 },
//   ],
//   MRT: [
//     { key: "mrt-blue",      label: "Blue Line",      sub: "Loop via Tao Poon", lineId: 3 },
//     { key: "mrt-purple",    label: "Purple Line",    sub: "Khlong Bang Phai ⇄ Tao Poon", lineId: 4 },
//   ],
//   SRT: [
//     { key: "srt-red",       label: "SRT Red",        sub: "Rangsit ⇄ Taling Chan", lineId: 5 },
//     { key: "arl",           label: "Airport Rail Link", sub: "Phaya Thai ⇄ Suvarnabhumi", lineId: 6 },
//   ],
// };

// function LineCard({ title, items }) {
//   const nav = useNavigate();
//   return (
//     <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//       <h3 className="text-gray-200 font-semibold mb-3">{title}</h3>
//       <div className="space-y-3">
//         {items.map((ln) => (
//           <div
//             key={ln.key}
//             className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3"
//           >
//             <div>
//               <div className="text-gray-100 font-medium">{ln.label}</div>
//               <div className="text-gray-400 text-sm">{ln.sub}</div>
//             </div>
//             <button
//               onClick={() => nav(`/stations?line=${ln.lineId || ""}`)}
//               className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
//               title="View stations on this line"
//             >
//               View stations
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function TrainRoutes() {
//   return (
//     <div className="mx-auto w-full max-w-7xl px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-100 mb-6">Routes</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <LineCard title="BTS" items={LINES.BTS} />
//         <LineCard title="MRT" items={LINES.MRT} />
//         <LineCard title="SRT & Airport" items={LINES.SRT} />

//         {/* Quick Actions */}
//         <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//           <h3 className="text-gray-200 font-semibold mb-3">Quick Actions</h3>
//           <p className="text-gray-400 text-sm mb-4">
//             Open a line to see station list and jump to the planner.
//           </p>
//           <div className="flex items-center gap-3">
//             <a href="/planner" className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
//               Plan a trip
//             </a>
//             <a href="/map" className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
//               Open Map
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// pages/TrainRoutes.jsx
// import { useNavigate } from "react-router-dom";

// // Map your real DB line IDs here (lineId).
// // These IDs should match your backend station.line_id field.
// const LINES = {
//   BTS: [
//     { key: "bts-sukhumvit", label: "Sukhumvit Line", sub: "Khu Khot ⇄ Kheha", lineId: 1 },
//     { key: "bts-silom",     label: "Silom Line",     sub: "National Stadium ⇄ Bang Wa", lineId: 2 },
//   ],
//   MRT: [
//     { key: "mrt-blue",      label: "Blue Line",      sub: "Loop via Tao Poon", lineId: 3 },
//     { key: "mrt-purple",    label: "Purple Line",    sub: "Khlong Bang Phai ⇄ Tao Poon", lineId: 4 },
//   ],
//   SRT: [
//     { key: "srt-red",       label: "SRT Red",        sub: "Rangsit ⇄ Taling Chan", lineId: 5 },
//     { key: "arl",           label: "Airport Rail Link", sub: "Phaya Thai ⇄ Suvarnabhumi", lineId: 6 },
//   ],
// };

// function LineCard({ title, items }) {
//   const nav = useNavigate();

//   function handleView(line) {
//     // Send both lineId and lineName to /stations
//     nav(`/stations?line=${line.lineId}&name=${encodeURIComponent(line.label)}`);
//   }

//   return (
//     <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//       <h3 className="text-gray-200 font-semibold mb-3">{title}</h3>
//       <div className="space-y-3">
//         {items.map((ln) => (
//           <div
//             key={ln.key}
//             className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3"
//           >
//             <div>
//               <div className="text-gray-100 font-medium">{ln.label}</div>
//               <div className="text-gray-400 text-sm">{ln.sub}</div>
//             </div>
//             <button
//               onClick={() => handleView(ln)}
//               className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
//               title={`View stations for ${ln.label}`}
//             >
//               View stations
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function TrainRoutes() {
//   return (
//     <div className="mx-auto w-full max-w-7xl px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-100 mb-6">Routes</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <LineCard title="BTS" items={LINES.BTS} />
//         <LineCard title="MRT" items={LINES.MRT} />
//         <LineCard title="SRT & Airport" items={LINES.SRT} />

//         {/* Quick Actions */}
//         <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//           <h3 className="text-gray-200 font-semibold mb-3">Quick Actions</h3>
//           <p className="text-gray-400 text-sm mb-4">
//             Open a line to see station list and jump to the planner.
//           </p>
//           <div className="flex items-center gap-3">
//             <a href="/planner" className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
//               Plan a trip
//             </a>
//             <a href="/map" className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
//               Open Map
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/TrainRoutes.jsx
import { useNavigate } from "react-router-dom";

// If you know your real DB IDs, put them here (optional).
// Passing line_name ensures filtering even when IDs differ.
const LINES = {
  BTS: [
    { key: "bts-sukhumvit", label: "Sukhumvit Line", sub: "Khu Khot ⇄ Kheha", lineId: null, lineName: "Sukhumvit" },
    { key: "bts-silom",     label: "Silom Line",     sub: "National Stadium ⇄ Bang Wa", lineId: null, lineName: "Silom" },
  ],
  MRT: [
    { key: "mrt-blue",      label: "Blue Line",      sub: "Loop via Tao Poon", lineId: null, lineName: "Blue" },
    { key: "mrt-purple",    label: "Purple Line",    sub: "Khlong Bang Phai ⇄ Tao Poon", lineId: null, lineName: "Purple" },
  ],
  SRT: [
    { key: "srt-red",       label: "SRT Red",        sub: "Rangsit ⇄ Taling Chan", lineId: null, lineName: "SRT Red" },
    { key: "arl",           label: "Airport Rail Link", sub: "Phaya Thai ⇄ Suvarnabhumi", lineId: null, lineName: "Airport Rail Link" },
  ],
};

function LineCard({ title, items }) {
  const nav = useNavigate();

  function openStations(line) {
    const params = new URLSearchParams();
    if (line.lineId) params.set("line", String(line.lineId));
    if (line.lineName) params.set("line_name", line.lineName);
    params.set("name", line.label); // for display heading
    nav(`/stations?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
      <h3 className="text-gray-200 font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map((ln) => (
          <div key={ln.key} className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3">
            <div>
              <div className="text-gray-100 font-medium">{ln.label}</div>
              <div className="text-gray-400 text-sm">{ln.sub}</div>
            </div>
            <button
              onClick={() => openStations(ln)}
              className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Routes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LineCard title="BTS" items={LINES.BTS} />
        <LineCard title="MRT" items={LINES.MRT} />
        <LineCard title="SRT & Airport" items={LINES.SRT} />
        <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
          <h3 className="text-gray-200 font-semibold mb-3">Quick Actions</h3>
          <p className="text-gray-400 text-sm mb-4">Open a line to see station list and jump to the planner.</p>
          <div className="flex items-center gap-3">
            <a href="/planner" className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">Plan a trip</a>
            <a href="/map" className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">Open Map</a>
          </div>
        </div>
      </div>
    </div>
  );
}