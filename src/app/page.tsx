import type { Metadata } from "next";
import { SiteSearch } from "@/components/layout/site-search";
import { CategoryCard } from "@/components/home/category-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MockData",
  description:
    "Fake REST APIs with live JSON. Browse APIs and hit real endpoints.",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <section className="mb-24 flex flex-col items-center text-center">
        <h1 className="text-5xl leading-[0.92] font-semibold tracking-[-0.05em] sm:text-7xl">
          MockData
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground">
          Call endpoints. Get JSON. Test login flows, then wire APIs into your
          UI — with a live playground when you need it.
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
            Ten live REST APIs with seeded JSON. Open any resource for routes,
            examples, and a quick path into the playground.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-5">
          <CategoryCard
            href="/auth"
            title="Auth"
            imageSrc="/placeholders/auth.png"
            imageAlt="Auth"
          />
          <CategoryCard
            href="/users"
            title="Users"
            imageSrc="/placeholders/users.png"
            imageAlt="Users"
          />
          <CategoryCard
            href="/posts"
            title="Posts"
            imageSrc="/placeholders/posts.png"
            imageAlt="Posts"
          />
          <CategoryCard
            href="/comments"
            title="Comments"
            imageSrc="/placeholders/comments.png"
            imageAlt="Comments"
          />
          <CategoryCard
            href="/albums"
            title="Albums"
            imageSrc="/placeholders/albums.png"
            imageAlt="Albums"
          />
          <CategoryCard
            href="/photos"
            title="Photos"
            imageSrc="/placeholders/photos.png"
            imageAlt="Photos"
          />
          <CategoryCard
            href="/todos"
            title="Todos"
            imageSrc="/placeholders/todos.png"
            imageAlt="Todos"
          />
          <CategoryCard
            href="/products"
            title="Products"
            imageSrc="/placeholders/products.png"
            imageAlt="Products"
          />
          <CategoryCard
            href="/notifications"
            title="Notifications"
            imageSrc="/placeholders/notifications.png"
            imageAlt="Notifications"
          />
          <CategoryCard
            href="/countries"
            title="Countries"
            imageSrc="/placeholders/countries.png"
            imageAlt="Countries"
          />
        </div>
      </section>
    </div>
  );
}
