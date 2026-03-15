import type { CurrentWeatherI, WeatherDataI } from "../types/types.ts";
import {
  getWeatherDescription,
  getWeatherIcon,
} from "../utils/weatherHelpers.ts";

function CurrentWeather({
  location,
  currentDate,
  weatherData,
  selectedDay,
  selectedUnit,
  addConvertTemperature,
  addGetTemperatureUnit,
}: CurrentWeatherI) {
  const {
    temperature_2m_max: dailyMax = [],
    temperature_2m_min: dailyMin = [],
    weather_code: dailyCodes = [],
  } = weatherData?.daily ?? {};

  let currentTemp, description, icon;

  if (selectedDay === 0) {
    // Oggi: usa dati current
    currentTemp = weatherData.current?.temperature_2m;
    const currentCode = weatherData.current?.weather_code || 0;
    description = getWeatherDescription(currentCode);
    icon = getWeatherIcon(currentCode);
  } else {
    // Giorni futuri: calcola media e usa daily
    const maxTemp = dailyMax[selectedDay] || 0;
    const minTemp = dailyMin[selectedDay] || 0;
    currentTemp = Math.round((maxTemp + minTemp) / 2); // Media
    const dayCode = dailyCodes[selectedDay] || 0;
    description = getWeatherDescription(dayCode);
    icon = getWeatherIcon(dayCode);
  }

  // Get base URL for GitHub Pages
  const baseUrl = import.meta.env.PROD ? "/React-Weather-App/" : "/";

  const backgroundStyle = {
    backgroundImage: `url('${baseUrl}bg-today-small.svg')`,
  };

  const backgroundStyleLarge = {
    backgroundImage: `url('${baseUrl}bg-today-large.svg')`,
  };

  return (
    <div
      className="relative w-full min-h-[320px] bg-cover bg-center rounded-2xl overflow-hidden shadow-xl content-center"
      style={window.innerWidth >= 768 ? backgroundStyleLarge : backgroundStyle}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative h-full p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{location || "Select a city"}</h2>
          <p className="text-sm text-gray-200 mt-1">
            {currentDate
              ? currentDate.charAt(0).toUpperCase() + currentDate.slice(1)
              : ""}
          </p>{" "}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-4">
            <img
              src={icon}
              className="w-20 h-20 lg:w-24 lg:h-24"
              alt={description}
            />
            <div>
              <div className="text-6xl lg:text-7xl font-bold">
                {currentTemp
                  ? `${addConvertTemperature(currentTemp, selectedUnit).toFixed(
                      0,
                    )} ${addGetTemperatureUnit(selectedUnit)}`
                  : "--"}
                <p className="text-lg text-gray-200">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
