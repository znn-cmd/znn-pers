import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/admin/auth';
import { loadCategories, saveCategories } from '@/lib/admin/contentService';
import { sanitizeCategories } from '@/lib/admin/contentSchema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const categories = await loadCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const categories = sanitizeCategories(req.body?.categories);
      await saveCategories(categories);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
