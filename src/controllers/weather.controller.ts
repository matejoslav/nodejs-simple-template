import { inject, injectable } from "tsyringe";
import { Controller, Get, Query, Route } from "tsoa";
import { TOKENS } from "../config/tokens";
import {
  IWeatherService,
  WeatherResponse,
} from "../interfaces/weather.interface";

@Route("api/weather")
@injectable()
export class WeatherController extends Controller {
  constructor(
    @inject(TOKENS.WeatherService)
    private readonly weatherService: IWeatherService
  ) {
    super();
  }

  @Get("/")
  public async getWeather(
    @Query() lat: number,
    @Query() lon: number
  ): Promise<WeatherResponse> {
    return this.weatherService.getWeather(lat, lon);
  }
}
