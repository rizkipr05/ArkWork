import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { encodeSession, setHttpOnlyCookie } from './shared-session-helpers';

// ---- Simple in-memory user store (email -> user record)
type LocalUser = { id: string; name: string; email: string; pwHash: string; picture?: string };
const users = new Map<string, LocalUser>();

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'session';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function localRegister(req: Request, res: Response) {
  const { name, email, password } = req.body ?? {}; 
  if (!name || !email || !password) return res.status(400).send('Missing fields');

  if (users.has(email)) return res.status(409).send('Email already registered');

  const pwHash = await bcrypt.hash(password, 10);
  const user: LocalUser = { id: `u_${Date.now()}`, name, email, pwHash };
  users.set(email, user);

  const session = {
    tokenSet: { expires_at: Math.floor(Date.now() / 1000) + 3600 },
    user: { sub: user.id, name: user.name, email: user.email, picture: user.picture },
  };
  const cookieVal = encodeSession(session);
  setHttpOnlyCookie(res, SESSION_COOKIE, cookieVal, ONE_WEEK_MS);

  res.status(201).json({ ok: true });
}

export async function localLogin(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).send('Missing fields');

  const user = users.get(email);
  if (!user) return res.status(401).send('Invalid credentials');

  const ok = await bcrypt.compare(password, user.pwHash);
  if (!ok) return res.status(401).send('Invalid credentials');

  const session = {
    tokenSet: { expires_at: Math.floor(Date.now() / 1000) + 3600 },
    user: { sub: user.id, name: user.name, email: user.email, picture: user.picture },
  };
  const cookieVal = encodeSession(session);
  setHttpOnlyCookie(res, SESSION_COOKIE, cookieVal, ONE_WEEK_MS);

  res.json({ ok: true });
}
