"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-neutral-950/60 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow" />
          <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            O&G Monitor
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition">Upstream</a>
          <a href="#" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition">Downstream</a>
          <a href="#" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition">LNG</a>
        </nav>

        <button
          onClick={() => setDark(v => !v)}
          aria-label="Toggle theme"
          className="inline-flex h-9 items-center gap-2 rounded-xl px-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            {dark ? (
              <path d="M6.76 4.84 5.34 3.42 3.92 4.84l1.42 1.42 1.42-1.42zm10.48 0 1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42zM12 4V1h0v3zm0 19v-3h0v3zm8-8h3v0h-3zm-19 0h3v0H1zm14.24 6.76 1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42zM4.84 17.24 3.42 18.66 4.84 20.08l1.42-1.42-1.42-1.42zM12 7a5 5 0 100 10 5 5 0 000-10z" />
            ) : (
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            )}
          </svg>
          <span className="text-sm text-neutral-700 dark:text-neutral-200 hidden sm:inline">
            {dark ? "Terang" : "Gelap"}
          </span>
        </button>
      </div>
    </header>
  );
}
