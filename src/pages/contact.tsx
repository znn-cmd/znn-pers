import Layout from '@/components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import { getTranslations } from '@/lib/i18n';
import { generatePersonSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { GetStaticProps } from 'next';
import { motion } from 'framer-motion';

interface ContactProps {
  locale: string;
}

export default function Contact({ locale }: ContactProps) {
  const t = getTranslations(locale);

  const contactLinks = [
    {
      name: 'Telegram',
      href: 'https://t.me/nnzaitsev',
      description: locale === 'en' ? 'Best for quick discussions' : 'Лучше для быстрых обсуждений',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/zaitsevnn/',
      description: locale === 'en' ? 'For insights and updates' : 'Для инсайтов и обновлений',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/zaitsevn/',
      description: locale === 'en' ? 'Professional network' : 'Профессиональная сеть',
    },
    {
      name: 'Telegram Channel',
      href: 'https://t.me/arhiproduct',
      description: locale === 'en' ? 'Business insights and observations' : 'Бизнес-инсайты и наблюдения',
    },
  ];

  const description = locale === 'en'
    ? 'Get in touch with Nikolai Zaitsev for product strategy, real estate consulting, and system thinking discussions.'
    : 'Свяжитесь с Николаем Зайцевым для обсуждения продуктовой стратегии, консалтинга в недвижимости и системного мышления.';

  const structuredData = [
    generatePersonSchema(),
    generateBreadcrumbSchema([
      { name: t.nav.home, url: '/' },
      { name: t.nav.contact, url: '/contact' },
    ]),
  ];

  return (
    <Layout title={t.contact.title} description={t.contact.content}>
      <SEO
        title={`${t.contact.title} | Nikolai Zaitsev`}
        description={description}
        url="https://znn.today/contact"
        locale={locale}
        keywords={[
          'contact Nikolai Zaitsev',
          'product strategy consultant',
          'real estate consulting',
          'proptech expert',
          'business consultation',
        ]}
        structuredData={structuredData}
      />
      <div className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: t.nav.home, href: '/' },
            { label: t.nav.contact },
          ]}
        />

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
            {t.contact.title}
          </h1>

          <div className="prose-custom mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-lg tracking-tight">
                ZNN
              </div>
              <h2 className="text-2xl font-light">Nikolai Zaitsev</h2>
            </div>
            <p className="text-2xl md:text-3xl font-light leading-relaxed whitespace-pre-line">
              {t.contact.content}
            </p>
          </div>

          <div className="space-y-6">
            {contactLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="block group"
              >
                <div className="border border-neutral-200 hover:border-neutral-900 transition-colors p-8 rounded-lg">
                  <h3 className="text-2xl font-normal mb-2 group-hover:opacity-60 transition-opacity">
                    {link.name} →
                  </h3>
                  <p className="text-neutral-600">{link.description}</p>
                </div>
              </motion.a>
            ))}
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

