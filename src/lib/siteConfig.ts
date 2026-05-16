import fs from 'fs';
import path from 'path';
import { DEFAULT_CATEGORIES, DEFAULT_HOMEPAGE_CONTENT, sanitizeCategories, sanitizeHomepageContent } from './admin/contentSchema';
import type { CategoryConfigItem, HomePageContent } from './admin/types';

const siteDirectory = path.join(process.cwd(), 'src/content/site');
const homepagePath = path.join(siteDirectory, 'homepage.json');
const categoriesPath = path.join(siteDirectory, 'categories.json');

export function getHomepageConfig(): HomePageContent {
  try {
    if (!fs.existsSync(homepagePath)) {
      return DEFAULT_HOMEPAGE_CONTENT;
    }
    const raw = fs.readFileSync(homepagePath, 'utf8');
    return sanitizeHomepageContent(JSON.parse(raw));
  } catch {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

export function getCategoriesConfig(): CategoryConfigItem[] {
  try {
    if (!fs.existsSync(categoriesPath)) {
      return DEFAULT_CATEGORIES;
    }
    const raw = fs.readFileSync(categoriesPath, 'utf8');
    return sanitizeCategories(JSON.parse(raw));
  } catch {
    return DEFAULT_CATEGORIES;
  }
}
