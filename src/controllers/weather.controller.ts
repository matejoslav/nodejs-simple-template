import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { TOKENS } from "../config/tokens";
import { IWeatherService } from "../interfaces/weather.interface";

@injectable()
export class WeatherController {
  constructor(
    @inject(TOKENS.WeatherService)
    private readonly weatherService: IWeatherService
  ) {}

  async getWeather(req: Request, res: Response): Promise<void> {
    const latitude = parseFloat(req.query.lat as string);
    const longitude = parseFloat(req.query.lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ error: "lat and lon query parameters are required and must be numbers" });
      return;
    }

    try {
      const weather = await this.weatherService.getWeather(latitude, longitude);
      res.json(weather);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
}
