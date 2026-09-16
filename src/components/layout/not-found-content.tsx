"use client";

import Link from "next/link";
import { useUiLocale } from "@/components/providers/ui-locale-provider";

export function NotFoundContent() {
  const { dict } = useUiLocale();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-start px-4 py-24 sm:px-6">
      <p className="font-mono text-[12px] tracking-[0.16em] text-muted-foreground uppercase ltr-tech">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
        {dict.notFound.title}
      </h1>
      <p className="mt-3 text-[14px] leading-6 text-muted-foreground">
        {dict.notFound.body}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md bg-[var(--request)] px-4 py-2 text-[13px] font-semibold text-black"
        >
          {dict.notFound.home}
        </Link>
        <Link
          href="/docs"
          className="rounded-md border border-border px-4 py-2 text-[13px] font-medium"
        >
          {dict.notFound.docs}
        </Link>
      </div>
    </div>
  );
}
