import Layout from '@/components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import Logo from '@/components/Logo';
import SEO from '@/components/SEO';
import { getTranslations } from '@/lib/i18n';
import { generatePersonSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { GetStaticProps } from 'next';
import { motion } from 'framer-motion';

interface AboutProps {
  locale: string;
}

export default function About({ locale }: AboutProps) {
  const t = getTranslations(locale);

  const description = locale === 'en'
    ? 'Strategist, product architect, and systems thinker specializing in real estate and trust-based products. Building products people actually trust through structural clarity.'
    : 'Стратег, продуктовый архитектор и системный мыслитель, специализирующийся на недвижимости и продуктах, основанных на доверии. Создаю продукты, которым люди действительно доверяют.';

  const structuredData = [
    generatePersonSchema(),
    generateBreadcrumbSchema([
      { name: t.nav.home, url: '/' },
      { name: t.nav.about, url: '/about' },
    ]),
  ];

  return (
    <Layout title={t.about.title} description={t.about.content.substring(0, 160)}>
      <SEO
        title={`${t.about.title} | Nikolai Zaitsev`}
        description={description}
        url={`https://znn.today/about`}
        locale={locale}
        keywords={[
          'Nikolai Zaitsev',
          'product architect',
          'real estate strategist',
          'systems thinking',
          'proptech expert',
          'trust-based products',
          'product strategy',
        ]}
        structuredData={structuredData}
      />
      <div className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t.nav.home, href: '/' },
            { label: t.nav.about },
          ]}
        />

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
            {t.about.title}
          </h1>

          <div className="prose-custom">
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed whitespace-pre-line">
              {t.about.content}
            </blockquote>
          </div>

          <div className="mt-16 pt-16 border-t border-neutral-200">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-2xl tracking-tight">
                ZNN
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-normal">Nikolai Zaitsev</h2>
                <p className="text-neutral-600 mt-1">Strategy • Sales • Real Estate</p>
              </div>
            </div>
            <p className="text-lg text-neutral-600 leading-relaxed mb-4">
              {locale === 'en' 
                ? 'Strategist, product architect, and systems thinker specializing in real estate and trust-based products.'
                : 'Стратег, продуктовый архитектор и системный мыслитель, специализирующийся на недвижимости и продуктах, основанных на доверии.'}
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {locale === 'en'
                ? 'I help teams build products that people actually trust — not through hype, but through structural clarity and perceptual intelligence.'
                : 'Я помогаю командам создавать продукты, которым люди действительно доверяют — не через хайп, а через структурную ясность и перцептивный интеллект.'}
            </p>
          </div>
        </motion.article>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      locale: locale || 'en',
    },
  };
};

