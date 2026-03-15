import type { DailyForecastPropsI, WeatherDataI } from "../types/types.ts";
import { getWeatherIcon } from "../utils/weatherHelpers.ts";

function DailyForecast({
  dailyMax,
  dailyMin,
  dailyWeatherCodes,
  selectedUnit,
  addConvertTemperature,
  addGetTemperatureUnit,
}: DailyForecastPropsI) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Daily Forecast</h2>
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-3">
        {daysOfWeek.map((day, index) => {
          const dayCode = dailyWeatherCodes[index] || 0;
          const dayIcon = getWeatherIcon(dayCode);

          return (
            <div
              key={index}
              className="bg-[#3d3b5eff] px-4 rounded-lg text-center lg:py-4"
            >
              <h3 className="text-[#aeaeb7ff] text-sm mb-3">{day}</h3>
              <img
                src={dayIcon}
                className="w-12 h-12 mx-auto mb-3"
                alt="Weather icon"
              />
              <p className="flex justify-center gap-2 text-sm">
                <span className="font-semibold">
                  {dailyMax[index]
                    ? `${addConvertTemperature(
                        dailyMax[index],
                        selectedUnit,
                      ).toFixed(0)}${addGetTemperatureUnit(selectedUnit)}`
                    : "--"}
                </span>
                <span className="text-[#aeaeb7ff]">
                  {dailyMin[index]
                    ? `${addConvertTemperature(
                        dailyMin[index],
                        selectedUnit,
                      ).toFixed(0)}${addGetTemperatureUnit(selectedUnit)}`
                    : "--"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;
