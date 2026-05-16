# SEO - Краткое руководство

## ✅ Что было сделано:

### 🎯 **Микроразметка Schema.org**
- **Person** - информация об авторе (Nikolai Zaitsev)
- **Organization** - информация о проекте (ZNN.today)
- **WebSite** - информация о сайте
- **Article** - для всех постов (articles, roasts, analytics)
- **BreadcrumbList** - хлебные крошки для навигации
- **Dataset** - для страницы market с данными

### 📄 **SEO оптимизация**
- ✅ Уникальные title и description для всех страниц
- ✅ Canonical URLs
- ✅ Hreflang теги (en, ru, x-default)
- ✅ Keywords для каждой страницы
- ✅ Open Graph метатеги
- ✅ Twitter Card метатеги

### 📁 **Новые файлы**
- `src/components/SEO.tsx` - универсальный SEO компонент
- `src/lib/seo.ts` - расширен новыми функциями

### 🔧 **Обновленные страницы**
Все страницы обновлены с SEO метатегами и микроразметкой:
- Главная (`index.tsx`)
- About (`about.tsx`)
- Contact (`contact.tsx`)
- Articles (`articles/[slug].tsx`, `articles/index.tsx`)
- Roasts (`roasts/[slug].tsx`, `roasts/index.tsx`)
- Analytics (`analytics/[slug].tsx`, `analytics/index.tsx`)
- Market (`market/[locale].tsx`)
- Card (`card/[locale].tsx`)

---

## 🚀 **Как использовать SEO компонент:**

### Пример 1: Простая страница
```tsx
import SEO from '@/components/SEO';
import { generateBreadcrumbSchema } from '@/lib/seo';

const structuredData = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
]);

return (
  <>
    <SEO
      title="About | Nikolai Zaitsev"
      description="Product architect specializing in real estate..."
      url="https://znn.today/about"
      locale={locale}
      keywords={['product architect', 'real estate', 'systems thinking']}
      structuredData={structuredData}
    />
    {/* Ваш контент */}
  </>
);
```

### Пример 2: Статья (Article)
```tsx
import SEO from '@/components/SEO';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';

const structuredData = [
  generateArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    url: `/articles/${post.slug}`,
    image: post.image,
    category: 'Product Thinking',
    locale,
  }),
  generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Articles', url: '/articles' },
    { name: post.title, url: `/articles/${post.slug}` },
  ]),
];

return (
  <>
    <SEO
      title={post.title}
      description={post.excerpt}
      url={`https://znn.today/articles/${post.slug}`}
      locale={locale}
      type="article"
      publishedTime={post.date}
      keywords={post.tags}
      image={post.image}
      structuredData={structuredData}
    />
    {/* Ваш контент */}
  </>
);
```

---

## 🔍 **Проверка SEO:**

### Инструменты для проверки:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Проверить микроразметку Schema.org
   
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Проверить Open Graph метатеги
   
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Проверить Twitter Card метатеги
   
4. **Schema.org Validator**: https://validator.schema.org/
   - Валидация JSON-LD структурированных данных
   
5. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Проверить производительность и Core Web Vitals

### Команды для проверки локально:
```bash
# Запустить dev сервер
npm run dev

# Открыть в браузере
http://localhost:3000

# Проверить source code (Ctrl+U)
# Найти <script type="application/ld+json">
# Скопировать JSON и проверить в Schema.org Validator
```

---

## 📊 **Что проверять в Google Search Console:**

После добавления сайта в Google Search Console:
1. **Coverage** - какие страницы проиндексированы
2. **Enhancements** - rich results (статьи, хлебные крошки)
3. **Sitemaps** - отправить sitemap.xml
4. **Performance** - клики, показы, CTR
5. **Core Web Vitals** - производительность

---

## 🎯 **Keywords по категориям:**

### Главная:
`product architecture, real estate, proptech, systems thinking, sales strategy, market analytics, UAE real estate, product thinking`

### Articles:
`product thinking, strategy, systems thinking, real estate articles, product architecture`

### Roasts:
`project analysis, product roast, real estate critique, proptech analysis, product review`

### Analytics:
`market analytics, real estate data, proptech trends, market insights, global real estate`

### Market:
`UAE real estate market, Dubai property sales, rental contracts UAE, real estate analytics, property market data, UAE housing statistics, proptech data`

### About:
`Nikolai Zaitsev, product architect, real estate strategist, systems thinking, proptech expert, trust-based products, product strategy`

### Contact:
`contact Nikolai Zaitsev, product strategy consultant, real estate consulting, proptech expert, business consultation`

---

## ✅ **Готово!**

Сайт полностью оптимизирован для SEO и готов к индексации поисковыми системами! 🎉


