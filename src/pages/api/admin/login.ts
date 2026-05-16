import type { NextApiRequest, NextApiResponse } from 'next';
import { assertAdminPassword, createSessionCookieHeader } from '@/lib/admin/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const isValid = assertAdminPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }

  res.setHeader('Set-Cookie', createSessionCookieHeader());
  return res.status(200).json({ ok: true });
}
