import type { MetadataRoute } from "next";

import { BLOG_CATEGORIES } from "@/lib/blog/categories";
import { BLOG_PAGE_SIZE } from "@/lib/blog/config";
import { blogListingHref } from "@/lib/blog/paths";
import {
  listPublishedPostListItems,
  listPublishedPostListItemsByCategory,
  paginatePosts,
} from "@/lib/blog/posts";
import { apiResources } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

function postLastModified(date: string): Date {
  const parsed = new Date(`${date}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const core = [
    "/",
    "/docs",
    "/playground",
    "/temporary",
    "/generator",
    "/image-generator",
    "/json",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));

  const resources = apiResources.map((resource) => ({
    url: absoluteUrl(resource.href),
    lastModified,
  }));

  const published = await listPublishedPostListItems();
  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/blog"),
      lastModified:
        published[0] != null
          ? postLastModified(published[0].date)
          : lastModified,
    },
  ];

  const allPaged = paginatePosts(published, 1, BLOG_PAGE_SIZE);
  for (let page = 2; page <= allPaged.totalPages; page += 1) {
    blogEntries.push({
      url: absoluteUrl(blogListingHref(page)),
      lastModified: blogEntries[0]?.lastModified ?? lastModified,
    });
  }

  for (const category of BLOG_CATEGORIES) {
    const posts = await listPublishedPostListItemsByCategory(category);
    if (posts.length === 0) continue;

    const categoryModified = postLastModified(posts[0]!.date);
    blogEntries.push({
      url: absoluteUrl(blogListingHref(1, category)),
      lastModified: categoryModified,
    });

    const { totalPages } = paginatePosts(posts, 1, BLOG_PAGE_SIZE);
    for (let page = 2; page <= totalPages; page += 1) {
      blogEntries.push({
        url: absoluteUrl(blogListingHref(page, category)),
        lastModified: categoryModified,
      });
    }
  }

  for (const post of published) {
    blogEntries.push({
      url: absoluteUrl(`/blog/${post.id}`),
      lastModified: postLastModified(post.date),
    });
  }

  return [...core, ...resources, ...blogEntries];
}
