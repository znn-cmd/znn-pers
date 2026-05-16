import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAgentAuth } from '@/lib/admin/agentAuth';
import { sanitizeFrontmatter, validateFrontmatter } from '@/lib/admin/contentSchema';
import { buildPreviewSource } from '@/lib/admin/mdx';
import { normalizeSlug } from '@/lib/admin/slug';
import { upsertMaterial } from '@/lib/admin/contentService';
import type { ContentLocale } from '@/lib/admin/types';
import { validateEditorialQuality } from '@/lib/contentQuality';

function parseLocale(value: unknown): ContentLocale {
  return value === 'ru' ? 'ru' : 'en';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAgentAuth(req, res)) {
    return;
  }

  const category = typeof req.body?.category === 'string' ? req.body.category : '';
  const rawSlug = typeof req.body?.slug === 'string' ? req.body.slug : '';
  const locale = parseLocale(req.body?.locale);
  const content = typeof req.body?.content === 'string' ? req.body.content : '';
  const dryRun = Boolean(req.body?.dryRun);

  const slug = normalizeSlug(rawSlug);
  if (!category || !slug) {
    return res.status(400).json({ error: 'Category and slug are required' });
  }

  const frontmatter = sanitizeFrontmatter(req.body?.frontmatter || {}, locale);
  const validationErrors = [
    ...validateFrontmatter(frontmatter),
    ...validateEditorialQuality(content, locale),
  ];
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const preview = await buildPreviewSource(frontmatter, content);
  if (preview.errors.length > 0 || !preview.mdxSource) {
    return res.status(400).json({ errors: preview.errors });
  }

  if (dryRun) {
    return res.status(200).json({
      ok: true,
      mode: 'preview',
      normalized: {
        category,
        slug,
        locale,
        frontmatter,
      },
    });
  }

  try {
    const result = await upsertMaterial({
      category,
      slug,
      locale,
      frontmatter,
      content,
    });

    return res.status(200).json({
      ok: true,
      mode: 'publish',
      path: result.path,
      slug,
      category,
      locale,
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
}
