import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import type { ContentLocale, PostFrontmatter } from './types';
import { sanitizeFrontmatter, validateFrontmatter } from './contentSchema';

export function buildMdxFile(frontmatter: PostFrontmatter, content: string): string {
  const lines = [
    '---',
    `title: "${frontmatter.title.replace(/"/g, '\\"')}"`,
    `date: "${frontmatter.date}"`,
    `excerpt: "${frontmatter.excerpt.replace(/"/g, '\\"')}"`,
    `tags: [${frontmatter.tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}]`,
    `lang: "${frontmatter.lang}"`,
    `image: ${frontmatter.image ? `"${frontmatter.image.replace(/"/g, '\\"')}"` : 'null'}`,
    `published: ${frontmatter.published ? 'true' : 'false'}`,
    '---',
    '',
    content.trimEnd(),
    '',
  ];
  return lines.join('\n');
}

export function parseMdxFile(fileContent: string, locale: ContentLocale): { frontmatter: PostFrontmatter; content: string } {
  const parsed = matter(fileContent);
  const frontmatter = sanitizeFrontmatter(parsed.data as Partial<PostFrontmatter>, locale);
  return {
    frontmatter,
    content: parsed.content.trim(),
  };
}

export async function buildPreviewSource(frontmatter: PostFrontmatter, content: string) {
  const errors = validateFrontmatter(frontmatter);
  if (errors.length) {
    return { errors, mdxSource: null };
  }

  try {
    const mdxSource = await serialize(content, {
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    });
    return { errors: [], mdxSource };
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : 'Invalid MDX content'],
      mdxSource: null,
    };
  }
}
