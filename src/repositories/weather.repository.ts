import { injectable } from "tsyringe";
import {
  IWeatherRepository,
  WeatherResponse,
  WeatherForecastDay,
} from "../interfaces/weather.interface";

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

@injectable()
export class WeatherRepository implements IWeatherRepository {
  private readonly baseUrl = process.env.OPEN_METEO_API_URL!;

  async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherResponse> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: "temperature_2m,wind_speed_10m,weather_code",
      daily: "temperature_2m_max,temperature_2m_min,weather_code",
      forecast_days: "7",
    });

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Open-Meteo API error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as OpenMeteoResponse;
    return this.mapResponse(data);
  }

  private mapResponse(data: OpenMeteoResponse): WeatherResponse {
    const forecast: WeatherForecastDay[] = data.daily.time.map((date, i) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[i],
      temperatureMin: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
    }));

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      current: {
        temperature: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        time: data.current.time,
      },
      forecast,
    };
  }
}
