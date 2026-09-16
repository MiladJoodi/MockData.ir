import type { Metadata } from "next";
import type { ApiResource } from "@/lib/catalog";

export const SITE_URL = "https://mockdata.ir";
export const SITE_NAME = "MockData";
export const SITE_TAGLINE = "Free Fake REST API";

export const DEFAULT_DESCRIPTION =
  "Free fake REST APIs with live JSON for frontend development. Seeded resources, Temporary API for your own JSON, auth, docs, and an in-browser playground.";

type CreatePageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** When true, use title as absolute (skip layout template). */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noIndex = false,
}: CreatePageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function createResourceMetadata(resource: ApiResource): Metadata {
  const title = `${resource.title} API`;
  const description = `${resource.summary} Live JSON at ${resource.basePath} — try it in the MockData playground.`;

  return createPageMetadata({
    title,
    description,
    path: resource.href,
  });
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  };
}

export function softwareApplicationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "info@mockdata.ir",
  };
}
