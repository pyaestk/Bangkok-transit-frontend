import { useEffect, useRef, useState, useMemo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useStations } from "../hooks/useStations";
import { useLocation } from "react-router-dom";
import TripPlannerBox from "../component/map/TripPlannerBox";
import StationBadge from "../component/map/StationBadge";

export default function Map() {
  const transformRef = useRef(null);
  const imgRef = useRef(null);
  const { stations, isLoading, error } = useStations();

  const [scale, setScale] = useState(1);
  const [xRatio, setXRatio] = useState(1);
  const [yRatio, setYRatio] = useState(1);

  const [startStation, setStartStation] = useState(null);
  const [targetStation, setTargetStation] = useState(null);
  // const [selectingStart, setSelectingStart] = useState(true);
  const [routeStations, setRouteStations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStationForDialog, setSelectedStationForDialog] =
    useState(null);
  const [showSelectDialog, setShowSelectDialog] = useState(false);
  const animationRef = useRef(null);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [showHelp, setShowHelp] = useState(false);
  

  // for Size of Map Picture
  const ORIGINAL_WIDTH = 841.89;
  const ORIGINAL_HEIGHT = 841.89;

  // --- Ratio calculation (runs only when map is actually visible) ---
  const updateRatios = () => {
    if (!imgRef.current) return;
    const actualWidth = imgRef.current.clientWidth;
    const actualHeight = imgRef.current.clientHeight;
    if (actualWidth && actualHeight) {
      setXRatio(actualWidth / ORIGINAL_WIDTH);
      setYRatio(actualHeight / ORIGINAL_HEIGHT);
    }
  };

  // --- Wait for the image to load ---
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      // If cached, calculate immediately
      updateRatios();
    } else if (img) {
      // Wait until fully loaded
      img.addEventListener("load", updateRatios);
    }

    window.addEventListener("resize", updateRatios);
    return () => {
      window.removeEventListener("resize", updateRatios);
      if (img) img.removeEventListener("load", updateRatios);
    };
  }, []);

  // --- Reset handler ---
  const handleResetView = () => {
    if (transformRef.current) {
      transformRef.current.setTransform(0, 0, 1);
      transformRef.current.centerView(1);
      setScale(3);
    }
  };

  const handleStationReset = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
    setActiveIndex(-1);
    setRouteStations([]);
    setStartStation(null);
    setTargetStation(null);
    setResetTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  const handleStationClick = (station) => {
    setSelectedStationForDialog(station);
    setShowSelectDialog(true);
  };

  // for auto animating route
  // useEffect(() => {
  //   if (routeStations.length === 0) {
  //     setActiveIndex(-1);
  //     return;
  //   }

  //   let i = 0;
  //   setActiveIndex(0);

  //   const interval = setInterval(() => {
  //     i++;
  //     if (i < routeStations.length) {
  //       setActiveIndex(i);
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 300); // delay per station (adjust speed here)

  //   return () => clearInterval(interval);
  // }, [routeStations]);

  // --- Manual route animation start ---
  const startAnimation = () => {
    if (
      !Array.isArray(routeStations) ||
      routeStations.length === 0 ||
      isAnimating
    )
      return;

    setIsAnimating(true);
    setActiveIndex(0);

    let i = 0;
    animationRef.current = setInterval(() => {
      i++;
      if (i < routeStations.length) {
        setActiveIndex(i);
      } else {
        clearInterval(animationRef.current);
        animationRef.current = null;
        setIsAnimating(false);
      }
    }, 300);
  };

  const location = useLocation();
  const startStationCodeFromNav = location?.state?.startStation || null;
  const targetStationCodeFromNav = location?.state?.targetStation || null;
  const showStationCodeFromNav = location?.state?.showStation || null;

  const effectiveStartStation = useMemo(() => {
    if (startStation) return startStation;
    return (
      stations.find((s) => s.station_code === startStationCodeFromNav) || null
    );
  }, [startStation, startStationCodeFromNav, stations]);

  const effectiveTargetStation = useMemo(() => {
    if (targetStation) return targetStation;
    return (
      stations.find((s) => s.station_code === targetStationCodeFromNav) || null
    );
  }, [targetStation, targetStationCodeFromNav, stations]);

  const showStation = useMemo(() => {
    if (!showStationCodeFromNav) return null;
    return (
      stations.find((s) => s.station_code === showStationCodeFromNav) || null
    );
  }, [showStationCodeFromNav, stations]);

  useEffect(() => {
    if (showStation) {
      handleStationClick(showStation);
    }
  }, [showStation]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#32B67A] mb-4"></div>
        <p className="text-sm opacity-80">Loading Map ...</p>
      </div>
    );

  if (error)
    return <div className="text-red-400 p-4">Failed to load: {error}</div>;

  return (
    <div className="flex flex-col sm:flex-row gap-5 text-white w-full max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-100">
        <TripPlannerBox
          selectedStartStation={effectiveStartStation}
          selectedTargetStation={effectiveTargetStation}
          onPathStations={setRouteStations}
          resetTrigger={resetTrigger}
        />
      </div>

      {/* Map */}
      <div className="relative border border-white/10 h-[83vh] w-full flex-1 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
        <div className="bg-white rounded-lg h-full flex items-center justify-center overflow-hidden relative">
          {/* --- Dim overlay when route is shown --- */}
          {routeStations.length > 0 && (
            <div className="absolute inset-0 bg-black/40 z-0 transition-opacity duration-300 pointer-events-none" />
          )}
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={1}
            maxScale={6}
            centerOnInit={true}
            limitToBounds={false}
            wheel={{
              disabled: false,
              step: 0.1, // zoom speed per wheel event
              smoothStep: 0.007, // smoother zooming on trackpads
              activationKeys: [], // allow natural gestures (no modifier keys)
              limitsOnWheel: true, // prevent overscaling
            }}
            pinch={{ disabled: false }} // enable touch pinch
            doubleClick={{ disabled: true }}
            onTransformed={(ctx) => setScale(ctx.state.scale)}
          >
            <TransformComponent>
              <div className="relative w-full h-full">
                <img
                  ref={imgRef}
                  src="/BangkokTransitMap.png"
                  alt="Bangkok Metro Map"
                  className="w-full h-auto select-none pointer-events-none bg-white z-0"
                  draggable={false}
                  onLoad={updateRatios} // run when loaded
                />
                {/* --- Dim overlay when route is shown --- */}
                {routeStations.length > 0 && (
                  <div className="absolute inset-0 bg-black/40 z-0 transition-opacity duration-300 pointer-events-none" />
                )}

                {/* --- Main Stations --- */}
                {stations.map((station) => {
                  const isStart = station.id === startStation?.id;
                  const isTarget = station.id === targetStation?.id;

                  return (
                    <div
                      key={station.id}
                      onClick={() => handleStationClick(station)}
                      style={{
                        position: "absolute",
                        left: `${station.x * xRatio}px`,
                        top: `${station.y * yRatio}px`,
                        transform: "translate(-50%, -50%)", // center the marker correctly
                        cursor: "pointer",
                        zIndex: isStart || isTarget ? 30 : 20,
                      }}
                    >
                      <div
                        className={`${
                          isStart || isTarget ? "opacity-100" : "opacity-0"
                        } transition-opacity duration-150`}
                      >
                        <StationBadge
                          code={station.station_code.trim()}
                          lineColor={
                            isStart
                              ? "#1E90FF"
                              : isTarget
                              ? "#f87171"
                              : "transparent"
                          }
                        />
                      </div>
                    </div>
                  );
                })}

                {/* --- Route Stations (from API) --- */}
                {routeStations.map((station, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${station.x * xRatio}px`,
                      top: `${station.y * yRatio}px`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 20,
                    }}
                  >
                    <StationBadge
                      code={station.station_code.trim()}
                      lineColor="#00ff8c"
                    />
                  </div>
                ))}
                {/* Animated "Train" / Traveling Dot */}
                {activeIndex >= 0 && routeStations[activeIndex] && (
                  <div
                    key={activeIndex}
                    style={{
                      position: "absolute",
                      left: `${routeStations[activeIndex].x * xRatio}px`,
                      top: `${routeStations[activeIndex].y * yRatio}px`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 30,
                      opacity: isAnimating ? 1 : 0,
                    }}
                  >
                    <StationBadge
                      code={routeStations[activeIndex].station_code.trim()}
                      lineColor="#ef4444"
                    />
                  </div>
                )}
              </div>
            </TransformComponent>
          </TransformWrapper>

          {/* --- Station Selection Dialog (inside map) --- */}
          {showSelectDialog && selectedStationForDialog && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60">
              <div className="relative bg-[#0a0a0aa9] backdrop-blur-[3px] border border-white/30 rounded-2xl shadow-2xl p-5 w-[85%] sm:w-[65%] md:w-[50%] max-w-[320px] text-white animate-fadeIn">
                {/* Close button */}
                <button
                  onClick={() => setShowSelectDialog(false)}
                  className="absolute top-2 right-3 text-gray-400 hover:text-white text-lg"
                >
                  ✕
                </button>

                <h3 className="text-sm font-bold mb-2 text-center">
                  {selectedStationForDialog.name_en}
                </h3>
                <p className="text-center text-gray-400 text-sm mb-4">
                  Station Code:{" "}
                  <span className="text-white">
                    {selectedStationForDialog.station_code.trim()}
                  </span>
                </p>

                <div className="flex flex-col gap-3 text-sm">
                  <button
                    onClick={() => {
                      setStartStation({
                        name_en: selectedStationForDialog.name_en,
                        station_code: selectedStationForDialog.station_code,
                        id: selectedStationForDialog.id,
                      });
                      setShowSelectDialog(false);
                    }}
                    className="w-full py-2 rounded-lg bg-[#32B67A] hover:bg-[#2acc83] text-white font-semibold active:scale-95"
                  >
                    Set as Start Station
                  </button>

                  <button
                    onClick={() => {
                      setTargetStation({
                        name_en: selectedStationForDialog.name_en,
                        station_code: selectedStationForDialog.station_code,
                        id: selectedStationForDialog.id,
                      });
                      setShowSelectDialog(false);
                    }}
                    className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold active:scale-95"
                  >
                    Set as Target Station
                  </button>

                  <button
                    onClick={() => setShowSelectDialog(false)}
                    className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            <button
              onClick={() => transformRef.current?.zoomIn()}
              className="px-3 py-2 rounded-lg bg-black/60 text-white hover:bg-black/80 active:scale-95"
            >
              +
            </button>
            <button
              onClick={() => transformRef.current?.zoomOut()}
              className="px-3 py-2 rounded-lg bg-black/60 text-white hover:bg-black/80 active:scale-95"
            >
              −
            </button>
            <button
              onClick={handleResetView}
              className="px-3 py-2 rounded-lg bg-black/60 text-white hover:bg-black/80 active:scale-95"
            >
              ⟳
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="px-3 py-2 rounded-lg bg-black/60 text-white text-sm hover:bg-black/80 active:scale-95"
            >
              ?
            </button>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2 text-sm">
            <button
              onClick={handleStationReset}
              className="px-3 py-2 rounded-lg bg-black/60 text-white hover:bg-black/80 active:scale-95"
            >
              Reset Station
            </button>

            {routeStations.length > 0 && (
              <button
                onClick={startAnimation}
                disabled={isAnimating || routeStations.length === 0}
                className={`px-3 py-2 rounded-lg ${
                  isAnimating || routeStations.length === 0
                    ? " bg-black/60 cursor-not-allowed"
                    : " bg-black/60 active:scale-95"
                } text-white`}
              >
                {isAnimating ? "Animating..." : "Start "}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* 
      <div className="w-full md:w-70 ">
        <FiltersCard 
          selectedStation={null}
        />
      </div> */}

      {/* --- Help Popup Modal --- */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[3px]">
          <div className="relative bg-gray-900/60 backdrop-blur-[3px] border border-white/10 rounded-2xl shadow-2xl p-4 w-[90%] max-w-md text-white animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>

            {/* Title */}
            <h3 className="text-lg font-bold mb-3">How to Use Trip Planner</h3>

            {/* Guide content */}
            <div className="p-3 rounded-lg bg-black/20 border border-white/10 text-xs text-gray-300 leading-relaxed w-full">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Click on a station on the map to set your{" "}
                  <span className="text-[#32B67A] font-medium">start</span> and{" "}
                  <span className="text-red-400 font-medium">destination</span>.
                </li>
                <li>
                  After selecting both, choose your{" "}
                  <span className="text-white font-medium">preference</span> —{" "}
                  <span className="text-[#32B67A] font-medium">Shortest</span>{" "}
                  or <span className="text-blue-400 font-medium">Longest</span>{" "}
                  route.
                </li>
                <li>
                  Press{" "}
                  <span className="text-white font-medium">Plan Route</span> to
                  calculate the path between stations.
                </li>
                <li>
                  Use{" "}
                  <span className="text-white font-medium">Reset Station</span>{" "}
                  on the map to start over.
                </li>
                <li>
                  Use <span className="text-white font-medium">Zoom</span> (+ /
                  −) and{" "}
                  <span className="text-white font-medium">⟳ Reset View</span>{" "}
                  to explore the map easily.
                </li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 mt-3 border-white/10 ms-1">
              Tip: Try comparing different preferences to explore alternate
              paths.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
