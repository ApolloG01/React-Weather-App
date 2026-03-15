import { useState, useEffect } from "react";
import axios from "axios";
import type { WeatherDataI } from "../types/types.ts";
import Loader from "../components/Loader.tsx";

export function useWeather(lat: number | null, lon: number | null) {
  const [weatherData, setWeatherData] = useState<WeatherDataI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      if (!lat || !lon) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<WeatherDataI>(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7&timezone=auto`,
        );
        setWeatherData(response.data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
  }, [lat, lon]);

  return { weatherData, isLoading, error };
}
