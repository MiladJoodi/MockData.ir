import type { Metadata } from "next";
import { ApiPlayground } from "@/components/playground/api-playground";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { parsePlaygroundResource } from "@/lib/playground";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "API Playground",
  description:
    "Send live requests to MockData fake REST APIs in the browser — pick a resource, action, headers, and body.",
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 space-y-3">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/", path: "/" },
            { name: "Playground", path: "/playground" },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Playground
        </h1>
        <p className="max-w-xl text-[14px] leading-6 text-muted-foreground">
          Choose a resource and action. Pick a related record when needed —
          path and body fill in automatically. Login · Correct stores the token
          for Me. Changes hit the shared demo database and reset daily in
          production.
        </p>
      </header>

      <ApiPlayground
        key={initialResource}
        initialResource={initialResource}
      />
    </div>
  );
}
