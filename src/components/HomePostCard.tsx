import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostMeta } from '@/lib/getPosts';
import { formatDate } from '@/lib/i18n';
import { useRouter } from 'next/router';

interface HomePostCardProps {
  post: PostMeta;
  category: 'roasts' | 'articles' | 'analytics';
}

export default function HomePostCard({ post, category }: HomePostCardProps) {
  const router = useRouter();
  const { locale } = router;

  const categoryLabels = {
    roasts: locale === 'ru' ? 'Разбор' : 'Roast',
    articles: locale === 'ru' ? 'Статья' : 'Article',
    analytics: locale === 'ru' ? 'Аналитика' : 'Analytics',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/${category}/${post.slug}`}>
        <div className="relative bg-white border border-neutral-200 rounded-lg p-6 hover:border-neutral-400 hover:shadow-sm hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group-hover:shadow-lg">
          {/* Category Badge */}
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
              {categoryLabels[category]}
            </span>
            <time className="text-xs text-neutral-500">
              {formatDate(post.date, locale || 'en')}
            </time>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-normal tracking-tight text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors leading-snug">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-sm text-neutral-600 leading-relaxed mb-4 flex-grow">
            {post.excerpt}
          </p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs text-neutral-500 bg-neutral-50"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-neutral-400">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Hover Indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

