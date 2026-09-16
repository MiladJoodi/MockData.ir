import type { Metadata } from "next";
import { TemporaryPageContent } from "@/components/temporary/temporary-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Temporary API",
  description:
    "Paste your JSON and build a short-lived API. Treat the link like a password — up to 5 live at a time per browser.",
  path: "/temporary",
});

export default function TemporaryPage() {
  return <TemporaryPageContent />;
}
