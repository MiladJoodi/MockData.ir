"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  formatUpdateDate,
  siteUpdates,
  type SiteUpdate,
} from "@/lib/changelog";
import { cn } from "@/lib/utils";

export function DocsWhatsNew() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(item: SiteUpdate) {
    setOpenId((current) => (current === item.id ? null : item.id));
  }

  return (
    <ol className="space-y-3">
      {siteUpdates.map((item, index) => {
        const isLatest = index === 0;
        const isOpen = openId === item.id;

        return (
          <li key={item.id}>
            <div
              className={cn(
                "overflow-hidden rounded-xl border transition-[padding,box-shadow,background-color,border-color] duration-200",
                isOpen
                  ? "border-[var(--request)]/30 bg-card p-5 shadow-sm sm:p-6"
                  : "border-border bg-card p-4 hover:bg-[var(--surface-hover)]",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-foreground">
                      {item.title}
                    </h3>
                    {isLatest ? (
                      <span className="rounded bg-[var(--request-bg)] px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-[var(--request)] uppercase">
                        New
                      </span>
                    ) : null}
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {formatUpdateDate(item.date)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "leading-6",
                      isOpen
                        ? "text-[14px] text-foreground/85"
                        : "text-[13px] text-muted-foreground",
                    )}
                  >
                    {item.summary}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-foreground",
                  )}
                  aria-hidden
                />
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  isOpen
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <ul className="space-y-2 border-t border-border/70 pt-4 text-[13px] leading-6 text-muted-foreground">
                    {item.details.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-[var(--request)]/70"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {item.href ? (
                    <p className="mt-4">
                      <Link
                        href={item.href}
                        className="text-[13px] font-medium text-[var(--request)] underline-offset-2 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.hrefLabel ?? "Learn more"} →
                      </Link>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
