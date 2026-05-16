import { getPostsByCategory, type Post, type PostMeta } from '@/lib/getPosts';

const CATEGORIES: Array<'articles' | 'roasts' | 'analytics'> = ['articles', 'roasts', 'analytics'];

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function getRelatedPosts(post: Post, locale: string, limit = 4): PostMeta[] {
  const allPosts = CATEGORIES.flatMap((category) => getPostsByCategory(category, locale));
  const currentTags = new Set((post.tags || []).map(normalizeTag));

  const scored = allPosts
    .filter((item) => !(item.slug === post.slug && item.category === post.category))
    .map((item) => {
      const overlap = (item.tags || [])
        .map(normalizeTag)
        .filter((tag) => currentTags.has(tag)).length;
      const sameCategoryBonus = item.category === post.category ? 2 : 0;
      return { item, score: overlap * 3 + sameCategoryBonus };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.item.date).getTime() - new Date(a.item.date).getTime();
    })
    .map((entry) => entry.item);

  return scored.slice(0, limit);
}
