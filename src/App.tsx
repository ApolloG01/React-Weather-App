import { useState } from "react";
import { type CityI } from "./types/types.js";
import {
  getWeatherDescription,
  getWeatherIcon,
} from "./utils/weatherHelpers.js";

import Loader from "./components/Loader.jsx";
import {
  convertTemperature,
  getTemperatureUnit,
} from "./components/tempConversions.js";
import CurrentWeather from "./components/CurrentWeather.tsx";
import DailyForecast from "./components/DailyForecast.tsx";
import HourlyForecast from "./components/HourlyForecast.tsx";
import Header from "./components/Header.tsx";
import CurrentWeatherMetrics from "./components/CurrentWeatherMetrics.tsx";
import Search from "./components/Search.tsx";
import { useWeather } from "./hooks/useWeather.ts";

function App() {
  const [selectedUnit, setSelectedUnit] = useState<"metric" | "imperial">(
    "metric",
  );
  const [selectedDay, setSelectedDay] = useState(0);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<CityI[]>([]);

  // 1. Retrieve Data from useWeather
  const { weatherData, isLoading, error } = useWeather(latitude, longitude);

  // Hourly Forecast
  const hourlyTimes = weatherData?.hourly?.time || [];
  const hourlyTemps = weatherData?.hourly?.temperature_2m || [];
  const hourlyCodes = weatherData?.hourly?.weather_code || [];

  let startIndex = selectedDay * 24;
  let offset = selectedDay === 0 ? new Date().getHours() : 8;
  const actualStartIndex = startIndex + offset;

  // Components Data
  const currentDailyArrTime = hourlyTimes
    .slice(actualStartIndex, actualStartIndex + 8)
    .map((ts) =>
      new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  const currentDailyArrTemp = hourlyTemps.slice(
    actualStartIndex,
    actualStartIndex + 8,
  );
  const rawHourlyWeatherCodes = hourlyCodes.slice(
    actualStartIndex,
    actualStartIndex + 8,
  );
  const rawDailyWeatherCodes = weatherData?.daily?.weather_code || [];

  // Data formattata
  const dateToFormat = weatherData?.daily?.time[selectedDay] || new Date();
  const currentDate = new Date(dateToFormat).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Current Temperature
  const currentTemp = weatherData?.current?.temperature_2m;
  const feelsLike = weatherData?.current?.apparent_temperature || currentTemp;

  // --- 3. Loading Eroor Handling---
  if (error)
    return (
      <div className="min-h-screen bg-[#03012dff] text-white flex items-center justify-center">
        Error: {error}
      </div>
    );
  if (isLoading)
    return (
      <div className="min-h-screen bg-[#03012dff] text-white flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="lg:py-5 min-h-screen bg-[#03012dff] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {location && (
          <Header
            setSelectedUnit={setSelectedUnit}
            selectedUnit={selectedUnit}
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-start-3 lg:col-span-8 space-y-6">
            <h1 className="text-4xl lg:text-5xl lg:py-10 font-bold text-center">
              {location
                ? "How's the sky looking today?"
                : "Please enter a location"}
            </h1>
            <Search
              setLocation={setLocation}
              setCities={setCities}
              cities={cities}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />
          </div>

          {location && weatherData && (
            <div className="lg:col-span-12 mt-6">
              <div className="lg:grid lg:grid-cols-12 lg:gap-6">
                <main className="lg:col-span-9 space-y-6">
                  <CurrentWeather
                    location={location}
                    currentDate={currentDate}
                    weatherData={weatherData}
                    selectedDay={selectedDay}
                    selectedUnit={selectedUnit}
                    addConvertTemperature={convertTemperature}
                    addGetTemperatureUnit={getTemperatureUnit}
                  />
                  <CurrentWeatherMetrics
                    currentHumidity={weatherData.current?.relative_humidity_2m}
                    currentWindSpeed={weatherData.current?.wind_speed_10m}
                    currentPrecipitation={weatherData.current?.precipitation}
                    feelsLike={feelsLike}
                    selectedUnit={selectedUnit}
                    addConvertTemperature={convertTemperature}
                    addGetTemperatureUnit={getTemperatureUnit}
                  />
                  <DailyForecast
                    dailyMax={weatherData.daily?.temperature_2m_max || []}
                    dailyMin={weatherData.daily?.temperature_2m_min || []}
                    dailyWeatherCodes={rawDailyWeatherCodes}
                    selectedUnit={selectedUnit}
                    addConvertTemperature={convertTemperature}
                    addGetTemperatureUnit={getTemperatureUnit}
                  />
                </main>
                <aside className="lg:col-span-3 mt-6 lg:my-auto">
                  <HourlyForecast
                    currentdailyArrTime={currentDailyArrTime}
                    currentdailyArrTemp={currentDailyArrTemp}
                    hourlyWeatherCodes={rawHourlyWeatherCodes}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    selectedUnit={selectedUnit}
                    addConvertTemperature={convertTemperature}
                    addGetTemperatureUnit={getTemperatureUnit}
                  />
                </aside>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
