import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { GetServerSidePropsContext } from 'next';

const COOKIE_NAME = 'znn_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

interface SessionPayload {
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET or ADMIN_PASSWORD is required');
  }
  return secret;
}

function signValue(raw: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(raw).digest('hex');
}

function encodePayload(payload: SessionPayload): string {
  const raw = JSON.stringify(payload);
  const base64 = Buffer.from(raw).toString('base64url');
  const signature = signValue(base64);
  return `${base64}.${signature}`;
}

function decodePayload(token: string): SessionPayload | null {
  const [base64, signature] = token.split('.');
  if (!base64 || !signature) {
    return null;
  }

  const expectedSignature = signValue(base64);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(base64, 'base64url').toString('utf8')) as SessionPayload;
    if (!parsed.exp || Number.isNaN(parsed.exp) || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, chunk) => {
    const [rawKey, ...rawValue] = chunk.trim().split('=');
    if (!rawKey || rawValue.length === 0) {
      return acc;
    }
    acc[rawKey] = decodeURIComponent(rawValue.join('='));
    return acc;
  }, {});
}

export function createSessionCookieHeader(): string {
  const token = encodePayload({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS });
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function isAuthenticatedRequest(req: NextApiRequest): boolean {
  const cookies = parseCookieHeader(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    return false;
  }
  return decodePayload(token) !== null;
}

export function isAuthenticatedPageRequest(ctx: GetServerSidePropsContext): boolean {
  const cookies = parseCookieHeader(ctx.req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    return false;
  }
  return decodePayload(token) !== null;
}

export function assertAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD is required');
  }
  return password === adminPassword;
}

export function requireApiAuth(req: NextApiRequest, res: NextApiResponse): boolean {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
