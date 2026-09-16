"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { siteUpdates, type SiteUpdate } from "@/lib/changelog";
import { cn } from "@/lib/utils";

export function DocsWhatsNew() {
  const { locale, dict } = useUiLocale();
  const [openId, setOpenId] = useState<string | null>(null);
  const isFa = locale === "fa";

  function toggle(item: SiteUpdate) {
    setOpenId((current) => (current === item.id ? null : item.id));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <ol className="divide-y divide-border">
        {siteUpdates.map((item, index) => {
          const isOpen = openId === item.id;
          const copy = dict.changelog[item.id] ?? {
            title: item.title,
            summary: item.summary,
            details: item.details,
          };
          const num = String(index + 1).padStart(2, "0");

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-[var(--surface-hover)] sm:gap-4 sm:px-5"
              >
                <span
                  className="w-7 shrink-0 font-mono text-[12px] tabular-nums text-muted-foreground"
                  aria-hidden
                >
                  {num}
                </span>
                <h3
                  className={cn(
                    "min-w-0 flex-1 text-[14px] font-medium text-foreground sm:text-[15px]",
                    isFa && "font-fa-label",
                  )}
                >
                  {copy.title}
                </h3>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-foreground",
                  )}
                  aria-hidden
                />
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 border-t border-border/60 bg-muted/20 px-4 py-4 ps-[3.25rem] sm:px-5 sm:ps-[3.75rem]">
                    <ul className="space-y-2 text-[13px] leading-6 text-muted-foreground">
                      {copy.details.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span
                            aria-hidden
                            className="mt-2 size-1 shrink-0 rounded-full bg-[var(--request)]/70"
                          />
                          <span className={cn(isFa && "font-fa-label")}>
                            {line}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {item.href ? (
                      <p>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--request)] underline-offset-2 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className={cn(isFa && "font-fa-label")}>
                            {dict.common.learnMore}
                          </span>
                          <span aria-hidden>{isFa ? "←" : "→"}</span>
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
    </div>
  );
}
