import { githubGetFile, githubListDirectory, githubUpsertFile } from './githubContentStore';
import { DEFAULT_CATEGORIES, DEFAULT_HOMEPAGE_CONTENT, sanitizeCategories, sanitizeHomepageContent } from './contentSchema';
import { buildMdxFile, parseMdxFile } from './mdx';
import { normalizeSlug } from './slug';
import type {
  CategoryConfigItem,
  ContentLocale,
  HomePageContent,
  MaterialListItem,
  MaterialRecord,
  PostFrontmatter,
} from './types';

const CATEGORIES_FILE_PATH = 'src/content/site/categories.json';
const HOMEPAGE_FILE_PATH = 'src/content/site/homepage.json';

function parseMdxFileName(fileName: string): { slug: string; locale: ContentLocale } | null {
  const match = fileName.match(/^(.*)\.(en|ru)\.(md|mdx)$/);
  if (!match) {
    return null;
  }
  return {
    slug: match[1],
    locale: match[2] as ContentLocale,
  };
}

function ensureCategory(category: string): string {
  return normalizeSlug(category);
}

export async function loadCategories(): Promise<CategoryConfigItem[]> {
  try {
    const file = await githubGetFile(CATEGORIES_FILE_PATH);
    const parsed = JSON.parse(file.content);
    return sanitizeCategories(parsed);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategories(categories: CategoryConfigItem[]) {
  const normalized = sanitizeCategories(categories);
  let sha: string | undefined;
  try {
    const existing = await githubGetFile(CATEGORIES_FILE_PATH);
    sha = existing.sha;
  } catch {
    sha = undefined;
  }

  await githubUpsertFile({
    filePath: CATEGORIES_FILE_PATH,
    content: JSON.stringify(normalized, null, 2) + '\n',
    sha,
    message: 'admin: update category settings',
  });
}

export async function loadHomepageContent(): Promise<HomePageContent> {
  try {
    const file = await githubGetFile(HOMEPAGE_FILE_PATH);
    const parsed = JSON.parse(file.content);
    return sanitizeHomepageContent(parsed);
  } catch {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

export async function saveHomepageContent(content: HomePageContent) {
  const normalized = sanitizeHomepageContent(content);
  let sha: string | undefined;
  try {
    const existing = await githubGetFile(HOMEPAGE_FILE_PATH);
    sha = existing.sha;
  } catch {
    sha = undefined;
  }

  await githubUpsertFile({
    filePath: HOMEPAGE_FILE_PATH,
    content: JSON.stringify(normalized, null, 2) + '\n',
    sha,
    message: 'admin: update homepage content',
  });
}

export async function listMaterials(params?: {
  category?: string;
  locale?: ContentLocale;
  query?: string;
}): Promise<MaterialListItem[]> {
  const categories = await loadCategories();
  const categoryIds = (params?.category ? [params.category] : categories.map((item) => item.id)).filter(Boolean);
  const list: MaterialListItem[] = [];

  for (const category of categoryIds) {
    const normalizedCategory = ensureCategory(category);
    if (!normalizedCategory) continue;

    const dirEntries = await githubListDirectory(`src/content/${normalizedCategory}`);
    const mdxFiles = dirEntries.filter((entry) => entry.type === 'file' && /\.(md|mdx)$/.test(entry.name));

    for (const file of mdxFiles) {
      const parsedName = parseMdxFileName(file.name);
      if (!parsedName) continue;
      if (params?.locale && parsedName.locale !== params.locale) continue;

      const details = await githubGetFile(file.path);
      const parsed = parseMdxFile(details.content, parsedName.locale);

      list.push({
        category: normalizedCategory,
        slug: parsedName.slug,
        locale: parsedName.locale,
        path: file.path,
        sha: file.sha,
        title: parsed.frontmatter.title,
        date: parsed.frontmatter.date,
        excerpt: parsed.frontmatter.excerpt,
        published: Boolean(parsed.frontmatter.published ?? true),
      });
    }
  }

  const query = params?.query?.trim().toLowerCase();
  const filtered = query
    ? list.filter((item) => {
        return (
          item.slug.toLowerCase().includes(query) ||
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query)
        );
      })
    : list;

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getMaterial(params: {
  category: string;
  slug: string;
  locale: ContentLocale;
}): Promise<MaterialRecord> {
  const category = ensureCategory(params.category);
  const slug = normalizeSlug(params.slug);
  const filePath = `src/content/${category}/${slug}.${params.locale}.mdx`;
  const file = await githubGetFile(filePath);
  const parsed = parseMdxFile(file.content, params.locale);

  return {
    category,
    slug,
    locale: params.locale,
    path: filePath,
    sha: file.sha,
    frontmatter: parsed.frontmatter,
    content: parsed.content,
  };
}

export async function upsertMaterial(params: {
  category: string;
  slug: string;
  locale: ContentLocale;
  frontmatter: PostFrontmatter;
  content: string;
}): Promise<{ path: string }> {
  const category = ensureCategory(params.category);
  const slug = normalizeSlug(params.slug);
  const filePath = `src/content/${category}/${slug}.${params.locale}.mdx`;

  let sha: string | undefined;
  try {
    const existing = await githubGetFile(filePath);
    sha = existing.sha;
  } catch {
    sha = undefined;
  }

  await githubUpsertFile({
    filePath,
    sha,
    message: `admin: update post ${category}/${slug} (${params.locale})`,
    content: buildMdxFile(params.frontmatter, params.content),
  });

  return { path: filePath };
}
