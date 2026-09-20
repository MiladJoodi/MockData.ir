import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { createBlogMdxComponents } from "@/components/blog/mdx-components";
import type { UiLocale } from "@/lib/i18n/constants";
import { cn } from "@/lib/utils";

export type BlogMdxContentProps = {
  /** MDX body without frontmatter (from the Blog content loader). */
  source: string;
  /** Post folder id — used to resolve relative asset paths. */
  postId: string;
  locale: UiLocale;
  className?: string;
};

/**
 * Server-side MDX compiler for Blog articles.
 * Reusable for every post: pass body + postId + locale.
 */
export async function BlogMdxContent({
  source,
  postId,
  locale,
  className,
}: BlogMdxContentProps) {
  const components = createBlogMdxComponents({ postId, locale });
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      lang={locale}
      className={cn(
        "blog-mdx min-w-0 text-foreground",
        locale === "fa" && "font-fa-label",
        className,
      )}
    >
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
