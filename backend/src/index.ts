// src/index.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Routers
import authRouter from './routes/auth';
import newsRouter from './routes/news';
import chatRouter from './routes/chat';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// CORS options (boleh array kalau punya banyak origin)
const corsOptions: cors.CorsOptions = {
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Logger sederhana
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // penting untuk preflight

// Health & root
app.get('/', (_req, res) => res.send('OK'));
app.get('/health', (_req, res) => res.json({ ok: true }));

// Mount routers
app.use('/auth', authRouter);     // -> /auth/google, /auth/local/login, dst.
app.use('/api/news', newsRouter); // -> contoh: GET /api/news/energy
app.use('/api/chat', chatRouter);

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
