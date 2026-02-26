import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { hotelsRouter } from "./routes/hotels.routes";
import { dashboardRouter } from "./routes/dashboard.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use("/hotels", hotelsRouter);
app.use("/dashboard", dashboardRouter);
const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});