import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/admin/auth';
import { buildPreviewSource } from '@/lib/admin/mdx';
import { sanitizeFrontmatter, validateFrontmatter } from '@/lib/admin/contentSchema';
import type { ContentLocale } from '@/lib/admin/types';
import { validateEditorialQuality } from '@/lib/contentQuality';

function parseLocale(value: unknown): ContentLocale {
  return value === 'ru' ? 'ru' : 'en';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const locale = parseLocale(req.body?.locale);
  const content = typeof req.body?.content === 'string' ? req.body.content : '';
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

  return res.status(200).json({
    preview: {
      frontmatter,
      mdxSource: preview.mdxSource,
    },
  });
}
