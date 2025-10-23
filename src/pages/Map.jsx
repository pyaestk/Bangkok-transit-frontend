import { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FiltersCard from "../component/map/FiltersCard";
import { useStations } from "../hooks/useStations";
import TripPlannerBox from "../component/map/TripPlannerBox";

export default function Map() {
  const transformRef = useRef(null);
  const imgRef = useRef(null);
  const { stations, isLoading, error } = useStations();

  const [scale, setScale] = useState(1);
  const [xRatio, setXRatio] = useState(1);
  const [yRatio, setYRatio] = useState(1);

  const [startStation, setStartStation] = useState(null);
  const [targetStation, setTargetStation] = useState(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const [routeStations, setRouteStations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

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
      setScale(1);
    }
  };

  const handleStationReset = () => {
    setStartStation(null);
    setTargetStation(null);
    setRouteStations([]);
    setSelectingStart(true);
    setActiveIndex(-1);
    setResetTrigger((prev) => prev + 1); // notify TripPlannerBox
  };

  const handleStationClick = (station) => {
    if (selectingStart) {
      setStartStation({
        name_en: station.name_en,
        station_code: station.station_code,
        id: station.id,
      });
      setSelectingStart(false);
    } else {
      setTargetStation({
        name_en: station.name_en,
        station_code: station.station_code,
        id: station.id,
      });
      setSelectingStart(true);
    }
    setActiveStation(station.id);
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
    if (routeStations.length === 0 || isAnimating) return;

    setIsAnimating(true);
    setActiveIndex(0);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < routeStations.length) {
        setActiveIndex(i);
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 300); // 300ms per station
  };

  if (isLoading)
    return <div className="text-white p-4">Loading stations...</div>;
  if (error)
    return <div className="text-red-400 p-4">Failed to load: {error}</div>;

  return (
    <div className="xl:container xl:mx-auto flex flex-col sm:flex-row gap-5 text-white w-full">
      {/* Sidebar */}
      <div className="w-full md:w-80 ">
        <TripPlannerBox
          selectedStartStation={startStation}
          selectedTargetStation={targetStation}
          onPathStations={setRouteStations}
          resetTrigger={resetTrigger}
        />
      </div>

      {/* Map */}
      <div className="relative border border-white/10 h-[80vh] w-full flex-1 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
        <div className="bg-white rounded-lg h-full flex items-center justify-center overflow-hidden relative">
          {/* --- Dim overlay when route is shown --- */}
          {routeStations.length > 0 && (
            <div className="absolute inset-0 bg-black/40 z-0 transition-opacity duration-300 pointer-events-none" />
          )}
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={1}
            maxScale={4.5}
            centerOnInit={true}
            limitToBounds={false}
            wheel={{
              disabled: false,
              step: 0.1, // zoom speed per wheel event
              smoothStep: 0.005, // smoother zooming on trackpads
              activationKeys: [], // allow natural gestures (no modifier keys)
              limitsOnWheel: true, // prevent overscaling
            }}
            pinch={{ disabled: false }} // enable touch pinch
            doubleClick={{ disabled: true }}
            onTransformed={(ctx) => setScale(ctx.state.scale)}
          >
            <TransformComponent>
              <div className="relative w-full h-auto">
                <img
                  ref={imgRef}
                  src="/BangkokTransitMap.png"
                  alt="Bangkok Metro Map"
                  className="w-full h-auto select-none pointer-events-none bg-white"
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

                  const colorClasses = isStart
                    ? "bg-blue-400 text-black z-30"
                    : isTarget
                    ? "bg-red-400 text-black z-30"
                    : "bg-transparent border-transparent";

                  return (
                    <div
                      key={station.id}
                      title={station.name_en}
                      onClick={() => handleStationClick(station)}
                      className={`absolute flex items-center justify-center 
                        sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 xl:w-3.5 xl:h-3.5
                        text-[2px] sm:text-[2.5px] md:text-[3px] xl:text-[4px]
                        font-semibold rounded-full cursor-pointer select-none 
                        ${colorClasses}`}
                      style={{
                        left: `${station.x * xRatio}px`,
                        top: `${station.y * yRatio}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {(isStart || isTarget) && station.station_code}
                    </div>
                  );
                })}

                {/* --- Route Stations (from API) --- */}
                {routeStations.map((station, index) => (
                  <div
                    key={index}
                    title={station.station_code}
                    className="absolute flex items-center justify-center 
                      sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 xl:w-3.5 xl:h-3.5
                      text-[2px] sm:text-[2.5px] md:text-[3px] xl:text-[4px]
                      font-semibold rounded-full cursor-default select-none 
                     bg-[#00ff8c] text-black z-20"
                    style={{
                      left: `${station.x * xRatio}px`,
                      top: `${station.y * yRatio}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {station.station_code.trim()}
                  </div>
                ))}
                {/* Animated "Train" / Traveling Dot */}
                {activeIndex >= 0 && routeStations[activeIndex] && (
                  <div
                    key={activeIndex}
                    title={routeStations[activeIndex].station_code}
                    className="absolute flex items-center justify-center 
                       sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 xl:w-3.5 xl:h-3.5
                      text-[2px] sm:text-[2.5px] md:text-[3px] xl:text-[4px]
                      font-semibold rounded-full border cursor-default select-none
                      bg-red-400 border-red-600 text-black z-30
                      transition-all duration-300 ease-in-out"
                    style={{
                      left: `${routeStations[activeIndex].x * xRatio}px`,
                      top: `${routeStations[activeIndex].y * yRatio}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {routeStations[activeIndex].station_code.trim()}
                  </div>
                )}
              </div>
            </TransformComponent>
          </TransformWrapper>

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
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 text-sm">
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

      {/* <div className="w-full md:w-70 ">
        <TripPlannerBox
          selectedStartStation={startStation}
          selectedTargetStation={targetStation}
          onPathStations={setRouteStations}
          resetTrigger={resetTrigger}
        />
      </div> */}
    </div>
  );
}
