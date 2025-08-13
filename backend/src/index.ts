import "dotenv/config";
import express from "express";
import cors from "cors";
import newsRouter from "./routes/news";
import chatRouter from "./routes/chat";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json()); // <-- wajib

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/news", newsRouter);
app.use("/api/chat", chatRouter); // <-- aktifkan

app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
