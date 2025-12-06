import { useState, useEffect } from "react";
import axios from "axios";

import Search from "./components/Search.jsx";

const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
};

const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return "icon-sunny.webp";
  if (code === 2) return "icon-partly-cloudy.webp";
  if (code === 3) return "icon-overcast.webp";
  if (code >= 45 && code <= 48) return "icon-fog.webp"; // Solo per nebbia
  if (code >= 51 && code <= 67) return "icon-rain.webp";
  if (code >= 71 && code <= 77) return "icon-snow.webp";
  if (code >= 80 && code <= 82) return "icon-drizzle.webp";
  if (code >= 85 && code <= 86) return "icon-snow.webp";
  if (code >= 95) return "icon-storm.webp";
  return "--";
};

function App() {
  const [cities, setCities] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDailyArrTime, setCurrentDailyArrTime] = useState([]);
  const [currentDailyArrTemp, setCurrentDailyArrTemp] = useState([]);
  const [rawHourlyWeatherCodes, setRawHourlyWeatherCodes] = useState([]);
  const [rawDailyWeatherCodes, setRawDailyWeatherCodes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);

  function handleCityClick(city) {
    setSearchTerm(city.name);
    setCities([]);
    setLocation(city.name);
    setLatitude(city.latitude);
    setLongitude(city.longitude);
  }

  useEffect(
    function () {
      async function fetchWeather() {
        try {
          setIsLoading(true);
          setError(null);

          const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7`
          );

          setWeatherData(response.data);

          const hourlyTimes = response.data.hourly?.time || [];
          const hourlyTemps = response.data.hourly?.temperature_2m || [];
          const hourlyCodes = response.data.hourly?.weather_code || [];

          let startIndex;
          let offset = 0; // Quante ore "saltare" dall'inizio del giorno

          if (selectedDay === 0) {
            // PER OGGI: dall'ora corrente
            const now = new Date();
            const currentHour = now.getHours();

            startIndex = hourlyTimes.findIndex((timeStr) => {
              const time = new Date(timeStr);
              return time.getHours() === currentHour;
            });

            if (startIndex === -1) startIndex = 0;
          } else {
            // PER GIORNI FUTURI: dalle 8:00 (ore diurne)
            startIndex = selectedDay * 24;
            offset = 8; // Salta le prime 8 ore (00:00-07:00)
          }

          // Aggiungi l'offset
          const actualStartIndex = startIndex + offset;

          // Prendi le prossime 8 ore
          const dayTimes = hourlyTimes.slice(
            actualStartIndex,
            actualStartIndex + 8
          );
          const dayTemps = hourlyTemps.slice(
            actualStartIndex,
            actualStartIndex + 8
          );
          const dayCodes = hourlyCodes.slice(
            actualStartIndex,
            actualStartIndex + 8
          );

          const formattedTimes = dayTimes.map((ts) =>
            new Date(ts).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          );

          setCurrentDailyArrTime(formattedTimes);
          setCurrentDailyArrTemp(dayTemps);
          setRawHourlyWeatherCodes(dayCodes);

          // Data da mostrare
          if (selectedDay === 0) {
            const currentWeather = response.data.current;
            const currentTime = currentWeather.time;
            const date = new Date(currentTime);

            const formattedDate = date.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const formattedTime = date.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            setCurrentDate(`${formattedDate} • ${formattedTime}`);
          } else {
            const dayDate = new Date(dayTimes[0]);
            const formattedDate = dayDate.toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            setCurrentDate(formattedDate);
          }

          const dailyWeatherCodes = response.data.daily?.weather_code || [];
          setRawDailyWeatherCodes(dailyWeatherCodes.slice(0, 7));
        } catch (err) {
          setError(err.message);
          console.error("Error fetching weather:", err);
        } finally {
          setIsLoading(false);
        }
      }

      if (latitude && longitude) {
        fetchWeather();
      }
    },
    [latitude, longitude, location, selectedDay]
  );

  // Current weather Variables
  const currentTemp = weatherData.current?.temperature_2m;
  const currentHumidity = weatherData.current?.relative_humidity_2m;
  const currentWindSpeed = weatherData.current?.wind_speed_10m;
  const currentPrecipitation = weatherData.current?.precipitation;

  const feelsLike = weatherData.current?.apparent_temperature || currentTemp;
  const currentWeatherCode = weatherData.current?.weather_code || 0;
  const description = getWeatherDescription(currentWeatherCode);
  const currentIcon = getWeatherIcon(currentWeatherCode);

  // Daily Forecast Variables
  const dailyMax = weatherData.daily?.temperature_2m_max || [];
  const dailyMin = weatherData.daily?.temperature_2m_min || [];

  if (error) {
    return (
      <div className="min-h-screen bg-[#03012dff] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#03012dff] text-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="lg:py-5 min-h-screen bg-[#03012dff] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-start-3 lg:col-span-8 space-y-6">
            <h1 className="text-4xl lg:text-5xl lg:py-10 font-bold text-center">
              How's the sky looking today?
            </h1>

            <Search
              setLocation={setLocation}
              setCities={setCities}
              cities={cities}
              location={location}
              handleCityClick={handleCityClick}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />
          </div>

          <div className="lg:col-span-12">
            <div className="lg:grid lg:grid-cols-12 lg:gap-6 mt-6">
              <main className="lg:col-span-9 space-y-6">
                <CurrentWeather
                  location={location}
                  currentDate={currentDate}
                  weatherData={weatherData}
                  selectedDay={selectedDay}
                />
                <CurrentWeatherMetrics
                  currentHumidity={currentHumidity}
                  currentWindSpeed={currentWindSpeed}
                  currentPrecipitation={currentPrecipitation}
                  feelsLike={feelsLike}
                />
                <DailyForecast
                  dailyMax={dailyMax}
                  dailyMin={dailyMin}
                  dailyWeatherCodes={rawDailyWeatherCodes}
                />
              </main>

              <aside className="lg:col-span-3 mt-6 lg:my-auto">
                <HourlyForecast
                  currentdailyArrTime={currentDailyArrTime}
                  currentdailyArrTemp={currentDailyArrTemp}
                  hourlyWeatherCodes={rawHourlyWeatherCodes}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function Header() {
  return (
    <header className="flex justify-between items-center">
      <Logo />
      <TempUnits />
    </header>
  );
}

function Logo() {
  return (
    <div>
      <img className="w-32 lg:w-40" src="logo.svg" alt="logo" />
    </div>
  );
}

function TempUnits() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("metric");

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setIsDropdownOpen(false);
  };

  function convertToFarhenheight(c) {
    return (c * 9) / 5 + 32;
  }
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 py-2 px-3 bg-[#3d3b5eff] rounded-lg hover:bg-[#4a4868] transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <img className="w-5 h-5" src="icon-units.svg" alt="Temperature units" />
        <span className="text-sm">Units</span>
        <img
          className={`w-4 h-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          src="icon-dropdown.svg"
          alt="Dropdown"
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#3d3b5eff] rounded-lg shadow-lg z-10 p-4">
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
  );
}

function Loader() {
  return (
    <h1 className="flex gap-3">
      <img src="icon-loading.svg" />
      Is Loading...
    </h1>
  );
}

function CurrentWeather({ location, currentDate, weatherData, selectedDay }) {
  const dailyMax = weatherData.daily?.temperature_2m_max || [];
  const dailyMin = weatherData.daily?.temperature_2m_min || [];
  const dailyCodes = weatherData.daily?.weather_code || [];

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
          <p className="text-sm text-gray-200 mt-1">{currentDate || ""}</p>
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
                {currentTemp ? `${currentTemp} °C` : "--"}
                <p className="text-lg text-gray-200">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentWeatherMetrics({
  currentHumidity,
  currentWindSpeed,
  currentPrecipitation,
  feelsLike,
}) {
  const metrics = [
    { label: "Feels Like", value: `${feelsLike || "--"} °C` },
    { label: "Humidity", value: `${currentHumidity || "--"}%` },
    { label: "Wind", value: `${currentWindSpeed || "--"} km/h` },
    { label: "Precipitation", value: `${currentPrecipitation || "--"} mm` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-[#3d3b5eff] p-4 rounded-lg text-center">
          <h3 className="text-[#aeaeb7ff] text-sm mb-2">{metric.label}</h3>
          <p className="text-2xl font-semibold">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

function DailyForecast({ dailyMax, dailyMin, dailyWeatherCodes }) {
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
                  {dailyMax[index] ? `${dailyMax[index]}°C` : "--"}
                </span>
                <span className="text-[#aeaeb7ff]">
                  {dailyMin[index] ? `${dailyMin[index]}°C` : "--"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HourlyForecast({
  currentdailyArrTime,
  currentdailyArrTemp,
  hourlyWeatherCodes,
  selectedDay,
  setSelectedDay,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleDaySelect = (dayIndex) => {
    setSelectedDay(dayIndex);
    setIsDropdownOpen(false);
  };

  const hours = currentdailyArrTime.map((time, index) => ({
    time: index === 0 && selectedDay === 0 ? "Now" : time,
    temp: currentdailyArrTemp[index] || "--",
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
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              src="icon-dropdown.svg"
              alt="Dropdown"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#3d3b5eff] rounded-lg shadow-lg z-10">
              {daysToShow.map((day) => (
                <button
                  key={day.index}
                  className={`w-full text-left px-4 py-3 hover:bg-[#4a4868] transition-colors ${
                    selectedDay === day.index ? "bg-[#4a4868] font-medium" : ""
                  }`}
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
                {hour.temp}°C
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
