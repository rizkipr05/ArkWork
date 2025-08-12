"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Image from "next/image";

type FetchedItem = { title: string; link: string; pubDate: string | null; source: string };

type News = {
  id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  url: string;
  category: string;
  publishedAt: string;
};

async function fetchEnergyNews(params: { limit?: number; keywords?: string }) {
  const q = new URLSearchParams({
    limit: String(params.limit ?? 24),
    scope: "id", // hanya Indonesia
    lang: "id",
    country: "ID",
  });
  if (params.keywords) q.set("keywords", params.keywords);

  const res = await fetch(`/api/news/energy?${q.toString()}`, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Gagal memuat berita");
  return (await res.json()) as { count: number; items: FetchedItem[] };
}

// --- placeholder dari picsum + seed konsisten ---
function pickImage(key: string) {
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum = (sum + key.charCodeAt(i)) % 9973;
  const seed = `oilgas-${sum}`;
  return `https://picsum.photos/seed/${seed}/1200/675`;
}

const CATEGORIES = ["Semua", "Upstream", "Downstream", "LNG", "Policy", "Price", "Services"];

export default function Page() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Semua");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<News[]>([]);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  async function search(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const keywords = [q.trim(), category !== "Semua" ? category : ""].filter(Boolean).join(" ");
      const data = await fetchEnergyNews({ limit: 24, keywords: keywords || undefined });
      const mapped: News[] = data.items.map((it, idx) => ({
        id: String(idx),
        title: it.title,
        description: "",
        image: pickImage(it.title + it.source),
        source: it.source,
        url: it.link,
        category: category === "Semua" ? "News" : category,
        publishedAt: it.pubDate ?? new Date().toISOString(),
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Terjadi kesalahan");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search(); // muat awal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heading = useMemo(
    () => (q || category !== "Semua" ? `Hasil Indonesia: “${q || "Semua"}” • ${category}` : "Berita Migas Indonesia Terbaru"),
    [q, category]
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Search */}
        <section className="mb-8">
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 md:p-6 shadow-sm">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              Cari Berita Oil & Gas (Indonesia)
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Ketik kata kunci (mis. “kilang”, “Brent”, “blok”, “LNG”). Data dari media Indonesia via Google News.
            </p>

            <form onSubmit={search} className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="relative md:col-span-8">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Contoh: produksi, FID, KKKS, lifting…"
                  className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 pr-11 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="md:col-span-4">
                <Select value={category} onChange={setCategory} label="Kategori (opsional)" options={CATEGORIES} />
              </div>

              <div className="md:col-span-12">
                <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
                  {CATEGORIES.slice(1).map((c) => {
                    const active = c === category;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={[
                          "whitespace-nowrap rounded-2xl border px-4 py-2 text-sm transition",
                          active
                            ? "border-transparent bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                            : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
                        ].join(" ")}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-3 text-sm font-medium shadow hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Mencari…" : "Cari"}
                </button>
              </div>
            </form>

            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
          </div>
        </section>

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">{heading}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{mounted ? new Date().toLocaleString("id-ID") : ""}</p>
        </div>

        {/* Grid */}
        {loading ? (
          <GridSkeleton />
        ) : items.length === 0 ? (
          <EmptyState onRefresh={search} />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((n) => (
              <li key={n.id}>
                <NewsCard item={n} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="mt-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 dark:text-neutral-400">
          © {new Date().getFullYear()} O&G Monitor • Next.js + Tailwind
        </div>
      </footer>
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function NewsCard({ item }: { item: News }) {
  const [imgSrc, setImgSrc] = useState(item.image); // fallback jika gagal

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={() => setImgSrc("/placeholder.svg")}
          priority={false}
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-600 dark:text-neutral-300">
            {item.category}
          </span>
          <span className="text-[11px] text-neutral-500">
            {new Date(item.publishedAt).toLocaleDateString("id-ID")}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-500">{item.source}</span>
          <a href={item.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-amber-600 hover:underline">
            Baca →
          </a>
        </div>
      </div>
    </article>
  );
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 overflow-hidden"
        >
          <div className="aspect-[16/9] bg-neutral-200/70 dark:bg-neutral-800/70" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-20 rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
            <div className="h-4 w-3/4 rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
            <div className="h-4 w-1/2 rounded bg-neutral-200/80 dark:bg-neutral-800/80" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Belum ada hasil</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Coba kata kunci atau kategori lain.</p>
      <button
        onClick={onRefresh}
        className="mt-4 inline-flex items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        Muat ulang
      </button>
    </div>
  );
}
