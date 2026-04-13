export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

export interface WeatherForecastDay {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  forecast: WeatherForecastDay[];
}

export interface IWeatherRepository {
  getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherResponse>;
}

export interface IWeatherService {
  getWeather(latitude: number, longitude: number): Promise<WeatherResponse>;
}
