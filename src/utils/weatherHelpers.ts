import type { WeatherCodeValueT } from "../types/types.js";

export const weatherCodes: WeatherCodeValueT = {
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

export const getWeatherIcon = (code: number) => {
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

export const getWeatherDescription = (code: number): string => {
  return weatherCodes[code] || "Unknown weather condition";
};
