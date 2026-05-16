import { GetServerSideProps } from 'next';

function RobotsTxt() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://znn.today'; // Update with actual domain

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Disallow hidden pages
Disallow: /card

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default RobotsTxt;


