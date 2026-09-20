import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BlogListingView,
  loadBlogListingPage,
} from "@/components/blog/blog-listing-data";
import { JsonLd } from "@/components/seo/json-ld";
import { getServerDictionary } from "@/lib/i18n/server";
import { breadcrumbJsonLd, createBlogListingMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getServerDictionary();
  return createBlogListingMetadata({
    title: dict.blog.title,
    description: dict.blog.description,
    path: "/blog",
    locale,
  });
}

export default async function BlogIndexPage() {
  const { dict } = await getServerDictionary();
  const model = await loadBlogListingPage({ page: 1 });
  if (model === "not-found") notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: "/" },
          { name: dict.blog.title, path: "/blog" },
        ])}
      />
      <BlogListingView {...model} />
    </>
  );
}
