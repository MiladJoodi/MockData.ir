"use client";

import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";
import { useApiLocale, withApiLang } from "@/lib/api/use-api-locale";

/** Live API base path — appends ?lang=fa when header FA is selected. */
export function ApiBasePath({ path }: { path: string }) {
  const locale = useApiLocale();
  const href = withApiLang(path, locale);

  return (
    <div className="inline-flex max-w-full items-center gap-0.5 rounded-md border border-border bg-muted py-0.5 pr-0.5 pl-2.5">
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="min-w-0 truncate font-mono text-[12px] text-[var(--request)] underline-offset-2 hover:underline"
      >
        {href}
      </Link>
      <CopyButton value={href} className="size-7" />
    </div>
  );
}
