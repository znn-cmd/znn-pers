import { GetServerSideProps } from 'next';
import { getPostsByCategory } from '@/lib/getPosts';

function generateSiteMap(posts: any[]) {
  const baseUrl = 'https://znn.today'; // Update with actual domain

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:xhtml="http://www.w3.org/1999/xhtml">
     <!-- Static pages -->
     <url>
       <loc>${baseUrl}</loc>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}" />
       <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru" />
     </url>
     <url>
       <loc>${baseUrl}/roasts</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/roasts" />
       <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru/roasts" />
     </url>
     <url>
       <loc>${baseUrl}/articles</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/articles" />
       <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru/articles" />
     </url>
     <url>
       <loc>${baseUrl}/analytics</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/analytics" />
       <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru/analytics" />
     </url>
     <url>
       <loc>${baseUrl}/about</loc>
       <changefreq>monthly</changefreq>
       <priority>0.6</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/about" />
       <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru/about" />
     </url>
     <url>
       <loc>${baseUrl}/contact</loc>
       <changefreq>monthly</changefreq>
       <priority>0.6</priority>
       <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/contact" />
       <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru/contact" />
     </url>
     <!-- Dynamic pages -->
     ${posts
       .map(({ category, slug }) => {
         return `
       <url>
         <loc>${baseUrl}/${category}/${slug}</loc>
         <changefreq>monthly</changefreq>
         <priority>0.7</priority>
         <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/${category}/${slug}" />
         <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru/${category}/${slug}" />
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Gather all posts
  const roasts = getPostsByCategory('roasts', 'en').map((p) => ({ ...p, category: 'roasts' }));
  const articles = getPostsByCategory('articles', 'en').map((p) => ({ ...p, category: 'articles' }));
  const analytics = getPostsByCategory('analytics', 'en').map((p) => ({ ...p, category: 'analytics' }));

  const allPosts = [...roasts, ...articles, ...analytics];

  // Generate the XML sitemap
  const sitemap = generateSiteMap(allPosts);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;


