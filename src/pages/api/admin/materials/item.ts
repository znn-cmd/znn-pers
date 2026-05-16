import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/admin/auth';
import { getMaterial } from '@/lib/admin/contentService';
import type { ContentLocale } from '@/lib/admin/types';

function parseLocale(value: unknown): ContentLocale {
  return value === 'ru' ? 'ru' : 'en';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const category = typeof req.query.category === 'string' ? req.query.category : '';
  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  const locale = parseLocale(req.query.locale);

  if (!category || !slug) {
    return res.status(400).json({ error: 'Category and slug are required' });
  }

  try {
    const material = await getMaterial({ category, slug, locale });
    return res.status(200).json({ material });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
}
