import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';
import { getTranslations } from '@/lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter();
  const { locale } = router;
  const t = getTranslations(locale || 'en');

  const siteTitle = title ? `${title} | Product Architecture` : 'Product Architecture | Nikolai Zaitsev';
  const siteDescription = description || (locale === 'ru' 
    ? 'Журнал о продукте, доверии и системном мышлении в недвижимости и не только.'
    : 'A journal about product, trust and systems thinking in real estate and beyond.');

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header t={t} />
        <main className="flex-grow pt-32">
          {children}
        </main>
        <Footer t={t} />
      </div>
    </>
  );
}


