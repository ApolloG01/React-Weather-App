import { useState } from "react";
import { getWeatherIcon } from "../utils/weatherHelpers.ts";
import type { HourlyForecastPropsI } from "../types/types.ts";

function HourlyForecast({
  currentdailyArrTime,
  currentdailyArrTemp,
  hourlyWeatherCodes,
  selectedDay,
  setSelectedDay,
  selectedUnit,
  addConvertTemperature,
  addGetTemperatureUnit,
}: HourlyForecastPropsI) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add this

  const handleDaySelect = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    setIsDropdownOpen(false);
  };
  const days = [
    { name: "Today", index: 0 },
    { name: "Tomorrow", index: 1 },
    { name: "Wednesday", index: 2 },
    { name: "Thursday", index: 3 },
    { name: "Friday", index: 4 },
    { name: "Saturday", index: 5 },
    { name: "Sunday", index: 6 },
  ];

  const daysToShow = days;

  const hours = currentdailyArrTime.map((time, index) => ({
    time: index === 0 && selectedDay === 0 ? "Now" : time,
    temp: currentdailyArrTemp[index] || [],
    icon: getWeatherIcon(hourlyWeatherCodes[index] || 0),
  }));

  return (
    <div className="w-full bg-[#272541ff] rounded-lg py-4 px-4">
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-xl font-semibold">Hourly Forecast</h2>

        <div className="relative">
          <button
            className="flex items-center gap-2 py-2 px-3 bg-[#3d3b5eff] rounded-lg hover:bg-[#4a4868] transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-sm">
              {daysToShow[selectedDay]?.name || "Today"}
            </span>
            <img
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              src="icon-dropdown.svg"
              alt="Dropdown"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#3d3b5eff] rounded-lg shadow-lg z-10">
              {daysToShow.map((day) => (
                <button
                  key={day.index}
                  className={`w-full text-left px-4 py-3 hover:bg-[#4a4868] transition-colors ${selectedDay === day.index ? "bg-[#4a4868] font-medium" : ""}`}
                  onClick={() => handleDaySelect(day.index)}
                >
                  <span className="text-sm">{day.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {hours.map((hour, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 px-4 bg-[#3d3b5eff] rounded-lg"
          >
            <span className="text-[#aeaeb7ff] text-sm w-16">{hour.time}</span>
            <div className="flex items-center gap-3">
              <img src={hour.icon} className="w-8 h-8" alt="Weather icon" />
              <span className="text-lg font-semibold w-12 text-right">
                {hour.temp
                  ? `${addConvertTemperature(hour.temp, selectedUnit).toFixed(
                      0,
                    )}${addGetTemperatureUnit(selectedUnit)}`
                  : "--"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
