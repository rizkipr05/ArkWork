import type { Request, Response, NextFunction } from 'express';
import {
  Issuer,
  generators,
  custom,
  TokenSet,
  // v5 type name pakai "UserinfoResponse" (huruf i kecil)
  UserinfoResponse,
} from 'openid-client';
import { setHttpOnlyCookie, encodeSession as encodeSess } from './shared-session-helpers';

// ---------- Config ----------
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:4000';
const FRONTEND_ORIGIN  = process.env.FRONTEND_ORIGIN  || 'http://localhost:3000';
const REDIRECT_URI     = `${BACKEND_BASE_URL}/auth/google/callback`;

const SESSION_COOKIE            = process.env.SESSION_COOKIE_NAME || 'session';
const TRANSIENT_STATE_COOKIE    = 'oidc_state';
const TRANSIENT_VERIFIER_COOKIE = 'oidc_verifier';
const TRANSIENT_NONCE_COOKIE    = 'oidc_nonce';

// Optional: network timeouts
custom.setHttpOptionsDefaults({ timeout: 10_000 });

// ---------- Types ----------
type TokenSetJSON = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_at?: number;
  scope?: string;
  token_type?: string;
  [k: string]: unknown;
};
type SessionData = { tokenSet: TokenSetJSON; user?: UserinfoResponse };

// ---------- Helpers ----------
let googleClientPromise: Promise<any> | null = null;
async function getClient() {
  if (!googleClientPromise) {
    googleClientPromise = (async () => {
      const issuer = await Issuer.discover('https://accounts.google.com');
      return new issuer.Client({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uris: [REDIRECT_URI],
        response_types: ['code'],
      });
    })();
  }
  return googleClientPromise;
}

function clearCookie(res: Response, name: string) {
  res.clearCookie(name, { path: '/' });
}
function decodeSession(v?: string): SessionData | null {
  if (!v) return null;
  try {
    return JSON.parse(Buffer.from(v, 'base64url').toString('utf8')) as SessionData;
  } catch {
    return null;
  }
}
function tokensExpired(tokenSetJson: TokenSetJSON): boolean {
  if (!tokenSetJson?.expires_at) return false;
  const now = Math.floor(Date.now() / 1000);
  return tokenSetJson.expires_at <= now + 15;
}
function toTokenSetJSON(ts: TokenSet): TokenSetJSON {
  const anyTs = ts as any;
  const expires_at =
    typeof anyTs.expires_at === 'number'
      ? anyTs.expires_at
      : (typeof anyTs.expires_in === 'number'
          ? Math.floor(Date.now() / 1000) + Number(anyTs.expires_in)
          : undefined);
  return {
    access_token:  anyTs.access_token,
    refresh_token: anyTs.refresh_token,
    id_token:      anyTs.id_token,
    token_type:    anyTs.token_type,
    scope:         anyTs.scope,
    expires_at,
  };
}

// ---------- Handlers ----------

// GET /auth/google
export async function beginLogin(_req: Request, res: Response) {
  const client = await getClient();

  const codeVerifier  = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  const state         = generators.state();
  const nonce         = generators.nonce();

  const transientMaxAge = 10 * 60 * 1000;
  setHttpOnlyCookie(res, TRANSIENT_VERIFIER_COOKIE, codeVerifier, transientMaxAge);
  setHttpOnlyCookie(res, TRANSIENT_STATE_COOKIE,    state,        transientMaxAge);
  setHttpOnlyCookie(res, TRANSIENT_NONCE_COOKIE,    nonce,        transientMaxAge);

  const authorizationUrl = client.authorizationUrl({
    redirect_uri:          REDIRECT_URI,
    scope:                 'openid email profile',
    code_challenge:        codeChallenge,
    code_challenge_method: 'S256',
    state,
    nonce,
  });

  res.redirect(authorizationUrl);
}

// GET /auth/google/callback
export async function handleCallback(req: Request, res: Response) {
  const client = await getClient();

  const stateCookie    = (req as any).cookies?.[TRANSIENT_STATE_COOKIE];
  const verifierCookie = (req as any).cookies?.[TRANSIENT_VERIFIER_COOKIE];
  const nonceCookie    = (req as any).cookies?.[TRANSIENT_NONCE_COOKIE];

  const params = client.callbackParams(req);

  if (!stateCookie || params.state !== stateCookie) {
    return res.status(400).send('Invalid OIDC state');
  }
  if (!verifierCookie) return res.status(400).send('Missing PKCE verifier');
  if (!nonceCookie)    return res.status(400).send('Missing nonce');

  const tokenSet = await client.callback(
    REDIRECT_URI,
    params,
    { code_verifier: verifierCookie, state: stateCookie, nonce: nonceCookie }
  );

  clearCookie(res, TRANSIENT_STATE_COOKIE);
  clearCookie(res, TRANSIENT_VERIFIER_COOKIE);
  clearCookie(res, TRANSIENT_NONCE_COOKIE);

  let user: UserinfoResponse | undefined;
  try {
    user = await client.userinfo(tokenSet);
  } catch {}

  const session: SessionData = { tokenSet: toTokenSetJSON(tokenSet), user };
  setHttpOnlyCookie(res, SESSION_COOKIE, encodeSess(session), 7 * 24 * 60 * 60 * 1000);

  res.redirect(`${FRONTEND_ORIGIN}/dashboard`);
}

// middleware proteksi
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const raw     = (req as any).cookies?.[SESSION_COOKIE];
  const session = decodeSession(raw);
  if (!session) return res.status(401).json({ error: 'Not authenticated' });

  const client = await getClient();

  if (tokensExpired(session.tokenSet) && session.tokenSet.refresh_token) {
    try {
      const refreshed: TokenSet = await client.refresh(session.tokenSet.refresh_token);
      session.tokenSet = toTokenSetJSON(refreshed);

      try {
        const u = await client.userinfo(refreshed);
        session.user = u as UserinfoResponse;
      } catch {}

      setHttpOnlyCookie(res, SESSION_COOKIE, encodeSess(session), 7 * 24 * 60 * 60 * 1000);
    } catch {
      clearCookie(res, SESSION_COOKIE);
      return res.status(401).json({ error: 'Session expired' });
    }
  }

  (req as any).user = session.user ?? { sub: (session.tokenSet as any)?.claims?.sub };
  next();
}

// POST /auth/logout
export async function logout(req: Request, res: Response) {
  try {
    const raw = (req as any).cookies?.[SESSION_COOKIE];
    const session = decodeSession(raw);
    if (session?.tokenSet?.refresh_token) {
      const client = await getClient();
      await client.revoke(session.tokenSet.refresh_token);
    }
  } catch {}
  clearCookie(res, SESSION_COOKIE);
  res.status(204).send();
}
