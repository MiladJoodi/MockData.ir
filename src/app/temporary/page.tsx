import type { Metadata } from "next";
import { TemporaryPageContent } from "@/components/temporary/temporary-page-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Temporary API",
  description:
    "Paste your JSON — or publish from the Fake Data Generator — and get a short-lived public REST URL. Up to 5 live APIs per browser.",
  path: "/temporary",
});

export default function TemporaryPage() {
  return <TemporaryPageContent />;
}
