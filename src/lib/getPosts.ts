import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  dateModified?: string;
  excerpt: string;
  tags: string[];
  lang: string;
  image: string | null;
  category?: 'roasts' | 'articles' | 'analytics';
}

export interface Post extends PostMeta {
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'src/content');

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getPostsByCategory(category: string, locale: string = 'en'): PostMeta[] {
  const categoryPath = path.join(contentDirectory, category);
  
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath);
  
  const posts = files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .filter((file) => file.includes(`.${locale}.`))
    .map((file) => {
      const slug = file.replace(`.${locale}.mdx`, '').replace(`.${locale}.md`, '');
      const filePath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const fileStats = fs.statSync(filePath);
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        dateModified: data.updated || fileStats.mtime.toISOString(),
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        lang: data.lang || locale,
        image: data.image || null,
        category: category as 'roasts' | 'articles' | 'analytics',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getSlugsByCategory(category: string): string[] {
  const categoryPath = path.join(contentDirectory, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath);
  const slugs = files
    .map((file) => file.match(/^(.*)\.(en|ru)\.(md|mdx)$/)?.[1] ?? null)
    .filter((slug): slug is string => Boolean(slug));

  return Array.from(new Set(slugs));
}

export function getPostBySlug(category: string, slug: string, locale: string = 'en'): Post | null {
  const categoryPath = path.join(contentDirectory, category);
  const filePath = path.join(categoryPath, `${slug}.${locale}.mdx`);
  
  let resolvedPath = filePath;

  if (!fs.existsSync(resolvedPath)) {
    const fallbackPath = path.join(categoryPath, `${slug}.${locale}.md`);
    if (fs.existsSync(fallbackPath)) {
      resolvedPath = fallbackPath;
    } else {
      const slugMatcher = new RegExp(`^${escapeRegExp(slug)}\\.(en|ru)\\.(md|mdx)$`);
      const fallbackFile = fs.readdirSync(categoryPath).find((file) => slugMatcher.test(file));
      if (!fallbackFile) {
        return null;
      }
      resolvedPath = path.join(categoryPath, fallbackFile);
    }
  }

  const fileContents = fs.readFileSync(resolvedPath, 'utf8');
  const fileStats = fs.statSync(resolvedPath);
  const { data, content } = matter(fileContents);
  const match = path.basename(resolvedPath).match(/\.(en|ru)\.(md|mdx)$/);
  const resolvedLocale = match?.[1] ?? locale;

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    dateModified: data.updated || fileStats.mtime.toISOString(),
    excerpt: data.excerpt || '',
    tags: data.tags || [],
    lang: data.lang || resolvedLocale,
    image: data.image || null,
    category: category as 'roasts' | 'articles' | 'analytics',
    content,
  };
}

export function getAllPosts(locale: string = 'en'): PostMeta[] {
  const roasts = getPostsByCategory('roasts', locale);
  const articles = getPostsByCategory('articles', locale);
  const analytics = getPostsByCategory('analytics', locale);

  return [...roasts, ...articles, ...analytics].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

