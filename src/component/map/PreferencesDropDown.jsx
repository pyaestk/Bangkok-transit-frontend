import { useState, useMemo, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useStations } from "../../hooks/useStations";

export default function PreferencesDropdown({ onChange, selectedPreference }) {
const [selected, setSelected] = useState(selectedPreference || "Shortest");
  const options = ["Shortest", "Longest", "Cheapest", "Fare"];

  const handleSelect = (option) => {
    setSelected(option);
    if (onChange) onChange(option);
  };
  

  return (
    <div className="relative w-full">
      <Menu as="div" className="relative w-full">
        <MenuButton className="inline-flex w-full justify-between rounded-lg bg-black/30 px-3 py-2 text-sm text-white border border-white/10 hover:bg-white/10 focus:outline-none">
          {selected}
          <ChevronDownIcon
            aria-hidden="true"
            className="h-5 w-5 text-gray-400"
          />
        </MenuButton>

        <MenuItems
          transition
          className="absolute left-0 z-50 mt-2 w-full origin-top rounded-md bg-gray-800 border border-white/10 shadow-lg focus:outline-none
            overflow-y-auto transition-all duration-200 ease-out
            scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
            data-closed:scale-95 data-closed:opacity-0 data-closed:transform 
            data-enter:duration-100 data-enter:ease-out 
            data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-1">
            {options.map((option) => (
              <MenuItem key={option}>
                {({ focus }) => (
                  <button
                    onClick={() => handleSelect(option)}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      focus ? "bg-white/5 text-white" : "text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}
