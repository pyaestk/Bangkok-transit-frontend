import { useEffect, useMemo, useState } from "react";
import { useStations } from "../hooks/useStations";
import { useShortestPath } from "../hooks/useShortestPath";
import { useCheapestPath } from "../hooks/useCheapestPath";
import { useAllPaths } from "../hooks/useAllPaths";
import { lineColors } from "../utils/lineColors";
import { useLocation } from "react-router-dom";


const LIGHT_TEXT_LINES = new Set([
  "MRT Yellow Line Monorail",
  "MRT Pink Line Monorail",
  "BTS Gold Line",
  "BTS Sukhumvit Line",
]);

const ICONS = {
  "Cheapest": "/fare.png",
  "Minimum Stations": "/station.png",
  "Minimum Transfer": "/transfer.png",
};

const unwrapRoutePayload = (payload) => {
  if (!payload) return null;
  return payload.data ?? payload;
};

const toRouteArray = (payload) => {
  const raw = unwrapRoutePayload(payload);
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.routes)) return raw.routes;
  if (Array.isArray(raw.path_options)) return raw.path_options;
  return [raw];
};

const resolveStationCode = (input, fallbackCode, stations) => {
  if (fallbackCode) return fallbackCode;
  const normalized = input.trim().toLowerCase();
  if (!normalized) return "";
  const match = stations.find((station) => {
    const name = (station.name_en || "").trim().toLowerCase();
    const code = (station.station_code || "").trim().toLowerCase();
    return code === normalized || name === normalized;
  });
  return match?.station_code || "";
};

const buildRouteKey = (route) => {
  if (!route) return "route-null";
  return (
    route.route_id ||
    `${route.path_type || "route"}-${route.fare_total ?? "?"}-${
      route.stats?.total_stations ?? "?"
    }-${route.stats?.total_transfers ?? route.stats?.total_lines ?? "?"}`
  );
};

const isSameRoute = (routeA, routeB) => {
  if (!routeA || !routeB) return false;
  return buildRouteKey(routeA) === buildRouteKey(routeB);
};

const formatMetric = (value) => {
  if (value === null || value === undefined) return null;
  return typeof value === "number"
    ? value.toLocaleString("en-US")
    : value.toString();
};

export default function Planner() {
  const {
    stations,
    isLoading: isStationsLoading,
    error: stationsError,
  } = useStations();

  const [startInput, setStartInput] = useState("");
  const [startStationCode, setStartStationCode] = useState("");

  const [targetInput, setTargetInput] = useState("");
  const [targetStationCode, setTargetStationCode] = useState("");
  const [filteredStart, setFilteredStart] = useState([]);
  const [filteredTarget, setFilteredTarget] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [allRoutes, setAllRoutes] = useState([]);
  const [formError, setFormError] = useState("");
  const [manualSelection, setManualSelection] = useState(false);

  const [showDetailsOnly, setShowDetailsOnly] = useState(false);

  const location = useLocation();
  const prefillFromName = location.state?.from_name || "";
  const prefillFromCode = location.state?.from_code || "";

  const prefillToName = location.state?.to_name || "";
  const prefillToCode = location.state?.to_code || "";

  useEffect(() => {
    if (prefillFromName) {
      setStartInput(prefillFromName);
      setStartStationCode(prefillFromCode);
    }
    if (prefillToName) {
      setTargetInput(prefillToName);
      setTargetStationCode(prefillToCode);
    }
  }, [prefillFromName, prefillFromCode, prefillToName, prefillToCode]);

useEffect(() => {
  if (prefillFromName) {
    setFilteredStart(getSuggestions(prefillFromName));
  }
  if (prefillToName) {
    setFilteredTarget(getSuggestions(prefillToName));
  }
}, [stations, prefillFromName, prefillToName]);


useEffect(() => {
  if (prefillFromCode && prefillToCode && stations.length > 0) {
    handlePlanRoutes();
  }
}, [prefillFromCode, prefillToCode, stations]);




  const {
    pathData: shortestPayload,
    isLoading: isShortestLoading,
    error: shortestError,
    getShortestPath,
    resetPath: resetShortest,
  } = useShortestPath();
  const {
    pathData: cheapestPayload,
    isLoading: isCheapestLoading,
    error: cheapestError,
    getCheapestPath,
    resetPath: resetCheapest,
  } = useCheapestPath();
  const {
    pathData: allPayload,
    isLoading: isAllLoading,
    error: allError,
    getAllPaths,
    resetPath: resetAll,
  } = useAllPaths();

  const isPlanning = isShortestLoading || isCheapestLoading || isAllLoading;

  const getSuggestions = (value) => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    return stations
      .filter((station) => {
        const name = (station.name_en || "").trim().toLowerCase();
        const code = (station.station_code || "").trim().toLowerCase();
        return name.includes(query) || code.includes(query);
      })
      .slice(0, 8);
  };

  const handleStartChange = (next) => {
    setStartInput(next);
    setStartStationCode("");
    setFilteredStart(getSuggestions(next));
  };

  const handleTargetChange = (next) => {
    setTargetInput(next);
    setTargetStationCode("");
    setFilteredTarget(getSuggestions(next));
  };

  const handleSelectStart = (station) => {
    setStartInput(station.name_en);
    setStartStationCode(station.station_code);
    setFilteredStart([]);
  };

  const handleSelectTarget = (station) => {
    setTargetInput(station.name_en);
    setTargetStationCode(station.station_code);
    setFilteredTarget([]);
  };


  const handlePlanRoutes = async () => {
    const fromCode = resolveStationCode(startInput, startStationCode, stations);
    const toCode = resolveStationCode(targetInput, targetStationCode, stations);

    if (!fromCode || !toCode) {
      setFormError("Please pick both start and destination from the list.");
      return;
    }

    setFormError("");
    setManualSelection(false);
    setStartStationCode(fromCode);
    setTargetStationCode(toCode);
    setFilteredStart([]);
    setFilteredTarget([]);
    setActiveRoute(null);

    try {
      await Promise.all([
        getShortestPath(fromCode, toCode),
        getCheapestPath(fromCode, toCode),
        getAllPaths(fromCode, toCode),
      ]);
    } catch (err) {
      console.error(err);
      setFormError("Unable to plan route right now. Please retry.");
    }
  };

  const handleReset = () => {
    setStartInput("");
    setStartStationCode("");
    setTargetInput("");
    setTargetStationCode("");
    setFilteredStart([]);
    setFilteredTarget([]);
    setActiveRoute(null);
    setAllRoutes([]);
    setFormError("");
    setManualSelection(false);
    resetShortest();
    resetCheapest();
    resetAll();
  };

  const resolvedShortestRoute = useMemo(
    () => unwrapRoutePayload(shortestPayload),
    [shortestPayload]
  );
  const resolvedCheapestRoute = useMemo(
    () => unwrapRoutePayload(cheapestPayload),
    [cheapestPayload]
  );
  const resolvedAllRoutes = useMemo(
    () => toRouteArray(allPayload),
    [allPayload]
  );

  useEffect(() => {
    setAllRoutes(resolvedAllRoutes);
  }, [resolvedAllRoutes]);

  useEffect(() => {
    if (manualSelection) return;
    const priority = [];
    if (resolvedShortestRoute) priority.push(resolvedShortestRoute);
    if (resolvedCheapestRoute) priority.push(resolvedCheapestRoute);
    if (resolvedAllRoutes[0]) priority.push(resolvedAllRoutes[0]);

    const nextRoute = priority.find(Boolean) || null;
    if (nextRoute && !isSameRoute(activeRoute, nextRoute)) {
      setActiveRoute(nextRoute);
    }
    if (!nextRoute && activeRoute) {
      setActiveRoute(null);
    }
  }, [
    manualSelection,
    resolvedShortestRoute,
    resolvedCheapestRoute,
    resolvedAllRoutes,
    activeRoute,
  ]);

  const routeOptions = useMemo(() => {
    const merged = [...allRoutes];
    if (resolvedShortestRoute) merged.push(resolvedShortestRoute);
    if (resolvedCheapestRoute) merged.push(resolvedCheapestRoute);

    const seen = new Set();
    return merged.filter((route) => {
      if (!route) return false;
      const key = buildRouteKey(route);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allRoutes, resolvedShortestRoute, resolvedCheapestRoute]);

  const minTransferRoute = useMemo(() => {
    if (!routeOptions.length) return null;
    return routeOptions.reduce((best, route) => {
      if (!route) return best;
      if (!best) return route;
      const transfers =
        route.stats?.total_transfers ??
        route.stats?.total_lines ??
        Number.MAX_SAFE_INTEGER;
      const bestTransfers =
        best.stats?.total_transfers ??
        best.stats?.total_lines ??
        Number.MAX_SAFE_INTEGER;
      return transfers < bestTransfers ? route : best;
    }, null);
  }, [routeOptions]);

  const plannerError =
    formError || stationsError || shortestError || cheapestError || allError;

  const recommendedCards = useMemo(
    () => [
      {
        label: "Cheapest",
        value: resolvedCheapestRoute?.fare_total ?? null,
        unit: resolvedCheapestRoute ? "THB" : "",
        detail: resolvedCheapestRoute
          ? `${resolvedCheapestRoute.stats?.total_stations ?? "--"} stations`
          : "Plan to discover fares",
        highlighted: isSameRoute(activeRoute, resolvedCheapestRoute),
      },
      {
        label: "Minimum Stations",
        value: resolvedShortestRoute?.stats?.total_stations ?? null,
        unit: resolvedShortestRoute ? "Stations" : "",
        detail: resolvedShortestRoute
          ? `${resolvedShortestRoute.fare_total ?? "--"} THB`
          : "Shows the fastest ride",
        highlighted: isSameRoute(activeRoute, resolvedShortestRoute),
      },
      {
        label: "Minimum Transfer",
        value:
          minTransferRoute?.stats?.total_transfers ??
          minTransferRoute?.stats?.total_lines ??
          null,
        unit:
          minTransferRoute?.stats?.total_transfers != null
            ? "Transfers"
            : minTransferRoute?.stats?.total_lines != null
            ? "Lines"
            : "",
        detail: minTransferRoute
          ? `${minTransferRoute.fare_total ?? "--"} THB`
          : "We will minimize changes",
        highlighted: isSameRoute(activeRoute, minTransferRoute),
      },
    ],
    [
      resolvedCheapestRoute,
      resolvedShortestRoute,
      minTransferRoute,
      activeRoute,
    ]
  );

  return (
    <div className="text-white">
      <div className="mx-auto max-w-7xl space-y-10">
          <header className="mx-2 mt-2">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#32B67A]">
              Smart Planner
            </p> */}
            <h1 className="text-2xl font-semibold">
              Plan every hop with detail
            </h1>
            <p className="text-sm text-gray-400">
              Select your stations, compare recommended routes, and follow the
              full journey instructions without opening the big metro map.
            </p>
          </header>
        <div className="grid gap-6 lg:grid-cols-[460px_1fr] h-full">
          {/* LEFT SIDE — Trip Input (Sticky) */}
          <div className="lg:sticky lg:top-20 h-fit">

            <div className="border bg-gray-900/50 border-gray-800 rounded-2xl shadow-lg p-5">
              <div className="mb-4 space-y-1">
                <h2 className="text-xl font-semibold">Trip inputs</h2>
                <p className="text-sm text-gray-400">
                  Start typing to search by station name or code.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 justify-between">
                <div className="w-full">
                  <StationInput
                    label="From"
                    placeholder="Enter start station"
                    value={startInput}
                    onChange={handleStartChange}
                    suggestions={filteredStart}
                    onSelectSuggestion={handleSelectStart}
                    disabled={isStationsLoading}
                  />
                </div>

                <div className="w-full">
                  <StationInput
                    label="To"
                    placeholder="Enter destination"
                    value={targetInput}
                    onChange={handleTargetChange}
                    suggestions={filteredTarget}
                    onSelectSuggestion={handleSelectTarget}
                    disabled={isStationsLoading}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handlePlanRoutes}
                  disabled={isPlanning || isStationsLoading}
                  className="flex-1 rounded-lg bg-[#32B67A] py-2 text-sm font-semibold text-black transition hover:bg-[#2acc83] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlanning ? "Planning route..." : "Show route"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-white/40 hover:text-white"
                >
                  Reset
                </button>
              </div>

              {plannerError && (
                <p className="mt-3 text-xs text-red-300">{plannerError}</p>
              )}
              {!plannerError && (
                <p className="mt-7 text-xs text-gray-500">
                  Tip: You can choose stations from suggestion drop-down
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE — Results */}
          <div className="space-y-6">
            {/* Recommended route card grid */}

            {showDetailsOnly ? (
              <div>
                <RouteDetailPanel
                  route={activeRoute}
                  isLoading={isPlanning}
                  onBack={() => setShowDetailsOnly(false)}
                />
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-5 h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          Recommended routes
                        </p>
                        <h3 className="text-lg font-semibold">
                          At-a-glance metrics
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3 2xl:grid-cols-3 auto-rows-[1fr]">
                      {recommendedCards.map((card) => (
                        <div key={card.label} className="h-full">
                          <RouteStatCard
                            {...card}
                            onSelect={() => {
                              const picked =
                                card.label === "Cheapest"
                                  ? resolvedCheapestRoute
                                  : card.label === "Minimum Stations"
                                  ? resolvedShortestRoute
                                  : minTransferRoute;

                              if (picked) {
                                setActiveRoute(picked);
                                setManualSelection(true);
                                setShowDetailsOnly(true);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All paths */}
                  <div className="border bg-gray-900/50 border-gray-800 rounded-2xl shadow-lg p-5 h-full flex flex-col">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          All path
                        </p>
                        <h3 className="text-lg font-semibold">
                          Compare options
                        </h3>
                      </div>
                      {routeOptions.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {routeOptions.length} routes
                        </span>
                      )}
                    </div>

                    <div
                      className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[360px] lg:max-h-none
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-900
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gray-700"
                    >
                      {isPlanning && !routeOptions.length ? (
                        <p className="text-sm text-gray-400">
                          Crunching best combinations...
                        </p>
                      ) : routeOptions.length ? (
                        routeOptions.map((route) => (
                          <RouteOptionCard
                            key={buildRouteKey(route)}
                            route={route}
                            isActive={isSameRoute(route, activeRoute)}
                            onSelect={() => {
                              setActiveRoute(route);
                              setManualSelection(true);
                              setShowDetailsOnly(true);
                            }}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">
                          Plan a trip to see every possible path.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StationInput({
  label,
  placeholder,
  value,
  onChange,
  suggestions = [],
  onSelectSuggestion,
  disabled,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full mt-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-[#32B67A] disabled:cursor-not-allowed disabled:opacity-50"
        />
        {suggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-full z-20 mt-2 max-h-38 rounded-2xl border border-white/10 bg-gray-900/95 shadow-2xl
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
            {suggestions.map((station) => (
              <li
                key={station.station_code}
                onClick={() => onSelectSuggestion(station)}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span>{station.name_en}</span>
                  <span className="text-gray-400">{station.station_code}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function RouteStatCard({ label, value, unit, detail, highlighted, onSelect }) {
  const display = formatMetric(value) ?? "--";

  const clickable = typeof onSelect === "function" && value !== null;
  const iconSrc = ICONS[label];

  return (
    <div
      onClick={clickable ? onSelect : undefined}
      className={`rounded-lg border p-4 transition cursor-pointer ${
        highlighted
          ? "border-[#32B67A] bg-[#32B67A]/90 text-black shadow-lg shadow-[#32B67A]/30"
          : "border-white/10 bg-black/30 text-white hover:border-white/20"
      }`}
    >
      <p
        className={`flex items-center gap-2 text-xs uppercase tracking-wide font-semibold ${
          highlighted ? "text-black/70" : "text-gray-400"
        }`}
      >
        {iconSrc && (
          <img src={iconSrc} alt={label} className="w-6 h-6 object-contain" />
        )}
        {label}
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-semibold">{display}</span>
        {unit && (
          <span
            className={`text-sm ${
              highlighted ? "text-black/70" : "text-gray-400"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
      {/* <p
        className={`mt-2 text-sm ${
          highlighted ? "text-black/70" : "text-gray-400"
        }`}
      >
        {detail || "Plan a trip to unlock"}
      </p> */}
    </div>
  );
}


function RouteOptionCard({ route, onSelect, isActive }) {
  const stats = route?.stats || {};
  const steps = route?.route_steps || [];
  const lineBadges = steps
    .map((step) => step.line)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-4 text-left transition ${
        isActive
          ? "border-[#32B67A] bg-black/60 shadow-lg shadow-[#32B67A]/20"
          : "border-white/10 bg-black/30 hover:border-white/30"
      }`}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-400">
        <span>{route?.path_type || "Route"}</span>
        {/* {isActive && <span className="text-[#32B67A]">Viewed</span>} */}
      </div>
      <div className="mt-2 text-2xl font-semibold">
        {formatMetric(route?.fare_total) ?? "--"}
        <span className="ml-1 text-sm font-normal text-gray-400">THB</span>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {stats.total_stations ?? "--"} stations ·{" "}
        {stats.total_transfers ?? stats.total_lines ?? "--"} transfers
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {lineBadges.map((line) => (
          <span
            key={`${route?.path_type}-${line}`}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              LIGHT_TEXT_LINES.has(line) ? "text-black" : "text-white"
            }`}
            style={{
              backgroundColor: lineColors[line] || "rgba(255,255,255,0.1)",
            }}
          >
            {line.split(" ")[0] || line}
          </span>
        ))}
        {steps.length > lineBadges.length && (
          <span className="text-[10px] text-gray-500">
            +{steps.length - lineBadges.length} steps
          </span>
        )}
      </div>
    </button>
  );
}

function RouteDetailPanel({ route, isLoading,  onBack  }) {
  if (isLoading) {
    return (
      <div className="flex min-h-[520px] flex-col rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/80 to-black/70 p-6">
        <p className="text-sm text-gray-400">
          Planning fastest, cheapest, and transfer-friendly paths...
        </p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex min-h-[520px] flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900/80 to-black/70 p-6">
        <button
            className="w-40 h-fit ml-auto rounded-lg border border-white/20 px-4 py-2 
               text-sm text-gray-300 hover:border-white/50 hover:text-white"
            onClick={onBack}
          >
            Back to routes
          </button>
        <h2 className="text-2xl font-semibold">Step-by-step guidance</h2>
        <p className="mt-3 text-sm text-gray-400">
          Choose a start and destination to see the detailed instructions,
          transfers, and line changes for your journey.
        </p>
      </div>
    );
  }

  const stats = route.stats || {};
  const steps = route.route_steps || [];
  const startStep = steps[0];
  const endStep = steps[steps.length - 1];

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-black/50 p-6">
      <div className="flex flex-col flex-wrap items-start justify-between gap-4">
        <div className="flex items-start justify-between w-full">
          {/* LEFT SIDE TEXT */}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#32B67A]">
              Step-by-step
            </p>
            <h2 className="my-1 text-2xl font-semibold">
              {route.path_type || "Recommended route"}
            </h2>
            <p className="text-sm text-gray-400">
              {formatMetric(route.fare_total) ?? "--"} THB ·{" "}
              {stats.total_stations ?? "--"} stations
            </p>
          </div>

          {/* RIGHT SIDE BUTTON */}
          <button
            className="w-40 h-fit ml-auto rounded-lg border border-white/20 px-4 py-2 
               text-sm text-gray-300 hover:border-white/50 hover:text-white"
            onClick={onBack}
          >
            Back to routes
          </button>
        </div>

        {startStep && endStep && (
          <div className="text-sm text-gray-300">
            <div className="flex items-center">
              <p className="text-sm  text-gray-500 me-2">From:</p>
              <p className="font-semibold">
                {startStep.station?.name || startStep.station?.name_en || "--"}{" "}
                {startStep.station?.code || startStep.station?.station_code
                  ? `(${
                      startStep.station?.code || startStep.station?.station_code
                    })`
                  : ""}
              </p>
            </div>
            <div className="mt-3 flex items-center">
              <p className="text-sm text-gray-500 me-2">To:</p>
              <p className="font-semibold">
                {endStep.station?.name || endStep.station?.name_en || "--"}{" "}
                {endStep.station?.code || endStep.station?.station_code
                  ? `(${
                      endStep.station?.code || endStep.station?.station_code
                    })`
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* bg-gradient-to-b from-[#32B67A]/70 to-transparent */}
      <div
        className="mt-6 flex-1 space-y-5 overflow-y-auto pr-2 text-sm
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-900
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-700"
      >
        {steps.length ? (
          steps.map((step, index) => {
            const badgeColor =
              lineColors[step.line] || "rgba(255,255,255,0.08)";
            const extraText = step.details || step.description;
            return (
              <div
                key={`${step.station?.code || index}-${index}`}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center ">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#32B67A] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  {index !== steps.length - 1 && (
                    <span className="h-full w-px bg-[#32B67A]"></span>
                  )}
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm font-semibold">
                    {step.action || "Continue"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {step.station?.name || step.station?.name_en || "Station"}{" "}
                    {step.station?.code || step.station?.station_code
                      ? `(${step.station?.code || step.station?.station_code})`
                      : ""}
                  </p>
                  {step.line && (
                    <span
                      className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        LIGHT_TEXT_LINES.has(step.line)
                          ? "text-black"
                          : "text-white"
                      }`}
                      style={{ backgroundColor: badgeColor }}
                    >
                      {step.line}
                    </span>
                  )}
                  {extraText && (
                    <p className="mt-2 text-xs text-gray-400">{extraText}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400">
            No instructions provided for this route.
          </p>
        )}
      </div>
    </div>
  );
}
