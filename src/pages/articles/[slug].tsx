import PostPageTemplate from '@/components/PostPageTemplate';
import { getPostBySlug, getSlugsByCategory, type Post, type PostMeta } from '@/lib/getPosts';
import { getRelatedPosts } from '@/lib/relatedPosts';
import { GetStaticPaths, GetStaticProps } from 'next';
import { type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

interface PostPageProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
  relatedPosts: PostMeta[];
  locale: string;
}

export default function PostPage({ post, mdxSource, locale, relatedPosts }: PostPageProps) {
  return (
    <PostPageTemplate
      post={post}
      mdxSource={mdxSource}
      locale={locale}
      category="articles"
      relatedPosts={relatedPosts}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: Array<{ params: { slug: string }; locale: string }> = [];
  const slugs = getSlugsByCategory('articles');

  for (const locale of locales || ['en', 'ru']) {
    slugs.forEach((slug) => {
      paths.push({
        params: { slug },
        locale,
      });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const currentLocale = locale || 'en';
  
  const post = getPostBySlug('articles', slug, currentLocale);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(post.content, { blockJS: false });
  const relatedPosts = getRelatedPosts(post, currentLocale);

  return {
    props: {
      post,
      mdxSource,
      relatedPosts,
      locale: currentLocale,
    },
  };
};

