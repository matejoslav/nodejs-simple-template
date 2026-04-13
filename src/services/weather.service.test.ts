import "reflect-metadata";
import { WeatherService } from "./weather.service";
import {
  IWeatherRepository,
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
  forecast: [
    {
      date: "2026-04-13",
      temperatureMax: 25.0,
      temperatureMin: 15.0,
      weatherCode: 1,
    },
  ],
};

function createMockRepository(): jest.Mocked<IWeatherRepository> {
  return {
    getCurrentWeather: jest.fn(),
  };
}

describe("WeatherService", () => {
  let service: WeatherService;
  let mockRepo: jest.Mocked<IWeatherRepository>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    service = new WeatherService(mockRepo);
  });

  it("should return weather data for valid coordinates", async () => {
    mockRepo.getCurrentWeather.mockResolvedValue(mockWeatherResponse);

    const result = await service.getWeather(48.21, 16.37);

    expect(result).toEqual(mockWeatherResponse);
    expect(mockRepo.getCurrentWeather).toHaveBeenCalledWith(48.21, 16.37);
  });

  it("should throw for latitude out of range", async () => {
    await expect(service.getWeather(91, 16.37)).rejects.toThrow(
      "Latitude must be between -90 and 90"
    );
    expect(mockRepo.getCurrentWeather).not.toHaveBeenCalled();
  });

  it("should throw for negative latitude out of range", async () => {
    await expect(service.getWeather(-91, 16.37)).rejects.toThrow(
      "Latitude must be between -90 and 90"
    );
  });

  it("should throw for longitude out of range", async () => {
    await expect(service.getWeather(48.21, 181)).rejects.toThrow(
      "Longitude must be between -180 and 180"
    );
    expect(mockRepo.getCurrentWeather).not.toHaveBeenCalled();
  });

  it("should throw for negative longitude out of range", async () => {
    await expect(service.getWeather(48.21, -181)).rejects.toThrow(
      "Longitude must be between -180 and 180"
    );
  });

  it("should propagate repository errors", async () => {
    mockRepo.getCurrentWeather.mockRejectedValue(new Error("API unavailable"));

    await expect(service.getWeather(48.21, 16.37)).rejects.toThrow(
      "API unavailable"
    );
  });

  it("should accept boundary coordinates", async () => {
    mockRepo.getCurrentWeather.mockResolvedValue(mockWeatherResponse);

    await service.getWeather(90, 180);
    expect(mockRepo.getCurrentWeather).toHaveBeenCalledWith(90, 180);

    await service.getWeather(-90, -180);
    expect(mockRepo.getCurrentWeather).toHaveBeenCalledWith(-90, -180);
  });
});
