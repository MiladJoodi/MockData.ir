import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import {
  BlogListingView,
  loadBlogListingPage,
} from "@/components/blog/blog-listing-data";
import { JsonLd } from "@/components/seo/json-ld";
import {
  BLOG_CATEGORIES,
  isBlogCategory,
  type BlogCategory,
} from "@/lib/blog/categories";
import { blogCategoryDescription } from "@/lib/blog/category-seo";
import { BLOG_PAGE_SIZE } from "@/lib/blog/config";
import { blogListingHref, parseBlogPageParam } from "@/lib/blog/paths";
import {
  listPublishedPostListItemsByCategory,
  paginatePosts,
} from "@/lib/blog/posts";
import { getServerDictionary } from "@/lib/i18n/server";
import { breadcrumbJsonLd, createBlogListingMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ category: string; page: string }>;
};

export async function generateStaticParams() {
  const params: { category: BlogCategory; page: string }[] = [];

  for (const category of BLOG_CATEGORIES) {
    const posts = await listPublishedPostListItemsByCategory(category);
    const { totalPages } = paginatePosts(posts, 1, BLOG_PAGE_SIZE);
    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ category, page: String(page) });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: raw, page: pageRaw } = await params;
  const page = parseBlogPageParam(pageRaw);
  const { locale, dict } = await getServerDictionary();

  if (!isBlogCategory(raw) || page === null || page < 2) {
    return createBlogListingMetadata({
      title: dict.blog.title,
      description: dict.blog.description,
      path: "/blog",
      locale,
      noIndex: true,
    });
  }

  const categoryLabel = dict.blog.categories[raw];
  const path = blogListingHref(page, raw);
  return createBlogListingMetadata({
    title: `${dict.blog.title} · ${categoryLabel} · ${page}`,
    description: blogCategoryDescription(raw, locale),
    path,
    locale,
  });
}

export default async function BlogCategoryPagedPage({ params }: PageProps) {
  const { category: raw, page: pageRaw } = await params;
  if (!isBlogCategory(raw)) notFound();

  const page = parseBlogPageParam(pageRaw);
  if (page === null) notFound();
  if (page === 1) redirect(blogListingHref(1, raw));

  const { dict } = await getServerDictionary();
  const model = await loadBlogListingPage({ page, category: raw });
  if (model === "not-found") notFound();

  const path = blogListingHref(page, raw);
  const categoryLabel = dict.blog.categories[raw];
  const pageLabel = dict.blog.pageStatus
    .replace("{page}", String(model.page))
    .replace("{total}", String(model.totalPages));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: "/" },
          { name: dict.blog.title, path: "/blog" },
          { name: categoryLabel, path: blogListingHref(1, raw) },
          { name: pageLabel, path },
        ])}
      />
      <BlogListingView {...model} />
    </>
  );
}
