import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Page not found",
    description: "This page does not exist on MockData.",
    path: "/404",
    noIndex: true,
  }),
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start px-4 py-24 sm:px-6">
      <p className="font-mono text-[12px] tracking-[0.16em] text-muted-foreground uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
        Page not found
      </h1>
      <p className="mt-3 text-[14px] leading-6 text-muted-foreground">
        That URL is not part of MockData. Head home or browse the docs.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md bg-[var(--request)] px-4 py-2 text-[13px] font-semibold text-black"
        >
          Home
        </Link>
        <Link
          href="/docs"
          className="rounded-md border border-border px-4 py-2 text-[13px] font-medium"
        >
          Docs
        </Link>
      </div>
    </div>
  );
}
