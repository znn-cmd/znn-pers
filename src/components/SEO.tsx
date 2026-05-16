import Head from 'next/head';
import { generateSEO, SEOProps } from '@/lib/seo';

interface SEOComponentProps extends SEOProps {
  structuredData?: object | object[];
}

export default function SEO({ structuredData, ...seoProps }: SEOComponentProps) {
  const seo = generateSEO(seoProps);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Canonical URL */}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}

      {/* Language Alternates */}
      {seo.languageAlternates?.map((alt: any) => (
        <link key={alt.hrefLang} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.openGraph.type} />
      <meta property="og:url" content={seo.openGraph.url} />
      <meta property="og:title" content={seo.openGraph.title} />
      <meta property="og:description" content={seo.openGraph.description} />
      <meta property="og:site_name" content={seo.openGraph.siteName} />
      <meta property="og:locale" content={seo.openGraph.locale} />
      {seo.openGraph.images?.map((img: any, index: number) => (
        <meta key={index} property="og:image" content={img.url} />
      ))}
      {seo.openGraph.images?.[0] && (
        <>
          <meta property="og:image:width" content={seo.openGraph.images[0].width} />
          <meta property="og:image:height" content={seo.openGraph.images[0].height} />
          <meta property="og:image:alt" content={seo.openGraph.images[0].alt} />
        </>
      )}

      {/* Article specific Open Graph */}
      {seo.openGraph.article && (
        <>
          <meta property="article:published_time" content={seo.openGraph.article.publishedTime} />
          <meta property="article:modified_time" content={seo.openGraph.article.modifiedTime} />
          {seo.openGraph.article.author?.map((author: string, index: number) => (
            <meta key={index} property="article:author" content={author} />
          ))}
          {seo.openGraph.article.tags?.map((tag: string, index: number) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content={seo.twitter.card} />
      <meta name="twitter:title" content={seo.twitter.title} />
      <meta name="twitter:description" content={seo.twitter.description} />
      {seo.twitter.images?.[0] && (
        <meta name="twitter:image" content={seo.twitter.images[0]} />
      )}
      {seo.twitter.creator && <meta name="twitter:creator" content={seo.twitter.creator} />}
      {seo.twitter.site && <meta name="twitter:site" content={seo.twitter.site} />}

      {/* Additional Meta Tags */}
      {seo.additionalMetaTags?.map((tag: any, index: number) => (
        <meta key={index} {...tag} />
      ))}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              Array.isArray(structuredData) ? structuredData : [structuredData]
            ),
          }}
        />
      )}
    </Head>
  );
}


