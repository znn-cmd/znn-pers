import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticatedRequest } from '@/lib/admin/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({ authenticated: isAuthenticatedRequest(req) });
}
