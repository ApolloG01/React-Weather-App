import type { CurrentWeatherI, UnitT } from "../types/types.ts";

function CurrentWeatherMetrics({
  currentHumidity,
  currentWindSpeed,
  currentPrecipitation,
  feelsLike,
  selectedUnit,
  addConvertTemperature,
  addGetTemperatureUnit,
}: CurrentWeatherI) {
  function convertWindSpeed(speedKmh: number, unit: UnitT) {
    return unit === "imperial" ? speedKmh * 0.621371 : speedKmh;
  }

  function convertPrecipitation(rainMm: number, unit: UnitT) {
    return unit === "imperial" ? rainMm * 0.0393701 : rainMm;
  }

  function getWindSpeedUnit(unit: UnitT) {
    return unit === "metric" ? "km/h" : "mph";
  }

  function getPrecipitationUnit(unit: UnitT) {
    return unit === "metric" ? "mm" : "in";
  }
  const metrics = [
    {
      label: "Feels Like",
      value: `${
        feelsLike
          ? addConvertTemperature(feelsLike, selectedUnit).toFixed(0)
          : "--"
      } ${addGetTemperatureUnit(selectedUnit)}`,
    },
    { label: "Humidity", value: `${currentHumidity || "--"}%` },
    {
      label: "Wind",
      value: `${
        currentWindSpeed
          ? convertWindSpeed(currentWindSpeed, selectedUnit).toFixed(1)
          : "--"
      } ${getWindSpeedUnit(selectedUnit)}`,
    },
    {
      label: "Precipitation",
      value: `${
        currentPrecipitation
          ? convertPrecipitation(currentPrecipitation, selectedUnit).toFixed(1)
          : "--"
      } ${getPrecipitationUnit(selectedUnit)}`,
    },
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

export default CurrentWeatherMetrics;
