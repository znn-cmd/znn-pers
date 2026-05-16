# Quick Start Guide

Get your **Product Architecture** website running in 3 minutes.

## 🚀 Step 1: Install Dependencies

```bash
cd znn
npm install
```

This installs all required packages including Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Step 2: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- ✅ Home page with bilingual hero section
- ✅ Three example posts (Roasts, Articles, Analytics)
- ✅ Language switcher (EN/RU) in header
- ✅ Smooth animations on scroll

## 🔧 Step 3: Customize

### Replace Placeholder Assets

```
public/
├── favicon.ico     ← Replace with your favicon
├── og-image.jpg    ← Replace with 1200×630px social image
└── znn.png         ← Replace with your logo
```

### Update Social Links

Edit these files:
- `src/components/Footer.tsx` (lines 12-16)
- `src/pages/contact.tsx` (lines 20-34)
- `src/pages/card.tsx` (lines 13-17)

Replace placeholder URLs with your actual social media profiles.

### Update Domain

Edit these files:
- `src/pages/sitemap.xml.tsx` (line 5) - Update `baseUrl`
- `src/pages/robots.txt.tsx` (line 10) - Update `baseUrl`

## 📝 Step 4: Add Your Content

Create new MDX files in `src/content/`:

```bash
# Example: Add a new roast
src/content/roasts/my-roast.en.mdx
src/content/roasts/my-roast.ru.mdx
```

**Template:**

```mdx
---
title: "Your Post Title"
date: "2025-10-08"
excerpt: "Brief description for preview cards"
tags: ["tag1", "tag2", "tag3"]
lang: "en"
---

Your content here in markdown format.

## Headings work
**Bold text** and *italic text* work.

> Blockquotes look beautiful.

- Lists
- Are
- Supported
```

## 🚢 Step 5: Deploy to Vercel

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy
vercel
```

Follow the prompts. Your site will be live in ~2 minutes!

## ✅ Verification

Test these routes:
- `/` - Home page
- `/roasts` - All roasts
- `/articles` - All articles
- `/analytics` - All analytics
- `/about` - About page
- `/contact` - Contact page
- `/card` - Hidden contact card
- Click language toggle (EN ↔ RU)

## 🎯 Next Steps

1. **Add more content** - Create bilingual MDX posts
2. **Customize About page** - Update your biography
3. **Set up custom domain** - In Vercel dashboard
4. **Monitor performance** - Use Vercel Analytics

## 📚 More Documentation

- `README.md` - Full project documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `PROJECT_OVERVIEW.md` - Complete feature list

## 🐛 Troubleshooting

**Issue: Posts not showing up**
- Check file naming: Must be `slug.en.mdx` and `slug.ru.mdx`
- Verify frontmatter is correctly formatted
- Restart dev server

**Issue: Language switching not working**
- Check `next.config.js` has i18n configuration
- Verify translation files exist in `src/lib/i18n/`

**Issue: Styling broken**
- Run `npm install` again
- Clear `.next` folder and restart dev server

## 💡 Tips

- Use VSCode with MDX extension for better editing
- Test mobile responsiveness (cmd/ctrl + shift + M in browser)
- Keep posts under 2000 words for optimal reading
- Add images by placing them in `/public` and referencing in MDX

## 🎉 You're Ready!

Your website is fully functional and ready to share with the world.

Focus on creating great content - the design and infrastructure are already world-class.

---

**Questions?** Check the full README or reach out via the Contact page.

**Contact**: [@nnzaitsev](https://t.me/nnzaitsev) | [@arhiroduct](https://t.me/arhiroduct)

