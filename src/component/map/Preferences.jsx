import { useState, useMemo, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useStations } from "../../hooks/useStations";

export default function LinesDropdown({ onChange, selectedLine  }) {
  const [selected, setSelected] = useState(selectedLine || "All");
  const { stations, isLoading, error } = useStations();
  // const options = ["All", "Blue", "Sukhumvit", "Silom", "Red", "Yellow", "Pink"];

  //Extract unique line names dynamically from API
  const lineOptions = useMemo(() => {
    if (!stations || stations.length === 0) return ["All"];
    const uniqueLines = Array.from(
      new Set(stations.map((s) => s.line?.name_en).filter(Boolean))
    );
    return ["All", ...uniqueLines];
  }, [stations]);

  useEffect(() => {
    // Sync with parent if props change
    if (selectedLine !== undefined) {
      setSelected(selectedLine);
    }
  }, [selectedLine]);

  const handleSelect = (option) => {
    setSelected(option);
    onChange(option); // notify parent
  };

  if (isLoading)
    return (
      <div className="text-gray-400 text-sm px-3 py-2">Loading lines...</div>
    );
  if (error)
    return (
      <div className="text-red-400 text-sm px-3 py-2">Failed to load lines</div>
    );

  return (
    <div className="my-4">
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
          className="absolute left-0 z-10 mt-2 w-full origin-top rounded-md bg-gray-950 border border-white/10 shadow-lg focus:outline-none
            max-h-74 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
            data-closed:scale-95 data-closed:opacity-0 data-closed:transform 
            data-enter:duration-100 data-enter:ease-out 
            data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-1">
            {lineOptions.map((option) => (
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
