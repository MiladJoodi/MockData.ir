"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useUiLocale } from "@/components/providers/ui-locale-provider";
import { latestUpdateId, siteUpdates } from "@/lib/changelog";
import { formatUiDateShort } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "mockdata-updates-seen";

function readSeenId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeSeenId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function UpdatesMenu() {
  const { locale, dict } = useUiLocale();
  const [open, setOpen] = useState(false);
  const [hasUnseen, setHasUnseen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const isFa = locale === "fa";

  useEffect(() => {
    setHasUnseen(Boolean(latestUpdateId) && readSeenId() !== latestUpdateId);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && latestUpdateId) {
      writeSeenId(latestUpdateId);
      setHasUnseen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className="relative grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
        aria-label={dict.header.whatsNew}
        aria-expanded={open}
        aria-controls={panelId}
        title={dict.header.whatsNew}
      >
        <Bell className="size-4" strokeWidth={1.75} aria-hidden />
        {hasUnseen ? (
          <span
            aria-hidden
            className="absolute top-1.5 end-1.5 flex size-2"
          >
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--request)] opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--request)]" />
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={dict.header.whatsNewTitle}
          className="absolute top-[calc(100%+0.4rem)] end-0 z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="border-b border-border px-3.5 py-2.5">
            <p
              className={cn(
                "text-[13px] font-semibold tracking-tight text-foreground",
                isFa && "font-fa-label",
              )}
            >
              {dict.header.whatsNewTitle}
            </p>
          </div>

          <ul className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
            {siteUpdates.map((item, index) => {
              const isLatest = index === 0;
              const copy = dict.changelog[item.id] ?? {
                title: item.title,
                summary: item.summary,
                details: item.details,
              };
              const line = copy.teaser ?? copy.title;
              const hint = copy.hint;

              const body = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={cn(
                        "min-w-0 text-[13px] leading-snug text-foreground",
                        isLatest ? "font-semibold" : "font-medium",
                        isFa && "font-fa-label",
                      )}
                    >
                      {line}
                    </p>
                    <time
                      dateTime={item.date}
                      className={cn(
                        "shrink-0 text-[11px] text-muted-foreground tabular-nums",
                        isFa ? "font-fa-label" : "font-mono",
                      )}
                    >
                      {formatUiDateShort(item.date, locale)}
                    </time>
                  </div>
                  {hint ? (
                    <div className="mt-1 space-y-0.5">
                      {(() => {
                        const [path, note] = hint.split(/\s*[—–]\s*/, 2);
                        return (
                          <>
                            <p
                              className="font-mono text-[11px] leading-5 text-muted-foreground ltr-tech"
                              dir="ltr"
                            >
                              {path}
                            </p>
                            {note ? (
                              <p
                                className={cn(
                                  "text-[11px] leading-5 text-muted-foreground",
                                  isFa && "font-fa-label",
                                )}
                              >
                                {note}
                              </p>
                            ) : null}
                          </>
                        );
                      })()}
                    </div>
                  ) : null}
                </>
              );

              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block px-3.5 py-2.5 transition-colors hover:bg-[var(--surface-hover)]",
                        isLatest && "bg-[var(--request-bg)]/35",
                      )}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "px-3.5 py-2.5",
                        isLatest && "bg-[var(--request-bg)]/35",
                      )}
                    >
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
