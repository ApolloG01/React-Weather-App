// City Data
export interface CityI {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  timezone?: string;
  location?: string;
}

// General Weather Data
export interface WeatherDataI {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    apparent_temperature: number;
    weather_code: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
}

// Daily Forecast for DailyForecast Props
export interface DailyForecastPropsI {
  dailyMax: number[];
  dailyMin: number[];
  dailyWeatherCodes: number[];
  selectedUnit: "metric" | "imperial";
  addConvertTemperature: (c: number, unit: "metric" | "imperial") => number;
  addGetTemperatureUnit: (unit: "metric" | "imperial") => string;
}

// Hourly Forecast for HourlyForecast Props
export interface HourlyForecastPropsI {
  currentdailyArrTime: string[];
  currentdailyArrTemp: number[];
  hourlyWeatherCodes: number[];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  selectedUnit: "metric" | "imperial";
  addConvertTemperature: (c: number, unit: "metric" | "imperial") => number;
  addGetTemperatureUnit: (unit: "metric" | "imperial") => string;
}

export interface HeaderProps {
  selectedUnit: UnitT;
  setSelectedUnit: (unit: UnitT) => void;
}

export interface SearchProps {
  location: string;
  setLocation: (val: string) => void;
  setCities: (cities: CityI[]) => void;
  cities: CityI[];
  setLatitude: (lat: number | null) => void;
  setLongitude: (lon: number | null) => void;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  handleCityClick?: (city: CityI) => void;
  setSearchCity?: (city: string) => void;
}

export type WeatherCodeValueT = Record<number, string>;
export type DateTypeT = string | number | Date;
export type UnitT = "metric" | "imperial";
