// backend/src/index.ts
import express from "express";
import cors from "cors";
import newsRouter from "./routes/news";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/news", newsRouter);

app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
