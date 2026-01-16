import fetch from "node-fetch";

import { WEATHER_BOOSTS } from "../config/boostConfig.js"
import { GAME_CENTER } from "../config/mapConfig.js";

import 'dotenv/config';

let currentWeather = null;

export async function fetchWeather(lat = GAME_CENTER[0][0], lng = GAME_CENTER[0][1]) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weathercode&current_weather=true`;
  
  const res = await fetch(url);
  const data = await res.json();

  currentWeather = data.current_weather || {};
  return currentWeather;
}

export function getWeatherBoosts() {
  if(!currentWeather) {
    return [];
  }

  const boosts = [];

  if(currentWeather.is_day === 0) {
    boosts.push(...WEATHER_BOOSTS.night);
  }

  if (currentWeather.temperature > 25) boosts.push(...WEATHER_BOOSTS.hot);
  if (currentWeather.temperature < 0) boosts.push(...WEATHER_BOOSTS.cold);

  if(currentWeather.windspeed > 10) {
    boosts.push(...WEATHER_BOOSTS.windy);
  }

  const code = currentWeather.weathercode;

  if (code === 0) boosts.push(...WEATHER_BOOSTS.clear);
  if (code === 1) boosts.push(...WEATHER_BOOSTS.sunny);
  if ([61, 63, 65].includes(code)) boosts.push(...WEATHER_BOOSTS.rain);
  if ([71, 73, 75, 77].includes(code)) boosts.push(...WEATHER_BOOSTS.snowy);
  if (code === 3) boosts.push(...WEATHER_BOOSTS.cloudy);
  if (code === 45 || code === 48) boosts.push(...WEATHER_BOOSTS.fog);
  if ([95, 96, 99].includes(code)) boosts.push(...WEATHER_BOOSTS.thunderstorm);

  return boosts;
}