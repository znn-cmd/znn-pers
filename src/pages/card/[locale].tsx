import { GetStaticProps, GetStaticPaths } from 'next';
import { getTranslations } from '@/lib/i18n';
import { generatePersonSchema } from '@/lib/seo';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

interface CardProps {
  locale: string;
}

export default function Card({ locale }: CardProps) {
  const t = getTranslations(locale);

  const links = [
    { name: t.card.links.telegram, href: 'https://t.me/nnzaitsev' },
    { name: t.card.links.instagram, href: 'https://www.instagram.com/zaitsevnn/' },
    { name: t.card.links.linkedin, href: 'https://www.linkedin.com/in/zaitsevn/' },
    { name: t.card.links.telegramChannel, href: 'https://t.me/arhiproduct' },
    { name: t.card.links.website, href: '/' },
  ];

  const personSchema = generatePersonSchema();

  return (
    <>
      <Head>
        <title>{t.card.title}</title>
        <meta name="description" content={t.card.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://znn.today/card/${locale}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={t.card.title} />
        <meta property="og:description" content={t.card.description} />
        <meta property="og:url" content={`https://znn.today/card/${locale}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://znn.today/znn.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t.card.title} />
        <meta name="twitter:description" content={t.card.description} />
        <meta name="twitter:image" content="https://znn.today/znn.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </Head>

      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* ZNN Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-2xl font-bold tracking-tight">
              ZNN
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <Link 
                href="/card/en"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  locale === 'en' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                EN
              </Link>
              <Link 
                href="/card/ru"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  locale === 'ru' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                RU
              </Link>
            </div>
          </div>

          {/* Name and Role */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light tracking-tight mb-2">
              {t.card.name}
            </h1>
            <p className="text-lg text-neutral-600">
              {t.card.role}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            {links.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.name === t.card.links.website ? '_self' : '_blank'}
                rel={link.name === t.card.links.website ? '' : 'noopener noreferrer'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="block w-full text-center py-4 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all rounded-lg"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Optional: QR Code placeholder */}
          <div className="mt-12 pt-12 border-t border-neutral-200">
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-xs">
                {t.card.qrCode}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { locale: 'en' } },
      { params: { locale: 'ru' } }
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string || 'en';
  return {
    props: {
      locale,
    },
  };
};
