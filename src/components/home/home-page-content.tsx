"use client";

import { SiteSearch } from "@/components/layout/site-search";
import { CategoryCard } from "@/components/home/category-card";
import { JsonLd } from "@/components/seo/json-ld";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import {
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { RESOURCE_PLACEHOLDERS } from "@/lib/resource-images";
import { apiResources } from "@/lib/catalog";
import { HeroTitle } from "@/components/home/hero-title";

export function HomePageContent() {
  const { dict } = useUiLocale();

  return (
    <div className="mx-auto max-w-6xl overflow-x-clip px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={organizationJsonLd()} />

      <section className="mb-24 flex max-w-full flex-col items-center overflow-x-clip text-center">
        <HeroTitle className="max-w-full" />
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-foreground/75 sm:text-[16px] sm:leading-8">
          {dict.home.tagline}
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
          {apiResources.map((resource) => {
            const cat = dict.catalog[resource.id];
            return (
              <CategoryCard
                key={resource.id}
                href={resource.href}
                title={cat?.title ?? resource.title}
                imageSrc={
                  RESOURCE_PLACEHOLDERS[resource.id] ??
                  "/placeholders/users.png"
                }
                imageAlt={cat?.title ?? resource.title}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
