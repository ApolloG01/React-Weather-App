import { useState } from "react";
import type { HeaderProps, UnitT } from "../types/types.js";

function TempUnits({ selectedUnit, setSelectedUnit }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleUnitSelect = (unit: UnitT) => {
    setSelectedUnit(unit);

    // Delay closing the dropdown
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 400);
  };

  return (
    <div className="w-64 bg-[#272541ff] rounded-lg py-4 px-4">
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-xl font-semibold px-1">
          {selectedUnit === "metric" ? "Celsius" : "Fahrenheit"}
        </h2>
        <div className="relative">
          <button
            className="flex items-center gap-2 py-2 px-3 bg-[#3d3b5eff] rounded-lg hover:bg-[#4a4868] transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              className="w-5 h-5"
              src="icon-units.svg"
              alt="Temperature units"
            />
            <span className="text-sm">Units</span>
            <img
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              src="icon-dropdown.svg"
              alt="Dropdown"
            />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-[#3d3b5eff] rounded-lg 
      shadow-lg z-10 p-4 transition-opacity duration-[400ms] ease-in-out"
            >
              {/* Temperature */}
              <div className="mb-4">
                <h3 className="text-xs text-[#aeaeb7ff] uppercase mb-2">
                  Temperature
                </h3>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                      selectedUnit === "metric"
                        ? "bg-[#4455daff] text-white"
                        : "bg-[#272541ff] text-gray-400 hover:bg-[#4a4868]"
                    }`}
                    onClick={() => handleUnitSelect("metric")}
                  >
                    °C
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                      selectedUnit === "imperial"
                        ? "bg-[#4455daff] text-white"
                        : "bg-[#272541ff] text-gray-400 hover:bg-[#4a4868]"
                    }`}
                    onClick={() => handleUnitSelect("imperial")}
                  >
                    °F
                  </button>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="mb-4">
                <h3 className="text-xs text-[#aeaeb7ff] uppercase mb-2">
                  Wind Speed
                </h3>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                      selectedUnit === "metric"
                        ? "bg-[#4455daff] text-white"
                        : "bg-[#272541ff] text-gray-400 hover:bg-[#4a4868]"
                    }`}
                    onClick={() => handleUnitSelect("metric")}
                  >
                    km/h
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                      selectedUnit === "imperial"
                        ? "bg-[#4455daff] text-white"
                        : "bg-[#272541ff] text-gray-400 hover:bg-[#4a4868]"
                    }`}
                    onClick={() => handleUnitSelect("imperial")}
                  >
                    mph
                  </button>
                </div>
              </div>

              {/* Precipitation */}
              <div>
                <h3 className="text-xs text-[#aeaeb7ff] uppercase mb-2">
                  Precipitation
                </h3>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                      selectedUnit === "metric"
                        ? "bg-[#4455daff] text-white"
                        : "bg-[#272541ff] text-gray-400 hover:bg-[#4a4868]"
                    }`}
                    onClick={() => handleUnitSelect("metric")}
                  >
                    mm
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                      selectedUnit === "imperial"
                        ? "bg-[#4455daff] text-white"
                        : "bg-[#272541ff] text-gray-400 hover:bg-[#4a4868]"
                    }`}
                    onClick={() => handleUnitSelect("imperial")}
                  >
                    in
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TempUnits;
