import "reflect-metadata";
import { container } from "tsyringe";
import { WeatherRepository } from "../repositories/weather.repository";
import { WeatherService } from "../services/weather.service";
import { TOKENS } from "./tokens";

container.register(TOKENS.WeatherRepository, { useClass: WeatherRepository });
container.register(TOKENS.WeatherService, { useClass: WeatherService });

export { container };
