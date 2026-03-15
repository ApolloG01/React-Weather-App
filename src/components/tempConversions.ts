import type { UnitT } from "../types/types.js";

export function convertTemperature(C: number, unit: UnitT) {
  return unit === "imperial" ? (C * 9) / 5 + 32 : C;
}

export function getTemperatureUnit(unit: UnitT) {
  return unit === "metric" ? "°C" : "°F";
}

function convertToFarhenheight(c: number) {
  return (c * 9) / 5 + 32;
}
