import type { Metadata } from "next";
import { GeneratorPageContent } from "@/components/generator/generator-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Fake Data Generator",
  description:
    "Generate realistic fake JSON for frontend development — pick a type, fields, and quantity, then copy, download, or publish a Temporary API.",
  path: "/generator",
});

export default function GeneratorPage() {
  return <GeneratorPageContent />;
}
