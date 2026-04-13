import "reflect-metadata";
import { WeatherController } from "./weather.controller";
import {
  IWeatherService,
  WeatherResponse,
} from "../interfaces/weather.interface";

const mockWeatherResponse: WeatherResponse = {
  latitude: 48.21,
  longitude: 16.37,
  current: {
    temperature: 22.5,
    windSpeed: 10.2,
    weatherCode: 1,
    time: "2026-04-13T12:00",
  },
  forecast: [],
};

function createMockService(): jest.Mocked<IWeatherService> {
  return {
    getWeather: jest.fn(),
  };
}

describe("WeatherController", () => {
  let controller: WeatherController;
  let mockService: jest.Mocked<IWeatherService>;

  beforeEach(() => {
    mockService = createMockService();
    controller = new WeatherController(mockService);
  });

  it("should return weather data for valid coordinates", async () => {
    mockService.getWeather.mockResolvedValue(mockWeatherResponse);

    const result = await controller.getWeather(48.21, 16.37);

    expect(mockService.getWeather).toHaveBeenCalledWith(48.21, 16.37);
    expect(result).toEqual(mockWeatherResponse);
  });

  it("should propagate service errors", async () => {
    mockService.getWeather.mockRejectedValue(new Error("Service error"));

    await expect(controller.getWeather(48.21, 16.37)).rejects.toThrow(
      "Service error"
    );
  });
});
