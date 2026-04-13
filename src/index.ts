import "dotenv/config";
import "reflect-metadata";
import express from "express";
import weatherRoutes from "./routes/weather.routes";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/api/weather", weatherRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
