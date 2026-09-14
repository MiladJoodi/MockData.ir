import type { Metadata } from "next";
import Link from "next/link";
import { ApiPlayground } from "@/components/playground/api-playground";
import { parsePlaygroundResource } from "@/lib/playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "Send live requests to MockData — try login, lists, and auth.",
};

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
        <p className="text-[13px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-foreground">Playground</span>
        </p>
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
