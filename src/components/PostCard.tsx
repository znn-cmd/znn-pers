import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostMeta } from '@/lib/getPosts';
import { formatDate } from '@/lib/i18n';
import { useRouter } from 'next/router';

interface PostCardProps {
  post: PostMeta;
  category: 'roasts' | 'articles' | 'analytics';
}

export default function PostCard({ post, category }: PostCardProps) {
  const router = useRouter();
  const { locale } = router;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/${category}/${post.slug}`}>
        <div className="py-8 border-b border-neutral-200 hover:border-neutral-400 transition-colors">
          <time className="text-sm text-neutral-500 mb-2 block">
            {formatDate(post.date, locale || 'en')}
          </time>
          
          <h3 className="text-2xl font-normal tracking-tight mb-3 group-hover:opacity-60 transition-opacity">
            {post.title}
          </h3>
          
          <p className="text-base text-neutral-600 leading-relaxed mb-4">
            {post.excerpt}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-neutral-500 px-3 py-1 bg-neutral-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}


