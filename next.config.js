/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone', // For Node.js deployment on VPS/Cloud hosting
}

module.exports = nextConfig

