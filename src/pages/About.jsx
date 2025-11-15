import {
  Info,
  Map,
  MousePointer,
  Smartphone,
  Database,
  Users,
  HardDrive,
  SquareChartGantt
} from "lucide-react";

export default function About() {
  return (
    <div className="px-6 py-10 text-gray-200 max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-10">Bangkok Transit Project</h1>

        <p className="text-gray-400 text-sm leading-relaxed  mx-auto text-justify">
          A unified, intelligent transit platform that solves Bangkok’s
          long-standing navigation challenges by combining BTS, MRT, ARL, and
          SRT systems into one interactive experience. It supports both the
          current 2025 network and projected 2035 expansions, helping commuters,
          tourists, and planners explore real and future city connectivity.
        </p>

        <div className="mt-10 p-[1px] rounded-xl bg-gradient-to-r from-[#32B67A]/40 to-indigo-500/40">
          <div className="rounded-xl bg-black/40 px-5 py-3 text-sm text-gray-300 leading-relaxed">
            Built with <span className="text-white">React</span>,{" "}
            <span className="text-white">Vite</span>,{" "}
            <span className="text-white">Tailwind CSS</span>,{" "}
            <span className="text-white">FastAPI</span>, and a custom{" "}
            <span className="text-white">graph-based routing engine</span>{" "}
            capable of computing shortest, cheapest, and alternative routes
            using official fare structures and integrated multi-line transit
            data.
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-500 max-w-xl mx-auto">
          Designed to reduce fragmented information across transit systems,
          improve route accuracy, support scalability, and align with Bangkok’s
          Smart City goals.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-5">
        {/* How to plan a trip */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Map size={18} /> How to plan a trip?
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              Use the <strong>Planner</strong> to set your origin and
              destination, choose routing preferences, and view detailed
              results.
            </p>
            <ul className="list-disc ml-5 mt-3 space-y-1">
              <li>
                Select <strong>From</strong> and <strong>To</strong> stations
              </li>
              <li>Choose a route type (Shortest, Cheapest, All Routes)</li>
              <li>View metrics & step-by-step navigation</li>
              <li>Reset anytime</li>
              <li>Tap a station on the map to quickly set start/target</li>
            </ul>
          </div>
        </details>

        {/* Why fares are approximate */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Info size={18} /> Why are fares approximate?
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              Fares are estimates based on publicly available fare structures.
              Actual fares may vary depending on operators and policy updates.
            </p>
            <ul className="list-disc ml-5 mt-3 space-y-1">
              <li>Different systems use different pricing models</li>
              <li>Temporary promotions or caps</li>
              <li>Interchange rules between operators</li>
              <li>2035 network is projected data</li>
            </ul>
          </div>
        </details>

        {/* Keyboard & mouse tips */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <MousePointer size={18} /> Keyboard & Mouse Tips
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm">
            <p className="mb-2">Desktop interactions:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Click — select station</li>
              <li>Drag — pan map</li>
              <li>Scroll — zoom</li>
            </ul>
          </div>
        </details>

        {/* Mobile tips */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Smartphone size={18} /> Mobile Tips
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm">
            <ul className="list-disc ml-5 space-y-1">
              <li>Tap stations to choose start/destination</li>
              <li>Pinch to zoom, drag to pan</li>
              <li>Long-press for more options (if enabled)</li>
              <li>Use Quick Planner for shortcuts</li>
              <li>Zoom in for more accurate selection</li>
            </ul>
          </div>
        </details>

        {/* Data sources */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <SquareChartGantt size={18} /> Future Plan
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              The system uses a curated station dataset, projected 2035
              expansions, graph-based routing algorithms, and estimated fare
              models.
            </p>

            <p className="mt-3">Planned future integrations:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Official fares APIs</li>
              <li>Real-time schedules</li>
              <li>Service alerts & interruptions</li>
              <li>Multi-language support</li>
            </ul>
          </div>
        </details>

        {/* Team credits */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Users size={18} /> Team Credits
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>This project was collaboratively developed by:</p>
            <ul className="list-disc ml-5 mt-3 space-y-1">
              <li>Thi Han Nyunt</li>
              <li>Kaung Htet Tha</li>
              <li>Pyae Htut Khaing</li>
              <li>Pyae Sone Thant Kyaw</li>
              <li>Xaphone Saechao</li>
            </ul>

            <div className="mt-4 pt-3 border-t border-white/10 text-gray-400 text-xs">
              Mahidol University — Faculty of ICT (ICT Mahidol)
              <br />
              Master of Science in Information Technology and Computer Science
              (ITCS)
            </div>
          </div>
        </details>

        {/* Official Data Credits */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4 transition hover:bg-white/10">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Database size={18} /> Data Credits
            </span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              Transit information is referenced from publicly available data
              provided by:
            </p>

            <ul className="list-disc ml-5 mt-3 space-y-1">
              <li>BTS Skytrain (Bangkok Mass Transit System)</li>
              <li>
                MRT Subway (Mass Rapid Transit Authority of Thailand – MRTA)
              </li>
              <li>Airport Rail Link (ARL)</li>
              <li>State Railway of Thailand (SRT)</li>
              <li>
                Bangkok 2035 expansion proposals and publicly published planning
                documents
              </li>
            </ul>

            <p className="mt-4 text-gray-400 text-xs leading-relaxed">
              These sources are used solely for academic and visualization
              purposes. This project is not officially affiliated with any
              transit operator.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
