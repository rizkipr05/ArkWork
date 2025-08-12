# ArkWork Starter (Monorepo)

Starter kit untuk tim Hempart x Teknokrat: **Next.js (frontend) + Express TS (backend)**, siap untuk pengembangan MVP ArkWork.

## Prasyarat
- Node.js 20+
- PostgreSQL 14+
- Git
- (Opsional) Docker

## Struktur
```
arkwork-starter/
  frontend/        # Next.js + Tailwind
  backend/         # Express + TypeScript + PostgreSQL
  docker/          # docker-compose untuk Postgres + pgAdmin
  .github/         # CI dan template PR/Issue
```

## Cara Jalanin (dev)
### 1) Backend
```bash
cd backend
cp .env.example .env
npm i
npm run dev
# API berjalan di http://localhost:4000 (GET /api/health)
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm i
npm run dev
# Web jalan di http://localhost:3000
```

> Ubah `NEXT_PUBLIC_API_URL` di `frontend/.env` jika backend beda port/host.

## Branching & PR
- Buat branch fitur: `feature/<nama-fitur>`
- Buka Pull Request ke `main` (wajib 1 approval CI pass)

## Lisensi
MIT © PT Hempart
