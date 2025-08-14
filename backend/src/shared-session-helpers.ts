// src/shared-session-helpers.ts
import type { Response } from 'express';

const NODE_ENV  = process.env.NODE_ENV || 'development';
const isProd    = NODE_ENV === 'production';

/** Simpan cookie httpOnly, aman untuk session */
export function setHttpOnlyCookie(
  res: Response,
  name: string,
  value: string,
  maxAgeMs: number
) {
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: 'lax',        // sesuaikan kalau butuh cross-site
    secure: isProd,         // true di production (https)
    maxAge: maxAgeMs,
    path: '/',
  });
}

/** Encode session (JSON) -> base64url (string) */
export function encodeSession(data: unknown): string {
  return Buffer.from(JSON.stringify(data), 'utf8').toString('base64url');
}

/** Optional: decoder kalau butuh di tempat lain */
export function decodeSession<T = any>(raw?: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}
