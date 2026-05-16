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

export function getPostBySlug(category: string, slug: string, locale: string = 'en'): Post | null {
  const categoryPath = path.join(contentDirectory, category);
  const filePath = path.join(categoryPath, `${slug}.${locale}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    const fallbackPath = path.join(categoryPath, `${slug}.${locale}.md`);
    if (!fs.existsSync(fallbackPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fallbackPath, 'utf8');
    const fileStats = fs.statSync(fallbackPath);
    const { data, content } = matter(fileContents);

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
      content,
    };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const fileStats = fs.statSync(filePath);
  const { data, content } = matter(fileContents);

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

