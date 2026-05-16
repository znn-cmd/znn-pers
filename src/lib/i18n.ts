import enTranslations from './i18n/en.json';
import ruTranslations from './i18n/ru.json';

type Translations = typeof enTranslations;

const translations: Record<string, Translations> = {
  en: enTranslations,
  ru: ruTranslations,
};

export function getTranslations(locale: string): Translations {
  return translations[locale] || translations.en;
}

export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', options);
}


