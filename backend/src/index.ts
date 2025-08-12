import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

// Root: langsung JSON
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "arkwork-backend" });
});

// Routes
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import tendersRoutes from "./routes/tenders";
import newsRoutes from "./routes/news";

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tenders", tendersRoutes);
app.use("/api/news", newsRoutes);

// Health (opsional, enak buat cek cepat)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptimeSeconds: Math.floor(process.uptime()) });
});

app.listen(port, () => {
  console.log(`🚀 API listening on http://localhost:${port}`);
});
