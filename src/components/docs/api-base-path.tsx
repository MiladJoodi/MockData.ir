"use client";

import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";
import { useApiLocale, withApiLang } from "@/lib/api/use-api-locale";

/** Live API base path — appends ?lang=fa when header FA is selected. */
export function ApiBasePath({ path }: { path: string }) {
  const locale = useApiLocale();
  const href = withApiLang(path, locale);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="rounded-md border border-border bg-muted px-2.5 py-1.5 font-mono text-[12px] text-[var(--request)] underline-offset-2 hover:underline"
      >
        {href}
      </Link>
      <CopyButton value={href} />
    </div>
  );
}
