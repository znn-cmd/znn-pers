import Link from 'next/link';
import { motion } from 'framer-motion';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import Layout from '@/components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import PostImage, { InlineImage } from '@/components/PostImage';
import { formatDate, getTranslations } from '@/lib/i18n';
import type { Post, PostMeta } from '@/lib/getPosts';
import {
  extractFaqItems,
  extractSectionBullets,
  extractSources,
} from '@/lib/contentQuality';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateOrganizationSchema,
  generatePersonSchema,
} from '@/lib/seo';

type Category = 'articles' | 'roasts' | 'analytics';

interface PostPageTemplateProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
  locale: string;
  category: Category;
  relatedPosts: PostMeta[];
}

function getCategoryLabel(locale: string, category: Category): string {
  const isRu = locale === 'ru';
  if (category === 'articles') return isRu ? 'Статьи' : 'Articles';
  if (category === 'roasts') return isRu ? 'Разборы' : 'Roasts';
  return isRu ? 'Аналитика' : 'Analytics';
}

export default function PostPageTemplate({
  post,
  mdxSource,
  locale,
  category,
  relatedPosts,
}: PostPageTemplateProps) {
  const t = getTranslations(locale);
  const isRu = locale === 'ru';
  const categoryLabel = getCategoryLabel(locale, category);
  const postUrl = `/${category}/${post.slug}`;
  const publishedTime = post.date;
  const modifiedTime = post.dateModified || post.date;

  const tldrBullets = extractSectionBullets(post.content, 'tldr').slice(0, 6);
  const keyTakeaways = extractSectionBullets(post.content, 'takeaways').slice(0, 7);
  const faqItems = extractFaqItems(post.content).slice(0, 5);
  const sources = extractSources(post.content).slice(0, 8);

  const fallbackTldr = [
    isRu ? `Материал о теме: ${post.title}.` : `This article covers: ${post.title}.`,
    post.excerpt,
    isRu
      ? 'Ниже разобраны практические шаги, риски и выводы.'
      : 'Below you will find practical steps, risks, and takeaways.',
  ];

  const fallbackTakeaways = [
    isRu ? 'Опирайтесь на данные, а не на предположения.' : 'Use data-first decisions, not assumptions.',
    isRu ? 'Проверяйте гипотезы на практике.' : 'Validate hypotheses in practice.',
    isRu ? 'Смотрите на систему целиком: продукт, рынок, коммуникацию.' : 'Treat product, market, and communication as one system.',
  ];

  const fallbackFaq = [
    {
      question: isRu ? 'Для кого этот материал?' : 'Who is this article for?',
      answer: isRu
        ? 'Для специалистов, которые принимают продуктовые и стратегические решения.'
        : 'For specialists making product and strategic decisions.',
    },
    {
      question: isRu ? 'Есть ли практическое применение?' : 'Is this actionable?',
      answer: isRu
        ? 'Да, структура материала ориентирована на практическое внедрение.'
        : 'Yes, the structure is focused on practical implementation.',
    },
    {
      question: isRu ? 'Как использовать материал дальше?' : 'What should I do next?',
      answer: isRu
        ? 'Сопоставьте выводы статьи со своей текущей воронкой или продуктовой задачей.'
        : 'Map the article takeaways to your current funnel or product task.',
    },
  ];

  const fallbackSources = [
    isRu
      ? 'Авторский анализ, практический опыт и публично доступные рыночные данные.'
      : 'Author analysis, practical experience, and publicly available market data.',
  ];

  const structuredData: object[] = [
    generatePersonSchema(),
    generateOrganizationSchema(),
    generateArticleSchema({
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      dateModified: modifiedTime,
      url: postUrl,
      image: post.image ?? undefined,
      category: categoryLabel,
      locale,
    }),
    generateBreadcrumbSchema([
      { name: t.nav.home, url: '/' },
      { name: categoryLabel, url: `/${category}` },
      { name: post.title, url: postUrl },
    ]),
  ];

  if (faqItems.length > 0) {
    structuredData.push(generateFAQSchema(faqItems));
  }

  return (
    <Layout title={post.title} description={post.excerpt}>
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`https://znn.today${postUrl}`}
        locale={locale}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        keywords={post.tags || ['product architecture', 'strategy', 'analysis']}
        image={post.image ?? undefined}
        structuredData={structuredData}
      />
      <article className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t.nav.home, href: '/' },
            { label: categoryLabel, href: `/${category}` },
            { label: post.title },
          ]}
        />

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-4">
            <time dateTime={post.date}>
              {isRu ? 'Опубликовано: ' : 'Published: '}
              {formatDate(post.date, locale)}
            </time>
            <time dateTime={modifiedTime}>
              {isRu ? 'Обновлено: ' : 'Updated: '}
              {formatDate(modifiedTime, locale)}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-6">{post.title}</h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-neutral-500 px-3 py-1 bg-neutral-100 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        <section className="mb-10 bg-neutral-50 border border-neutral-200 rounded-xl p-6">
          <h2 className="text-2xl font-medium mb-4">TL;DR</h2>
          <ul className="space-y-2 text-neutral-700">
            {(tldrBullets.length > 0 ? tldrBullets : fallbackTldr).map((item) => (
              <li key={item} className="leading-relaxed">
                - {item}
              </li>
            ))}
          </ul>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose-custom mb-14"
        >
          <MDXRemote
            {...mdxSource}
            components={{
              PostImage,
              InlineImage,
            }}
          />
        </motion.div>

        <section className="mb-10">
          <h2 className="text-2xl font-medium mb-4">{isRu ? 'Ключевые выводы' : 'Key Takeaways'}</h2>
          <ul className="space-y-2 text-neutral-700">
            {(keyTakeaways.length > 0 ? keyTakeaways : fallbackTakeaways).map((item) => (
              <li key={item} className="leading-relaxed">
                - {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-medium mb-4">FAQ</h2>
          <div className="space-y-4">
            {(faqItems.length > 0 ? faqItems : fallbackFaq).map((item) => (
              <article key={item.question} className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">{item.question}</h3>
                <p className="text-neutral-700 leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-medium mb-4">{isRu ? 'Источники' : 'Sources'}</h2>
          <ul className="space-y-2 text-neutral-700">
            {(sources.length > 0 ? sources : fallbackSources).map((item) => (
              <li key={item} className="leading-relaxed">
                - {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12 bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-2xl font-medium mb-3">{isRu ? 'Об авторе' : 'About the author'}</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            {isRu
              ? 'Николай Зайцев - продуктовый архитектор и стратег в недвижимости. Экспертиза подтверждается практической работой на рынках B2B/B2C, публикациями аналитики и публичными кейсами в каналах автора.'
              : 'Nikolai Zaitsev is a product architect and real estate strategist. His expertise is grounded in practical B2B/B2C work, published analytics, and public case-based materials.'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="https://www.linkedin.com/in/zaitsevn/" target="_blank" rel="noreferrer" className="underline">
              LinkedIn
            </a>
            <a href="https://t.me/nnzaitsev" target="_blank" rel="noreferrer" className="underline">
              Telegram
            </a>
            <a href="https://t.me/arhiproduct" target="_blank" rel="noreferrer" className="underline">
              Channel
            </a>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-medium mb-4">{isRu ? 'Что читать дальше' : 'What to read next'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {relatedPosts.map((item) => (
              <Link
                key={`${item.category}-${item.slug}`}
                href={`/${item.category || category}/${item.slug}`}
                className="block border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition-colors"
              >
                <p className="text-xs text-neutral-500 mb-2">{formatDate(item.date, locale)}</p>
                <p className="font-medium mb-2">{item.title}</p>
                <p className="text-sm text-neutral-600">{item.excerpt}</p>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/articles" className="underline">
              {isRu ? 'Кластер: Статьи' : 'Cluster: Articles'}
            </Link>
            <Link href="/roasts" className="underline">
              {isRu ? 'Кластер: Разборы' : 'Cluster: Roasts'}
            </Link>
            <Link href="/analytics" className="underline">
              {isRu ? 'Кластер: Аналитика' : 'Cluster: Analytics'}
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
