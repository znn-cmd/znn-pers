import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/admin/auth';
import { listMaterials, upsertMaterial } from '@/lib/admin/contentService';
import { sanitizeFrontmatter, validateFrontmatter } from '@/lib/admin/contentSchema';
import { normalizeSlug } from '@/lib/admin/slug';
import type { ContentLocale } from '@/lib/admin/types';
import { validateEditorialQuality } from '@/lib/contentQuality';

function parseLocale(value: unknown): ContentLocale {
  return value === 'ru' ? 'ru' : 'en';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const locale = typeof req.query.locale === 'string' ? parseLocale(req.query.locale) : undefined;
      const query = typeof req.query.query === 'string' ? req.query.query : undefined;
      const materials = await listMaterials({ category, locale, query });
      return res.status(200).json({ materials });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    }
  }

  if (req.method === 'POST') {
    const category = typeof req.body?.category === 'string' ? req.body.category : '';
    const rawSlug = typeof req.body?.slug === 'string' ? req.body.slug : '';
    const locale = parseLocale(req.body?.locale);
    const content = typeof req.body?.content === 'string' ? req.body.content : '';

    const normalizedSlug = normalizeSlug(rawSlug);
    if (!category || !normalizedSlug) {
      return res.status(400).json({ error: 'Category and slug are required' });
    }

    const frontmatter = sanitizeFrontmatter(req.body?.frontmatter || {}, locale);
    const errors = [...validateFrontmatter(frontmatter), ...validateEditorialQuality(content, locale)];
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    try {
      const result = await upsertMaterial({
        category,
        slug: normalizedSlug,
        locale,
        frontmatter,
        content,
      });
      return res.status(200).json({ ok: true, path: result.path, slug: normalizedSlug });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
