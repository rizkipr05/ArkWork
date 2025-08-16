// src/routes/auth.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// hindari multiple instance saat dev
const prisma: PrismaClient = (global as any).prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (global as any).prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// ------- helpers -------
type JWTPayload = { uid: string };
const signToken = (p: JWTPayload) => jwt.sign(p, JWT_SECRET, { expiresIn: "7d" });

// ------- validators -------
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50).optional(),
});
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ------- routes -------
router.get("/", (_req, res) => res.json({ message: "Auth route works!" }));

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

    const { email, password, name } = parsed.data;

    // hash pakai bcryptjs (bukan argon2)
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, photoUrl: true, cvUrl: true },
    });

    const token = signToken({ uid: user.id });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.status(201).json(user);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      // unique constraint (email sudah ada)
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    console.error("SIGNUP ERROR:", (e as any)?.message || e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Email atau password salah" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Email atau password salah" });

    const token = signToken({ uid: user.id });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      cvUrl: user.cvUrl,
    });
  } catch (e) {
    console.error("SIGNIN ERROR:", (e as any)?.message || e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signout", (_req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res.status(204).end();
});

router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.token; // kamu sudah pakai cookieParser di index.ts
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return res.json(payload);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
