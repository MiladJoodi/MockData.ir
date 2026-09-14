"use client";

import Link from "next/link";
import { CopyButton } from "@/components/docs/copy-button";
import { MethodBadges } from "@/components/docs/method-badges";
import { useApiLocale, withApiLang } from "@/lib/api/use-api-locale";

type EndpointRow = {
  methods: string;
  path: string;
  note?: string;
};

export function EndpointTable({ rows }: { rows: EndpointRow[] }) {
  const locale = useApiLocale();

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {rows.map((row) => {
        const linkable = !row.path.includes(":id");
        const href = withApiLang(row.path, locale);
        return (
          <li
            key={`${row.methods}-${row.path}`}
            className="px-4 py-3 hover:bg-[var(--surface-hover)]"
          >
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <MethodBadges methods={row.methods} />
              {row.note ? (
                <span className="text-[11px] text-muted-foreground">
                  {row.note}
                </span>
              ) : null}
            </div>

            <div className="flex min-w-0 items-center gap-0.5">
              {linkable ? (
                <Link
                  href={href}
                  title={href}
                  className="min-w-0 flex-1 truncate font-mono text-[12px] text-[var(--request)] underline-offset-2 hover:underline"
                  target="_blank"
                >
                  {href}
                </Link>
              ) : (
                <span
                  title={href}
                  className="min-w-0 flex-1 truncate font-mono text-[12px] text-foreground/90"
                >
                  {href}
                </span>
              )}
              <CopyButton value={href} label="Copy endpoint" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
