// export default function Stations() {
//   return (
//     <div className="min-h-screen">
//       <h1 className="text-white">Stations</h1>
//     </div>
//   )
// }

// pages/Stations.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchStations } from "../services/stationsApi";

// function useQuery() {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// }

// export default function Stations() {
//   const nav = useNavigate();
//   const q = useQuery();

//   const initialSearch = q.get("q") || "";
//   const initialLine = q.get("line") || "";

//   const [searchText, setSearchText] = useState(initialSearch);
//   const [lineId, setLineId] = useState(initialLine);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [stations, setStations] = useState([]);
//   const lineName = q.get("name") || "";


//   async function load() {
//     setLoading(true);
//     setErr("");
//     const res = await fetchStations({
//       search: searchText.trim(),
//       lineId: lineId || "",
//       limit: 0,
//     });
//     if (res.ok) setStations(res.data);
//     else setErr(res.error || "Failed to load stations");
//     setLoading(false);
//   }

//   // load when page mounts & when lineId changes (URL deep-links from Routes)
//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lineId]);

//   function applyFilters(e) {
//     e?.preventDefault?.();
//     const params = new URLSearchParams();
//     if (searchText.trim()) params.set("q", searchText.trim());
//     if (lineId) params.set("line", lineId);
//     nav(`/stations?${params.toString()}`);
//     load();
//   }

//   return (
//     <div className="mx-auto w-full max-w-7xl px-4 py-8">
//       {/* <h1 className="text-3xl font-bold text-gray-100 mb-6">Stations</h1> */}
//       <h1 className="text-3xl font-bold text-gray-100 mb-6">
//   {lineName ? `${lineName} Stations` : "Stations"}
// </h1> 
// {/* ---------------------------- */}


//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* Filter */}
//         <div className="md:col-span-1">
//           <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//             <div className="flex items-center justify-between mb-3">
//               <button
//                 className={`px-2 py-1 rounded-md text-sm ${lineId ? "text-gray-400" : "text-white font-semibold"}`}
//                 onClick={() => setLineId("")}
//               >
//                 Lines
//               </button>
//               <button
//                 className={`px-2 py-1 rounded-md text-sm ${lineId ? "text-white font-semibold" : "text-gray-400"}`}
//                 onClick={() => setLineId(lineId || "")}
//               >
//                 A–Z
//               </button>
//             </div>

//             <input
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search station…"
//               className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
//             />

//             <label className="block text-gray-400 text-sm mb-1">Line</label>
//             <input
//               value={lineId}
//               onChange={(e) => setLineId(e.target.value)}
//               placeholder="Line ID (optional)"
//               className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
//             />

//             <div className="flex gap-2">
//               <button
//                 onClick={applyFilters}
//                 className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
//               >
//                 Apply
//               </button>
//               <a
//                 href="/map"
//                 className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
//               >
//                 Open on Map
//               </a>
//             </div>

//             <p className="text-gray-500 text-xs mt-3">
//               Tip: Click “From” or “To” to send to the Planner.
//             </p>
//           </div>
//         </div>

//         {/* List */}
//         <div className="md:col-span-3">
//           <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//             {loading ? (
//               <div className="text-gray-400">Loading stations…</div>
//             ) : err ? (
//               <div className="text-red-400">{err}</div>
//             ) : stations.length === 0 ? (
//               <div className="text-gray-400">No stations found.</div>
//             ) : (
//               <ul className="space-y-3">
//                 {stations.map((st) => (
//                   <li
//                     key={st.station_code}
//                     className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3"
//                   >
//                     <div>
//                       <div className="text-gray-100 font-medium">{st.name_en}</div>
//                       <div className="text-gray-500 text-sm">
//                         {st.station_code}
//                         {st.line?.name_en ? ` • ${st.line.name_en}` : ""}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
//                         onClick={() => nav(`/map?focus=${st.station_code}`)}
//                       >
//                         Map
//                       </button>
//                       <button
//                         className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
//                         onClick={() => nav(`/planner?from=${st.station_code}`)}
//                       >
//                         From
//                       </button>
//                       <button
//                         className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
//                         onClick={() => nav(`/planner?to=${st.station_code}`)}
//                       >
//                         To
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Stations.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { fetchStations } from "../services/stationsApi";

// function useQuery() {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// }

// export default function Stations() {
//   const nav = useNavigate();
//   const q = useQuery();

//   const initialSearch = q.get("q") || "";
//   const initialLineId = q.get("line") || "";
//   const initialLineName = q.get("line_name") || "";
//   const displayName = q.get("name") || "";

//   const [searchText, setSearchText] = useState(initialSearch);
//   const [lineId, setLineId] = useState(initialLineId);
//   const [lineName, setLineName] = useState(initialLineName);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [stations, setStations] = useState([]);

//   async function load() {
//     setLoading(true);
//     setErr("");
//     try {
//       const data = await fetchStations({
//         search: searchText.trim(),
//         lineId,
//         lineName,
//         limit: 0,
//       });
//       setStations(data);
//     } catch (e) {
//       setErr(e.message || "Failed to load stations");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Load on mount and whenever line filter changes (from Routes)
//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lineId, lineName]);

//   function applyFilters(e) {
//     e?.preventDefault?.();
//     const params = new URLSearchParams();
//     if (searchText.trim()) params.set("q", searchText.trim());
//     if (lineId) params.set("line", lineId);
//     if (lineName) params.set("line_name", lineName);
//     if (displayName) params.set("name", displayName);
//     nav(`/stations?${params.toString()}`);
//     load();
//   }

//   return (
//     <div className="mx-auto w-full max-w-7xl px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-100 mb-6">
//         {displayName ? `${displayName} Stations` : "Stations"}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* Filter */}
//         <div className="md:col-span-1">
//           <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//             <div className="flex items-center justify-between mb-3">
//               <span className="px-2 py-1 rounded-md text-sm text-white font-semibold">Lines</span>
//               <span className="px-2 py-1 rounded-md text-sm text-gray-400">A–Z</span>
//             </div>

//             <input
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search station…"
//               className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
//             />

//             <label className="block text-gray-400 text-sm mb-1">Line ID (optional)</label>
//             <input
//               value={lineId}
//               onChange={(e) => setLineId(e.target.value)}
//               placeholder="e.g. 2"
//               className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
//             />

//             <label className="block text-gray-400 text-sm mb-1">Line name (optional)</label>
//             <input
//               value={lineName}
//               onChange={(e) => setLineName(e.target.value)}
//               placeholder="e.g. Silom"
//               className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
//             />

//             <div className="flex gap-2">
//               <button onClick={applyFilters} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
//                 Apply
//               </button>
//               <a href="/map" className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800">
//                 Open on Map
//               </a>
//             </div>

//             <p className="text-gray-500 text-xs mt-3">Tip: Click “From” or “To” to send to the Planner.</p>
//           </div>
//         </div>

//         {/* List */}
//         <div className="md:col-span-3">
//           <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
//             {loading ? (
//               <div className="text-gray-400">Loading stations…</div>
//             ) : err ? (
//               <div className="text-red-400">{err}</div>
//             ) : stations.length === 0 ? (
//               <div className="text-gray-400">No stations found.</div>
//             ) : (
//               <ul className="space-y-3">
//                 {stations.map((st) => (
//                   <li
//                     key={st.station_code}
//                     className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3"
//                   >
//                     <div>
//                       <div className="text-gray-100 font-medium">{st.name_en}</div>
//                       <div className="text-gray-500 text-sm">
//                         {st.station_code}
//                         {st.line_id ? ` • line ${st.line_id}` : ""}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <a
//                         className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
//                         href={`/map?focus=${st.station_code}`}
//                       >
//                         Map
//                       </a>
//                       <a
//                         className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
//                         href={`/planner?from=${st.station_code}`}
//                       >
//                         From
//                       </a>
//                       <a
//                         className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm"
//                         href={`/planner?to=${st.station_code}`}
//                       >
//                         To
//                       </a>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Stations.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchStations } from "../services/stationsApi";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Stations() {
  const nav = useNavigate();
  const q = useQuery();

  const initialSearch = q.get("q") || "";
  const initialLineId = q.get("line") || "";
  const initialLineName = q.get("line_name") || "";
  const displayName = q.get("name") || "";

  const [searchText, setSearchText] = useState(initialSearch);
  const [lineId, setLineId] = useState(initialLineId);
  const [lineName, setLineName] = useState(initialLineName);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [stations, setStations] = useState([]);

  async function load() {
    setLoading(true);
    setErr("");
    const res = await fetchStations({
      search: searchText.trim(),
      lineId,
      lineName,
      limit: 0,
    });

    if (!res?.ok) {
      setStations([]);
      setErr(res?.error || "Failed to load stations");
      setLoading(false);
      return;
    }
    setStations(res.data);
    setLoading(false);
  }

  // initial + when line filters change (from Routes deep-link)
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, lineName]);

  function applyFilters(e) {
    e?.preventDefault?.();
    const params = new URLSearchParams();
    if (searchText.trim()) params.set("q", searchText.trim());
    if (lineId) params.set("line", lineId);
    if (lineName) params.set("line_name", lineName);
    if (displayName) params.set("name", displayName);
    nav(`/stations?${params.toString()}`);
    load();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">
        {displayName ? `${displayName} Stations` : "Stations"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter panel */}
        <div className="md:col-span-1">
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 rounded-md text-sm text-white font-semibold">Lines</span>
              <span className="px-2 py-1 rounded-md text-sm text-gray-400">A–Z</span>
            </div>

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search station…"
              className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
            />

            <label className="block text-gray-400 text-sm mb-1">Line ID (optional)</label>
            <input
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              placeholder="e.g. 2"
              className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
            />

            <label className="block text-gray-400 text-sm mb-1">Line name (optional)</label>
            <input
              value={lineName}
              onChange={(e) => setLineName(e.target.value)}
              placeholder="e.g. Silom"
              className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-100 placeholder-gray-500"
            />

            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Apply
              </button>
              <a
                href="/map"
                className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Open on Map
              </a>
            </div>

            <p className="text-gray-500 text-xs mt-3">
              Tip: Click “From” or “To” to send to the Planner.
            </p>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-3">
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 shadow-lg">
            {loading ? (
              <div className="text-gray-400">Loading stations…</div>
            ) : err ? (
              <div className="text-red-400">Error: {err}</div>
            ) : stations.length === 0 ? (
              <div className="text-gray-400">No stations found.</div>
            ) : (
              <ul className="space-y-3">
                {stations.map((st) => (
                  <li
                    key={st.station_code}
                    className="flex items-center justify-between bg-gray-900/40 border border-gray-800 rounded-xl px-4 py-3"
                  >
                    <div>
                      <div className="text-gray-100 font-medium">{st.name_en}</div>
                      <div className="text-gray-500 text-sm">
                        {st.station_code}
                        {st.line_id ? ` • line ${st.line_id}` : ""}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm" href={`/map?focus=${st.station_code}`}>Map</a>
                      <a className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm" href={`/planner?from=${st.station_code}`}>From</a>
                      <a className="px-2 py-1 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 text-sm" href={`/planner?to=${st.station_code}`}>To</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
