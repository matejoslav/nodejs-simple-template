import "reflect-metadata";
import { WeatherController } from "./weather.controller";
import {
  IWeatherService,
  WeatherResponse,
} from "../interfaces/weather.interface";
import { Request, Response } from "express";

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

function createMockRes(): jest.Mocked<Pick<Response, "status" | "json">> & Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("WeatherController", () => {
  let controller: WeatherController;
  let mockService: jest.Mocked<IWeatherService>;

  beforeEach(() => {
    mockService = createMockService();
    controller = new WeatherController(mockService);
  });

  it("should return weather data for valid query params", async () => {
    mockService.getWeather.mockResolvedValue(mockWeatherResponse);
    const req = { query: { lat: "48.21", lon: "16.37" } } as unknown as Request;
    const res = createMockRes();

    await controller.getWeather(req, res);

    expect(mockService.getWeather).toHaveBeenCalledWith(48.21, 16.37);
    expect(res.json).toHaveBeenCalledWith(mockWeatherResponse);
  });

  it("should return 400 if lat is missing", async () => {
    const req = { query: { lon: "16.37" } } as unknown as Request;
    const res = createMockRes();

    await controller.getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "lat and lon query parameters are required and must be numbers",
    });
  });

  it("should return 400 if lon is missing", async () => {
    const req = { query: { lat: "48.21" } } as unknown as Request;
    const res = createMockRes();

    await controller.getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 for non-numeric lat", async () => {
    const req = { query: { lat: "abc", lon: "16.37" } } as unknown as Request;
    const res = createMockRes();

    await controller.getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 500 when service throws", async () => {
    mockService.getWeather.mockRejectedValue(new Error("Service error"));
    const req = { query: { lat: "48.21", lon: "16.37" } } as unknown as Request;
    const res = createMockRes();

    await controller.getWeather(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Service error" });
  });
});
