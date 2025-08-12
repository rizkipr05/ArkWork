// src/routes/news.ts
import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import Parser from "rss-parser";

type Env = {
  APP_NAME?: string;
};

const { APP_NAME = "ArkWork" } = process.env as Env;
const router = Router();

// ==== Rate limit khusus endpoint berita ====
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
router.use(limiter);

// ==== Tipe data untuk hasil akhir ====
export type NewsItem = {
  title: string;
  link: string;
  pubDate: string | null;
  source?: string;
};

// ==== Tipe item dari rss-parser (Google News) ====
type GNewsItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  source?: string;
  creator?: string;
  author?: string;
};

// Parser dengan UA khusus
const parser = new Parser<GNewsItem>({
  headers: { "User-Agent": `${APP_NAME.toLowerCase()}-aggregator/1.0` },
});

// Helper bikin URL Google News RSS
function gnewsUrl(query: string, lang = "id", country = "ID") {
  const base = "https://news.google.com/rss/search";
  const p = new URLSearchParams({
    q: query,
    hl: lang,
    gl: country,
    ceid: `${country}:${lang}`,
  });
  return `${base}?${p.toString()}`;
}

// Query default
const ID_QUERIES = [
  "(migas OR minyak OR gas OR energi) site:esdm.go.id",
  "(migas OR minyak OR gas OR energi) site:katadata.co.id",
  "(migas OR minyak OR gas OR energi) site:cnbcindonesia.com",
  "(migas OR minyak OR gas OR energi) site:bisnis.com",
  "(migas OR minyak OR gas OR energi) site:cnnindonesia.com",
];

const GLOBAL_QUERIES = [
  "(oil OR gas OR LNG OR energy) site:reuters.com",
  "(oil OR gas OR LNG OR energy) site:aljazeera.com",
  "(oil OR gas OR LNG OR energy) site:bloomberg.com",
  "(oil OR gas OR LNG OR energy) site:ft.com",
  "(oil OR gas OR LNG OR energy) site:wsj.com",
];

// GET /api/news/energy
router.get("/energy", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 20), 50);
    const scope = String(req.query.scope ?? "both"); // id | global | both
    const lang = String(req.query.lang ?? "id");
    const country = String(req.query.country ?? "ID");
    const customKeywords = (req.query.keywords ?? "").toString().trim();
    const when = (req.query.when ?? "").toString().trim(); // contoh: 7d

    let queries =
      scope === "id"
        ? ID_QUERIES
        : scope === "global"
        ? GLOBAL_QUERIES
        : [...ID_QUERIES, ...GLOBAL_QUERIES];

    if (customKeywords) queries = queries.map(() => customKeywords);
    if (when) queries = queries.map((q) => `(${q}) when:${when}`);

    const feeds = await Promise.all(
      queries.map(async (q) => {
        const feed = await parser.parseURL(gnewsUrl(q, lang, country));
        const items: NewsItem[] =
          feed.items?.map((it) => ({
            title: it.title || "",
            link: it.link || "",
            pubDate: it.pubDate ? new Date(it.pubDate).toISOString() : null,
            source: it.source || it.creator || it.author || "Google News",
          })) ?? [];
        return items;
      })
    );

    const all = feeds.flat();

    // Dedup by link/title
    const seen = new Set<string>();
    const deduped: NewsItem[] = [];
    for (const a of all) {
      const key = (a.link || a.title).trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        deduped.push(a);
      }
    }

    // Sort by pubDate desc
    deduped.sort((a, b) => (b.pubDate || "").localeCompare(a.pubDate || ""));

    res.json({
      app: APP_NAME,
      scope,
      lang,
      country,
      when: when || null,
      count: Math.min(deduped.length, limit),
      items: deduped.slice(0, limit),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal mengambil berita" });
  }
});

export default router;
