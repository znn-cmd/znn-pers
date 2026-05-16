import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

function getAgentPublishToken(): string {
  const token = process.env.AGENT_PUBLISH_TOKEN;
  if (!token) {
    throw new Error('AGENT_PUBLISH_TOKEN is required');
  }
  return token;
}

function parseBearerToken(value: string | undefined): string | null {
  if (!value) return null;
  const [scheme, token] = value.split(' ');
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== 'bearer') return null;
  return token.trim();
}

function timingSafeTokenEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function requireAgentAuth(req: NextApiRequest, res: NextApiResponse): boolean {
  const bearerToken = parseBearerToken(req.headers.authorization);
  const headerToken = typeof req.headers['x-agent-token'] === 'string' ? req.headers['x-agent-token'] : null;
  const requestToken = bearerToken || headerToken;

  if (!requestToken) {
    res.status(401).json({ error: 'Missing agent token' });
    return false;
  }

  let expectedToken: string;
  try {
    expectedToken = getAgentPublishToken();
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    return false;
  }

  if (!timingSafeTokenEqual(requestToken, expectedToken)) {
    res.status(401).json({ error: 'Invalid agent token' });
    return false;
  }

  return true;
}
