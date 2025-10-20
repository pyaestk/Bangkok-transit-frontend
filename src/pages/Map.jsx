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

  const [resetTrigger, setResetTrigger] = useState(0);

  // SVG base coordinate system (from your map.svg viewBox)
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
  const handleReset = () => {
    if (transformRef.current) {
      transformRef.current.setTransform(0, 0, 1);
      transformRef.current.centerView(1);
      setScale(1);
    }
  };

  // --- Handle station click ---
  // const handleStationClick = (station) => {
  //   console.log("Clicked station:", station);
  //   setSelectedStation(station);
  // };
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
  };

  if (isLoading)
    return <div className="text-white p-4">Loading stations...</div>;
  if (error)
    return <div className="text-red-400 p-4">Failed to load: {error}</div>;

  // --- Render ---
  return (
    <div className="flex flex-col md:flex-row gap-5 text-white w-full">
      {/* Sidebar */}
      <div className="w-full md:w-80">
        {/* <FiltersCard selectedStation={selectedStation} /> */}
        <TripPlannerBox
          selectedStartStation={startStation}
          selectedTargetStation={targetStation}
          resetTrigger={resetTrigger}
        />
      </div>

      {/* Map */}
      <div className="relative border border-white/10 h-[80vh] w-full flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
        <div className="bg-white rounded-lg h-full flex items-center justify-center overflow-hidden relative">
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            minScale={1}
            maxScale={4}
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
                  className="w-full h-auto select-none pointer-events-none"
                  draggable={false}
                  onLoad={updateRatios} // ✅ run when loaded
                />

                {/* ✅ Station markers (now aligned on first load too) */}
                {stations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => handleStationClick(station)}
                    className={`absolute w-8 h-8 rounded-full cursor-pointer border-2 ${
                      station.id === startStation?.id
                        ? "bg-green-400 border-green-600"
                        : station.id === targetStation?.id
                        ? "bg-red-400 border-red-600"
                        : "bg-transparent border-transparent"
                    }`}
                    style={{
                      left: `${station.x * xRatio}px`,
                      top: `${station.y * yRatio}px`,
                      transform: `translate(-50%, -50%) scale(${1 / scale})`,
                    }}
                    title={station.name_en}
                  />
                ))}
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
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-black/60 text-white hover:bg-black/80 active:scale-95"
            >
              ⟳
            </button>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            <button
              onClick={() => {
                setStartStation(null);
                setTargetStation(null);
                setResetTrigger((prev) => prev + 1);
              }}
              className="px-3 py-2 rounded-lg bg-black/60 text-white hover:bg-black/80 active:scale-95"
            >
              Reset Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
