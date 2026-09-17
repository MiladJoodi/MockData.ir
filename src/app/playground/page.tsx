import type { Metadata } from "next";
import { PlaygroundPageContent } from "@/components/playground/playground-page-content";
import { parsePlaygroundResource } from "@/lib/playground";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "API Playground",
  description:
    "Send live requests to MockData APIs in the browser. Per-resource request state survives SPA navigation.",
  path: "/playground",
});

type PlaygroundPageProps = {
  searchParams: Promise<{ resource?: string | string[] }>;
};

export default async function PlaygroundPage({
  searchParams,
}: PlaygroundPageProps) {
  const params = await searchParams;
  const initialResource = parsePlaygroundResource(params.resource);

  return <PlaygroundPageContent initialResource={initialResource} />;
}
