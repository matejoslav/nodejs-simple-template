import { Router } from "express";
import { container } from "../config/container";
import { WeatherController } from "../controllers/weather.controller";

const router = Router();
const controller = container.resolve(WeatherController);

router.get("/", (req, res) => controller.getWeather(req, res));

export default router;
