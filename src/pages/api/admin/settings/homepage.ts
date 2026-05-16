import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/admin/auth';
import { loadHomepageContent, saveHomepageContent } from '@/lib/admin/contentService';
import { sanitizeHomepageContent } from '@/lib/admin/contentSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const homepage = await loadHomepageContent();
      return res.status(200).json({ homepage });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const homepage = sanitizeHomepageContent(req.body?.homepage);
      await saveHomepageContent(homepage);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
