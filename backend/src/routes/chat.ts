import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  console.warn("[ArkWork Agent] GEMINI_API_KEY belum di-set. Chat akan gagal.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

function toGeminiHistory(messages: Array<{ role: string; content: string }>) {
  // Gemini memakai "user" | "model"
  return messages
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

const SYSTEM_PROMPT = `
Kamu adalah ArkWork Agent, asisten singkat dan jelas untuk situs O&G Monitor.
Fokus pada topik migas (oil & gas), khususnya Indonesia: upstream, downstream, LNG, kebijakan, tender, harga acuan.
Jika diminta ringkasan, buat bullet/nomor rapi. Jika diminta definisi, beri contoh praktis.
Hindari berspekulasi dan jangan mengarang data angka jika tidak yakin.
Bahasa utama: Indonesia yang natural dan profesional.
`;

router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};
    const messages = (body.messages ?? []) as Array<{ role: string; content: string }>;
    const user = messages[messages.length - 1]?.content || "";

    if (!user?.trim()) {
      return res.json({
        answer:
          "Halo! Saya ArkWork Agent. Tanyakan apa saja seputar berita migas Indonesia. Misalnya: 'Ringkas berita LNG hari ini'.",
      });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Build chat dengan history
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Siap." }] },
        ...toGeminiHistory(messages.slice(0, -1)),
      ],
    });

    const result = await chat.sendMessage(user);
    const text = result.response.text();

    return res.json({ answer: text?.trim() || "Maaf, saya tidak menemukan jawaban." });
  } catch (err) {
    console.error("[ArkWork Agent] Error:", err);
    return res.status(500).json({ answer: "Maaf, terjadi kesalahan di server." });
  }
});

export default router;
