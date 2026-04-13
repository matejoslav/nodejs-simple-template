import "dotenv/config";
import "reflect-metadata";
import express, { json } from "express";
import { RegisterRoutes } from "./generated/routes";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(json());

RegisterRoutes(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
