"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { id: string; role: "user" | "assistant"; text: string; ts: number };

const STORAGE_KEY = "ogm-chat-history-v1";
const CHAT_API = "/api/chat"; // backend via rewrite

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMsgs(JSON.parse(raw));
    } catch {}
  }, []);

  // save history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {}
  }, [msgs]);

  // auto scroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, open, busy]);

  // quick suggestions
  const suggestions = useMemo(
    () => [
      "Ringkas berita migas hari ini",
      "Apa itu upstream & downstream?",
      "Harga minyak Brent terkini?",
      "Berita LNG Indonesia terbaru",
    ],
    []
  );

  async function ask(text: string) {
    if (!text.trim() || busy) return;
    const u: Msg = { id: crypto.randomUUID(), role: "user", text: text.trim(), ts: Date.now() };
    setMsgs((m) => [...m, u]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...msgs.map(({ role, text }) => ({ role, content: text })),
            { role: "user", content: text.trim() },
          ],
        }),
      });
      const data = await res.json();
      const reply =
        (res.ok && (data.answer || data.message)) ||
        "⚠️ Server tidak mengembalikan jawaban.";

      const a: Msg = { id: crypto.randomUUID(), role: "assistant", text: reply, ts: Date.now() };
      setMsgs((m) => [...m, a]);
    } catch (e) {
      const a: Msg = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "⚠️ Gagal terhubung ke ArkWork Agent.",
        ts: Date.now(),
      };
      setMsgs((m) => [...m, a]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      {/* FAB Robot ArkWork */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Buka ArkWork Agent"
        className="fixed bottom-5 right-5 z-50 rounded-full h-14 w-14 shadow-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:scale-[1.03] transition grid place-items-center"
      >
        {/* Ikon robot */}
        <svg viewBox="0 0 24 24" className="h-7 w-7">
          <path d="M12 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="4" y="6" width="16" height="12" rx="4" ry="4" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="9" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <path d="M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 grid place-items-center">
                {/* mini robot */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white">
                  <rect x="5" y="7" width="14" height="10" rx="3" fill="currentColor" />
                  <circle cx="10" cy="12" r="1" fill="#111" />
                  <circle cx="14" cy="12" r="1" fill="#111" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">ArkWork Agent</div>
                <div className="text-xs text-neutral-500">Tanya seputar berita migas</div>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto px-3 py-3 space-y-2">
            {msgs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-4 text-sm text-neutral-600 dark:text-neutral-400">
                Mulai percakapan. Contoh:
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              msgs.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "flex items-end gap-2",
                    m.role === "user" ? "justify-end" : "justify-start",
                  ].join(" ")}
                >
                  {m.role === "assistant" && (
                    <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500" />
                  )}
                  <div
                    className={[
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                      m.role === "user"
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
                    ].join(" ")}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div className="mt-1 text-[10px] opacity-60 text-right">{formatTime(m.ts)}</div>
                  </div>
                </div>
              ))
            )}

            {busy && (
              <div className="flex items-end gap-2">
                <div className="h-7 w-7 shrink-0 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500" />
                <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-2xl px-3 py-2 text-sm">
                  mengetik<span className="animate-pulse">…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="border-t border-neutral-200 dark:border-neutral-800 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pesan…"
                className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
              />
              <button
                disabled={!input.trim() || busy}
                className="rounded-xl px-3 py-2 text-sm font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 disabled:opacity-60"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
