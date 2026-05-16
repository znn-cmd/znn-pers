export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generateSEO({
  title = 'Product Architecture',
  description = 'A journal about product, trust and systems thinking in real estate and beyond.',
  image = '/og-image.jpg',
  url = 'https://znn.today',
  locale = 'en',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Nikolai Zaitsev',
  keywords = [],
}: SEOProps) {
  const siteName = 'Product Architecture | Nikolai Zaitsev';
  const fullTitle = title === 'Product Architecture' ? siteName : `${title} | Product Architecture`;
  const canonicalUrl = url.replace(/\/(en|ru)$/, '');

  const baseOpenGraph: any = {
    type,
    locale: locale === 'ru' ? 'ru_RU' : 'en_US',
    url,
    title: fullTitle,
    description,
    siteName,
    images: [
      {
        url: image.startsWith('http') ? image : `https://znn.today${image}`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  if (type === 'article' && publishedTime) {
    baseOpenGraph.article = {
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      author: [author],
      tags: keywords,
    };
  }

  return {
    title: fullTitle,
    description,
    canonical: canonicalUrl,
    openGraph: baseOpenGraph,
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `https://znn.today${image}`],
      creator: '@zaitsevnn',
      site: '@zaitsevnn',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: keywords.length > 0 ? keywords.join(', ') : 'product architecture, real estate, proptech, systems thinking, strategy',
      },
      {
        name: 'author',
        content: author,
      },
      {
        property: 'article:author',
        content: author,
      },
    ],
    languageAlternates: [
      {
        hrefLang: 'en',
        href: `https://znn.today${canonicalUrl}`,
      },
      {
        hrefLang: 'ru',
        href: `https://znn.today${canonicalUrl}`,
      },
      {
        hrefLang: 'x-default',
        href: `https://znn.today${canonicalUrl}`,
      },
    ],
  };
}

// Schema.org микроразметка для персоны (автора)
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nikolai Zaitsev',
    alternateName: 'Николай Зайцев',
    jobTitle: 'Product Architect & Real Estate Strategist',
    description: 'Product architect specializing in real estate, proptech, and systems thinking',
    url: 'https://znn.today',
    sameAs: [
      'https://t.me/nnzaitsev',
      'https://www.instagram.com/zaitsevnn/',
      'https://www.linkedin.com/in/zaitsevn/',
      'https://t.me/arhiproduct',
    ],
    knowsAbout: [
      'Product Architecture',
      'Real Estate',
      'PropTech',
      'Systems Thinking',
      'Sales Strategy',
      'Market Analytics',
    ],
  };
}

// Schema.org микроразметка для организации/сайта
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Product Architecture by Nikolai Zaitsev',
    alternateName: 'ZNN.today',
    url: 'https://znn.today',
    logo: 'https://znn.today/znn.png',
    founder: {
      '@type': 'Person',
      name: 'Nikolai Zaitsev',
    },
    sameAs: [
      'https://t.me/arhiproduct',
      'https://www.instagram.com/zaitsevnn/',
      'https://www.linkedin.com/in/zaitsevn/',
    ],
  };
}

// Schema.org микроразметка для веб-сайта
export function generateWebSiteSchema(locale: string = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Product Architecture',
    alternateName: locale === 'ru' ? 'Архитектура продукта' : 'Product Architecture',
    description: locale === 'ru' 
      ? 'Журнал о продуктовом мышлении, доверии и системном подходе в недвижимости и не только.'
      : 'A journal about product, trust and systems thinking in real estate and beyond.',
    url: 'https://znn.today',
    inLanguage: [locale === 'ru' ? 'ru-RU' : 'en-US'],
    author: {
      '@type': 'Person',
      name: 'Nikolai Zaitsev',
    },
    publisher: {
      '@type': 'Person',
      name: 'Nikolai Zaitsev',
    },
  };
}

// Schema.org микроразметка для хлебных крошек
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://znn.today${item.url}`,
    })),
  };
}

// Schema.org микроразметка для статьи
export function generateArticleSchema(data: {
  title: string;
  excerpt: string;
  date: string;
  dateModified?: string;
  url: string;
  image?: string;
  category?: string;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.excerpt,
    datePublished: data.date,
    dateModified: data.dateModified || data.date,
    author: {
      '@type': 'Person',
      name: 'Nikolai Zaitsev',
      url: 'https://znn.today',
    },
    publisher: {
      '@type': 'Person',
      name: 'Nikolai Zaitsev',
    },
    image: data.image ? `https://znn.today${data.image}` : 'https://znn.today/og-image.jpg',
    url: `https://znn.today${data.url}`,
    inLanguage: data.locale === 'ru' ? 'ru-RU' : 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://znn.today${data.url}`,
    },
    articleSection: data.category || 'Product Architecture',
  };
}

export function generateFAQSchema(faqItems: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// Устаревшая функция для обратной совместимости
export function generateStructuredData(type: 'website' | 'article', data: any) {
  if (type === 'website') {
    return generateWebSiteSchema(data?.locale || 'en');
  }
  return generateArticleSchema(data);
}

