import { inject, injectable } from "tsyringe";
import { TOKENS } from "../config/tokens";
import {
  IWeatherRepository,
  IWeatherService,
  WeatherResponse,
} from "../interfaces/weather.interface";

@injectable()
export class WeatherService implements IWeatherService {
  constructor(
    @inject(TOKENS.WeatherRepository)
    private readonly weatherRepository: IWeatherRepository
  ) {}

  async getWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherResponse> {
    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    return this.weatherRepository.getCurrentWeather(latitude, longitude);
  }
}
