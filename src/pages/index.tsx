import Layout from '@/components/Layout';
import HomePostCard from '@/components/HomePostCard';
import SEO from '@/components/SEO';
import { getPostsByCategory } from '@/lib/getPosts';
import { getTranslations } from '@/lib/i18n';
import { generatePersonSchema, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';
import { getCategoriesConfig, getHomepageConfig } from '@/lib/siteConfig';
import { GetStaticProps } from 'next';
import { PostMeta } from '@/lib/getPosts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CategoryConfigItem, HomePageContent } from '@/lib/admin/types';

interface HomeProps {
  roasts: PostMeta[];
  articles: PostMeta[];
  analytics: PostMeta[];
  locale: string;
  categories: CategoryConfigItem[];
  homepage: HomePageContent;
}

const TEMPORARY_COMING_SOON_MODE = true;

export default function Home({ roasts, articles, analytics, locale, categories, homepage }: HomeProps) {
  if (TEMPORARY_COMING_SOON_MODE) {
    const isRussian = locale === 'ru';

    return (
      <Layout>
        <SEO
          title={isRussian ? 'Скоро здесь будет блог' : 'Blog is coming soon'}
          description={
            isRussian
              ? 'Мы обновляем сайт. Совсем скоро здесь появится новый блог.'
              : 'We are updating the site. A new blog will be available here very soon.'
          }
          url="https://znn.today"
          locale={locale}
          keywords={['blog', 'coming soon', 'soon', 'znn']}
        />
        <main className="min-h-[70vh] flex items-center justify-center px-6">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl w-full text-center"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500 mb-8">
              znn.today
            </p>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-neutral-900 mb-6">
              {isRussian ? 'Скоро здесь будет блог' : 'Blog coming soon'}
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {isRussian
                ? 'Мы готовим новую версию главной страницы. Спасибо за терпение — скоро всё будет готово.'
                : 'We are preparing a new homepage experience. Thank you for your patience - it will be live soon.'}
            </p>
          </motion.section>
        </main>
      </Layout>
    );
  }

  const t = getTranslations(locale);
  const hero = locale === 'ru' ? homepage.ru : homepage.en;
  const postsByCategory = {
    roasts,
    articles,
    analytics,
  };

  // Структурированные данные для главной страницы
  const structuredData = [
    generatePersonSchema(),
    generateOrganizationSchema(),
    generateWebSiteSchema(locale),
  ];

  return (
    <Layout>
      <SEO
        title="Product Architecture"
        description={hero.subtitle}
        url="https://znn.today"
        locale={locale}
        keywords={[
          'product architecture',
          'real estate',
          'proptech',
          'systems thinking',
          'sales strategy',
          'market analytics',
          'UAE real estate',
          'product thinking',
        ]}
        structuredData={structuredData}
      />
      <div className="max-w-3xl mx-auto px-6">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-32 text-center"
        >
          <div className="max-w-4xl mx-auto">
            {/* ZNN Logo */}
            <div className="flex justify-center mb-12">
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-xl font-bold tracking-tight">
                ZNN
              </div>
            </div>
            
            <blockquote className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-12 whitespace-pre-line text-neutral-900">
              {hero.quote}
            </blockquote>
            <div className="w-24 h-px bg-neutral-300 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
              {hero.subtitle}
            </p>
          </div>
        </motion.section>

        {categories
          .filter((category) => category.enabled)
          .sort((a, b) => a.order - b.order)
          .map((category) => {
            if (!(category.id in postsByCategory)) {
              return null;
            }

            const categoryPosts = postsByCategory[category.id as 'roasts' | 'articles' | 'analytics'];
            if (categoryPosts.length === 0) {
              return null;
            }

            const categoryTitle = locale === 'ru' ? category.title_ru : category.title_en;

            return (
              <section key={category.id} className="mb-24">
                <div className="flex justify-between items-baseline mb-12">
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight">{categoryTitle}</h2>
                  <Link
                    href={`/${category.id}`}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-300"
                  >
                    {t.home.exploreAll} →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {categoryPosts.slice(0, 3).map((post) => (
                    <HomePostCard key={`${category.id}-${post.slug}`} post={post} category={category.id as 'roasts' | 'articles' | 'analytics'} />
                  ))}
                </div>
              </section>
            );
          })}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale = locale || 'en';
  
  const roasts = getPostsByCategory('roasts', currentLocale);
  const articles = getPostsByCategory('articles', currentLocale);
  const analytics = getPostsByCategory('analytics', currentLocale);
  const categories = getCategoriesConfig();
  const homepage = getHomepageConfig();

  return {
    props: {
      roasts,
      articles,
      analytics,
      locale: currentLocale,
      categories,
      homepage,
    },
  };
};

