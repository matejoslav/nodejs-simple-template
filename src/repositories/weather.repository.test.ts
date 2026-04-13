import "reflect-metadata";
import { WeatherRepository } from "./weather.repository";

const mockOpenMeteoResponse = {
  latitude: 48.21,
  longitude: 16.37,
  current: {
    time: "2026-04-13T12:00",
    temperature_2m: 22.5,
    wind_speed_10m: 10.2,
    weather_code: 1,
  },
  daily: {
    time: ["2026-04-13"],
    temperature_2m_max: [25.0],
    temperature_2m_min: [15.0],
    weather_code: [1],
  },
};

describe("WeatherRepository", () => {
  let repository: WeatherRepository;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    repository = new WeatherRepository();
    fetchSpy = jest.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("should fetch and map weather data correctly", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockOpenMeteoResponse,
    });

    const result = await repository.getCurrentWeather(48.21, 16.37);

    expect(result).toEqual({
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
    });
  });

  it("should call the correct URL with parameters", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => mockOpenMeteoResponse,
    });

    await repository.getCurrentWeather(48.21, 16.37);

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("latitude=48.21");
    expect(calledUrl).toContain("longitude=16.37");
    expect(calledUrl).toContain("current=");
    expect(calledUrl).toContain("daily=");
  });

  it("should throw on non-ok response", async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(repository.getCurrentWeather(48.21, 16.37)).rejects.toThrow(
      "Open-Meteo API error: 500 Internal Server Error"
    );
  });
});
