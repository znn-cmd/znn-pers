export type ContentCategory = 'articles' | 'roasts' | 'analytics';
export type ContentLocale = 'en' | 'ru';

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  lang: ContentLocale;
  image: string | null;
  published?: boolean;
}

export interface MaterialRecord {
  category: string;
  slug: string;
  locale: ContentLocale;
  path: string;
  sha: string;
  frontmatter: PostFrontmatter;
  content: string;
}

export interface MaterialListItem {
  category: string;
  slug: string;
  locale: ContentLocale;
  path: string;
  sha: string;
  title: string;
  date: string;
  excerpt: string;
  published: boolean;
}

export interface HomeLocaleContent {
  quote: string;
  subtitle: string;
}

export interface HomePageContent {
  en: HomeLocaleContent;
  ru: HomeLocaleContent;
}

export interface CategoryConfigItem {
  id: string;
  title_en: string;
  title_ru: string;
  enabled: boolean;
  order: number;
}
