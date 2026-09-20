import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlogListingView,
  loadBlogListingPage,
} from "@/components/blog/blog-listing-data";
import { JsonLd } from "@/components/seo/json-ld";
import {
  BLOG_CATEGORIES,
  isBlogCategory,
} from "@/lib/blog/categories";
import { blogCategoryDescription } from "@/lib/blog/category-seo";
import { blogListingHref } from "@/lib/blog/paths";
import { getServerDictionary } from "@/lib/i18n/server";
import { breadcrumbJsonLd, createBlogListingMetadata, createPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: raw } = await params;
  const { locale, dict } = await getServerDictionary();

  if (!isBlogCategory(raw)) {
    return createPageMetadata({
      title: "Not found",
      description: "This Blog category is unavailable.",
      path: `/blog/category/${raw}`,
      noIndex: true,
    });
  }

  const model = await loadBlogListingPage({ page: 1, category: raw });
  const categoryLabel = dict.blog.categories[raw];
  const empty = model !== "not-found" && model.total === 0;

  return createBlogListingMetadata({
    title: `${dict.blog.title} · ${categoryLabel}`,
    description: blogCategoryDescription(raw, locale),
    path: blogListingHref(1, raw),
    locale,
    noIndex: empty,
  });
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category: raw } = await params;
  if (!isBlogCategory(raw)) notFound();

  const { dict } = await getServerDictionary();
  const model = await loadBlogListingPage({ page: 1, category: raw });
  if (model === "not-found") notFound();

  const path = blogListingHref(1, raw);
  const categoryLabel = dict.blog.categories[raw];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: "/" },
          { name: dict.blog.title, path: "/blog" },
          { name: categoryLabel, path },
        ])}
      />
      <BlogListingView {...model} />
    </>
  );
}
