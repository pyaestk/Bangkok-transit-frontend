import "./App.css";
import NavBar from "./component/NavBar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Planner from "./pages/Planner";
import Stations from "./pages/Stations";
import TrainRoutes from "./pages/TrainRoutes";
import About from "./pages/About";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-950">
        {/* Navbar at the top */}
        <NavBar />

        {/* Main content area */}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/routes" element={<TrainRoutes />} />
            <Route path="/stations" element={<Stations/>} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>

      {/* footer */}
      <div className="px-4 sm:px-6 text-sm lg:px-8 py-4 bg-black text-white border-t border-gray-800 flex flex-row justify-between">
        <p className="text-gray-400">© 2025 Bangkok Transit</p>
        <p className="text-[#5AA9FF]">Help</p>
      </div>
    </>
  );
}

export default App;
