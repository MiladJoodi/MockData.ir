import type { Metadata } from "next";
import { GeneratorPageContent } from "@/components/generator/generator-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Fake Data Generator",
  description:
    "Generate realistic fake JSON in the browser — people, ecommerce, and more. Choose POST body or API record shape, copy or download, or Create API via Temporary.",
  path: "/generator",
});

export default function GeneratorPage() {
  return <GeneratorPageContent />;
}
