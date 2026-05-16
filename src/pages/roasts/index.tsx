import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import { getPostsByCategory } from '@/lib/getPosts';
import { getTranslations } from '@/lib/i18n';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { GetStaticProps } from 'next';
import { PostMeta } from '@/lib/getPosts';
import { motion } from 'framer-motion';

interface RoastsProps {
  posts: PostMeta[];
  locale: string;
}

export default function Roasts({ posts, locale }: RoastsProps) {
  const t = getTranslations(locale);

  const structuredData = generateBreadcrumbSchema([
    { name: t.nav.home, url: '/' },
    { name: t.nav.roasts, url: '/roasts' },
  ]);

  return (
    <Layout title={t.roasts.title} description={t.roasts.subtitle}>
      <SEO
        title={t.roasts.title}
        description={t.roasts.subtitle}
        url="https://znn.today/roasts"
        locale={locale}
        keywords={['project analysis', 'product roast', 'real estate critique', 'proptech analysis', 'product review']}
        structuredData={structuredData}
      />
      <div className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t.nav.home, href: '/' },
            { label: t.nav.roasts },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            {t.roasts.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
            {t.roasts.subtitle}
          </p>
        </motion.div>

        <div className="space-y-0">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.slug} post={post} category="roasts" />
            ))
          ) : (
            <p className="text-neutral-500">No posts yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale = locale || 'en';
  const posts = getPostsByCategory('roasts', currentLocale);

  return {
    props: {
      posts,
      locale: currentLocale,
    },
  };
};

