# Deployment Guide

## Quick Start

The easiest way to deploy this Next.js application is using Vercel:

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Configure settings (defaults are fine)
   - Deploy!

Your site will be live at a Vercel URL. You can add a custom domain later.

## Environment Variables

No environment variables are required for basic deployment. The site works out of the box.

If you want to customize:
- Update the base URL in `src/pages/sitemap.xml.tsx` (line 5)
- Update the base URL in `src/pages/robots.txt.tsx` (line 10)
- Replace placeholder images in `/public` with actual assets

## Custom Domain Setup (Vercel)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., `znn.today`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (usually < 10 minutes)

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the site
npm run build

# Deploy
netlify deploy --prod
```

### Static Export (for any host)

If you want to deploy as a static site:

1. Update `next.config.js`:
   ```js
   module.exports = {
     output: 'export',
     images: { unoptimized: true },
     // ... rest of config
   }
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Upload the `/out` folder to any static host:
   - AWS S3 + CloudFront
   - GitHub Pages
   - Cloudflare Pages
   - Any static hosting service

## Performance Optimization

For production, ensure:

✅ Replace placeholder images in `/public` with optimized real images  
✅ Add actual favicon.ico (not the text placeholder)  
✅ Update OG image (1200x630px) for social media previews  
✅ Update social links in Footer and Contact pages  
✅ Update domain URLs in sitemap and robots.txt  

## Content Updates

To add new posts:

1. Create new `.mdx` files in appropriate category folder:
   - `src/content/roasts/`
   - `src/content/articles/`
   - `src/content/analytics/`

2. Create both EN and RU versions:
   - `my-post.en.mdx`
   - `my-post.ru.mdx`

3. Include proper frontmatter:
   ```yaml
   ---
   title: "Post Title"
   date: "2025-10-08"
   excerpt: "Brief description"
   tags: ["tag1", "tag2"]
   lang: "en"
   ---
   ```

4. Rebuild and deploy:
   ```bash
   vercel --prod
   ```

## Monitoring

Once deployed, monitor:
- Page load times (should be < 1s)
- Mobile responsiveness
- SEO scores (Google PageSpeed Insights)
- Broken links

## Support

For issues or questions, contact:
- Telegram: [@nnzaitsev](https://t.me/nnzaitsev)
- Telegram Channel: [@arhiroduct](https://t.me/arhiroduct)

---

**Built for speed. Designed for clarity. Optimized for trust.**

