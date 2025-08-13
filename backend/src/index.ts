import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// routes
import newsRouter from './routes/news'
import chatRouter from './routes/chat'

const app = express()
const PORT = process.env.PORT || 4000

// Simple logger
app.use((req, _res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

// CORS: izinkan Next.js di :3000
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))

app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

// API routes
app.use('/api/news', newsRouter)   // -> GET /api/news/energy
app.use('/api/chat', chatRouter)

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`))
