export default function About() {
  return (
    <div className="px-6 py-6 text-gray-200">
      <div className="space-y-4 mb-10">
        <h1 className="text-3xl font-semibold mb-8">Bangkok Transit Project</h1>
        <p className="mt-2">
          Built with React, Vite, Tailwind CSS, and custom interaction logic.
        </p>
        <p className="mt-3">
          Features: routing engine, future line expansion preview, station
          details, trip planner, and route comparison.
        </p>
      </div>
      <div className="space-y-4">
        {/* How to plan a trip */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span>How to plan a trip?</span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              Use the <strong>Planner</strong> to set your origin and
              destination, choose routing preferences, and view detailed
              results. You can also send stations directly from the map by
              tapping or clicking them.
            </p>
            <ul className="list-disc ml-5 mt-3 space-y-1">
              <li>
                Select <strong>From</strong> and <strong>To</strong> stations
              </li>
              <li>Pick a route preference (Shortest, Cheapest, All Routes)</li>
              <li>View metrics and step-by-step route instructions</li>
              <li>Reset anytime using the reset button</li>
              <li>Tap a station on the map to quickly set start/target</li>
            </ul>
          </div>
        </details>

        {/* Why fares are approximate */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span>Why are fares approximate?</span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              Fares shown are estimated based on publicly available fare
              structures. Actual fares may vary because:
            </p>
            <ul className="list-disc ml-5 mt-3 space-y-1">
              <li>Different operators use different pricing rules</li>
              <li>Temporary promotions or fare caps</li>
              <li>Interchange policies between systems</li>
              <li>Future 2035 lines are based on projections</li>
            </ul>
            <p className="mt-3">
              Once connected to official fare APIs, the app will display
              real-time accurate fare data.
            </p>
          </div>
        </details>

        {/* Keyboard & mouse tips */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span>Keyboard & mouse tips</span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p className="mb-2">Desktop interactions:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Click - select a station</li>
              <li>Drag - pan around the map</li>
              <li>Scroll - zoom</li>
            </ul>
          </div>
        </details>

        {/* Mobile tips */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span>Mobile tips</span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <ul className="list-disc ml-5 space-y-1">
              <li>Tap stations to select start or destination</li>
              <li>Pinch to zoom, drag to pan</li>
              <li>Long-press for additional options (if enabled)</li>
              <li>Use the Quick Planner for faster input</li>
              <li>Zoom in for more accurate station tapping</li>
            </ul>
          </div>
        </details>

        {/* Data sources */}
        <details className="group border border-white/10 rounded-xl bg-white/5 p-4">
          <summary className="cursor-pointer font-medium text-lg text-white flex justify-between items-center">
            <span>Data sources</span>
            <span className="transition-transform group-open:rotate-90">›</span>
          </summary>

          <div className="mt-3 text-gray-300 text-sm leading-relaxed">
            <p>
              This app uses a custom curated station dataset, projected 2035
              transit expansions, graph-based routing algorithms, and estimated
              fare models.
            </p>
            <p className="mt-3">Future updates will integrate:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Official fare APIs</li>
              <li>Real-time train schedules</li>
              <li>Maintenance alerts</li>
              <li>Multi-language support</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
