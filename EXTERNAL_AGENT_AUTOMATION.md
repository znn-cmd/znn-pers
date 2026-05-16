# External Claude Agent: Auto-Publish Setup

This guide lets you hand one instruction to an external agent and have it publish materials into this site automatically.

## 1) One-time setup (5 minutes)

1. Generate a long secret token (example: 64+ chars).
2. Add it to Vercel environment variables:
   - Name: `AGENT_PUBLISH_TOKEN`
   - Value: your long secret token
   - Environment: Production (and Preview if needed)
3. Redeploy once so the new variable is available in runtime.

Optional local setup (`.env.local`):

```bash
AGENT_PUBLISH_TOKEN=FqzkDx9Kgix4wqloc_juqGvDBtJx4n1KeDoOYC1aSLycLMZmygKe7ob3z0YHkGZV
```

## 2) API endpoint for agent

- URL: `https://www.znn.today/api/agent/publish`
- Method: `POST`
- Auth: `Authorization: Bearer <AGENT_PUBLISH_TOKEN>`

The endpoint supports:
- `dryRun: true` for validation-only mode
- `dryRun: false` (or omitted) for real publish

## 3) Request format (strict JSON)

```json
{
  "category": "articles",
  "slug": "how-claude-publishes",
  "locale": "ru",
  "dryRun": false,
  "frontmatter": {
    "title": "Как Claude публикует материалы",
    "date": "2026-05-09",
    "excerpt": "Автопубликация в блог через API",
    "tags": ["claude", "automation"],
    "lang": "ru",
    "image": null,
    "published": true
  },
  "content": "# Заголовок\n\nТекст материала..."
}
```

## 4) Copy-paste instruction for external agent

Use this as the main instruction for your external Claude agent:

```text
You are a publishing agent for znn.today.

Goal:
1) Prepare one high-quality blog post in Russian.
2) Validate payload with dryRun=true.
3) If validation passes, publish the post.
4) Return final URL path and a short status report.

API:
- Endpoint: https://www.znn.today/api/agent/publish
- Method: POST
- Header: Authorization: Bearer {{AGENT_PUBLISH_TOKEN}}
- Header: Content-Type: application/json

Payload rules:
- category: one of ["articles", "roasts", "analytics"]
- slug: URL-safe latin slug, lowercase, hyphen-separated
- locale: "ru" or "en"
- frontmatter required fields:
  - title (string)
  - date (YYYY-MM-DD)
  - excerpt (string)
  - tags (string[])
  - lang ("ru" or "en")
  - image (string or null)
  - published (boolean)
- content: markdown/mdx body string
- content must include required sections with markdown headings:
  - `## TL;DR`
  - `## FAQ`
  - `## Key Takeaways`
  - `## Sources`

Execution steps:
1) Build payload.
2) Call API with dryRun=true.
3) If API returns errors, fix payload and retry dryRun.
4) When dryRun succeeds, set dryRun=false and publish.
5) Return:
   - publish status
   - category
   - slug
   - locale
   - path returned by API
   - final page URL: https://www.znn.today/{category}/{slug}
```

## 5) Example curl (manual test)

Dry-run:

```bash
curl -X POST "https://www.znn.today/api/agent/publish" \
  -H "Authorization: Bearer YOUR_AGENT_PUBLISH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category":"articles",
    "slug":"agent-test-post",
    "locale":"ru",
    "dryRun":true,
    "frontmatter":{
      "title":"Тест агент-публикации",
      "date":"2026-05-09",
      "excerpt":"Проверка dryRun",
      "tags":["test","agent"],
      "lang":"ru",
      "image":null,
      "published":true
    },
    "content":"# Тест\n\nПроверка dry-run."
  }'
```

Publish:

```bash
curl -X POST "https://www.znn.today/api/agent/publish" \
  -H "Authorization: Bearer YOUR_AGENT_PUBLISH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category":"articles",
    "slug":"agent-test-post",
    "locale":"ru",
    "dryRun":false,
    "frontmatter":{
      "title":"Тест агент-публикации",
      "date":"2026-05-09",
      "excerpt":"Проверка publish",
      "tags":["test","agent"],
      "lang":"ru",
      "image":null,
      "published":true
    },
    "content":"# Тест\n\nПроверка publish."
  }'
```

## 6) Expected responses

- `200` with `mode: "preview"` -> payload valid.
- `200` with `mode: "publish"` -> content committed to repo.
- `400` with `errors` -> fix payload fields/content.
- `401` -> missing or invalid token.
- `500` -> server-side issue (GitHub token/permissions/env).
