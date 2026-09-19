import type { Metadata } from "next";
import { JsonWorkbenchPageContent } from "@/components/json-workbench/json-workbench-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "JSON Workbench",
  description:
    "Format, validate, compare structure, search, and transform JSON in the browser — TypeScript, Zod, YAML, CSV, and utilities on MockData.",
  path: "/json-workbench",
});

export default function JsonWorkbenchPage() {
  return <JsonWorkbenchPageContent />;
}
