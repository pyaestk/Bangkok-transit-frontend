export default function Home() {
  return (
    <div className="w-full text-white flex flex-col items-center">

      {/* ===================== Hero + Preview ===================== */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* -------------------- Left: Hero Section -------------------- */}
        <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Navigate Bangkok smarter
          </h1>

          <p className="text-gray-300 text-sm md:text-base mb-6 max-w-xl">
            Plan trips, explore lines, check fares and live alerts for BTS, MRT, Airport Rail Link and SRT lines.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Real-time style UI", "Mobile-first", "Dark UI", "Keyboard friendly"].map((t) => (
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
            <button className="px-5 py-2 rounded-lg bg-[#32B67A] hover:bg-[#2acc83] text-black font-semibold shadow-md">
              Open Trip Planner →
            </button>
            <button className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
              View Network Map
            </button>
            <button className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
              Check Fares
            </button>
          </div>
        </div>

        {/* -------------------- Right: Transit Preview -------------------- */}
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

      </div>

      {/* ===================== Stats Section ===================== */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-5 mt-5 ">
        <StatBox label="Lines" value="10" />
        <StatBox label="Stations" value="240+" />
        <StatBox label="Coverage" value="Citywide" />
        <StatBox label="Updated Lines" value="2025" />
      </div>

      {/* ===================== Quick Planner + Alerts ===================== */}
      <div className="w-full grid md:grid-cols-2 gap-5 mt-5">

        {/* Quick Planner */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Planner</h3>

          <div className="flex flex-col gap-3">
            <input
              placeholder="E.g., Siam"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
            />
            <input
              placeholder="E.g., Mo Chit"
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 rounded-lg bg-[#32B67A] hover:bg-[#2acc83] text-black font-semibold">
              Plan Route
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
              Estimate Fare
            </button>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Live Service Highlights</h3>

          <div className="text-sm text-gray-300 space-y-1">
            <p><b className="text-blue-400">MRT Blue:</b> Minor delays near Hua Lamphong</p>
            <p><b className="text-[#2acc83]">BTS Sukhumvit:</b> Normal service</p>
            <p><b className="text-yellow-300">Gold Line:</b> 10–12 min headways</p>
            <p><b className="text-red-400">SRT Red:</b> Weekend timetable in effect</p>
          </div>

          <button className="mt-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
            View all alerts
          </button>
        </div>

      </div>
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
      <div className="absolute inset-y-0 flex items-center" style={{ width: "100%" }}>
        <div className="h-1 rounded-full" style={{ backgroundColor: color, width: "100%" }}></div>
      </div>
    </div>
  );
}
