import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/blog/blog-article";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getPublishedPost,
  getRelatedPublishedPostListItems,
  listPublishedPostIds,
} from "@/lib/blog/posts";
import { getServerDictionary, getServerUiLocale } from "@/lib/i18n/server";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  createBlogArticleMetadata,
  createPageMetadata,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const ids = await listPublishedPostIds();
  return ids.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerUiLocale();
  const post = await getPublishedPost(slug, locale);

  if (!post) {
    return createPageMetadata({
      title: "Not found",
      description: "This Blog article is unavailable.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createBlogArticleMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.id}`,
    locale,
    publishedTime: post.date,
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const { locale, dict } = await getServerDictionary();

  const post = await getPublishedPost(slug, locale);
  if (!post) notFound();

  const related = await getRelatedPublishedPostListItems(post.id, 3);

  const articlePath = `/blog/${post.id}`;
  const categoryLabel = dict.blog.categories[post.category];

  return (
    <>
      <JsonLd
        data={[
          blogPostingJsonLd({
            title: post.title,
            description: post.description,
            path: articlePath,
            datePublished: post.date,
            locale,
          }),
          breadcrumbJsonLd([
            { name: dict.common.home, path: "/" },
            { name: dict.blog.title, path: "/blog" },
            {
              name: categoryLabel,
              path: `/blog/category/${post.category}`,
            },
            { name: post.title, path: articlePath },
          ]),
        ]}
      />
      <BlogArticle
        post={post}
        locale={locale}
        related={related}
      />
    </>
  );
}
