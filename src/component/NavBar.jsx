import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const baseClasses =
    "px-3 py-2 text-sm border border-transparent block text-center";
  const inactiveClasses = "text-white transition-colors";
  const activeClasses =
    "bg-[#151922] border rounded-lg text-white border-white/10";

  const links = [
    { to: "/", label: "Home" },
    { to: "/map", label: "Map" },
    { to: "/routes", label: "Routes" },
    { to: "/stations", label: "Stations" },
    { to: "/fares", label: "Fares" },
    { to: "/planner", label: "Planner" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0aa9] border-b border-white/10 backdrop-blur-[10px]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex flex-row items-center">
            <img
            src="/logo.png"
            alt="Bangkok Transit"
            className="h-full w-7 select-none pointer-events-none"
          />
          <div className="text-white text-xl font-bold ms-3">Bangkok Transit</div>
          </div>
        

          {/* Desktop links */}
          <div className="hidden md:flex space-x-5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${baseClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {open ? (
              // X icon
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
