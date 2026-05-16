import type {
  CategoryConfigItem,
  HomePageContent,
  PostFrontmatter,
  ContentLocale,
} from './types';

export const DEFAULT_HOMEPAGE_CONTENT: HomePageContent = {
  en: {
    quote: 'Trust is not a slogan.\\nIt is a system design.',
    subtitle: 'Journal on product architecture, real estate and applied systems thinking.',
  },
  ru: {
    quote: 'Доверие - это не слоган.\\nЭто архитектура системы.',
    subtitle: 'Журнал о продуктовой архитектуре, недвижимости и прикладном системном мышлении.',
  },
};

export const DEFAULT_CATEGORIES: CategoryConfigItem[] = [
  { id: 'roasts', title_en: 'Latest Roasts', title_ru: 'Последние разборы', enabled: true, order: 1 },
  { id: 'articles', title_en: 'Latest Articles', title_ru: 'Последние статьи', enabled: true, order: 2 },
  { id: 'analytics', title_en: 'Latest Analytics', title_ru: 'Последняя аналитика', enabled: true, order: 3 },
];

function isLocale(value: unknown): value is ContentLocale {
  return value === 'en' || value === 'ru';
}

export function sanitizeFrontmatter(input: Partial<PostFrontmatter>, locale: ContentLocale): PostFrontmatter {
  const tags = Array.isArray(input.tags)
    ? input.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : [];

  const lang = isLocale(input.lang) ? input.lang : locale;
  const published = typeof input.published === 'boolean' ? input.published : true;

  return {
    title: String(input.title || '').trim(),
    date: String(input.date || '').trim(),
    excerpt: String(input.excerpt || '').trim(),
    tags,
    lang,
    image: input.image ? String(input.image).trim() : null,
    published,
  };
}

export function validateFrontmatter(frontmatter: PostFrontmatter): string[] {
  const errors: string[] = [];
  if (!frontmatter.title) errors.push('Title is required');
  if (!frontmatter.date) errors.push('Date is required');
  if (!frontmatter.excerpt) errors.push('Excerpt is required');
  if (!isLocale(frontmatter.lang)) errors.push('Lang must be en or ru');
  if (!Array.isArray(frontmatter.tags)) errors.push('Tags must be an array');
  return errors;
}

export function sanitizeCategories(input: unknown): CategoryConfigItem[] {
  if (!Array.isArray(input)) {
    return DEFAULT_CATEGORIES;
  }

  const normalized = input
    .map((item, index) => {
      const safe = item as Partial<CategoryConfigItem>;
      return {
        id: String(safe.id || '').trim(),
        title_en: String(safe.title_en || '').trim(),
        title_ru: String(safe.title_ru || '').trim(),
        enabled: Boolean(safe.enabled),
        order: typeof safe.order === 'number' ? safe.order : index + 1,
      };
    })
    .filter((item) => item.id && item.title_en && item.title_ru)
    .sort((a, b) => a.order - b.order);

  return normalized.length ? normalized : DEFAULT_CATEGORIES;
}

export function sanitizeHomepageContent(input: unknown): HomePageContent {
  const safe = (input || {}) as Partial<HomePageContent>;
  const en = (safe.en || {}) as Partial<HomePageContent['en']>;
  const ru = (safe.ru || {}) as Partial<HomePageContent['ru']>;
  return {
    en: {
      quote: String(en.quote || DEFAULT_HOMEPAGE_CONTENT.en.quote).trim(),
      subtitle: String(en.subtitle || DEFAULT_HOMEPAGE_CONTENT.en.subtitle).trim(),
    },
    ru: {
      quote: String(ru.quote || DEFAULT_HOMEPAGE_CONTENT.ru.quote).trim(),
      subtitle: String(ru.subtitle || DEFAULT_HOMEPAGE_CONTENT.ru.subtitle).trim(),
    },
  };
}
