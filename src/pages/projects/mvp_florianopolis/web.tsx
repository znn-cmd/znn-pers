import Layout from '@/components/Layout';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';
import { getTranslations } from '@/lib/i18n';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { GetStaticProps } from 'next';

const IFRAME_SRC =
  process.env.NEXT_PUBLIC_FLORIANOPOLIS_WEB_URL || 'https://web-theta-lac-50.vercel.app';

interface PageProps {
  locale: string;
}

export default function FlorianopolisMvpEmbed({ locale }: PageProps) {
  const t = getTranslations(locale);
  const m = t.florianopolisMvp;

  const structuredData = [
    generateBreadcrumbSchema([
      { name: t.nav.home, url: '/' },
      { name: m.title, url: '/projects/mvp_florianopolis/web' },
    ]),
  ];

  return (
    <Layout title={m.title} description={m.description}>
      <SEO
        title={`${m.title} | Nikolai Zaitsev`}
        description={m.description}
        url="https://znn.today/projects/mvp_florianopolis/web"
        locale={locale}
        keywords={[
          'Florianopolis',
          'real estate agency',
          'financial model',
          'scenario planning',
        ]}
        structuredData={structuredData}
      />
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <Breadcrumbs
          items={[{ label: t.nav.home, href: '/' }, { label: m.title }]}
        />
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900">
            {m.title}
          </h1>
          <p className="mt-2 text-neutral-600 max-w-2xl">{m.description}</p>
        </header>
        <div className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm">
          <iframe
            title={m.iframeTitle}
            src={`${IFRAME_SRC.replace(/\/$/, '')}/`}
            className="block w-full border-0 bg-white"
            style={{ minHeight: 'min(900px, calc(100vh - 14rem))', height: 'calc(100vh - 14rem)' }}
            loading="eager"
          />
        </div>
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
