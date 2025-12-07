import { useState } from "react";
import axios from "axios";

export default function Search({
  setCities,
  cities,
  handleCityClick,
  searchTerm,
  setSearchTerm,
}) {
  // Fetch cities when user types

  const handleInputChange = async (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 2) {
      setCities([]);
      return;
    }

    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=5`
    );

    if (response.data.results) {
      setCities(response.data.results);
    } else {
      setCities([]);
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr,auto] gap-4 items-start">
      <div className="relative">
        {/* Input with icon - STATIC POSITION */}
        <div className="relative">
          <img
            src="icon-search.svg"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50 pointer-events-none z-10"
            alt="Search icon"
          />
          <input
            className="w-full bg-[#3d3b5eff] text-white pl-12 px-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4455daff] placeholder:text-gray-400"
            type="search"
            placeholder="Search for a place..."
            onChange={handleInputChange}
            value={searchTerm}
          />
        </div>

        {/* Dropdown - POSITIONED ABSOLUTELY BELOW, NOT AFFECTING PARENT */}
        {cities.length > 0 && (
          <div className="absolute w-full left-0 top-[calc(100%+4px)] bg-[#3d3b5eff] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {cities.map((city, index) => (
              <div
                className="px-4 py-3 hover:bg-[#4a4868] cursor-pointer"
                key={index}
                onClick={() => handleCityClick(city)}
              >
                <p>
                  {city.name}, {city.country}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="w-full md:w-auto px-8 py-4 bg-[#4455daff] hover:bg-[#5566ebff] rounded-lg font-medium transition-colors">
        Search
      </button>
    </div>
  );
}
