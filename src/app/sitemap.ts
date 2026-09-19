import type { MetadataRoute } from "next";
import { apiResources } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const core = [
    "/",
    "/docs",
    "/playground",
    "/temporary",
    "/generator",
    "/image-generator",
    "/json-workbench",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
  }));

  const resources = apiResources.map((resource) => ({
    url: absoluteUrl(resource.href),
    lastModified,
  }));

  return [...core, ...resources];
}
