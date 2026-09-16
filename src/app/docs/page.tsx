import type { Metadata } from "next";
import { DocsPageContent } from "@/components/docs/docs-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "API Docs",
  description:
    "How to use MockData fake REST APIs — resources, requests, errors, rate limits, OpenAPI, and shared demo data.",
  path: "/docs",
});

export default function DocsPage() {
  return <DocsPageContent />;
}
