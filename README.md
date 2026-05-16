# Product Architecture

A bilingual (EN/RU) minimalist website for **Nikolai Zaitsev** — strategist, product architect, and expert in real-estate product thinking, marketing, and trust systems.

## 🎯 Overview

An ultra-clean, text-first personal media hub in the style of Apple / Minimal Journal / Notion. The site publishes:

- 🔥 **Project Roasts** — product audits and teardown analyses
- 🧠 **Product Thinking** — essays and frameworks
- 📊 **Market Analytics** — trends and insights in real estate
- 📘 **About** — author philosophy
- 🪪 **Hidden Contact Card** — shortlink personal page at `/card`

## 🧩 Tech Stack

- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Bilingual EN/RU** with Next.js i18n
- **MDX** for content
- **Framer Motion** for smooth transitions
- **Static export ready**

## 📁 Project Structure

```
/src
 ├─ components/          # Reusable UI components
 │   ├─ Header.tsx       # Navigation with language toggle
 │   ├─ Footer.tsx       # Social links
 │   ├─ Layout.tsx       # Page wrapper
 │   ├─ Breadcrumbs.tsx  # Navigation breadcrumbs
 │   └─ PostCard.tsx     # Post preview card
 ├─ pages/               # Next.js pages
 │   ├─ index.tsx        # Home page
 │   ├─ roasts/          # Project roasts
 │   ├─ articles/        # Product thinking articles
 │   ├─ analytics/       # Market analytics
 │   ├─ about.tsx        # About page
 │   ├─ contact.tsx      # Contact page
 │   └─ card.tsx         # Hidden digital card at /card
 ├─ content/             # MDX content files
 │   ├─ roasts/          # Roast posts (*.en.mdx, *.ru.mdx)
 │   ├─ articles/        # Article posts
 │   └─ analytics/       # Analytics posts
 ├─ lib/                 # Utilities
 │   ├─ getPosts.ts      # Content fetching logic
 │   ├─ i18n.ts          # i18n utilities
 │   └─ i18n/            # Translation files
 │        ├─ en.json     # English translations
 │        └─ ru.json     # Russian translations
 └─ styles/
     └─ globals.css      # Global styles & typography
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🔐 Admin Panel (New)

A lightweight admin panel is available at `/admin` with single-password auth.

### Required environment variables

Create `.env.local` in project root:

```bash
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=optional-extra-secret
GITHUB_TOKEN=github_pat_with_contents_write
GITHUB_OWNER=your-github-username-or-org
GITHUB_REPO=your-repo-name
GITHUB_BRANCH=main
AGENT_PUBLISH_TOKEN=long-random-secret-for-machine-access
```

Notes:
- `ADMIN_PASSWORD` is used for login.
- `ADMIN_SESSION_SECRET` is optional (falls back to `ADMIN_PASSWORD`).
- `GITHUB_TOKEN` must have permissions to update repository contents.
- All admin saves are committed directly to `main` (as requested).
- `AGENT_PUBLISH_TOKEN` is used for external machine-to-machine publishing endpoint.

### External agent automation

If you want an external Claude (or other AI) agent to publish posts automatically, use:

- API endpoint: `/api/agent/publish`
- Auth: `Authorization: Bearer AGENT_PUBLISH_TOKEN`
- Full setup and copy-paste agent prompt: `EXTERNAL_AGENT_AUTOMATION.md`
- Production prompt file: `EXTERNAL_AGENT_PRODUCTION_PROMPT.md`
- Editorial refresh process: `TOP_PAGES_REFRESH_PROCESS.md`

### GEO (AI engines) content quality gate

Publishing endpoints now enforce a content quality gate:

- Minimum content length
- Mandatory sections in article body:
  - `TL;DR`
  - `FAQ`
  - `Key Takeaways`
  - `Sources`
- Rejection of weak/unverifiable claims (guarantees, absolute claims)

### LLM discovery files

Public AI-facing metadata files:

- `/llms.txt`
- `/llms-full.txt`

### What admin manages

- **Materials** (`/admin/materials`)
  - Table view (`slug`, `title`, `category`, `lang`, `date`, `status`)
  - Create/edit posts for `articles`, `roasts`, `analytics`
  - **Preview is mandatory before save**
  - Saves MDX files to `src/content/<category>/<slug>.<locale>.mdx`

- **Homepage and categories** (`/admin/settings`)
  - Hero quote/subtitle content for EN/RU
  - Category order, visibility, and titles
  - Stored in:
    - `src/content/site/homepage.json`
    - `src/content/site/categories.json`

### Adding Content

Content is managed through MDX files in `src/content/`. Each post needs both English and Russian versions.

Example file structure:
```
src/content/roasts/
  ├─ my-post.en.mdx
  └─ my-post.ru.mdx
```

Example frontmatter:
```yaml
---
title: "Post Title"
date: "2025-10-08"
excerpt: "Brief description for preview"
tags: ["tag1", "tag2"]
lang: "en"
---
```

### Language Switching

The site automatically detects the locale and serves appropriate content. Users can toggle between EN/RU using the language switcher in the header.

## 🎨 Design Philosophy

- **Calm authority** — whitespace as luxury
- **Typography-first** — Inter font, generous line heights
- **Minimal color palette** — neutral grays, black on white
- **Smooth animations** — subtle Framer Motion transitions
- **No borders, no gradients** — separation through space

## 📦 Deployment

### Hostinger (Configured & Ready)

The project is pre-configured for Hostinger VPS deployment with Node.js.

**Requirements:** Hostinger VPS or Cloud Hosting (Node.js support)

**Quick Deploy:**
```bash
# On your VPS via SSH
cd /var/www/znn
npm install
npm run build
pm2 start npm --name "znn" -- start
```

Then configure Nginx as reverse proxy and set up SSL.

📖 **Full Guide**: See [HOSTINGER_QUICKSTART.md](HOSTINGER_QUICKSTART.md) (15-minute setup) or [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md) (detailed instructions).

### Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The site will be automatically deployed with:
- Server-side rendering for dynamic routes
- Automatic i18n routing
- Edge optimization

**Note**: To deploy on Vercel, change `output: 'export'` back to `output: 'standalone'` in `next.config.js`.

## 🔗 Special Routes

- `/` — Home page with latest posts
- `/roasts` — All project roasts
- `/articles` — All articles
- `/analytics` — All market analytics
- `/about` — About page
- `/contact` — Contact page
- `/card` — Hidden digital contact card (not linked from navigation)

## 📝 License

© 2025 Nikolai Zaitsev. All rights reserved.

## 🤝 Contact

- **Telegram**: [@nnzaitsev](https://t.me/nnzaitsev)
- **Instagram**: [@zaitsevnn](https://www.instagram.com/zaitsevnn/)
- **LinkedIn**: [zaitsevn](https://www.linkedin.com/in/zaitsevn/)
- **Telegram Channel**: [@arhiroduct](https://t.me/arhiroduct) - Business insights and observations

---

Built with precision. Designed for clarity. Focused on trust.

