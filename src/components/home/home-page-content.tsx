"use client";

import Link from "next/link";
import { SiteSearch } from "@/components/layout/site-search";
import { CategoryCard } from "@/components/home/category-card";
import { JsonLd } from "@/components/seo/json-ld";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { HeroTitle } from "@/components/home/hero-title";
import { cn } from "@/lib/utils";

export function HomePageContent() {
  const { dict, locale } = useUiLocale();
  const isFa = locale === "fa";

  const cards = [
    { id: "auth", href: "/auth", imageSrc: "/placeholders/auth.png" },
    { id: "users", href: "/users", imageSrc: "/placeholders/users.png" },
    { id: "posts", href: "/posts", imageSrc: "/placeholders/posts.png" },
    { id: "comments", href: "/comments", imageSrc: "/placeholders/comments.png" },
    { id: "albums", href: "/albums", imageSrc: "/placeholders/albums.png" },
    { id: "photos", href: "/photos", imageSrc: "/placeholders/photos.png" },
    { id: "todos", href: "/todos", imageSrc: "/placeholders/todos.png" },
    { id: "products", href: "/products", imageSrc: "/placeholders/products.png" },
    {
      id: "notifications",
      href: "/notifications",
      imageSrc: "/placeholders/notifications.png",
    },
    {
      id: "countries",
      href: "/countries",
      imageSrc: "/placeholders/countries.png",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      <section className="mb-24 flex flex-col items-center text-center">
        <HeroTitle />
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-foreground/75 sm:text-[16px] sm:leading-8">
          {dict.home.tagline}
        </p>
        <p
          className={cn(
            "mt-2 max-w-xl text-[14px] leading-6 text-foreground/75 sm:text-[15px] sm:leading-7",
            isFa && "font-fa-label",
          )}
        >
          <Link
            href="/temporary"
            className="underline-offset-2 hover:text-foreground hover:underline"
          >
            {dict.home.taglineNote}
          </Link>
        </p>
        <div className="relative z-20 mt-8 w-full max-w-xl">
          <SiteSearch large autofocus />
        </div>
      </section>

      <section id="resources" className="scroll-mt-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {dict.home.resourcesTitle}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            {dict.home.resourcesBlurb}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-5">
          {cards.map((card) => {
            const cat = dict.catalog[card.id];
            return (
              <CategoryCard
                key={card.id}
                href={card.href}
                title={cat?.title ?? card.id}
                imageSrc={card.imageSrc}
                imageAlt={cat?.title ?? card.id}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
