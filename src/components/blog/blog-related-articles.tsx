"use client";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import type { BlogPostListItem } from "@/lib/blog/posts";
import { cn } from "@/lib/utils";

export function BlogRelatedArticles({
  items,
}: {
  items: BlogPostListItem[];
}) {
  const { locale, dict } = useUiLocale();
  const isFa = locale === "fa";

  if (items.length === 0) return null;

  return (
    <section className="space-y-4" aria-labelledby="blog-related-heading">
      <h2
        id="blog-related-heading"
        className={cn(
          "text-base font-semibold tracking-[-0.02em] text-foreground sm:text-lg",
          isFa && "font-fa-label tracking-normal",
        )}
      >
        {dict.blog.relatedArticles}
      </h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <BlogPostCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
