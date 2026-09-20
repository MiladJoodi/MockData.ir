import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import {
  BlogListingView,
  loadBlogListingPage,
} from "@/components/blog/blog-listing-data";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_PAGE_SIZE } from "@/lib/blog/config";
import { blogListingHref, parseBlogPageParam } from "@/lib/blog/paths";
import {
  listPublishedPostListItems,
  paginatePosts,
} from "@/lib/blog/posts";
import { getServerDictionary } from "@/lib/i18n/server";
import { breadcrumbJsonLd, createBlogListingMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ page: string }>;
};

export async function generateStaticParams() {
  const posts = await listPublishedPostListItems();
  const { totalPages } = paginatePosts(posts, 1, BLOG_PAGE_SIZE);
  const pages: { page: string }[] = [];
  for (let page = 2; page <= totalPages; page += 1) {
    pages.push({ page: String(page) });
  }
  return pages;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page: raw } = await params;
  const page = parseBlogPageParam(raw);
  const { locale, dict } = await getServerDictionary();

  if (page === null || page < 2) {
    return createBlogListingMetadata({
      title: dict.blog.title,
      description: dict.blog.description,
      path: "/blog",
      locale,
      noIndex: true,
    });
  }

  const path = blogListingHref(page);
  return createBlogListingMetadata({
    title: `${dict.blog.title} · ${page}`,
    description: dict.blog.description,
    path,
    locale,
  });
}

export default async function BlogPagedPage({ params }: PageProps) {
  const { page: raw } = await params;
  const page = parseBlogPageParam(raw);
  if (page === null) notFound();
  if (page === 1) redirect("/blog");

  const { dict } = await getServerDictionary();
  const model = await loadBlogListingPage({ page });
  if (model === "not-found") notFound();

  const path = blogListingHref(page);
  const pageLabel = dict.blog.pageStatus
    .replace("{page}", String(model.page))
    .replace("{total}", String(model.totalPages));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: "/" },
          { name: dict.blog.title, path: "/blog" },
          { name: pageLabel, path },
        ])}
      />
      <BlogListingView {...model} />
    </>
  );
}
