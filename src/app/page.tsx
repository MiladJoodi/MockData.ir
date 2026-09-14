import type { Metadata } from "next";
import { SiteSearch } from "@/components/layout/site-search";
import { CategoryCard } from "@/components/home/category-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  createPageMetadata,
  organizationJsonLd,
  SITE_NAME,
  SITE_TAGLINE,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description:
    "Free fake REST APIs with live JSON for frontend development. Browse Users, Posts, Products, and more — with docs, mock auth, and an in-browser playground.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      <section className="mb-24 flex flex-col items-center text-center">
        <h1 className="text-5xl leading-[0.92] font-semibold tracking-[-0.05em] sm:text-7xl">
          MockData
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground">
          Free fake REST APIs with live JSON. Prototype UIs, test auth, and call
          real endpoints — no backend setup.
        </p>
        <div className="relative z-20 mt-8 w-full max-w-xl">
          <SiteSearch large autofocus />
        </div>
      </section>

      <section id="resources" className="scroll-mt-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Resources
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            Ten live REST APIs with seeded JSON, docs, and examples. Shared demo
            data resets once per day on production.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-5">
          <CategoryCard
            href="/auth"
            title="Auth"
            imageSrc="/placeholders/auth.png"
            imageAlt="Auth API"
          />
          <CategoryCard
            href="/users"
            title="Users"
            imageSrc="/placeholders/users.png"
            imageAlt="Users API"
          />
          <CategoryCard
            href="/posts"
            title="Posts"
            imageSrc="/placeholders/posts.png"
            imageAlt="Posts API"
          />
          <CategoryCard
            href="/comments"
            title="Comments"
            imageSrc="/placeholders/comments.png"
            imageAlt="Comments API"
          />
          <CategoryCard
            href="/albums"
            title="Albums"
            imageSrc="/placeholders/albums.png"
            imageAlt="Albums API"
          />
          <CategoryCard
            href="/photos"
            title="Photos"
            imageSrc="/placeholders/photos.png"
            imageAlt="Photos API"
          />
          <CategoryCard
            href="/todos"
            title="Todos"
            imageSrc="/placeholders/todos.png"
            imageAlt="Todos API"
          />
          <CategoryCard
            href="/products"
            title="Products"
            imageSrc="/placeholders/products.png"
            imageAlt="Products API"
          />
          <CategoryCard
            href="/notifications"
            title="Notifications"
            imageSrc="/placeholders/notifications.png"
            imageAlt="Notifications API"
          />
          <CategoryCard
            href="/countries"
            title="Countries"
            imageSrc="/placeholders/countries.png"
            imageAlt="Countries API"
          />
        </div>
      </section>
    </div>
  );
}
