import { BlogArticleHeader } from "@/components/blog/blog-article-header";
import { BlogLocaleRefresh } from "@/components/blog/blog-locale-refresh";
import { BlogMdxContent } from "@/components/blog/blog-mdx";
import { BlogRelatedArticles } from "@/components/blog/blog-related-articles";
import type { BlogPostListItem } from "@/lib/blog/posts";
import type { BlogPost } from "@/lib/blog/types";
import type { UiLocale } from "@/lib/i18n/constants";

export type BlogArticleProps = {
  post: BlogPost;
  locale: UiLocale;
  related: BlogPostListItem[];
};

export async function BlogArticle({
  post,
  locale,
  related,
}: BlogArticleProps) {
  return (
    <article className="mx-auto min-w-0 max-w-3xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12">
      <BlogLocaleRefresh serverLocale={locale} />

      <BlogArticleHeader
        date={post.date}
        contentLocale={locale}
        title={post.title}
        description={post.description}
      />

      <div className="mt-5 border-t border-border/70 pt-5">
        <BlogMdxContent
          source={post.body}
          postId={post.id}
          locale={locale}
        />
      </div>

      {related.length > 0 ? (
        <div className="mt-8 border-t border-border/70 pt-6">
          <BlogRelatedArticles items={related} />
        </div>
      ) : null}
    </article>
  );
}
