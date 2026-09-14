"use client";

import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";
import { useApiLocale, withApiLang } from "@/lib/api/use-api-locale";

export function TryExample({ href }: { href: string }) {
  const locale = useApiLocale();
  const resolved = withApiLang(href, locale);

  return (
    <div className="flex min-w-0 items-center gap-0.5">
      <span className="shrink-0 text-[11px] text-muted-foreground">Try:</span>
      <Link
        href={resolved}
        target="_blank"
        rel="noreferrer"
        title={resolved}
        className="min-w-0 truncate font-mono text-[11px] text-[var(--request)] underline-offset-2 hover:underline"
      >
        {resolved}
      </Link>
      <CopyButton value={resolved} label="Copy example URL" />
    </div>
  );
}
